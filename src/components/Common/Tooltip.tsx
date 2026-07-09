import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import "./Tooltip.css";

type TooltipProps = {
  className?: string;
  clickable?: boolean;
  id?: string;
  place?: "top" | "bottom" | "left" | "right";
  hidden?: boolean;
  afterHide?: () => void;

  children: React.ReactNode;
};

/* This component is a wrapper for ReactTooltip, mostly for the sake
 * of providing a common styling that will be consistent across the app.
 * If you need more control, either add additional properties to
 * TooltipProps, or use ReactTooltip directly. */
const Tooltip: React.FC<TooltipProps> = (props) => (
  <ReactTooltip
    className={"tooltip " + (props.className ? props.className : "")}
    clickable={props.clickable}
    id={props.id}
    place={props.place || "top"}
    variant="light"
    hidden={props.hidden}
    afterHide={props.afterHide}
  >
    {props.children}
  </ReactTooltip>
);

export default Tooltip;
