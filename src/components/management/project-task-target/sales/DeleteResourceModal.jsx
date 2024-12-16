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
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteResourceModal = ({
  isDeleteModalOpen,
  deleteModalData,
  closeDeleteModal,
  deleteResource,
  resources,
}) => {
  // const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete quote
  const deleteData = async (index, resources) => {
    setLoading(true);
    try {
      deleteResource(index, resources);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        closeDeleteModal();
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

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
                  onClick={() => deleteData(deleteModalData?.index, resources)}
                  loading={loading}
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
