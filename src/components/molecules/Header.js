import React from "react";
import { Logo } from "../atoms/Logo";

export const Header = ({ logo, title }) => {
  return (
    <div className="header">
      <Logo src={logo} />
      <h2 className="header__title">{title}</h2>
    </div>
  );
};
