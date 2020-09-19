import { KeyBinding } from "src/types";
import { addQuotes, splitQuotedStrings } from "./quoteUtils";

type ConfigKeyBinding = Pick<KeyBinding, "key" | "command">;

interface SoldatConfig {
    bindings: ConfigKeyBinding[];
    cvars: {
        [key: string]: string;
    };
}

const configToFileData = (config: SoldatConfig): string => {
    let result = "";

    if (config.cvars) {
        for (const [key, value] of Object.entries(config.cvars)) {
            result += addQuotes(key) + " " + addQuotes(value) + "\r\n";
        }
    }

    if (config.bindings) {
        config.bindings.forEach(binding => {
            result += '"bind" ' + addQuotes(binding.key) + " " + addQuotes(binding.command) + "\r\n";
        });
    }

    return result;
}

const parseConfigFileData = (data: string): SoldatConfig => {
    const lines = data.split(/\r?\n/);
    const config: SoldatConfig = {
        bindings: [],
        cvars: {}
    };

    lines.forEach((line: string) => {
        const substrings = splitQuotedStrings(line);
        if (substrings.length <= 1) {
            return;
        }

        if (substrings[0] === "bind") {
            if (substrings.length <= 2) {
                return;
            }

            const binding: ConfigKeyBinding = {
                key: substrings[1],
                command: substrings[2]
            };
            config.bindings.push(binding);
        } else {
            // We ignore settings that don't start with expected prefixes.
            const whitelistedPrefixes = ["bots_", "cl_", "r_", "sv_"];
            let allow = false;
            whitelistedPrefixes.forEach((prefix) => {
                if (substrings[0].startsWith(prefix)) {
                    allow = true;
                    return;
                }
            });

            if (!allow) {
                return;
            }
            config.cvars[substrings[0]] = substrings[1];
        }
    });

    return config;
};

export { configToFileData, parseConfigFileData, SoldatConfig };
