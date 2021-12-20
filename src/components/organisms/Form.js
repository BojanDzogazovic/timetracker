import React from "react";
import { Button } from "../atoms/Button";

export const Form = ({
  selectedTimer,
  setSelectedTimer,
  setDisplayModal,
  onFormSubmit,
  ctaText,
  records,
  setRecords,
  setCounter,
  reset,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(selectedTimer);

    if (records.some((record) => record.id === selectedTimer.id)) {
      setRecords(
        records.map((record) =>
          record.id === selectedTimer.id ? selectedTimer : record
        )
      );
    } else {
      setRecords([...records, selectedTimer]);
    }

    reset();
    setCounter((prevState) => prevState + 1);
    setDisplayModal(false);
  };

  return (
    <form
      className="form"
      onSubmit={(e) => {
        onSubmit(e);
      }}
    >
      <div className="form__wrapper">
        <input
          value={selectedTimer.time.hours || "00"}
          type="number"
          min="0"
          className="form__input form__input--number"
          onChange={(e) => {
            if (e.target.value.length === 1) {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  hours: "0" + e.target.value,
                },
              });
            } else {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  hours: e.target.value,
                },
              });
            }
          }}
        />
        :
        <input
          value={selectedTimer.time.minutes || "00"}
          type="number"
          className="form__input form__input--number"
          min="0"
          max="59"
          onChange={(e) => {
            if (e.target.value.length === 1) {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  minutes: "0" + e.target.value,
                },
              });
            } else {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  minutes: e.target.value,
                },
              });
            }
          }}
        />
        :
        <input
          value={selectedTimer.time.seconds || "00"}
          type="number"
          className="form__input form__input--number"
          min="0"
          max="99"
          onChange={(e) => {
            if (e.target.value.length === 1) {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  seconds: "0" + e.target.value,
                },
              });
            } else {
              setSelectedTimer({
                ...selectedTimer,
                time: {
                  ...selectedTimer.time,
                  seconds: e.target.value,
                },
              });
            }
          }}
        />
      </div>
      <div className="form__wrapper">
        <input
          value={selectedTimer.description || ""}
          type="text"
          placeholder="Enter description..."
          className="form__input form__input--text"
          onChange={(e) => {
            setSelectedTimer({
              ...selectedTimer,
              description: e.target.value,
            });
          }}
        />
      </div>
      <Button
        text={ctaText}
        classes="tracking-cta tracking-cta__create tracking-cta__create--modal"
        onClick={(e) => {
          onSubmit(e);
        }}
      />
    </form>
  );
};
