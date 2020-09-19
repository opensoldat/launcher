import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./Checkbox.css";

type CheckboxProps = {
    checked: boolean;
    onToggle: (checked: boolean, fieldName?: string) => void;

    id?: string;
    name?: string;
    leftLabel?: string;
    rightLabel?: string;

    colorTheme: "light" | "dark";
}

/* This component is quite flexible. Can be used to display
 * a bare checkbox (when the label props are not defined), but it
 * can also have a clickable label that will toggle its "checked"
 * status. Label can be displayed on checkbox's left or right,
 * depending on needs.
 * When used within a form, you can pass an id for the <input> element,
 * so that clicking field's label will toggle the "checked" status too.
 */
const Checkbox: React.FC<CheckboxProps> = props => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.onToggle(event.target.checked, props.name);
    }

    return (
        <label className={"checkbox-container " + props.colorTheme}>
            {props.leftLabel &&
            <span className="left-label">
                {props.leftLabel}
            </span>
            }

            <input
                id={props.id}
                checked={props.checked}
                onChange={handleChange}
                type="checkbox">
            </input>

            <div className="checkbox">
                <FontAwesomeIcon className="check-icon" icon={faCheck} />
            </div>

            {props.rightLabel &&
            <span className="right-label">
                {props.rightLabel}
            </span>
            }
        </label>
    )


}

export default Checkbox;