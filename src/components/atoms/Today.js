import React from "react";
import * as RiIcons from "react-icons/ri";

export const Today = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  return (
    <div className="today">
      {" "}
      <RiIcons.RiCalendarLine /> Today {`(${dd}.${mm}.${yyyy})`}
    </div>
  );
};
