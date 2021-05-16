import * as assignSymbols from 'assign-symbols';

export const assign = (target: any, ...args: any) => {
  let i = 0;

  if (isPrimitive(target)) target = args[i++];
  if (!target) target = {};

  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject(target[key]) && isObject(args[i][key])) {
            assign(target[key], args[i][key]);
          } else {
            target[key] = args[i][key];
          }
        }
      }

      assignSymbols(target, args[i]);
    }
  }

  return target;
};

const isObject = (prop: any): boolean =>
  typeof prop === 'function' ||
  Object.prototype.toString.call(prop) === '[object Object]';

const isPrimitive = (prop: any): boolean | null =>
  typeof prop === 'object' ? prop === null : typeof prop !== 'function';

const isValidKey = (key: any): boolean =>
  key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
