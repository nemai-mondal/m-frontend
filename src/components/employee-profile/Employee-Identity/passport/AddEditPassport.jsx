/* eslint-disable react/prop-types */
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { PassportSchema } from "@/validations/PassportSchema";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const AddEditPassport = ({
  isAddEditPassportOpen,
  closeAddEditPassport,
  getEmployeeDetails,
  employeeDetails,
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
    initialValues: {
      name: employeeDetails?.passport?.name || "",
      number: employeeDetails?.passport?.number || "",
      expiry_date: employeeDetails?.passport?.expiry_date || "",
      issue_date: employeeDetails?.passport?.issue_date || "",
      country: employeeDetails?.passport?.country || "",
      file: employeeDetails?.passport?.file?.split("/").pop() || "",
    },
    validationSchema: PassportSchema,
    onSubmit: async (values) => {
      // Trim all string values
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const expiryDate = moment(values.expiry_date).format("YYYY-MM-DD");
      const issueDate = moment(values.issue_date).format("YYYY-MM-DD");
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 9);
      formData.append("form", 5);
      formData.append("number", trimmedValues.number);
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.passport?.file
          ? employeeDetails.passport.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append("expiry_date", expiryDate);
      formData.append("issue_date", issueDate);
      formData.append("country", trimmedValues.country);
      formData.append(
        "key",
        employeeDetails?.passport?.name ? "update" : "create"
      );
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          closeAddEditPassport();
          employeeDetails.passport
            ? toast.success("Passport Updated successfully")
            : toast.success("Passport Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
          const errorObject = {};
          Object.keys(apiErrors||"").forEach((key) => {
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
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isAddEditPassportOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddEditPassportOpen}>
          <Box className="modalContainer md">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Passport
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddEditPassport}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Passport Number<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter passport number"
                      variant="outlined"
                      fullWidth
                      name="number"
                      size="small"
                      value={values.number}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.number && touched.number ? (
                      <Typography component="span" className="error-msg">
                        {errors.number}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Name In Passport<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter passport name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      size="small"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name ? (
                      <Typography component="span" className="error-msg">
                        {errors.name}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Issue Date<span>*</span>
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
                      selected={
                        values.issue_date ? new Date(values.issue_date) : null
                      }
                      onChange={(date) => setFieldValue("issue_date", date)}
                      name="issue_date"
                      onBlur={handleBlur}
                      className="dateTime-picker calender-icon"
                      placeholderText="Select Date"
                      autoComplete="off"
                    />

                    {errors.issue_date && touched.issue_date ? (
                      <Typography component="span" className="error-msg">
                        {errors.issue_date}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Expire Date<span>*</span>
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
                      selected={
                        values.expiry_date ? new Date(values.expiry_date) : null
                      }
                      onChange={(date) => setFieldValue("expiry_date", date)}
                      name="expiry_date"
                      onBlur={handleBlur}
                      className="dateTime-picker calender-icon"
                      placeholderText="Select Date"
                      autoComplete="off"
                    />

                    {errors.expiry_date && touched.expiry_date ? (
                      <Typography component="span" className="error-msg">
                        {errors.expiry_date}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Country<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter Country Name"
                      variant="outlined"
                      fullWidth
                      name="country"
                      size="small"
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.country && touched.country ? (
                      <Typography component="span" className="error-msg">
                        {errors.country}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Upload Document<span>*</span>
                    </InputLabel>
                    <Box component="div" className="choosefile">
                      <Typography
                        component="label"
                        htmlFor="file-upload"
                        id="file-upload-filename"
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
                      {errors.file ? (
                        <Typography component="span" className="error-msg">
                          {errors.file}
                        </Typography>
                      ) : null}
                    </Box>
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
                  onClick={closeAddEditPassport}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddEditPassport;
