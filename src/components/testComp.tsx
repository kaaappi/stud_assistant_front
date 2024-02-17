import React, {useEffect, useState} from 'react';
import axios from "axios";
import host_url from "../host/url";

interface BackendData {
  Type: string;
  Subject?: string;
  GroupCode?: string;
  Hours?: string;
  FullName: string;
  Position?: string;
}

const TestComp = () => {

  const [paginatedData, setPaginatedData] = useState<BackendData[]>([]);
  const [pageCount, setPageCount] = useState<number>();
  const [page, setPage] = useState<number>(1);

  const fetchWorkloadByFullName = async () => {
    try {
      const response = await axios.get(
        `${host_url}/getWorkloadByFullName?TeacherFullName=Андрійович`
      );
      if (!response.data.length) {
        alert("There is no teacher with this name");
        return;
      }
      const sortedData = [...response.data].sort((a, b) => (a.FullName > b.FullName ? 1 : -1));
      const paginateByFullName = () => {
        const paginatedResult: BackendData[][] = [];
        let currentPage: BackendData[] = [];

        sortedData.forEach((item) => {
          if (!currentPage.length || currentPage[0].FullName === item.FullName) {
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
      setPageCount(paginatedResult.length)


      if(!pageCount){
        return
      }
     setPage(2)
      setPaginatedData(paginatedResult[page]);
      console.log(paginatedResult[page], page)


    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to fetch workload by full name");
    }
  };
  useEffect(() => {
    fetchWorkloadByFullName();

  }, [pageCount]);


  return (
    <div style={{paddingTop:"20%"}}>
      <div onClick={()=>  setPageCount(3)}>
        {/*{paginatedData[pageCount - 1]?.map((item, itemIndex) => (*/}
        {/*  <div key={itemIndex}>*/}
        {/*    <p>{item.FullName}</p>*/}
        {/*    /!* Остальные элементы данных *!/*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </div>
  );
};

export default TestComp;