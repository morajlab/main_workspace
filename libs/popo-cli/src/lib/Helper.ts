import { dirname } from "path";
import Config from "./Config";

export const getPackageStack = async (cwd: string) => {
  let stack = [];
  let searching: null | string = cwd;

  while (searching) {
    let filePath = await Config.findConfigFile(searching);

    if (filePath) {
      let config = await Config.init(filePath);
      stack.unshift({ filePath, config });
      searching = dirname(dirname(filePath));
    } else {
      searching = null;
    }
  }

  return stack;
}

export const toArrayOfStrings = (value: JSONValue, message: string) => {
  if (!Array.isArray(value)) {
    throw new BoltError(message);
  }

  return value.map(item => {
    if (typeof item !== 'string') {
      throw new BoltError(message);
    } else {
      return item;
    }
  });
}

function toObject(value: JSONValue, message: string) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new BoltError(message);
  } else {
    return value;
  }
}

function toObjectOfStrings(value: JSONValue, message: string) {
  let safeRef = toObject(value, message);
  let safeCopy = {};

  Object.keys(safeRef).forEach(k => {
    if (typeof safeRef[k] !== 'string') {
      throw new BoltError(message);
    } else {
      safeCopy[k] = safeRef[k];
    }
  });

  return safeCopy;
}
