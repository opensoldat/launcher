import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import ConnectForm from "./ConnectForm";
import Panel from "../Common/Panel";
import ServersTable from "./ServersTable/";

import { Server } from "../../types";

import ConnectFormStore from "../../stores/lobby/connectForm";
import LobbyServersStore from "../../stores/lobby/servers";
import OnlineGamesStore from "../../stores/onlineGames";

import "./Page.css";

type LobbyPageProps = {
    connectFormStore: ConnectFormStore;
    onlineGamesStore: OnlineGamesStore;
    serversStore: LobbyServersStore;
}

const LobbyPage: React.FC<LobbyPageProps> = props => {
    const handleServerClick = (server: Server): void => {
        props.connectFormStore.ip = server.ip;
        props.connectFormStore.port = server.port.toString();
    }

    const handleServerDoubleClick = (server: Server): void => {
        // TODO: maybe bring the window to front instead of doing nothing?
        if (props.onlineGamesStore.getClient(server.ip, server.port)) {
            return;
        }

        props.onlineGamesStore.connect(
            server.ip,
            server.port,
            props.connectFormStore.password,
            function(errorMessage: string) {
                toast.error("Could not start game:\n" + errorMessage);
            }
        );
    }

    return (
        <div className="lobby-page">
            <Panel className="servers-table-panel">
                <ServersTable
                    onServerClick={handleServerClick}
                    onServerDoubleClick={handleServerDoubleClick}
                    onlineGamesStore={props.onlineGamesStore}
                    serversStore={props.serversStore} />
            </Panel>

            <Panel>
                <ConnectForm
                    connectFormStore={props.connectFormStore}
                    onlineGamesStore={props.onlineGamesStore} />
            </Panel>
        </div>
    )
}

export default observer(LobbyPage);