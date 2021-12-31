import React from "react";
// import Questions from "../Questions";
import "./index.css";
import { Link } from "react-router-dom";

export default class App extends React.Component {
  state = {
    tests: [],
  };

  componentDidMount = async () => {
    const url = "http://interviewapi.stgbuild.com/getQuizData";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ tests: data.tests });
    console.log(this.state.tests);
  };

  render() {
    return (
      <div className="app-container">
        <>
          <h1 className="heading">My Interview Portal</h1>
        </>
        <table>
          <tbody>
            <tr>
              <th>Test</th>
              <th>Number of Questions</th>
              <th></th>
            </tr>
            {this.state.tests.map((eachTest) => (
              <tr key={eachTest._id}>
                <td>{eachTest.name}</td>
                <td>{eachTest.questions.length}</td>
                <td>
                  <Link
                    to={`/questions/${eachTest._id}`}
                    params={{ testData: eachTest }}
                  >
                    <button
                      className="start-button"
                      onClick={() => {
                        console.log(eachTest._id);
                      }}
                    >
                      Start Test
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
