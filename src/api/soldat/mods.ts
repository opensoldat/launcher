import fs from "fs";
import { soldatPaths } from "./paths";

const loadArchiveNames = function(): Promise<string[]> {
    const archiveFileExtension = ".smod";

    return fs.promises.readdir(soldatPaths.modsDirectory, { withFileTypes: true })
        .then(entries => {
            return entries
                .filter(entry => {
                    return entry.isFile() && entry.name.endsWith(archiveFileExtension);
                })
                .map(entry => entry.name.slice(0, -archiveFileExtension.length));
        })
        .catch(() => {
            return [];
        });
};

export { loadArchiveNames };