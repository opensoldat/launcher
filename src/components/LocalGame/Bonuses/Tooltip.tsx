import React from "react";
import Tooltip from "src/components/Common/Tooltip";

type BonusesTooltipProps = {
    id: string;
}

const BonusesTooltip: React.FC<BonusesTooltipProps> = props => {
    return (
        <Tooltip id={props.id}>
            
        </Tooltip>
    )
}

export default BonusesTooltip