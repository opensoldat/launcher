import React from "react";
import "./Spinner.css";

type SpinnerProps = {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = (props) => (
    <div className={`spinner ${props.className ? props.className : ""}`} />
)

export default Spinner;