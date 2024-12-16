/* eslint-disable react/prop-types */
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
import React, { useCallback, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { refresh } from "@/redux/DepartmentSlice";
import { useDispatch } from "react-redux";
const DeleteDepartment = ({
  isDeleteOpen,
  closeDeleteDepartment,
  deleteDepartmentData,
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
      const res = await Axios.delete(
        `department/delete/${deleteDepartmentData.id}`
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteDepartment();
        toast.success(res.data.message);
        //dispatch to send request to redux store
        dispatch(refresh());
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.error( error.response.data.message)
        closeDeleteDepartment();
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
              {deleteDepartmentData.name || ""}
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
                onClick={closeDeleteDepartment}
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

export default DeleteDepartment;
