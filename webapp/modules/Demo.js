import React from "react";
import Link from "valuelink";
import { Input } from "valuelink/tags.jsx";

import App from "./App";
import HarModel from "preview/harModel";
import Stats from "./Stats";
import InfoTip from "./InfoTip";
import InfoTipHolder from "./InfoTipHolder";

import CachePie from "./pie/CachePie";
import ContentPie from "./pie/ContentPie";
import TimingPie from "./pie/TimingPie";
import TrafficPie from "./pie/TrafficPie";

import AboutTab from "./tabs/AboutTab";
import HomeTab from "./tabs/HomeTab";
import PreviewTab from "./tabs/PreviewTab";

import PageTimeline from "./pagetimeline/PageTimeline";

import PageTable from "./pagetable/PageTable";

import NetTable from "./nettable/NetTable";
import NetRow from "./nettable/NetRow";
import NetSummaryRow from "./nettable/NetSummaryRow";

import Headers from "./requestbodies/Headers";
import PlainResponse from "./requestbodies/PlainResponse";
import Highlighted from "./requestbodies/Highlighted";

import TabView from "./tabview/TabView";
import TabBody from "./tabview/TabBody";

import Toolbar from "./toolbar/Toolbar";

import TimeInfoTip from "./timeinfotip/TimeInfoTip";

import DomTree from "./domtree/DomTree";

const components = Object.assign({
  React,
  App,
  AboutTab,
  HomeTab,
  PreviewTab,
  HarModel,
  PageTimeline,
  InfoTip,
  InfoTipHolder,
  PageTable,
  NetTable,
  NetRow,
  NetSummaryRow,
  Stats,
  CachePie,
  ContentPie,
  TimingPie,
  TrafficPie,
  TabView,
  Headers,
  PlainResponse,
  Toolbar,
  TimeInfoTip,
  DomTree
});

/**
 * @param {string} componentName
 *   The name of the React component to demo.
 * @param {function} propsGenerator
 *   An optional function that generates the extra props that the component needs.
 * @param {function} customContainerGenerator
 *   An optional function that generates the React component that demo will be inserted into.
 */
function newDemo(componentName, propsGenerator, customContainerGenerator) {
  return {
    componentName,
    propsGenerator,
    customContainerGenerator
  };
}

const TableDemoContainer = props => {
  const { demo } = props;
  return (
    <DemoContainer demo={demo}>
      <table width="50%">
        <tbody>{props.children}</tbody>
      </table>
    </DemoContainer>
  );
};

const RequestBodyContainer = props => {
  return (
    <div className="netTable">
      <TabBody { ...props }>{props.children}</TabBody>
    </div>
  );
};

const InfoTipContainer = props => {
  const ref = ref => {
    ref.setAttribute("active", props.active || "true");
    ref.setAttribute("multiline", props.multiline || "true");
  };
  const style = props.fixedPosition ? { position: "static" } : null;
  return (
    <div className="infoTip" ref={ref} style={style}>{props.children}</div>
  );
};

