import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { refresh } from "@/redux/ProjectSlice";
import "react-international-phone/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const DeleteProject = ({
  isDeleteOpen,
  closeDeleteProject,
  deleteProjectData,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete data
  const deleteData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Axios.delete(
        `project/delete/${deleteProjectData.id}`
      );

      if (data.status && data.status >= 200 && data.status < 300) {
        setLoading(false);
        closeDeleteProject();
        toast.success("Project deleted successfully");
        //dispatch to send request to redux store
        dispatch(refresh());
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        closeDeleteProject();
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={isDeleteOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isDeleteOpen}>
        <Box className="modalContainer xs delete-modal">
          <Box className="modalBody">
            <Typography
              textAlign="center"
              component="h4"
              className="modal-title"
            >
              {deleteProjectData.name}
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
                className="text-capitalize"
                onClick={closeDeleteProject}
              >
                Cancel
              </Button>
              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                color="error"
                onClick={deleteData}
                loading={loading}
              >
                Delete
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteProject;
