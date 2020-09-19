import React from "react";

import "./List.css";

type MapsListProps = {
    emptyMessage: string;
}

const MapsList: React.FC<MapsListProps> = props => (
    <div className="maps-list">
        {React.Children.count(props.children) > 0
        ? props.children
        : <div className="empty-message">
            {props.emptyMessage}
          </div>
        }
    </div>
);

export default MapsList;