import React, { Component } from "react";
import PropTypes from "prop-types";

import AppContext from "../AppContext";
import * as Dom from "../core/dom";


function Label({ label, labelIdx, color }) {
  return (
    <div key={label} className="pieLabel " data-label-idx={labelIdx}>
      <span style={{ backgroundColor: color }} className="box ">&nbsp; </span>
      <span className="label ">{label}</span>
    </div>
  );
}

Label.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  labelIdx: PropTypes.number,
};


class Pie extends Component {
  constructor(...args) {
    super(...args);

    this.canvasRef = React.createRef();
    this.pagePieTableRef = React.createRef();
  }

  componentDidMount() {
    // console.log("componentDidMount", this.props);

    const { getInfoTipHolder } = this.context;
    if (getInfoTipHolder) {
      getInfoTipHolder().addListener(this);
    }

    this.draw();
  }

  componentWillUnmount() {
    const { getInfoTipHolder } = this.context;
    if (getInfoTipHolder) {
      getInfoTipHolder().removeListener(this);
    }
  }

  componentDidUpdate() {
    // console.log("componentDidUpdate", this.props);
    this.draw();
  }

  showInfoTip(infoTip, target, x, y) {
    const pieTable = Dom.getAncestorByClass(target, "pagePieTable");

    // ensure we only deal with our Pie's table
    if (pieTable !== this.pagePieTableRef.current) {
      return false;
    }

    const labelElement = Dom.getAncestorByClass(target, "pieLabel");
    if (labelElement) {
      const { data, getLabelTooltipText } = this.props;
      const { labelIdx } = labelElement.dataset;
      const item = data[parseInt(labelIdx)];
      return {
        element: getLabelTooltipText(item),
      };
    }
  }

  render() {
    const { data, title = "Pie Title" } = this.props;

    return (
      <table ref={this.pagePieTableRef} cellPadding="0" cellSpacing="0" className="pagePieTable ">
        <tbody className=" ">
          <tr className=" ">
            <td title={title} className="pieBox ">
              <canvas ref={this.canvasRef} className="pieGraph " height="100" width="100" title={title}></canvas>
            </td>
            <td className=" ">
              {
                data && data.map(({ label, color }, i) => <Label key={String(i)} label={label} color={color} labelIdx={i} />)
              }
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getLabelTooltipText(item) {
    return fields.getLabelTooltipText ? fields.getLabelTooltipText(item) : "DEFAULT";
  }

  draw() {
    const { data } = this.props;
    const canvas = this.canvasRef.current;

    // console.log("draw", canvas, pie);
    if (!canvas || !canvas.getContext || !data || !data.length) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const radius = Math.min(canvas.width, canvas.height) / 2;
    const center = [canvas.width / 2, canvas.height / 2];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].value;
    }

    if (!total) {
      ctx.beginPath();
      ctx.moveTo(center[0], center[1]); // center of the pie
      ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fillStyle = "rgb(229,236,238)";
      ctx.lineStyle = "lightgray";
      ctx.fill();
      return;
    }

    let sofar = 0; // keep track of progress

    for (let j = 0; j < data.length; j++) {
      const thisvalue = data[j].value / total;
      if (thisvalue <= 0) {
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(center[0], center[1]);
      ctx.arc(center[0], center[1], radius,
        Math.PI * (-0.5 + 2 * sofar), // -0.5 sets set the start to be top
        Math.PI * (-0.5 + 2 * (sofar + thisvalue)),
        false);

      // line back to the center
      ctx.lineTo(center[0], center[1]);
      ctx.closePath();
      ctx.fillStyle = data[j].color;
      ctx.fill();

      sofar += thisvalue; // increment progress tracker
    }
  }
}

Pie.contextType = AppContext;

Pie.propTypes = {
  getLabelTooltipText: PropTypes.func,
  data: PropTypes.array,
  title: PropTypes.string,
};

export default Pie;
