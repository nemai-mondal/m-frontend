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
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useAxios } from "@/contexts/AxiosProvider";
// import { useDispatch } from "react-redux";

const DeleteResourceModal = ({
  isDeleteModalOpen,
  deleteModalData,
  closeDeleteModal,
  deleteResource,
  resources,
}) => {
  
  return (
    <>
      <Modal
        open={isDeleteModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isDeleteModalOpen}>
          <Box className="modalContainer xs delete-modal">
            <Box className="modalBody">
              <Typography
                textAlign="center"
                component="h4"
                className="modal-title"
              >
                Resource
              </Typography>
              <Typography textAlign="center" component="p" className="text">
              Are you want to delete this?
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  fullWidth
                  className=" text-capitalize"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() =>
                    deleteResource(deleteModalData?.index, resources)
                  }
                >
                  Delete
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DeleteResourceModal;
