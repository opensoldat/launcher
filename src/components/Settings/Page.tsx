import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faDesktop, faKeyboard, faMusic, faGamepad } from "@fortawesome/free-solid-svg-icons";

import ControlsPanel from "./Controls/Panel";
import GamePanel from "./GamePanel";
import GraphicsPanel from "./GraphicsPanel";
import PlayerPanel from "./PlayerPanel";
import SoundPanel from "./SoundPanel";

import ClientLaunchSettingsStore from "src/stores/launcher/clientLaunchSettings";
import ClientSettingsStore from "src/stores/settings/client";
import InterfacesStore from "src/stores/interfaces";
import ModsStore from "src/stores/mods";
import { SettingsPageUiState } from "src/types/ui";

import "./Page.css";

type SettingsPageProps = {
    clientLaunchSettingsStore: ClientLaunchSettingsStore;
    clientSettingsStore: ClientSettingsStore;
    interfacesStore: InterfacesStore;
    modsStore: ModsStore;
    uiState: SettingsPageUiState;
};

const SettingsPage: React.FC<SettingsPageProps> = props => {
    const handleTabChange = (index: number): boolean => {
        props.uiState.selectedTabIndex = index;
        return true;
    }

    return (
        <div className="settings-page">
            <Tabs
                selectedIndex={props.uiState.selectedTabIndex}
                onSelect={handleTabChange}
                className="settings-tabs"
                selectedTabClassName="sidebar-tab--selected"
                selectedTabPanelClassName="sidebar-content--selected">
                <TabList className="sidebar">
                    <Tab className="sidebar-tab">
                        PLAYER
                        <FontAwesomeIcon icon={faUser} className="icon" />
                    </Tab>
                    <Tab className="sidebar-tab">
                        GAME
                        <FontAwesomeIcon icon={faGamepad} className="icon" />
                    </Tab>
                    <Tab className="sidebar-tab">
                        CONTROLS
                        <FontAwesomeIcon icon={faKeyboard} className="icon" />
                    </Tab>
                    <Tab className="sidebar-tab">
                        GRAPHICS
                        <FontAwesomeIcon icon={faDesktop} className="icon" />
                    </Tab>
                    <Tab className="sidebar-tab">
                        SOUND
                        <FontAwesomeIcon icon={faMusic} className="icon" />
                    </Tab>
                </TabList>

                <TabPanel>
                    <PlayerPanel playerSettingsStore={props.clientSettingsStore.playerSettingsStore} />
                </TabPanel>

                <TabPanel>
                    <GamePanel
                        clientLaunchSettingsStore={props.clientLaunchSettingsStore}
                        gameSettingsStore={props.clientSettingsStore.gameSettingsStore}
                        modsStore={props.modsStore} />
                </TabPanel>

                <TabPanel>
                    <ControlsPanel controlsWrapperStore={props.clientSettingsStore.controlsWrapperStore} />
                </TabPanel>

                <TabPanel>
                    <GraphicsPanel
                        graphicsSettingsStore={props.clientSettingsStore.graphicsSettingsStore}
                        interfacesStore={props.interfacesStore} />
                </TabPanel>

                <TabPanel>
                    <SoundPanel soundSettingsStore={props.clientSettingsStore.soundSettingsStore} />
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default observer(SettingsPage);