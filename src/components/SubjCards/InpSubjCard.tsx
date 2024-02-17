import React, { FC, memo, useState } from "react";
import axios from "axios";
import host_url from "../../host/url";

type inpSubjProps = {
  fullName: string;
  fetchWorkloadByFullName: () => void;
  subjects: string[] | undefined;
  groups: string[] | undefined;
};

const InpSubjCard: FC<inpSubjProps> = ({
  fullName,
  fetchWorkloadByFullName,
  subjects,
  groups,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [hours, setHours] = useState<number>();

  const addLoad = async () => {
    if (selectedGroup === "" || selectedSubject === "" || hours === undefined) {
      alert("Fill all fields before submit");
      return;
    }
    try {
      const dataToSend = {
        TeacherFullName: fullName,
        SubjectName: selectedSubject,
        GroupCode: selectedGroup,
        LoadHours: hours,
      };
      const response = await axios.post(
        `${host_url}/addLoad`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Workload added successfully");
        fetchWorkloadByFullName();
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response.status === 500) {
        alert("Workload already exist");
      }
    }
  };

  const deleteLoadByFullNameAndGroup = async () => {

    if (selectedGroup === "" || selectedSubject === "") {
      alert("Fill all fields before submit");
      return;
    }
    const conf = window.confirm("Are you sure ?");
    if (conf) {
      try {
        const response = await axios.delete(
          `${host_url}/deleteLoadByFullNameAndGroup`,
          {
            params: {
              TeacherFullName: fullName,
              GroupCode: selectedGroup,
              SubjectName: selectedSubject,
            },
          }
        );
        if (response.status === 200) {
          alert("Workload deleted successfully");
          fetchWorkloadByFullName();
        }
      } catch (error: any) {
        console.error("Error:", error);
        if (error.response.status === 404) {
          alert("There is nothing to delete");
        }
      }
    } else {
      return;
    }
  };

  return (
    <div className={"subj__card "}>
      <div className={"card__info"}>
        <div>
          <span className={"text__bold"}>Subject:</span>
          {
            <select
              className="dropdownSubjects"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Choose subject
              </option>
              {subjects?.map((optionTwo, index) => (
                <option key={index} value={optionTwo}>
                  {optionTwo}
                </option>
              ))}
            </select>
          }
        </div>
        <div>
          <span className={"text__bold"}>Hours:</span>
          {
            <input
              type="number"
              value={hours}
              placeholder={"Enter hours"}
              className={"dropdownSubjects"}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          }
        </div>
        <div>
          <span className={"text__bold"}>Groups:</span>
          {
            <select
              className="dropdownSubjects"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Choose group
              </option>
              {groups?.map((optionTwo, index) => (
                <option key={index} value={optionTwo}>
                  {optionTwo}
                </option>
              ))}
            </select>
          }
        </div>
        <div className={"btn__container"}>
          <button className="btn-subj lil__left" onClick={addLoad}>
            Add
          </button>

        </div>
      </div>
    </div>
  );
};

export default memo(InpSubjCard);
