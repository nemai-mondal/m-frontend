import React, { useContext, useState } from "react";
import Stack from "@mui/material/Stack";
import {
  AppBar,
  Badge,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { ImagePath } from "../../ImagePath";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthProvider";
import moment from "moment";
import LogoutModal from "../auth/LogoutModal";

const HeaderSection = () => {
  
  //getting user details
  const { user } = useContext(AuthContext);
  //state to store true and false from logout modal
  const [logoutModal, setLogoutModal] = useState(false);
  //function to close logout modal
  const logoutModalClose = () => {
    setLogoutModal(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Notification Toggle
  const [notificationActive, setNotificationActive] = useState(false);
  const notificationToggle = () => {
    setNotificationActive(!notificationActive);
  };

  return (
    <React.Fragment>
      <AppBar
        color="inherit"
        position="fixed"
        className="header"
        sx={{ paddingY: 1 }}
      >
        <Grid container spacing={0} sx={{ paddingLeft: 2 }}>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
              <Link to="/home">
                <img src={ImagePath.Logo} alt="MagicHR" className="logo" />
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <div className="header-right">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography className="date">
                  {moment().format("DD, MMM YYYY")}
                </Typography>
                {/* <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  className="btn-bg round4"
                  onClick={notificationToggle}
                  // onBlur={() =>setNotificationActive(false)}
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsRoundedIcon />
                  </Badge>
                </IconButton> */}
                {/* <List
                  className={`notification-box scroll-y ${
                    notificationActive ? "active" : ""
                  }`}
                >
                  <Link to="/add-time-sheet">
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <ImageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                    </ListItem>
                  </Link>
                  <Link>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <WorkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Work" secondary="Jan 7, 2014" />
                    </ListItem>
                  </Link>
                  <Link>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <WorkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Work" secondary="Jan 7, 2014" />
                    </ListItem>
                  </Link>
                  <Link>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <BeachAccessIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Vacation"
                        secondary="July 20, 2014"
                      />
                    </ListItem>
                  </Link>
                </List> */}
                <Box
                  title="Account settings"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginX: 3,
                  }}
                  className="userdropdown"
                >
                  <Stack sx={{ textAlign: "left" }}>
                    <Typography className="userName">
                      {`${user?.honorific ? `${user?.honorific} ` : ""}${
                        user?.first_name || ""
                      } ${user?.middle_name ? `${user.middle_name} ` : ""}${
                        user?.last_name || ""
                      }`}
                    </Typography>
                    <Typography className="userDeg">
                      {user?.designation?.name || "N/A"}
                    </Typography>
                  </Stack>
                  <Link onClick={handleClick} className="headerProfileBtn">
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        variant="text"
                        className="userDropDownBtn"
                        disableRipple
                      >
                        {user?.image ? (
                          <Avatar
                            src={user.image}
                            sx={{ width: 45, height: 45 }}
                            variant="rounded"
                          ></Avatar>
                        ) : (
                          <Avatar
                            sx={{ width: 45, height: 45 }}
                            variant="rounded"
                          ></Avatar>
                        )}
                      </IconButton>
                      <ArrowDropDownIcon />
                    </Stack>
                  </Link>
                </Box>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                className="profile-menu"
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
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Link to="/profile">
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    View Profile
                  </MenuItem>
                </Link>
                <MenuItem
                  onClick={() => {
                    setLogoutModal(true);
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <span>Logout</span>
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>
      </AppBar>

      {logoutModal && (
        <LogoutModal
          logoutModalClose={logoutModalClose}
          logoutModal={logoutModal}
        />
      )}
    </React.Fragment>
  );
};

export default HeaderSection;
