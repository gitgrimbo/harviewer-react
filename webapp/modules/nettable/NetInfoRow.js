import React, { Component } from "react";
import PropTypes from "prop-types";

import Strings from "i18n!../nls/requestBody";

import TabView from "../tabview/TabView";
import Headers from "../requestbodies/Headers";
import PlainResponse from "../requestbodies/PlainResponse";
import Highlighted from "../requestbodies/Highlighted";
import URLParameters from "../requestbodies/URLParameters";
import SendData from "../requestbodies/SendData";
import DataURL from "../requestbodies/DataURL";
import JSONEntryTree from "../requestbodies/JSONEntryTree";
import XMLEntryTree from "../requestbodies/XMLEntryTree";
import ExternalImage from "../requestbodies/ExternalImage";
import Image from "../requestbodies/Image";

const responseBodyComponents = {
  Headers: {
    Component: Headers,
    id: "Headers",
    label: Strings.Headers,
  },
  PlainResponse: {
    Component: PlainResponse,
    id: "Response",
    label: Strings.Response,
  },
  Highlighted: {
    Component: Highlighted,
    id: "Highlighted",
    label: Strings.Highlighted,
  },
  URLParameters: {
    Component: URLParameters,
    id: "Params",
    label: Strings.URLParameters,
  },
  SendData: {
    Component: SendData,
    id: "Post",
    // TODO, this has to be determined on-the-fly by entry.request.method
    label: "Post",
  },
  DataURL: {
    Component: DataURL,
    id: "DataURL",
    label: Strings.DataURL,
  },
  JSON: {
    Component: JSONEntryTree,
    id: "JSON",
    label: Strings.JSON,
  },
  XML: {
    Component: XMLEntryTree,
    id: "XML",
    label: Strings.XML,
  },
  Image: {
    Component: Image,
    id: "Image",
    label: Strings.Image,
  },
  ExternalImage: {
    Component: ExternalImage,
    id: "ExternalImage",
    label: Strings.ExternalImage,
  },
};

function createTabs(entry) {
  const tabs = [];
  Object.keys(responseBodyComponents).forEach((name) => {
    const Component = responseBodyComponents[name].Component;
    if (!Component.canShowEntry || Component.canShowEntry(entry)) {
      const info = responseBodyComponents[name];
      tabs.push(Object.assign({}, info, {
        body: <Component entry={entry} />,
      }));
    }
  });
  return tabs;
}

class NetInfoRow extends Component {
  state = {
    selectedTabIdx: 0,
  }

  setSelectedTab = (selectedTabIdx) => {
    if (typeof selectedTabIdx === "string") {
      selectedTabIdx = this.tabs.findIndex(({ id }) => id === selectedTabIdx);
    }
    this.setState({ selectedTabIdx });
  }

  render() {
    const { entry } = this.props;
    this.tabs = createTabs(entry);
    return (
      <tr className="netInfoRow">
        <td colSpan="9" className="netInfoCol">
          <TabView
            id="requestBody"
            tabs={this.tabs}
            selectedTabIdx={this.state.selectedTabIdx}
            onSelectedTabChange={this.setSelectedTab}
          />
        </td>
      </tr>
    );
  }
}

NetInfoRow.propTypes = {
  entry: PropTypes.object,
};

export default NetInfoRow;
