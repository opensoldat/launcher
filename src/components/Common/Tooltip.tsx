import React from "react";
import ReactTooltip from "react-tooltip";

import "./Tooltip.css";

type TooltipProps = {
    className?: string;
    clickable?: boolean;
    id?: string;
    place?: "top" | "bottom" | "left" | "right";
    tooltipRef?: React.RefObject<ReactTooltip>;

    children: React.ReactNode;
}

/* This component is a wrapper for ReactTooltip, mostly for the sake
 * of providing a common styling that will be consistent across the app.
 * If you need more control, either add additional properties to
 * TooltipProps, or use ReactTooltip directly. */
const Tooltip: React.FC<TooltipProps> = props => (
    <ReactTooltip
        border
        borderColor="#828282"
        className={"tooltip " + (props.className ? props.className : "")}
        clickable={props.clickable}
        effect="solid"
        id={props.id}
        place={props.place || "top"}
        ref={props.tooltipRef}
        type="light">
        {props.children}
    </ReactTooltip>
)

export default Tooltip;