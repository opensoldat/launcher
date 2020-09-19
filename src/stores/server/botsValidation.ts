import { computed } from "mobx";
import { GameModes } from "../../types";
import ServerSettingsStore from "./settings";

class BotsValidationStore {
    private serverSettingsStore: ServerSettingsStore;

    // Passing references to stores seems like a common approach in MobX
    // when it comes to sharing data between multiple stores.
    constructor(serverSettingsStore: ServerSettingsStore) {
        this.serverSettingsStore = serverSettingsStore;
    }

    @computed get countError(): string {
        const botsCount = this.countBots();

        if (botsCount > 30) {
            return "Too many bots. At most 30 bots are allowed.";
        }

        return null;
    }

    private countBots(): number {
        const gameMode = this.serverSettingsStore.settings.gameplay.mode;
        const botsSettings = this.serverSettingsStore.settings.bots;
        if (gameMode === GameModes.DeathMatch ||
            gameMode === GameModes.PointMatch ||
            gameMode === GameModes.RamboMatch) {
            return botsSettings.noTeam;
        }
        
        if (gameMode === GameModes.CaptureTheFlag ||
            gameMode === GameModes.HoldTheFlag || 
            gameMode === GameModes.Infiltration) {
            return botsSettings.alpha + botsSettings.bravo;
        }

        return botsSettings.alpha +
            botsSettings.bravo +
            botsSettings.charlie +
            botsSettings.delta;
    }
}

export default BotsValidationStore;