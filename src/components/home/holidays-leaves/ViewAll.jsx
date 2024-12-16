import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Card,
  CardContent,
  Stack,
  AvatarGroup,
  Tooltip,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  TableHead,
  Chip,
} from "@mui/material";
import "react-tabs/style/react-tabs.css";
import "./holidays-leaves.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ImagePath } from "@/ImagePath";
import moment from "moment";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
const ViewAll = () => {
  const { Axios } = useAxios();
  //state to open modal
  const [approvedLeavesModal, setApprovedLeavesModal] = useState(false);
  //state to store modal data
  const [approvedLeavesData, setApprovedLeavesData] = useState([]);
  //function to store leave data
  const approvedLeavesModalOpen = (leaves, date) => {
    setApprovedLeavesModal(true);
    setApprovedLeavesData({ leaves, date });
  };
  //function to close modal
  const approvedLeavesModalClose = () => setApprovedLeavesModal(false);
  //state to store holoday list
  const [holiday, setHoliday] = useState([]);
  //state to store upcoming leave list
  const [leaves, setLeaves] = useState([]);
  //fetching  data for holiday
  const fetchHoliday = useCallback(async () => {
    try {
      const data = await Axios.get(`holiday/search?list_type:all`);

      if (data.status && data.status >= 200 && data.status < 300) {
        //storing all holiday details in one array and removing sunday ,saturday and same day
        const allHolidayData = [].concat(
          ...(data?.data?.data || []).map((data) => {
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
              const currentDate = data.date_from ? moment(data.date_from) : "";
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
        );
        setHoliday(allHolidayData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  const [randomColor, setRandomColor] = useState([]);
  //function to get  leaves
  const getUpcomingLeaves = async () => {
    const payload = {
      days: 1000,
      leave_status: "approved",
    };
    try {
      const res = await Axios.post("/leave-application/dashboard", payload);
      if (res.status && res.status >= 200 && res.status < 300) {
        setLeaves(res?.data?.data || []);
        if (Object.keys(res?.data?.data || {}).length > 0) {
          const newColors = Object.keys(res?.data?.data || {}).map(() => {
            return (
              "#" +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()
            );
          });
          setRandomColor(newColors);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //useeffect to call function when component mount

  useEffect(() => {
    getUpcomingLeaves();
    fetchHoliday();
  }, []);

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
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Upcoming Holidays & Leaves</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Box className="modalBody" sx={{ p: 2 }}>
              <Tabs className="line-tab">
                <TabList>
                  <Tab>Leaves</Tab>
                  <Tab>Holidays</Tab>
                </TabList>
                <TabPanel>
                <TableContainer className="table-striped">
                  <Table aria-label="simple table">
                    <TableBody>
                      {Object.keys(leaves || "").length !== 0 ? (
                        Object.entries(leaves || {}).map(
                          ([date, leaves], index) => (
                            <TableRow key={index}>
                              <TableCell align="left">
                                {date || "N/A"}
                              </TableCell>
                              {/* Move AvatarGroup outside of the TableCell */}
                              <TableCell align="right">
                                <AvatarGroup max={4} className="align-center">
                                  {(leaves || []).length > 0
                                    ? leaves
                                        .slice(0, Math.min(leaves.length, 5))
                                        .map((leave, innerIndex) => (
                                          <Link
                                            to="#"
                                            className="avatar-group sm"
                                            key={innerIndex}
                                          >
                                            <Tooltip
                                              title={
                                                leave?.user_details
                                                  ? `${
                                                      leave?.user_details
                                                        ?.honorific
                                                        ? `${leave.user_details?.honorific} `
                                                        : ""
                                                    }${
                                                      leave?.user_details
                                                        ?.first_name || ""
                                                    } ${
                                                      leave?.user_details
                                                        ?.middle_name
                                                        ? `${leave.user_details.middle_name} `
                                                        : ""
                                                    }${
                                                      leave?.user_details
                                                        ?.last_name || ""
                                                    }`
                                                  : "N/A"
                                              }
                                              arrow
                                              onClick={() => {
                                                approvedLeavesModalOpen(
                                                  leaves,
                                                  date
                                                );
                                              }}
                                            >
                                              {leave?.user_details
                                                ?.profile_image ? (
                                                <Avatar
                                                  src={
                                                    leave?.user_details
                                                      ?.profile_image || ""
                                                  }
                                                  sx={{ marginRight: "8px" }}
                                                />
                                              ) : leave?.user_details
                                                  ?.first_name ? (
                                                <Avatar
                                                  sx={{
                                                    bgcolor: randomColor[index],
                                                    marginRight: "8px",
                                                  }}
                                                  className="avtar"
                                                >
                                                  {leave?.user_details
                                                    ?.first_name[0] || ""}
                                                </Avatar>
                                              ) : (
                                                <Avatar
                                                  src={
                                                    leave?.user_details
                                                      ?.profile_image || ""
                                                  }
                                                  sx={{ marginRight: "8px" }}
                                                />
                                              )}
                                            </Tooltip>
                                          </Link>
                                        ))
                                    : ""}
                                  {(leaves || []).length > 5 ? (
                                    <Link
                                      to="#"
                                      className="avatar-group sm"
                                      onClick={() => {
                                        approvedLeavesModalOpen(leaves, date);
                                      }}
                                    >
                                      <Tooltip title="See more" arrow>
                                        <Avatar>{`+${
                                          leaves.length - 3
                                        }`}</Avatar>
                                      </Tooltip>
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </AvatarGroup>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            style={{ textAlign: "center" }}
                          >
                            No Leave Found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                </TabPanel>
                <TabPanel>
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
                                      {data.date
                                        ? moment(data.date).format("DD")
                                        : ""}
                                    </Typography>
                                    <Typography variant="span">
                                      {" "}
                                      {data.date
                                        ? moment(data.date).format("MMM")
                                        : ""}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    variant="p"
                                    className="holidayName"
                                  >
                                    {data.holiday_name || "N/A"}
                                  </Typography>
                                  <Typography
                                    variant="span"
                                    className="holidayWeekName"
                                  >
                                    {data.date
                                      ? moment(data.date).format("ddd")
                                      : ""}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <>
                            <TableRow key="no-holiday">
                              <TableCell style={{ textAlign: "center" }}>
                                No Holiday Found
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </Tabs>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={approvedLeavesModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={approvedLeavesModal}>
          <Box
            className="modalContainer md approved-leaves-modal"
            sx={{ overflow: "hidden" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography component="h2" className="modal-title">
                  Approved Leaves{" "}
                  <Box
                    component="span"
                    className="modal-subtitle"
                    sx={{ ml: 1 }}
                  >
                    {approvedLeavesData?.date || "N/A"}
                  </Box>
                </Typography>
                <Typography component="div" className="tag success">
                  Approved
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                color="error"
                onClick={approvedLeavesModalClose}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody" sx={{ px: 0, pt: 0 }}>
              <TableContainer className="table-striped userList scroll-y hvh-50">
                <Table stickyHeader aria-label="sticky simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="text-uppercase">
                        Name
                      </TableCell>
                      <TableCell align="left" className="text-uppercase">
                        Application type
                      </TableCell>
                      <TableCell align="center" className="text-uppercase">
                        Duration
                      </TableCell>
                      <TableCell align="center" className="text-uppercase">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(approvedLeavesData?.leaves || []).map((leave, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <Stack direction="row">
                            {leave?.user_details?.profile_image ? (
                              <Avatar
                                src={leave?.user_details?.profile_image || ""}
                              />
                            ) : leave?.user_details?.first_name ? (
                              <Avatar
                                sx={{ bgcolor: randColor }}
                                className="avtar"
                              >
                                {leave?.user_details?.first_name[0] || ""}
                              </Avatar>
                            ) : (
                              <Avatar
                                src={leave?.user_details?.profile_image || ""}
                              />
                            )}
                            <Box>
                              <Typography component="h6" className="avtarName">
                                {leave.user_details
                                  ? `${
                                      leave?.user_details?.honorific
                                        ? `${leave.user_details?.honorific} `
                                        : ""
                                    }${leave?.user_details?.first_name || ""} ${
                                      leave?.user_details?.middle_name
                                        ? `${leave.user_details.middle_name} `
                                        : ""
                                    }${leave?.user_details?.last_name || ""}`
                                  : "N/A"}
                              </Typography>
                              <Typography component="p" className="smallText">
                                {leave?.user_details?.designation || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Typography component="p" className="smallText">
                            {leave?.leave_type?.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography component="p" className="smallText">
                            {approvedLeavesData?.date || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label="Approved"
                            color="success"
                            variant="contained"
                            size="small"
                            className="chip success"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default ViewAll;
