import React from 'react';

import './Panel.css';

type PanelProps = {
    className?: string;
    children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = (props) => (
    <div className={`panel ${props.className ? props.className: ""}`}>
        { props.children }
    </div>
)

export default Panel;