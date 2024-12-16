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
import { refresh } from "@/redux/AmendmentSlice";
import { useDispatch } from "react-redux";
const DeletAmendment = ({
  isDeleteOpen,
  closeDeleteAmendment,
  deleteAmendmentData,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete amendment
  const deleteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(
        `amendment/delete/${deleteAmendmentData.id}`
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteAmendment();
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.error( error.response.data.message)
        closeDeleteAmendment();
      }
      setLoading(false);
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
              {deleteAmendmentData?.name || ""}
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
                onClick={closeDeleteAmendment}
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

export default DeletAmendment;
