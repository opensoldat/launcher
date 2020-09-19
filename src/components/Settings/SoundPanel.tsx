import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import Checkbox from "../Common/Checkbox";
import Panel from "../Common/Panel";
import SliderNumberInput from "../Common/SliderNumberInput";
import Spinner from "../Common/Spinner";

import SoundSettingsStore from "../../stores/client/soundSettings";

import "./SettingsPanel.css";

type SoundPanelProps = {
    soundSettingsStore: SoundSettingsStore;
}

const SoundPanel: React.FC<SoundPanelProps> = props => {
    const soundSettings = props.soundSettingsStore.settings;

    if (!props.soundSettingsStore.isLoading && !soundSettings) {
        props.soundSettingsStore.loadSettings();
    }

    const handleBattleSoundEffectsToggle = (checked: boolean): void => {
        soundSettings.battleSoundEffects = checked;
    }

    const handleExplosionsSoundEffectsToggle = (checked: boolean): void => {
        soundSettings.explosionsSoundEffects = checked;
    }

    const handleVolumeChange = (newValue: number): void => {
        soundSettings.volume = newValue;
    }

    const handleRestoreDefaults = (): void => {
        props.soundSettingsStore.restoreDefaultSettings();
    }

    const handleSaveClick = (): void => {
        props.soundSettingsStore.saveSettings()
        .then(function () {
            toast.success("Sound settings saved", { autoClose: 2500 });
        })
        .catch(function (errorMessage: string) {
            toast.error("Could not save sound settings:\n" + errorMessage);
        });
    }

    const isLoading = props.soundSettingsStore.isLoading || !soundSettings;
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
                            htmlFor="volume">
                            Volume
                        </label>
                        <div className="user-input">
                            <SliderNumberInput
                                min={0}
                                max={100}
                                value={soundSettings.volume}
                                onValueChange={handleVolumeChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label
                            className="label"
                            htmlFor="battle-sound-effects">
                            Battle sound effects
                        </label>
                        <div className="user-input">
                            <Checkbox
                                id="battle-sound-effects"
                                colorTheme="dark"
                                checked={soundSettings.battleSoundEffects}
                                onToggle={handleBattleSoundEffectsToggle} />
                        </div>
                    </div>

                    <div className="field">
                        <label
                            className="label"
                            htmlFor="explosions-sound-effects">
                            Explosions sound effects
                        </label>
                        <div className="user-input">
                            <Checkbox
                                id="explosions-sound-effects"
                                colorTheme="dark"
                                checked={soundSettings.explosionsSoundEffects}
                                onToggle={handleExplosionsSoundEffectsToggle} />
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
                    disabled={props.soundSettingsStore.isSaving}
                    className="button green-button save-button">
                    Save sound
                </button> 
            </div>
            }
        </div>
    )
}

export default observer(SoundPanel);