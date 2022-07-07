import React from "react";

import { Map } from "../../../types";

import "./ListItem.css";

type MapsListItemProps = {
    highlighted: boolean;
    map: Map;
    onClick: (map: Map) => void;

    children?: React.ReactNode;
};

const MapsListItem: React.FC<MapsListItemProps> = props => {
    const handleClick = (): void => props.onClick(props.map);

    return (
        <div
            className={"item" + (props.highlighted ? " highlighted" : "")}
            onClick={handleClick}>
            <span className="map-name"> {props.map.name} </span>
            <div className="actions">
                {props.children}
            </div>
        </div>
    )
}

export default MapsListItem;