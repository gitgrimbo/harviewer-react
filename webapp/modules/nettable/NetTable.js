import React from "react";
import * as Date_ from "core/date";
import * as Str from "core/string";
import * as Dom from "core/dom";
import * as Css from "core/css";

import setState from "../setState";
import booleanFlipper from "../booleanFlipper";

import NetRow from "./NetRow";
import NetSummaryRow from "./NetSummaryRow";
import NetInfoRow from "./NetInfoRow";
import { Phases } from "./Phases";
import defaultTimingDefinitions from "./defaultTimingDefinitions";
import TimeInfoTip from "../timeinfotip/TimeInfoTip";

class NetModel {
  calculatePageTimings(page, phase, phaseElapsed) {
    // Obviously we need a page object for page timings.
    if (!page) {
      return;
    }

    var pageStart = Date_.parseISO8601(page.startedDateTime);

    // Iterate all timings in this phase and generate offsets (px position in the timeline).
    for (var i = 0; i < phase.pageTimings.length; i++) {
      var time = phase.pageTimings[i].time;
      if (time > 0) {
        var timeOffset = pageStart + time - phase.startTime;
        var barOffset = ((timeOffset / phaseElapsed) * 100).toFixed(3);
        phase.pageTimings[i].offset = barOffset;
      }
    }
  }

  calculateFileTimes(file, phaseStartTime, phaseElapsed) {
    // Individual phases of a request:
    //
    // 1) Blocking          HTTP-ON-MODIFY-REQUEST -> (STATUS_RESOLVING || STATUS_CONNECTING_TO)
    // 2) DNS               STATUS_RESOLVING -> STATUS_CONNECTING_TO
    // 3) Connecting        STATUS_CONNECTING_TO -> (STATUS_CONNECTED_TO || STATUS_SENDING_TO)
    // 4) Sending           STATUS_SENDING_TO -> STATUS_WAITING_FOR
    // 5) Waiting           STATUS_WAITING_FOR -> STATUS_RECEIVING_FROM
    // 6) Receiving         STATUS_RECEIVING_FROM -> ACTIVITY_SUBTYPE_RESPONSE_COMPLETE
    //
    // Note that HTTP-ON-EXAMINE-RESPONSE should not be used since the time isn't passed
    // along with this event and so, it could break the timing. Only the HTTP-ON-MODIFY-REQUEST
    // is used to get begining of the request and compute the blocking time. Hopefully this
    // will work or there is better mechanism.
    //
    // If the response comes directly from the browser cache, there is only one state.
    // HTTP-ON-MODIFY-REQUEST -> HTTP-ON-EXAMINE-CACHED-RESPONSE

    // Compute end of each phase since the request start.
    var blocking = ((file.timings.blocked < 0) ? 0 : file.timings.blocked);
    var resolving = blocking + ((file.timings.dns < 0) ? 0 : file.timings.dns);
    var connecting = resolving + ((file.timings.connect < 0) ? 0 : file.timings.connect);
    var sending = connecting + ((file.timings.send < 0) ? 0 : file.timings.send);
    var waiting = sending + ((file.timings.wait < 0) ? 0 : file.timings.wait);
    var receiving = waiting + ((file.timings.receive < 0) ? 0 : file.timings.receive);

    var startedDateTime = Date_.parseISO8601(file.startedDateTime);

    return {
      barOffset: (((startedDateTime - phaseStartTime) / phaseElapsed) * 100).toFixed(3),

      // Compute size of each bar. Left side of each bar starts at the
      // beginning. The first bar is on top of all and the last one is
      // at the bottom (z-index).
      barBlockingWidth: ((blocking / phaseElapsed) * 100).toFixed(3),
      barResolvingWidth: ((resolving / phaseElapsed) * 100).toFixed(3),
      barConnectingWidth: ((connecting / phaseElapsed) * 100).toFixed(3),
      barSendingWidth: ((sending / phaseElapsed) * 100).toFixed(3),
      barWaitingWidth: ((waiting / phaseElapsed) * 100).toFixed(3),
      barReceivingWidth: ((receiving / phaseElapsed) * 100).toFixed(3)
    };
  }
}

function getElapsedTime(file) {
  // Total request time doesn't include the time spent in queue.
  // var elapsed = file.time - file.timings.blocked;
  var time = Math.round(file.time * 10) / 10;
  return Str.formatTime(time.toFixed(2));
}

