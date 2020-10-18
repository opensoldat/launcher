import React from "react";
import { observer } from "mobx-react";
import * as mobx from "mobx";

import Collapsable from "../Common/Collapsable";
import Panel from "../Common/Panel";
import Spinner from "../Common/Spinner";
import BotsForm from "./BotsForm";
import GameModeDescription from "./GameModeDescription";
import GameModeSelection from "./GameModeSelection";
import GameplayForm from "./Gameplay/Form";
import MapsSelection from "./Maps/Selection";
import AdvancedForm from "./AdvancedForm";

import LaunchArgumentsStore from "src/stores/launcher/launchArguments";
import LocalGameStore from "src/stores/localGame";
import MapsStore from "src/stores/maps";
import ServerSettingsStore from "src/stores/settings/server";

import { GameModes } from "../../types";
import { LocalGamePageUiState } from "../../types/ui";

import "./Page.css";
import "../Common/Buttons.css";

type LocalGamePageProps = {
    launchArgumentsStore: LaunchArgumentsStore;
    localGameStore: LocalGameStore;
    mapsStore: MapsStore;
    serverSettingsStore: ServerSettingsStore;
    uiState: LocalGamePageUiState;

    onStartLocalGameClick: () => void;
    onStopLocalGameClick: () => void;
}

const LocalGamePage: React.FunctionComponent<LocalGamePageProps> = props => {
    if (!props.serverSettingsStore.isLoading && !props.serverSettingsStore.gotData) {
        props.serverSettingsStore.loadAll();
    }

    /* Whenever game mode changes, we want to fill maps' search bar with
     * a default string, so that we filter out maps that are not related
     * to currently selected game mode.
     * 
     * Currently, game mode can change in 2 scenarios:
     * 1) The async loading of config file finishes.
     * 2) User clicks on buttons in sidebar.
     * Below implementation might not be the most intuitive and/or readable,
     * but I think it's better than other possible approaches, that involved
     * dealing with potential memory leaks upon component's unmount.
     * We rely on mobx.reaction (instead of useEffect hook alone), because
     * useEffect's callback gets called on every mount, and we don't really
     * want to override search bar's content every time user navigates between
     * tabs. With mobx.reaction, our code only runs when game mode actually
     * changes. */
    React.useEffect(() => {
        return mobx.reaction(
            () => props.serverSettingsStore.settings?.gameplay?.mode,
            gameMode => {
                if (props.serverSettingsStore.settings == null ||
                    props.serverSettingsStore.settings.gameplay == null ||
                    props.serverSettingsStore.settings.gameplay.mode == null) {
                    return;
                }

                switch (gameMode) {
                    case GameModes.CaptureTheFlag:
                        props.uiState.mapsSelection.searchFilter = "ctf_";
                        break;
                    case GameModes.HoldTheFlag:
                        props.uiState.mapsSelection.searchFilter = "htf_";
                        break;
                    case GameModes.Infiltration:
                        props.uiState.mapsSelection.searchFilter = "inf_";
                        break;
                    default:
                        props.uiState.mapsSelection.searchFilter = "";
                        break;
                }
            }
        )
    }, []);

    const handleGameModeChange = (newGameMode: GameModes): void => {
        props.serverSettingsStore.settings.gameplay.mode = newGameMode;
    }

    const handleAdvancedCollapsedToggle = (collapsed: boolean): void => {
        props.uiState.advancedSettingsCollapsed = collapsed;
    }

    const handleBotsCollapsedToggle = (collapsed: boolean): void => {
        props.uiState.botsSettingsCollapsed = collapsed;
    }

    const handleGameplayCollapsedToggle = (collapsed: boolean): void => {
        props.uiState.gameplaySettingsCollapsed = collapsed;
    }

    const handleMapsCollapsedToggle = (collapsed: boolean): void => {
        props.uiState.mapsSettingsCollapsed = collapsed;
    }

    const isStartingLocalGame = (
        props.serverSettingsStore.isSaving ||
        props.localGameStore.isStarting
    );

    return (
        <div className="local-game-page">
            {
                (
                    !props.serverSettingsStore.isLoading &&
                    props.serverSettingsStore.gotData
                )
                ?   <React.Fragment> 
                        <Panel className="sidebar">
                            <div className="section">
                                <div className="title">
                                    Game mode:
                                </div>
                                <GameModeSelection
                                    gameMode={props.serverSettingsStore.settings.gameplay.mode}
                                    onGameModeChange={handleGameModeChange} />
                            </div>

                            {props.localGameStore.isRunning
                            ?   <button
                                    className="button red-button control-game-button"
                                    onClick={props.onStopLocalGameClick} >
                                        STOP
                                </button>
                            :   <button
                                    className="button green-button control-game-button"
                                    onClick={props.onStartLocalGameClick}
                                    disabled={isStartingLocalGame}>
                                    {isStartingLocalGame
                                        ? <Spinner />
                                        : "START"
                                    }
                                </button>
                            }
                        </Panel>

                        <Panel className="settings">
                            <div className="section">
                                <div className="title">
                                    DESCRIPTION
                                </div>
                                <GameModeDescription gameMode={props.serverSettingsStore.settings.gameplay.mode} />
                            </div>

                            <Collapsable
                                className="settings-group"
                                collapsed={props.uiState.gameplaySettingsCollapsed}
                                onCollapsedToggle={handleGameplayCollapsedToggle}
                                headerContent={
                                    <span>GAMEPLAY</span>
                                }>
                            
                                <GameplayForm gameplaySettings={props.serverSettingsStore.settings.gameplay} />
                            </Collapsable>

                            <Collapsable
                                className="settings-group"
                                collapsed={props.uiState.mapsSettingsCollapsed}
                                onCollapsedToggle={handleMapsCollapsedToggle}
                                headerContent={
                                    <span>MAPS</span>
                                }>
                                <div>
                                    <MapsSelection
                                        mapsStore={props.mapsStore}
                                        serverMapsList={props.serverSettingsStore.mapsList}
                                        uiState={props.uiState.mapsSelection} />
                                </div>
                            </Collapsable>

                            <Collapsable
                                className="settings-group"
                                collapsed={props.uiState.botsSettingsCollapsed}
                                onCollapsedToggle={handleBotsCollapsedToggle}
                                headerContent={
                                    <span>BOTS</span>
                                }>
                                <div>
                                    <BotsForm serverSettings={props.serverSettingsStore.settings} />
                                </div>
                            </Collapsable>

                            <Collapsable
                                className="settings-group"
                                collapsed={props.uiState.advancedSettingsCollapsed}
                                onCollapsedToggle={handleAdvancedCollapsedToggle}
                                headerContent={
                                    <span>ADVANCED</span>
                                }>
                                <div>
                                    <AdvancedForm
                                        launchArgumentsStore={props.launchArgumentsStore}
                                        networkSettings={props.serverSettingsStore.settings.network} />
                                </div>
                            </Collapsable>
                        </Panel>
                    </React.Fragment>
                :   <div className="centered-spinner">
                        <Spinner />
                    </div>
            }
        </div>
    )
}

export default observer(LocalGamePage);