import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import GraphicsSettingsStore from "src/stores/settings/client/graphics";
import InterfacesStore from "src/stores/interfaces";
import { DisplayModes } from "src/settings/client/graphics";

import Checkbox from "../Common/Checkbox";
import ColorInput from "../Common/ColorInput";
import Panel from "../Common/Panel";
import ResolutionSelect from "./ResolutionSelect";
import Select from "../Common/Select";
import SliderNumberInput from "../Common/SliderNumberInput";
import Spinner from "../Common/Spinner";

import "../Common/Form.css";
import "./SettingsPanel.css";
import InlineRefreshButton from "../Common/InlineRefreshButton";

type GraphicsPanelProps = {
    graphicsSettingsStore: GraphicsSettingsStore;
    interfacesStore: InterfacesStore;
}

const GraphicsPanel: React.FC<GraphicsPanelProps> = props => {
    if (!props.graphicsSettingsStore.isLoading && !props.graphicsSettingsStore.settings) {
        props.graphicsSettingsStore.loadSettings();
    }

    if (!props.interfacesStore.isLoading && !props.interfacesStore.gotInterfaces) {
        props.interfacesStore.loadInterfaces();
    }

    const graphicsSettings = props.graphicsSettingsStore.settings;

    const handleDisplayModeChange = (newValue: string): void => {
        graphicsSettings.displayMode = Number(newValue) as DisplayModes;
    }

    const handleForceBackgroundToggle = (checked: boolean): void => {
        graphicsSettings.forceBackground = checked;
    }

    const handleBackgroundColorChange = (color: string, fieldName: string): void => {
        switch (fieldName) {
            case "background-top-color":
                graphicsSettings.forcedBackgroundTopColor = color;
                break;
            case "background-bottom-color":
                graphicsSettings.forcedBackgroundBottomColor = color;
        }
    }

    const handleBackgroundSceneriesToggle = (checked: boolean): void => {
        graphicsSettings.backgroundSceneries = checked;
    }

    const handleLimitFPSToggle = (checked: boolean): void => {
        graphicsSettings.limitFPS = checked;
    }

    const handleMaxFPSChange = (newValue: number): void => {
        graphicsSettings.maxFPS = newValue;
    }

    const handleSmoothEdgesToggle = (checked: boolean): void => {
        graphicsSettings.smoothEdges = checked;
    }

    const handleWeatherEffectsToggle = (checked: boolean): void => {
        graphicsSettings.weatherEffects = checked;
    }

    const handleInterfaceStyleChange = (newStyle: string): void => {
        graphicsSettings.interfaceStyle = newStyle;
    }

    const handleScaleInterfaceToggle = (checked: boolean): void => {
        graphicsSettings.scaleInterface = checked;
    }

    const handlePlayerIndicatorToggle = (checked: boolean): void => {
        graphicsSettings.playerIndicator = checked;
    }

    const handleClientSniperlineToggle = (checked: boolean): void => {
        graphicsSettings.clientSniperline = checked;
    }

    const handleKillsListToggle = (checked: boolean): void => {
        graphicsSettings.killsList = checked;
    }

    const handleVerticalSyncToggle = (checked: boolean): void => {
        graphicsSettings.verticalSync = checked;
    }

    const handleDitheringToggle = (checked: boolean): void => {
        graphicsSettings.dithering = checked;
    }

    const handleRestoreDefaults = (): void => {
        props.graphicsSettingsStore.restoreDefaultSettings();
    }

    const handleSaveClick = (): void => {
        props.graphicsSettingsStore.saveSettings()
        .then(function () {
            toast.success("Graphics settings saved", { autoClose: 2500 });
        })
        .catch(function (errorMessage: string) {
            toast.error("Could not save graphics settings:\n" + errorMessage);
        });
    }

    const isLoading = props.graphicsSettingsStore.isLoading || !graphicsSettings;
    const showInterfacesSpinner = props.interfacesStore.isLoading ||
        !props.interfacesStore.gotInterfaces;

    return (
        <div className="settings-panel-container">
            <Panel>
            {isLoading
            ?   <div className="centered-spinner">
                    <Spinner />
                </div>
            :   <div className="form">
                    <div className="field">
                        <label
                            className="label"
                            htmlFor="display-mode">
                            Display mode
                        </label>
                        <div className="user-input">
                            <Select
                                options={[
                                    {value: DisplayModes.Window.toString(), label: "Window"},
                                    {value: DisplayModes.FullscreenWindow.toString(), label: "Fullscreen window"},
                                    {value: DisplayModes.Fullscreen.toString(), label: "Fullscreen"}
                                ]}
                                selectedValue={graphicsSettings.displayMode.toString()}
                                onSelectedChange={handleDisplayModeChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label
                            className="label"
                            htmlFor="resolution">
                            Resolution
                        </label>
                        <div className="user-input">
                            <ResolutionSelect resolution={graphicsSettings.resolution} />
                        </div>
                    </div>

                    <div className="fields-group">
                        <div className="title">GENERAL</div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="weather-effects">
                                Render weather effects
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="weather-effects"
                                    colorTheme="dark"
                                    checked={graphicsSettings.weatherEffects}
                                    onToggle={handleWeatherEffectsToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="smooth-edges">
                                Render smooth polygons
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="smooth-edges"
                                    colorTheme="dark"
                                    checked={graphicsSettings.smoothEdges}
                                    onToggle={handleSmoothEdgesToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="background-sceneries">
                                Render background sceneries
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="background-sceneries"
                                    colorTheme="dark"
                                    checked={graphicsSettings.backgroundSceneries}
                                    onToggle={handleBackgroundSceneriesToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="force-background-color">
                                Force background color
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="force-background-color"
                                    colorTheme="dark"
                                    checked={graphicsSettings.forceBackground}
                                    onToggle={handleForceBackgroundToggle} />
                            </div>
                        </div>

                        {graphicsSettings.forceBackground &&
                        <React.Fragment>
                            <div className="field">
                                <label
                                    className="label"
                                    htmlFor="background-top-color">
                                    Background top color
                                </label>
                                <div className="user-input">
                                    <ColorInput
                                        id="background-top-color"
                                        name="background-top-color"
                                        color={graphicsSettings.forcedBackgroundTopColor}
                                        onColorChange={handleBackgroundColorChange} />
                                </div>
                            </div>

                            <div className="field">
                                <label
                                    className="label"
                                    htmlFor="background-bottom-color">
                                    Background bottom color
                                </label>
                                <div className="user-input">
                                    <ColorInput
                                        id="background-bottom-color"
                                        name="background-bottom-color"
                                        color={graphicsSettings.forcedBackgroundBottomColor}
                                        onColorChange={handleBackgroundColorChange} />
                                </div>
                            </div>
                        </React.Fragment>
                        }

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="limit-fps">
                                Limit frames per second
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="limit-fps"
                                    colorTheme="dark"    
                                    checked={graphicsSettings.limitFPS}
                                    onToggle={handleLimitFPSToggle} />
                            </div>
                        </div>

                        {graphicsSettings.limitFPS &&
                        <div className="field">
                            <label
                                className="label"
                                htmlFor="max-fps">
                                Max frames per second
                            </label>
                            <div className="user-input">
                                <SliderNumberInput
                                    id="max-fps"
                                    min={1}
                                    max={500}
                                    value={props.graphicsSettingsStore.settings.maxFPS}
                                    onValueChange={handleMaxFPSChange} />
                            </div>
                        </div>
                        }
                    </div>

                    <div className="fields-group">
                        <div className="title">INTERFACE</div>

                        <div className="field">
                            <label className="label"> Style </label>
                            <div className="user-input">
                            {showInterfacesSpinner
                            ?   <div className="centered-spinner">
                                    <Spinner />
                                </div>
                            :   <div className="inline">
                                    <Select
                                        options={props.interfacesStore.selectOptions}
                                        selectedValue={graphicsSettings.interfaceStyle}
                                        onSelectedChange={handleInterfaceStyleChange} />
                                    <InlineRefreshButton onClick={(): void => props.interfacesStore.loadInterfaces()} />
                                </div>
                            }
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="scale-interface">
                                Scale interface
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="scale-interface"
                                    colorTheme="dark"
                                    checked={graphicsSettings.scaleInterface}
                                    onToggle={handleScaleInterfaceToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="player-indicator">
                                Display player indicator
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="player-indicator"
                                    colorTheme="dark"
                                    checked={graphicsSettings.playerIndicator}
                                    onToggle={handlePlayerIndicatorToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="client-sniperline">
                                Display sniperline (if server allows it)
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="client-sniperline"
                                    colorTheme="dark"
                                    checked={graphicsSettings.clientSniperline}
                                    onToggle={handleClientSniperlineToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="kills-list">
                                Display kills list
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="kills-list"
                                    colorTheme="dark"
                                    checked={graphicsSettings.killsList}
                                    onToggle={handleKillsListToggle} />
                            </div>
                        </div>
                    </div>

                    <div className="fields-group">
                        <div className="title">ADVANCED</div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="vertical-sync">
                                Vertical sync
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="vertical-sync"
                                    colorTheme="dark"
                                    checked={graphicsSettings.verticalSync}
                                    onToggle={handleVerticalSyncToggle} />
                            </div>
                        </div>

                        <div className="field">
                            <label
                                className="label"
                                htmlFor="dithering">
                                Dithering
                            </label>
                            <div className="user-input">
                                <Checkbox
                                    id="dithering"
                                    colorTheme="dark"
                                    checked={graphicsSettings.dithering}
                                    onToggle={handleDitheringToggle} />
                            </div>
                        </div>
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

                <button
                    onClick={handleSaveClick}
                    disabled={props.graphicsSettingsStore.isSaving}
                    className="button green-button save-button">
                    Save graphics
                </button> 
            </div>
            }
        </div>
    )
}

export default observer(GraphicsPanel);
