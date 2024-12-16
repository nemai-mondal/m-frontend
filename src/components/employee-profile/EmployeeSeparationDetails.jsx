/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  InputLabel,
  TextField,
  Grid,
  FormGroup,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import moment from "moment";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { EmployeeSeparationSchema } from "@/validations/EmployeeSeparationSchema";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const EmployeeSeparationDetailsForm = ({
  employeeDetails,
  getEmployeeDetails,
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
  //function to reset error and data
  const reset = () => {
    setErrors({}); // Reset errors to clear any validation messages
    resetForm({
      values: {
        ...values, // Reset other fields
        date_of_joining: "",
        year_of_service: "",
        submission_date: "",
        lwd_expected: "",
        lwd_after_serving_notice: "",
        remarks: "",
        file: "",
      },
    });
  };
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  //function to get userinput and send to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    //storing values
    initialValues: {
      date_of_joining:
        (employeeDetails?.joining || [])?.length > 0
          ? new Date(
              employeeDetails?.joining[
                employeeDetails.joining.length - 1
              ]?.date_of_joining
            ) || null
          : null || null,
      year_of_service: employeeDetails?.separation?.year_of_service || "",
      submission_date:
        employeeDetails?.separation?.submission_date || new Date(),
      lwd_expected: employeeDetails?.separation?.lwd_expected || "",
      lwd_after_serving_notice:
        employeeDetails?.separation?.lwd_after_serving_notice || "",
      remarks: employeeDetails?.separation?.remarks || "",
      file: employeeDetails?.separation?.file?.split("/").pop() || "",
    },
    validationSchema: EmployeeSeparationSchema,
    onSubmit: async (values) => {

      // Trim all string values in the 'values' object
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 12);

      formData.append(
        "date_of_joining",
        values.date_of_joining
          ? moment(values.date_of_joining).format("YYYY-MM-DD")
          : ""
      );
      formData.append(
        "submission_date",
        values.submission_date
          ? moment(values.submission_date).format("YYYY-MM-DD")
          : ""
      );
      formData.append(
        "lwd_expected",
        values.lwd_expected
          ? moment(values.lwd_expected).format("YYYY-MM-DD")
          : ""
      );
      formData.append(
        "lwd_after_serving_notice",
        values.lwd_after_serving_notice
          ? moment(values.lwd_after_serving_notice).format("YYYY-MM-DD")
          : ""
      );
      formData.append("year_of_service", values.year_of_service || "");
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.separation?.file
          ? employeeDetails.separation.file
          : ""
      );
      formData.append("remarks", trimmedValues.remarks || "");
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          employeeDetails?.separation
            ? toast.success("Separation details Updated successfully")
            : toast.success("Separation details Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
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

  return (
    <React.Fragment>
      <Box p={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="heading-5"
          alignItems={"center"}
          mb={3}
        >
          <Typography
            component="h2"
            className="heading-5"
            border={0}
            mb={0}
            pb={0}
          >
            Separation Details
          </Typography>
          {/* <Button variant="outlined" size="small" startIcon={<EditIcon />}>
            {" "}
            Edit
          </Button> */}
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Decument</InputLabel>
              <Box component="div" className="choosefile">
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  id="upload-decument"
                >
                  {values.file?.name
                    ? values.file.name
                    : values.file
                    ? values.file
                    : "Choose File"}
                </Typography>
                <input
                  type="file"
                  name="file"
                  id="file-upload"
                  onChange={(e) => {
                    setFieldValue("file", e.target.files[0]);
                  }}
                  onBlur={handleBlur}
                />
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  className="choosefile-button"
                >
                  Browse
                </Typography>
                {errors.file && touched.file ? (
                  <Typography component="span" className="error-msg">
                    {errors.file}
                  </Typography>
                ) : null}
              </Box>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Joining Date<span>*</span>
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
                      margin: 10,
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
                selected={
                  values.date_of_joining
                    ? new Date(values.date_of_joining)
                    : null
                }
                // onChange={(date) => setFieldValue("date_of_joining", date)}
                // name="date_of_joining"
                // onBlur={handleBlur}
                className="dateTime-picker calender-icon"
                placeholderText="Joining Date"
                autoComplete="off"
                disabled
              />

              {errors.date_of_joining && touched.date_of_joining ? (
                <Typography component="span" className="error-msg">
                  {errors.date_of_joining}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Year Of Service<span>*</span>
              </InputLabel>
              <TextField
                type="number"
                variant="outlined"
                id="year-service"
                placeholder="Enter Years"
                size="small"
                name="year_of_service"
                value={values.year_of_service}
                onBlur={handleBlur}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: { name: "year_of_service", value: numericValue },
                  });
                }}
              />
              {errors.year_of_service && touched.year_of_service ? (
                <Typography component="span" className="error-msg">
                  {errors.year_of_service}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Separation Submitted On<span>*</span>
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
                      margin: 10,
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
                selected={
                  values.submission_date
                    ? new Date(values.submission_date)
                    : null
                }
                onChange={(date) => setFieldValue("submission_date", date)}
                name="submission_date"
                onBlur={handleBlur}
                className="dateTime-picker calender-icon"
                placeholderText="Select Submission Date"
                autoComplete="off"
              />

              {errors.submission_date && touched.submission_date ? (
                <Typography component="span" className="error-msg">
                  {errors.submission_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Expected Leaving Date
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
                      margin: 10,
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
                selected={
                  values.lwd_expected ? new Date(values.lwd_expected) : null
                }
                onChange={(date) => setFieldValue("lwd_expected", date)}
                name="lwd_expected"
                onBlur={handleBlur}
                className="dateTime-picker calender-icon"
                placeholderText="Expected Leaving Date"
                autoComplete="off"
              />

              {errors.lwd_expected && touched.lwd_expected ? (
                <Typography component="span" className="error-msg">
                  {errors.lwd_expected}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Leaving Date As Per Notice Period<span>*</span>
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
                      margin: 10,
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
                selected={
                  values.lwd_after_serving_notice
                    ? new Date(values.lwd_after_serving_notice)
                    : null
                }
                onChange={(date) =>
                  setFieldValue("lwd_after_serving_notice", date)
                }
                name="lwd_after_serving_notice"
                onBlur={handleBlur}
                className="dateTime-picker calender-icon"
                placeholderText="Date As Per Notice Period"
                autoComplete="off"
              />

              {errors.lwd_after_serving_notice &&
              touched.lwd_after_serving_notice ? (
                <Typography component="span" className="error-msg">
                  {errors.lwd_after_serving_notice}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Remarks</InputLabel>
              <TextField
                id="remarks"
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
                size="small"
                value={values.remarks}
                name="remarks"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.remarks && touched.remarks ? (
                <Typography component="span" className="error-msg">
                  {errors.remarks}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
      <Box className="modalFooter">
        <Stack spacing={2} direction="row" justifyContent="flex-start">
          <LoadingButton
            variant="contained"
            className="text-capitalize"
            color="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            Submit
          </LoadingButton>
          <Button
            variant="outlined"
            color="primary"
            className="text-capitalize"
            onClick={reset}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default EmployeeSeparationDetailsForm;
