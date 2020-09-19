import React from "react";
import { observer } from "mobx-react";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import MapPreview from "./Preview";
import MapsList from "./List";
import MapsListItem from "./ListItem";

import MapsStore from "../../../stores/maps";

import { Map } from "../../../types";
import { MapsSelectionUiState } from "../../../types/ui";

import "./Selection.css";

type MapsSelectionProps = {
    mapsStore: MapsStore;
    uiState: MapsSelectionUiState;

    selectedMaps: Map[];
};

const MapsSelection: React.FC<MapsSelectionProps> = props => {
    if (props.mapsStore &&
        !props.mapsStore.maps) {
        props.mapsStore.loadMaps();
    }

    // Highlight first map from selected maps' list.
    if (!props.uiState.highlightedMap && props.selectedMaps.length > 0) {
        props.uiState.highlightedMap = props.selectedMaps[0];
    }

    const addMap = (mapName: string): void => {
        props.selectedMaps.push({
            id: shortid.generate(),
            name: mapName
        });

        props.uiState.highlightedMap = props.selectedMaps[props.selectedMaps.length - 1];
    }

    const clearSelectedMapsList = (): void => {
        props.selectedMaps.length = 0;
    }

    const getFilteredMaps = (): Map[] => {
        if (!props.mapsStore) {
            return [];
        }

        return props.mapsStore.getMapsByName(props.uiState.searchFilter);
    }

    const handleMapClick = (map: Map): void => {
        props.uiState.highlightedMap = map;
    }

    const handleSearchFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.uiState.searchFilter = event.target.value;
    }

    const removeMap = (mapId: string): void => {
        const index = props.selectedMaps.findIndex(map => map.id === mapId);
        props.selectedMaps.splice(index, 1);
    }

    return (
        <div className="map-selection-container">
            <div className="map-selection">
                <input
                    className="search-filter"
                    placeholder="Search..."
                    spellCheck={false}
                    value={props.uiState.searchFilter}
                    onChange={handleSearchFilterChange}
                    type="search">
                </input>

                <div className="maps-list-container">
                    <MapsList emptyMessage="No maps found">
                        {getFilteredMaps().map((map: Map) =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button green-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        addMap(map.name)
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
                            onClick={clearSelectedMapsList}>
                            Clear
                        </button>
                    </div>

                    <MapsList emptyMessage="Empty">
                        {props.selectedMaps.map((map: Map) =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button red-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        removeMap(map.id);
                                    }}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </MapsListItem>
                        )}
                    </MapsList>
                </div>
            </div>
            
            <MapPreview mapName={props.uiState.highlightedMap.name} />
        </div>
    )
}

export default observer(MapsSelection);