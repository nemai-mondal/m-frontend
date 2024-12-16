/* eslint-disable react/prop-types */
import {
  Avatar,
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { ImagePath } from "@/ImagePath";
import ClearIcon from "@mui/icons-material/Clear";
import { deepPurple } from "@mui/material/colors";
const ViewHrAnnouncement = ({
  isViewOpen,
  closeViewAnnouncement,
  viewAnnouncementData,
}) => {
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
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={isViewOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isViewOpen}>
        <Box className="modalContainer md hr-annoucement-modal">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Box>
              <Typography component="h2" className="modal-title">
                {viewAnnouncementData?.title || "N/A"}
              </Typography>
              <Typography component="p" className="modal-subtitle">
                {viewAnnouncementData?.event_date &&
                viewAnnouncementData?.event_start_time &&
                viewAnnouncementData.event_end_time
                  ? `${moment(viewAnnouncementData.event_date).format(
                      "DD MMM YYYY"
                    )},${moment(
                      viewAnnouncementData.event_start_time,
                      "HH:mm:ss"
                    ).format("hh:mm A")} to ${moment(
                      viewAnnouncementData.event_end_time,
                      "HH:mm:ss"
                    ).format("hh:mm A")}`
                  : "N/A"}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeViewAnnouncement}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody">
            <Stack spacing={2}>
              <Typography component="p">
                {viewAnnouncementData?.description || "N/A"}
              </Typography>
            </Stack>
          </Box>
          <Box className="modalFooter">
            <Stack spacing={2} direction="row" justifyContent="start">
              {viewAnnouncementData?.user_details?.image ? (
                <Avatar
                  alt="Remy Sharp"
                  src={viewAnnouncementData.user_details.image}
                />
              ) : viewAnnouncementData?.user_details?.first_name ? (
                <Avatar sx={{ bgcolor: randColor }} className="avtar">
                  {viewAnnouncementData?.user_details?.first_name[0]||""}
                </Avatar>
              ) : (
                <Avatar alt="Remy Sharp" className="avtar" />
              )}
              <Box>
                <Typography component="h6">
                  {`${
                    viewAnnouncementData?.user_details?.honorific
                      ? `${viewAnnouncementData?.user_details?.honorific} `
                      : ""
                  }${viewAnnouncementData?.user_details?.first_name || ""} ${
                    viewAnnouncementData?.user_details?.middle_name
                      ? `${viewAnnouncementData?.user_details.middle_name} `
                      : ""
                  }${viewAnnouncementData?.user_details?.last_name || ""}-${
                    viewAnnouncementData?.user_details?.employee_id || ""
                  }`}
                </Typography>

                <Typography component="p">
                  {viewAnnouncementData?.designation_name || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ViewHrAnnouncement;
