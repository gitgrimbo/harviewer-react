import React from "react";
import PropTypes from "prop-types";

import ParamRow from "./ParamRow";

class UrlParameters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { entry } = this.props;
    return (
      <table className="netInfoParamsText netInfoText netInfoParamsTable" cellPadding="0" cellSpacing="0">
        <tbody>
          {
            entry.request.queryString.map((param, i) =>
              <ParamRow key={i} name={param.name} value={param.value} />
            )
          }
        </tbody>
      </table>
    );
  }
};

UrlParameters.propTypes = {
  entry: PropTypes.object,
};

UrlParameters.canShowEntry = function(entry) {
  return (entry.request.queryString && entry.request.queryString.length);
};

export default UrlParameters;
