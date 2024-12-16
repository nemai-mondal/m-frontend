import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardContent,
  Grid,
  InputLabel,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Stack } from "@mui/system";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "./style.css";
import { ImagePath } from "@/ImagePath";
import { Link } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { DownloadTableExcel } from "react-export-table-to-excel";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setProjectName,
  setActivityName,
  setStartDate,
  setEndDate,
  setEmployeeName,
} from "@/redux/WorklogSlice";
import { getYear, getMonth } from "date-fns";
const WorkSheet = () => {
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
  const { user } = useContext(AuthContext);
  const { Axios } = useAxios();
  // to target current data on display
  const excelData = useRef();
  //state to store project details
  const [projects, setProjects] = useState([]);
  //state to store activity details
  const [activity, setActivity] = useState([]);

  //function to get project Details
  const fetchProject = useCallback(async () => {
    try {
      const res = await Axios.get(`project/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        let projectAllData = (res.data?.data || []).map((project) => ({
          value: project.id||"",
          label: project.name||"",
        }));
        setProjects(projectAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  //function to get activity details
  const fetchActivity = useCallback(async (id) => {
    try {
      const res = await Axios.get(`department/show/${id}`);
      if (res.status && res.status >= 200 && res.status < 300) {
        const activityAllData = (res.data?.data?.activities || []).map(
          (activity) => ({
            value: activity.id||"",
            label: activity.name||"",
          })
        );
        setActivity(activityAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  function removeTags(str) {
    if (str === null || str === "" || str ===undefined) return false;
    else str = str?.toString();

    // Regular expression to remove HTML tags and &nbsp;
    return str.replace(/<[^>]+>|&nbsp;/gi, "");
  }

  // useeffect to get details from api when component mount
  useEffect(() => {
    fetchProject();
    if (user?.department?.id) {
      fetchActivity(user?.department?.id);
    }
  }, [user]);

  //state to store project name
  const [project_name, setProject_name] = useState();
  //state to store activity name
  const [activity_name, setActivity_name] = useState();
  //state to store start date
  const [start_date, setStart_date] = useState();
  //state to store end date
  const [end_date, setEnd_date] = useState();
  //function to send page no to the redux store
  const handlePageChange = (event, newPage) => {
    dispatch(setEmployeeName(user?.id));
    dispatch(setPage(newPage));
    dispatch(refresh());
  };
  //function to send per page no to the redux store
  const handlePerPageChange = (newPerPage) => {
    dispatch(setEmployeeName(user?.id));
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
  //function to store project name in redux store to fetch employee details
  const handlesetProjectName = (e) => {
    setProject_name(e);
    dispatch(setProjectName(e.value));
  };
  //function to store activity name in redux store to fetch employee details
  const handlesetActivityName = (e) => {
    setActivity_name(e);
    dispatch(setActivityName(e.value));
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
    if (
      params.user_id ||
      params.project_id ||
      params.activity_id ||
      params.start_date ||
      params.end_date
    ) {
      dispatch(setPage(1));
      dispatch(refresh());
    } else {
      toast.info("to search worklog you have to select atleast one field");
    }
  };
  //function to reset all field value and to get all employee details
  const handleReset = () => {
    // setEmployee_name("");
    setProject_name(null);
    setActivity_name(null);
    setStart_date(null);
    setEnd_date(null);
    dispatch(setPage(1));
    // dispatch(setEmployeeName(null));
    dispatch(setProjectName(null));
    dispatch(setActivityName(null));
    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(refresh());
  };
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(setEmployeeName(user.id));
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
            <span> Work Sheet</span>

            <Link to={"/add-time-sheet"}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                className="cardHeaderBtn"
              >
                Add time sheet
              </Button>
            </Link>
          </Stack>

          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <InputLabel className="fixlabel">
                  Select Project Name
                </InputLabel>
                <Select
                  options={projects}
                  name="project_id"
                  value={project_name}
                  onChange={handlesetProjectName}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Project Name"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <InputLabel className="fixlabel">
                  Select Activity Name
                </InputLabel>
                <Select
                  options={activity}
                  name="activity_id"
                  value={activity_name}
                  onChange={handlesetActivityName}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Activity Name"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
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
              <Grid item xs={12} sm={6} md={4} lg={2}>
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
              <Grid item>
                <LoadingButton
                  variant="contained"
                  className="primary-btn text-capitalize"
                  color="primary"
                  sx={{ height: "40px" }}
                  onClick={handleClick}
                  // loading={isLoading}
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid>
                <LoadingButton
                  variant="outlined"
                  className=" h-40 text-capitalize"
                  sx={{ marginTop: "45px", width: "100px", marginLeft: "15px" }}
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </LoadingButton>
              </Grid>
              <Grid item>
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
                        className="text-capitalize download-btn"
                      >
                        <img src={ImagePath.sheetIcon} alt="" /> Download
                      </Button>
                    </DownloadTableExcel>
                  ) : (
                    ""
                  )}
                </Stack>
              </Grid>
            </Grid>
            <div ref={excelData} style={{ width: "100%" }}>
              <TableContainer className="table-striped" sx={{ mt: 4 }}>
                <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={100} align="left">
                        Date
                      </TableCell>
                      <TableCell width={150} align="left">
                        Project Name
                      </TableCell>
                      <TableCell width={150} align="left">
                        Activity
                      </TableCell>
                      <TableCell align="left" width={250}>
                        Description
                      </TableCell>
                      <TableCell width={100} align="center">
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
                    ) : (data?.data || []).length > 0 ? (
                      data.data.map((data, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell align="left">
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
                              {removeTags(data?.description || "") || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {parseInt(data?.time_spent?.split(":")[0]) != 0
                                ? `
                              ${parseInt(data?.time_spent?.split(":")[0])}h`
                                : ""}
                              {parseInt(data?.time_spent?.split(":")[1]) != 0
                                ? `
                              ${parseInt(data?.time_spent?.split(":")[1])}m`
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

export default WorkSheet;
