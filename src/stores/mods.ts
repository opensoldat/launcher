import { action, computed, observable } from "mobx";
import { SelectOption } from "src/types";

class ModsStore {
    @observable modNames: string[];
    @observable isLoading = false;
    @computed get gotMods(): boolean {
        return this.modNames != null;
    }

    @action loadMods(): void {
        this.isLoading = true;

        window.soldat.mods.loadArchiveNames()
        .then(
            action(archiveNames => {
                archiveNames.sort();
                this.modNames = archiveNames;
                this.isLoading = false;
            })
        );
    }

    @computed get selectOptions(): SelectOption[] {
        return [
            { value: "", label: "None" }
        ].concat(this.modNames.map(name => {
            return {
                value: name,
                label: name
            };
        }));
    }
}

export default ModsStore;