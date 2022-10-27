import React from "react";

import "./Preview.css";

type MapPreviewProps = {
  mapName: string;
};

// Note: this is just temporary. Ideally map preview will be generated locally,
// instead of relying on 3rd party website.
const MapPreview: React.FC<MapPreviewProps> = (props) => (
  <div className="map-preview">
    {props.mapName ? (
      <iframe
        src={`http://urraka.github.io/soldat-map/#171/${props.mapName}`}
        scrolling={"no"}
        title="Map preview"
      ></iframe>
    ) : (
      <span>No preview</span>
    )}
  </div>
);

export default MapPreview;
