import React from "react";

export const Modal = ({ content, setDisplayModal }) => {
  return (
    <div className="overlay">
      <div className="modal">
        <div
          className="modal__close"
          onClick={() => {
            setDisplayModal(false);
          }}
        >
          &times;
        </div>
        {content}
      </div>
    </div>
  );
};
