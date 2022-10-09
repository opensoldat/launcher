import React from "react";

import DemosListItem from "./ListItem";
import Spinner from "../Common/Spinner";

import "./List.css";

type DemosListProps = {
  demosFileNames: string[];
  isLoadingDemos: boolean;
  selectedDemoFileName: string;
  onDemoClick: (fileName: string) => void;
  onDemoDoubleClick: (fileName: string) => void;
};

const DemosList: React.FC<DemosListProps> = (props) => {
  const loadingSpinner = (
    <div className="centered-container">
      <Spinner />
    </div>
  );

  const isListEmpty =
    props.demosFileNames == null || props.demosFileNames.length === 0;
  const listContent = isListEmpty ? (
    <div className="centered-container">Nothing to display</div>
  ) : (
    props.demosFileNames.map((fileName) => (
      <DemosListItem
        key={fileName}
        fileName={fileName}
        selected={props.selectedDemoFileName === fileName}
        onClick={props.onDemoClick}
        onDoubleClick={props.onDemoDoubleClick}
      />
    ))
  );

  return (
    <div className="demos-list">
      {props.isLoadingDemos ? loadingSpinner : listContent}
    </div>
  );
};

export default DemosList;
