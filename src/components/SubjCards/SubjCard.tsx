import React, { FC, memo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import host_url from "../../host/url";

type SubjCardProps = {
  subject: string;
  hours: number;
  groups: string;
  lessonType: string;
  fullName: string;
  fetchWorkloadByFullName: () => void;
};

const SubjCard: FC<SubjCardProps> = ({
  subject,
  lessonType,
  hours,
  groups,
  fullName,
  fetchWorkloadByFullName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHours, setEditedHours] = useState<number>();
  const [editedGroups, setEditedGroups] = useState("");
  const [groupsOnSubj, setGroupsOnSubj] = useState<string[]>();
  const isAuthenticated = localStorage.getItem('jwtToken');
  const handleGroups = async () => {
    try {
      const response = await axios.get(`${host_url}/getGroupsByFullNameAndSubj?fullName=${fullName}&subjectName=${subject}`);
      setGroupsOnSubj(response.data[0].GroupCodes.split(","));
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditClick = () => {
    setIsEditing(true);
    handleGroups();
  };
  const isAdmin = useSelector((state: any) => state.auth.isAdmin);

  const handleSaveClick = () => {
    if (editedHours === undefined || editedGroups === "") {
      alert("Fill all fields before submit");
      return;
    }
    const dataToSend = {
      TeacherFullName: fullName,
      SubjectName: subject,
      GroupCode: editedGroups,
      LoadHours: editedHours,
    };
    axios
      .put(`${host_url}/editLoadByFullName`, dataToSend)
      .then((response) => {
        if (response.status === 200) {
          alert("Workload edited successfully");
          fetchWorkloadByFullName();
        }
      })
      .catch((error) => {
        console.error("Ошибка при добавлении:", error);
      });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  const deleteLoadByFullNameAndGroup = async () => {

    if (editedGroups === "" || subject === "") {
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
              GroupCode: editedGroups,
              SubjectName: subject,
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
    <div
      className={
        lessonType === "Lecture" ? "subj__card " : "subj__card subj__card__prac"
      }
    >
      <div className={"card__info"}>
        <span className={"text__bold"}>Subject: </span>
        {subject}
        {isEditing ? (
          <>
            <div>
              <span className={"text__bold"}>Hours: </span>
              <input
                type="number"
                placeholder={"Enter hours"}
                value={editedHours}
                className={"dropdownSubjects"}
                onChange={(e) => setEditedHours(Number(e.target.value))}
              />
            </div>
            <div>
              <span className={"text__bold"}>Groups: </span>
              <>
                {
                  <select
                    className="dropdownSubjects"
                    value={editedGroups}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      console.log(e.target.value)
                      if (selectedValue !== editedGroups) {
                        setEditedGroups(selectedValue);
                      } else {
                        setEditedGroups("");
                      }
                    }}
                    required
                  >
                    <option value=""  hidden>
                      Choose group
                    </option>
                    {groupsOnSubj?.map((optionTwo, index) => (
                      <option key={index} value={optionTwo}>
                        {optionTwo}
                      </option>
                    ))}
                  </select>
                }
              </>
            </div>
            <div className={"btn__container"}>
              <button className="btn-subj" onClick={handleSaveClick}>
                Save
              </button>
              <button
                className="btn-subj"
                onClick={deleteLoadByFullNameAndGroup}
              >
                Delete
              </button>
              <button className="btn-subj" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className={"text__bold"}>Hours: </span>
              {hours}
            </div>
            <div>
              <span className={"text__bold"}>Groups: </span>
              {groups}
            </div>
            {isAdmin && isAuthenticated && (
              <button className="btn-centre" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjCard;