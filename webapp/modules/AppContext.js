import React, { Component } from "react";
import PropTypes from "prop-types";
import Url from "./core/url";

import Cookies from "./core/cookies";
import InfoTipHolder from "./InfoTipHolder";
import defaultTimingDefinitions from "./nettable/defaultTimingDefinitions";

const DEFAULT_STATE = {
  validate: true,
  expandAll: true,
  previewCols: [],
  pageTimingDefinitions: defaultTimingDefinitions.slice(),
};

const AppContext = React.createContext(DEFAULT_STATE);

export default AppContext;

export const AppContextConsumer = AppContext.Consumer;

export class AppContextProvider extends Component {
  state = DEFAULT_STATE;
  infoTipHolderRef = React.createRef();

  getDefaultVisibleNetCols() {
    const cols = Cookies.getCookie("previewCols");
    if (cols) {
      // Columns names are separated by a space so, make sure to properly process
      // spaces in the cookie value.
      return unescape(cols.replace(/\+/g, " "))
        .split(" ");
    }
    const defaultVisibleNetCols = [
      "url",
      "status",
      "size",
      "uncompressedSize",
      "timeline",
    ];
    return defaultVisibleNetCols;
  }

  componentDidMount() {
    const expandAll = Url.getURLParameter("expand", window.location.href) === "true";
    const validate = Cookies.getCookie("validate") !== "false";
    const newState = {
      validate,
      expandAll,
      previewCols: this.getDefaultVisibleNetCols(),
    };
    this.setState(newState);
  }

  appendPreview(harObjectOrString) {
  }

  setPreviewCols = (cols, avoidCookies) => {
    if (!cols) {
      cols = this.getDefaultVisibleNetCols();
    }

    // If the parameter is an array, convert it to string.
    if (!Array.isArray(cols)) {
      cols = cols.split(/\s+/);
    }

    // Update cookie
    if (!avoidCookies) {
      Cookies.setCookie("previewCols", cols.join(" "));
    }

    this.setState({
      previewCols: cols,
    });
  }

  setValidate = (validate) => {
    Cookies.setCookie("validate", validate);
    this.setState({ validate });
  }

  getInfoTipHolder = () => {
    return this.infoTipHolderRef.current;
  }

  addPageTiming = (timing) => {
    this.setState(({ pageTimingDefinitions }) => ({
      pageTimingDefinitions: [...pageTimingDefinitions, timing],
    }));
  }

  render() {
    const state = this.state;
    return (
      <InfoTipHolder ref={this.infoTipHolderRef}>
        <AppContext.Provider value={{
          ...state,
          setValidate: this.setValidate,
          setPreviewCols: this.setPreviewCols,
          getInfoTipHolder: this.getInfoTipHolder,
          addPageTiming: this.addPageTiming,
        }}>
          {this.props.children}
        </AppContext.Provider>
      </InfoTipHolder>
    );
  }
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
};
