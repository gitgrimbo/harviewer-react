import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ObjectTree from "../../tree/ObjectTree";

function JSONQueryResults({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="resultsDefaultContent">JSON Query Results</div>
    );
  }
  return (
    <>
      <div className="queryResultsViewType">
        <input type="checkbox" className="type" />
        <span className="label ">Table View</span>
      </div>
      <ObjectTree root={results} showFirstChild={false} />
    </>
  );
}

class DOMBox extends Component {
  objectTreeRef = React.createRef();

  getTree() {
    return this.objectTreeRef.current.getTree();
  }

  render() {
    const {
      har,
      title,
      jsonQueryMode = false,
      jsonQueryResults,
    } = this.props;

    if (!har) {
      return null;
    }

    return (
      <table cellPadding="0" cellSpacing="0" className="domBox">
        <tbody className="">
          <tr className="">
            <td className="content">
              <div className="title">{title}</div>
              <ObjectTree ref={this.objectTreeRef} root={har} />
            </td>
            {
              jsonQueryMode && (
                <>
                  <td className={classNames("splitter", { visible: jsonQueryMode })}></td>
                  <td className={classNames("results", { visible: jsonQueryMode })}>
                    <JSONQueryResults results={jsonQueryResults} />
                  </td>
                </>
              )
            }
          </tr>
        </tbody>
      </table>
    );
  }
}

DOMBox.propTypes = {
  har: PropTypes.object,
  title: PropTypes.string,
};

export default DOMBox;
