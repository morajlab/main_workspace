import multimatch from "multimatch";
import globby from "globby";

function matchGlobs(paths: string[], patterns: string[]) {
  return multimatch(paths, patterns);
}

function findGlobs(cwd: string, patterns: string[]) {
  return globby(patterns, { cwd });
}

export function matchWorkspaces(paths: string[], patterns: string[]) {
  return matchGlobs(paths, patterns);
}

export function findWorkspaces(cwd: string, patterns: string[]) {
  return findGlobs(cwd, patterns);
} /*

export function matchOnlyAndIgnore(
  paths: Array<string>,
  only: string | void,
  ignore: string | void
) {
  let onlyPattern = only || '**';
  let ignorePattern = ignore ? `!${ignore}` : '';
  return matchGlobs(paths, [onlyPattern, ignorePattern]);
}*/
