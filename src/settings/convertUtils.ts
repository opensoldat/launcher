// This file provides utils for converting
// configs to settings and vice versa.

import { HexColor } from "src/types";

const toNumber = (str: string): number => {
  if (str == null) {
    return undefined;
  }

  const num = Number(str);
  if (isNaN(num)) {
    return undefined;
  }

  return num;
};

const toBool = (str: string): boolean => {
  const num = toNumber(str);
  if (num === undefined) {
    return undefined;
  }
  return num !== 0;
};

type SoldatColor = string;
enum SoldatColorFormats {
  ARGB,
  ABGR,
}

// Converts soldat color to hex format.
// Returns undefined if color is not in the correct format.
const toHexColor = (
  color: SoldatColor,
  format = SoldatColorFormats.ARGB
): HexColor => {
  if (!color || color.length !== 9) {
    return undefined;
  }

  if (color[0] !== "$") {
    return undefined;
  }

  const hexColorRegexp = /[0-9A-Fa-f]{8}/g;
  if (hexColorRegexp.test(color)) {
    let result = "#";
    if (format === SoldatColorFormats.ARGB) {
      result += color.substring(3);
    } else if (format === SoldatColorFormats.ABGR) {
      result += color.substring(7, 9);
      result += color.substring(5, 7);
      result += color.substring(3, 5);
    }
    return result;
  }

  return undefined;
};

// #RRGGBB => $AARRGGBB or $AABBGGRR
const toSoldatColor = (
  color: HexColor,
  format: SoldatColorFormats = SoldatColorFormats.ARGB
): SoldatColor => {
  if (!color || color.length !== 7) {
    return undefined;
  }

  if (color[0] !== "#") {
    return undefined;
  }

  const hexColorRegexp = /[0-9A-Fa-f]{6}/g;
  if (hexColorRegexp.test(color)) {
    // Alpha values are ignored by Soldat anyway.
    let result = "$00";
    if (format === SoldatColorFormats.ARGB) {
      result += color.substring(1);
    } else if (format === SoldatColorFormats.ABGR) {
      result += color.substring(5, 7);
      result += color.substring(3, 5);
      result += color.substring(1, 3);
    }
    return result;
  }

  return undefined;
};

// The type of "value" argument determines the output.
const toString = (
  value: string | boolean | number,
  defaultValue = ""
): string => {
  if (value == null) {
    return defaultValue;
  }

  if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    if (isNaN(value)) {
      return defaultValue;
    } else {
      return value.toString();
    }
  } else if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return defaultValue;
};

export {
  SoldatColorFormats,
  toBool,
  toHexColor,
  toNumber,
  toSoldatColor,
  toString,
};
