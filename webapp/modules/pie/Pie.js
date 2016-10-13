import React from "react";
import * as Lib from "core/lib";

export default function createPie(fields) {
  return React.createClass(Object.assign({}, {
    title: fields.title || "TITLE",

    data: fields.data || [],

    componentDidMount() {
      this.draw(this.refs.canvas, this);
    },

    render() {
      const model = this.props.model;

      let pages = model ? model.input.log.pages : null;

      if (pages) {
        this.update(pages);
      }

      let labels = this.data.map(item => (
        <div key={item.label} className="pieLabel ">
          <span style={{ backgroundColor: item.color }} className="box ">&nbsp; </span><span className="label ">{item.label}</span>
        </div>
      ));

      return (
        <table ref="container" cellPadding="0" cellSpacing="0" className="pagePieTable ">
          <tbody className=" ">
            <tr className=" ">
              <td title={this.title} className="pieBox ">
                <canvas ref="canvas" className="pieGraph " height="100" width="100"></canvas>
              </td>
              <td className=" ">
                {labels}
              </td>
            </tr>
          </tbody>
        </table>
      );
    },

    cleanUp() {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].value = 0;
        this.data[i].count = 0;
      }
    },

    getLabelTooltipText(item) {
      return fields.getLabelTooltipText ? fields.getLabelTooltipText(item) : "DEFAULT";
    },

    draw(canvas, pie) {
      if (!canvas || !canvas.getContext) {
        return;
      }

      var ctx = canvas.getContext("2d");
      var radius = Math.min(canvas.width, canvas.height) / 2;
      var center = [canvas.width / 2, canvas.height / 2];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var sofar = 0; // keep track of progress

      var data = pie.data;
      var total = 0;
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

      for (let j = 0; j < data.length; j++) {
        var thisvalue = data[j].value / total;
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
    },

    update(pages) {
      this.cleanUp();

      // If there is no selection, display stats for all pages/files.
      if (!pages || !pages.length) {
        this.handlePage(null);
        return;
      }

      // Iterate over all selected pages
      for (var j = 0; j < pages.length; j++) {
        var page = pages[j];
        this.handlePage(page);
      }
    },

    showInfoTip(infoTip, target, x, y) {
      var pieTable = Lib.getAncestorByClass(target, "pagePieTable");
      if (!pieTable) {
        return false;
      }

      var label = Lib.getAncestorByClass(target, "pieLabel");
      if (label) {
        PieInfoTip.render(pieTable.repObject, label.repObject, infoTip);
        return true;
      }
    }
  }, fields));
}
