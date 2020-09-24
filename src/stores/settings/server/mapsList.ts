import { action, observable } from "mobx";
import ServerMapsList from "src/settings/server/mapsList";

class ServerMapsListStore {
    @observable serverMapsList: ServerMapsList;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadMapsList(): void {
        this.isLoading = true;

        window.soldat.server.loadMapsList()
            .then(
                action(mapsNames => {
                    this.serverMapsList = new ServerMapsList(mapsNames);
                    this.isLoading = false;
                })
            );
    }

    @action saveMapsList(): Promise<void> {
        this.isSaving = true;

        return window.soldat.server.saveMapsList(this.serverMapsList.mapsNames)
            .finally(
                action(() => this.isSaving = false)
            )
    }
}

export default ServerMapsListStore;