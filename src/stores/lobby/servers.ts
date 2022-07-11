import { observable, action, computed, makeObservable } from "mobx";
import { Server, GameModes } from "../../types";
import ServersSortStore from "./sort";
import ServerFiltersStore from "./filters";

type LobbyGameMode = "CTF" | "DM" | "HTF" | "INF" | "PM" | "RM" | "TM";

// Follows structure of response that we get from lobby api.
// https://wiki.soldat.pl/index.php/Lobby_HTTP_API
interface LobbyServer {
    AC: boolean;
    Advanced: boolean;
    BonusFreq: number;
    ConnectionType: number;
    Country: string;
    CurrentMap: string;
    Dedicated: boolean;
    GameStyle: LobbyGameMode;
    IP: string;
    Info: string;
    MaxPlayers: number;
    Name: string;
    NumBots: number;
    NumPlayers: number;
    OS: string;
    Port: number;
    Private: boolean;
    Realistic: boolean;
    Respawn: number;
    Survival: boolean;
    Version: string;
    WM: boolean;
}

class LobbyServersStore {
    @observable servers: Server[] = undefined;
    @observable isFetching = false;

    @observable playersLists: { [key: string]: string[] } = {};
    @observable isFetchingPlayersList: { [key: string]: boolean } = {};

    filtersStore = new ServerFiltersStore();
    sortStore = new ServersSortStore();

    constructor() {
        makeObservable(this);
    }

    @action fetchPlayersList(serverIp: string, serverPort: string): Promise<void> {
        const apiUrl = `https://api.soldat.pl/v0/server/${serverIp}/${serverPort}/players`;
        const serverId = serverIp + serverPort;

        this.isFetchingPlayersList[serverId] = true;
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not retrieve players' list.");
                }
                return response.json();
            })
            .then(
                action(response => {
                    this.playersLists[serverId] = response.Players;
                })
            )
            .catch(
                action(() => {
                    this.playersLists[serverId] = null;
                })
            )
            .finally(
                action(() => {
                    this.isFetchingPlayersList[serverId] = false;
                })
            );
    }

    @action fetchServers(): Promise<void> {
        const lobbyUrl = "https://api.soldat.pl/v0/servers";

        function getGameMode(lobbyGameMode: LobbyGameMode): GameModes {
            switch (lobbyGameMode) {
                case "CTF":
                    return GameModes.CaptureTheFlag;
                case "DM":
                    return GameModes.DeathMatch;
                case "HTF":
                    return GameModes.HoldTheFlag;
                case "INF":
                    return GameModes.Infiltration;
                case "PM":
                    return GameModes.PointMatch;
                case "RM":
                    return GameModes.RamboMatch;
                case "TM":
                    return GameModes.TeamDeathMatch;
            }
        }

        this.servers = [];
        this.isFetching = true;
        return new Promise((resolve, reject) => {
            fetch(lobbyUrl)
            .then(response => {
                if (!response.ok) {
                    reject("Could not retrieve servers' list.");
                }
                return response.json();
            })
            .then((lobbyResponse) => {
                this.servers = lobbyResponse.Servers.map((lobbyServer: LobbyServer) => ({
                    name: lobbyServer.Name,
                    ip: lobbyServer.IP,
                    port: lobbyServer.Port,
                    hasPassword: lobbyServer.Private,

                    numPlayers: lobbyServer.NumPlayers,
                    numBots: lobbyServer.NumBots,
                    maxPlayers: lobbyServer.MaxPlayers,

                    currentMap: lobbyServer.CurrentMap,
                    gameMode: getGameMode(lobbyServer.GameStyle),
                    advance: lobbyServer.Advanced,
                    realistic: lobbyServer.Realistic,
                    survival: lobbyServer.Survival,

                    country: lobbyServer.Country,
                    info: lobbyServer.Info,
                    customWeapons: lobbyServer.WM,
                    version: lobbyServer.Version
                }));
                this.isFetching = false;

                resolve();
            })
            .catch(error => {
                this.isFetching = false;
                this.servers = [];
                console.error(error);
                reject("An error occurred when connecting to lobby.");
            });
        });
    }

    // Applies both filtering and sorting.
    @computed get filteredServers(): Server[] {
        if (this.servers == null) {
            return [];
        }

        return this.servers
            .filter(server => this.filtersStore.filter(server))
            .sort((serverA, serverB) => this.sortStore.sort(serverA, serverB));
    }
}

export default LobbyServersStore;