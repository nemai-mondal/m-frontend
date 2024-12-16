import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Pagination,
  Table,
  TableContainer,
  TableHead,
  IconButton,
  Button,
  TableRow,
  TableCell,
  TableBody,
  // FormControlLabel,
  // Checkbox,
  Typography,
  Tooltip,
  // Modal,
  // Backdrop,
  // Fade,
  // FormGroup,
} from "@mui/material";
// import ClearIcon from "@mui/icons-material/Clear";
import Select from "react-select";
import moment from "moment";
import { ImagePath } from "@/ImagePath";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
// import { useAxios } from "@/contexts/AxiosProvider";
// import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
// import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
// import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import { AuthContext } from "@/contexts/AuthProvider";
import { getYear, getMonth } from "date-fns";
import { toast } from "react-toastify";
// import { useConfirmationModal } from "@/hooks";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {
  refresh,
  setParams,
  setPage,
  setPerPage,
  resetParams,
} from "../../../redux/InterviewListSlice";
import DeleteCandidate from "./DeleteCandidate";
const InterviewList = () => {
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
  const { hasAnyPermission, hasPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.interviewList
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteInterviewData, setDeleteInterviewData] = useState("");
  // to open delete modal and store delete data
  const openDeleteInterview = (data) => {
    setIsDeleteOpen(true);
    setDeleteInterviewData(data);
  };
  // to close delete modal
  const closeDeleteInterview = () => {
    setIsDeleteOpen(false);
  };

  // to target current data on display
  const excelData = useRef();

  const [viewState, setViewState] = useState("");

  //state to store start date
  const [startDate, setStartDate] = useState();
  //state to store end date
  const [endDate, setEndDate] = useState();

  //state to store checked value on header section
  // const [selectAllChecked, setSelectAllChecked] = useState(false);
  //creating array, based on data length to control checked/unchecked for every field
  // const [checkedItems, setCheckedItems] = useState(
  //   Array(data.length).fill(false)
  // );

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

  const views = [
    { label: "All", value: "" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Previous", value: "previous" },
  ];

  //function to checked and unchecked all field
  // const toggleSelectAll = () => {
  //   const newCheckedItems = [...checkedItems];
  //   const newSelectAllChecked = !selectAllChecked;
  //   data.forEach((_, index) => {
  //     newCheckedItems[index] = newSelectAllChecked;
  //   });
  //   setCheckedItems(newCheckedItems);
  //   setSelectAllChecked(newSelectAllChecked);
  // };
  //function to checked and unchecked particular field
  // const handleCheckboxChange = (index) => {
  //   const newCheckedItems = [...checkedItems];
  //   newCheckedItems[index] = !newCheckedItems[index];
  //   setCheckedItems(newCheckedItems);
  //   const select = newCheckedItems.filter((item) => item === true);

  //   if (select.length == 0) {
  //     setSelectAllChecked(false);
  //   } else if (select.length === checkedItems.length) {
  //     setSelectAllChecked(true);
  //   }
  // };

  //function to get candidate details based on searched value
  const handleClick = () => {
    // if (
    //   params?.applied_designation ||
    //   params?.candidate_name ||
    //   params?.start_date ||
    //   params?.end_date ||
    //   viewState
    // ) {
    dispatch(setPage(1));
    dispatch(refresh());
    // } else {
    //   toast.info(
    //     "to search candidate list you have to select atleast one field"
    //   );
    // }
  };
  //function to reset all field value and to get all candidate details
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setViewState("");
    dispatch(resetParams());
    dispatch(refresh());
  };

  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch]);

  // const deleteCandidateModal = useConfirmationModal({
  //   option: {
  //     title: "Warning!",
  //     question: "Are you sure, you want to add this role?",
  //     confirmButtonText: "Yes, Confirm",
  //     confirmButtonColor: "success",
  //   },
  //   onConfirm: async (data) => {
  //     try {
  //       const res = await Axios.delete(`interview/delete/${data.id}`);

  //       if (res.status === 200) {
  //         deleteCandidateModal.closeModal();

  //         dispatch(refresh());
  //         toast.success(`Candidate deleted successfully`);
  //       } else {
  //         toast.error("Something went wrong.");
  //         deleteCandidateModal.closeModal();
  //       }
  //     } catch (error) {
  //       toast.error(
  //         error?.response?.data?.message || "Unable to connect to the server."
  //       );
  //       deleteCandidateModal.closeModal();
  //     }
  //   },
  // });

  // const [isConfigureColum, setIsConfigureColum] = useState(false);
  // const configureColumOpen = () => setIsConfigureColum(true);
  // const configureColumClose = () => setIsConfigureColum(false);

  // const [isFilter, setIsFilter] = useState(false);
  // const filterOpen = () => setIsFilter(true);
  // const filterClose = () => setIsFilter(false);

  // Funtion retuns the candidate total rounds
  const handleCountCandidateRounds = (data) => {
    let count = 0;
    if (data?.screening_feedback) {
      count++;
    }
    if (data?.assignments && data?.assignments?.length >= 1) {
      count = count + data?.assignments.length;
    }
    if (data?.scheduled_interviews && data?.scheduled_interviews?.length >= 1) {
      count = count + data?.scheduled_interviews.length;
    }

    return count >= 1 ? `Round ${count}` : "New";
  };

  // Function used to get Candidate latest status
  const handleCandidateStatus = (data) => {
    let status = "New";
    let date = Date.now();
    if (data?.screening_feedback) {
      status = data?.screening_feedback?.status;
      date = date?.screening_feedback?.updated_at;
    }

    if (data?.assignments && data?.assignments?.length >= 1) {
      const newData = compareDatesAndConvert(
        date,
        data?.assignments[data?.assignments?.length - 1]?.updated_at
      ).date;
      if (newData?.status) {
        date = newData?.date;
        status = data?.assignments[data?.assignments?.length - 1]?.status;
      }
    }

    if (data?.scheduled_interviews && data?.scheduled_interviews?.length >= 1) {
      const newData = compareDatesAndConvert(
        date,
        data?.scheduled_interviews[data?.scheduled_interviews?.length - 1]
          ?.updated_at
      ).date;
      if (newData?.status) {
        date = newData?.date;
        status =
          data?.scheduled_interviews[data?.scheduled_interviews?.length - 1]
            ?.status;
      }
    }

    return status;
  };

  // Function used to get status and latest date
  function compareDatesAndConvert(currentDate, newDate) {
    let date = currentDate;

    let status = false;

    if (date < new Date(newDate)) {
      date = newDate.getTime();
      status = true;
    }

    return { status, date };
  }
  // Function used to convert time 24 hours to 12 hours
  function convertTo12HourFormat(time24) {
    if (!time24) return "";
    let timeParts = time24.split(":");
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    let ampm = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Interview</span>
            {hasPermission("interview_create") && (
              <Link to={"/candidate-information"}>
                <Button
                  variant="outlined"
                  size="small"
                  className="cardHeaderBtn"
                  startIcon={<AddIcon />}
                >
                  ADD
                </Button>
              </Link>
            )}
          </Stack>
          <CardContent>
            <Grid container spacing={1} p={0} sx={{ mb: 5 }}>
              <Grid item xs={2}>
                <InputLabel className="fixlabel">Designation</InputLabel>
                <TextField
                  id="designation-name"
                  placeholder="Designation"
                  name="name"
                  variant="outlined"
                  size="small"
                  value={params?.applied_designation || ""}
                  onChange={(e) =>
                    dispatch(
                      setParams({
                        key: "applied_designation",
                        value: e.target.value,
                      })
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <InputLabel className="fixlabel">Candidate Name</InputLabel>
                <TextField
                  id="candidate-name"
                  placeholder="Candidate Name"
                  name="name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={params?.candidate_name || ""}
                  onChange={(e) =>
                    dispatch(
                      setParams({
                        key: "candidate_name",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </Grid>
              <Grid item xs={1.8}>
                <InputLabel className="fixlabel">Interview From</InputLabel>
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
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    dispatch(
                      setParams({
                        key: "start_date",
                        value: moment(date).format("YYYY-MM-DD"),
                      })
                    );
                  }}
                  className="dateTime-picker calender-icon"
                  placeholderText="Interview From"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={1.7}>
                <InputLabel className="fixlabel">Interview To</InputLabel>
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
                  selected={endDate}
                  onChange={(date) => {
                    dispatch(
                      setParams({
                        key: "end_date",
                        value: moment(date).format("YYYY-MM-DD"),
                      })
                    );
                    setEndDate(date);
                  }}
                  className="dateTime-picker calender-icon"
                  placeholderText="Interview To"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={1.3}>
                <InputLabel className="fixlabel">View</InputLabel>
                <Select
                  placeholder="View"
                  options={views}
                  value={viewState}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  onChange={(selectedOptions) => {
                    setViewState(selectedOptions);
                    dispatch(
                      setParams({
                        key: "view",
                        value: selectedOptions.value,
                      })
                    );
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">&nbsp;</InputLabel>
                <Stack spacing={2} direction="row">
                  <Button
                    variant="contained"
                    className="primary-btn text-capitalize h-40"
                    color="primary"
                    onClick={handleClick}
                  >
                    Search
                  </Button>

                  <Button
                    variant="contained"
                    className="text-capitalize h-40"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>

                  <Grid item xs={12} sm={6} md={4} lg={2}>
                    {(data || []).length > 0 ? (
                      <DownloadTableExcel
                        filename="Interview List"
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
                  </Grid>
                </Stack>
              </Grid>
            </Grid>

            <Box className="table-responsive">
              <div ref={excelData}>
                <TableContainer className="table-striped">
                  <Table
                    sx={{ minWidth: 1600 }}
                    aria-label="simple table"
                    className="table-responsive scroll-x"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{ width: 50, whiteSpace: "nowrap" }}
                        >
                          Sl.No.
                        </TableCell>
                        <TableCell
                          style={{ width: 200, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Candidate Name
                        </TableCell>
                        <TableCell
                          style={{ width: 200, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Position Applied
                        </TableCell>
                        <TableCell
                          style={{ width: 200, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Interview Date
                        </TableCell>
                        <TableCell
                          style={{ width: 150, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Interview Time
                        </TableCell>
                        <TableCell
                          style={{ width: 200, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Interview Type
                        </TableCell>
                        <TableCell
                          style={{ width: 50, whiteSpace: "nowrap" }}
                          align="left"
                        >
                          Interview Round
                        </TableCell>
                        <TableCell
                          style={{ width: 200, whiteSpace: "nowrap" }}
                          align="center"
                        >
                          Status
                        </TableCell>
                        {hasAnyPermission([
                          "interview_view",
                          "interview_update",
                          "interview_delete",
                        ]) && (
                          <TableCell
                            align="center"
                            style={{ width: 180, whiteSpace: "nowrap" }}
                          >
                            Action
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRowSkeleton
                          rows={10}
                          columns={
                            hasAnyPermission([
                              "interview_view",
                              "interview_update",
                              "interview_delete",
                            ])
                              ? 9
                              : 8
                          }
                        />
                      ) : data.length >= 1 ? (
                        data.map((interview, index) => (
                          <TableRow key={interview?.id}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="left" style={{ width: 200 }}>
                              {interview?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 250 }}>
                              {interview?.designation?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {interview?.scheduled_interviews[
                                interview?.scheduled_interviews?.length - 1
                              ]?.interview_date || "N/A"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 100 }}>
                              {convertTo12HourFormat(
                                interview?.scheduled_interviews[
                                  interview?.scheduled_interviews?.length - 1
                                ]?.interview_time
                              ) || "N/A"}
                              {interview?.scheduled_interviews[
                                interview?.scheduled_interviews?.length - 1
                              ]?.interview_duration
                                ? `(${
                                    interview?.scheduled_interviews[
                                      interview?.scheduled_interviews?.length -
                                        1
                                    ]?.interview_duration
                                  })`
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                component={"div"}
                                style={{
                                  width: 100,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <p>{interview?.source_name || "N/A"}</p>
                                {interview?.source_link && (
                                  <Link
                                    target="_blank"
                                    to={interview?.source_link}
                                  >
                                    <OpenInNewIcon fontSize="small" />
                                  </Link>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {handleCountCandidateRounds(interview) || "N/A"}
                            </TableCell>
                            <TableCell align="center" style={{ width: 150 }}>
                              {handleCandidateStatus(interview) || "N/A"}
                            </TableCell>
                            {hasAnyPermission([
                              "interview_view",
                              "interview_update",
                              "interview_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("interview_view") && (
                                  <Link
                                    to={
                                      `/candidate-view/${interview?.id}` || "#"
                                    }
                                  >
                                    <Tooltip title="View Interview">
                                      <IconButton aria-label="visibility">
                                        <VisibilityIcon
                                          color="primary"
                                          fontSize="small"
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Link>
                                )}
                                {hasPermission("interview_update") && (
                                  <Link
                                    to={
                                      `/candidate-information/${interview?.id}` ||
                                      "#"
                                    }
                                  >
                                    <Tooltip title="Edit Interview">
                                      <IconButton aria-label="EditIcon">
                                        <EditIcon
                                          color="primary"
                                          fontSize="small"
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Link>
                                )}
                                {/* <IconButton
                                aria-label="AutoGraphIcon"
                                title="Next Step"
                              >
                                <AutoGraphIcon fontSize="small" />
                              </IconButton> */}
                                {hasPermission("interview_delete") && (
                                  <Tooltip title="Delete Interview">
                                    <IconButton
                                      aria-label="DeleteIcon"
                                      color="error"
                                      onClick={() => {
                                        openDeleteInterview(interview);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            No Interview found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </CardContent>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ marginBottom: 2 }}
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
      {isDeleteOpen && (
        <DeleteCandidate
          isDeleteOpen={isDeleteOpen}
          deleteCandidateData={deleteInterviewData}
          closeDeleteCandidate={closeDeleteInterview}
        />
      )}
    </React.Fragment>
  );
};

export default InterviewList;
