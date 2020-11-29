import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import FiltersTooltip from "./FiltersTooltip";
import SearchBar from "src/components/Common/SearchBar";

import LobbyServersStore from "../../../stores/lobby/servers";
import "./Actions.css";

type ServersTableActionsProps = {
    serversStore: LobbyServersStore;
}

const ServersTableActions: React.FC<ServersTableActionsProps> = props => {
    const handleQuickSearchChange = (newSearchTerm: string): void => {
        props.serversStore.filtersStore.quickSearch = newSearchTerm;
    }

    const refreshServers = (): void => {
        props.serversStore.fetchServers();
    }

    return (
        <div className="servers-table-actions">
            <SearchBar
                className="quick-search-bar"
                placeholder="Quick search... (server name, map name, IP)"
                value={props.serversStore.filtersStore.quickSearch}
                onChange={handleQuickSearchChange} />

            <div className="buttons-container">
                <button
                    className="button green-button"
                    data-tip
                    data-event="click"
                    data-for="server-filters-tooltip">
                    <FontAwesomeIcon icon={faFilter} className="icon" />
                    Filter
                    {props.serversStore.filtersStore.activeFiltersCount > 0 &&
                    <span className="active-filters-count">
                        {props.serversStore.filtersStore.activeFiltersCount}
                    </span>
                    }
                </button>

                <button
                    className="button green-button"
                    onClick={refreshServers}
                    disabled={props.serversStore.isFetching}>
                    <FontAwesomeIcon icon={faSyncAlt} className="icon" />
                    Refresh
                </button>
            </div>

            <FiltersTooltip
                id="server-filters-tooltip"
                serverFiltersStore={props.serversStore.filtersStore} />
        </div>
    )
}

export default observer(ServersTableActions);