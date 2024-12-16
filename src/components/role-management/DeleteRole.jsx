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
import { refresh } from "@/redux/RoleSlice";
import { useDispatch } from "react-redux";

const DeleteRole = ({ isDeleteOpen, closeDeleteRole, deleteData }) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`role/delete/${deleteData.id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        toast.success(res.data.message);
        //dispatch to send request to redux store
        dispatch(refresh());
        closeDeleteRole();
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Unable to connect to the server"
      );
      //dispatch to send request to redux store
      dispatch(refresh());
      closeDeleteRole();
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
                {deleteData.name}
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
                  onClick={closeDeleteRole}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
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

export default DeleteRole;