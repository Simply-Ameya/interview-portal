import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./index.css";
// import Finish from "../Finish/index";

// Using Pure Component to prevent unnecessary re-renders
class Questions extends React.PureComponent {
  state = {
    testSubject: [],
    testData: [],
    questionsData: [],
    currentQuestion: 0,
    question: "",
    type: "",
    options: [],
    score: 0,
    checked: false,
    radioAnswer: undefined,
    checkboxAnswer: [],
  };
  // Mounting data from API to state
  async componentDidMount() {
    const { id } = this.props.match.params;
    let tests = [];
    const url = "http://interviewapi.stgbuild.com/getQuizData";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ testSubject: data });
    for (let i = 0; i < data.tests.length; i++) {
      const temp = await data.tests[i];
      if (temp._id === id) {
        tests.push(data.tests[i]);
        this.setState({
          testData: tests[0],
          questionsData: this.state.testData.questions,
        });
        this.setState({
          question:
            this.state.questionsData[this.state.currentQuestion].questionText,
          options: this.state.questionsData[this.state.currentQuestion].options,
        });
      }
    }
    if (
      this.state.questionsData[this.state.currentQuestion].type ===
      "Multiple-Response"
    ) {
      this.setState({ type: "Multiple-Response" });
    }
    if (localStorage.getItem("currentQuestion") === null) {
      localStorage.setItem("currentQuestion", 0);
    }

    this.setState({
      currentQuestion: Number(localStorage.getItem("currentQuestion")),
    });
  }

  // Updating API data stored in state when component re-renders for next/previous questions
  async componentDidUpdate() {
    const { id } = this.props.match.params;
    const tests = [];
    for (let i = 0; i < this.state.testSubject.tests.length; i++) {
      const temp = await this.state.testSubject.tests[i];
      if (temp._id === id) {
        tests.push(this.state.testSubject.tests[i]);
        this.setState({ testData: tests[0] });
        this.setState({ questionsData: this.state.testData.questions });
      }
    }
    this.setState({
      question:
        this.state.questionsData[this.state.currentQuestion].questionText,
      options: this.state.questionsData[this.state.currentQuestion].options,
    });
    if (
      this.state.questionsData[this.state.currentQuestion].type ===
      "Multiple-Response"
    ) {
      this.setState({ type: "Multiple-Response" });
    } else {
      this.setState({ type: "" });
    }
    window.history.replaceState(
      this.state.currentQuestion,
      "New Page Title",
      `/questions/${id}/${
        this.state.questionsData[this.state.currentQuestion]._id
      }`
    );
  }
  // Function to get default values from the local storage and display checked inputs
  isChecked(eachOption) {
    if (this.state.type === "Multiple-Response") {
      let defaultChecked = [];
      if (
        JSON.parse(
          localStorage.getItem(
            `${this.state.questionsData[this.state.currentQuestion]._id}`
          )
        )
      ) {
        defaultChecked = JSON.parse(
          localStorage.getItem(
            `${this.state.questionsData[this.state.currentQuestion]._id}`
          )
        );
      }
      let defaultArray = [];
      for (let i = 0; i < defaultChecked.length; i++) {
        defaultArray.push(defaultChecked[i]);
      }
      return defaultArray.includes(this.state.options.indexOf(eachOption))
        ? true
        : false;
    } else {
      return this.state.options.indexOf(eachOption) ===
        JSON.parse(
          localStorage.getItem(
            `${this.state.questionsData[this.state.currentQuestion]._id}`
          )
        )
        ? true
        : false;
    }
  }
  // Function to change checked state of input elements and update data in local storage appropriately
  handleChange(e, eachOption, optionArray) {
    let itemChecked = {};
    itemChecked[e.target.name] = e.target.value;
    this.setState(itemChecked);
    if (this.state.type === "Multiple-Response") {
      if (e.target.checked) {
        if (
          localStorage.getItem(
            `${this.state.questionsData[this.state.currentQuestion]._id}`
          ) !== null
        ) {
          optionArray = JSON.parse(
            localStorage.getItem(
              `${this.state.questionsData[this.state.currentQuestion]._id}`
            )
          );
        } else {
          optionArray = [];
        }
        this.setState({
          checkboxAnswer: [
            ...this.state.checkboxAnswer,
            this.state.options.indexOf(eachOption),
          ],
        });
        optionArray.push(this.state.options.indexOf(eachOption));
        optionArray.sort();
        localStorage.setItem(
          `${this.state.questionsData[this.state.currentQuestion]._id}`,
          JSON.stringify(optionArray)
        );
      } else {
        optionArray = JSON.parse(
          localStorage.getItem(
            `${this.state.questionsData[this.state.currentQuestion]._id}`
          )
        );
        optionArray.splice(
          optionArray.indexOf(this.state.options.indexOf(eachOption)),
          1
        );
        this.state.checkboxAnswer.splice(
          this.state.checkboxAnswer.indexOf(
            this.state.options.indexOf(eachOption)
          ),
          1
        );
        this.setState({
          checkboxAnswer: this.state.checkboxAnswer,
        });
        optionArray.sort();
        localStorage.setItem(
          `${this.state.questionsData[this.state.currentQuestion]._id}`,
          JSON.stringify(optionArray)
        );
      }
    } else {
      this.setState({ radioAnswer: e.target.value });
      localStorage.setItem(
        `${this.state.questionsData[this.state.currentQuestion]._id}`,
        this.state.options.indexOf(eachOption)
      );
    }
  }

  // Function to calculate score of the test
  handleFinish(score) {
    for (let i = 0; i <= this.state.currentQuestion; i++) {
      if (this.state.questionsData[i].type === "Multiple-Response") {
        if (
          JSON.stringify(
            JSON.parse(
              localStorage.getItem(`${this.state.questionsData[i]._id}`)
            )
          ) === JSON.stringify(this.state.questionsData[i].correctOptionIndex)
        ) {
          score += 1;
        }
      } else {
        if (
          this.state.questionsData[i].correctOptionIndex ===
          JSON.parse(localStorage.getItem(`${this.state.questionsData[i]._id}`))
        ) {
          score += 1;
        }
      }
    }
    localStorage.setItem("score", score);
  }
  // Rendering Question component
  render() {
    const { id } = this.props.match.params;
    let optionArray = [];
    let score = 0;
    localStorage.setItem("score", 0);
    localStorage.setItem("total", this.state.questionsData.length);
    let current = Number(localStorage.getItem("currentQuestion"));

    return (
      <div className="panel-container">
        <div>
          <h1>{this.state.testData.name}</h1>
        </div>
        <div className="panel-body">
          <div className="heading-cotainer">
            <h2 className="heading">{this.state.question}</h2>
          </div>
          <div className="option-container">
            {this.state.options.map((eachOption) => (
              <label key={eachOption}>
                <input
                  id={this.state.options.indexOf(eachOption)}
                  type={
                    this.state.type === "Multiple-Response"
                      ? "checkbox"
                      : "radio"
                  }
                  name={this.state.question}
                  value={this.state.options.indexOf(eachOption)}
                  onChange={(e) =>
                    this.handleChange(e, eachOption, optionArray)
                  }
                  checked={this.isChecked(eachOption)}
                />
                {eachOption}
              </label>
            ))}
          </div>
        </div>
        <div className="button-container">
          {/* Display functional previous button only when question number is greater than 1 */}
          {this.state.currentQuestion > 0 && (
            <button
              className="button prev-button"
              onClick={() => {
                this.setState({
                  currentQuestion: this.state.currentQuestion - 1,
                });
                current -= 1;
                localStorage.setItem("currentQuestion", current);
              }}
            >
              Previous
            </button>
          )}
          {/* Display functional next button till the last question */}
          {this.state.currentQuestion < this.state.questionsData.length - 1 && (
            <button
              className="button nxt-button"
              onClick={() => {
                this.setState({
                  currentQuestion: this.state.currentQuestion + 1,
                });
                current += 1;
                localStorage.setItem("currentQuestion", current);
              }}
            >
              Next
            </button>
          )}

          {/* Final finish button function yet to be implemented */}
          <Link to={`/finish/${id}`}>
            <button
              className="button finish-button"
              onClick={() => this.handleFinish(score)}
            >
              Finish
              {/* <Finish /> */}
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Questions);
