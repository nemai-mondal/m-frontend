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
import React, { useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refresh, setDepartmentName } from "@/redux/ProjectSlice";
const DeleteProject = ({
  isDeleteOpen,
  deleteProjectData,
  closeDeleteProject,
}) => {
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete data
  const deleteData = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`project/delete/${deleteProjectData.id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        closeDeleteProject();
        setLoading(false);
        dispatch(setDepartmentName("marketing"));
        dispatch(refresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(setDepartmentName("marketing"));
        dispatch(refresh());
        closeDeleteProject();
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
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
              <p>{`${deleteProjectData?.name || "N/A"}`}</p>
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