// demo data
var demos = [
  "App",
  newDemo("AboutTab", (demo, commonProps) => ({
    version: "VERSION",
    harViewerExampleApp: window.location.href.split("?")[0]
  })),
  "HomeTab",
  "PreviewTab",
  "PageTable",
  "NetTable",
  newDemo("NetRow", null, (demo, demoProps) =>
    <TableDemoContainer demo={demo}><NetRow { ...demoProps } /></TableDemoContainer>
  ),
  newDemo("NetSummaryRow", null, (demo, demoProps) =>
    <TableDemoContainer demo={demo}><NetSummaryRow { ...demoProps } /></TableDemoContainer>
  ),
  "InfoTip",
  "PageTimeline",
  "Stats",
  "TimingPie",
  "ContentPie",
  "TrafficPie",
  "CachePie",
  newDemo("TabView", (demo, commonProps) => ({
    tabs: [1, 2, 3].map(id => ({
      id: id,
      label: "Tab " + id,
      body: <div>Body {id}</div>
    }))
  })),
  newDemo("Headers", null, (demo, demoProps) =>
    <RequestBodyContainer id="Headers" selected="true"><Headers { ...demoProps } /></RequestBodyContainer>
  ),
  newDemo("PlainResponse", null, (demo, demoProps) =>
    <RequestBodyContainer id="Response" selected="true"><PlainResponse { ...demoProps } /></RequestBodyContainer>
  ),
  newDemo("Highlighted", null, (demo, demoProps) =>
    <RequestBodyContainer id="Response" selected="true"><Highlighted { ...demoProps } /></RequestBodyContainer>
  ),
  "Toolbar",
  newDemo("TimeInfoTip", null, (demo, demoProps) => {
    const { entries } = demoProps;
    const children = entries.slice(0, 3).map((entry, i) => (
      <div key={i} style={{ display: "inline-block" }}>
        <InfoTipContainer fixedPosition="false"><TimeInfoTip { ...demoProps } entry={entry} /></InfoTipContainer>
      </div>
    ));
    return (
      <div style={{ position: "absolute" }}>
        {children}
      </div>
    );
  }),
  newDemo("DomTree", null, (demo, demoProps) =>
    <div className="tabDOMBody"><DomTree { ...demoProps } /></div>
  )
].reduce(function(map, demo) {
  if (typeof demo === "string") {
    demo = newDemo(demo);
  }
  map[demo.componentName] = demo;
  return map;
}, {});

// demo impl

const DemoContainer = React.createClass({
  updatePreviewCols(ref) {
    // HACK!
    // Work out how to do this properly.
    // React throws an Unknown Prop Warning if we try and set "previewCols" attr on React component.
    // https://facebook.github.io/react/warnings/unknown-prop.html
    ref.setAttribute("previewCols", "url status domain size timeline type");
  },

  render() {
    const { demo } = this.props;
    return (
      <InfoTipHolder>
        <div>
          <b>{demo.componentName}</b>
          <div ref={this.updatePreviewCols} id="content" style={{ position: "absolute", width: "100%", height: "100%" }}>
            {this.props.children}
          </div>
        </div>
      </InfoTipHolder>
    );
  }
});

const DemoLinks = React.createClass({
  demoToLink(demoKey) {
    const demo = this.props.demos[demoKey];
    const href = "?demo=" + demo.componentName;
    return (
      <li key={demoKey}><a href={href}>{demo.componentName}</a></li>
    );
  },
  render() {
    return (
      <ul>
        {Object.keys(this.props.demos).map(this.demoToLink)}
      </ul>
    );
  }
});

export default React.createClass({
  getInitialState() {
    return {
      harUrl: "../examples/softwareishard.com.har"
    };
  },

  createDemoContainer(demo, demoProps) {
    let demoContainer = null;

    if (demo.customContainerGenerator) {
      // Use the customContainerGenerator to generate the React component that demo will be
      // inserted into.
      demoContainer = demo.customContainerGenerator(demo, demoProps);
    } else {
      const componentProps = demo.propsGenerator ? demo.propsGenerator(demo, demoProps) : {};
      const props = Object.assign({}, demoProps, componentProps);
      const demoComponent = React.createElement(components[demo.componentName], props);
      demoContainer = demoComponent;
    }

    demoContainer = <DemoContainer demo={demo}>{demoContainer}</DemoContainer>;

    return demoContainer;
  },

  renderDemoLinks() {
    const linked = Link.all(this, "harUrl");
    return (
      <div>
        <div>The Demo Shell uses a "demo" query parameter to load a component.</div>
        <div>HAR URL: <Input type="text" size="64" valueLink={linked.harUrl} /></div>
        <DemoLinks { ...this.props } demos={demos} />
      </div>
    );
  },

  render() {
    const { demoName, demoProps } = this.props;
    const demo = demos[demoName];
    return (
      <div>
        <a href="?">Demo Home</a>
        {demo ? this.createDemoContainer(demo, demoProps) : this.renderDemoLinks(demos)}
      </div>
    );
  }
});
