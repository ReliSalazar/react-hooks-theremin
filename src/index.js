import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import ControlPad from "./components/ControlPad";

const GlobalStyle = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
`;

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  background-color: #eee;
  color: #2d2d2d;
  user-select: none;
`;

class App extends Component {
  render() {
    return (
      <Fragment>
        <GlobalStyle />
        <Container>
          <ControlPad />
        </Container>
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
