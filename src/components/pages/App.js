import React, { useState, useEffect } from "react";
import * as RiIcons from "react-icons/ri";
import "../../styles/index.scss";

import logo from "../../assets/images/logo.svg";

import { Today } from "../atoms/Today";
import { Loader } from "../atoms/Loader";
import { Button } from "../atoms/Button";
import { Header } from "../molecules/Header";
import { Modal } from "../molecules/Modal";
import { Table } from "../organisms/Table";
import { Form } from "../organisms/Form";

import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const App = () => {
  const [displayModalForCreate, setDisplayModalForCreate] = useState(false);
  const [displayModalForUpdate, setDisplayModalForUpdate] = useState(false);
  const [changer, setChanger] = useState(0);
  const [records, setRecords] = useState();
  const [isRunning, setIsRunning] = useState(false);

  const [runningHours, setRunningHours] = useState("00");
  const [runningMinutes, setRunningMinutes] = useState("00");
  const [runningSeconds, setRunningSeconds] = useState("00");

  const [selectedTimer, setSelectedTimer] = useState({
    time: { hours: "00", minutes: "00", seconds: "00" },
    description: "",
    id: "",
    isActive: false,
  });

  const recordsCollection = collection(db, "records");

  const resetSelected = () => {
    setSelectedTimer({
      time: { hours: "00", minutes: "00", seconds: "00" },
      description: "",
      id: "",
      isActive: false,
    });
  };

  const createRecords = async ({ time, description, isActive }) => {
    await addDoc(recordsCollection, {
      time: { hours: time.hours, minutes: time.minutes, seconds: time.seconds },
      description: description,
      isActive: isActive,
    });
    resetSelected();
  };

  const readRecords = async () => {
    const data = await getDocs(recordsCollection);
    setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const updateRecords = async (selectedTimer) => {
    const recordDoc = doc(db, "records", selectedTimer.id);
    await updateDoc(recordDoc, selectedTimer);
  };

  const deleteRecords = async (id) => {
    const recordDoc = doc(db, "records", id);
    await deleteDoc(recordDoc);
    resetSelected();
  };

  useEffect(() => {
    readRecords();
    // eslint-disable-next-line
  }, [changer]);

  useEffect(() => {
    if (isRunning) {
      const id = window.setInterval(() => {
        setRunningSeconds((runningSeconds) => Number(runningSeconds) + 1);
      }, 1000);

      if (runningSeconds === 60) {
        setRunningSeconds("00");
        setRunningMinutes((runningMinutes) => Number(runningMinutes) + 1);
      }

      if (runningMinutes === 60) {
        setRunningMinutes("00");
        setRunningHours((runningHours) => Number(runningHours) + 1);
      }
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [isRunning, runningSeconds, runningMinutes, runningHours]);

  return (
    <div className="App">
      <Header logo={logo} title="Tracking tool" />
      <div className="wrapper">
        <Today />
        <div className="tracking-ctas">
          <Button
            style={{
              pointerEvents: isRunning || selectedTimer.id ? "none" : "",
              opacity: isRunning || selectedTimer.id ? "0.5" : "1",
            }}
            icon={<RiIcons.RiTimerLine />}
            text="Start new timer"
            classes="tracking-cta tracking-cta__create"
            onClick={() => {
              setDisplayModalForCreate(true);
            }}
          />
          {/* Since there can only be one active stopwatch instead of "Stop all" as on design, it will say just "Stop" and stop active one, and be enabled only if there is active stopwatch*/}
          <Button
            style={{
              pointerEvents: !isRunning && !selectedTimer.id ? "none" : "",
              opacity: !isRunning && !selectedTimer.id ? "0.5" : "1",
            }}
            icon={<RiIcons.RiStopCircleLine />}
            text="Stop"
            classes="tracking-cta tracking-cta__stop"
            onClick={() => {
              let oldRecords = [...records];
              oldRecords.find(
                (record) => record.id === selectedTimer.id
              ).isActive = false;
              oldRecords.find((record) => record.id === selectedTimer.id).time =
                {
                  hours: `${
                    runningHours.toString().length < 2
                      ? "0" + runningHours
                      : runningHours
                  }`,
                  minutes: `${
                    runningMinutes.toString().length < 2
                      ? "0" + runningMinutes
                      : runningMinutes
                  }`,
                  seconds: `${
                    runningSeconds.toString().length < 2
                      ? "0" + runningSeconds
                      : runningSeconds
                  }`,
                };
              setRecords(oldRecords);
              updateRecords(
                oldRecords.find((record) => record.id === selectedTimer.id)
              );
              setIsRunning(false);
              resetSelected();
            }}
          />
        </div>
        {records ? (
          <Table
            heading={[
              { text: "Time logged", styles: { width: "20%" } },
              { text: "Description", styles: { width: "60%" } },
              { text: "Actions", styles: { width: "20%" } },
            ]}
            content={records.map((record, index) => (
              <div className="table__row" key={index}>
                <div
                  className="table__cell table__cell--body"
                  style={{ width: "20%" }}
                >
                  {record.isActive
                    ? `${
                        runningHours.toString().length < 2
                          ? "0" + runningHours
                          : runningHours
                      }:${
                        runningMinutes.toString().length < 2
                          ? "0" + runningMinutes
                          : runningMinutes
                      }:${
                        runningSeconds.toString().length < 2
                          ? "0" + runningSeconds
                          : runningSeconds
                      }`
                    : `${record.time.hours}:${record.time.minutes}:${record.time.seconds}`}
                </div>
                <div
                  className="table__cell table__cell--body"
                  style={{ width: "60%" }}
                >
                  {record.description}
                </div>
                <div
                  className="table__cell table__cell--body"
                  style={{ width: "20%" }}
                >
                  {record.isActive ? (
                    <>
                      {" "}
                      <RiIcons.RiPauseCircleLine
                        className={`table__icon table__icon--primary ${
                          record.isActive && !isRunning ? "paused" : ""
                        }`}
                        onClick={() => {
                          setIsRunning((prevState) => !prevState);
                        }}
                      />
                      <RiIcons.RiStopCircleLine
                        className="table__icon table__icon--secondary"
                        onClick={() => {
                          let oldRecords = [...records];
                          oldRecords.find(
                            (record) => record.id === selectedTimer.id
                          ).isActive = false;
                          oldRecords.find(
                            (record) => record.id === selectedTimer.id
                          ).time = {
                            hours: `${
                              runningHours.toString().length < 2
                                ? "0" + runningHours
                                : runningHours
                            }`,
                            minutes: `${
                              runningMinutes.toString().length < 2
                                ? "0" + runningMinutes
                                : runningMinutes
                            }`,
                            seconds: `${
                              runningSeconds.toString().length < 2
                                ? "0" + runningSeconds
                                : runningSeconds
                            }`,
                          };
                          setRecords(oldRecords);
                          updateRecords(
                            oldRecords.find(
                              (record) => record.id === selectedTimer.id
                            )
                          );
                          resetSelected();
                        }}
                      />{" "}
                    </>
                  ) : (
                    <RiIcons.RiPlayFill
                      className="table__icon table__icon--primary"
                      style={{
                        pointerEvents:
                          selectedTimer.id &&
                          selectedTimer.id !== record.id &&
                          selectedTimer.isActive !== record.isActive
                            ? "none"
                            : "",
                        opacity:
                          selectedTimer.id &&
                          selectedTimer.id !== record.id &&
                          selectedTimer.isActive !== record.isActive
                            ? "0.5"
                            : "1",
                      }}
                      onClick={() => {
                        let oldRecords = [...records];
                        oldRecords[oldRecords.indexOf(record)].isActive = true;
                        setSelectedTimer(record);
                        setRecords(oldRecords);
                        updateRecords(oldRecords[oldRecords.indexOf(record)]);
                        setChanger((prevState) => prevState + 1);
                        setRunningHours(record.time.hours);
                        setRunningMinutes(record.time.minutes);
                        setRunningSeconds(record.time.seconds);
                        setIsRunning(true);
                      }}
                    />
                  )}
                  <RiIcons.RiPencilLine
                    className="table__icon table__icon--secondary"
                    onClick={() => {
                      setSelectedTimer(record);
                      setDisplayModalForUpdate(true);
                    }}
                  />
                  <RiIcons.RiDeleteBin6Line
                    className="table__icon table__icon--secondary"
                    onClick={() => {
                      setSelectedTimer(record);
                      deleteRecords(record.id);
                      setRecords(records.filter((r) => r !== record));
                    }}
                  />
                </div>
              </div>
            ))}
          />
        ) : (
          <Loader />
        )}
      </div>
      {displayModalForCreate ? (
        <Modal
          content={
            <Form
              selectedTimer={selectedTimer}
              setSelectedTimer={setSelectedTimer}
              setDisplayModal={setDisplayModalForCreate}
              onFormSubmit={createRecords}
              ctaText="Create record"
              records={records}
              setRecords={setRecords}
              setChanger={setChanger}
            />
          }
          setDisplayModal={setDisplayModalForCreate}
        />
      ) : (
        ""
      )}
      {displayModalForUpdate ? (
        <Modal
          content={
            <Form
              selectedTimer={selectedTimer}
              setSelectedTimer={setSelectedTimer}
              setDisplayModal={setDisplayModalForUpdate}
              onFormSubmit={updateRecords}
              ctaText="Update record"
              records={records}
              setRecords={setRecords}
              setChanger={setChanger}
            />
          }
          setDisplayModal={setDisplayModalForUpdate}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
