import { configToFileData, parseConfigFileData, SoldatConfig } from "./parser";

describe("parseConfigFileData", () => {
    test("Parses CVars with whitelisted prefixes", () => {
        const fileData = `
            "cl_player_name" "TestNickname"
            "r_screenwidth" "800"
            "sv_ctf_limit" "15"
            "bots_random_alpha" "4"
        `;

        const result = parseConfigFileData(fileData);

        expect(result.cvars).toHaveProperty("cl_player_name", "TestNickname");
        expect(result.cvars).toHaveProperty("r_screenwidth", "800");
        expect(result.cvars).toHaveProperty("sv_ctf_limit", "15");
        expect(result.cvars).toHaveProperty("bots_random_alpha", "4");
    });

    test("Ignores CVars with unknown prefixes", () => {
        const fileData = `
            "test_some_value" "value"
            "unexpected_prefix" "123"
            "yet_another_one" "test"
        `;

        const result = parseConfigFileData(fileData);

        expect(result.cvars).not.toHaveProperty("test_some_value");
        expect(result.cvars).not.toHaveProperty("unexpected_prefix");
        expect(result.cvars).not.toHaveProperty("yet_another_one");
    });

    test('Parses "bind" commands', () => {
        const fileData = `
            "bind" "ALT+S" "say ""Yeah"""
            "bind" "ALT+CTRL+Keypad 8" "say ""Test"""
        `;

        const result = parseConfigFileData(fileData);

        expect(result.bindings).toHaveLength(2);
        expect(result.bindings).toEqual(expect.arrayContaining([
            expect.objectContaining({
                key: "ALT+S",
                command: 'say "Yeah"'
            }),
            expect.objectContaining({
                key: "ALT+CTRL+Keypad 8",
                command: 'say "Test"'
            })
        ]));
    });
});

describe("configToFileData", () => {
    test("Converts cvars", () => {
        const config: SoldatConfig = {
            bindings: null,
            cvars: {
                "test_cvar": "assigned value",
                "another_cvar": "123"
            }
        };

        const result = configToFileData(config);
        expect(result).toContain('"test_cvar" "assigned value"\r\n');
        expect(result).toContain('"another_cvar" "123"\r\n');
    });

    test("Converts bindings", () => {
        const config: SoldatConfig = {
            bindings: [
                { key: "ALT+Keypad 6", command: 'say "Test"' },
                { key: "CTRL+S", command: 'say "Yeah"' }
            ],
            cvars: null
        };

        const result = configToFileData(config);
        expect(result).toContain("\r\n");
        expect(result).toContain('"bind" "ALT+Keypad 6" "say ""Test"""\r\n');
        expect(result).toContain('"bind" "CTRL+S" "say ""Yeah"""\r\n');
    });
});
