import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Avatar,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Modal,
  Fade,
  Box,
  Typography,
  Backdrop,
  Stack,
  IconButton,
  Chip,
  TableHead,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "./holidays-leaves.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import LeaveSkeleton from "./LeaveSkeleton";
import { AuthContext } from "@/contexts/AuthProvider";

const Leaves = () => {
  const [randomColor, setRandomColor] = useState([]);
  //getting user from usecontext
  const { user } = useContext(AuthContext);
  //state to show loading animation
  const [loading, setLoading] = useState(true);
  //axios to send data to api
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
  //state to store upcoming leave list
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  //function to fet upcoming leaves
  const getUpcomingLeaves = async () => {
    const payload = {
      days: 7,
      leave_status: "approved",
    };
    try {
      const res = await Axios.post("/leave-application/dashboard", payload);
      if (res.status && res.status >= 200 && res.status < 300) {
        setUpcomingLeaves(res?.data?.data || []);
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
    } finally {
      setLoading(false);
    }
  };

  //useeffect to call function when component mount
  useEffect(() => {
    getUpcomingLeaves();
  }, []);

  if (loading) {
    return <LeaveSkeleton />;
  }

  return (
    <React.Fragment>
      <TableContainer className="table-striped">
        <Table aria-label="simple table">
          <TableBody>
            {Object.keys(upcomingLeaves || {}).length != 0 ? (
              Object.entries(upcomingLeaves||{}).map(([date, leaves], index) => (
                <TableRow key={index}>
                  <TableCell align="left">{date || "N/A"}</TableCell>
                  <AvatarGroup max={4} className="align-center">
                    {(leaves||[]).length > 0
                      ? leaves
                          .slice(0, Math.min(leaves.length, 5))
                          .map((leave, innerIndex) => (
                            <TableCell align="right" key={innerIndex}>
                              <Link to="#" className="avatar-group sm">
                                <Tooltip
                                  title={
                                    leave?.user_details
                                      ? `${
                                          leave?.user_details?.honorific
                                            ? `${leave.user_details?.honorific} `
                                            : ""
                                        }${
                                          leave?.user_details?.first_name || ""
                                        } ${
                                          leave?.user_details?.middle_name
                                            ? `${leave.user_details.middle_name} `
                                            : ""
                                        }${
                                          leave?.user_details?.last_name || ""
                                        }`
                                      : "N/A"
                                  }
                                  arrow
                                  onClick={() => {
                                    approvedLeavesModalOpen(leaves, date);
                                  }}
                                >
                                  {leave?.user_details?.profile_image ? (
                                    <Avatar
                                      src={
                                        leave?.user_details?.profile_image || ""
                                      }
                                    />
                                  ) : leave?.user_details?.first_name ? (
                                    <Avatar
                                      sx={{ bgcolor: randomColor[index] }}
                                      className="avtar"
                                    >
                                      {leave?.user_details?.first_name[0] || ""}
                                    </Avatar>
                                  ) : (
                                    <Avatar
                                      src={
                                        leave?.user_details?.profile_image || ""
                                      }
                                    />
                                  )}
                                </Tooltip>
                              </Link>
                            </TableCell>
                          ))
                      : ""}
                    {(leaves || []).length > 5 ? (
                      <TableCell>
                        <Link to="#" className="avatar-group sm">
                          {/* <AvatarGroup
                              max={4}
                              className="align-center"
                              onClick={() => {
                                approvedLeavesModalOpen(leaves, date);
                              }}
                            > */}
                          <Tooltip
                            title="See more"
                            arrow
                            onClick={() => {
                              approvedLeavesModalOpen(leaves, date);
                            }}
                          >
                            <Avatar>{`+${leaves.length - 3}`}</Avatar>
                          </Tooltip>
                          {/* </AvatarGroup> */}
                        </Link>
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </AvatarGroup>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>
                  {"No leave found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
                                sx={{ bgcolor: randomColor[index] }}
                                className="avtar"
                              >
                                {leave?.user_details?.first_name[0]||""}
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

export default Leaves;
