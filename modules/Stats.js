import React, { Component } from "react";

import TimingPie from "./pie/TimingPie";
import ContentPie from "./pie/ContentPie";
import TrafficPie from "./pie/TrafficPie";
import CachePie from "./pie/CachePie";

class Stats extends Component {
  render() {
    return (
      <div style={{ height: "auto" }} className="pageStatsBody opened">
        <TimingPie {...this.props} />
        <ContentPie {...this.props} />
        <TrafficPie {...this.props} />
        <CachePie {...this.props} />
      </div>
    );
  }
}

export default Stats;
