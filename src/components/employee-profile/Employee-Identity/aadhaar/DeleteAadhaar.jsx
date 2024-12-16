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
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
const DeleteAadhaar = ({
  isDeleteAadhaarOpen,
  closeDeleteAadhaar,
  getEmployeeDetails,
  employeeDetails,
}) => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete aadhaar
  const deleteData = async () => {
    setLoading(true);
    const force = 1;
    const payload = {
      user_id: employeeDetails.id,
      step: 9,
      form: 1,
      key: "delete",
      id: employeeDetails.adhaar.id,
    };
    try {
      const res = await Axios.post("user/update-profile?_method=put", payload);

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteAadhaar();
        toast.success("Aadhaar deleted successfully");
        getEmployeeDetails(employeeDetails.id, force);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  return (
    <>
      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={isDeleteAadhaarOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isDeleteAadhaarOpen}>
          <Box className="modalContainer xs delete-modal">
            <Box className="modalBody">
              <Typography
                textAlign="center"
                component="h4"
                className="modal-title"
              >
                {employeeDetails.adhaar?.name || "N/A"}
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
                  onClick={closeDeleteAadhaar}
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

export default DeleteAadhaar;
