import React from "react"
import Tooltip from "../Common/Tooltip"

import "./LocalMountTooltip.css";

type LocalMountTooltipProps = {
    id: string;
}

const LocalMountTooltip: React.FC<LocalMountTooltipProps> = props => {
    return (
        <Tooltip
            className="local-mount-tooltip"
            id={props.id}>
            <div>
                This option is for modding purposes.
                <div>
                    When disabled, Soldat will load game&apos;s files from soldat.smod file.
                </div>
                <div>
                    When enabled, files will be loaded directly from Soldat&apos;s directory.
                    When enabling this option, make sure you also unzip soldat.smod file.
                </div>
            </div>
        </Tooltip>
    )
}

export default LocalMountTooltip;