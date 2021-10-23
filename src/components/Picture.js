import React from "react";

const Picture = (props) => {
  const imageStyle = {
    width: "360px",
    height: "480px",
  };
  return <img style={imageStyle} src={props.image} alt={props.title} />;
};

export default Picture;
