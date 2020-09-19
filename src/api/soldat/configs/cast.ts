import { HexColor } from "src/types";

// Just a set of wrappers for the sake of not repeating the same
// validations when mapping configs to settings, and vice versa.

type AllowedTypes = string | number | boolean;

// The type of defaultValue determines the output.
const castFromString = (value: string, defaultValue: AllowedTypes): AllowedTypes => {
    if (value == null) {
        return defaultValue;
    }

    if (typeof defaultValue === "string") {
        return value;
    } else if (typeof defaultValue === "number") {
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    } else if (typeof defaultValue === "boolean") {
        const num = Number(value);
        if (isNaN(num)) {
            return defaultValue;
        } else {
            return num === 1;
        }
    }

    return defaultValue;
}

// The type of "value" argument determines the output.
const castToString = (value: AllowedTypes, defaultValue: AllowedTypes = ""): string => {
    if (value == null) {
        return castToString(defaultValue);
    }

    if (typeof value === "string") {
        return value;
    } else if (typeof value === "number") {
        if (isNaN(value)) {
            return castToString(defaultValue);
        } else {
            return value.toString();
        }
    } else if (typeof value === "boolean") {
        return value ? "1" : "0";
    }

    return castToString(defaultValue);
}

type SoldatColor = string;
enum SoldatColorFormats {
    ARGB,
    ABGR
}

// Returns defaultColor if input color is malformed.
// Input string should follow this format: $AARRGGBB or $AABBGGRR.
// Returned string follows this format: #RRGGBB.
const soldatColorToHex = (
    color: SoldatColor,
    defaultColor: HexColor,
    format = SoldatColorFormats.ARGB
): HexColor => {
    if (!color || color.length !== 9) {
        return defaultColor;
    }

    if (color[0] !== "$") {
        return defaultColor;
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

    return defaultColor;
};

// #RRGGBB => $AARRGGBB or $AABBGGRR
const hexColorToSoldat = (
    color: HexColor,
    defaultColor: SoldatColor = "",
    format: SoldatColorFormats = SoldatColorFormats.ARGB
): SoldatColor => {
    if (!color || color.length !== 7) {
        return defaultColor;
    }

    if (color[0] !== "#") {
        return defaultColor;
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

    return defaultColor;
};

export {
    castFromString,
    castToString,
    hexColorToSoldat,
    soldatColorToHex,
    SoldatColorFormats
};