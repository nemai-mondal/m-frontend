import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "./style.css";
import { ImagePath } from "@/ImagePath";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { DownloadTableExcel } from "react-export-table-to-excel";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setStartDate,
  setEndDate,
  setEmployeeName,
  setActivityName
} from "@/redux/WorklogSlice";
import { getYear, getMonth } from "date-fns";
const MasterWorkSheet = () => {
  //function to set range
  const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  };
  //to select year in datepicker
  const years = range(1990, getYear(new Date()) + 100, 1);
  //to select month in datepicker
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.worklog
  );
  const { Axios } = useAxios();
  //to target current data on display
  const excelData = useRef();
  //state to store employee details
  const [employees, setEmployees] = useState([]);

  //function to get employee Details
  const fetchEmployee = useCallback(async () => {
    try {
      const res = await Axios.get(`user/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        let employeeAllData = (res.data?.data || []).map((employee) => ({
          value: employee.id || "",
          label: `${employee?.honorific ? `${employee?.honorific} ` : ""}${
            employee?.first_name || ""
          } ${employee?.middle_name ? `${employee.middle_name} ` : ""}${
            employee?.last_name || ""
          }-${employee?.employee_id || ""}`,
        }));
        setEmployees(employeeAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  // to get work and employee details when component mount
  useEffect(() => {
    fetchEmployee();
  }, []);

  //state to store employee name
  const [employee_name, setEmployee_name] = useState();
  //state to store start date
  const [start_date, setStart_date] = useState();
  //state to store end date
  const [end_date, setEnd_date] = useState();
  //function to send page no to the redux store
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };
  //function to send per page no to the redux store
  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };
  //how many data should show in ui
  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];
  //function to store employee name in redux store to fetch employee details
  const handlesetEmployeeName = (e) => {
    setEmployee_name(e);
    dispatch(setEmployeeName(e.value));
  };
  //function to store start date in redux store to fetch employee details
  const handlesetStartDate = (date) => {
    setStart_date(date);
    dispatch(setStartDate(moment(date).format("YYYY-MM-DD")));
  };
  //function to store start date in redux store to fetch employee details
  const handlesetEndDate = (date) => {
    setEnd_date(date);
    dispatch(setEndDate(moment(date).format("YYYY-MM-DD")));
  };
  //function to get employee details based on searched value
  const handleClick = () => {
    if (params.user_id || params.start_date || params.end_date) {
      dispatch(setPage(1));
      dispatch(refresh());
    } else {
      toast.info("to search worklog you have to select atleast one field");
    }
  };
  //function to reset all field value and to get all employee details
  const handleReset = () => {
    setEmployee_name("");
    setStart_date(null);
    setEnd_date(null);
    dispatch(setPage(1));
    dispatch(setEmployeeName(null));
    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(refresh());
  };
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setEmployeeName(null));
    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(setActivityName(null));
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch]);
  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox quote" sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Admin Work Sheet</span>
          </Stack>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                <InputLabel className="fixlabel">
                  Select Employee Name
                </InputLabel>
                <Select
                  options={employees}
                  name="user_id"
                  value={employee_name}
                  defaultValue={"Select Employee Name"}
                  onChange={handlesetEmployeeName}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Employee Name"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                <InputLabel className="fixlabel">Start Date</InputLabel>
                <DatePicker
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        padding: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option
                            key={option}
                            value={option}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                              color: "#333",
                              width: "10px",
                            }}
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                  selected={start_date}
                  name="start_date"
                  onChange={handlesetStartDate}
                  className="dateTime-picker calender-icon"
                  placeholderText="Start Date"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                <InputLabel className="fixlabel">End Date</InputLabel>
                <DatePicker
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        padding: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option
                            key={option}
                            value={option}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                              color: "#333",
                              width: "10px",
                            }}
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                  selected={end_date}
                  name="end_date"
                  onChange={handlesetEndDate}
                  className="dateTime-picker calender-icon"
                  placeholderText="End Date"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                <Stack direction={"row"} spacing={1}>
                  <LoadingButton
                    variant="contained"
                    className="primary-btn text-capitalize"
                    color="primary"
                    sx={{ height: "40px" }}
                    onClick={handleClick}
                  >
                    Submit
                  </LoadingButton>

                  <LoadingButton
                    variant="outlined"
                    className=" h-40 text-capitalize"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset
                  </LoadingButton>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {(data?.data || []).length > 0 ? (
                      <DownloadTableExcel
                        filename="Work Log History"
                        sheet="users"
                        currentTableRef={excelData.current}
                      >
                        <Button
                          variant="outlined"
                          className="text-capitalize download-btn h-40"
                        >
                          <img src={ImagePath.sheetIcon} alt="" /> Download
                        </Button>
                      </DownloadTableExcel>
                    ) : (
                      ""
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <div ref={excelData} style={{ width: "100%" }}>
              <TableContainer className="table-striped" sx={{ mt: 4 }}>
                <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={150} align="center">
                        Employee Name
                      </TableCell>
                      <TableCell width={150} align="center">
                        Date
                      </TableCell>
                      <TableCell width={150} align="left">
                        Project Name
                      </TableCell>
                      <TableCell width={150} align="left">
                        Activity
                      </TableCell>
                      <TableCell align="left" width={150}>
                        Description
                      </TableCell>
                      <TableCell width={150} align="center">
                        Spend Hours
                      </TableCell>
                      <TableCell width={100} align="left">
                        Task ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="userDeg">
                    {isLoading ? (
                      <TableRowSkeleton rows={10} columns={6} />
                    ) : (data?.data || [])?.length > 0 ? (
                      data.data.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell align="left">
                              {data.user_details
                                ? `${
                                    data?.user_details?.honorific
                                      ? `${data?.user_details?.honorific} `
                                      : ""
                                  }${data?.user_details?.first_name || ""} ${
                                    data.user_details?.middle_name
                                      ? `${data.user_details?.middle_name} `
                                      : ""
                                  }${data.user_details?.last_name || ""}${
                                    data.user_details?.employee_id
                                      ? `-${data.user_details?.employee_id} `
                                      : ""
                                  }`
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {data.date
                                ? moment(data.date).format("DD-MM-YYYY")
                                : ""}
                            </TableCell>
                            <TableCell align="left">
                              {data.project_details?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {data.activity_details?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {data.description?.replace(/<\/?p>/g, "") ||
                                "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {parseInt(data?.time_spent?.split(":")[0]) != 0
                                ? `
                                    ${parseInt(
                                      data?.time_spent?.split(":")[0]
                                    )}h`
                                : ""}
                              {parseInt(data?.time_spent?.split(":")[1]) != 0
                                ? `
                                    ${parseInt(
                                      data?.time_spent?.split(":")[1]
                                    )}m`
                                : ""}
                              {parseInt(data?.time_spent?.split(":")[0]) == 0 &&
                              parseInt(data?.time_spent?.split(":")[1]) == 0
                                ? "N/A"
                                : ""}
                            </TableCell>
                            <TableCell align="left">
                              {data.task_url || "N/A"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: "center" }}>
                          No Worklog Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ pb: 2 }}
          >
            <Typography>Rows per page</Typography>
            <select
              className="small-select"
              onChange={(event) => {
                handlePerPageChange(parseInt(event.target.value, 10));
              }}
            >
              {paginationPerPage.map((item) => {
                return (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <Pagination
              count={meta?.last_page}
              page={params?.page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default MasterWorkSheet;
