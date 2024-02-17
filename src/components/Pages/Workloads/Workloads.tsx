import React, { FC, memo, useCallback, useEffect, useState } from "react";
import Arrows from "../../../svgs/SvgComponents/Arrows";
import SubjCard from "../../SubjCards/SubjCard";
import axios from "axios";
import InpSubjCard from "../../SubjCards/InpSubjCard";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import host_url from "../../../host/url";

type workLoadData = {
  FullName: string;
  GroupCode: string;
  Hours: number;
  Position: string;
  Subject: string;
  Type: string;
};

const Workloads: FC = () => {
  const isAuthenticated = localStorage.getItem('jwtToken');
  const [searchProp, setSearchProp] = useState("");
  const [workLoadData, setWorkLoadData] = useState<workLoadData[]>();
  const [allHours, setAllHours] = useState<any>(null);
  const [fullName, setFullName] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [subjects, setSubjects] = useState<string[]>();
  const [groups, setGroups] = useState<string[]>();
  const isAdmin = useSelector((state: any) => state.auth.isAdmin);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState<number>(1);
  const [initialRender, setInitialRender] = useState(true);

  const navigate = useNavigate();
  if(!isAuthenticated){
    navigate("/login");
  }


  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchProp(e.target.value);
    },
    [setSearchProp]
  );
  const fetchWorkloadByFullName = async () => {



    try {
      const response = await axios.get(
        `${host_url}/getWorkloadByFullName?TeacherFullName=${searchProp}`
      );
      const sortedData = [...response.data].sort((a, b) =>
        a.FullName > b.FullName ? 1 : -1
      );
      const paginateByFullName = () => {
        const paginatedResult: workLoadData[][] = [];
        let currentPage: workLoadData[] = [];

        sortedData.forEach((item) => {
          if (
            !currentPage.length ||
            currentPage[0].FullName === item.FullName
          ) {
            currentPage.push(item);
          } else {
            paginatedResult.push(currentPage);
            currentPage = [item];
          }
        });

        if (currentPage.length > 0) {
          paginatedResult.push(currentPage);
        }

        return paginatedResult;
      };
      const paginatedResult = paginateByFullName();
      setPageCount(paginatedResult.length);

      if (!page) {
        return;
      }

      setWorkLoadData(paginatedResult[page - 1]);
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to fetch workload by full name");
    }
  };

  useEffect(() => {
    if (!initialRender) {
      fetchWorkloadByFullName();
    } else {
      setInitialRender(false);
    }
  }, [page]);

  const pageNumbers: number[] = [];

  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (workLoadData) {
      const primaryData = workLoadData.find((item) => item.Type === "All");
      setAllHours(primaryData?.Hours);
      setFullName(primaryData?.FullName);
      setPosition(primaryData?.Position);
    }
  }, [workLoadData]);
  useEffect(() => {
    const fetchDataInput = async () => {
      try {
        const response = await axios.get(
          `${host_url}/getAllSubjsAndGroups`
        );
        setSubjects(response.data[0]?.Data.split(", ") || []);
        setGroups(response.data[1]?.Data.split(", ") || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataInput();
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className="main__title">Workloads</h1>
        <div className="search-section">
          <input
            value={searchProp}
            placeholder={"Enter full name: e.g: Андрійович"}
            type="text"
            onChange={(e) => handleChange(e)}
            className={"cast__inp cast__inp__workloads "}
            required
          />
          <button className="btn" onClick={fetchWorkloadByFullName}>
            Search
          </button>
          <h2 className={`second__title `}>{position}</h2>
          <h2 className={`second__title ${workLoadData ? "filled" : ""}`}>
            {fullName}
          </h2>
        </div>
      </div>
      <div className={`transit ${workLoadData || fullName ? "transit__filled" : ""}`}>
        <div className={"arrows-section"}>
          <div>
            <div>Lecture</div>
            <div>Practice</div>
          </div>
          <Arrows />
          <div>
            <div>
              Total hours: <span className={"reg"}>{allHours}</span>
            </div>
          </div>
        </div>
        <div className={"cards__container"}>
          {workLoadData
            ?.filter((singleData) => singleData.Type !== "All")
            .map((singleData, index) => (
              <SubjCard
                fetchWorkloadByFullName={fetchWorkloadByFullName}
                fullName={fullName}
                key={index}
                groups={singleData.GroupCode}
                hours={singleData.Hours}
                subject={singleData.Subject}
                lessonType={singleData.Type}
              />
            ))}

          {isAdmin  && isAuthenticated && (
            <InpSubjCard
              groups={groups}
              subjects={subjects}
              fetchWorkloadByFullName={fetchWorkloadByFullName}
              fullName={fullName}

            />
          )}
        </div>
        <div className="pagination">
          {pageNumbers.map((number, index) => (
            <div
              onClick={() => setPage(index + 1)}
              key={number}
              className="page-number"
            >
              {number}
            </div>
          ))}
        </div>
        ;
      </div>
    </div>
  );
};

export default memo(Workloads);
