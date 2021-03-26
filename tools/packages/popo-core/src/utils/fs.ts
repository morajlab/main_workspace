import fs from 'fs';
import { join, dirname, basename, extname, relative, resolve, sep } from 'path';
import _cmdShim from 'cmd-shim';
import _readCmdShim from 'read-cmd-shim';
import promisify from 'typeable-promisify';
import makeDir from 'make-dir';
import _rimraf from 'rimraf';

const stripExtension = (path: string): string =>
  join(dirname(path), basename(path, extname(path)));

const _symlink = (src: string, dest: string, type: any): Promise<any> =>
  promisify((cb: any) => fs.symlink(src, dest, type, cb));

const createSymbolicLink = async (src: string, dest: string, type: any) => {
  try {
    await lstat(dest);
    await rimraf(dest);
  } catch (err) {
    if (err.code === 'EPERM') throw err;
  }

  await _symlink(src, dest, type);
};

// If not a symlink we default to the actual src file
// https://github.com/npm/npm/blob/d081cc6c8d73f2aa698aab36605377c95e916224/lib/utils/gently-rm.js#L273
const cmdShim = async (src: string, dest: string) => {
  let relativeShimTarget = await readlink(src);

  if (relativeShimTarget) {
    src = resolve(dirname(src), relativeShimTarget);
  }

  return await promisify((cb: any) => _cmdShim(src, stripExtension(dest), cb));
};

const createPosixSymlink = async (origin: any, dest: string, type: any) =>
  await createSymbolicLink(
    relative(dirname(dest), origin),
    dest,
    type === 'exec' ? 'file' : type
  );

const createWindowsSymlink = async (src: string, dest: string, type: any) =>
  type === 'exec'
    ? await cmdShim(src, dest)
    : await createSymbolicLink(src, dest, type);

const readCmdShim = (path: string) =>
  promisify((cb: any) => _readCmdShim(path, cb));

const _readlink = (path: string) =>
  promisify((cb: any) => fs.readlink(path, cb));

export const readFile = (path: string): Promise<string> =>
  promisify((cb: any) => fs.readFile(path, cb));

export const writeFile = (path: string, content: string): Promise<string> =>
  promisify((cb: any) => fs.writeFile(path, content, cb));

export const mkdirp = (path: string): Promise<string> => makeDir(path);

export const rimraf = (path: string): Promise<void> =>
  promisify((cb: any) => _rimraf(path, cb));

export const stat = (path: string): Promise<any> =>
  promisify((cb: any) => fs.stat(path, cb));

export const lstat = (path: string): Promise<any> =>
  promisify((cb: any) => fs.lstat(path, cb));

export const unlink = (path: string): Promise<any> =>
  promisify((cb: any) => fs.unlink(path, cb));

export const realpath = (path: string): Promise<any> =>
  promisify((cb: any) => fs.realpath(path, cb));

export const symlink = async (
  src: string,
  dest: string,
  type: 'exec' | 'junction'
) => {
  if (dest.includes(sep)) {
    await mkdirp(dirname(dest));
  }

  return process.platform === 'win32'
    ? await createWindowsSymlink(src, dest, type)
    : await createPosixSymlink(src, dest, type);
};

export const readdir = async (dir: string) =>
  promisify((cb: any) => fs.readdir(dir, cb));

export const readdirSafe = async (dir: string) =>
  stat(dir)
    .catch((_err: any) => Promise.resolve([]))
    .then((statsOrArray: any) => {
      if (statsOrArray instanceof Array) {
        return statsOrArray;
      } else if (!statsOrArray.isDirectory()) {
        throw new Error(`${dir} is not a directory`);
      }

      return readdir(dir);
    });

// Copied from:
// https://github.com/npm/npm/blob/d081cc6c8d73f2aa698aab36605377c95e916224/lib/utils/gently-rm.js#L280-L297
export const readlink = async (path: string) => {
  if ((await lstat(path)).isSymbolicLink()) {
    return await _readlink(path);
  }

  try {
    return await readCmdShim(path);
  } catch (err) {
    if (err.code !== 'ENOTASHIM' && err.code !== 'EISDIR') {
      throw err;
    }
  }
};

export const dirExists = async (dir: string) => {
  try {
    return (await stat(dir)).isDirectory();
  } catch (err) {
    return false;
  }
};

export const symlinkExists = async (path: string) => {
  try {
    return (await lstat(path)).isSymbolicLink();
  } catch (err) {
    return false;
  }
};
