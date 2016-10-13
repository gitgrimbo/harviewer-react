import React, { Component } from "react";
import PropTypes from "prop-types";

import "../../json-query/JSONQuery";

import Dom from "../../core/dom";
import Cookies from "../../core/cookies";
import Trace from "../../core/trace";
import Toolbar from "../../toolbar/Toolbar";
import ObjectSearch from "../../tabs/ObjectSearch";
import intersperse from "../../intersperse";
import DOMBox from "./DOMBox";
import SearchBox from "./SearchBox";

const caseSensitiveCookieName = "searchCaseSensitive";

class DOMTab extends Component {
  constructor(...args) {
    super(...args);

    this.domBoxRefs = this.props.harModels.map(() => React.createRef());
    this.searchRef = React.createRef();

    this.state = {
      jsonQueryResults: null,
    };
  }

  async selectText(search) {
    const key = search.stack
      .slice(1)
      .reduce((key, stackItem, i, stack) => {
        let propIndex = stackItem.propIndex;
        if (i < stack.length - 1) {
          // all indexes except the last are off-by-one when it comes to generating the key.
          propIndex -= 1;
        }
        return key ? key + "." + propIndex : String(propIndex);
      }, "");


    // The root of search data is the list of inputs.
    const { propIndex } = search.stack[0];

    const domBoxRef = this.domBoxRefs[propIndex - 1];

    // wait for the nodes to be shown before trying to select text
    await domBoxRef.current.getTree().showNode(key);

    const objectBox = domBoxRef.current.getTree().findObjectBox(key);
    if (objectBox) {
      const textNode = objectBox.firstChild;
      search.selectText(textNode);
      Dom.scrollIntoCenterView(objectBox);
    }
  }

  search = (text) => {
    if (this.isJSONQueryMode()) {
      return this.jsonQuery(text);
    }

    if (text.length < 3) {
      return true;
    }

    if (this.currentSearch && this.currentSearch.text !== text) {
      this.currentSearch = null;
    }

    if (!this.currentSearch) {
      const { harModels } = this.props;
      const inputs = harModels.map(({ input }) => input);
      this.currentSearch = new ObjectSearch(text, inputs, false, caseSensitiveCookieName);
    }

    if (this.currentSearch.findNext(text)) {
      this.selectText(this.currentSearch);
      return true;
    }

    this.currentSearch = null;

    return false;
  }

  jsonQuery(expr) {
    const { harModels } = this.props;

    const jsonQueryResults = harModels.map(({ input, i }) => {
      try {
        return JSONQuery(expr, input);
      } catch (err) {
        Trace.exception(err);
      }
    });

    this.setState({
      jsonQueryResults,
    });

    return true;
  }

  getTitle(har) {
    // Iterate all pages and get titles.
    // Some IE11 HARs (11.48.17134.0/11.0.65) don't have pages
    return (har.log.pages || [])
      .map(({ title }) => title)
      .join(", ");
  }

  isJSONQueryMode() {
    return (Cookies.getCookie("searchJsonQuery") === "true");
  }

  renderToolbar() {
    const placeholder = this.isJSONQueryMode() ? "JSON Query" : "Search";
    return (
      <div key="Toolbar" className="domToolbar">
        <Toolbar>
          <SearchBox ref={this.searchRef} search={this.search} placeholder={placeholder} />
        </Toolbar>
      </div>
    );
  }

  render() {
    const { harModels } = this.props;
    const { jsonQueryResults } = this.state;
    return (
      <>
        {this.renderToolbar()}
        <div className="domContent">
          {
            intersperse(
              harModels.map((model, i) => {
                const title = this.getTitle(model.input);
                return <DOMBox
                  ref={this.domBoxRefs[i]}
                  key={`DOMBox${i}`}
                  har={model.input}
                  title={title}
                  jsonQueryMode={this.isJSONQueryMode()}
                  jsonQueryResults={jsonQueryResults && jsonQueryResults[i]}
                />;
              }),
              (_, i) => <div key={`sep-${i}`} className="separator" />
            )
          }
        </div>
      </>
    );
  }
}

DOMTab.propTypes = {
  appendPreview: PropTypes.func,
  requestTabChange: PropTypes.func,
  harModels: PropTypes.array,
};

export default DOMTab;
