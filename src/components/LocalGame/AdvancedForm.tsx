import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import NetworkSettings from "src/settings/server/network";
import ServerLaunchSettingsStore from "src/stores/launcher/serverLaunchSettings";

import LaunchArgumentsTooltip from "../Common/LaunchArgumentsTooltip";

import "../Common/Form.css";

type AdvancedFormProps = {
    serverLaunchSettingsStore: ServerLaunchSettingsStore;
    networkSettings: NetworkSettings;
}

const AdvancedForm: React.FC<AdvancedFormProps> = props => {
    const handleCustomLaunchArgumentsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.serverLaunchSettingsStore.customArguments = event.target.value;
    }

    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.networkSettings.port = event.target.value.trim();
    }

    return (
        <div className="form">
            <div className="field">
                <label className="label" htmlFor="server-port">
                    Local server port
                </label>
                <div className="user-input">
                    <input
                        id="server-port"
                        name="server-port"
                        placeholder="23074"
                        spellCheck="false"
                        type="text"
                        value={props.networkSettings.port}
                        onChange={handlePortChange}>
                    </input>

                    <div className="error-message">
                    {(props.networkSettings.portError && props.networkSettings.portError.length > 0) &&
                        props.networkSettings.portError
                    }
                    </div>
                </div>
            </div>

            <div className="field">
                <label
                    className="label label-with-info"
                    htmlFor="launch-arguments">
                    Server launch arguments
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="launch-arguments-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input">
                    <input
                        id="launch-arguments"
                        spellCheck="false"
                        type="text"
                        value={props.serverLaunchSettingsStore.customArguments}
                        onChange={handleCustomLaunchArgumentsChange}>
                    </input>
                </div>

                <LaunchArgumentsTooltip
                    id="launch-arguments-tooltip"
                    target="server" />
            </div>
        </div>
    )
}

export default observer(AdvancedForm);