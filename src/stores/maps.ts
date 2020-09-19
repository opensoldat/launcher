import { action } from "mobx";
import { computedFn } from "mobx-utils";
import shortid from "shortid";

import { Map } from "../types";

class MapsStore {
    maps: Map[];

    /* TODO: list of all maps should be loaded from disk.
     * Not sure yet how to achieve this in a reasonable way with current
     * .smod/.smap bundles....
     */
    private allMapsNames = [
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
    ].sort();

    @action loadMaps = (): void => {
        this.maps = this.allMapsNames.map(mapName => ({
            id: shortid.generate(),
            name: mapName
        }));
    }

    getMapsByName = computedFn(function filterMapsByName(this: MapsStore, searchFilter: string): Map[] {
        return this.maps.filter(map => map.name.toLowerCase().includes(searchFilter.toLowerCase()));
    }, true);
}

export default MapsStore;