const entry = {
  request: {
    method: "GET",
    url: "http://www.softwareishard.com/blog/firebug/firebug-16-beta-1-released/"
  },
  response: {
    status: 200,
    statusText: "OK",
    bodySize: 31918,
    content: {
      mimeType: "text/html"
    }
  }
};

const bars = [
  {
    className: "netBlockingBar",
    style: {
      left: "0%",
      width: "0%"
    }
  },
  {
    className: "netResolvingBar",
    style: {
      left: "0%",
      width: "0%"
    }
  },
  {
    className: "netConnectingBar",
    style: {
      left: "0%",
      width: "0.852%"
    }
  },
  {
    className: "netSendingBar",
    style: {
      left: "0%",
      width: "0.852%"
    }
  },
  {
    className: "netWaitingBar",
    style: {
      left: "0%",
      width: "73.442%"
    }
  },
  {
    className: "netReceivingBar",
    style: {
      left: "0%",
      width: "77.352%"
    },
    timeLabel: "2s"
  }
];

export { entry, bars };
