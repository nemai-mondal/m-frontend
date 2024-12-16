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
import { useFormik } from "formik";
import moment from "moment";
import { DrivingLicenseSchema } from "@/validations/DrivingLicenseSchema";
import { getYear, getMonth } from "date-fns";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
const AddEditDrivingLicense = ({
  isAddEditDrivingLicenseOpen,
  closeAddEditDrivingLicense,
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
      name: employeeDetails?.driving_license?.name || "",
      number: employeeDetails?.driving_license?.number || "",
      expiry_date: employeeDetails?.driving_license?.expiry_date || "",
      file: employeeDetails?.driving_license?.file?.split("/").pop() || "",
    },
    validationSchema: DrivingLicenseSchema,
    onSubmit: async (values) => {
      // Trim all string values in the 'values' object
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const date = moment(values.expiry_date).format("YYYY-MM-DD");
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 9);
      formData.append("form", 4);
      formData.append("number", trimmedValues.number);
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.driving_license?.file
          ? employeeDetails.driving_license.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append("expiry_date", date);
      formData.append(
        "key",
        employeeDetails?.driving_license?.name ? "update" : "create"
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

          closeAddEditDrivingLicense();
          employeeDetails?.driving_license
            ? toast.success("Driving license Updated successfully")
            : toast.success("Driving license Added successfully");
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
        open={isAddEditDrivingLicenseOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddEditDrivingLicenseOpen}>
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
                Driving License
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddEditDrivingLicense}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Enter license Number<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-number"
                      placeholder="Enter license number"
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
                      Name on Driving license<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter license name"
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
                      Expiry Date<span>*</span>
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
                      placeholderText="Enter Date"
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
                  onClick={closeAddEditDrivingLicense}
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

export default AddEditDrivingLicense;
