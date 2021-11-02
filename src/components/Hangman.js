import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Picture from "./Picture";
import Word from "./Word";
import Mistakes from "./Mistakes";

var gameStarted = false;
var maximumFailedAttemps = 6;
var mistakes = [];
var included = false;
var mistakesStyle = { display: "none" };

const Hangman = (props) => {
  const apiUrl = "https://random-word-api.herokuapp.com";
  let textInput = useRef(null);
  let guess = "";

  const [title, setTitle] = useState(
    `Press Any Key to Get Started!. Error left: ${
      maximumFailedAttemps - mistakes.length
    }`
  );
  const [wordToGuess, setWordToGuess] = useState("");
  const [picture, setPicture] = useState(
    `${process.env.PUBLIC_URL}/pictures/hangman-${mistakes.length}.png`
  );
  const [guessedWord, setGuessedWord] = useState([]);

  const setMistakes = (list) => {
    mistakes = list;
  };

  const removeAccentMarks = (word) => {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const requestWord = (url) => {
    let word = "";
    const apiUri = `${apiUrl}/word`;
    fetch(apiUri)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Service is up but HTTP response was not OK");
        }
      })
      .catch((error) => {
        alert(`There was a problem trying to reach the api:${error.message}`);
      })
      .then((data) => {
        word = removeAccentMarks(data.toString());
        console.log(word);
        setWordToGuess(word.toUpperCase());
      });
  };

  const fillMistakes = () => {
    let wrongLetters = mistakes;
    wrongLetters.push(guess);
    mistakesStyle = { display: "block" };
    setMistakes(wrongLetters);
    changeStage();
  };

  const guessLetter = () => {
    const word = [...wordToGuess];
    included = word.includes(guess);
    if (included) {
      fillGuessedWord(word, included);
    } else {
      fillMistakes(included);
    }
  };

  const fillGuessedWord = (word, included) => {
    const notGuessed = "_";
    let resultWord = [];
    if (gameStarted === false) {
      [...wordToGuess].forEach(() => {
        resultWord.push(notGuessed);
      });
    } else {
      for (let i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === guess) {
          resultWord.push(guess);
        } else if (guessedWord[i] !== notGuessed) {
          resultWord.push(guessedWord[i]);
        } else {
          resultWord.push(notGuessed);
        }
      }
    }
    setGuessedWord(resultWord);
    textInput.current.focus();
  };

  useEffect(() => {
    if (wordToGuess === "") {
      requestWord();
    }
  });

  useEffect(() => {
    if (wordToGuess !== "") {
      fillGuessedWord([...wordToGuess]);
    }
  }, [wordToGuess]);

  useEffect(() => {
    changeStage();
  }, [guessedWord]);

  const handleKeyPress = (event) => {
    guess = event.key.toUpperCase();
    try {
      runValidations(guess);
      if (mistakes.length < maximumFailedAttemps) {
        gameStarted = true;
        guessLetter();
      }
    } catch (error) {
      alert(error);
    }
  };

  const evalWin = () => {
    let won = false;
    if (wordToGuess === guessedWord.join("") && gameStarted) {
      won = true;
    }
    return won;
  };

  const evalLoose = () => {
    let loose = false;
    if (mistakes.length === maximumFailedAttemps) {
      loose = true;
    }
    return loose;
  };

  const changeStage = () => {
    if (gameStarted) {
      const errorsLeft = maximumFailedAttemps - mistakes.length;
      let newTitle = `Choose Another Letter. Errors Left: ${errorsLeft}`;
      let newPicture = picture;
      if (included && evalWin()) {
        newTitle = "You Win!";
        newPicture = `${process.env.PUBLIC_URL}/pictures/hangman-win.gif`;
      } else if (!included) {
        newPicture = `${process.env.PUBLIC_URL}/pictures/hangman-${mistakes.length}.png`;
        if (evalLoose()) {
          newTitle = "You Loose! :(";
        }
      }
      setTitle(newTitle);
      setPicture(newPicture);
    }
  };

  const isKeyValid = (key) => {
    const policy = /[A-Z]/;
    if (!policy.test(key)) {
      const error = `The key '${key}' has been pressed but only letters between A and Z are supported`;
      throw error;
    }
  };

  const isKeyRepeated = (key) => {
    if (mistakes.includes(key) || guessedWord.includes(key)) {
      const error = `The letter '${key}' has already been entered`;
      throw error;
    }
  };

  const runValidations = (key) => {
    isKeyValid(key);
    isKeyRepeated(key);
  };

  return (
    <div ref={textInput} tabIndex={-1} onKeyPress={handleKeyPress}>
      <Header title={title} />
      <Word word={guessedWord} />
      <Picture image={picture} />
      <Mistakes style={mistakesStyle} wrongLetters={mistakes} />
    </div>
  );
};

export default Hangman;
