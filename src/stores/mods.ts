import { action, computed, observable, makeObservable } from "mobx";
import { SelectOption } from "src/types";

class ModsStore {
    // Custom mods come from only one place, regardless of local mount option:
    // archive files with .smod extension in mods directory.
    @observable modsNames: string[];
    @observable isLoading = false;

    constructor() {
        makeObservable(this);
    }

    @computed get gotMods(): boolean {
        return this.modsNames != null;
    }

    @action loadMods(): void {
        this.isLoading = true;

        window.soldat.mods.listArchivesNames()
        .then(
            action(archivesNames => {
                archivesNames.sort();
                this.modsNames = archivesNames;
                this.isLoading = false;
            })
        );
    }

    @computed get selectOptions(): SelectOption[] {
        return [
            { value: "", label: "None" }
        ].concat(this.modsNames.map(name => {
            return {
                value: name,
                label: name
            };
        }));
    }
}

export default ModsStore;