import React from "react";
import Spinner from "src/components/Common/Spinner";

import "./List.css";

type MapsListProps = {
    emptyMessage: string;
    isLoading: boolean;

    children: React.ReactNode;
}

const MapsList: React.FC<MapsListProps> = props => {
    const emptyMessage = (
        <div className="centered-content empty-message">
            {props.emptyMessage}
        </div>
    )

    const loadingSpinner = (
        <div className="centered-content">
            <Spinner />
        </div>
    )

    return (
        <div className="maps-list">
        {props.isLoading
        ?   loadingSpinner
        :   React.Children.count(props.children) > 0
            ? props.children
            : emptyMessage
        }
        </div>
    )
};

export default MapsList;