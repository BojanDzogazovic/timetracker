import React from "react";

export const Table = ({ heading, content }) => {
  return (
    <div className="table">
      <div className="table__heading">
        {heading.map((h, index) => (
          <div
            key={index}
            className="table__cell table__cell--heading"
            style={h.styles}
          >
            {h.text}
          </div>
        ))}
      </div>
      <div className="table__body">{content}</div>
    </div>
  );
};
