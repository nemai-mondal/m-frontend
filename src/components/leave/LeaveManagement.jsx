import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  InputLabel,
  Pagination,
  Skeleton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import Select from "react-select";
import PersonIcon from "@mui/icons-material/Person";
import "react-tabs/style/react-tabs.css";
import "./apply-leave.css";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setDepartment,
  setEmployee,
  setStartDate,
  setEndDate,
  setLeaveStatus,
  resetParams,
} from "@/redux/LeaveApprovalSlice";
import moment from "moment";
import LeaveDetailModal from "./LeaveDetailModal";
import { pluralize } from "@/utils";
import { useAxios } from "@/contexts/AxiosProvider";

const LeaveManagement = () => {
  const { Axios } = useAxios();
  const dispatch = useDispatch();
  const {
    data: appliedLeaveData,
    meta,
    params,
    isLoading,
  } = useSelector((state) => state.leaveApproval);

  const handlePageChange = (_, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };
  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  const leaveStatus = [
    {
      value: "approved",
      label: "Approved",
    },
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "rejected",
      label: "Rejected",
    },
    {
      value: "canceled",
      label: "Canceled",
    },
  ];

  //For edit  Modal open close
  const [leaveManageModal, setLeaveManageModal] = useState(false);
  const [leaveManage, setLeaveManage] = useState({});
  // departments list
  const [departments, setDepartments] = useState([]);
  // State to store employees
  const [employees, setEmployees] = useState([]);

  // Function to fetch departments from the server
  const getDepartments = useCallback(async () => {
    try {
      // Make the API request to fetch departments
      const res = await Axios.get("department/list");

      // Update date with the fetched departments, or set to an empty array if undefined
      setDepartments(
        (res.data?.data || []).map((m) => {
          return {
            value: m.id,
            label: m.name,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching department list", error);
    }
  }, []);

  // Function to fetch employees from the server
  const getEmployees = useCallback(async () => {
    try {
      // Make the API request to fetch employees
      const res = await Axios.get("/user/list");

      // Update date with the fetched employees, or set to an empty array if undefined
      setEmployees(
        (res.data?.data || []).map((m) => {
          return {
            value: m.id,
            label: `${m.honorific} ${m.first_name}${
              m.middle_name ? " " + m.middle_name : ""
            }${m.last_name ? " " + m.last_name : ""} - ${m.employee_id}`,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching leave types", error);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(refresh());
  };

  const handleResetFilters = () => {
    dispatch(resetParams());
    dispatch(refresh());
  };

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  // Use useEffect to fetch leave types when the component mounts
  useEffect(() => {
    getDepartments();
    getEmployees();
  }, []);
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
            <span>Leave Management</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Box p={2} component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2} p={0} sx={{ mb: 5 }}>
                <Grid item xs={2}>
                  <InputLabel className="fixlabel">Department Name</InputLabel>
                  <Select
                    placeholder="Department"
                    name="department"
                    options={departments}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    value={
                      params?.department_ids?.value
                        ? params?.department_ids
                        : null
                    }
                    onChange={(value) => dispatch(setDepartment(value))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <InputLabel className="fixlabel">Employee Name</InputLabel>
                  <Select
                    onChange={(value) => dispatch(setEmployee(value))}
                    value={
                      params?.employee_ids?.value ? params?.employee_ids : null
                    }
                    options={employees}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    placeholder="Search Employee"
                  />
                </Grid>
                <Grid item xs={2}>
                  <InputLabel className="fixlabel">Leave Status</InputLabel>
                  <Select
                    placeholder="Status"
                    name="leaveStatus"
                    options={leaveStatus}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    value={params?.leave_status}
                    onChange={(value) => dispatch(setLeaveStatus(value))}
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <InputLabel className="fixlabel">From Date</InputLabel>
                  <DatePicker
                    selected={
                      params?.start_date ? new Date(params.start_date) : null
                    }
                    onChange={(date) =>
                      dispatch(
                        setStartDate(
                          moment(date).format("YYYY-MM-DD").toString()
                        )
                      )
                    }
                    className="dateTime-picker calender-icon"
                    placeholderText="From Date"
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <InputLabel className="fixlabel">To Date</InputLabel>
                  <DatePicker
                    selected={
                      params?.end_date ? new Date(params.end_date) : null
                    }
                    onChange={(date) =>
                      dispatch(
                        setEndDate(moment(date).format("YYYY-MM-DD").toString())
                      )
                    }
                    className="dateTime-picker calender-icon"
                    placeholderText="To Date"
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <InputLabel className="fixlabel">&nbsp;</InputLabel>
                  <Stack
                    direction={"row"}
                    alignItems={"self-start"}
                    spacing={2}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      className="primary-btn text-capitalize h-40"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      className="primary-btn text-capitalize h-40"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={4} p={0} sx={{ mb: 2 }}>
                {isLoading ? (
                  <Grid container spacing={2} p={4}>
                    <Grid item xs={6}>
                      <Skeleton variant="text" height={200} />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton variant="text" height={200} />
                    </Grid>
                  </Grid>
                ) : appliedLeaveData?.length >= 1 ? (
                  appliedLeaveData?.map((item) => {
                    return (
                      <Grid key={item.id} item xs={6}>
                        <Card
                          variant="outlined"
                          className="cardBox leaveManageBox"
                          sx={{ p: 2 }}
                        >
                          <Stack direction="row" justifyContent="space-between">
                            <Stack direction="row" className="userList">
                              {item?.user?.profile_image ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={item?.user?.profile_image}
                                  className="avtar"
                                />
                              ) : (
                                <Avatar alt="Remy Sharp" className="avtar">
                                  <PersonIcon />
                                </Avatar>
                              )}

                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {`${item.user.honorific} ${
                                    item.user.first_name
                                  }${
                                    item.user.middle_name
                                      ? " " + item.user.middle_name
                                      : ""
                                  }${
                                    item.user.last_name
                                      ? " " + item.user.last_name
                                      : ""
                                  }`}
                                </Typography>
                                <Typography component="p" className="smallText">
                                  {item?.designation?.name || "Not Available"}
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack
                              className="userList"
                              direction="row"
                              spacing={5}
                            >
                              <Box>
                                <Typography component="p" className="smallText">
                                  Employee ID
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {item.user.employee_id}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="p" className="smallText">
                                  Leave Type
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {item?.leave_type?.name || "Not Available"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="p" className="smallText">
                                  Day Count
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {item.total_days +
                                    " " +
                                    pluralize(item.total_days, "day")}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ marginTop: 4 }}
                          >
                            <Stack
                              className="userList"
                              direction="row"
                              spacing={6}
                            >
                              <Box>
                                <Typography component="p" className="smallText">
                                  From
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {moment(item.leave_from).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="p" className="smallText">
                                  Till
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {moment(item.leave_to).format("DD-MMM-YYYY")}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="p" className="smallText">
                                  Leave Applied On
                                </Typography>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {moment(item.created_at).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </Typography>
                              </Box>
                            </Stack>
                            <Box direction="row">
                              <Stack
                                sx={{ marginLeft: "15px" }}
                                direction="row"
                                justifyContent="center"
                                spacing={2}
                              >
                                {item.leave_status !== "canceled" ? (
                                  <>
                                    {item.leave_status !== "rejected" && (
                                      <Button
                                        color="success"
                                        variant="contained"
                                        className="success-btn text-capitalize fs-12 fw-400"
                                        onClick={() => {
                                          setLeaveManageModal(true);
                                          setLeaveManage({
                                            item,
                                            type: "approve",
                                          });
                                        }}
                                      >
                                        {item.leave_status === "approved"
                                          ? "Approved"
                                          : "Approve"}
                                      </Button>
                                    )}

                                    <Button
                                      color="error"
                                      variant="outlined"
                                      className="text-capitalize fs-12 fw-400"
                                      disabled={
                                        item.leave_status === "approved"
                                      }
                                      onClick={() => {
                                        setLeaveManageModal(true);
                                        setLeaveManage({
                                          item,
                                          type: "reject",
                                        });
                                      }}
                                    >
                                      {item.leave_status === "rejected"
                                        ? "Rejected"
                                        : "Reject"}
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    color="error"
                                    variant="outlined"
                                    className="text-capitalize fs-12 fw-400"
                                    onClick={() => {
                                      setLeaveManageModal(true);
                                      setLeaveManage({ item, type: "cancel" });
                                    }}
                                  >
                                    Canceled
                                  </Button>
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      padding: "40px 0",
                    }}
                  >
                    No Leaves Found
                  </Box>
                )}
              </Grid>

              <Stack
                direction="row"
                justifyContent="end"
                spacing={2}
                alignItems={"center"}
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
            </Box>
          </CardContent>
        </Card>
      </Box>

      <LeaveDetailModal
        open={leaveManageModal}
        detail={leaveManage}
        onClosed={(value) => {
          setLeaveManageModal(value);
          setLeaveManage({});
        }}
        onComplete={(value) => {
          setLeaveManageModal(false);
          setLeaveManage({});
          dispatch(refresh());
        }}
      />
    </React.Fragment>
  );
};

export default LeaveManagement;
