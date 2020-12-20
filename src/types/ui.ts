import { Map } from ".";

export interface DemosPageUiState {
    searchTerm: string;
    selectedDemoFileName: string;
}

export interface LocalGamePageUiState {
    advancedSettingsCollapsed: boolean;
    bonusesSettingsCollapsed: boolean;
    botsSettingsCollapsed: boolean;
    gameplaySettingsCollapsed: boolean;
    mapsSettingsCollapsed: boolean;
    weaponsSettingsCollapsed: boolean;

    mapsSelection: MapsSelectionUiState;
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