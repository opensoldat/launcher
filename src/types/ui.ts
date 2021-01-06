import { Map } from ".";

export interface DemosPageUiState {
    searchTerm: string;
    selectedDemoFileName: string;
}

export interface LobbyPageUiState {
    showServerDetails: {
        [key: string]: boolean;
    };
}

export interface LocalGamePageUiState {
    gameplaySettingsCollapsed: boolean;
    mapsSettingsCollapsed: boolean;
    mapsSelection: MapsSelectionUiState;
    botsSettingsCollapsed: boolean;
    bonusesSettingsCollapsed: boolean;
    advancedSettingsCollapsed: boolean;
}

export interface MapsSelectionUiState {
    searchFilter: string;
    highlightedMap: Map;
}

export enum SettingsPageTabsIndexes {
    Player = 0,
    Controls,
    Graphics
}

export interface SettingsPageUiState {
    selectedTabIndex: SettingsPageTabsIndexes;
}