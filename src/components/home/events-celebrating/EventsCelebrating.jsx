import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Box,
  Button,
  Modal,
  Fade,
  Backdrop,
  TextField,
} from "@mui/material";
import "./events-celebrating.css";
import { ImagePath } from "@/ImagePath";
import { AuthContext } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useFormik } from "formik";
import { EventsCelebratingSchema } from "@/validations/EventsCelebratingSchema";
import { LoadingButton } from "@mui/lab";
import { useAxios } from "@/contexts/AxiosProvider";
import { mapValues } from "lodash";
const EventsCelebrating = () => {
  // Function to trim all values
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);
  //to get user Details
  const { user } = useContext(AuthContext);
  //state to store Events Celebrating List
  const [eventsCelebratingList, setEventsCelebratingList] = useState([]);
  //state to store wish message
  const [wishDataForModal, setWishDataForModal] = useState("");
  //state to open and close birthday modal
  const [birthdayWishModal, setBirthdayWishModal] = useState(false);
  //state to open and close work Anniversary modal
  const [workAnniversaryWishModal, setWorkAnniversaryWishModal] =
    useState(false);

  const birthdayWishModalOpen = (data) => {
    setWishDataForModal(data); //storing user data to whom we are going to send wish
    setBirthdayWishModal(true);
  };

  const birthdayWishModalClose = () => {
    setBirthdayWishModal(false);
    resetForm(); // after modal close user input on modal will be reset
  };
  const workAnniversaryWishModalOpen = (data) => {
    setWishDataForModal(data); //storing user data to whom we are going to send wish
    setWorkAnniversaryWishModal(true);
  };

  const workAnniversaryWishModalClose = () => {
    setWorkAnniversaryWishModal(false);
    resetForm(); // after modal close user input on modal will be reset
  };
  const [randomColor, setRandomColor] = useState([]);
  // function to get event celebration Details from API
  const fetchCelebratingEvents = useCallback(async () => {
    try {
      const res = await Axios.get("user/celebration");

      if (res.status && res.status >= 200 && res.status < 300) {
        const todaysDate = moment().format("MM-DD");
        setEventsCelebratingList(res.data?.data[todaysDate] || []);
        if ((res.data?.data[todaysDate] || []).length > 0) {
          const newColors = (res.data?.data[todaysDate] || []).map(() => {
            return (
              "#" +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()
            );
          });
          setRandomColor(newColors);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  // function to handle error,store user input and sending data to the API
  const {
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    values,
    resetForm,
  } = useFormik({
    initialValues: { message: "" },
    validationSchema: EventsCelebratingSchema,
    onSubmit: async () => {
      const payload = trimAllValues({
        wish_from_id: user.id,
        wish_to_id: wishDataForModal.user_id,
        message: values.message,
      });
      try {
        setLoading(true);
        const res = await Axios.post("/event-wish/create", payload);
        if (res.status && res.status >= 200 && res.status < 300) {
          workAnniversaryWishModalClose();
          setLoading(false);
          birthdayWishModalClose();
          toast.success("Wish Message Sent Successfully");
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
  });
  // useeffect to fetch event celebration data when component will be mount
  useEffect(() => {
    fetchCelebratingEvents();
  }, []);

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Celebrating Events</span>
          {/* <Button variant="outlined" size="small" className="cardHeaderBtn">
            View all
          </Button> */}
        </Stack>
        <CardContent sx={{ p: 2 }} className="cardheight scroll-y">
          <TableContainer className="userList">
            <Table aria-label="simple table">
              <TableBody>
                {(eventsCelebratingList || []).length > 0 ? (
                  eventsCelebratingList.map((data, index) => {
                    if (data.event === "Birthday") {
                      return (
                        <TableRow key={index}>
                          <TableCell align="left">
                            <Stack direction="row">
                              {data?.user?.image ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={data.user.image}
                                  className="avtar"
                                />
                              ) : data?.user?.first_name ? (
                                <Avatar
                                  sx={{ bgcolor: randomColor[index] }}
                                  className="avtar"
                                >
                                  {data?.user?.first_name[0] || ""}
                                </Avatar>
                              ) : (
                                <Avatar alt="Remy Sharp" className="avtar" />
                              )}

                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {`${
                                    data?.user?.honorific
                                      ? `${data?.user?.honorific} `
                                      : ""
                                  }${data?.user?.first_name || ""} ${
                                    data?.user?.middle_name
                                      ? `${data?.user.middle_name} `
                                      : ""
                                  }${data?.user?.last_name || ""}`}
                                </Typography>
                                <Typography component="p" className="blueText">
                                  <img src={ImagePath.birthday} alt="" />{" "}
                                  Birthday
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            {data?.user?.id !== user?.id ? (
                              <Button
                                variant="outlined"
                                size="small"
                                className="cardHeaderBtn"
                                onClick={() => {
                                  birthdayWishModalOpen(data);
                                }}
                              >
                                Wish
                              </Button>
                            ) : (
                              ""
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (data.event === "Work Anniversary") {
                      return (
                        <TableRow key={index}>
                          <TableCell align="left">
                            <Stack direction="row">
                              {data?.user?.image ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={data.user.image}
                                  className="avtar"
                                />
                              ) : data?.user?.first_name ? (
                                <Avatar
                                  sx={{ bgcolor: randomColor[index] }}
                                  className="avtar"
                                >
                                  {data?.user?.first_name[0] || ""}
                                </Avatar>
                              ) : (
                                <Avatar alt="Remy Sharp" className="avtar" />
                              )}
                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {`${
                                    data?.user?.honorific
                                      ? `${data?.user?.honorific} `
                                      : ""
                                  }${data?.user?.first_name || ""} ${
                                    data?.user?.middle_name
                                      ? `${data?.user.middle_name} `
                                      : ""
                                  }${data?.user?.last_name || ""}`}
                                </Typography>
                                <Typography component="p" className="pinkText">
                                  <img src={ImagePath.workAnniversary} alt="" />{" "}
                                  Work Anniversary
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            {data?.user?.id !== user?.id ? (
                              <Button
                                variant="outlined"
                                size="small"
                                className="cardHeaderBtn"
                                onClick={() => {
                                  workAnniversaryWishModalOpen(data);
                                }}
                              >
                                Wish
                              </Button>
                            ) : (
                              ""
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                      No Event Celebration
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={birthdayWishModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        onClose={birthdayWishModalClose}
      >
        <Fade in={birthdayWishModal}>
          <Box
            className="modalContainer md whish-modal scroll-y"
            sx={{ overflow: "hidden" }}
          >
            <Box className="modalBody" sx={{ p: 0 }}>
              <img src={ImagePath.birthdayWishBG} alt="" className="w-100" />

              <Box
                className="whish-content"
                sx={{ py: 3, px: 5, textAlign: "center" }}
              >
                {wishDataForModal?.user?.image ? (
                  <img
                    src={wishDataForModal.user.image}
                    alt=""
                    className="whishDP"
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    className="whishDP"
                    sx={{ mx: "auto" }}
                  />
                )}
                <Typography component="h4">
                  Today is{" "}
                  {
                    <strong>
                      {`${
                        wishDataForModal?.user?.honorific
                          ? `${wishDataForModal?.user?.honorific} `
                          : ""
                      }${wishDataForModal?.user?.first_name || ""} ${
                        wishDataForModal?.user?.middle_name
                          ? `${wishDataForModal?.user.middle_name} `
                          : ""
                      }${wishDataForModal?.user?.last_name || ""}`}
                    </strong>
                  }{" "}
                  Birthday
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                  Express warm wishes on special day,conveying heartfelt joy and
                  happiness. Share your genuine sentiments to make birthday
                  memorable and filled with love.
                </Typography>
                <TextField
                  placeholder="Add a Birthday Wish"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  className="wishInput"
                  error={
                    errors.message && touched.message
                      ? Boolean(errors.message)
                      : null
                  }
                  helperText={
                    errors.message && touched.message ? errors.message : null
                  }
                />
                <br />
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  sx={{ px: 4 }}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Send
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={workAnniversaryWishModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        onClose={workAnniversaryWishModalClose}
      >
        <Fade in={workAnniversaryWishModal}>
          <Box
            className="modalContainer md whish-modal scroll-y"
            sx={{ overflow: "hidden" }}
          >
            <Box className="modalBody" sx={{ p: 0 }}>
              <img src={ImagePath.workAnniversaryBG} alt="" className="w-100" />

              <Box
                className="whish-content"
                sx={{ py: 3, px: 5, textAlign: "center" }}
              >
                {wishDataForModal?.user?.image ? (
                  <img
                    src={wishDataForModal?.user?.image}
                    alt=""
                    className="whishDP"
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    className="whishDP"
                    sx={{ mx: "auto" }}
                  />
                )}
                <Typography component="h4">
                  Today is{" "}
                  {
                    <strong>
                      {`${
                        wishDataForModal?.user?.honorific
                          ? `${wishDataForModal?.user?.honorific} `
                          : ""
                      }${wishDataForModal?.user?.first_name || ""} ${
                        wishDataForModal?.user?.middle_name
                          ? `${wishDataForModal?.user.middle_name} `
                          : ""
                      }${wishDataForModal?.user?.last_name || ""}`}
                    </strong>
                  }{" "}
                  Work Anniversary
                </Typography>
                <Typography component="p" sx={{ mb: 2 }}>
                  Express warm wishes on special day,conveying heartfelt joy and
                  happiness. Share your genuine sentiments to make work
                  anniversary memorable.
                </Typography>
                <TextField
                  label="Add a Work Anniversary Wish"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  error={
                    errors.message && touched.message
                      ? Boolean(errors.message)
                      : null
                  }
                  helperText={
                    errors.message && touched.message ? errors.message : null
                  }
                />

                <br />
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  sx={{ px: 4 }}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Send
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default EventsCelebrating;
