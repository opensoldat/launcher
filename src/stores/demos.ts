import { action, computed, observable } from "mobx";

class DemosStore {
    @observable demoFileNames: string[];
    @observable isLoading = false;

    @computed get gotDemos(): boolean {
        return this.demoFileNames != null;
    }

    filterDemos(searchTerm: string): string[] {
        if (!this.demoFileNames) {
            return [];
        }

        return this.demoFileNames.filter(fileName => {
            return fileName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    @action loadDemos(): void {
        this.isLoading = true;

        window.soldat.demos.loadFileNames()
        .then(
            action(fileNames => {
                this.demoFileNames = fileNames;
                this.isLoading = false;
            })
        );
    }

    playDemo(fileName: string, onPlaybackFailed: (error: Error) => void): void {
        window.soldat.demos.play(fileName, onPlaybackFailed);
    }
}

export default DemosStore;