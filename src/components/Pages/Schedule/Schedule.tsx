import React, { useEffect, useState } from "react";
import axios from "axios";
import host_url from "../../../host/url";

interface ScheduleItem {
  TeacherName: string;
  SubjectName: string;
  LessonType: string;
  GroupCode: string;
  Classroom: string;
  WeekDayName: string;
  StartTime: string;
  EndTime: string;
  PairNumber: number;
}

const Schedule: React.FC = () => {
  const daysOfWeek = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пятниця",
    "Субота",
    "Неділя",
  ];
  const [selectedGroupForQuery, setSelectedGroupForQuery] =
    useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>();
  const [groups, setGroups] = useState<string[]>();
  const table: (JSX.Element | null)[][] = Array.from({ length: 5 }, () =>
    Array(7).fill(null)
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSchedule();
  };
  useEffect(() => {
    const fetchDataInput = async () => {
      try {
        const response = await axios.get(
          `${host_url}/getAllSubjsAndGroups`
        );
        setGroups(response.data[1]?.Data.split(", ") || []);

      } catch (error) {
        console.error(error);
      }
    };
    fetchDataInput();
  }, []);
  const handleSchedule = async () => {
    const response = await axios.get(
      `${host_url}/getScheduleByGroup?GroupCode=${selectedGroupForQuery}`
    );
    setSchedule(response.data);
  };

  schedule?.forEach((item) => {
    const {
      WeekDayName: day,
      SubjectName: subject,
      LessonType: type,
      TeacherName: teacher,
      Classroom: room,
      PairNumber: pair,
    } = item;
    const dayIndex = daysOfWeek.indexOf(day);
    if (dayIndex !== -1 && pair <= 5) {
      table[pair - 1][dayIndex] = (
        <div
          key={`${day}-${pair}`}
          className={
            item.LessonType === "Lecture"
              ? "subj__card schedule__card"
              : "subj__card schedule__card subj__card__prac"
          }
        >
          <div className={"schedule__card__info"}>
            <span className={"test"}>Назва: </span>
            {subject}
            <div>
              <span className={"test"}>Тип: </span>
              {type}
            </div>
            <div>
              <span className={"test"}>Викладач: </span>
              {teacher}
            </div>
            <div>
              <span className={"test"}>Аудиторія: </span>
              {room}
            </div>
          </div>
        </div>
      );
    }
  });

  const scheduleRows = table.map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td className="line-number" data-line-number={rowIndex + 1}></td>
      {row.map((cell, cellIndex) => (
        <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <div>
      <div className="container">
        <h1 className="main__title">Schedule</h1>
        <div className="search-section">
          <form onSubmit={handleSubmit}>
            <select
              className="dropdownTeacherFirst"
              onChange={(e) => setSelectedGroupForQuery(e.target.value)}
              value={selectedGroupForQuery}
              required
            >
              <option value="" disabled hidden>
                Choose group
              </option>
              {groups?.map((optionOne, index) => (
                <option key={index} value={optionOne}>
                  {optionOne}
                </option>
              ))}
            </select>
            <button type="submit" className="btn">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="table-container">
        <table className="schedule">
          <thead>
            <tr className={"top"}>
              {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{scheduleRows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
