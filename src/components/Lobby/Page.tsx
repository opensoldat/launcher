import React from "react";
import { observer } from "mobx-react";

import ConnectForm from "./ConnectForm";
import Panel from "../Common/Panel";
import ServersTable from "./ServersTable/";

import { Server } from "src/types";
import { LobbyPageUiState } from "src/types/ui";

import ConnectFormStore from "src/stores/launcher/connectForm";
import GameVaultStore from "src/stores/gameVault";
import LobbyServersStore from "src/stores/lobby/servers";
import OnlineGamesStore from "src/stores/onlineGames";

import "./Page.css";

type LobbyPageProps = {
  connectFormStore: ConnectFormStore;
  gameVaultStore: GameVaultStore;
  onlineGamesStore: OnlineGamesStore;
  serversStore: LobbyServersStore;
  uiState: LobbyPageUiState;
};

const LobbyPage: React.FC<LobbyPageProps> = (props) => {
  const handleServerClick = (server: Server): void => {
    props.connectFormStore.ip = server.ip;
    props.connectFormStore.port = server.port.toString();
  };

  const handleServerDoubleClick = (server: Server): void => {
    // TODO: maybe bring the window to front instead of doing nothing?
    if (props.gameVaultStore.getClient(server.ip, server.port)) {
      return;
    }

    props.onlineGamesStore.connect(
      server.ip,
      server.port,
      props.connectFormStore.password
    );
  };

  return (
    <div className="lobby-page">
      <Panel>
        <ConnectForm
          connectFormStore={props.connectFormStore}
          gameVaultStore={props.gameVaultStore}
          onlineGamesStore={props.onlineGamesStore}
        />
      </Panel>

      <Panel className="servers-table-panel">
        <ServersTable
          onServerClick={handleServerClick}
          onServerDoubleClick={handleServerDoubleClick}
          gameVaultStore={props.gameVaultStore}
          serversStore={props.serversStore}
          showServerDetails={props.uiState.showServerDetails}
        />
      </Panel>
    </div>
  );
};

export default observer(LobbyPage);
