import fs from "fs";
import { soldatPaths } from "../paths";

/* Interfaces can come from 3 places:
 * 1) Archive files with .sint extension in custom-interfaces directory.
 * 2) Subdirectories in custom-interfaces directory (when local mount is enabled).
 * 3) Directories in soldat.smod (when local mount is disabled).
 * 
 * Our apis cover 1) and 2). For 3rd case, we'll rely on hard-coded strings,
 * since soldat.smod is meant to be static, and it's not supposed to be edited
 * by users.
 */

const loadCustomInterfacesDirectoryContent = function(): Promise<fs.Dirent[]> {
    return fs.promises.readdir(soldatPaths.customInterfacesDirectory, { withFileTypes: true })
    .catch(() => {
        return [];
    });
}

const loadArchiveNames = function(): Promise<string[]> {
    const archiveFileExtension = ".sint";

    return loadCustomInterfacesDirectoryContent()
        .then(entries => {
            return entries
                .filter(entry => {
                    return entry.isFile() && entry.name.endsWith(archiveFileExtension);
                })
                .map(entry => entry.name.slice(0, -archiveFileExtension.length));
        });
};

const loadDirectoryNames = function(): Promise<string[]> {
    return loadCustomInterfacesDirectoryContent()
        .then(entries => {
            return entries
                .filter(entry => {
                    return entry.isDirectory();
                })
                .map(entry => entry.name);
        });
};

export { loadArchiveNames, loadDirectoryNames };