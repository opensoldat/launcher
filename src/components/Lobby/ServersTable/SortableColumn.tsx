import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import ServersSortStore from "../../../stores/lobby/sort";
import "./SortableColumn.css";

type SortableColumnProps = {
  columnName: string;
  label: string;

  sortStore: ServersSortStore;
};

const SortableColumn: React.FC<SortableColumnProps> = (props) => {
  const handleClick = (): void => {
    props.sortStore.applySort(props.columnName);
  };

  return (
    <th className="sortable-column" onClick={handleClick}>
      <div className="content">
        {props.label}

        <div className="sort-icon">
          {props.sortStore &&
            props.sortStore.columnName === props.columnName && (
              <FontAwesomeIcon
                icon={props.sortStore.isDescending ? faCaretDown : faCaretUp}
              />
            )}
        </div>
      </div>
    </th>
  );
};

export default observer(SortableColumn);
