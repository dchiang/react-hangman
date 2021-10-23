import React from "react";
import Word from "./Word";

const Mistakes = (props) => {
  return (
    <div style={props.style}>
      <h3>Mistakes:</h3>
      <Word word={props.wrongLetters} />
    </div>
  );
};

export default Mistakes;
