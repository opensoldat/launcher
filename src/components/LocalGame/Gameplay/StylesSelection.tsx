import React from "react";
import { observer } from "mobx-react";

import { GameStylesSettings } from "src/settings/server";
import Checkbox from "../../Common/Checkbox";

type GameStylesSelectionProps = {
  gameStyles: GameStylesSettings;
};

const GameStylesSelection: React.FC<GameStylesSelectionProps> = (props) => {
  const handleAdvanceToggle = (checked: boolean): void => {
    props.gameStyles.advanceEnabled = checked;
  };

  const handleRealisticToggle = (checked: boolean): void => {
    props.gameStyles.realisticEnabled = checked;
  };

  const handleSurvivalToggle = (checked: boolean): void => {
    props.gameStyles.survivalEnabled = checked;
  };

  return (
    <React.Fragment>
      <Checkbox
        checked={props.gameStyles.realisticEnabled}
        colorTheme="dark"
        rightLabel="Realistic"
        onToggle={handleRealisticToggle}
      />

      <Checkbox
        checked={props.gameStyles.survivalEnabled}
        colorTheme="dark"
        rightLabel="Survival"
        onToggle={handleSurvivalToggle}
      />

      <Checkbox
        checked={props.gameStyles.advanceEnabled}
        colorTheme="dark"
        rightLabel="Advance"
        onToggle={handleAdvanceToggle}
      />
    </React.Fragment>
  );
};

export default observer(GameStylesSelection);
