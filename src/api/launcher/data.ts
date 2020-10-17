import fs from "fs";

const filePath = "./launcher.json";

const loadData = function(): Promise<string> {
    return fs.promises.readFile(filePath, { encoding: "utf8" })
        .catch((error) => {
            console.warn("An error occurred when loading launcher's data", error);
            return null;
        });
}

export { loadData };