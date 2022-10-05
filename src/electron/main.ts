import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import GameIpcServer from "./gameIpcServer";
import { isDevelopment } from "../environment";
import { isSoldatLink, SOLDAT_PROTOCOL } from "../soldatLink";
import IconImage from "assets/icon.png";

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
        },
        icon: path.join(__dirname, IconImage)
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

function handleCommandLineArguments(argv: string[]): void {
    const soldatLink = argv.find(x => isSoldatLink(x));
    if (!soldatLink || !mainWindow) {
        return;
    }
    mainWindow.webContents.send("soldatLink", soldatLink);
}

/* We want only one instance of the launcher. Whenever a second instance
 * is launched (for example by clicking soldat:// link), we kill it,
 * and handle it from the single instance. */
const primaryInstance = app.requestSingleInstanceLock();
if (!primaryInstance) {
    app.quit();
} else {
    app.on("second-instance", (event, argv) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
        handleCommandLineArguments(argv);
    });
}

 /* As of now, soldat:// links only work on Windows. Electron doesn't support
  * registering protocols on Linux, so a different approach might be needed.
  * As for MacOS, it seems simpler to set up, but I don't have a way to test it.
  *
  * There are 2 cases that need to be handled with soldat:// link:
  * 1) User clicks on link while having an instance of launcher running already.
  * 2) User clicks on link without any other instance running.
  * We handle the first case from the single instance that is running.
  * On Windows, this will work both in development and production builds.
  *
  * The second case, however, will only work in production build. This seems
  * related to the way electron-forge starts a development build. */
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(SOLDAT_PROTOCOL, process.execPath, [
            path.resolve(process.argv[1]),
        ]);
    }
} else {
    app.setAsDefaultProtocolClient(SOLDAT_PROTOCOL);
}

ipcMain.on("forceClose", () => {
    interceptClose = false;
    mainWindow.close();
});

ipcMain.on("interceptClose", () => {
    interceptClose = true;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    const gameIpcServer = new GameIpcServer(mainWindow.webContents);
    gameIpcServer.start(23093);

    // We need the renderer to be able to react, so we wait
    // for it to be ready before parsing arguments.
    mainWindow.webContents.on("did-finish-load", () => {
        handleCommandLineArguments(process.argv);
    });
});

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.