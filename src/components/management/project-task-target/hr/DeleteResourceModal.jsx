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
const DeleteModal = ({
  isDeleteModalOpen,
  deleteModalData,
  closeDeleteModal,
  deleteResource,
  addAssignResource,
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
                    deleteResource(deleteModalData?.index, addAssignResource)
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

export default DeleteModal;
