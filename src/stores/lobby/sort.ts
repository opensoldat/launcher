import { observable, action, makeObservable } from "mobx";
import { Server, GameModes } from "../../types";

class ServersSortStore {
    @observable columnName = "Players";
    @observable isDescending = true;

    constructor() {
        makeObservable(this);
    }

    @action applySort(columnName: string): void {
        // Just toggle the order of sorting if user tries to apply
        // sort on a column that is already being sorted.
        if (this.columnName === columnName) {
            this.isDescending = !this.isDescending;
            return;
        }

        this.columnName = columnName;
        // When sorting by players, we want to start with descending order.
        this.isDescending = columnName === "Players" ? true : false
    }

    sort(serverA: Server, serverB: Server): number {
        // This comparator should be enough for handling most scenarios.
        const stringComparator = (a: string, b: string): number => {
            const upperA = a.toUpperCase();
            const upperB = b.toUpperCase();
            if (upperA < upperB) {
                return -1;
            } else if (upperA > upperB) {
                return 1;
            }
            return 0;
        }

        let ascendingResult: number;
        switch (this.columnName) {
            case "ServerName":
                ascendingResult = stringComparator(serverA.name, serverB.name);
                break;
            
            case "Players":
                ascendingResult = serverA.numPlayers - serverB.numPlayers;
                if (ascendingResult === 0) {
                    ascendingResult = serverA.numBots - serverB.numBots;
                    if (ascendingResult === 0) {
                        ascendingResult = serverA.maxPlayers - serverB.maxPlayers;
                    }
                }
                break;
            
            case "Map":
                ascendingResult = stringComparator(serverA.currentMap, serverB.currentMap);
                break;
            
            case "GameMode":
                ascendingResult = stringComparator(GameModes[serverA.gameMode], GameModes[serverB.gameMode]);
                break;
            
            case "IP":
                ascendingResult = stringComparator(serverA.ip, serverB.ip);
                break;
            
            case "Port":
                ascendingResult = serverA.port - serverB.port;
                break;

            default:
                ascendingResult = 0;
        }

        return this.isDescending ? -ascendingResult : ascendingResult;
    }
}

export default ServersSortStore;