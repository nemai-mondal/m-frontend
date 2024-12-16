import React, { useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  Typography,
  InputLabel,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { EmployeeAboutSchema } from "@/validations/EmployeeAboutSchema";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const EmployeeAboutForm = ({ employeeDetails, getEmployeeDetails }) => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
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
  //function to reset error and data
  const reset = () => {
    setErrors({}); // Reset errors to clear any validation messages
    resetForm({
      values: {
        ...values, // Reset other fields
        machine_code: "",
        honorific: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
      },
    });
  };
  //defining dropdown
  const selectTitle = [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
  ];
  const selectGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Others" },
  ];
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
      //storing user details
      employee_id: employeeDetails?.employee_id || "",
      // machine_code: employeeDetails?.machine_code || "",
      honorific: employeeDetails?.honorific
        ? { value: employeeDetails.honorific, label: employeeDetails.honorific }
        : "",
      first_name: employeeDetails?.first_name || "",
      middle_name: employeeDetails?.middle_name || "",
      last_name: employeeDetails?.last_name || "",
      date_of_birth: employeeDetails?.personal_details?.date_of_birth || "",
      gender: employeeDetails?.personal_details?.gender
        ? {
            value: employeeDetails.personal_details.gender,
            label: employeeDetails.personal_details.gender,
          }
        : "",

      phone: employeeDetails?.personal_details?.phone || "",
    },
    validationSchema: EmployeeAboutSchema,
    onSubmit: async (values) => {
      //trim all values
      const payload = trimAllValues({
        ...values,
        honorific: values.honorific.value,
        gender: values.gender.value,

        date_of_birth: moment(values.date_of_birth).format("YYYY-MM-DD"),
        user_id: employeeDetails.id,
        step: 5,
      });
      
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.put("user/update-profile?_method=put", payload);
        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          getEmployeeDetails(employeeDetails.id, force);
          toast.success("Profile About Details Updated successfully");
          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing error if any error comes from api
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
    <React.Fragment>
      <Box p={3}>
        <Typography component="h2" className="heading-5" mb={2}>
          Employee Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Employee ID</InputLabel>
              <TextField
                // className="cursor-nodrop"
                id="EmployeeId"
                placeholder="Enter Employee ID"
                variant="outlined"
                fullWidth
                size="small"
                name="employee_id"
                value={employeeDetails.employee_id || "N/A"}
                disabled
              />
              {errors.employee_id && touched.employee_id ? (
                <Typography component="span" className="error-msg">
                  {errors.employee_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Machine Code</InputLabel>
              <TextField
                // className="cursor-nodrop"
                id="EmployeeId"
                placeholder="Enter Machine Code"
                variant="outlined"
                fullWidth
                size="small"
                name="machine_code"
                inputProps={{ readOnly: true }}
                disabled
                value={
                  employeeDetails?.assets?.length > 0
                    ? employeeDetails.assets.map((data) => `${data.sr_no}`)
                    : "N/A"
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.machine_code && touched.machine_code ? (
                <Typography component="span" className="error-msg">
                  {errors.machine_code}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid> */}

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Title</InputLabel>
              <Select
                placeholder="Title"
                options={selectTitle}
                name="honorific"
                value={values.honorific}
                onChange={(selectedOptions) => {
                  setFieldValue("honorific", selectedOptions);
                }}
                defaultValue={values.honorific}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                First Name <span>*</span>
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Enter First Name"
                variant="outlined"
                fullWidth
                size="small"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.first_name && touched.first_name ? (
                <Typography component="span" className="error-msg">
                  {errors.first_name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Middle Name</InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Enter Middle Name"
                variant="outlined"
                fullWidth
                size="small"
                name="middle_name"
                value={values.middle_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.middle_name && touched.middle_name ? (
                <Typography component="span" className="error-msg">
                  {errors.middle_name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Last Name <span>*</span>
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Enter Last Name"
                variant="outlined"
                fullWidth
                size="small"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            {errors.last_name && touched.last_name ? (
              <Typography component="span" className="error-msg">
                {errors.last_name}
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Gender
                <span>*</span>
              </InputLabel>
              <Select
                placeholder="Gender"
                options={selectGender}
                value={values.gender}
                defaultValue={values.gender}
                name="gender"
                onChange={(selectedOptions) => {
                  setFieldValue("gender", selectedOptions);
                }}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
              />
              {errors.gender && touched.gender ? (
                <Typography component="span" className="error-msg">
                  {errors.gender}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Date Of Birth
                <span>*</span>
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
                  values.date_of_birth ? new Date(values.date_of_birth) : null
                }
                name="date_of_birth"
                onChange={(date) => setFieldValue("date_of_birth", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Enter DOB"
                onBlur={handleBlur}
                autoComplete="off"
              />

              {errors.date_of_birth && touched.date_of_birth ? (
                <Typography component="span" className="error-msg">
                  {errors.date_of_birth}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Mobile Number
                <span>*</span>
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Mobile Number"
                variant="outlined"
                fullWidth
                size="small"
                value={values.phone}
                name="phone"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: {
                      name: "phone",
                      value: numericValue,
                    },
                  });
                }}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <Typography component="span" className="error-msg">
                  {errors.phone}
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
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default EmployeeAboutForm;
