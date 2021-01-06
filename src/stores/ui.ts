import { observable } from "mobx";
import {
    DemosPageUiState,
    LobbyPageUiState,
    LocalGamePageUiState,
    SettingsPageUiState,
    SettingsPageTabsIndexes,
} from "../types/ui";

class UiStore {
    @observable demosPage: DemosPageUiState = {
        searchTerm: "",
        selectedDemoFileName: ""
    };

    @observable lobbyPage: LobbyPageUiState = {
        showServerDetails: {}
    };

    @observable localGamePage: LocalGamePageUiState = {
        gameplaySettingsCollapsed: false,
        
        mapsSettingsCollapsed: true,
        mapsSelection: {
            searchFilter: "",
            highlightedMap: null
        },

        botsSettingsCollapsed: true,
        bonusesSettingsCollapsed: true,
        advancedSettingsCollapsed: true
    };

    @observable settingsPage: SettingsPageUiState = {
        selectedTabIndex: SettingsPageTabsIndexes.Player
    };
}

export default UiStore;