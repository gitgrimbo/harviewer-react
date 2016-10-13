import React from "react";
import NetTable from "../nettable/NetTable";

const PageInfoRow = React.createClass({
  displayName: "pagetable/PageInfoRow",

  propTypes: {
    model: React.PropTypes.object,
    page: React.PropTypes.object
  },

  shouldComponentUpdate(nextProps, nextState) {
    const { model, page } = this.props;
    console.log(!(model === nextProps.model && page === nextProps.page));
    return !(model === nextProps.model && page === nextProps.page);
  },

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
});

export default PageInfoRow;
