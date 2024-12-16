import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { refresh } from "@/redux/HolidaySlice";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
const DeleteHoliday = ({
  isDeleteOpen,
  closeDeleteHoliday,
  deleteHolidayData,
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
      const res = await Axios.delete(`holiday/delete/${deleteHolidayData.id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteHoliday(false);
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.error(error.response.data.message)
        closeDeleteHoliday(false);
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
              <p>{`${deleteHolidayData.holiday_name||""}`}</p>

              <p style={{ fontSize: "12px" }}>
                <span>
                  {`(${moment(deleteHolidayData.date_from).format(
                    "DD-MM-YYYY"
                  )}`}
                </span>

                <span>
                  {moment(deleteHolidayData.date_from).isSame(
                    moment(deleteHolidayData.date_to)
                  ) ? (
                    ")"
                  ) : (
                    <span>
                      {` to ${moment(deleteHolidayData.date_to).format(
                        "DD-MM-YYYY"
                      )})`}{" "}
                    </span>
                  )}
                </span>
              </p>
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
                onClick={closeDeleteHoliday}
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

export default DeleteHoliday;
