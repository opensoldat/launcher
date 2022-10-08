import fs from "fs";

type SoldatFileExtensions = ".sdm" | ".sint" | ".smap" | ".smod";

function listSubdirectoriesNames(directoryPath: string): Promise<string[]> {
  return fs.promises
    .readdir(directoryPath, { withFileTypes: true })
    .then((entries) =>
      entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    )
    .catch(() => []);
}

function listFilesNames(
  directoryPath: string,
  fileExtension: SoldatFileExtensions
): Promise<string[]> {
  return fs.promises
    .readdir(directoryPath, { withFileTypes: true })
    .then((entries) =>
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(fileExtension))
        .map((entry) => entry.name.slice(0, -fileExtension.length))
    )
    .catch(() => []);
}

export { listFilesNames, listSubdirectoriesNames };
