import React from "react";

import Strings from "amdi18n!nls/requestBody";

import TabView from "../tabview/TabView";
import Headers from "../requestbodies/Headers";
import PlainResponse from "../requestbodies/PlainResponse";
import Highlighted from "../requestbodies/Highlighted";

function createTabs(props) {
  const { entry } = props;
  const tabs = [];
  if (!Headers.canShowEntry || Headers.canShowEntry(entry)) {
    tabs.push({
      id: "Headers",
      label: Strings.Headers,
      body: <Headers entry={entry} />
    });
  }
  if (!PlainResponse.canShowEntry || PlainResponse.canShowEntry(entry)) {
    tabs.push({
      id: "PlainResponse",
      label: Strings.Response,
      body: <PlainResponse entry={entry} />
    });
  }
  if (!Highlighted.canShowEntry || Highlighted.canShowEntry(entry)) {
    tabs.push({
      id: "Highlighted",
      label: Strings.Highlighted,
      body: <Highlighted entry={entry} />
    });
  }
  return tabs;
}

const NetInfoRow = props => {
  const tabs = createTabs(props);
  return (
    <tr className="netInfoRow">
      <td colSpan="9" className="netInfoCol">
        <TabView id="requestBody" tabs={tabs} />
      </td>
    </tr>
  );
};

NetInfoRow.displayName = "nettable/NetInfoRow";

export default NetInfoRow;
