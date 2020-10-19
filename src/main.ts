import { app, BrowserWindow, ipcMain } from "electron";
import { isDevelopment } from "./environment";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow;
let interceptClose = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            /* Due to security reasons, we don't want to enable full Node.js support in renderer
             * processes. Instead, we'll expose our internal APIs with preload script. */
            nodeIntegration: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            
            contextIsolation: true
        }
    });

    mainWindow.removeMenu();
    mainWindow.maximize();

    if (isDevelopment) {
        mainWindow.webContents.openDevTools();
    }

    /* Load the index.html of the app.
     *
     * This should be called after opening dev tools, otherwise async
     * file reads will never resolve. The problem is reported here, although
     * nobody seems to know a proper solution (apart from moving to sync
     * file reads, or some hacky workarounds with setTimeout, which didn't seem to
     * solve the problem for me):
     * https://github.com/electron/electron/issues/24073
     * https://github.com/electron/electron/issues/22119
     * https://github.com/electron/electron/issues/19554
     * 
     * Since I'm not 100% sure what is the actual fix for this problem,
     * it's worth mentioning that disabling "webSecurity" on main window's
     * webPreferences seemed to solve the problem too.
     */
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    /* When user closes the window, we notify the renderer process about it,
     * so that we can save config files and close local game (so that we don't have
     * a pending soldat server process that users have to terminate manually).
     * When renderer process is done with that, it will notify main process, so that we
     * can proceed with quitting the app.
     * Additionally, to make sure that user can always close the app, we expect
     * the renderer process to notify the main process when it's ready to receive
     * a close request. This is to prevent scenario in which renderer process encounters
     * an error on startup (for example a wrong path when importing CSS modules), which
     * leads to close request never being processed by renderer, effectively preventing
     * user from closing the app (killing manually from task manager, or by sending a
     * SIGKILL signal is the only way to close it).
     */
    mainWindow.on("close", event => {
        if (interceptClose) {
            event.preventDefault();
            mainWindow.webContents.send("closeRequested");
        }
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on("forceClose", () => {
    interceptClose = false;
    mainWindow.close();
});

ipcMain.on("interceptClose", () => {
    interceptClose = true;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.