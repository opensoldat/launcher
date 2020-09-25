import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";

import LobbyPage from "./Lobby/Page";
import LocalGamePage from "./LocalGame/Page";
import SettingsPage from "./Settings/Page";

import ClientSettingsStore from "../stores/settings/client";
import ConnectFormStore from "../stores/lobby/connectForm";
import ServerSettingsStore from "../stores/settings/server";
import LobbyServersStore from "../stores/lobby/servers";
import LocalGameStore from "../stores/localGame";
import MapsStore from "../stores/maps";
import OnlineGamesStore from "../stores/onlineGames";
import UiStore from "../stores/ui";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

enum TabIndexes {
    Lobby = 0,
    LocalGame,
    Settings
}

const App: React.FC = () => {
    const [clientSettingsStore] = React.useState(() => new ClientSettingsStore());

    const [serverSettingsStore] = React.useState(() => new ServerSettingsStore());

    /* We keep track of some UI-related states so that we can restore
     * pages when user navigates with tabs. We keep states in this root
     * component, because pages get unmounted when navigating between tabs,
     * and we would lose their internal states. */
    const [uiStore] = React.useState(() => new UiStore());
    const [mapsStore] = React.useState(() => new MapsStore());
    
    const [localGameStore] = React.useState(() => new LocalGameStore());
    const [onlineGamesStore] = React.useState(() => new OnlineGamesStore());

    const [lobbyServersStore] = React.useState(() => new LobbyServersStore());
    const [connectFormStore] = React.useState(() => new ConnectFormStore());

    const handleTabChange = (index: number, lastIndex: number): boolean => {
        if (lastIndex === TabIndexes.LocalGame) {
            // TODO: We might also want to save server settings when closing the app.
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
            localGameStore.startLocalGame(23073, (errorMessage: string) => {
                toast.error("Local game failed:\n" + errorMessage);
            });
        })
        .catch((errorMessage: string) => {
            toast.error("Could not save server settings:\n" + errorMessage);
        });
    }

    return (
        <main>
            <Tabs
                onSelect={handleTabChange}
                selectedTabClassName="navigation-bar-tab--selected">
                <div className="navigation-bar-container">
                    <TabList className="navigation-bar">
                        <Tab className="navigation-bar-tab">LOBBY</Tab>
                        <Tab className="navigation-bar-tab">LOCAL</Tab>
                        <Tab className="navigation-bar-tab">SETTINGS</Tab>
                    </TabList>
                </div>

                <TabPanel className="navigation-bar-content">
                    <LobbyPage
                        connectFormStore={connectFormStore} 
                        onlineGamesStore={onlineGamesStore}
                        serversStore={lobbyServersStore} />
                </TabPanel>

                <TabPanel className="navigation-bar-content">
                    <LocalGamePage
                        serverSettingsStore={serverSettingsStore}
                        localGameStore={localGameStore}
                        mapsStore={mapsStore}
                        uiState={uiStore.localGamePage}
                        onStartLocalGameClick={startLocalGame}
                        onStopLocalGameClick={(): void => localGameStore.stopLocalGame()} />
                </TabPanel>

                <TabPanel className="navigation-bar-content">
                    <SettingsPage
                        clientSettingsStore={clientSettingsStore}
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
        </main>
    )
}

export default App;