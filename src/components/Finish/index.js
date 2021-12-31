import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default class Finish extends React.Component {
  componentDidMount() {
    localStorage.clear();
  }
  render() {
    //const { id } = this.props.match.params;

    const correct = Number(localStorage.getItem("score"));
    const total = Number(localStorage.getItem("total"));
    const wrong = total - correct;
    return (
      <div className="final-container">
        <h1>My Interview Portal</h1>
        <div className="pannel-heading">
          <div>
            <h1 className="result-heading">Result </h1>
          </div>
          <div>
            <Link to="/">
              <h2 className="home-link">Home</h2>
            </Link>
          </div>
        </div>

        <div className="score-container">
          <h1>Total No. of Questions : {total}</h1>
          <div className="result-container">
            <h2 className="correct">Correct Answers : {correct}</h2>
            <h2 className="wrong">Wrong Answers : {wrong}</h2>
          </div>
        </div>
      </div>
    );
  }
}
