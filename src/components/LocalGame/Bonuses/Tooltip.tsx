import React from "react";
import Tooltip from "src/components/Common/Tooltip";
import "./Tooltip.css";

type BonusesTooltipProps = {
    id: string;
}

const BonusesTooltip: React.FC<BonusesTooltipProps> = props => {
    return (
        <Tooltip
            className="bonuses-tooltip"
            id={props.id}>
            <ul className="list">
                <li className="list-item">
                    <div className="content">
                        <span className="label">
                            Berserker:
                        </span> 
                        <div className="description">
                            Massacre! Berserker makes your weapons four times stronger. Duration: 15 seconds.
                        </div>
                    </div>
                </li>

                <li className="list-item">
                    <div className="content">
                        <span className="label">
                            Cluster grenades:
                        </span>
                        <div className="description">
                            3 grenades that release additional charges in a small radius and cause a chain of explosions.
                        </div>
                    </div>
                </li>

                <li className="list-item">
                    <div className="content">
                        <span className="label">
                            Flamer:
                        </span>
                        <div className="description">
                            Grants Flamethrower weapon and immortality. Duration: 10 seconds.
                        </div>
                    </div>
                </li>

                <li className="list-item">
                    <div className="content">
                        <span className="label">
                            Predator:
                        </span>
                        <div className="description">
                            Invisibility. Enemies can still hear sounds you make, and blood makes you more visible. Duration: 25 seconds.
                        </div>
                    </div>
                </li>

                <li className="list-item">
                    <div className="content">
                        <span className="label">
                            Bulletproof vest:
                        </span>
                        <div className="description">
                            Personal armor. Basically an addition of 100% health points.
                        </div>
                    </div>
                </li>
            </ul>
        </Tooltip>
    )
}

export default BonusesTooltip