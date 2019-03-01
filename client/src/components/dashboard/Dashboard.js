import React, { Component } from "react";

import privateRoute from "../auth/privateRoute";

class Dashboard extends Component {
  render() {
    return <h1>dashboard</h1>;
  }
}

export default privateRoute(Dashboard);
