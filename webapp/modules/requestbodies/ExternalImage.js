import React from "react";
import PropTypes from "prop-types";

import Image from "./Image";

class ExternalImage extends React.Component {
  render() {
    const { entry } = this.props;
    return (
      <div className="netInfoExternalImageText netInfoText">
        <img src={entry.request.url} />
      </div>
    );
  }
};

ExternalImage.propTypes = {
  entry: PropTypes.object,
};

ExternalImage.canShowEntry = function(entry) {
  return Image.isFileImage(entry);
};

export default ExternalImage;
