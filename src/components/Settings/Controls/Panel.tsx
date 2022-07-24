import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import { CommonGameCommands, CommonKeyBinding } from "src/types";
import ControlsWrapperStore from "src/stores/settings/client/controlsWrapper";

import CommonBindingField from "./CommonBindingField";
import CustomBindingsTable from "./CustomBindingsTable";
import Panel from "../../Common/Panel";
import SliderNumberInput from "../../Common/SliderNumberInput";
import Spinner from "../../Common/Spinner";

import "../../Common/Form.css";
import "../SettingsPanel.css";
import "./Panel.css";

type ControlsPanelProps = {
    controlsWrapperStore: ControlsWrapperStore;
}

const ControlsPanel: React.FC<ControlsPanelProps> = props => {
    if (!props.controlsWrapperStore.isLoading && !props.controlsWrapperStore.gotData) {
        props.controlsWrapperStore.loadAll();
    }
    const controlsSettings = props.controlsWrapperStore.controlsSettings;
    const customBindings = props.controlsWrapperStore.customBindings;

    const handleCustomAdd = (): void => {
        customBindings.addEmpty();
    }

    const handleCustomCommandChange = React.useCallback(
        (bindingId: string, newCommand: string): void => {
            customBindings.setCommand(bindingId, newCommand);
        },
        [customBindings]
    )

    const handleCustomDelete = React.useCallback(
        (bindingId: string): void => {
            customBindings.delete(bindingId);
        },
        [customBindings]
    )

    const handleKeyChange = React.useCallback(
        (bindingId: string, newKey: string): void => {
            props.controlsWrapperStore.setBindingKey(bindingId, newKey);
        },
        [props.controlsWrapperStore]
    )

    const handleMouseSensitivityChange = (newValue: number): void => {
        controlsSettings.mouseSensitivity = newValue;
    }

    const handleRestoreDefaults = (): void => {
        props.controlsWrapperStore.restoreDefaults();
    }

    const handleSaveClick = (): void => {
        props.controlsWrapperStore.saveAll()
        .then(function () {
            toast.success("Controls settings saved", { autoClose: 2500 });
        })
        .catch(function (errorMessage: string) {
            toast.error("Could not save controls settings:\n" + errorMessage);
        });
    }

    const getCommonBinding = (command: CommonGameCommands): CommonKeyBinding => {
        return controlsSettings.getBindingByCommand(command);
    }

    const renderCommonBindingField = (command: CommonGameCommands, label: string): JSX.Element => {
        return (
            <CommonBindingField
                key={command}
                binding={getCommonBinding(command)}
                label={label}
                onKeyChange={handleKeyChange} />
        )
    }

    const isLoading = props.controlsWrapperStore.isLoading;
    return (
        <div className="settings-panel-container">
            <Panel>
            {isLoading
            ?   <div className="centered-spinner">
                    <Spinner />
                </div>
            :   <div className="form controls-form">
                    <div className="fields-group">
                        <div className="title">MOUSE</div>

                        <div className="field">
                            <label className="label" htmlFor="mouse-sensitivity">
                                Sensitivity
                            </label>
                            <div className="user-input">
                                <SliderNumberInput
                                    id="mouse-sensitivity"
                                    min={0}
                                    max={100}
                                    value={controlsSettings.mouseSensitivity}
                                    onValueChange={handleMouseSensitivityChange} />
                            </div>
                        </div>
                    </div>

                    <div className="fields-group">
                        <div className="title">MOVEMENT</div>

                        {renderCommonBindingField(CommonGameCommands.Left, "Walk left")}
                        {renderCommonBindingField(CommonGameCommands.Right, "Walk right")}
                        {renderCommonBindingField(CommonGameCommands.Jump, "Jump")}
                        {renderCommonBindingField(CommonGameCommands.Crouch, "Crouch")}
                        {renderCommonBindingField(CommonGameCommands.Prone, "Prone")}
                        {renderCommonBindingField(CommonGameCommands.Jet, "Jet")}
                    </div>

                    <div className="fields-group">
                        <div className="title">COMBAT</div>

                        {renderCommonBindingField(CommonGameCommands.Fire, "Fire")}
                        {renderCommonBindingField(CommonGameCommands.Reload, "Reload")}
                        {renderCommonBindingField(CommonGameCommands.ChangeWeapon, "Switch weapon")}
                        {renderCommonBindingField(CommonGameCommands.DropWeapon, "Drop weapon")}
                        {renderCommonBindingField(CommonGameCommands.ThrowGrenade, "Throw grenade")}
                    </div>

                    <div className="fields-group">
                        <div className="title">COMMUNICATION</div>

                        {renderCommonBindingField(CommonGameCommands.Chat, "Chat")}
                        {renderCommonBindingField(CommonGameCommands.TeamChat, "Team chat")}
                        {renderCommonBindingField(CommonGameCommands.Radio, "Radio menu")}
                        {renderCommonBindingField(CommonGameCommands.Cmd, "Command")}
                    </div>

                    <div className="fields-group">
                        <div className="title">SPECTATOR</div>

                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToRedFlag, "Switch camera to red flag")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToBlueFlag, "Switch camera to blue flag")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToYellowFlag, "Switch camera to yellow flag (point match)")}

                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToPlayer1, "Switch camera to player with ID 1")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToPlayer2, "Switch camera to player with ID 2")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToPlayer3, "Switch camera to player with ID 3")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToPlayer4, "Switch camera to player with ID 4")}
                        {renderCommonBindingField(CommonGameCommands.SwitchCameraToPlayer5, "Switch camera to player with ID 5")}
                    </div>

                    <div className="fields-group">
                        <div className="title">OTHER</div>

                        {renderCommonBindingField(CommonGameCommands.ThrowFlag, "Throw flag")}
                        {renderCommonBindingField(CommonGameCommands.WeaponsMenu, "Toggle weapons menu")}
                        {renderCommonBindingField(CommonGameCommands.FragsList, "Frags list")}
                        {renderCommonBindingField(CommonGameCommands.StatsMenu, "Stats menu")}
                        {renderCommonBindingField(CommonGameCommands.MiniMap, "Mini map")}
                        {renderCommonBindingField(CommonGameCommands.GameStats, "Game stats menu")}
                        {renderCommonBindingField(CommonGameCommands.RecordDemo, "Record demo")}
                        {renderCommonBindingField(CommonGameCommands.Screenshot, "Take screenshot")}
                    </div>

                    <div className="fields-group">
                        <div className="title">CUSTOM BINDINGS</div>

                        <div className="custom-bindings-description">
                            The list below lets you configure hotkeys for OpenSoldat commands. You can
                            use any command that you would normally type in the game (by using
                            the {getCommonBinding(CommonGameCommands.Cmd).key || "/"} key). To view
                            the list of available commands, type &quot;cmdlist&quot; as a command inside the game. 
                        </div>

                        <CustomBindingsTable
                            customBindings={customBindings.bindings}
                            onCommandChange={handleCustomCommandChange}
                            onDelete={handleCustomDelete}
                            onKeyChange={handleKeyChange} />
                    </div>
                </div>
            }
            </Panel>

            {!isLoading &&
            <div className="action-buttons">
                <button
                    className="button grey-button"
                    onClick={handleRestoreDefaults}>
                    Restore defaults
                </button>

                <div>
                    <button
                        className="button grey-button"
                        onClick={handleCustomAdd}>
                        Add binding
                    </button>

                    <button
                        className="button green-button save-button"
                        disabled={props.controlsWrapperStore.isSaving}
                        onClick={handleSaveClick}>
                        Save controls
                    </button>
                </div>
            </div>
            }
        </div>
    )
}

export default observer(ControlsPanel);