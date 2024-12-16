import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addPunchInOutDetails } from "@/redux/PunchInOutSlice";
import { useAxios } from "@/contexts/AxiosProvider";
import InOutActivitiesSkeleton from "./InOutActivitiesSkeleton";
import { toast } from "react-toastify";
const Activities = () => {
  //state to show loading animation
  const [loading, setLoading] = useState(true);
  //axiox sending details to api
  const { Axios } = useAxios();
  //to dispatch event to the redux store
  const dispatch = useDispatch();
  //getting data from redux store
  const attendanceList = useSelector((state) => state.punchInOut);
  // useeffect to fetch in/out activities when component mounts
  useEffect(() => {
    const getActivitiesList = async () => {
      try {
        const data = await Axios.get("/timelog/attendance");

        if (data.status && data.status === 200) {
          if ((data?.data?.data||[])?.length > 0) {
            dispatch(addPunchInOutDetails(data?.data?.data||[]));
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    };
    getActivitiesList();
  }, [dispatch]);
  if (loading) {
    return <InOutActivitiesSkeleton />;
  }
  return (
    <React.Fragment>
      <Box className="cardBox" sx={{ p: 0 }}>
        <Box sx={{ p: 0 }}>
          <TableContainer
            sx={{ maxHeight: 314 }}
            className="table-striped scroll-y"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell width={80} align="left" className="text-uppercase">
                    Date
                  </TableCell>
                  <TableCell width={80} align="left" className="text-uppercase">
                    Time
                  </TableCell>
                  <TableCell width={80} align="left" className="text-uppercase">
                    Activity
                  </TableCell>
                </TableRow>
              </TableHead>
              {attendanceList.length > 0 ? (
                <TableBody>
                  {attendanceList.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {data?.date
                          ? moment(data.date).format("DD-MM-YYYY")
                          : ""}
                      </TableCell>
                      <TableCell align="left" className="success-text">
                        {data?.time || ""}
                      </TableCell>
                      {data.terminal === "onlinein" ? (
                        <TableCell align="left" className="success-text">
                          {data?.terminal ? data.terminal.toUpperCase() : ""}
                        </TableCell>
                      ) : (
                        <TableCell align="left" className="error-text">
                          {data?.terminal ? data.terminal.toUpperCase() : ""}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      No In/Out Activities
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Activities;
