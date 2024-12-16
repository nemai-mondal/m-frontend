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
import { useAxios } from "@/contexts/AxiosProvider";
import { useDispatch } from "react-redux";

const DeleteDocumentModal = ({
  isDeleteModalOpen,
  deleteModalData,
  closeDeleteModal,
}) => {
  const { Axios } = useAxios();
  const dispatch = useDispatch();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete quote
  const deleteData = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(
        `project/document/delete/${deleteModalData?.id}`
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        toast.success(res.data.message);
        closeDeleteModal();
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        toast.error(error.response?.data?.message);
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
                Are you want to delete this permanently?
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
                  onClick={() => deleteData(deleteModalData?.id)}
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

export default DeleteDocumentModal;
