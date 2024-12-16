/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Fade,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { HrAnnouncementSchema } from "@/validations/HrAnnouncementSchema";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClearIcon from "@mui/icons-material/Clear";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const EditHrAnnouncement = ({
  isEditOpen,
  closeEditAnnouncement,
  editAnnouncementData,
  fetchAnnouncement,
}) => {
  //function to set range
  const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  };
  //to select year in datepicker
  const years = range(1990, getYear(new Date()) + 100, 1);
  //to select month in datepicker
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Function to trim all values
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
  //state to show loading animation when user will click update
  const [loading, setLoading] = useState(false);
  //getting form input value and sending value to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    handleBlur,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title: editAnnouncementData.title || "",
      description: editAnnouncementData.description || "",
      event_date: editAnnouncementData.event_date || "",
      event_start_time: editAnnouncementData.event_start_time
        ? moment(editAnnouncementData.event_start_time, "HH:mm:ss").toDate()
        : "",
      // new Date(
      //   `2024-01-01T${editAnnouncementData.event_start_time}Z`
      // ),
      event_end_time: editAnnouncementData.event_end_time
        ? moment(editAnnouncementData.event_end_time, "HH:mm:ss").toDate()
        : "",
    },
    validationSchema: HrAnnouncementSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const payload = trimAllValues({
          ...values,
          event_date: values.event_date
            ? moment(values.event_date).format("YYYY-MM-DD")
            : null,
          event_start_time: values.event_start_time
            ? moment(values.event_start_time).format("HH:mm:ss")
            : null,
          event_end_time: values.event_end_time
            ? moment(values.event_end_time).format("HH:mm:ss")
            : "",
        });

        const data = await Axios.put(
          `hr-announcement/update/${editAnnouncementData.id}`,
          payload
        );
        if (data.status && data.status >= 200 && data.status < 300) {
          setLoading(false);
          closeEditAnnouncement();
          toast.success("Announcement updated successfully");

          resetForm();
          fetchAnnouncement();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 422) {
          setErrors({
            event_end_time: "End time must be after start time",
            //  error.response.data.errors.event_end_time[0],
          });
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
  });
  return (
    <>
      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={isEditOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isEditOpen}>
          <Box className="modalContainer md hr-annoucement-modal">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography component="h2" className="modal-title">
                  Update Announcement
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeEditAnnouncement}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50" sx={{ marginY: 2 }}>
              <Stack spacing={3}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Title<span>*</span>
                  </InputLabel>
                  <TextField
                    id="outlined-basic"
                    placeholder="Title"
                    variant="outlined"
                    size="small"
                    name="title"
                    onBlur={handleBlur}
                    value={values.title ? values.title : ""}
                    onChange={handleChange}
                    error={
                      errors.title && touched.title
                        ? Boolean(errors.title)
                        : null
                    }
                    helperText={
                      errors.title && touched.title ? errors.title : null
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Description<span>*</span>
                  </InputLabel>
                  <TextField
                    placeholder="Description"
                    multiline
                    rows={4}
                    name="description"
                    onBlur={handleBlur}
                    value={values.description ? values.description : ""}
                    onChange={handleChange}
                    error={
                      errors.description && touched.description
                        ? Boolean(errors.description)
                        : null
                    }
                    helperText={
                      errors.description && touched.description
                        ? errors.description
                        : null
                    }
                  />
                </FormGroup>
                <Stack spacing={2} direction="row">
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Event Date<span>*</span>
                    </InputLabel>
                    <DatePicker
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div
                          style={{
                            // margin: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f0f0f0",
                            borderRadius: 8,
                            padding: "10px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #ddd",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {"<"}
                          </button>
                          <select
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #ddd",
                              padding: "5px",
                              borderRadius: "5px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            value={getYear(date)}
                            onChange={({ target: { value } }) =>
                              changeYear(value)
                            }
                          >
                            {years.map((option) => (
                              <option
                                key={option}
                                value={option}
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "14px",
                                  color: "#333",
                                  width: "10px",
                                }}
                              >
                                {option}
                              </option>
                            ))}
                          </select>

                          <select
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #ddd",
                              padding: "5px",
                              borderRadius: "5px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                              changeMonth(months.indexOf(value))
                            }
                          >
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <button
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #ddd",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              marginLeft: "5px",
                              cursor: "pointer",
                            }}
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {">"}
                          </button>
                        </div>
                      )}
                      onBlur={handleBlur}
                      name="event_date"
                      selected={
                        values.event_date && Date.parse(values.event_date)
                          ? new Date(values.event_date)
                          : null
                      }
                      onChange={(date) => {
                        setFieldValue("event_date", date);
                      }}
                      className="dateTime-picker calender-icon"
                      placeholderText="Date"
                      autoComplete="off"
                    />

                    {errors.event_date && touched.event_date ? (
                      <FormHelperText className="error-msg">
                        {errors.event_date}
                      </FormHelperText>
                    ) : null}
                  </FormGroup>

                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Start Time<span>*</span>
                    </InputLabel>

                    <DatePicker
                      selected={
                        Date.parse(values.event_start_time)
                          ? values.event_start_time
                          : null
                      }
                      onChange={(time) => {
                        setFieldValue(
                          "event_start_time",

                          time
                        );
                      }}
                      onBlur={handleBlur}
                      name="event_start_time"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="dateTime-picker"
                      placeholderText="Start Time"
                      timeFormat="hh:mm"
                      autoComplete="off"
                    />
                    {errors.event_start_time && touched.event_start_time ? (
                      <FormHelperText className="error-msg">
                        {errors.event_start_time}
                      </FormHelperText>
                    ) : null}
                  </FormGroup>

                  <FormGroup>
                    <InputLabel className="fixlabel">
                      End Time<span>*</span>
                    </InputLabel>
                    <DatePicker
                      selected={
                        Date.parse(values.event_end_time)
                          ? values.event_end_time
                          : null
                      }
                      onChange={(time) => {
                        setFieldValue("event_end_time", time);
                      }}
                      onBlur={handleBlur}
                      name="event_end_time"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="dateTime-picker"
                      placeholderText="End Time"
                      autoComplete="off"
                    />
                    {errors.event_end_time && touched.event_end_time ? (
                      <FormHelperText className="error-msg">
                        {errors.event_end_time}
                      </FormHelperText>
                    ) : null}
                  </FormGroup>
                </Stack>
                <Stack spacing={2} direction="row">
                  <FormGroup sx={{ width: "100%" }}>
                    <InputLabel className="fixlabel">Name</InputLabel>
                    <TextField
                      id="author-name"
                      placeholder="Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={`${
                        editAnnouncementData?.user_details?.honorific
                          ? `${editAnnouncementData?.user_details?.honorific} `
                          : ""
                      }${
                        editAnnouncementData?.user_details?.first_name || ""
                      } ${
                        editAnnouncementData?.user_details?.middle_name
                          ? `${editAnnouncementData?.user_details.middle_name} `
                          : ""
                      }${editAnnouncementData?.user_details?.last_name || ""}`}
                      inputProps={{ readOnly: true }}
                      className="cursor-nodrop"
                    />
                  </FormGroup>
                  <FormGroup sx={{ width: "100%" }}>
                    <InputLabel className="fixlabel">Designation</InputLabel>
                    <TextField
                      id="author-Designation"
                      placeholder="Designation"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={editAnnouncementData.designation_name || "N/A"}
                      inputProps={{ readOnly: true }}
                      className="cursor-nodrop"
                    />
                  </FormGroup>
                </Stack>
              </Stack>
            </Box>
            <Box className="modalFooter">
              <Stack spacing={2} direction="row" justifyContent="start">
                <LoadingButton
                  color="primary"
                  variant="contained"
                  className="primary-btn text-capitalize"
                  sx={{ minWidth: "170px" }}
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Update
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditHrAnnouncement;
