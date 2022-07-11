import { observable, makeObservable } from "mobx";
import {
    DemosPageUiState,
    LobbyPageUiState,
    LocalGamePageUiState,
    SettingsPageUiState,
    SettingsPageTabsIndexes,
    TabsIndexes,
} from "../types/ui";

class UiStore {
    @observable selectedTabIndex = TabsIndexes.Lobby;

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

    constructor() {
        makeObservable(this);
    }
}

export default UiStore;