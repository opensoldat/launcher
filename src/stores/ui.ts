import { observable } from "mobx";
import {
    DemosPageUiState,
    LocalGamePageUiState,
    SettingsPageUiState,
    SettingsPageTabsIndexes
} from "../types/ui";

class UiStore {
    @observable demosPage: DemosPageUiState = {
        searchTerm: "",
        selectedDemoFileName: ""
    };

    @observable localGamePage: LocalGamePageUiState = {
        gameplaySettingsCollapsed: false,
        
        mapsSettingsCollapsed: true,
        mapsSelection: {
            searchFilter: "",
            highlightedMap: null
        },

        botsSettingsCollapsed: true,
        advancedSettingsCollapsed: true
    };

    @observable settingsPage: SettingsPageUiState = {
        selectedTabIndex: SettingsPageTabsIndexes.Player
    };
}

export default UiStore;