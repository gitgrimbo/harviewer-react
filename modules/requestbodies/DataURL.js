import React from "react";
import PropTypes from "prop-types";

import * as Str from "../core/string";

class DataURL extends React.Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
  }

  handleImage() { }

  componentDidMount() { }

  render() {
    const { entry } = this.props;
    const data = entry.request.url;

    const content = (data.indexOf("data:image") === 0) ?
      <img src={data} /> :
      <pre dangerouslySetInnerHTML={{ __html: Str.wrapText(unescape(data)) }}></pre>;

    return (
      <div className="netInfoDataURLText netInfoText" ref={this.domRef} >
        {content}
      </div>
    );
  }
};

DataURL.propTypes = {
  entry: PropTypes.object,
};

DataURL.canShowEntry = function(entry) {
  return entry.request.url.indexOf("data:") === 0;
};

export default DataURL;
