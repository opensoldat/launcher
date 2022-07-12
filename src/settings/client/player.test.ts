import { PlayerConfig } from "src/api/soldat/configs/types";
import PlayerSettings from "./player"

describe("Constructor", () => {
    test("Sets default settings when config is not provided", () => {
        const playerSettings = new PlayerSettings();

        expect(playerSettings.nickname).toEqual("Major");
        expect(playerSettings.hairStyle).toBeDefined();
    });

    test("Sets default settings for properties that are missing in config", () => {
        const config = {
            cvars: {
                cl_player_name: "Test"
            }
        } as PlayerConfig;
        const playerSettings = new PlayerSettings(config);

        expect(playerSettings.nickname).toEqual("Test");
        expect(playerSettings.hairStyle).toBeDefined();
    });
})