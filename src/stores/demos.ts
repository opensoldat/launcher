import { action, computed, observable, makeObservable } from "mobx";

class DemosStore {
    @observable demoFilesNames: string[];
    @observable isLoading = false;

    constructor() {
        makeObservable(this);
    }

    @computed get gotDemos(): boolean {
        return this.demoFilesNames != null;
    }

    filterDemos(searchTerm: string): string[] {
        if (!this.demoFilesNames) {
            return [];
        }

        return this.demoFilesNames.filter(fileName => {
            return fileName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    @action loadDemos(): void {
        this.isLoading = true;

        window.soldat.demos.listFilesNames()
        .then(
            action(filesNames => {
                this.demoFilesNames = filesNames;
                this.isLoading = false;
            })
        );
    }

    playDemo(fileName: string, onPlaybackFailed: (error: Error) => void): void {
        window.soldat.demos.play(fileName, onPlaybackFailed);
    }
}

export default DemosStore;