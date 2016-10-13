import React, { Component } from "react";
import PropTypes from "prop-types";

import NetTable from "../nettable/NetTable";

class PageInfoRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { model, page } = this.props;
    return !(model === nextProps.model && page === nextProps.page);
  }

  render() {
    const { model, page } = this.props;
    return (
      <tr className="pageInfoRow">
        <td colSpan="2" className="pageInfoCol">
          <NetTable model={model} page={page} />
        </td>
      </tr>
    );
  }
}

PageInfoRow.propTypes = {
  model: PropTypes.object,
  page: PropTypes.object,
};

export default PageInfoRow;
