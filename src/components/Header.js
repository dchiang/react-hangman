import React from "react";

const Header = (props) => {
  return (
    <div>
      <h1>Hangman</h1>
      <h3>{props.title}</h3>
    </div>
  );
};

export default Header;
