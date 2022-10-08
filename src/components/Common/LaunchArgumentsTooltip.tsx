import React from "react";

import Tooltip from "./Tooltip";
import "./LaunchArgumentsTooltip.css";

type LaunchArgumentsTooltipProps = {
  id: string;
  target: "client" | "server";
};

const LaunchArgumentsTooltip: React.FC<LaunchArgumentsTooltipProps> = (
  props
) => (
  <Tooltip className="launch-arguments-tooltip" id={props.id}>
    This option is for power users. The value will be passed to {props.target}
    &apos;s executable as an argument. You can use it to set cvars that are not
    otherwise supported by the launcher.
    <div>Example: -log_enable 1 -log_level 1</div>
  </Tooltip>
);

export default LaunchArgumentsTooltip;
