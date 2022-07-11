import { action, observable, makeObservable } from "mobx";
import shortid from "shortid";

import { Map } from "src/types";

const defaultMapsNames = ["ctf_Ash"];

class ServerMapsList {
    @observable maps: Map[];

    constructor(mapsNames: string[]) {
        makeObservable(this);
        if (!mapsNames) {
            mapsNames = defaultMapsNames;
        }

        this.maps = mapsNames.map(mapName => {
            return {
                id: shortid.generate(),
                name: mapName
            }
        });
    }

    @action add(mapName: string): Map {
        const newMap: Map = {
            id: shortid.generate(),
            name: mapName
        };

        this.maps.push(newMap);
        return newMap;
    }

    @action clear(): void {
        this.maps.length = 0;
    }

    @action remove(mapId: string): void {
        const index = this.maps.findIndex(map => map.id === mapId);
        this.maps.splice(index, 1);
    }

    get firstMap(): Map {
        if (this.maps.length === 0) {
            return null;
        }
        return this.maps[0];
    }

    get mapsNames(): string[] {
        return this.maps.map(x => x.name);
    }
}

export default ServerMapsList;