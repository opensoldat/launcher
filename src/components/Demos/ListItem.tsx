import React from "react";

import "./ListItem.css";

type DemosListItemProps = {
    fileName: string;
    selected: boolean;
    onClick: (fileName: string) => void;
    onDoubleClick: (fileName: string) => void;
}

const DemosListItem: React.FC<DemosListItemProps> = props => {
    const handleClick = (): void => {
        props.onClick(props.fileName);
    }

    const handleDoubleClick = (): void => {
        props.onDoubleClick(props.fileName);
    }

    return (
        <div
            className={`demos-list-item ${props.selected && "selected"}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}>
            <span> {props.fileName} </span>
        </div>
    )
}

export default DemosListItem;