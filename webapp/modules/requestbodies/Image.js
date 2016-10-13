import React from "react";
import PropTypes from "prop-types";

import * as Mime from "../core/mime";
import * as Str from "../core/string";

class Image extends React.Component {
  createImageSrc(content) {
    const mimeType = Mime.extractMimeType(content.mimeType);
    // https://css-tricks.com/data-uris/
    return "data:" + mimeType + ";base64," + content.text;
  }

  render() {
    const { entry } = this.props;
    const { content } = entry.response;
    const src = this.createImageSrc(content);
    return (
      <div className="netInfoImageText netInfoText">
        <img src={src} />
      </div>
    );
  }
};

Image.propTypes = {
  entry: PropTypes.object,
};

Image.isFileImage = function(entry) {
  const { content } = entry.response;
  if (!content) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return Str.startsWith(mimeType, "image/");
}

Image.canShowEntry = function(entry) {
  const { content } = entry.response;
  return Image.isFileImage(entry) && (content.text && content.encoding === "base64");
};

export default Image;
