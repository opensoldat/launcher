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
        advancedSettingsCollapsed: true,
        bonusesSettingsCollapsed: true,
        botsSettingsCollapsed: true,
        gameplaySettingsCollapsed: false,
        mapsSettingsCollapsed: true,
        weaponsSettingsCollapsed: true,
        
        mapsSelection: {
            searchFilter: "",
            highlightedMap: null
        }
    };

    @observable settingsPage: SettingsPageUiState = {
        selectedTabIndex: SettingsPageTabsIndexes.Player
    };
}

export default UiStore;