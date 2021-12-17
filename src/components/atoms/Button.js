import React from "react";

export const Button = ({ icon, text, classes, ...rest }) => {
  return (
    <button className={classes} {...rest}>
      {icon}
      {text}
    </button>
  );
};