function createBars(entry, fileTimes) {
  let bars = [
    "Blocking",
    "Resolving",
    "Connecting",
    "Sending",
    "Waiting",
    "Receiving"
  ].map(barName => ({
    className: "net" + barName + "Bar",
    style: {
      left: fileTimes.barOffset + "%",
      width: fileTimes["bar" + barName + "Width"] + "%"
    }
  }));
  bars[bars.length - 1].timeLabel = getElapsedTime(entry);
  return bars;
}

function createPageTimingBars(pageTimings) {
  return pageTimings.map(pageTiming => {
    return {
      label: pageTiming.name,
      comment: pageTiming.description,
      classes: pageTiming.classes,
      left: pageTiming.offset + "%"
    };
  });
}

const NetTable = React.createClass({
  displayName: "nettable/NetTable",

  propTypes: {
    entries: React.PropTypes.array,
    model: React.PropTypes.object,
    page: React.PropTypes.object
  },

  getInitialState() {
    const entries = this.getEntries();
    return {
      netRowExpandedState: entries.map((page, i) => false)
    };
  },

  componentDidMount() {
    this.context.infoTipHolder.addListener(this);
  },

  componentWillUnmount() {
    this.context.infoTipHolder.removeListener(this);
  },

  showInfoTip(infoTip, target, x, y, rangeParent, rangeOffset) {
    var row = Dom.getAncestorByClass(target, "netRow");
    if (row) {
      if (Dom.getAncestorByClass(target, "netBar")) {
        // There is no background image for multiline tooltips.
        const entryId = Number(row.getAttribute("data-entry-id") || "0");
        return {
          multiline: true,
          element: <TimeInfoTip entry={this.getEntries()[entryId]} />
        };
      } else if (Css.hasClass(target, "netSizeLabel")) {
        return {
          multiline: false
        };
      }
    }
  },

  getEntries() {
    if (this.props.page) {
      return this.props.model.getPageEntries(this.props.page);
    } else if (this.props.entries) {
      return this.props.entries;
    }
    return [];
  },

  onNetRowClick(netRowIdx) {
    setState(this, {
      netRowExpandedState: this.state.netRowExpandedState.map(booleanFlipper(netRowIdx))
    });
  },

  createNetRows(entries) {
    const { model, page } = this.props;
    const { netRowExpandedState } = this.state;

    const m = new NetModel();
    const phases = Phases.calculatePhases(model.input, page, defaultTimingDefinitions, null, null);
    const phase = phases.phases[0];

    const phaseStartTime = phase.startTime;
    const phaseElapsed = phase.endTime - phase.startTime;
    m.calculatePageTimings(page, phase, phaseElapsed);

    const pageTimingBars = createPageTimingBars(phase.pageTimings);

    // Use concat to flatten an array of arrays to a flat array.
    return [].concat(entries.map((entry, i) => {
      const opened = netRowExpandedState[i];
      const bars = createBars(entry, m.calculateFileTimes(entry, phaseStartTime, phaseElapsed));
      const netRow = <NetRow key={"NetRow" + i} page={page} phase={phase} entry={entry} entryId={i} opened={opened} bars={bars} pageTimingBars={pageTimingBars} onClick={this.onNetRowClick.bind(this, i)} />;
      if (!opened) {
        return netRow;
      }
      return [netRow, <NetInfoRow key={"NetInfoRow" + i} entry={entry} />];
    }));
  },

  render() {
    const entries = this.getEntries();
    const { page } = this.props;
    const netRows = this.createNetRows(entries);

    return (
      <table className="netTable" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr className="netSizerRow">
            <td className="netHrefCol netCol" width="20%"></td>
            <td className="netStatusCol netCol" width="7%"></td>
            <td className="netTypeCol netCol" width="7%"></td>
            <td className="netDomainCol netCol" width="7%"></td>
            <td className="netSizeCol netCol" width="7%"></td>
            <td className="netTimeCol netCol" width="100%"></td>
            <td className="netOptionsCol netCol" width="15px"></td>
          </tr>
          {netRows}
          <NetSummaryRow page={page} entries={entries} />
        </tbody>
      </table>
    );
  }
});

NetTable.contextTypes = {
  infoTipHolder: React.PropTypes.object
};

export default NetTable;
