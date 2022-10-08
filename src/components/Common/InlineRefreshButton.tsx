import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "./InlineRefreshButton.css";

type InlineRefreshButtonProps = {
  onClick: () => void;
};

const InlineRefreshButton: React.FC<InlineRefreshButtonProps> = (props) => {
  return (
    <div className="inline-refresh-button">
      <FontAwesomeIcon
        className="icon"
        icon={faSyncAlt}
        onClick={props.onClick}
      />
    </div>
  );
};

export default InlineRefreshButton;
