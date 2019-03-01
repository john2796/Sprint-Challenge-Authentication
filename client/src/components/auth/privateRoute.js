import React, { Component } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3300";
axios.interceptors.request.use(
  function(options) {
    options.headers.authorization = localStorage.getItem("jwt");

    return options;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const privateRoute = Component => {
  return class Authenticated extends Component {
    render() {
      const token = localStorage.getItem("jwt");
      const notLoggedIn = <h1>Please login to see the Jokes🃏</h1>;
      return <>{token ? <Component {...this.props} /> : notLoggedIn}</>;
    }
  };
};

export default privateRoute;
