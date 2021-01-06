import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import { observer } from "mobx-react";

import DemosPage from "./Demos/Page";
import LobbyPage from "./Lobby/Page";
import LocalGamePage from "./LocalGame/Page";
import SettingsPage from "./Settings/Page";
import Spinner from "./Common/Spinner";

import ClientSettingsStore from "../stores/settings/client";
import DemosStore from "src/stores/demos";
import InterfacesStore from "src/stores/interfaces";
import LauncherDataStore from "src/stores/launcher/data";
import LobbyServersStore from "../stores/lobby/servers";
import LocalGameStore from "../stores/localGame";
import MapsStore from "../stores/maps";
import ModsStore from "src/stores/mods";
import OnlineGamesStore from "../stores/onlineGames";
import ServerSettingsStore from "../stores/settings/server";
import UiStore from "../stores/ui";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

enum TabIndexes {
    Lobby = 0,
    LocalGame,
    Demos,
    Settings
}

const App: React.FC = () => {
    const [launcherDataStore] = React.useState(() => new LauncherDataStore());
    if (!launcherDataStore.isLoading && !launcherDataStore.gotData) {
        launcherDataStore.loadData();
    }

    const [clientSettingsStore] = React.useState(() => new ClientSettingsStore());
    const [serverSettingsStore] = React.useState(() => new ServerSettingsStore());

    /* We keep track of some UI-related states so that we can restore
     * pages when user navigates with tabs. We keep states in this root
     * component, because pages get unmounted when navigating between tabs,
     * and we would lose their internal states. */
    const [uiStore] = React.useState(() => new UiStore());

    const [demosStore] = React.useState(() => new DemosStore());
    const [interfacesStore] = React.useState(() => new InterfacesStore(
        launcherDataStore.clientLaunchSettingsStore
    ));
    const [mapsStore] = React.useState(() => new MapsStore());
    const [modsStore] = React.useState(() => new ModsStore());
    
    const [localGameStore] = React.useState(() => new LocalGameStore(
        launcherDataStore.clientLaunchSettingsStore,
        launcherDataStore.serverLaunchSettingsStore
    ));
    const [onlineGamesStore] = React.useState(() => new OnlineGamesStore(
        launcherDataStore.clientLaunchSettingsStore
    ));

    const [lobbyServersStore] = React.useState(() => new LobbyServersStore());

    React.useEffect(() => {
        window.electron.interceptCloseRequest(() => {
            /* Technically, this shouldn't be necessary when the "detached" option passed
             * to spawn() calls is false, but it doesn't seem to work on Linux. So, since
             * we don't want to force users to kill local server manually, we stop local
             * game when the app closes.
             * TODO: notify users about this, and ask them to confirm they want to close
             * (modal dialog).
             */
            localGameStore.stopLocalGame();

            const promises = [];
            if (launcherDataStore.gotData) {
                promises.push(launcherDataStore.saveData());
            }
            if (serverSettingsStore.gotData) {
                promises.push(serverSettingsStore.saveAll());
            }

            Promise.allSettled(promises)
            .then(() => {
                window.electron.forceClose();
            });
        });
    }, []);

    const handleTabChange = (index: number, lastIndex: number): boolean => {
        if (lastIndex === TabIndexes.LocalGame) {
            serverSettingsStore.saveAll();
        }

        return true;
    }

    // We're handling this logic from here, so that we don't have to worry about
    // child components getting unmounted before promises resolve/reject. Accessing
    // props in child components after they are unmounted leads to memory leaks.
    // App component will always be mounted.
    const startLocalGame = (): void => {
        serverSettingsStore.saveAll()
        .then(() => {
            localGameStore.startLocalGame(
                Number(serverSettingsStore.settings.network.port),
                (errorMessage: string) => {
                    toast.error("Local game failed:\n" + errorMessage);
                }
            );
        })
        .catch((errorMessage: string) => {
            toast.error("Could not save server settings:\n" + errorMessage);
        });
    }

    return (
        <main>
        {launcherDataStore.isLoading || !launcherDataStore.gotData
        ?   <div className="centered-spinner">
                <Spinner />
            </div>
        :   <React.Fragment>
                <Tabs
                    onSelect={handleTabChange}
                    selectedTabClassName="navigation-bar-tab--selected">
                    <div className="navigation-bar-container">
                        <TabList className="navigation-bar">
                            <Tab className="navigation-bar-tab">LOBBY</Tab>
                            <Tab className="navigation-bar-tab">LOCAL</Tab>
                            <Tab className="navigation-bar-tab">DEMOS</Tab>
                            <Tab className="navigation-bar-tab">SETTINGS</Tab>
                        </TabList>
                    </div>

                    <TabPanel className="navigation-bar-content">
                        <LobbyPage
                            connectFormStore={launcherDataStore.connectFormStore} 
                            onlineGamesStore={onlineGamesStore}
                            serversStore={lobbyServersStore}
                            uiState={uiStore.lobbyPage} />
                    </TabPanel>

                    <TabPanel className="navigation-bar-content">
                        <LocalGamePage
                            localGameStore={localGameStore}
                            mapsStore={mapsStore}
                            serverLaunchSettingsStore={launcherDataStore.serverLaunchSettingsStore}
                            serverSettingsStore={serverSettingsStore}
                            uiState={uiStore.localGamePage}
                            onStartLocalGameClick={startLocalGame}
                            onStopLocalGameClick={(): void => localGameStore.stopLocalGame()} />
                    </TabPanel>

                    <TabPanel className="navigation-bar-content">
                        <DemosPage
                            demosStore={demosStore}
                            uiState={uiStore.demosPage} />
                    </TabPanel>

                    <TabPanel className="navigation-bar-content">
                        <SettingsPage
                            clientLaunchSettingsStore={launcherDataStore.clientLaunchSettingsStore}
                            clientSettingsStore={clientSettingsStore}
                            interfacesStore={interfacesStore}
                            modsStore={modsStore}
                            uiState={uiStore.settingsPage} />
                    </TabPanel>
                </Tabs>

                <ToastContainer
                    draggable={false}
                    bodyStyle={{
                        fontFamily: "play-regular",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap"
                    }} />
            </React.Fragment>
        }
        </main>
    )
}

export default observer(App);