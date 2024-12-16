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
import { useDispatch } from "react-redux";
import { refresh, setPage } from "@/redux/EmployeeListSlice";
const DeleteEmployee = ({ isDeleteOpen, closeDeleteEmployee, deleteData }) => {
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);
  const deleteEmployeeData = useCallback(async () => {
    const payload = {
      status: 0,
    };
    setLoading(true);
    try {
      const data = await Axios.post(
        `user/change-status/${deleteData.id}`,
        payload
      );

      if (data.status && data.status >= 200 && data.status < 300) {
        setLoading(false);
        closeDeleteEmployee();
        toast.success("Employee deactivated successfully");
        dispatch(setPage(1));
        dispatch(refresh());
      }
    } catch (error) {
      setLoading(false);
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
                {`${deleteData?.honorific ? `${deleteData?.honorific} ` : ""}${
                  deleteData?.first_name || ""
                } ${
                  deleteData?.middle_name ? `${deleteData.middle_name} ` : ""
                }${deleteData?.last_name || ""}`}
              </Typography>
              <Typography textAlign="center" component="p" className="text">
                Are you want to deactivate this employee?
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  fullWidth
                  className=" text-capitalize"
                  onClick={closeDeleteEmployee}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={deleteEmployeeData}
                  loading={loading}
                >
                  Deactivate
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DeleteEmployee;
