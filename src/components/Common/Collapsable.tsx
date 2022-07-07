import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import "./Collapsable.css";

type CollapsableProps = {
    collapsed: boolean;
    onCollapsedToggle: (collapsed: boolean) => void;

    className?: string;
    headerContent: React.ReactNode;
    children: React.ReactNode;
}

const Collapsable: React.FC<CollapsableProps> = props => {
    const handleHeaderClick = (): void => {
        props.onCollapsedToggle(!props.collapsed);
    }

    let rootClassName = "collapsable";
    if (!props.collapsed) {
        rootClassName += " expanded";
    }
    if (props.className) {
        rootClassName += " " + props.className; 
    }

    const collapsedIcon = props.collapsed ? faAngleRight : faAngleDown;

    return (
        <div className={rootClassName}>
            <div
                className="header"
                onClick={handleHeaderClick}>
                <div className="collapsed-icon">
                    <FontAwesomeIcon icon={collapsedIcon} />
                </div>
                {props.headerContent}
            </div>

            {!props.collapsed &&
            <div className="content">
                {props.children}
            </div>
            }
        </div>
    )
}

export default Collapsable;