import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import MapPreview from "./Preview";
import MapsList from "./List";
import MapsListItem from "./ListItem";
import SearchBar from "src/components/Common/SearchBar";

import MapsStore from "src/stores/maps";
import ServerMapsList from "src/settings/server/mapsList";

import { Map } from "src/types";
import { MapsSelectionUiState } from "src/types/ui";

import "./Selection.css";

type MapsSelectionProps = {
    serverMapsList: ServerMapsList;
    mapsStore: MapsStore;
    uiState: MapsSelectionUiState;
};

const MapsSelection: React.FC<MapsSelectionProps> = props => {
    if (props.mapsStore && !props.mapsStore.gotMaps) {
        props.mapsStore.loadMaps();
    }

    // Highlight first map from server's maps' list.
    // We rely on the fact that this component will rerender
    // when we receive server's maps list. 
    const firstMap = props.serverMapsList?.firstMap;
    if (!props.uiState.highlightedMap && firstMap) {
        props.uiState.highlightedMap = firstMap;
    }

    const handleAddButtonClick = (mapName: string): void => {
        const newMap = props.serverMapsList.add(mapName);
        props.uiState.highlightedMap = newMap;
    }

    const handleClearClick = (): void => {
        props.serverMapsList.clear();
    }

    const handleMapClick = (map: Map): void => {
        props.uiState.highlightedMap = map;
    }

    const handleSearchFilterChange = (newValue: string): void => {
        props.uiState.searchFilter = newValue;
    }

    const handleRemoveMap = (mapId: string): void => {
        props.serverMapsList.remove(mapId);
    }

    const isLoadingAvailableMaps = props.mapsStore.isLoading || !props.mapsStore.gotMaps;

    return (
        <div className="map-selection-container">
            <div className="map-selection">
                <SearchBar
                    placeholder="Search..."
                    value={props.uiState.searchFilter}
                    onChange={handleSearchFilterChange} />

                <div className="maps-list-container">
                    <MapsList
                        emptyMessage="No maps found"
                        isLoading={isLoadingAvailableMaps}>
                        {props.mapsStore.filterMaps(props.uiState.searchFilter).map((map: Map) =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap?.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button green-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        handleAddButtonClick(map.name)
                                    }}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </MapsListItem>
                        )}
                    </MapsList>
                </div>

                <div className="maps-list-container">
                    <div className="maps-list-header">
                        <div>Selected:</div>
                        <button
                            className="button red-button"
                            onClick={handleClearClick}>
                            Clear
                        </button>
                    </div>

                    <MapsList
                        emptyMessage="Empty"
                        isLoading={false}>
                        {props.serverMapsList.maps.map(map =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap?.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button red-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        handleRemoveMap(map.id);
                                    }}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </MapsListItem>
                        )}
                    </MapsList>
                </div>
            </div>
            
            <MapPreview mapName={props.uiState.highlightedMap?.name} />
        </div>
    )
}

export default observer(MapsSelection);