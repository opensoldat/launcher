import React from "react";

import "./CheckboxLabelWithImage.css";

type CheckboxLabelWithImageProps = {
  label: string;
  // Provide styling so that images are aligned when displaying a list of labels.
  labelMinWidth: string;
  imagePath: string;
};

const CheckboxLabelWithImage: React.FC<CheckboxLabelWithImageProps> = (
  props
) => {
  const labelStyle = {
    minWidth: props.labelMinWidth,
  };

  return (
    <div className="checkbox-label-with-image">
      <span style={labelStyle}>{props.label}</span>
      <img src={props.imagePath} />
    </div>
  );
};

export default CheckboxLabelWithImage;
