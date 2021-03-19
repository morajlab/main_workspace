import ciParallelVars from "ci-parallel-vars";

const VARS: any = {
  CI_NODE_TOTAL: ciParallelVars ? ciParallelVars.total : null,
  CI_NODE_INDEX: ciParallelVars ? ciParallelVars.index : null,
};

const OVERRIDES = new Map();

export function get(name: any) {
  return OVERRIDES.has(name) ? OVERRIDES.get(name) : VARS[name];
}

export function __override(name: any, value: any) {
  OVERRIDES.set(name, value);
}

export function __reset() {
  OVERRIDES.clear();
}
