import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Tooltip,
  Menu,
  ListItemIcon,
  Button,
} from "@mui/material";
import { ImagePath } from "@/ImagePath";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./hr-announcement.css";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import AddHrAnnouncement from "./AddHrAnnouncement";
import EditHrAnnouncement from "./EditHrAnnouncement";
import DeleteHrAnnouncement from "./DeleteHrAnnouncement";
import ViewHrAnnouncement from "./ViewHrAnnouncement";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "@/contexts/AuthProvider";
import { deepPurple } from "@mui/material/colors";
const HR_Announcement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  // const [loading, setLoading] = useState(true);
  const { Axios } = useAxios();
  //state to open edit modal
  const [isEditOpen, setIsEditOpen] = useState("");
  // state to open view modal
  const [isViewOpen, setIsViewOpen] = useState("");
  //state to open add modal
  const [isAddOpen, setIsAddOpen] = useState("");
  //state to open delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  //state to store edit announcement data
  const [editAnnouncementData, setEditAnnouncementData] = useState("");
  //state to store delete announcement data
  const [deleteAnnouncementData, setDeleteAnnouncementData] = useState("");
  //state to store view announcement data
  const [viewAnnouncementData, setViewAnnouncementData] = useState("");
  //function to open add announcement modal
  const openAddAnnouncement = () => {
    setIsAddOpen(true);
  };
  //function to close add announcement modal
  const closeAddAnnouncement = () => {
    setIsAddOpen(false);
  };
  //function to open edit announcement modal and store edit announcement data
  const openEditAnnouncement = (data) => {
    setIsEditOpen(true);
    setEditAnnouncementData(data);
  };
  //function to close edit announcement modal
  const closeEditAnnouncement = () => {
    setIsEditOpen(false);
  };
  //function to open delete announcement modal and store delete announcement data
  const openDeleteAnnouncement = (data) => {
    setIsDeleteOpen(true);
    setDeleteAnnouncementData(data);
  };
  //function to close delete announcement modal
  const closeDeleteAnnouncement = () => {
    setIsDeleteOpen(false);
  };
  //function to open view announcement modal and store view announcement data
  const openViewAnnouncement = (data) => {
    setIsViewOpen(true);
    setViewAnnouncementData(data);
  };
  //function to close view announcement modal
  const closeViewAnnouncement = () => {
    setIsViewOpen(false);
  };
  //state to store announcement details
  const [announcement, setAnnouncement] = useState([]);
  const [randomColor, setRandomColor] = useState([]);
  //fetching announcement data
  const fetchAnnouncement = async () => {
    try {
      const res = await Axios.get(`hr-announcement/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setAnnouncement(res.data?.data || []);
        if ((res?.data?.data || []).length > 0) {
          const newColors = (res?.data?.data || []).map(() => {
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
  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const [sendSingleData, setSendSingleData] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, data) => {
    setSendSingleData(data);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>HR Announcement</span>
          {hasPermission("hr_announcement_create") && (
            <Button
              variant="outlined"
              size="small"
              className="cardHeaderBtn"
              onClick={openAddAnnouncement}
              startIcon={<AddIcon />}
            >
              {" "}
              ADD
            </Button>
          )}
        </Stack>
        <CardContent sx={{ p: 2 }} className="cardheight scroll-y">
          <TableContainer className="userList">
            <Table aria-label="simple table">
              <TableBody>
                {(announcement || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No Announcement...
                    </TableCell>
                  </TableRow>
                ) : (
                  (announcement || []).map((data, index) => {
                    return (
                      <React.Fragment key={data.id}>
                        <TableRow>
                          <TableCell align="left">
                            <Stack direction="row">
                              {data?.user_details?.image ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={data.user_details.image}
                                  className="avtar"
                                />
                              ) : data?.user_details?.first_name ? (
                                <Avatar
                                  sx={{ bgcolor: randomColor[index] }}
                                  className="avtar"
                                >
                                  {data?.user_details?.first_name[0]||""}
                                </Avatar>
                              ) : (
                                <Avatar alt="Remy Sharp" className="avtar" />
                              )}

                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {data?.title || "N/A"}
                                </Typography>
                                <Typography component="p" className="avtarDeg">
                                  {`${
                                    data?.event_date
                                      ? moment(data.event_date).format(
                                          "DD MMM YYYY"
                                        )
                                      : "N/A"
                                  } ${
                                    data.event_start_time
                                      ? moment(
                                          data?.event_start_time,
                                          "HH:mm:ss"
                                        ).format("hh:mm:ss a")
                                      : ""
                                  }`}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Tooltip title="Account setting">
                                <IconButton
                                  onClick={(e) => {
                                    handleClick(e, data);
                                  }}
                                  size="small"
                                  sx={{ ml: 2 }}
                                  aria-controls={
                                    open ? "account-menu" : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={open ? "true" : undefined}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        <MenuItem
          className={"threedotsmenu "}
          onClick={() => {
            openViewAnnouncement(sendSingleData);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>{" "}
          View
        </MenuItem>

        {hasPermission("hr_announcement_update") && (
          <MenuItem
            className={"threedotsmenu "}
            onClick={() => {
              openEditAnnouncement(sendSingleData);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>{" "}
            Edit
          </MenuItem>
        )}
        {hasPermission("hr_announcement_delete") && (
          <MenuItem
            className={"threedotsmenu "}
            onClick={() => {
              openDeleteAnnouncement(sendSingleData);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
      </Menu>

      {isAddOpen && (
        <AddHrAnnouncement
          isAddOpen={isAddOpen}
          closeAddAnnouncement={closeAddAnnouncement}
          fetchAnnouncement={fetchAnnouncement}
        />
      )}
      {isEditOpen && (
        <EditHrAnnouncement
          isEditOpen={isEditOpen}
          closeEditAnnouncement={closeEditAnnouncement}
          editAnnouncementData={editAnnouncementData}
          fetchAnnouncement={fetchAnnouncement}
        />
      )}
      {isDeleteOpen && (
        <DeleteHrAnnouncement
          isDeleteOpen={isDeleteOpen}
          closeDeleteAnnouncement={closeDeleteAnnouncement}
          deleteAnnouncementData={deleteAnnouncementData}
          fetchAnnouncement={fetchAnnouncement}
        />
      )}
      {isViewOpen && (
        <ViewHrAnnouncement
          isViewOpen={isViewOpen}
          closeViewAnnouncement={closeViewAnnouncement}
          viewAnnouncementData={viewAnnouncementData}
          fetchAnnouncement={fetchAnnouncement}
        />
      )}
    </React.Fragment>
  );
};

export default HR_Announcement;
