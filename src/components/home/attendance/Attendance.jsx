import React, { useCallback, useEffect, useState } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  Box,
  TableRow,
} from "@mui/material";
import "./attendance.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import AttendenceSkeleton from "./AttendenceSkeleton";
const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const { Axios } = useAxios();
  //state to store attendence list
  const [attendanceList, setAttendenceList] = useState([]);
  //function to get details from api
  const getAttendenceList = useCallback(async () => {
    try {
      const res = await Axios.get("/timelog/search");

      if (res.status && res.status === 200) {
        setAttendenceList(res.data?.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  //useeffect to get attendence details from api when component mount
  useEffect(() => {
    getAttendenceList();
  }, []);
  if (loading) {
    return <AttendenceSkeleton />;
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
                  <TableCell align="left" className="text-uppercase">
                    Date
                  </TableCell>
                  <TableCell align="left" className="text-uppercase">
                    Check-in
                  </TableCell>
                  <TableCell align="left" className="text-uppercase">
                    Check-out
                  </TableCell>
                </TableRow>
              </TableHead>
              {(attendanceList||[]).length > 0 ? (
                <TableBody>
                  {attendanceList.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {data?.date
                            ? moment(data.date).format("DD-MM-YYYY")
                            : ""}
                        </TableCell>
                        <TableCell align="left" className="success-text">
                          {data?.first_shift_start
                           ||""}
                        </TableCell>
                        <TableCell align="left" className="error-text">
                          {data?.last_shift_end || ""}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      {" "}
                      No Attendance
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

export default Attendance;
