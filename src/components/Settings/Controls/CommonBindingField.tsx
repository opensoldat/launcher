import { observer } from "mobx-react";
import React from "react";

import KeyInput from "./KeyInput";
import { CommonKeyBinding } from "../../../types";

type CommonBindingFieldProps = {
    binding: CommonKeyBinding;
    label: string;
    onKeyChange: (bindingId: string, newKey: string) => void;
}

const CommonBindingField: React.FC<CommonBindingFieldProps> = props => {
    return (
        <div className="field">
            <label className="label">
                {props.label}
            </label>
            <div className="user-input">
                <KeyInput
                    id={props.binding.id}
                    assignedKey={props.binding.key}
                    onKeyChange={props.onKeyChange} />
            </div>
        </div>
    )
}

export default observer(CommonBindingField);