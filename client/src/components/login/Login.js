import React from "react";
import axios from "axios";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errors: {}
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .post("/api/login", this.state)
      .then(res => {
        localStorage.setItem("jwt", res.data.token);
        this.props.history.push("/dashboard");
      })
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    const { errors } = this.state;
    return (
      <>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username" />
            <input
              name="username"
              id="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              type="text"
            />
          </div>
          <span style={{ color: "red", fontSize: 10 }}>
            {errors && errors.username}
          </span>
          <div>
            <label htmlFor="password" />
            <input
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              type="password"
            />
          </div>
          <span style={{ color: "red", fontSize: 10 }}>
            {errors && errors.password}
          </span>
          <div>
            <button type="submit">Login</button>
          </div>
          <span style={{ color: "red", fontSize: 10 }}>
            {errors && errors.message}
          </span>
        </form>
      </>
    );
  }
}

export default Login;
