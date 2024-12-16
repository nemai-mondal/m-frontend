import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";

const LogoutModal = ({ logoutModalClose, logoutModal }) => {
  //getting logout function
  const { logout } = useContext(AuthContext);

  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={logoutModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={logoutModal}>
        <Box className="modalContainer xs delete-modal">
          <Box className="modalBody">
            <Typography
              textAlign="center"
              component="h4"
              className="modal-title"
            >
              Confirmation
            </Typography>
            <Typography textAlign="center" component="p" className="text">
              Do you want to logout?
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                color="primary"
                variant="outlined"
                size="large"
                fullWidth
                className=" text-capitalize"
                onClick={() => {
                  logoutModalClose();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                color="error"
                className=" text-capitalize"
                onClick={logout}
              >
                Logout
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default LogoutModal;
