import React from "react";
import { IArraySplice, observe } from "mobx";
import { observer } from "mobx-react";

import CustomBindingsTableRow from "./CustomBindingsTableRow";
import { KeyBinding } from "../../../types";

import "./CustomBindingsTable.css";

type CustomBindingsTableProps = {
  customBindings: KeyBinding[];

  onCommandChange: (bindingId: string, newCommand: string) => void;
  onDelete: (bindingId: string) => void;
  onKeyChange: (bindingId: string, newKey: string) => void;
};

const CustomBindingsTable: React.FC<CustomBindingsTableProps> = (props) => {
  // Whenever user adds a new binding, we want to adjust scrollbar and
  // focus the command input field, so that user can see his new binding
  // being added. Couldn't think of a cleaner way to achieve this.
  const firstCommandInputRef = React.useRef<HTMLInputElement>(null);
  const justAddedBinding = React.useRef(false);
  React.useEffect(() => {
    return observe<KeyBinding>(props.customBindings, (change: IArraySplice<KeyBinding>) => {
      if (change?.addedCount > 0) {
        justAddedBinding.current = true;
      } else {
        justAddedBinding.current = false;
      }
    });
  }, [props.customBindings]);

  React.useEffect(() => {
    if (justAddedBinding.current && firstCommandInputRef.current) {
      firstCommandInputRef.current.focus();
      justAddedBinding.current = false;
    }
  }, [justAddedBinding.current, firstCommandInputRef.current]);

  return (
    <table className="bindings-table">
      <thead>
        <tr>
          <th> COMMAND </th>
          <th className="key-header"> HOTKEY </th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {props.customBindings.map((binding, index) => (
          <CustomBindingsTableRow
            key={binding.id}
            ref={index === 0 ? firstCommandInputRef : null}
            binding={binding}
            onCommandChange={props.onCommandChange}
            onDelete={props.onDelete}
            onKeyChange={props.onKeyChange}
          />
        ))}

        {props.customBindings.length === 0 && (
          <tr>
            <td align="center" colSpan={3}>
              No bindings
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default observer(CustomBindingsTable);
