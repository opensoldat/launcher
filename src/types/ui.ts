import { Map } from ".";

export interface LocalGamePageUiState {
    gameplaySettingsCollapsed: boolean;
    mapsSettingsCollapsed: boolean;
    mapsSelection: MapsSelectionUiState;
    botsSettingsCollapsed: boolean;
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