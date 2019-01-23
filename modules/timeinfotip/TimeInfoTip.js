import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Date_ from "../core/date";
import * as Str from "../core/string";
import Strings from "i18n!../nls/requestList";

function formatTime(time) {
  return Str.formatTime(time.toFixed(2));
}

function formatStartTime(time) {
  const positive = time > 0;
  const label = Str.formatTime(Math.abs(time.toFixed(2)));
  if (!time) {
    return label;
  }
  return (positive > 0 ? "+" : "-") + label;
}

const TimeInfoTipRow = (props) => {
  return (
    <tr className={"timeInfoTipRow" + (props.collapsed ? " collapsed" : "")}>
      <td className={"net" + props.type + "Bar timeInfoTipBar"}>
      </td>
      <td className="timeInfoTipCell startTime">{formatStartTime(props.start)}</td>
      <td className="timeInfoTipCell elapsedTime">{formatTime(props.elapsed)}</td>
      <td>{props.label}</td>
    </tr>
  );
};

TimeInfoTipRow.propTypes = {
  collapsed: PropTypes.bool,
  elapsed: PropTypes.number,
  label: PropTypes.string,
  type: PropTypes.string,
  start: PropTypes.number,
};

const TimeInfoTipEventRow = (props) => {
  const styleCenter = {
    textAlign: "center",
  };
  return (
    <tr className="timeInfoTipEventRow">
      <td style={styleCenter} className="timeInfoTipBar">
        <div className={props.classes + " timeInfoTipEventBar"}>
        </div>
      </td>
      <td>{(typeof props.start === "number") ? formatStartTime(props.start) : ""}</td>
      <td colSpan="2">{props.label}</td>
    </tr>
  );
};

TimeInfoTipEventRow.propTypes = {
  classes: PropTypes.string,
  label: PropTypes.string,
  start: PropTypes.number,
};

function makeTimeInfoTipRows(timeInfoTipRowData, entry) {
  const context = {
    start: 0,
    rows: [],
  };
  return timeInfoTipRowData.reduce((context, data, i) => {
    const time = entry.timings[data.key];
    if (time >= 0) {
      if (data.key !== "blocked") {
        const row = <TimeInfoTipRow key={data.type} label={data.label || data.type} type={data.type} start={context.start} elapsed={time} />;
        context.rows.push(row);
      }
      context.start += time;
    }
    return context;
  }, context).rows;
}

function makeTimeInfoTipEventRows(timeInfoTipEventRowData) {
  return timeInfoTipEventRowData.map((data) => (
    <TimeInfoTipEventRow key={data.type} label={data.label || data.type} type={data.type} start={data.start} classes={data.classes} />
  ));
}

const defaultTimeInfoTipRowData = [
  {
    type: "Blocking",
    key: "blocked",
  },
  {
    type: "Resolving",
    key: "dns",
  },
  {
    type: "Connecting",
    key: "connect",
  },
  {
    type: "Sending",
    key: "send",
  },
  {
    type: "Waiting",
    key: "wait",
  },
  {
    type: "Receiving",
    key: "receive",
  },
];

const defaultTimeInfoTipEventRowData = [
  {
    type: "onContentLoad",
    label: Strings.ContentLoad,
    classes: "netContentLoadBar",
  },
  {
    type: "onLoad",
    label: Strings.WindowLoad,
    classes: "netWindowLoadBar",
  },
];

class TimeInfoTip extends Component {
  getTimeInfoTipRowData(timeInfoTipRowData) {
    if (!timeInfoTipRowData) {
      timeInfoTipRowData = defaultTimeInfoTipRowData.map((data) => {
        return Object.assign({}, data, {
          label: Strings["request.phase." + data.type],
        });
      });
    }
    return timeInfoTipRowData;
  }

  getTimeInfoTipEventRowData(timeInfoTipEventRowData, page) {
    if (!timeInfoTipEventRowData) {
      timeInfoTipEventRowData = defaultTimeInfoTipEventRowData;
    }

    if (page) {
      timeInfoTipEventRowData = timeInfoTipEventRowData.map((data) => {
        return Object.assign({}, data, {
          start: page.pageTimings[data.type],
        });
      });
    }

    return timeInfoTipEventRowData;
  }

  render() {
    const { entry, page } = this.props;
    let { timeInfoTipRowData, timeInfoTipEventRowData } = this.props;

    timeInfoTipRowData = this.getTimeInfoTipRowData(timeInfoTipRowData);
    timeInfoTipEventRowData = this.getTimeInfoTipEventRowData(timeInfoTipEventRowData, page);

    const timeInfoTipRows = makeTimeInfoTipRows(timeInfoTipRowData, entry);
    const timeInfoTipEventRows = makeTimeInfoTipEventRows(timeInfoTipEventRowData);

    const pageStart = page ? Date_.parseISO8601(page.startedDateTime) : null;
    const requestStart = Date_.parseISO8601(entry.startedDateTime);
    const requestStartTimeSinceBeginning = pageStart ? (requestStart - pageStart) : requestStart;

    return (
      <table className="timeInfoTip">
        <tbody>
          <tr>
            <td></td>
            <td>{Str.formatTime(requestStartTimeSinceBeginning)}</td>
            <td colSpan="2" className="timeInfoTipStartLabel">{Strings["request.Started"]}</td>
          </tr>
          <tr>
            <td colSpan="4" height="10px" className="timeInfoTipSeparator">
              <span>{Strings["request.phases.label"]} </span>
            </td>
          </tr>
          {timeInfoTipRows}
          <tr>
            <td colSpan="4" height="10px" className="timeInfoTipSeparator">
              <span>{Strings["request.timings.label"]} </span>
            </td>
          </tr>
          {timeInfoTipEventRows}
        </tbody>
      </table>
    );
  }
}

TimeInfoTip.propTypes = {
  entry: PropTypes.object,
  page: PropTypes.object,
  timeInfoTipRowData: PropTypes.object,
  timeInfoTipEventRowData: PropTypes.object,
};

export default TimeInfoTip;
