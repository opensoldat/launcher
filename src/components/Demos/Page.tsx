import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import Panel from "../Common/Panel";
import DemosList from "./List";

import DemosStore from "src/stores/demos";
import { DemosPageUiState } from "src/types/ui";

import "./Page.css";

type DemosPageProps = {
    demosStore: DemosStore;
    uiState: DemosPageUiState;
}

const DemosPage: React.FC<DemosPageProps> = props => {
    if (!props.demosStore.isLoading && !props.demosStore.gotDemos) {
        props.demosStore.loadDemos();
    }

    const playDemo = (fileName: string): void => {
        props.demosStore.playDemo(fileName, function(error) {
            toast.error("Error on demo playback:\n" + error.message);
        });
    }

    const handleDemoClick = (fileName: string): void => {
        props.uiState.selectedDemoFileName = fileName;
    }

    const handleDemoDoubleClick = (fileName: string): void => {
        playDemo(fileName);
    }

    const handlePlayButtonClick = (): void => {
        playDemo(props.uiState.selectedDemoFileName);
    }

    const handleRefreshButtonClick = (): void => {
        props.demosStore.loadDemos();
    }

    const filteredDemosFileNames = props.demosStore.filterDemos(props.uiState.searchTerm);
    /* Clear out selection in case the selected demo disappeared from list
     * (it got filtered out, or user refreshed the list after deleting demo file)
     */
    if (props.uiState.selectedDemoFileName?.length &&
        !filteredDemosFileNames.includes(props.uiState.selectedDemoFileName)) {
        props.uiState.selectedDemoFileName = "";
    }

    return (
        <div className="demos-page">
            <Panel>
                <div className="demos-list-actions">
                    {/*<SearchBar />*/}
                    <button
                        className="button green-button refresh-button"
                        onClick={handleRefreshButtonClick}
                        disabled={props.demosStore.isLoading}>
                        <FontAwesomeIcon icon={faSyncAlt} className="icon" />
                        Refresh
                    </button>
                </div>

                <DemosList
                    demosFileNames={filteredDemosFileNames}
                    isLoadingDemos={props.demosStore.isLoading}
                    selectedDemoFileName={props.uiState.selectedDemoFileName}
                    onDemoClick={handleDemoClick}
                    onDemoDoubleClick={handleDemoDoubleClick} />
            </Panel>

            <div className="action-buttons">
                {props.uiState.selectedDemoFileName && props.uiState.selectedDemoFileName.length > 0 &&
                <button
                    onClick={handlePlayButtonClick}
                    className="button green-button">
                    <FontAwesomeIcon icon={faPlay} className="icon" />
                    Play demo
                </button>
                }
            </div>
        </div>
    )
}

export default observer(DemosPage);