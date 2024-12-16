import React, { useContext, useEffect, useRef, useState } from "react";
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
  FormControlLabel,
  Checkbox,
  Typography,
  Modal,
  Backdrop,
  Fade,
  FormGroup,
  Tooltip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "react-select";
import moment from "moment";
import { ImagePath } from "@/ImagePath";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useAxios } from "@/contexts/AxiosProvider";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import SimCardDownloadRoundedIcon from "@mui/icons-material/SimCardDownloadRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import {
  refresh,
  setPage,
  setPerPage,
  setCandidateName,
  setStartDate,
  setEndDate,
} from "@/redux/CandidateListSlice";
import { AuthContext } from "@/contexts/AuthProvider";
import { getYear, getMonth } from "date-fns";
import { toast } from "react-toastify";
import DeleteCandidate from "./DeleteCandidate";
import DeleteMultiCandidate from "./DeleteMultiCandidate";
import { DownloadTableExcel } from "react-export-table-to-excel";
const CandidateList = () => {
  // to target current data on display
  const excelData = useRef();
  // Axios instance
  const { Axios } = useAxios();
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
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.candidatelist
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteCandidateData, setDeleteCandidateData] = useState("");
  const [candidate, setcandidate] = useState("");
  //to open delete modal and store delete data
  const openDeleteCandidate = (data) => {
    setIsDeleteOpen(true);
    setDeleteCandidateData(data);
    setcandidate('candidate')
  };
  //to close delete modal
  const closeDeleteCandidate = () => {
    setIsDeleteOpen(false);
  };
  const [isMultiDeleteOpen, setIsMultiDeleteOpen] = useState(false);
  const [deleteMultiCandidateData, setDeleteMultiCandidateData] = useState("");
  //to open delete modal and store delete data
  const openDeleteMultiCandidate = () => {
    setIsMultiDeleteOpen(true);
    setDeleteMultiCandidateData(interviewId);
  };
  //to close delete modal
  const closeDeleteMultiCandidate = () => {
    setIsMultiDeleteOpen(false);
  };
  //state to store start date
  const [startsDate, setStartsDate] = useState();
  //state to store end date
  const [endsDate, setEndsDate] = useState();
  //state to store candidate name
  const [name, setName] = useState();
  //state to store multiple interview id
  const [interviewId, setInterviewId] = useState([]);
  //state to store checked value on header section
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  //creating array, based on data length to control checked/unchecked for every field
  const [checkedItems, setCheckedItems] = useState([]);

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

  //function to checked and unchecked all field
  const toggleSelectAll = () => {
    const newCheckedItems = [...checkedItems];
    const newSelectAllChecked = !selectAllChecked;
    (data.data || []).forEach((data, index) => {
      if (newSelectAllChecked) {
        interviewId[index] = data.id || "";
      } else {
        setInterviewId([]);
      }
      newCheckedItems[index] = newSelectAllChecked;
    });
    setCheckedItems(newCheckedItems);
    setSelectAllChecked(newSelectAllChecked);
  };
  //function to checked and unchecked particular field

  const handleCheckboxChange = (index, id) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    if (!newCheckedItems[index]) {
      setInterviewId(interviewId || [].filter((item) => item != id));
    } else {
      setInterviewId([...interviewId, id]);
    }
    setCheckedItems(newCheckedItems);
    const allChecked = newCheckedItems.every((item) => item);
    setSelectAllChecked(allChecked);
  };

  //function to store candidate name in redux store to fetch cadidate details
  const handlesetCandidateName = (e) => {
    setName(e);
    dispatch(setCandidateName(e));
  };
  //function to get candidate details based on searched value
  const handleClick = () => {
    if (params.candidate_name || params.start_date || params.end_date) {
      dispatch(setPage(1));
      dispatch(refresh());
    } else {
      toast.info(
        "to search candidate list you have to select atleast one field"
      );
    }
  };
  //function to reset all field value and to get all candidate details
  const handleReset = () => {
    setName("");
    setStartsDate(null);
    setEndsDate(null);
    dispatch(setPage(1));
    dispatch(setCandidateName(null));
    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(refresh());
  };
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch]);
  useEffect(() => {
    if (data && data.data) {
      setCheckedItems(new Array((data.data || []).length).fill(false));
      setSelectAllChecked(false);
    }
  }, [data]);

  const [isConfigureColum, setIsConfigureColum] = useState(false);
  const configureColumOpen = () => setIsConfigureColum(true);
  const configureColumClose = () => setIsConfigureColum(false);

  const [isFilter, setIsFilter] = useState(false);
  const filterOpen = () => setIsFilter(true);
  const filterClose = () => setIsFilter(false);

  const operatorSlect = [
    { label: "Demo 1", value: "Demo 1" },
    { label: "Demo 2", value: "Demo 2" },
  ];

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
            <span>Candidate List</span>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {checkedItems.some((el) => el === true) && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={openDeleteMultiCandidate}
                >
                  Delete
                </Button>
              )}
              {/* <Button
                variant="outlined"
                size="small"
                className=""
                sx={{ minWidth: 40, borderColor: "#303030" }}
                onClick={filterOpen}
              >
                <ViewWeekOutlinedIcon sx={{ fontSize: 22, color: "#303030" }} />
              </Button>
              <Button
                variant="outlined"
                size="small"
                className=""
                sx={{ minWidth: 40, borderColor: "#303030" }}
                onClick={configureColumOpen}
              >
                <FilterAltRoundedIcon sx={{ fontSize: 22, color: "#303030" }} />
              </Button>
              <Button
                variant="outlined"
                size="small"
                className=""
                color="success"
                sx={{ minWidth: 40 }}
              >
                <SimCardDownloadRoundedIcon
                  sx={{ fontSize: 22 }}
                  color="success"
                />
              </Button>
              <Button
                variant="outlined"
                size="small"
                className=""
                sx={{ minWidth: 40 }}
              >
                <UploadFileRoundedIcon sx={{ fontSize: 22 }} color="primary" />
              </Button> */}
              {hasPermission("candidate_create") && (
                <Link to={"/candidate-information"}>
                  <Button
                    variant="contained"
                    size="small"
                    className="cardHeaderBtn"
                    startIcon={<AddIcon sx={{ color: "#fff" }} />}
                  >
                    ADD
                  </Button>
                </Link>
              )}
            </Stack>
          </Stack>
          <CardContent>
            <Grid container spacing={2} p={0} sx={{ mb: 5 }}>
              {/* <Grid item xs={2.1}>
                <InputLabel className="fixlabel">Candidate Status</InputLabel>
                <Select
                  placeholder="Select Status"
                  name="status"
                  // options={department}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
              </Grid> */}
              <Grid item xs={2.1}>
                <InputLabel className="fixlabel">
                  Enter Candidate Name
                </InputLabel>
                <TextField
                  id="leaveType"
                  value={name}
                  placeholder="Enter Candidate Name"
                  name="name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    handlesetCandidateName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={2.1}>
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
                  selected={startsDate}
                  onChange={(date) => {
                    dispatch(setStartDate(moment(date).format("YYYY-MM-DD")));
                    setStartsDate(date);
                  }}
                  className="dateTime-picker calender-icon"
                  placeholderText="Select Start Date"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={2.1}>
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
                  selected={endsDate}
                  onChange={(date) => {
                    setEndsDate(date);
                    dispatch(setEndDate(moment(date).format("YYYY-MM-DD")));
                  }}
                  className="dateTime-picker calender-icon"
                  placeholderText="Select End Date"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={3.5}>
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
                    className="primary-btn text-capitalize h-40"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>{" "}
                  {(data?.data || []).length > 0 ? (
                    <DownloadTableExcel
                      filename="Candidate List"
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
                    // <Button
                    //   variant="outlined"
                    //   onClick={dowenload}
                    //   className="text-capitalize download-btn"
                    // >
                    //   <img src={ImagePath.sheetIcon} alt="" /> Download
                    // </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Box className="table-responsive">
              <TableContainer className="table-striped" ref={excelData}>
                <Table
                  sx={{ minWidth: 1600 }}
                  aria-label="simple table"
                  className="table-responsive scroll-x"
                >
                  <TableHead>
                    <TableRow>
                      {hasPermission("candidate_delete") &&
                      (data?.data || [])?.length > 0 ? (
                        <TableCell width={50} align="left">
                          {" "}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectAllChecked}
                                onChange={toggleSelectAll}
                              />
                            }
                          />
                        </TableCell>
                      ) : (
                        ""
                      )}
                      <TableCell
                        align="left"
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
                        Department
                      </TableCell>
                      <TableCell
                        style={{ width: 200, whiteSpace: "nowrap" }}
                        align="left"
                      >
                        Designation
                      </TableCell>
                      <TableCell
                        style={{ width: 150, whiteSpace: "nowrap" }}
                        align="left"
                      >
                        Updated Date
                      </TableCell>
                      <TableCell
                        style={{ width: 200, whiteSpace: "nowrap" }}
                        align="left"
                      >
                        Update By
                      </TableCell>
                      <TableCell
                        style={{ width: 50, whiteSpace: "nowrap" }}
                        align="left"
                      >
                        Interview Sheduled
                      </TableCell>
                      <TableCell
                        style={{ width: 200, whiteSpace: "nowrap" }}
                        align="center"
                      >
                        {`Candidate's`} Status
                      </TableCell>
                      {hasAnyPermission([
                        "candidate_view",
                        "candidate_update",
                        "candidate_delete",
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
                        rows={5}
                        columns={
                          hasAnyPermission([
                            "candidate_view",
                            "candidate_update",
                            "candidate_delete",
                          ])
                            ? 10
                            : 9
                        }
                      />
                    ) : (data?.data || []).length > 0 ? (
                      data.data.map((data, index) => {
                        const slNo = (params.current_page - 1) * 10;
                        return (
                          <TableRow key={index}>
                            {hasPermission("candidate_delete") && (
                              <TableCell>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={checkedItems[index] || false}
                                      onChange={() =>
                                        handleCheckboxChange(index, data.id)
                                      }
                                    />
                                  }
                                />
                              </TableCell>
                            )}
                            <TableCell align="center">
                              {index + slNo + 1}
                            </TableCell>

                            <TableCell align="left" style={{ width: 200 }}>
                              {data?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 200 }}>
                              {data?.department?.name || "N/A"}
                            </TableCell>

                            <TableCell align="left" style={{ width: 200 }}>
                              {data?.designation?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 150 }}>
                              {data?.updated_at
                                ? moment(data.updated_at).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell align="left" style={{ width: 200 }}>
                              {data?.candidate_added_by
                                ? `${
                                    data?.candidate_added_by?.honorific
                                      ? `${data?.candidate_added_by?.honorific} `
                                      : ""
                                  }${
                                    data?.candidate_added_by?.first_name || ""
                                  } ${
                                    data?.candidate_added_by?.middle_name
                                      ? `${data?.candidate_added_by.middle_name} `
                                      : ""
                                  }${data?.candidate_added_by?.last_name || ""}`
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center" style={{ width: 50 }}>
                              {data?.scheduled_interviews?.length > 0
                                ? "Yes"
                                : "No"}
                            </TableCell>
                            <TableCell align="center" style={{ width: 200 }}>
                              {data?.hr_head_feedback?.status || "N/A"}
                            </TableCell>
                            {hasAnyPermission([
                              "candidate_view",
                              "candidate_update",
                              "candidate_delete",
                            ]) && (
                              <TableCell align="center" style={{ width: 180 }}>
                                {hasPermission("candidate_view") && (
                                  <Tooltip title="View Candidate">
                                    <Link to={`/candidate-view/${data.id}`}>
                                      <IconButton
                                        aria-label="visibility"
                                        color="primary"
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Link>
                                  </Tooltip>
                                )}
                                {hasPermission("candidate_update") && (
                                  <Tooltip title="Edit Candidate">
                                    <Link
                                      to={`/candidate-information/${data.id}`}
                                    >
                                      <IconButton
                                        aria-label="EditIcon"
                                        color="primary"
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Link>
                                  </Tooltip>
                                )}
                                {/* <IconButton
                                aria-label="AutoGraphIcon"
                                title="Next Step"
                                color="primary"
                                >
                                <AutoGraphIcon fontSize="small" />
                              </IconButton> */}
                                {hasPermission("candidate_delete") && (
                                  <Tooltip title="Delete Candidate">
                                    <IconButton
                                      aria-label="DeleteIcon"
                                      color="error"
                                      onClick={() => {
                                        openDeleteCandidate(data);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No Results Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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
        {isDeleteOpen && (
          <DeleteCandidate
            isDeleteOpen={isDeleteOpen}
            deleteCandidateData={deleteCandidateData}
            closeDeleteCandidate={closeDeleteCandidate}
            candidate={candidate}
          />
        )}
        {isMultiDeleteOpen && (
          <DeleteMultiCandidate
            isMultiDeleteOpen={isMultiDeleteOpen}
            deleteMultiCandidateData={deleteMultiCandidateData}
            closeDeleteMultiCandidate={closeDeleteMultiCandidate}
          />
        )}
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isConfigureColum}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isConfigureColum}>
          <Box className="modalContainer sm">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Configure Colum
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={configureColumClose}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Candidate Name"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
            <Box className="modalFooter">
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <FormControlLabel control={<Checkbox />} label="Select all" />
                <Stack spacing={2} direction="row" justifyContent="flex-start">
                  <Button
                    variant="outlined"
                    color="primary"
                    className="text-capitalize"
                    onClick={configureColumClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-capitalize"
                  >
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isFilter}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isFilter}>
          <Box className="modalContainer md">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Advanced Filter
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={filterClose}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y minH-500 hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Typography>Label</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Typography>Operator</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Typography>Label</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Candidate Name
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Department
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Designation
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Update Date
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Update By
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Candidate Name
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Interview Scheduled
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Interview Scheduled
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <InputLabel className="fixlabel" sx={{ mb: 0 }}>
                    Candidate's Status
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    menuPlacement="auto"
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Select
                    placeholder="Select"
                    name="status"
                    options={operatorSlect}
                    menuPlacement="auto"
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="modalFooter">
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  className="text-capitalize"
                  onClick={filterClose}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="text-capitalize"
                >
                  Apply
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default CandidateList;
