import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Stack, TextField, Typography, Box } from "@mui/material";
import "./punch.css";
import moment from "moment";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addPunchInOutDetails } from "@/redux/PunchInOutSlice";
const PunchInOut = () => {
  //getting user from usecontext
  const { user } = useContext(AuthContext);

  const { Axios } = useAxios();
  //to dispatch event to the redux store
  const dispatch = useDispatch();
  //state to run clock
  const [timer, setTimer] = useState(new Date());
  //state to store remarks
  const [remarks, setRemarks] = useState("");
  //function to get attendance details and storing in redux store

  const getActivitiesList = async () => {
    try {
      const data = await Axios.get("/timelog/attendance");

      if (data.status && data.status === 200) {
        if ((data?.data?.data || [])?.length > 0) {
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
  const punchInOut = useCallback(
    async (data) => {
      let payload = {};
      //storing onlinein data to send
      if (data === "onlinein") {
        payload = {
          user_id: user.id,
          activity: "shift start",
          terminal: "ONLINEIN",
          messages: remarks,
        };
        //storing onlineout data to send
      } else {
        payload = {
          user_id: user.id,
          activity: "shift end",
          terminal: "ONLINEOUT",
          messages: remarks,
        };
      }
      try {
        const res = await Axios.post("/timelog/create", payload);

        if (res.status && res.status >= 200 && res.status <= 300) {
          setRemarks("");
          getActivitiesList();
          user.shift_started = true;

          if (data == "onlinein") {
            toast.success("Punch In Successfully");
          } else if (data == "onlineout") {
            toast.success("Punch Out Successfully");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
    [remarks]
  );
  //useeffect to run clock
  useEffect(() => {
    const time = setInterval(() => setTimer(new Date()), 1000);
    return () => {
      clearInterval(time);
    };
  }, []);
  // if (!user) {
  //   return <div>Loading...</div>;
  // }
  return (
    <React.Fragment>
      <Card
        variant="outlined"
        className="cardBox punchInOut"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
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
            <Button
              color="error"
              variant="contained"
              className="error-btn text-capitalize"
              onClick={() => {
                punchInOut("onlineout");
              }}
            >
              Punch Out
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <TextField
              id="add-notes"
              placeholder="Remarks"
              variant="outlined"
              size="small"
              value={remarks}
              className="addnote"
              onChange={(e) => {
                setRemarks(e.target.value);
              }}
            />
          </Stack>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          className="shift-date"
        >
          <Typography variant="p" className="shift">
            <strong>Shift Timing :</strong>{" "}
            {(user?.shift || [])?.length > 0
              ? `${user?.shift[0]?.shift_start}`
              : "N/A"}
            {(user?.shift || [])?.length > 0
              ? `${" to " + user?.shift[0]?.shift_end}`
              : ""}
          </Typography>
          <Typography variant="p" className="date">
            {moment().format("dddd DD, MMM YYYY")}
          </Typography>
        </Stack>
      </Card>
    </React.Fragment>
  );
};

export default PunchInOut;
