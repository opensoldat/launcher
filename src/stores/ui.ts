import { observable } from "mobx";
import {
    LocalGamePageUiState,
    SettingsPageUiState,
    SettingsPageTabsIndexes
} from "../types/ui";

class UiStore {
    @observable localGamePage: LocalGamePageUiState = {
        gameplaySettingsCollapsed: false,
        
        mapsSettingsCollapsed: true,
        mapsSelection: {
            searchFilter: "",
            highlightedMap: null
        },

        botsSettingsCollapsed: true
    };

    @observable settingsPage: SettingsPageUiState = {
        selectedTabIndex: SettingsPageTabsIndexes.Player
    };
}

export default UiStore;