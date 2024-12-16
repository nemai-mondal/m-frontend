/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Typography,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  FormGroup,
} from "@mui/material";
import Select from "react-select";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "react-datepicker";
import { AddEmployeeSchema } from "@/validations/AddEmployeeSchema";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
import { useDispatch } from "react-redux";
import { refresh, setPage } from "@/redux/EmployeeListSlice";
const ConvertToEmployee = ({
  convertToEmployeeOpen,
  closeConvertToEmployee,
  convertToEmployeeData,
  departments,
  departmentDesignations,
}) => {
  const dispatch = useDispatch();
  //state to store designations
  const [designations, setDesignations] = useState([]);
  //state to store employment type
  const [employmentType, setEmploymentType] = useState([]);
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
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //state to store employee details
  const [employee, setEmployee] = useState("");
  //state to store shift details
  const [shifts, setShifts] = useState("");
  //defining dropdown
  const titleStatus = [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
  ];
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const contract_type = [
    { value: "Permanent", label: "Permanent" },
    { value: "Contract", label: "Contract" },
  ];
  //getting employment type
  const fetchEmploymentType = async () => {
    try {
      const res = await Axios.get("employment-type/list");
      if (res.status && res.status >= 200 && res.status < 300) {
        const employmentTypeData = (res.data?.data || []).map((data) => ({
          value: data.id||"",
          label: data.name||"",
        }));
        setEmploymentType(employmentTypeData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //Get All Shifts list
  const getShifts = async () => {
    try {
      const res = await Axios.get("shift/list");
      if (res.status && res.status === 200) {
        const shifts = (res.data?.data || []).map((item) => ({
          value: item.id||"",
          label:
            item.name||"" + " (" + item.shift_start||"" + "-" + item.shift_end||"" + ")",
        }));
        setShifts(shifts);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //fetching employee details
  const getEmployee = async () => {
    try {
      const res = await Axios.get("user/list");
      if (res.status && res.status === 200) {
        const employeeAllData = (res.data?.data || []).map((item) => ({
          value: item.id||"",
          label: `${item.first_name||""} ${item.middle_name||""} ${item.last_name||""}-${item.employee_id||""}`,
        }));
        setEmployee(employeeAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //   const getEmployeeId = async () => {
  //     try {
  //       const res = await Axios.get("user/new-employee-id");
  //       if (res.status && res.status === 200) {
  //         setFieldValue("employee_id", res.data?.data || "");
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 500) {
  //         toast.error("Unable to connect to the server");
  //       }
  //     }
  //   };

  //function to get user input and send to the api to add new employee
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
      employee_id: "",
      honorific: "",
      first_name: convertToEmployeeData.name || "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      office_email: "",
      phone: convertToEmployeeData.phone || "",
      contract_type: "",
      reporting_manager_id: "",
      shift_id: "",
      date_of_joining:
        convertToEmployeeData?.hr_head_feedback?.joining_date || null,
      employment_type_id: "",
      department_id: convertToEmployeeData?.department
        ? {
            label: convertToEmployeeData.department?.name || "",
            value: convertToEmployeeData.department?.id | "",
          }
        : "",
      designation_id: convertToEmployeeData?.designation
        ? {
            label: convertToEmployeeData.designation?.name || "",
            value: convertToEmployeeData.designation?.id | "",
          }
        : "",
    },
    validationSchema: AddEmployeeSchema,
    onSubmit: async (values) => {
      const payload = trimAllValues({
        ...values,
        honorific: values.honorific?.value || "",
        gender: values.gender?.value || "",
        contract_type: values.contract_type?.value || "",
        reporting_manager_id: values.reporting_manager_id?.value || "",
        shift_id: values.shift_id?.value || "",
        employment_type_id: values.employment_type_id?.value || "",
        department_id: values.department_id?.value || "",
        designation_id: values.designation_id?.value || "",
        date_of_joining: values.date_of_joining
          ? moment(values.date_of_joining).format("YYYY-MM-DD")
          : "",
        date_of_birth: values.date_of_birth
          ? moment(values.date_of_birth).format("YYYY-MM-DD")
          : "",
        step: 1,
      });
      setLoading(true);
      try {
        const res = await Axios.post("user/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeConvertToEmployee();
          toast.success("Employee added successfully");
          dispatch(setPage(1));
          dispatch(refresh());
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

  //function to get designation details
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
  //useeffect to call function when component will be mount
  useEffect(() => {
    getEmployee();
    getShifts();
    // getEmployeeId();
    fetchEmploymentType();
  }, []);
  useEffect(() => {
    if (
      convertToEmployeeData.department &&
      convertToEmployeeData.department.id
    ) {
      fetchDepartmentDesignationsById(convertToEmployeeData.department.id);
    }
  }, [convertToEmployeeData]);
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={convertToEmployeeOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={convertToEmployeeOpen}>
          <Box className="modalContainer lg">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Add Employee
                </Typography>
                <Typography
                  component="p"
                  className="modal-subtitle"
                ></Typography>
              </Box>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeConvertToEmployee}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Employee ID<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="Employee id"
                      name="employee_id"
                      value={values.employee_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.employee_id && touched.employee_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.employee_id}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Title</InputLabel>
                    <Select
                      placeholder="Select Title"
                      options={titleStatus}
                      name="honorific"
                      value={values.honorific}
                      onChange={(selectedOptions) => {
                        setFieldValue("honorific", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      First Name<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <TextField
                      id=""
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.first_name && touched.first_name ? (
                      <Typography component="span" className="error-msg">
                        {errors.first_name}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Middle Name</InputLabel>
                    <TextField
                      id=""
                      name="middle_name"
                      value={values.middle_name}
                      onChange={handleChange}
                      placeholder="Enter Middle Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Last Name</InputLabel>
                    <TextField
                      id=""
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Date Of Birth
                      <Typography component={"span"}>*</Typography>
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
                      selected={values.date_of_birth}
                      name="date_of_birth"
                      onChange={(date) => setFieldValue("date_of_birth", date)}
                      className="dateTime-picker calender-icon paddingRight-40 z-index-1"
                      placeholderText="Enter Date Of Birth"
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    {errors.date_of_birth && touched.date_of_birth ? (
                      <Typography
                        component="span"
                        className="error-msg"
                        style={{
                          wordBreak: "normal",
                          overflowWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {errors.date_of_birth}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Gender<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select Gender"
                      options={gender}
                      value={values.gender}
                      name="gender"
                      onChange={(selectedOptions) => {
                        setFieldValue("gender", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.gender && touched.gender ? (
                      <Typography component="span" className="error-msg">
                        {errors.gender}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Email Address
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <TextField
                      type="email"
                      value={values.office_email}
                      name="office_email"
                      onChange={handleChange}
                      placeholder="Enter Email Address"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.office_email && touched.office_email ? (
                      <Typography component="span" className="error-msg">
                        {errors.office_email}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Mobile Number</InputLabel>
                    <TextField
                      type="phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.phone && touched.phone ? (
                      <Typography component="span" className="error-msg">
                        {errors.phone}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Date Of Joining
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    {/* datepicker */}
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
                      onBlur={handleBlur}
                      selected={
                        values.date_of_joining
                          ? new Date(values.date_of_joining)
                          : null
                      }
                      name="date_of_joining"
                      onChange={(date) =>
                        setFieldValue("date_of_joining", date)
                      }
                      className="dateTime-picker calender-icon z-index-1"
                      placeholderText="Enter DOJ"
                      autoComplete="off"
                    />

                    {errors.date_of_joining && touched.date_of_joining ? (
                      <Typography component="span" className="error-msg">
                        {errors.date_of_joining}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Contract Type
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Contract Type"
                      options={contract_type}
                      value={values.contract_type}
                      name="contract_type"
                      onChange={(selectedOptions) => {
                        setFieldValue("contract_type", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.contract_type && touched.contract_type ? (
                      <Typography component="span" className="error-msg">
                        {errors.contract_type}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Reporting Manager
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select Reporting Manager"
                      maxMenuHeight={200}
                      menuPlacement="top"
                      options={employee}
                      name="reporting_manager_id"
                      value={values.reporting_manager_id}
                      onChange={(selectedOptions) => {
                        setFieldValue("reporting_manager_id", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.reporting_manager_id &&
                    touched.reporting_manager_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.reporting_manager_id}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Assign Shift<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select Shift"
                      maxMenuHeight={200}
                      menuPlacement="top"
                      options={shifts}
                      name="shift_id"
                      value={values.shift_id}
                      onChange={(selectedOptions) => {
                        setFieldValue("shift_id", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.shift_id && touched.shift_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.shift_id}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Employment type
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Employment type"
                      maxMenuHeight={200}
                      menuPlacement="top"
                      options={employmentType}
                      value={values.employment_type_id}
                      onChange={(selectedOption) => {
                        setFieldValue("employment_type_id", selectedOption);
                      }}
                      name="contractType"
                      className="basic-multi-select selectTag"
                      classNamePrefix="select"
                      onBlur={handleBlur}
                    />
                    {errors.employment_type_id && touched.employment_type_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.employment_type_id}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Department
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select department"
                      options={departments}
                      value={values.department_id}
                      maxMenuHeight={200}
                      menuPlacement="top"
                      name="department_id"
                      onChange={(selectedOptions) => {
                        setFieldValue("department_id", selectedOptions);
                        fetchDepartmentDesignationsById(selectedOptions.value);
                      }}
                      onBlur={handleBlur}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.department_id && touched.department_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.department_id}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Designation
                      <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select designation"
                      options={designations}
                      maxMenuHeight={200}
                      menuPlacement="top"
                      value={values.designation_id}
                      name="designation_id"
                      onChange={(selectedOptions) => {
                        setFieldValue("designation_id", selectedOptions);
                        fetchDepartmentDesignationsById(selectedOptions.value);
                      }}
                      isDisabled={values.department_id ? false : true}
                      onBlur={handleBlur}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.designation_id && touched.designation_id ? (
                      <Typography component="span" className="error-msg">
                        {errors.designation_id}
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
                  // onClick={closeAddEmployee}
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ConvertToEmployee;
