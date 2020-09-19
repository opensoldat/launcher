import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import KeyInput from "./KeyInput";
import { KeyBinding } from "../../../types";

type CustomBindingsTableRowProps = {
    binding: KeyBinding;

    onCommandChange: (bindingId: string, newCommand: string) => void;
    onDelete: (bindingId: string) => void;
    onKeyChange: (bindingId: string, newKey: string) => void;
}

const CustomBindingsTableRow = React.forwardRef<HTMLInputElement, CustomBindingsTableRowProps>(
    (props, firstCommandInputRef) => {
        return (
            <tr className ="custom-bindings-row">
                <td className="command-cell">
                    <input
                        ref={firstCommandInputRef}
                        spellCheck="false"
                        type="text"
                        value={props.binding.command}
                        onChange={(event): void => props.onCommandChange(props.binding.id, event.target.value)}>
                    </input>
                </td>
                <td className="key-cell">
                    <KeyInput
                        id={props.binding.id}
                        assignedKey={props.binding.key}
                        onKeyChange={props.onKeyChange} />
                </td>
                <td className="actions-cell">
                    <div
                        className="delete-button"
                        onClick={(): void => props.onDelete(props.binding.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                </td>
            </tr>
        )
    }
)

CustomBindingsTableRow.displayName = "CustomBindingsTableRow";
export default observer(CustomBindingsTableRow);