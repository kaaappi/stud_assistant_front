import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Del from "../../../svgs/SvgComponents/Del";
import Edit from "../../../svgs/SvgComponents/Edit";
import Check from "../../../svgs/SvgComponents/Check";
import Save from "../../../svgs/SvgComponents/Save";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import host_url from "../../../host/url";

const Teachers: React.FC = () => {
  type Res = {
    DepartmentNames: string;
    PositionNames: string;
    SubjectNames: string;
  };
  type Teacher = {
    lastname: string;
    firstname: string;
    middlename: string;
    positionname: string;
    email: string;
  };
  const isAdmin = useSelector((state: any) => state.auth.isAdmin);
  const isAuthenticated = localStorage.getItem('jwtToken');
  const [selectedOptionForQuery, setSelectedOptionForQuery] =
    useState<string>("");
  const [selectedOptionForAdd, setSelectedOptionForAdd] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");
  const [optionsOne, setOptionsOne] = useState<string[]>([
    "position",
    "department",
    "subject",
  ]);
  const [optionsTwo, setOptionsTwo] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>();
  const savedDeparts = useRef<string[]>([]);
  const savedPosits = useRef<string[]>([]);
  const savedSubjects = useRef<string[]>([]);
  const [inputs, setInputs] = useState<string[]>(Array(4).fill(""));
  const navigate = useNavigate();
  if(!isAuthenticated){
    navigate("/login");
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${host_url}/getData`);
        const departments = response.data[0]?.DepartmentNames.split(", ") || [];
        const positions = response.data[0]?.PositionNames.split(", ") || [];
        const subjects = response.data[0]?.SubjectNames.split(", ") || [];
        setPositions(positions);
        savedDeparts.current = departments;
        savedPosits.current = positions;
        savedSubjects.current = subjects;
        setOptionsTwo(departments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const optionValues: { [key: string]: string[] } = {
    department: savedDeparts.current,
    position: savedPosits.current,
    subject: savedSubjects.current,
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = event.target.value;
    setSearchType(selectedType);
    setSelectedOptionForQuery("");
    setOptionsTwo(optionValues[selectedType] || []);
  };
  const handleTeachers = async () => {
    const response = await axios.get(
      `${host_url}/getTeachers?Param=${selectedOptionForQuery}`
    );
    console.log(response.data)
    setTeachers(response.data);
  };
  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOptionForAdd(event.target.value);
    },
    []
  );
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleTeachers();
  };


  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newInputs = [...inputs];
      newInputs[index - 1] = e.target.value;
      setInputs(newInputs);
    },
    [inputs]
  );

  const handleClearInputs = () => {
    console.log("handleClearInputs");
    setInputs(Array(4).fill(""));
    setSelectedOptionForAdd("");
  };

  const handleSubmitPost = async () => {
    if (
      selectedOptionForAdd.trim() === "" ||
      inputs.some((input) => input.trim() === "")
    ) {
      alert("Fill all fields before submitting");
      return;
    }

    try {
      const dataToSend = {
        PositionName: selectedOptionForAdd,
        LastName: inputs[0],
        FirstName: inputs[1],
        MiddleName: inputs[2],
        Email: inputs[3],
      };
      const response = await axios.post(
        `${host_url}/addTeacher`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Teacher added successfully");
        await handleTeachers();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (
    lastName: string,
    firstName: string,
    middleName: string
  ) => {
    const conf = window.confirm("Are you sure to delete?");
    if (conf) {
      try {
        const teacherFullName = `${lastName} ${firstName} ${middleName}`;
        const response = await axios.delete(
          `${host_url}/deleteTeacher`,
          {
            params: {
              TeacherFullName: teacherFullName,
            },
          }
        );

        if (response.status === 200) {
          alert("Teacher deleted successfully");
          await handleTeachers();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    else{
      return;
    }
  };
  const [editingRowIndex, setEditingRowIndex] = useState<number>();
  const [updEmail, setUpdEmail] = useState<string>("");
  const [updPos, setUpdPos] = useState<string>("");
  const handleEdit = (index: number) => {
    setEditingRowIndex(index);
  };

  const handleCancel = () => {
    setEditingRowIndex(undefined);
  };

  const handleUpd = async (
    lastName: string,
    firstName: string,
    middleName: string,
    positionName: string
  ) => {
    if (updEmail.trim().length === 0) {
      alert("Fill all fields before submit");
      return;
    }
    try {
      const response = await axios.put(
        `${host_url}/editTeacherByFullName`,
        {
          LastName: lastName,
          FirstName: firstName,
          MiddleName: middleName,
          PositionName: updPos || positionName,
          Email: updEmail,
        }
      );

      if (response.status === 200) {
        setEditingRowIndex(undefined);
        alert("Teacher updated successfully");
        await handleTeachers();
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };


  return (
    <div className="container">
      <h1 className="main__title">Teachers</h1>
      <div className="search-section">
        <form onSubmit={handleSubmit}>
          <select
            className="dropdownTeacherFirst"
            onChange={handleSearchTypeChange}
            value={searchType}
            required
          >
            <option value="" disabled hidden>
              Choose first parameter
            </option>
            {optionsOne.map((optionOne, index) => (
              <option key={index} value={optionOne}>
                {optionOne}
              </option>
            ))}
          </select>
          <select
            className="dropdownTeacherSecond"
            value={selectedOptionForQuery}
            onChange={(e) => setSelectedOptionForQuery(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Choose second parameter
            </option>
            {optionsTwo.map((optionTwo, index) => (
              <option key={index} value={optionTwo}>
                {optionTwo}
              </option>
            ))}
          </select>
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      </div>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Middle name</th>
              <th>Position</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          {isAdmin && isAuthenticated && (
            <tr className={"main"}>
              <td></td>
              <td>
                <input
                  type="text"
                  className={"cast__inp"}
                  onChange={(e) => handleInputChange(e, 1)}
                  required
                  placeholder={"enter last name"}
                  value={inputs[0]}
                />
              </td>
              <td>
                <input
                  type="text"
                  className={"cast__inp"}
                  onChange={(e) => handleInputChange(e, 2)}
                  required
                  placeholder={"enter first name"}
                  value={inputs[1]}
                />
              </td>
              <td>
                <input
                  type="text"
                  className={"cast__inp"}
                  onChange={(e) => handleInputChange(e, 3)}
                  required
                  placeholder={"enter middle name"}
                  value={inputs[2]}
                />
              </td>
              <td>
                <select
                  className={"cast__inp"}
                  value={selectedOptionForAdd}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="" disabled hidden>
                    Choose position
                  </option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className={"cast__inp"}
                  onChange={(e) => handleInputChange(e, 4)}
                  required
                  placeholder={"enter email"}
                  value={inputs[3]}
                />
              </td>
              <td onClick={handleSubmitPost}>
                <Save />
              </td>
              <td onClick={handleClearInputs}>
                <Del />
              </td>
            </tr>
          )}
            {teachers?.map((row, index) => (
              <React.Fragment key={index}>
                {editingRowIndex === index ? (
                  <tr className={"main"}>
                    <td>{index + 1}</td>
                    <td>{row.lastname}</td>
                    <td>{row.firstname}</td>
                    <td>{row.middlename}</td>
                    <td>
                      <select
                        className={"cast__inp inp__less"}
                        value={updPos}
                        required
                        onChange={(e) => setUpdPos(e.target.value)}
                      >
                        <option value="" disabled hidden>
                          {row.positionname}
                        </option>
                        {positions.map((position, index) => (
                          <option key={index} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={"cast__inp inp__less"}
                        onChange={(e) => setUpdEmail(e.target.value)}
                        required
                        placeholder={"enter email"}
                        defaultValue={row.email}
                      />
                    </td>
                    <td
                      onClick={() =>
                        handleUpd(
                          row.lastname,
                          row.firstname,
                          row.middlename,
                          row.positionname
                        )
                      }
                    >
                      <Check />
                    </td>
                    <td onClick={handleCancel}>
                      <Del />
                    </td>
                  </tr>
                ) : (
                  <tr className={"main"}>
                    <td>{index + 1}</td>
                    <td>{row.lastname}</td>
                    <td>{row.firstname}</td>
                    <td>{row.middlename}</td>
                    <td>{row.positionname}</td>
                    <td>{row.email}</td>
                    {isAdmin && isAuthenticated && (
                      <>
                        <td onClick={() => handleEdit(index)}>
                          <Edit />
                        </td>
                        <td
                          onClick={() =>
                            handleDelete(
                              row.lastname,
                              row.firstname,
                              row.middlename
                            )
                          }
                        >
                          <Del />
                        </td>
                      </>
                    )}
                  </tr>
                )}
              </React.Fragment>
            ))}
            {/*{isAdmin && isAuthenticated && (*/}
            {/*  <tr>*/}
            {/*    <td></td>*/}
            {/*    <td>*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        className={"cast__inp"}*/}
            {/*        onChange={(e) => handleInputChange(e, 1)}*/}
            {/*        required*/}
            {/*        placeholder={"enter last name"}*/}
            {/*        value={inputs[0]}*/}
            {/*      />*/}
            {/*    </td>*/}
            {/*    <td>*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        className={"cast__inp"}*/}
            {/*        onChange={(e) => handleInputChange(e, 2)}*/}
            {/*        required*/}
            {/*        placeholder={"enter first name"}*/}
            {/*        value={inputs[1]}*/}
            {/*      />*/}
            {/*    </td>*/}
            {/*    <td>*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        className={"cast__inp"}*/}
            {/*        onChange={(e) => handleInputChange(e, 3)}*/}
            {/*        required*/}
            {/*        placeholder={"enter middle name"}*/}
            {/*        value={inputs[2]}*/}
            {/*      />*/}
            {/*    </td>*/}
            {/*    <td>*/}
            {/*      <select*/}
            {/*        className={"cast__inp"}*/}
            {/*        value={selectedOptionForAdd}*/}
            {/*        onChange={handleSelectChange}*/}
            {/*        required*/}
            {/*      >*/}
            {/*        <option value="" disabled hidden>*/}
            {/*          Choose position*/}
            {/*        </option>*/}
            {/*        {positions.map((position, index) => (*/}
            {/*          <option key={index} value={position}>*/}
            {/*            {position}*/}
            {/*          </option>*/}
            {/*        ))}*/}
            {/*      </select>*/}
            {/*    </td>*/}
            {/*    <td>*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        className={"cast__inp"}*/}
            {/*        onChange={(e) => handleInputChange(e, 4)}*/}
            {/*        required*/}
            {/*        placeholder={"enter email"}*/}
            {/*        value={inputs[3]}*/}
            {/*      />*/}
            {/*    </td>*/}
            {/*    <td onClick={handleSubmitPost}>*/}
            {/*      <Save />*/}
            {/*    </td>*/}
            {/*    <td onClick={handleClearInputs}>*/}
            {/*      <Del />*/}
            {/*    </td>*/}
            {/*  </tr>*/}
            {/*)}*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
