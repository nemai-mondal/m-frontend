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
import { refresh } from "@/redux/ActivitySlice";
import { useDispatch } from "react-redux";
const DeleteLeavePolicy = ({
  isDeleteModalOpen,
  closeDeleteModal,
  deleteLeavePloicyData,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);
  const deleteData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Axios.delete(
        `activity/delete/${deleteActivityData.id}`
      );

      if (data.status && data.status >= 200 && data.status < 300) {
        setLoading(false);
        closeDeleteActivity();
        toast.success("Activity deleted successfully");
        //dispatch to send request to redux store
        dispatch(refresh());
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        closeDeleteActivity();
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  return (
    <>
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
                {deleteActivityData.name}
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
                  onClick={closeDeleteActivity}
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
    </>
  );
};

export default DeleteLeavePolicy;
