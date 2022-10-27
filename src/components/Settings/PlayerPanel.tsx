import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

import ColorInput from "../Common/ColorInput";
import Panel from "../Common/Panel";
import Select from "../Common/Select";
import Spinner from "../Common/Spinner";

import { HexColor } from "src/types";
import {
  ChainStyles,
  HairStyles,
  HeadStyles,
} from "src/settings/client/player";

import PlayerSettingsStore from "../../stores/settings/client/player";

import "../Common/Form.css";
import "./SettingsPanel.css";
import "./PlayerPanel.css";

type PlayerPanelProps = {
  playerSettingsStore: PlayerSettingsStore;
};

const PlayerPanel: React.FC<PlayerPanelProps> = (props) => {
  const playerSettings = props.playerSettingsStore.settings;

  if (!props.playerSettingsStore.isLoading && !playerSettings) {
    props.playerSettingsStore.loadSettings();
  }

  const handleColorChange = (color: HexColor, fieldName: string): void => {
    switch (fieldName) {
      case "hair-color":
        playerSettings.hairColor = color;
        break;

      case "shirt-color":
        playerSettings.shirtColor = color;
        break;

      case "skin-color":
        playerSettings.skinColor = color;
        break;

      case "pants-color":
        playerSettings.pantsColor = color;
        break;

      case "jet-color":
        playerSettings.jetColor = color;
        break;
    }
  };

  const handleNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    playerSettings.nickname = event.target.value;
  };

  const handleRestoreDefaults = (): void => {
    props.playerSettingsStore.restoreDefaultSettings();
  };

  const handleSelectChange = (newValue: string, fieldName?: string): void => {
    switch (fieldName) {
      case "head-style":
        playerSettings.headStyle = Number(newValue) as HeadStyles;
        break;

      case "hair-style":
        playerSettings.hairStyle = Number(newValue) as HairStyles;
        break;

      case "chain-style":
        playerSettings.chainStyle = Number(newValue) as ChainStyles;
        break;
    }
  };

  const handleSaveClick = (): void => {
    /* React docs mention the necessity of canceling all promises, clearing timers, etc...
     * when the component gets unmounted, so that callbacks don't get executed after
     * unmounting. The docs mention a risk of memory leaks, especially in the case of
     * calling this.setState in those callbacks. However, I didn't notice any issues related
     * to memory usage while testing with Chromium's DevTools; so, I assume it should be fine
     * to not cancel async calls, as long as callbacks don't try to access component's props
     * or state.
     * In below case, we only call toast functions, without accessing props or state.
     *
     * Overall, it seems best to have toast calls inside components. Other approaches include
     * calling toast functions from MobX stores, but that would violate separation of concerns;
     * another option would be to set up MobX reactions in App component and change stores'
     * implementations, but that would probably affect code readability in a negative way.
     */
    props.playerSettingsStore
      .saveSettings()
      .then(function () {
        toast.success("Player settings saved", { autoClose: 2500 });
      })
      .catch(function (errorMessage: string) {
        toast.error("Could not save player settings:\n" + errorMessage);
      });
  };

  const isLoading = props.playerSettingsStore.isLoading || !playerSettings;

  return (
    <div className="settings-panel-container">
      <Panel>
        {isLoading ? (
          <div className="centered-spinner">
            <Spinner />
          </div>
        ) : (
          <div className="form">
            <div className="field">
              <label className="label" htmlFor="nickname">
                Nickname
              </label>
              <div className="user-input">
                <div className="full-width">
                  <input
                    id="nickname"
                    type="text"
                    spellCheck="false"
                    className="nickname"
                    value={playerSettings.nickname}
                    onChange={handleNicknameChange}
                  ></input>

                  {props.playerSettingsStore.settings.nicknameError &&
                    props.playerSettingsStore.settings.nicknameError.length >
                      0 && (
                      <div className="error-message">
                        {props.playerSettingsStore.settings.nicknameError}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="fields-group">
              <div className="title">COLORS</div>

              <div className="field">
                <label className="label" htmlFor="hair-color">
                  Hair
                </label>
                <div className="user-input">
                  <ColorInput
                    id="hair-color"
                    name="hair-color"
                    color={playerSettings.hairColor}
                    onColorChange={handleColorChange}
                    colorPickerHeader="Hair color"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="shirt-color">
                  Shirt
                </label>
                <div className="user-input">
                  <ColorInput
                    id="shirt-color"
                    name="shirt-color"
                    color={playerSettings.shirtColor}
                    onColorChange={handleColorChange}
                    colorPickerHeader="Shirt color"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="skin-color">
                  Skin
                </label>
                <div className="user-input">
                  <ColorInput
                    id="skin-color"
                    name="skin-color"
                    color={playerSettings.skinColor}
                    onColorChange={handleColorChange}
                    colorPickerHeader="Skin color"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="pants-color">
                  Pants
                </label>
                <div className="user-input">
                  <ColorInput
                    id="pants-color"
                    name="pants-color"
                    color={playerSettings.pantsColor}
                    onColorChange={handleColorChange}
                    colorPickerHeader="Pants color"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="jet-color">
                  Jet flames
                </label>
                <div className="user-input">
                  <ColorInput
                    id="jet-color"
                    name="jet-color"
                    color={playerSettings.jetColor}
                    onColorChange={handleColorChange}
                    colorPickerHeader="Jet color"
                  />
                </div>
              </div>
            </div>

            <div className="fields-group">
              <div className="title">HEAD</div>

              <div className="field">
                <label className="label">Headwear</label>
                <div className="user-input">
                  <Select
                    name="head-style"
                    menuPlacement="top"
                    options={[
                      { value: HeadStyles.None.toString(), label: "None" },
                      { value: HeadStyles.Helmet.toString(), label: "Helmet" },
                      { value: HeadStyles.Hat.toString(), label: "Hat" },
                    ]}
                    selectedValue={playerSettings.headStyle.toString()}
                    onSelectedChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Hair</label>
                <div className="user-input">
                  <Select
                    name="hair-style"
                    menuPlacement="top"
                    options={[
                      { value: HairStyles.Army.toString(), label: "Army" },
                      {
                        value: HairStyles.Dreadlocks.toString(),
                        label: "Dreadlocks",
                      },
                      { value: HairStyles.Punk.toString(), label: "Punk" },
                      { value: HairStyles.MrT.toString(), label: "Mr. T" },
                      { value: HairStyles.Normal.toString(), label: "Normal" },
                    ]}
                    selectedValue={playerSettings.hairStyle.toString()}
                    onSelectedChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Chain</label>
                <div className="user-input">
                  <Select
                    name="chain-style"
                    menuPlacement="top"
                    options={[
                      { value: ChainStyles.None.toString(), label: "None" },
                      {
                        value: ChainStyles.DogTags.toString(),
                        label: "Dog Tags",
                      },
                      { value: ChainStyles.Gold.toString(), label: "Gold" },
                    ]}
                    selectedValue={playerSettings.chainStyle.toString()}
                    onSelectedChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Panel>

      {!isLoading && (
        <div className="action-buttons">
          <button
            className="button grey-button"
            onClick={handleRestoreDefaults}
          >
            Restore defaults
          </button>

          <button
            onClick={handleSaveClick}
            disabled={props.playerSettingsStore.isSaving}
            className="button green-button save-button"
          >
            {/* Showing a spinner doesn't seem necessary, as saving file to disk is really quick.
             * To me it actually looked worse with a spinner that blinked for a few milliseconds. */}
            Save player
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(PlayerPanel);
