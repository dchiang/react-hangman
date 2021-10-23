import React from "react";
import Letter from "./Letter";

const Word = (props) => {
  const wordStyle = {
    fontSize: "2em",
    margin: "0.25em",
  };

  return (
    <div>
      {props.word.map((letter) => (
        <Letter style={wordStyle} value={letter} />
      ))}
    </div>
  );
};

export default Word;
