/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Box,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import "./punch.css";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addPunchInOutDetails } from "@/redux/PunchInOutSlice";

const PunchInOutModal = ({ isPunchInOutOpen, closePunchInOutModal, user }) => {
  const { Axios } = useAxios();
  //to dispatch event to the redux store
  const dispatch = useDispatch();
  //state to run clock
  const [timer, setTimer] = useState(new Date());
  //function to get attendance list ad storing in redux store
  const getActivitiesList = async () => {
    try {
      const data = await Axios.get("/timelog/attendance");

      if (data.status && data.status === 200) {
        if ((data?.data?.data || []).length > 0) {
          dispatch(addPunchInOutDetails(data?.data?.data || []));
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //sending punch in/out data to the api
  const punchInOut = async (data) => {
    let payload = {};
    //storing onlinein data to send
    if (data === "onlinein") {
      payload = {
        user_id: user.id,
        activity: "shift start",
        terminal: "ONLINEIN",
      };
    }
    closePunchInOutModal();
    try {
      const data = await Axios.post("/timelog/create", payload);

      if (data.status && data.status >= 200 && data.status <= 300) {
        getActivitiesList();
        user.shift_started = true;
        toast.success("Punch In Successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //useeffect to run clock
  useEffect(() => {
    const time = setInterval(() => setTimer(new Date()), 1000);
    return () => {
      clearInterval(time);
    };
  }, []);
  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={isPunchInOutOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isPunchInOutOpen}>
        <Box className="modalContainer sm punchInOut" sx={{ padding: 2 }}>
          <Box className="modalBody">
            <Typography variant="h2" textAlign="center">
              {moment().format("HH:MM:SS") >= "12:00:00" &&
              moment().format("HH:MM:SS") < "17:00:00"
                ? "Good Afternoon"
                : "" ||
                  (moment().format("HH:MM:SS") >= "17:00:00" &&
                    moment().format("HH:MM:SS") < "20:00:00")
                ? "Good Evening"
                : "" ||
                  (moment().format("HH:MM:SS") >= "20:00:00" &&
                    moment().format("HH:MM:SS") < "04:00:00")
                ? "Good Night"
                : "" ||
                  (moment().format("HH:MM:SS") >= "04:00:00" &&
                    moment().format("HH:MM:SS") < "12:00:00")
                ? "Good Morning"
                : ""}
            </Typography>
            <Typography variant="h3" textAlign="center">
              {`${user?.honorific ? `${user?.honorific} ` : ""}${
                user?.first_name || ""
              } ${user?.middle_name ? `${user.middle_name} ` : ""}${
                user?.last_name || ""
              }`}
            </Typography>
            <Typography
              variant="p"
              textAlign="center"
              className="role"
              sx={{ width: "100%", display: "block" }}
            >
              {user?.designation?.name || "N/A"}
            </Typography>
            <Typography variant="h4" textAlign="center" className="time">
              {moment(timer).format("hh:mm:ss A")}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                color="success"
                variant="contained"
                className="success-btn text-capitalize"
                onClick={() => {
                  punchInOut("onlinein");
                }}
              >
                Punch In
              </Button>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              className="shift-date"
              sx={{ borderTop: "none !important", marginTop: 3 }}
            >
              <Typography variant="p" className="shift">
                <strong>Shift Timing :</strong>{" "}
                {(user?.shift || []).length > 0
                  ? `${user?.shift[0]?.shift_start}`
                  : "N/A"}
                {user?.shift?.length > 0
                  ? `${" to " + user?.shift[0]?.shift_end}`
                  : ""}
              </Typography>
              <Typography variant="p" className="date">
                {moment().format("dddd DD, MMM YYYY")}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PunchInOutModal;
