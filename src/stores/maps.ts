import { action, computed, observable, makeObservable } from "mobx";
import shortid from "shortid";

import { Map } from "../types";

class MapsStore {
    /* Maps can come from 2 places
     * 1) Archive files with .smap extension in maps folder (regardless of local mount)
     * 2) Default maps. When local mount is disabled, those will come from soldat.smod.
     * When local mount is enabled, instead, we expect default maps' .pms files to be
     * in maps directory (i.e. user should have extracted soldat.smod).
     * 
     * TODO: When local mount is enabled, technically we should list all files with
     * .pms extension in maps directory to make sure that default maps are still
     * present (user could have deleted them, but he'd still see them in the list
     * because of our hardcoded default maps; however, user would not be able to
     * start a local game this way).
     * With this approach we should make sure that we only look for default maps'
     * names with .pms extension, as other maps will not work (server only works with
     * maps in soldat.smod, or with .smaps in maps directory - in other words,
     * server doesn't support local mount).
     * Or am I wrong, and server could technically support other .pms files from
     * maps directory too? Not sure if serving files would still work.
     */
    readonly defaultMapsNames = [
        "Aero", "Airpirates", "Arena", "Arena2", "Arena3", "Bigfalls", "Blox",
        "Bridge", "Bunker", "Cambodia", "CrackedBoot", "ctf_Ash", "ctf_B2b",
        "ctf_Blade", "ctf_Campeche", "ctf_Cobra", "ctf_Crucifix", "ctf_Death",
        "ctf_Division", "ctf_Dropdown", "ctf_Equinox", "ctf_Guardian", "ctf_Hormone",
        "ctf_IceBeam", "ctf_Kampf", "ctf_Lanubya", "ctf_Laos", "ctf_Maya",
        "ctf_Mayapan", "ctf_MFM", "ctf_Nuubia", "ctf_Raspberry", "ctf_Rotten",
        "ctf_Ruins", "ctf_Run", "ctf_Scorpion", "ctf_Snakebite", "ctf_Steel",
        "ctf_Triumph", "ctf_Viet", "ctf_Voland", "ctf_Wretch", "ctf_X", "Daybreak",
        "DesertWind", "Factory", "Flashback", "HH", "htf_Arch", "htf_Baire",
        "htf_Boxed", "htf_Desert", "htf_Dorothy", "htf_Dusk", "htf_Erbium",
        "htf_Feast", "htf_Mossy", "htf_Muygen", "htf_Niall", "htf_Nuclear",
        "htf_Prison", "htf_Rubik", "htf_Star", "htf_Tower", "htf_Void", "htf_Vortex",
        "htf_Zajacz", "inf_Abel", "inf_April", "inf_Argy", "inf_Belltower",
        "inf_Biologic", "inf_Changeling", "inf_Flute", "inf_Fortress", "inf_Industrial",
        "inf_Messner", "inf_Moonshine", "inf_Motheaten", "inf_Outpost", "inf_Rescue",
        "inf_Rise", "inf_Warehouse", "inf_Warlock", "Island2k5", "Jungle", "Krab",
        "Lagrange", "Leaf", "MrSnowman", "RatCave", "Rok", "RR", "Shau", "Tropiccave",
        "Unlim", "Veoto"
    ];
    @observable mapArchivesNames: string[];
    @observable isLoading = false;

    constructor() {
        makeObservable(this);
    }

    @computed get availableMaps(): Map[] {
        return this.defaultMapsNames
            .concat(this.mapArchivesNames || [])
            .sort((a, b) => a.localeCompare(b))
            .map(mapName => {
                return {
                    id: shortid.generate(),
                    name: mapName
                }
            })
    }

    filterMaps(searchTerm: string): Map[] {
        return this.availableMaps.filter(map => {
            return map.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
    }

    @computed get gotMaps(): boolean {
        return this.mapArchivesNames != null;
    }

    @action loadMaps(): void {
        this.isLoading = true;

        window.soldat.maps.listArchivesNames()
        .then(
            action(archivesNames => {
                this.mapArchivesNames = archivesNames;
                this.isLoading = false;
            })
        );
    }
}

export default MapsStore;