import { Change } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';
import { SchematicContext } from '@angular-devkit/schematics';
export declare function findMainRenderStatement(source: ts.SourceFile): ts.CallExpression | null;
export declare function findDefaultExport(source: ts.SourceFile): ts.Node | null;
export declare function findDefaultExportDeclaration(source: ts.SourceFile): ts.Node | null;
export declare function findDefaultExportIdentifier(source: ts.SourceFile): ts.Identifier | null;
export declare function findDefaultClassOrFunction(source: ts.SourceFile): ts.FunctionDeclaration | ts.ClassDeclaration | null;
export declare function findComponentImportPath(componentName: string, source: ts.SourceFile): string;
export declare function findElements(source: ts.SourceFile, tagName: string): ts.Node[];
export declare function findClosestOpening(tagName: string, node: ts.Node): any;
export declare function isTag(tagName: string, node: ts.Node): boolean;
export declare function addInitialRoutes(sourcePath: string, source: ts.SourceFile, context: SchematicContext): Change[];
export declare function addRoute(sourcePath: string, source: ts.SourceFile, options: {
    routePath: string;
    componentName: string;
    moduleName: string;
}, context: SchematicContext): Change[];
export declare function addBrowserRouter(sourcePath: string, source: ts.SourceFile, context: SchematicContext): Change[];
export declare function addReduxStoreToMain(sourcePath: string, source: ts.SourceFile, context: SchematicContext): Change[];
export declare function updateReduxStore(sourcePath: string, source: ts.SourceFile, context: SchematicContext, feature: {
    keyName: string;
    reducerName: string;
    modulePath: string;
}): Change[];
export declare function getComponentName(sourceFile: ts.SourceFile): ts.Node | null;
export declare function getComponentPropsInterface(sourceFile: ts.SourceFile): ts.InterfaceDeclaration | null;
