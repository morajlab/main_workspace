"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("../../utils/ast-utils");
const format_files_1 = require("../../utils/rules/format-files");
const ts = require("typescript");
const name_utils_1 = require("../../utils/name-utils");
function default_1(options) {
    options = normalizeOptions(options);
    return (host, context) => {
        return schematics_1.chain([createPreset(options), format_files_1.formatFiles()])(host, context);
    };
}
exports.default = default_1;
function createPreset(options) {
    if (options.preset === 'empty') {
        return schematics_1.noop();
    }
    else if (options.preset === 'oss') {
        return schematics_1.noop();
    }
    else if (options.preset === 'angular') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/angular', 'application', {
                name: options.name,
                style: options.style,
            }),
            setDefaultCollection('@nrwl/angular'),
        ]);
    }
    else if (options.preset === 'react') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/react', 'application', {
                name: options.name,
                style: options.style,
            }),
            setDefaultCollection('@nrwl/react'),
        ]);
    }
    else if (options.preset === 'next') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/next', 'application', {
                name: options.name,
                style: options.style,
            }),
            setDefaultCollection('@nrwl/next'),
        ]);
    }
    else if (options.preset === 'web-components') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/web', 'application', {
                name: options.name,
                style: options.style,
            }),
            ast_utils_1.addDepsToPackageJson({}, {
                '@ungap/custom-elements': '0.1.6',
            }),
            addPolyfills(`apps/${name_utils_1.toFileName(options.name)}/src/polyfills.ts`, [
                '@ungap/custom-elements',
            ]),
            setDefaultCollection('@nrwl/web'),
        ]);
    }
    else if (options.preset === 'angular-nest') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/angular', 'application', {
                name: options.name,
                style: options.style,
            }),
            schematics_1.externalSchematic('@nrwl/nest', 'application', {
                name: 'api',
                frontendProject: options.name,
            }),
            schematics_1.schematic('library', { name: 'api-interfaces' }, { interactive: false }),
            setDefaultCollection('@nrwl/angular'),
            connectAngularAndNest(options),
        ]);
    }
    else if (options.preset === 'react-express') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/react', 'application', {
                name: options.name,
                style: options.style,
            }),
            schematics_1.externalSchematic('@nrwl/express', 'application', {
                name: 'api',
                frontendProject: options.name,
            }),
            schematics_1.schematic('library', { name: 'api-interfaces' }, { interactive: false }),
            setDefaultCollection('@nrwl/react'),
            connectReactAndExpress(options),
        ]);
    }
    else if (options.preset === 'nest') {
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/nest', 'application', {
                name: options.name,
            }),
            setDefaultCollection('@nrwl/nest'),
        ]);
    }
    else {
        throw new Error(`Invalid preset ${options.preset}`);
    }
}
function connectAngularAndNest(options) {
    const addImportToModule = require('@nrwl/' + 'angular/src/utils/ast-utils')
        .addImportToModule;
    return (host) => {
        host.overwrite('libs/api-interfaces/src/lib/api-interfaces.ts', `export interface Message { message: string }`);
        const modulePath = `apps/${options.name}/src/app/app.module.ts`;
        const moduleFile = ts.createSourceFile(modulePath, host.read(modulePath).toString(), ts.ScriptTarget.Latest, true);
        ast_utils_1.insert(host, modulePath, [
            ast_utils_1.insertImport(moduleFile, modulePath, 'HttpClientModule', `@angular/common/http`),
            ...addImportToModule(moduleFile, `@angular/common/http`, `HttpClientModule`),
        ]);
        const scope = options.npmScope;
        const style = options.style ? options.style : 'css';
        host.overwrite(`apps/${options.name}/src/app/app.component.ts`, `import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@${scope}/api-interfaces';

@Component({
  selector: '${scope}-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.${style}']
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello')
  constructor(private http: HttpClient) {}
}
    `);
        host.overwrite(`apps/${options.name}/src/app/app.component.spec.ts`, `import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
    `);
        host.overwrite(`apps/${options.name}/src/app/app.component.html`, `<div style="text-align:center">
  <h1>Welcome to ${options.name}!</h1>
  <img
    width="450"
    src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"
  />
</div>
<div>Message: {{ (hello$|async)|json }}</div>
    `);
        host.overwrite(`apps/api/src/app/app.controller.ts`, `import { Controller, Get } from '@nestjs/common';

import { Message } from '@${scope}/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }
}
    `);
        host.overwrite(`apps/api/src/app/app.service.ts`, `import { Injectable } from '@nestjs/common';
import { Message } from '@${scope}/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
    `);
    };
}
function connectReactAndExpress(options) {
    return (host) => {
        const scope = options.npmScope;
        host.overwrite('libs/api-interfaces/src/lib/api-interfaces.ts', `export interface Message { message: string }`);
        host.overwrite(`apps/${options.name}/src/app/app.tsx`, `import React, { useEffect, useState } from 'react';
import { Message } from '@${scope}/api-interfaces';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then(r => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to ${options.name}!</h1>
        <img
          width="450"
          src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"
        />
      </div>
      <div>{m.message}</div>
    </>
  );
};

export default App;
    `);
        host.overwrite(`apps/${options.name}/src/app/app.spec.tsx`, `import { cleanup, getByText, render, wait } from '@testing-library/react';
import React from 'react';
import App from './app';

describe('App', () => {
  afterEach(() => {
    delete global['fetch'];
    cleanup();
  });

  it('should render successfully', async () => {
    global['fetch'] = jest.fn().mockResolvedValueOnce({
      json: () => ({
        message: 'my message'
      })
    });

    const { baseElement } = render(<App />);
    await wait(() => getByText(baseElement, 'my message'));
  });
});
    `);
        host.overwrite(`apps/api/src/main.ts`, `import * as express from 'express';
import { Message } from '@${scope}/api-interfaces';

const app = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
    `);
    };
}
function setDefaultCollection(defaultCollection) {
    return ast_utils_1.updateWorkspaceInTree((json) => {
        if (!json.cli) {
            json.cli = {};
        }
        json.cli.defaultCollection = defaultCollection;
        return json;
    });
}
function addPolyfills(polyfillsPath, polyfills) {
    return (host) => {
        const polyfillsSource = host.read(polyfillsPath).toString('utf-8');
        const polyfillsSourceFile = ts.createSourceFile(polyfillsPath, polyfillsSource, ts.ScriptTarget.Latest, true);
        ast_utils_1.insert(host, polyfillsPath, [
            ...ast_utils_1.addGlobal(polyfillsSourceFile, polyfillsPath, `\n${polyfills.map((im) => `import '${im}';`).join('\n')}\n`),
        ]);
    };
}
function normalizeOptions(options) {
    options.name = name_utils_1.toFileName(options.name);
    return options;
}
//# sourceMappingURL=preset.js.map