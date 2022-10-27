import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import Spinner from "src/components/Common/Spinner";
import { soldatLinkToString } from "src/soldatLink";
import LobbyServersStore from "src/stores/lobby/servers";
import { Server } from "src/types";

import "../../Common/Form.css";
import "./ServerDetailsCell.css";

type ServerDetailsCellProps = {
  server: Server;
  serversStore: LobbyServersStore;
};

const ServerDetailsCell: React.FC<ServerDetailsCellProps> = (props) => {
  // Refresh players' list on each mount.
  React.useEffect(() => {
    props.serversStore.fetchPlayersList(
      props.server.ip,
      props.server.port.toString()
    );
  }, []);

  const serverId = props.server.ip + props.server.port.toString();
  const playersListContent = (
    <div className="players-list">
      {props.serversStore.playersLists[serverId] == null ? (
        <span>No data to display, try refreshing.</span>
      ) : (
        props.serversStore.playersLists[serverId].map(
          (playerNickname, index) => <span key={index}>{playerNickname}</span>
        )
      )}
    </div>
  );

  const joinLink = soldatLinkToString({
    ip: props.server.ip,
    port: props.server.port.toString(),
  });
  const joinLinkInput = useRef(null);
  const handleCopyLinkButtonClick = (): void => {
    joinLinkInput.current.select();
    document.execCommand("copy");
  };

  return (
    <div className="form server-details-cell">
      <div className="field">
        <label className="label">Join link</label>
        <div className="user-input">
          <div className="inline">
            <input readOnly ref={joinLinkInput} value={joinLink} />
            <div className="copy-button" onClick={handleCopyLinkButtonClick}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Players</label>
        <div className="user-input">
          {props.serversStore.isFetchingPlayersList[serverId] ? (
            <Spinner />
          ) : (
            playersListContent
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">Additional info</label>
        <div className="user-input">
          <span>{props.server.info}</span>
        </div>
      </div>
    </div>
  );
};

export default observer(ServerDetailsCell);
