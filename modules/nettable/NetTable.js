import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Date_ from "../core/date";
import * as Str from "../core/string";
import * as Dom from "../core/dom";
import * as Css from "../core/css";

import booleanFlipper from "../booleanFlipper";
import AppContext from "../AppContext";
import TimeInfoTip from "../timeinfotip/TimeInfoTip";

import NetRow from "./NetRow";
import NetSummaryRow from "./NetSummaryRow";
import NetInfoRow from "./NetInfoRow";
import { Phases } from "./Phases";

class NetModel {
  calculatePageTimings(page, phase, phaseElapsed) {
    // Obviously we need a page object for page timings.
    if (!page) {
      return;
    }

    const pageStart = Date_.parseISO8601(page.startedDateTime);

    // Iterate all timings in this phase and generate offsets (px position in the timeline).
    for (let i = 0; i < phase.pageTimings.length; i++) {
      const time = phase.pageTimings[i].time;
      if (time > 0) {
        const timeOffset = pageStart + time - phase.startTime;
        const barOffset = ((timeOffset / phaseElapsed) * 100).toFixed(3);
        phase.pageTimings[i].offset = barOffset;
      }
    }
  }

  calculateFileTimes(file, phaseStartTime, phaseElapsed) {
    const timings = file.timings;
    if (!timings) {
      return null;
    }

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
    const blocking = ((timings.blocked < 0) ? 0 : timings.blocked);
    const resolving = blocking + ((timings.dns < 0) ? 0 : timings.dns);
    const connecting = resolving + ((timings.connect < 0) ? 0 : timings.connect);
    const sending = connecting + ((timings.send < 0) ? 0 : timings.send);
    const waiting = sending + ((timings.wait < 0) ? 0 : timings.wait);
    const receiving = waiting + ((timings.receive < 0) ? 0 : timings.receive);

    const startedDateTime = Date_.parseISO8601(file.startedDateTime);

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
      barReceivingWidth: ((receiving / phaseElapsed) * 100).toFixed(3),
    };
  }
}

function getElapsedTime(file) {
  // Total request time doesn't include the time spent in queue.
  // var elapsed = file.time - file.timings.blocked;
  const time = Math.round(file.time * 10) / 10;
  return Str.formatTime(time.toFixed(2));
}

function createBars(entry, fileTimes) {
  const bars = [
    "Blocking",
    "Resolving",
    "Connecting",
    "Sending",
    "Waiting",
    "Receiving",
  ].map((barName) => ({
    className: "net" + barName + "Bar",
    style: {
      left: fileTimes.barOffset + "%",
      width: fileTimes["bar" + barName + "Width"] + "%",
    },
  }));
  bars[bars.length - 1].timeLabel = getElapsedTime(entry);
  return bars;
}

function createPageTimingBars(pageTimings) {
  return pageTimings.map((pageTiming) => {
    return {
      label: pageTiming.name,
      comment: pageTiming.description,
      classes: pageTiming.classes,
      left: pageTiming.offset + "%",
    };
  });
}

class NetTable extends Component {
  constructor(...args) {
    super(...args);

    const entries = this.getEntries();
    this.state = {
      netRowExpandedState: entries.map(() => false),
    };
  }

  componentDidMount() {
    const { getInfoTipHolder } = this.context;
    if (getInfoTipHolder) {
      getInfoTipHolder().addListener(this);
    }
  }

  componentWillUnmount() {
    const { getInfoTipHolder } = this.context;
    if (getInfoTipHolder) {
      getInfoTipHolder().removeListener(this);
    }
  }

  showInfoTip(infoTip, target, x, y, rangeParent, rangeOffset) {
    const { page } = this.props;

    function showInfoTipForThisComponent() {
      const table = Dom.getAncestorByClass(target, "netTable");
      if (!table) {
        return false;
      }
      const pageIdAttr = table.getAttribute("data-page-id");
      if (!page) {
        return !pageIdAttr;
      }
      return page.id === pageIdAttr;
    }

    if (!showInfoTipForThisComponent()) {
      return;
    }

    const row = Dom.getAncestorByClass(target, "netRow");
    if (row) {
      if (Dom.getAncestorByClass(target, "netBar")) {
        // There is no background image for multiline tooltips.
        const entryId = Number(row.getAttribute("data-entry-id") || "0");
        const entry = this.getEntries()[entryId];
        return {
          multiline: true,
          element: <TimeInfoTip entry={entry} page={page} />,
        };
      } else if (Css.hasClass(target, "netSizeLabel")) {
        // TODO - size tip?
        return {
          multiline: false,
        };
      }
    }
  }

  getEntries() {
    const { entries, model, page } = this.props;

    if (page) {
      return model.getPageEntries(page);
    }

    return entries || [];
  }

  onNetRowClick(netRowIdx) {
    this.setState(({ netRowExpandedState }) => ({
      netRowExpandedState: netRowExpandedState.map(booleanFlipper(netRowIdx)),
    }));
  }

  createNetRows(entries) {
    if (entries.length < 1) {
      return [];
    }

    const { model, page } = this.props;
    const { netRowExpandedState } = this.state;
    const { pageTimingDefinitions } = this.context;

    const m = new NetModel();
    const phases = Phases.calculatePhases(model.input, page, pageTimingDefinitions, null, null);

    let netRowIdx = 0;
    let netInfoRowIdx = 0;
    let firstEntryOfPhaseIdx = 0;

    const netRows = phases.phases.reduce((rows, phase, phaseIdx) => {
      const phaseStartTime = phase.startTime;
      const phaseElapsed = phase.endTime - phase.startTime;
      m.calculatePageTimings(page, phase, phaseElapsed);

      const pageTimingBars = createPageTimingBars(phase.pageTimings);

      phase.files.forEach((entry, i) => {
        const entryIdx = firstEntryOfPhaseIdx + i;

        const opened = netRowExpandedState[entryIdx];
        const fileTimes = m.calculateFileTimes(entry, phaseStartTime, phaseElapsed);
        const bars = fileTimes ? createBars(entry, fileTimes) : null;

        const firstFileInPhase = i === 0;
        const firstPhase = phaseIdx === 0;
        const breakLayout = firstFileInPhase && !firstPhase;
        const netRow = <NetRow
          key={"NetRow" + (++netRowIdx)}
          page={page}
          phase={phase}
          entry={entry}
          entryId={entryIdx}
          opened={opened}
          bars={bars}
          pageTimingBars={pageTimingBars}
          onClick={this.onNetRowClick.bind(this, entryIdx)}
          breakLayout={breakLayout}
        />;

        rows.push(netRow);

        if (opened) {
          rows.push(<NetInfoRow key={"NetInfoRow" + (++netInfoRowIdx)} entry={entry} />);
        }
      });

      firstEntryOfPhaseIdx += phase.files.length;

      return rows;
    }, []);

    return netRows;
  }

  render() {
    const entries = this.getEntries();
    const { page } = this.props;
    const netRows = this.createNetRows(entries);

    return (
      <table className="netTable" cellPadding="0" cellSpacing="0" data-page-id={page ? page.id : null}>
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
}

NetTable.propTypes = {
  entries: PropTypes.array,
  model: PropTypes.object,
  page: PropTypes.object,
};

NetTable.contextType = AppContext;

export default NetTable;
