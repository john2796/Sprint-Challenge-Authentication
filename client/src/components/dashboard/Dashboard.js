import React, { Component } from "react";
import axios from "axios";
import privateRoute from "../auth/privateRoute";

class Dashboard extends Component {
  state = {
    jokes: [],
    errors: {}
  };
  componentDidMount() {
    this.fetchJokes();
  }

  fetchJokes = async () => {
    try {
      const jokes = await axios.get("/api/jokes");
      this.setState({
        jokes: jokes.data
      });
    } catch (err) {
      this.setState({ errors: err.response.data });
    }
  };
  render() {
    const { jokes } = this.state;
    return (
      <div className="jokes-card">
        <h1>Dizz Jokes 🤣</h1>
        {jokes.map((j, idx) => (
          <p key={j.id}>
            {" "}
            <strong>joke #{idx + 1} </strong>
            <br /> {j.joke}
          </p>
        ))}
      </div>
    );
  }
}

export default privateRoute(Dashboard);
