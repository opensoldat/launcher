import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import CommonBindingField from "./CommonBindingField";
import CustomBindingsTable from "./CustomBindingsTable";
import Panel from "../../Common/Panel";
import SliderNumberInput from "../../Common/SliderNumberInput";
import Spinner from "../../Common/Spinner";

import ControlsSettingsStore from "../../../stores/client/controlsSettings";
import { CommonGameCommands, CommonKeyBinding } from "../../../types";

import "../../Common/Form.css";
import "../SettingsPanel.css";
import "./Panel.css";

type ControlsPanelProps = {
    controlsSettingsStore: ControlsSettingsStore;
}

const ControlsPanel: React.FC<ControlsPanelProps> = props => {
    if (!props.controlsSettingsStore.isLoading && !props.controlsSettingsStore.settings) {
        props.controlsSettingsStore.loadSettings();
    }

    const getCommonBinding = (command: CommonGameCommands): CommonKeyBinding => {
        return props.controlsSettingsStore.getCommonBinding(command);
    }

    const handleCustomAdd = (): void => {
        props.controlsSettingsStore.addCustomBinding();
    }

    const handleCustomCommandChange = React.useCallback(
        (bindingId: string, newCommand: string): void => {
            props.controlsSettingsStore.setCustomBindingCommand(bindingId, newCommand);
        },
        [props.controlsSettingsStore]
    )

    const handleCustomDelete = React.useCallback(
        (bindingId: string): void => {
            props.controlsSettingsStore.deleteCustomBinding(bindingId);
        },
        [props.controlsSettingsStore]
    )

    const handleKeyChange = React.useCallback(
        (bindingId: string, newKey: string): void => {
            props.controlsSettingsStore.setBindingKey(bindingId, newKey);
        },
        [props.controlsSettingsStore]
    )

    const handleMouseSensitivityChange = (newValue: number): void => {
        props.controlsSettingsStore.settings.mouseSensitivity = newValue;
    }

    const handleRestoreDefaults = (): void => {
        props.controlsSettingsStore.restoreDefaultSettings();
    }

    const handleSaveClick = (): void => {
        props.controlsSettingsStore.saveSettings()
        .then(function () {
            toast.success("Controls settings saved", { autoClose: 2500 });
        })
        .catch(function (errorMessage: string) {
            toast.error("Could not save controls settings:\n" + errorMessage);
        });
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

    const isLoading = props.controlsSettingsStore.isLoading || !props.controlsSettingsStore.settings;
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
                                    value={props.controlsSettingsStore.settings.mouseSensitivity}
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
                        <div className="title">OTHER</div>

                        {renderCommonBindingField(CommonGameCommands.ThrowFlag, "Throw flag")}
                        {renderCommonBindingField(CommonGameCommands.WeaponsMenu, "Toggle weapons menu")}
                        {renderCommonBindingField(CommonGameCommands.FragsList, "Frags list")}
                        {renderCommonBindingField(CommonGameCommands.StatsMenu, "Stats menu")}
                        {renderCommonBindingField(CommonGameCommands.MiniMap, "Mini map")}
                        {renderCommonBindingField(CommonGameCommands.GameStats, "Game stats menu")}
                    </div>

                    <div className="fields-group">
                        <div className="title">CUSTOM BINDINGS</div>

                        <div className="custom-bindings-description">
                            The list below lets you configure hotkeys for Soldat commands. You can
                            use any command that you would normally type in the game (by using
                            the {getCommonBinding(CommonGameCommands.Cmd).key || "/"} key). To view
                            the list of available commands, type &quot;cmdlist&quot; as a command inside the game. 
                        </div>

                        <CustomBindingsTable
                            customBindings={props.controlsSettingsStore.settings.customBindings}
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
                        disabled={props.controlsSettingsStore.isSaving}
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