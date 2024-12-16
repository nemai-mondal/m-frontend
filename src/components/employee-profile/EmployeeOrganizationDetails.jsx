/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import moment from "moment";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { getYear, getMonth } from "date-fns";
import { EmployeeOrganizationDetailsSchema } from "@/validations/EmployeeOrganizationDetailsSchema";
import { mapValues } from "lodash";
import { AuthContext } from "@/contexts/AuthProvider";
const EmployeeOrganizationDetailsForm = ({
  employeeDetails,
  getEmployeeDetails,
  department,
  departmentDesignations,
}) => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //to define access role based
  const { hasPermission } = useContext(AuthContext);
  //getting permission details
  const permission = hasPermission("user_update");
  //state to store designations
  const [designations, setDesignations] = useState([]);
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
  // Function to trim all values in the object
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const reset = () => {
    setErrors({}); // Reset errors to clear any validation messages
    resetForm({
      values: {
        ...values, // Reset other fields
        department_id: "",
        designation_id: "",
        location: "",
        effective_date: "",
      },
    });
  };
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
      department_id:
        (employeeDetails?.organizations||[]).length > 0 &&
        employeeDetails?.organizations[employeeDetails.organizations.length - 1]
          ?.department
          ? {
              value:
                employeeDetails?.organizations[
                  employeeDetails.organizations.length - 1
                ]?.department.id,
              label:
                employeeDetails?.organizations[
                  employeeDetails.organizations.length - 1
                ]?.department.name,
            }
          : "",
      designation_id:
        (employeeDetails?.organizations||[]).length > 0 &&
        employeeDetails?.organizations[employeeDetails.organizations.length - 1]
          ?.designation
          ? {
              value:
                employeeDetails?.organizations[
                  employeeDetails.organizations.length - 1
                ]?.designation.id,
              label:
                employeeDetails?.organizations[
                  employeeDetails.organizations.length - 1
                ]?.designation.name,
            }
          : "",
      location:
        (employeeDetails?.organizations||[]).length > 0
          ? employeeDetails?.organizations[
              employeeDetails.organizations.length - 1
            ]?.location
          : "",
      effective_date:
       ( employeeDetails?.organizations||[]).length > 0
          ? employeeDetails?.organizations[
              employeeDetails.organizations.length - 1
            ]?.effective_date
          : "",
    },
    validationSchema: EmployeeOrganizationDetailsSchema,
    onSubmit: async (values) => {
      //trim all values and formating
      const payload = trimAllValues({
        ...values,
        user_id: employeeDetails.id,
        department_id: values.department_id.value,
        designation_id: values.designation_id.value,
        effective_date: values.effective_date
          ? moment(values.effective_date).format("YYYY-MM-DD")
          : "",

        step: 7,
      });
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.put("user/update-profile?_method=put", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          getEmployeeDetails(employeeDetails.id, force);

          employeeDetails?.organization?.length > 0
            ? toast.success("Profile Organization Details Updated successfully")
            : toast.success("Profile Organization Details Added successfully");

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
  const fetchDepartmentDesignationsById = async (departmentId) => {
    setDesignations(
      departmentDesignations
        .filter((designation) => designation.department_id === departmentId)
        .map((designation) => ({
          label: designation.name,
          value: designation.id,
        }))
    );
  };
  useEffect(() => {
    if (employeeDetails?.organizations?.length > 0) {
      fetchDepartmentDesignationsById(
        employeeDetails?.organizations[
          employeeDetails?.organizations?.length - 1
        ].department_id
      );
    }
  }, []);
  return (
    <React.Fragment>
      <Box p={3}>
        <Typography component="h2" className="heading-5" mb={2}>
          Employee Organization Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Select Department<span>*</span>
              </InputLabel>
              <Select
                placeholder="Department"
                options={department}
                value={values.department_id}
                name="department_id"
                onChange={(selectedOption) => {
                  setFieldValue("department_id", selectedOption);
                  values.department_id.value !== selectedOption.value
                    ? setFieldValue("designation_id", "")
                    : "";
                  fetchDepartmentDesignationsById(selectedOption.value);
                }}
                menuPlacement="auto"
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
                isDisabled={permission ? false : true}
              />
              {errors.department_id && touched.department_id ? (
                <Typography component="span" className="error-msg">
                  {errors.department_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Designation<span>*</span>
              </InputLabel>
              <Select
                placeholder="Designation"
                options={designations}
                value={values.designation_id}
                name="designation_id"
                onChange={(selectedOption) => {
                  setFieldValue("designation_id", selectedOption);
                }}
                menuPlacement="auto"
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
                isDisabled={permission ? false : true}
              />
              {errors.designation_id && touched.designation_id ? (
                <Typography component="span" className="error-msg">
                  {errors.designation_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Location</InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Enter Location"
                variant="outlined"
                fullWidth
                size="small"
                value={values.location}
                name="location"
                onChange={handleChange}
                disabled={permission ? false : true}
              />
              {errors.location && touched.location ? (
                <Typography component="span" className="error-msg">
                  {errors.location}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Effective Date</InputLabel>
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
                  values.effective_date ? new Date(values.effective_date) : null
                }
                name="effective_date"
                onChange={(selectedOption) => {
                  setFieldValue("effective_date", selectedOption);
                }}
                className="dateTime-picker calender-icon"
                placeholderText="Effective Date"
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.effective_date && touched.effective_date ? (
                <Typography component="span" className="error-msg">
                  {errors.effective_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
      <Box className="modalFooter">
        {permission ? (
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
        ) : (
          ""
        )}
      </Box>
    </React.Fragment>
  );
};

export default EmployeeOrganizationDetailsForm;
