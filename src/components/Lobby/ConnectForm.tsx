import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import ConnectFormStore from "../../stores/launcher/connectForm";
import OnlineGamesStore from "../../stores/onlineGames";

import { isSoldatLink } from "src/soldatLink";

import "./ConnectForm.css";

type ConnectFormProps = {
  connectFormStore: ConnectFormStore;
  onlineGamesStore: OnlineGamesStore;
};

const ConnectForm: React.FC<ConnectFormProps> = (props) => {
  const handleDisconnectClick = (): void => {
    props.onlineGamesStore.disconnect(
      props.connectFormStore.ip,
      Number(props.connectFormStore.port)
    );
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const target = event.target;

    switch (target.name) {
      case "server-ip":
        props.connectFormStore.ip = target.value.trim();
        break;

      case "server-port":
        props.connectFormStore.port = target.value.trim();
        break;

      case "server-password":
        props.connectFormStore.password = target.value;
        break;
    }
  };

  const handleIpInputPaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ): void => {
    const pastedString = event.clipboardData.getData("text/plain");
    props.connectFormStore.setFromSoldatLink(pastedString);

    // We don't want to actually paste the soldat:// link.
    if (isSoldatLink(pastedString)) {
      event.preventDefault();
    }
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    if (!props.connectFormStore.isValid()) {
      return;
    }

    props.onlineGamesStore.connect(
      props.connectFormStore.ip,
      Number(props.connectFormStore.port),
      props.connectFormStore.password,
      function (errorMessage: string) {
        toast.error("Could not start game:\n" + errorMessage);
      }
    );
  };

  return (
    <form className="connect-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="server-ip"> Server IP </label>
        <input
          id="server-ip"
          name="server-ip"
          placeholder="127.0.0.1"
          spellCheck="false"
          type="text"
          value={props.connectFormStore.ip}
          onChange={handleInputChange}
          onPaste={handleIpInputPaste}
        ></input>

        <div className="error-message">
          {props.connectFormStore.ipError &&
            props.connectFormStore.ipError.length > 0 &&
            props.connectFormStore.ipError}
        </div>
      </div>

      <div className="field">
        <label htmlFor="server-port"> Port </label>
        <input
          id="server-port"
          name="server-port"
          placeholder="23073"
          spellCheck="false"
          type="text"
          value={props.connectFormStore.port}
          onChange={handleInputChange}
        ></input>

        <div className="error-message">
          {props.connectFormStore.portError &&
            props.connectFormStore.portError.length > 0 &&
            props.connectFormStore.portError}
        </div>
      </div>

      <div className="field">
        <label htmlFor="server-password"> Password </label>
        <input
          id="server-password"
          name="server-password"
          spellCheck="false"
          type="text"
          maxLength={35}
          value={props.connectFormStore.password}
          onChange={handleInputChange}
        ></input>
      </div>

      <div className="field button-field">
        {props.connectFormStore.isValid() &&
        props.onlineGamesStore.getClient(
          props.connectFormStore.ip,
          Number(props.connectFormStore.port)
        ) ? (
          // We don't want to raise a submit event when clicking disconnect,
          // so this is an input field with type="button".
          <input
            className="button red-button"
            onClick={handleDisconnectClick}
            type="button"
            value="Disconnect"
          ></input>
        ) : (
          <button className="button green-button" type="submit">
            Connect
          </button>
        )}
      </div>
    </form>
  );
};

export default observer(ConnectForm);
