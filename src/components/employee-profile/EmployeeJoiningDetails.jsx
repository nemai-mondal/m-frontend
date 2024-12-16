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
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { EmployeeJoiningDetailsSchema } from "@/validations/EmployeeJoiningDetailsSchema";
import moment from "moment";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
import { AuthContext } from "@/contexts/AuthProvider";
const EmployeeJoiningDetailsForm = ({
  employeeDetails,
  getEmployeeDetails,
  employmentType,
}) => {
  const { Axios } = useAxios();
  //state to show animation
  const [loading, setLoading] = useState(false);
  //to define access role based
  const { hasPermission } = useContext(AuthContext);
  //getting permission details
  const permission = hasPermission("user_update");
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
  //defining dropdown
  const selectStatus = [
    { value: "Active", label: "Active" },
    { value: "De-activate", label: "De-activate" },
  ];
  const selectContractType = [
    { value: "Probationary", label: "Probationary" },
    { value: "Permanent", label: "Permanent" },
  ];
  const reset = () => {
    setErrors({}); // Reset errors to clear any validation messages
    resetForm({
      values: {
        ...values, // Reset other fields
        contractType: "",
        office_email: "",
        status: "",
        transfer_date: "",
        date_of_joining: "",
        salary_start_date: "",
        last_working_date: "",
        confirmation_date: "",
        employment_type_id: "",
        notice_period_employee: "",
        notice_period_employer: "",
        probation_period_in_days: "",
      },
    });
  };
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
      contract_type: employeeDetails?.professional_details?.contract_type
        ? {
            value: employeeDetails.professional_details.contract_type,
            label: employeeDetails.professional_details.contract_type,
          }
        : "",
      office_email: employeeDetails?.email || "",
      status:
        employeeDetails?.status === 1
          ? { value: "Active", label: "Active" }
          : employeeDetails?.status === 0
          ? { value: "De-activate", label: "De-activate" }
          : "",
      transfer_date:
       ( employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.transfer_date
          : "",
      date_of_joining:
       ( employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.date_of_joining
          : "",
      salary_start_date:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.salary_start_date
          : "",
      last_working_date:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.last_working_date
          : "",
      confirmation_date:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.confirmation_date
          : "",
      employment_type_id:
        (employeeDetails?.employment_type||[]).length > 0
          ? {
              value:
                employeeDetails.employment_type[
                  employeeDetails.employment_type.length - 1
                ].id,
              label:
                employeeDetails.employment_type[
                  employeeDetails.employment_type.length - 1
                ].name,
            }
          : "",
      notice_period_employee:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.notice_period_employee
          : "",
      notice_period_employer:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.notice_period_employer
          : "",
      probation_period_in_days:
        (employeeDetails?.joining||[]).length > 0
          ? employeeDetails?.joining[employeeDetails.joining.length - 1]
              ?.probation_period_in_days
          : "",
    },
    validationSchema: EmployeeJoiningDetailsSchema,
    onSubmit: async (values) => {
      //trim all values and formating
      const payload = trimAllValues({
        ...values,
        user_id: employeeDetails.id,
        status:
          values.status.value === "Active"
            ? 1
            : values.status.value === "De-activate"
            ? 0
            : "",
        contract_type: values.contract_type.value,
        employment_type_id: values.employment_type_id.value,
        transfer_date: values.transfer_date
          ? moment(values.transfer_date).format("YYYY-MM-DD")
          : "",
        date_of_joining: values.date_of_joining
          ? moment(values.date_of_joining).format("YYYY-MM-DD")
          : "",
        salary_start_date: values.salary_start_date
          ? moment(values.salary_start_date).format("YYYY-MM-DD")
          : "",
        last_working_date: values.last_working_date
          ? moment(values.last_working_date).format("YYYY-MM-DD")
          : "",
        confirmation_date: values.confirmation_date
          ? moment(values.confirmation_date).format("YYYY-MM-DD")
          : "",
        step: 6,
      });
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.put("user/update-profile?_method=put", payload);
        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          getEmployeeDetails(employeeDetails.id, force);
          toast.success("Profile Joining Details Updated successfully");
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
          Employee Joining Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Status <span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Status"
                options={selectStatus}
                value={values.status}
                name="status"
                onChange={(selectedOption) => {
                  setFieldValue("status", selectedOption);
                }}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
                isDisabled={true}
              />
              {errors.status && touched.status ? (
                <Typography component="span" className="error-msg">
                  {errors.status}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Contract type</InputLabel>
              <Select
                placeholder="Contract type"
                options={selectContractType}
                value={values.contract_type}
                onChange={(selectedOption) => {
                  setFieldValue("contract_type", selectedOption);
                }}
                name="contract_type"
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
                isDisabled={permission ? false : true}
              />
              {errors.contract_type && touched.contract_type ? (
                <Typography component="span" className="error-msg">
                  {errors.contract_type}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Employment type<span>*</span>
              </InputLabel>
              <Select
                placeholder="Employment type"
                options={employmentType}
                value={values.employment_type_id}
                onChange={(selectedOption) => {
                  setFieldValue("employment_type_id", selectedOption);
                }}
                name="contractType"
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onBlur={handleBlur}
                isDisabled={permission ? false : true}
              />
              {errors.employment_type_id && touched.employment_type_id ? (
                <Typography component="span" className="error-msg">
                  {errors.employment_type_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Company Email ID</InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Enter email id"
                variant="outlined"
                fullWidth
                size="small"
                disabled={true}
                // className="cursor-nodrop"
                name="office_email"
                value={values.office_email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {/* {errors.office_email && touched.office_email ? (
                <Typography component="span" className="error-msg">
                  {errors.office_email}
                </Typography>
              ) : null} */}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Date Of Joining</InputLabel>
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
                onBlur={handleBlur}
                selected={
                  values.date_of_joining
                    ? new Date(values.date_of_joining)
                    : null
                }
                name="date_of_joining"
                onChange={(date) => setFieldValue("date_of_joining", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Enter DOJ"
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.date_of_joining && touched.date_of_joining ? (
                <Typography component="span" className="error-msg">
                  {errors.date_of_joining}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Salary Start Date</InputLabel>
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
                  values.salary_start_date
                    ? new Date(values.salary_start_date)
                    : null
                }
                name="salary_start_date"
                onChange={(date) => setFieldValue("salary_start_date", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Salary Start Date"
                onBlur={handleBlur}
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.salary_start_date && touched.salary_start_date ? (
                <Typography component="span" className="error-msg">
                  {errors.salary_start_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Transfer Date</InputLabel>

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
                  values.transfer_date ? new Date(values.transfer_date) : null
                }
                name="transfer_date"
                onChange={(date) => setFieldValue("transfer_date", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Transfer Date"
                onBlur={handleBlur}
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.transfer_date && touched.transfer_date ? (
                <Typography component="span" className="error-msg">
                  {errors.transfer_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Probation Period In Days
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="Probation Period"
                variant="outlined"
                fullWidth
                size="small"
                value={values.probation_period_in_days}
                name="probation_period_in_days"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: {
                      name: "probation_period_in_days",
                      value: numericValue,
                    },
                  });
                }}
                onBlur={handleBlur}
                disabled={permission ? false : true}
              />
              {errors.probation_period_in_days &&
              touched.probation_period_in_days ? (
                <Typography component="span" className="error-msg">
                  {errors.probation_period_in_days}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Confirmation Date</InputLabel>
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
                  values.confirmation_date
                    ? new Date(values.confirmation_date)
                    : null
                }
                name="confirmation_date"
                onChange={(date) => setFieldValue("confirmation_date", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Confirmation Date"
                onBlur={handleBlur}
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.confirmation_date && touched.confirmation_date ? (
                <Typography component="span" className="error-msg">
                  {errors.confirmation_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Last Working Date</InputLabel>
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
                  values.last_working_date
                    ? new Date(values.last_working_date)
                    : null
                }
                name="last_working_date"
                onChange={(date) => setFieldValue("last_working_date", date)}
                className="dateTime-picker calender-icon"
                placeholderText="Last Working Date"
                onBlur={handleBlur}
                autoComplete="off"
                disabled={permission ? false : true}
              />

              {errors.last_working_date && touched.last_working_date ? (
                <Typography component="span" className="error-msg">
                  {errors.last_working_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Notice Period For Employer
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="EX - 30 in Day’s"
                variant="outlined"
                fullWidth
                size="small"
                value={values.notice_period_employer}
                name="notice_period_employer"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: {
                      name: "notice_period_employer",
                      value: numericValue,
                    },
                  });
                }}
                onBlur={handleBlur}
                disabled={permission ? false : true}
              />
              {errors.notice_period_employer &&
              touched.notice_period_employer ? (
                <Typography component="span" className="error-msg">
                  {errors.notice_period_employer}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Notice Period For Employee
              </InputLabel>
              <TextField
                id="EmployeeId"
                placeholder="EX - 30 in Day’s"
                variant="outlined"
                fullWidth
                size="small"
                value={values.notice_period_employee}
                name="notice_period_employee"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: {
                      name: "notice_period_employee",
                      value: numericValue,
                    },
                  });
                }}
                onBlur={handleBlur}
                disabled={permission ? false : true}
              />
              {errors.notice_period_employee &&
              touched.notice_period_employee ? (
                <Typography component="span" className="error-msg">
                  {errors.notice_period_employee}
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

export default EmployeeJoiningDetailsForm;
