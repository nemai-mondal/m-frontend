import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import "react-tabs/style/react-tabs.css";
import "./holidays-leaves.css";
import moment from "moment";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HolidaySkeleton from "./HolidaySkeleton";
const Holidays = () => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(true);
  //state to store holiday list
  const [holiday, setHoliday] = useState([]);

  //fetching  holiday data from api
  const fetchHoliday = useCallback(async () => {
    try {
      // const payload = { list_type: "upcoming" };
      const res = await Axios.get(`holiday/search?list_type=upcoming_this_year`);

      if (res.status && res.status >= 200 && res.status < 300) {
        //storing all holiday details in one array and removing sunday ,saturday and same day
        const allHolidayData = []
          .concat(
            ...(res.data.data || []).map((data) => {
              if (
                data.date_from &&
                data.date_to &&
                moment(data.date_from).isSame(data.date_to, "day")
              ) {
                return [
                  {
                    date: data.date_from
                      ? moment(data.date_from).format("YYYY-MM-DD")
                      : "",
                    holiday_name: data.holiday_name,
                  },
                ];
              } else {
                const dates = [];
                const currentDate = data.date_from
                  ? moment(data.date_from)
                  : "";
                const lastDate = data.date_to ? moment(data.date_to) : "";

                while (currentDate <= lastDate) {
                  dates.push({
                    date: currentDate.format("YYYY-MM-DD"),
                    holiday_name: data.holiday_name,
                  });
                  currentDate.add(1, "days");
                }
                return dates.filter((date) => {
                  const dayOfWeek = date.date ? moment(date.date).day() : "";
                  return dayOfWeek !== 0 && dayOfWeek !== 6;
                });
              }
            })
          )
          .slice(0, 7);
        setHoliday(allHolidayData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoliday();
  }, []);
  if (loading) {
    return <HolidaySkeleton />;
  }
  const randColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()
    );
  };

  return (
    <React.Fragment>
      <Box>
        <TableContainer className="table-striped">
          <Table aria-label="simple table">
            <TableBody>
              {(holiday || []).length > 0 ? (
                holiday.map((data, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left" width={80}>
                        <Box
                          className="holidaycircle"
                          sx={{ backgroundColor: randColor() }}
                        >
                          <Typography variant="h5">
                            {" "}
                            {data?.date
                              ? moment(data.date).format("DD")
                              : "N/A"}
                          </Typography>
                          <Typography variant="span">
                            {" "}
                            {data?.date
                              ? moment(data.date).format("MMM")
                              : "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="p" className="holidayName">
                          {data?.holiday_name || "N/A"}
                        </Typography>
                        <Typography variant="span" className="holidayWeekName">
                          {data?.date ? moment(data.date).format("ddd") : "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <>
                  <TableRow key="no-holiday">
                    <TableCell style={{ textAlign: "center" }}>
                      No Holiday
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
};

export default Holidays;
