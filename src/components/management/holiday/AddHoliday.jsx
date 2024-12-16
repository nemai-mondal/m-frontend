import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { mapValues } from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { refresh } from "@/redux/HolidaySlice";
import { useFormik } from "formik";
import { HolidaySchema } from "@/validations/HolidaySchema";
import moment from "moment";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getYear, getMonth } from "date-fns";
const AddHoliday = ({ isAddOpen, closeAddHoliday }) => {
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
  //triming all values
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //dispatch to send request to the redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);

  //sending new added value
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    handleBlur,
    setFieldValue,
    touched,
  } = useFormik({
    initialValues: { holiday_name: "", date_from: "", date_to: "", days: "" },
    validationSchema: HolidaySchema,
    onSubmit: async (values) => {
      if(values.days==0){
        toast.error('The selected date is holiday')
        return
      }
      setLoading(true);
      try {
        const payload = trimValues({
          ...values,
          date_from: moment(values.date_from).format("YYYY-MM-DD"),
          date_to: moment(values.date_to).format("YYYY-MM-DD"),
        });
        const res = await Axios.post("holiday/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeAddHoliday(false);
          //sending request to the redux store
          dispatch(refresh());
          toast.success(res.data.message);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors||{}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
  });
  //calculation no of days
  const calculateNoOfdays = (date_from, date_to) => {
    const from_date = moment(date_from);
    const to_date = moment(date_to);

    if (from_date.isValid() && to_date.isValid()) {
      let current_date = moment(from_date);
      let days = 0;

      while (current_date.isSameOrBefore(to_date)) {
        // Check if the current day is not Saturday (6) or Sunday (0)
        if (![0, 6].includes(current_date.day())) {
          days++;
        }
        current_date.add(1, "days");
      }
      setFieldValue("days", days);
    } else {
      setFieldValue("days", "");
    }
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isAddOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isAddOpen}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add Holiday
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeAddHoliday}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
            <Stack spacing={1}>
              <InputLabel className="fixlabel">
                Holiday Name<span>*</span>
              </InputLabel>

              <TextField
                id="UserId"
                placeholder="Holiday Name"
                variant="outlined"
                value={values.holiday_name}
                fullWidth
                name="holiday_name"
                size="small"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.holiday_name && touched.holiday_name ? (
                <Typography component="span" className="error-msg mt-0">
                  {errors.holiday_name}
                </Typography>
              ) : null}
              <InputLabel className="fixlabel">
                Start Date<span>*</span>
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
                      onChange={({ target: { value } }) => changeYear(value)}
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
                // popperPlacement="top-start"
                selected={values.date_from}
                className="dateTime-picker"
                placeholderText="Select Start Date"
                name="date_from"
                maxDate={values.date_to || ""}
                onBlur={handleBlur}
                onChange={(date) => {
                  setFieldValue("date_from", date);
                  values.date_to ? calculateNoOfdays(date, values.date_to) : "";
                }}
                autoComplete="off"
              />

              {errors.date_from && touched.date_from ? (
                <Typography component="span" className="error-msg mt-0">
                  {errors.date_from}
                </Typography>
              ) : null}
              <InputLabel className="fixlabel">
                End Date<span>*</span>
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
                      onChange={({ target: { value } }) => changeYear(value)}
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
                popperPlacement="top-start"
                selected={values.date_to}
                className="dateTime-picker"
                placeholderText="Select End Date"
                name="date_to"
                minDate={values.date_from || ""}
                onBlur={handleBlur}
                onChange={(date) => {
                  setFieldValue("date_to", date);
                  values.date_from
                    ? calculateNoOfdays(values.date_from, date)
                    : "";
                }}
                autoComplete="off"
              />

              {errors.date_to && touched.date_to ? (
                <Typography component="span" className="error-msg mt-0">
                  {errors.date_to}
                </Typography>
              ) : null}
              <InputLabel className="fixlabel">No of Days</InputLabel>

              <TextField
                id="UserId"
                placeholder="No Of Days"
                variant="outlined"
                type="number"
                value={values.days != 0 ? values.days : ""}
                inputProps={{ readOnly: true }}
                fullWidth
                name="days"
                size="small"
                className="cursor-nodrop"
                onBlur={handleBlur}
                // onChange={(e) => {
                //   const numericValue = e.target.value.replace(/\D/g, "");
                //   handleChange({
                //     target: { name: "days", value: numericValue },
                //   });
                // }}
                // error={
                //   errors.days && touched.days ? Boolean(errors.days) : null
                // }
                // helperText={errors.days && touched.days ? errors.days : null}
              />
              {/* {errors.days && touched.days ? (
                <Typography component="span" className="error-msg">
                  {errors.days}
                </Typography>
              ) : null} */}
            </Stack>
          </Box>
          <Box className="modalFooter" sx={{ pt: 0 }}>
            <Stack spacing={2} direction="row" justifyContent="start">
              <LoadingButton
                sx={{ minWidth: "170px" }}
                size="large"
                className="primary-btn text-capitalize"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                Add
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddHoliday;
