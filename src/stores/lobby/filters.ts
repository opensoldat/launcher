import { observable, computed, makeObservable } from "mobx";
import { Server, GameModes } from "../../types";

export enum PlayersFilterOptions {
    Any,
    NotEmpty,
    NotFull,
    NotEmptyAndNotFull
}

export enum GameModeFilterOptions {
    Any,
    CaptureTheFlag,
    DeathMatch,
    HoldTheFlag,
    Infiltration,
    PointMatch,
    RamboMatch,
    TeamDeathMatch
}

export enum GameStyleFilterOptions {
    Any,
    Advance,
    Realistic,
    Survival
}

class ServerFiltersStore {
    @observable quickSearch = "";
    @observable players: PlayersFilterOptions;
    // Maybe we could allow multiple choices for mode
    // and style, but it doesn't seem critical.
    @observable gameMode: GameModeFilterOptions;
    @observable gameStyle: GameStyleFilterOptions;
    @observable noBots: boolean;
    @observable noPassword: boolean;

    defaultFilters = {
        players: PlayersFilterOptions.Any,
        gameMode: GameModeFilterOptions.Any,
        gameStyle: GameStyleFilterOptions.Any,
        noBots: false,
        noPassword: false
    };

    constructor() {
        makeObservable(this);
        this.setDefaultFilters();
    }

    @computed get activeFiltersCount(): number {
        let result = 0;

        if (this.players !== this.defaultFilters.players) {
            ++result;
        }
        if (this.gameMode !== this.defaultFilters.gameMode) {
            ++result;
        }
        if (this.gameStyle !== this.defaultFilters.gameStyle) {
            ++result;
        }
        if (this.noBots !== this.defaultFilters.noBots) {
            ++result;
        }
        if (this.noPassword !== this.defaultFilters.noPassword) {
            ++result;
        }

        return result;
    }

    filter(server: Server): boolean {
        const quickSearch = this.quickSearch.toLowerCase();
        if (quickSearch && quickSearch.length > 0 &&
            !server.name.toLowerCase().includes(quickSearch) &&
            !server.ip.toLowerCase().includes(quickSearch) &&
            !server.currentMap.toLowerCase().includes(quickSearch)) {
            return false;
        }

        if (this.players) {
            // Not sure if we should consider bots too...
            if (this.players === PlayersFilterOptions.NotEmpty &&
                (server.numPlayers + server.numBots) === 0) {
                return false;
            }

            if (this.players === PlayersFilterOptions.NotFull &&
                server.numPlayers === server.maxPlayers) {
                return false;
            }

            if (this.players === PlayersFilterOptions.NotEmptyAndNotFull &&
                (server.numPlayers === server.maxPlayers || (server.numPlayers + server.numBots) === 0)) {
                return false;
            }
        }

        if (this.gameMode) {
            if ((this.gameMode === GameModeFilterOptions.CaptureTheFlag && server.gameMode !== GameModes.CaptureTheFlag) ||
                (this.gameMode === GameModeFilterOptions.DeathMatch && server.gameMode !== GameModes.DeathMatch) ||
                (this.gameMode === GameModeFilterOptions.HoldTheFlag && server.gameMode !== GameModes.HoldTheFlag) ||
                (this.gameMode === GameModeFilterOptions.Infiltration && server.gameMode !== GameModes.Infiltration) ||
                (this.gameMode === GameModeFilterOptions.PointMatch && server.gameMode !== GameModes.PointMatch) ||
                (this.gameMode === GameModeFilterOptions.RamboMatch && server.gameMode !== GameModes.RamboMatch) ||
                (this.gameMode === GameModeFilterOptions.TeamDeathMatch && server.gameMode !== GameModes.TeamDeathMatch)) {
                return false;
            }
        }

        if (this.gameStyle) {
            if ((this.gameStyle === GameStyleFilterOptions.Advance && !server.advance) ||
                (this.gameStyle === GameStyleFilterOptions.Realistic && !server.realistic) ||
                (this.gameStyle === GameStyleFilterOptions.Survival && !server.survival)) {
                return false;
            }
        }

        if (this.noPassword && server.hasPassword) {
            return false;
        }

        if (this.noBots && server.numBots > 0) {
            return false;
        }

        return true;
    }

    setDefaultFilters(): void {
        this.players = this.defaultFilters.players;
        this.gameMode = this.defaultFilters.gameMode;
        this.gameStyle = this.defaultFilters.gameStyle;
        this.noBots = this.defaultFilters.noBots;
        this.noPassword = this.defaultFilters.noPassword;
    }
}

export default ServerFiltersStore;