import React from "react";

import * as Arr from "../core/array";

function safeToString(object) {
  try {
    return object.toString();
  } catch (e) {
    return "";
  }
}

function objectAsStringOrType(object) {
  const label = safeToString(object);
  const re = /\[object (.*?)\]/;
  const m = re.exec(label);
  return m ? m[1] : label;
}

class Representation extends React.Component {
  render() {
    let { className, value, title } = this.props;
    className = className || "object";
    title = title || objectAsStringOrType(value);
    return (
      <div className={`objectBox objectBox-${className}`}>{title}</div>
    );
  }
}

class NullRepresentation extends React.Component {
  render() {
    return <Representation className="null" title="null" />;
  }
}

NullRepresentation.supportsObject = function(object, type) {
  return object === null;
};

class NumberRepresentation extends React.Component {
  render() {
    const { value } = this.props;
    return <Representation className="number" title={value} />;
  }
}

NumberRepresentation.supportsObject = function(object, type) {
  return type === "boolean" || type === "number";
};

class StringRepresentation extends React.Component {
  render() {
    const { value } = this.props;
    return <Representation className="string" title={value} />;
  }
}

StringRepresentation.supportsObject = function(object, type) {
  return type === "string";
};

class ArrRepresentation extends React.Component {
  render() {
    const { value } = this.props;
    const title = "Array [" + value.length + "]";
    return <Representation className="array" title={title} />;
  }
}

ArrRepresentation.supportsObject = function(object, type) {
  return Arr.isArray(object);
};

const Representations = {
  reps: [
    NullRepresentation,
    NumberRepresentation,
    StringRepresentation,
    ArrRepresentation,
  ],

  getRep(object) {
    let type = typeof object;
    if (type === "object" && object instanceof String) {
      type = "string";
    }
    const rep = this.reps.find((rep) => rep.supportsObject(object, type));
    if (rep) {
      return rep;
    }
    return Representation;
  },
};

export default Representations;
