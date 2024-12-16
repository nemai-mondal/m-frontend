/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  Typography,
  InputLabel,
  TextField,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { getYear, getMonth } from "date-fns";
import { AuthContext } from "@/contexts/AuthProvider";
import { EmployeeAttendanceInformationSchema } from "@/validations/EmployeeAttendanceInformationSchema";
const EmployeeAttendanceInformationForm = ({
  employeeDetails,
  getEmployeeDetails,
  department,
}) => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const permission = hasPermission("user_update");
  const { Axios } = useAxios();
  //state to show animation
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
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  //defining dropdown
  const daysOfWeek = [
    { label: "Select Day" },
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];
  const reset = () => {
    setErrors({}); // Reset errors to clear any validation messages
    resetForm({
      values: {
        ...values, // Reset other fields
        enableConfigaration: false,
        department_id: "",
        punch_required: false,
        cc_not_allowed: false,
        overtime_default: "",
        overtime_weekoff: "",
        overtime_holiday: "",
        weekoff_start_default: "",
        weekoff_start_approved: false,
        single_punch_required:false
      },
    });
  };
  //storing user input and sending to the api
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
      enableConfigaration:
        employeeDetails?.attendance?.weekoff_start_approved != null
          ? true
          : false,
      department_id: employeeDetails?.department
        ? {
            value: employeeDetails?.department?.id,
            label: employeeDetails?.department?.name,
          }
        : "",

      punch_required: employeeDetails?.attendance?.punch_required || "",
      single_punch_required:
        employeeDetails?.attendance?.single_punch_required || "",
      cc_not_allowed: employeeDetails?.attendance?.cc_not_allowed || "",
      overtime_default: employeeDetails?.attendance?.overtime_default || "",
      overtime_weekoff: employeeDetails?.attendance?.overtime_weekoff || "",
      overtime_holiday: employeeDetails?.attendance?.overtime_holiday || "",
      weekoff_start_default:
        employeeDetails?.attendance?.weekoff_start_default || "",
      weekoff_start_approved:
        employeeDetails?.attendance?.weekoff_start_approved != null
          ? {
              value: employeeDetails.attendance?.weekoff_start_approved,
              label: days[employeeDetails.attendance.weekoff_start_approved],
            }
          : "",
    },
    validationSchema: EmployeeAttendanceInformationSchema,
    onSubmit: async (values) => {
      //strong user input
      const payload = {
        ...values,
        user_id: employeeDetails.id,
        department_id: values?.department_id?.value || "",
        weekoff_start_default: values.weekoff_start_default
          ? moment(values.weekoff_start_default).format("YYYY-MM-DD")
          : "",
        weekoff_start_approved:
          values?.weekoff_start_approved?.value?.toString() || "",

        step: 8,
      };
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.put("user/update-profile?_method=put", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          getEmployeeDetails(employeeDetails.id, force);

          toast.success("Profile Attendance Info Updated successfully");

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
        <Typography component="h2" className="heading-5" mb={2}>
          Attendance Information
        </Typography>
        <Typography component="h2" className="heading-5" mb={0} border={0}>
          Punching Type
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">&nbsp;</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.punch_required}
                    name="punch_required"
                    onChange={(e) =>
                      setFieldValue("punch_required", e.target.checked)
                    }
                  />
                }
                label="Attendance Punch Not Required"
                onBlur={handleBlur}
                disabled={permission ? false : true}
              />
              {errors.punch_required && touched.punch_required ? (
                <Typography component="span" className="error-msg">
                  {errors.punch_required}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">&nbsp;</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.single_punch_required}
                    name="single_punch_required"
                    onChange={(e) =>
                      setFieldValue("single_punch_required", e.target.checked)
                    }
                  />
                }
                onBlur={handleBlur}
                label="Attendance Single Punch Required"
                disabled={permission ? false : true}
              />
              {errors.single_punch_required && touched.single_punch_required ? (
                <Typography component="span" className="error-msg">
                  {errors.single_punch_required}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">&nbsp;</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.cc_not_allowed}
                    name="cc_not_allowed"
                    onChange={(e) =>
                      setFieldValue("cc_not_allowed", e.target.checked)
                    }
                  />
                }
                label="Not Allowed For CC In Application"
                disabled={permission ? false : true}
              />
              {errors.cc_not_allowed && touched.cc_not_allowed ? (
                <Typography component="span" className="error-msg">
                  {errors.cc_not_allowed}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Department</InputLabel>
              <Select
                placeholder="Department"
                options={department}
                value={values.department_id}
                name="department_id"
                onChange={(selectedOption) => {
                  setFieldValue("department_id", selectedOption);
                }}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                isDisabled={true}
              />
              {errors.department_id && touched.department_id ? (
                <Typography component="span" className="error-msg">
                  {errors.department_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>

        <Typography component="h2" className="heading-5" mt={4} border={0}>
          Default Overtime Per Day
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Regular Day Overtime Hours
              </InputLabel>
              <TextField
                type="number"
                id="EmployeeId"
                placeholder="Enter regular overtime"
                variant="outlined"
                fullWidth
                size="small"
                value={values.overtime_default}
                name="overtime_default"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: { name: "overtime_default", value: numericValue },
                  });
                }}
                disabled={permission ? false : true}
              />
              {errors.overtime_default && touched.overtime_default ? (
                <Typography component="span" className="error-msg">
                  {errors.overtime_default}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Week off Day Overtime Hours
              </InputLabel>
              <TextField
                type="number"
                id="EmployeeId"
                placeholder="Enter week off overtime"
                variant="outlined"
                fullWidth
                size="small"
                value={values.overtime_weekoff}
                name="overtime_weekoff"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: { name: "overtime_weekoff", value: numericValue },
                  });
                }}
                disabled={permission ? false : true}
              />
              {errors.overtime_weekoff && touched.overtime_weekoff ? (
                <Typography component="span" className="error-msg">
                  {errors.overtime_weekoff}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Holiday Overtime Hours
              </InputLabel>
              <TextField
                type="number"
                id="EmployeeId"
                placeholder="Enter holiday overtime"
                variant="outlined"
                fullWidth
                size="small"
                value={values.overtime_holiday}
                name="overtime_holiday"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: { name: "overtime_holiday", value: numericValue },
                  });
                }}
                disabled={permission ? false : true}
              />
              {errors.overtime_holiday && touched.overtime_holiday ? (
                <Typography component="span" className="error-msg">
                  {errors.overtime_holiday}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">WEF</InputLabel>

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
                  values.weekoff_start_default
                    ? new Date(values.weekoff_start_default)
                    : null
                }
                onChange={(date) =>
                  setFieldValue("weekoff_start_default", date)
                }
                name="weekoff_start_default"
                className="dateTime-picker calender-icon"
                placeholderText="WEF"
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.weekoff_start_default && touched.weekoff_start_default ? (
                <Typography component="span" className="error-msg">
                  {errors.weekoff_start_default}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>

        <Typography component="h2" className="heading-5" mt={4} border={0}>
          Week-Off Configaration
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">WEF</InputLabel>
              <Select
                options={daysOfWeek}
                menuPlacement="top"
                maxMenuHeight={200}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                placeholder="Enter week off overtime"
                isDisabled={values.enableConfigaration ? false : true}
                value={
                  values.enableConfigaration
                    ? values.weekoff_start_approved
                    : (values.weekoff_start_approved = "")
                }
                name="weekoff_start_approved"
                onChange={(selectedOption) => {
                  setFieldValue("weekoff_start_approved", selectedOption);
                }}
                disabled={permission ? false : true}
              />
              {errors.weekoff_start_approved &&
              touched.weekoff_start_approved ? (
                <Typography component="span" className="error-msg">
                  {errors.weekoff_start_approved}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">&nbsp;</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      setFieldValue("enableConfigaration", e.target.checked);
                    }}
                    name="enableConfigaration"
                    checked={values.enableConfigaration}
                  />
                }
                label="Define Employee Wise Weekly-Off"
                disabled={permission ? false : true}
              />
              {errors.enableConfigaration && touched.enableConfigaration ? (
                <Typography component="span" className="error-msg">
                  {errors.enableConfigaration}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
      <Box className="modalFooter">
        {hasPermission("user_update") && (
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
        )}
      </Box>
    </React.Fragment>
  );
};

export default EmployeeAttendanceInformationForm;
