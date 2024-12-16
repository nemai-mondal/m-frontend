import React, { useState } from "react";
import { refresh } from "@/redux/ClientSlice";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
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
const DeleteClient = ({
  isDeleteOpen,
  closeDeleteClient,
  deleteClientData,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //deleting data
  const deleteData = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`client/delete/${deleteClientData.id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteClient(false);
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.success(res.data.message);
        
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.error( error.response.data.message)
        closeDeleteClient();
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
              {deleteClientData.name||""}
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
                onClick={closeDeleteClient}
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

export default DeleteClient;
