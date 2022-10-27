import React from "react";
import { observer } from "mobx-react";

import Checkbox from "../Common/Checkbox";
import Select from "../Common/Select";
import SliderNumberInput from "../Common/SliderNumberInput";

import { GameModes } from "src/types";
import ServerSettings, { BotDifficulties } from "src/settings/server";

import "./BotsForm.css";

type BotsFormProps = {
  serverSettings: ServerSettings;
};

const BotsForm: React.FC<BotsFormProps> = (props) => {
  const isTeamGameMode = props.serverSettings.isTeamGameMode;

  const displayAlphaField = isTeamGameMode;
  const displayBravoField = isTeamGameMode;
  const displayCharlieField =
    props.serverSettings.gameplay.mode === GameModes.TeamDeathMatch;
  const displayDeltaField =
    props.serverSettings.gameplay.mode === GameModes.TeamDeathMatch;
  const displayNoTeamField = !isTeamGameMode;

  const bots = props.serverSettings.bots;

  const handleBotsCountChange = (
    newBotsCount: number,
    inputFieldName: string
  ): void => {
    switch (inputFieldName) {
      case "alpha-bots":
        bots.alpha = newBotsCount;
        break;
      case "bravo-bots":
        bots.bravo = newBotsCount;
        break;
      case "charlie-bots":
        bots.charlie = newBotsCount;
        break;
      case "delta-bots":
        bots.delta = newBotsCount;
        break;
      case "no-team-bots":
        bots.noTeam = newBotsCount;
        break;
    }
  };

  const handleBotsChatToggle = (checked: boolean): void => {
    bots.chat = checked;
  };

  const handleBotsDifficultyChange = (newValue: string): void => {
    bots.difficulty = Number(newValue) as BotDifficulties;
  };

  return (
    <div className="form">
      {displayAlphaField && (
        <div className="field alpha">
          <label className="label" htmlFor="alpha-bots">
            Alpha
          </label>
          <div className="user-input">
            <SliderNumberInput
              min={0}
              max={30}
              value={bots.alpha}
              onValueChange={handleBotsCountChange}
              id="alpha-bots"
              name="alpha-bots"
            />
          </div>
        </div>
      )}

      {displayBravoField && (
        <div className="field bravo">
          <label className="label" htmlFor="bravo-bots">
            Bravo
          </label>
          <div className="user-input">
            <SliderNumberInput
              min={0}
              max={30}
              value={bots.bravo}
              onValueChange={handleBotsCountChange}
              id="bravo-bots"
              name="bravo-bots"
            />
          </div>
        </div>
      )}

      {displayCharlieField && (
        <div className="field charlie">
          <label className="label" htmlFor="charlie-bots">
            Charlie
          </label>
          <div className="user-input">
            <SliderNumberInput
              min={0}
              max={30}
              value={bots.charlie}
              onValueChange={handleBotsCountChange}
              id="charlie-bots"
              name="charlie-bots"
            />
          </div>
        </div>
      )}

      {displayDeltaField && (
        <div className="field delta">
          <label className="label" htmlFor="delta-bots">
            Delta
          </label>
          <div className="user-input">
            <SliderNumberInput
              min={0}
              max={30}
              value={bots.delta}
              onValueChange={handleBotsCountChange}
              id="delta-bots"
              name="delta-bots"
            />
          </div>
        </div>
      )}

      {displayNoTeamField && (
        <div className="field">
          <label className="label" htmlFor="no-team-bots">
            Count
          </label>
          <div className="user-input">
            <SliderNumberInput
              min={0}
              max={30}
              value={bots.noTeam}
              onValueChange={handleBotsCountChange}
              id="no-team-bots"
              name="no-team-bots"
            />
          </div>
        </div>
      )}

      {props.serverSettings.botsCountError && (
        <div className="bots-count-error-message error-message">
          {props.serverSettings.botsCountError}
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor="bots-difficulty">
          Difficulty
        </label>
        <div className="user-input">
          <Select
            options={[
              { value: BotDifficulties.Stupid.toString(), label: "Stupid" },
              { value: BotDifficulties.Poor.toString(), label: "Poor" },
              { value: BotDifficulties.Normal.toString(), label: "Normal" },
              { value: BotDifficulties.Hard.toString(), label: "Hard" },
              {
                value: BotDifficulties.Impossible.toString(),
                label: "Impossible",
              },
            ]}
            selectedValue={bots.difficulty.toString()}
            onSelectedChange={handleBotsDifficultyChange}
            menuPlacement="top"
          />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="bots-chat">
          Allow chat
        </label>
        <div className="user-input">
          <Checkbox
            id="bots-chat"
            colorTheme="dark"
            checked={bots.chat}
            onToggle={handleBotsChatToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(BotsForm);
