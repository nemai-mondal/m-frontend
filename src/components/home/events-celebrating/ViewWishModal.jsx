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
import ClearIcon from "@mui/icons-material/Clear";
const ViewWishModal = ({ isViewOpen, closeViewWish, viewWishData }) => {
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
                Your Wish
                {/* {`${
                  viewWishData.user?.honorific
                    ? `${viewWishData.user?.honorific} `
                    : ""
                }${viewWishData.user?.first_name || ""} ${
                  viewWishData.user?.middle_name
                    ? `${viewWishData.user.middle_name} `
                    : ""
                }${viewWishData.user?.last_name || ""}`} */}
              </Typography>
              {/* <Typography component="p" className="modal-subtitle">
                {`${
                  viewWishData?.created_at
                    ? moment(viewWishData.created_at).format("DD MMM YYYY")
                    : "N/A"
                }`}
              </Typography> */}
            </Box>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeViewWish}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody">
            <Stack spacing={2}>
              <Typography component="p">
                {viewWishData?.message || "N/A"}
              </Typography>
            </Stack>
          </Box>
          <Box className="modalFooter">
            <Stack spacing={2} direction="row" justifyContent="start">
              {viewWishData?.user?.profile_image ? (
                <Avatar
                  alt="Remy Sharp"
                  src={viewWishData.user.profile_image}
                />
              ) : viewWishData?.user?.first_name ? (
                <Avatar sx={{ bgcolor: randColor }} className="avtar">
                  {viewWishData?.user?.first_name[0] || ""}
                </Avatar>
              ) : (
                <Avatar alt="Remy Sharp" className="avtar" />
              )}
              <Box>
                <Typography component="h6" sx={{ paddingTop: '8px' }}>
                  {`${
                    viewWishData?.user?.honorific
                      ? `${viewWishData?.user?.honorific} `
                      : ""
                  }${viewWishData?.user?.first_name || ""} ${
                    viewWishData?.user?.middle_name
                      ? `${viewWishData?.user.middle_name} `
                      : ""
                  }${viewWishData?.user?.last_name || ""}
                  `}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ViewWishModal;
