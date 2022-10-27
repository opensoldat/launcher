import fs from "fs";
import path from "path";
import { isProduction } from "src/environment";

const filePath = path.resolve(
  isProduction ? process.resourcesPath : "",
  "./launcher.json"
);

const loadData = function (): Promise<string> {
  return fs.promises.readFile(filePath, { encoding: "utf8" }).catch((error) => {
    console.warn("An error occurred when loading launcher's data", error);
    return null;
  });
};

const saveData = function (fileContent: string): Promise<void> {
  return fs.promises.writeFile(filePath, fileContent);
};

export { loadData, saveData };
