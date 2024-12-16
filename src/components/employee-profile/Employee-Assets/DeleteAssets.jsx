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
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
const DeleteAssets = ({
  isDeleteOpen,
  closeDeleteAssets,
  employeeDetails,
  getEmployeeDetails,
  deleteAssetsData,
}) => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete Assets
  const deleteData = async () => {
    setLoading(true);
    const force = 1;
    //storing in one object
    const payload = {
      user_id: employeeDetails.id,
      step: 14,
      key: "",
      id: deleteAssetsData.id,
    };
    try {
      const res = await Axios.post("user/update-profile?_method=put", payload);

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteAssets();
        toast.success("Assets deleted successfully");
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
                {deleteAssetsData?.assets_name || "N/A"}
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
                  onClick={closeDeleteAssets}
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

export default DeleteAssets;
