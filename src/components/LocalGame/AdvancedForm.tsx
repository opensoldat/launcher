import { observer } from "mobx-react";
import React from "react";
import NetworkSettings from "src/settings/server/network";

type AdvancedFormProps = {
    networkSettings: NetworkSettings;
}

const AdvancedForm: React.FC<AdvancedFormProps> = props => {
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
        </div>
    )
}

export default observer(AdvancedForm);