import React from "react";
import { observer } from "mobx-react";

import Checkbox from "../../Common/Checkbox";
import Select from "../../Common/Select";
import Tooltip from "../../Common/Tooltip";

import ServerFiltersStore, {
  GameModeFilterOptions,
  GameStyleFilterOptions,
  PlayersFilterOptions,
} from "../../../stores/lobby/filters";

import "./FiltersTooltip.css";

type FiltersTooltipProps = {
  id?: string;
  serverFiltersStore: ServerFiltersStore;
};

const FiltersTooltip: React.FC<FiltersTooltipProps> = (props) => {
  const [isHidden, setIsHidden] = React.useState(false);

  const closeTooltip = (): void => {
    setIsHidden(true);
  };

  const handleCheckboxToggle = (checked: boolean, fieldName?: string): void => {
    switch (fieldName) {
      case "no-password":
        props.serverFiltersStore.noPassword = checked;
        break;

      case "no-bots":
        props.serverFiltersStore.noBots = checked;
        break;
    }
  };

  const handleSelectChange = (newValue: string, fieldName?: string): void => {
    switch (fieldName) {
      case "players-filter":
        props.serverFiltersStore.players = Number(
          newValue,
        ) as PlayersFilterOptions;
        break;

      case "game-mode-filter":
        props.serverFiltersStore.gameMode = Number(
          newValue,
        ) as GameModeFilterOptions;
        break;

      case "game-style-filter":
        props.serverFiltersStore.gameStyle = Number(
          newValue,
        ) as GameStyleFilterOptions;
        break;
    }
  };

  const resetFilters = (): void => {
    props.serverFiltersStore.setDefaultFilters();
  };

  return (
    <Tooltip
      className="filters-tooltip"
      clickable={true}
      id={props.id}
      place="bottom"
      hidden={isHidden}
      afterHide={() => setIsHidden(false)}
    >
      <div className="filter-field">
        <label className="label"> Players </label>
        <div className="user-input">
          <Select
            name="players-filter"
            menuPosition="fixed"
            options={[
              { value: PlayersFilterOptions.Any.toString(), label: "Any" },
              {
                value: PlayersFilterOptions.NotEmpty.toString(),
                label: "Not empty",
              },
              {
                value: PlayersFilterOptions.NotFull.toString(),
                label: "Not full",
              },
              {
                value: PlayersFilterOptions.NotEmptyAndNotFull.toString(),
                label: "Not empty and not full",
              },
            ]}
            selectedValue={props.serverFiltersStore.players.toString()}
            onSelectedChange={handleSelectChange}
          />
        </div>
      </div>

      <div className="filter-field">
        <label className="label"> Game mode </label>
        <div className="user-input">
          <Select
            name="game-mode-filter"
            menuPosition="fixed"
            options={[
              { value: GameModeFilterOptions.Any.toString(), label: "Any" },
              {
                value: GameModeFilterOptions.CaptureTheFlag.toString(),
                label: "Capture the flag",
              },
              {
                value: GameModeFilterOptions.DeathMatch.toString(),
                label: "Deathmatch",
              },
              {
                value: GameModeFilterOptions.HoldTheFlag.toString(),
                label: "Hold the flag",
              },
              {
                value: GameModeFilterOptions.Infiltration.toString(),
                label: "Infiltration",
              },
              {
                value: GameModeFilterOptions.PointMatch.toString(),
                label: "Pointmatch",
              },
              {
                value: GameModeFilterOptions.RamboMatch.toString(),
                label: "Rambomatch",
              },
              {
                value: GameModeFilterOptions.TeamDeathMatch.toString(),
                label: "Team deathmatch",
              },
            ]}
            selectedValue={props.serverFiltersStore.gameMode.toString()}
            onSelectedChange={handleSelectChange}
          />
        </div>
      </div>

      <div className="filter-field">
        <label className="label"> Game style </label>
        <div className="user-input">
          <Select
            name="game-style-filter"
            menuPosition="fixed"
            options={[
              { value: GameStyleFilterOptions.Any.toString(), label: "Any" },
              {
                value: GameStyleFilterOptions.Advance.toString(),
                label: "Advance",
              },
              {
                value: GameStyleFilterOptions.Realistic.toString(),
                label: "Realistic",
              },
              {
                value: GameStyleFilterOptions.Survival.toString(),
                label: "Survival",
              },
            ]}
            selectedValue={props.serverFiltersStore.gameStyle.toString()}
            onSelectedChange={handleSelectChange}
          />
        </div>
      </div>

      <div className="filter-field">
        <label className="label" htmlFor="no-password">
          No password
        </label>
        <div className="user-input">
          <Checkbox
            id="no-password"
            name="no-password"
            colorTheme="light"
            checked={props.serverFiltersStore.noPassword}
            onToggle={handleCheckboxToggle}
          />
        </div>
      </div>

      <div className="filter-field">
        <label className="label" htmlFor="no-bots">
          No bots
        </label>
        <div className="user-input">
          <Checkbox
            id="no-bots"
            name="no-bots"
            colorTheme="light"
            checked={props.serverFiltersStore.noBots}
            onToggle={handleCheckboxToggle}
          />
        </div>
      </div>

      <div className="buttons">
        <button className="button red-button" onClick={resetFilters}>
          Reset filters
        </button>

        <button className="button grey-button" onClick={closeTooltip}>
          Close
        </button>
      </div>
    </Tooltip>
  );
};

export default observer(FiltersTooltip);
