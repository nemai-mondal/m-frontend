/* eslint-disable react/prop-types */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import DatePicker from "react-datepicker";
import Select from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import moment from "moment";
import { useFormik } from "formik";
import { EmployeeFamilyInformationSchema } from "@/validations/EmployeeFamilyInformationSchema";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
import EmployeeFamilyInformationDelete from "./EmployeeFamilyInformationDelete";
const EmployeeFamilyInformation = ({ employeeDetails, getEmployeeDetails }) => {
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
  //state to open delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  //state to store delete data
  const [deleteFamilyData, setDeleteFamilyData] = useState("");

  const openDeleteFamily = (data) => {
    setIsDeleteOpen(true);
    setDeleteFamilyData(data);
  };
  const closeDeleteFamily = () => {
    setIsDeleteOpen(false);
  };
  //state to store particular family details for update
  const [particularEmployeeDetails, setParticularEmployeeDetails] = useState(
    {}
  );
  //function to reset data
  const reset = () => {
    resetForm();
    setParticularEmployeeDetails(() => {});
  };
  //function to store value for update
  const particularFamilyInformation = (data) => {
    setParticularEmployeeDetails(() => {
      return data;
    });
    setFieldValue("name", data?.name || "");
    setFieldValue(
      "title",
      data?.title
        ? {
            label: data.title,
            value: data.title,
          }
        : ""
    );
    setFieldValue(
      "gender",
      data?.gender
        ? {
            label: data.gender,
            value: data.gender,
          }
        : ""
    );
    setFieldValue(
      "relation",
      data?.relation
        ? {
            label: data.relation,
            value: data.relation,
          }
        : ""
    );
    setFieldValue("address", data?.address || data.address);
    setFieldValue(
      "blood_group",
      data?.blood_group
        ? {
            label: data.blood_group,
            value: data.blood_group,
          }
        : ""
    );
    setFieldValue("contact_number", data?.contact_number || "");
    setFieldValue("marriage_date", data?.marriage_date || "");
    setFieldValue("proffesion", data?.proffesion || "");
    setFieldValue("date_of_birth", data?.date_of_birth || "");
    setFieldValue("insurance_name", data?.insurance_name || "");
    setFieldValue("remarks", data?.remarks || "");
    setFieldValue("is_depend", data?.is_depend || "");
    setFieldValue(
      "marital_status",
      data?.marital_status
        ? {
            label: data.marital_status,
            value: data.marital_status,
          }
        : ""
    );
    setFieldValue(
      "employment",
      data?.employment
        ? {
            label: data.employment,
            value: data.employment,
          }
        : ""
    );
    setFieldValue(
      "nationality",
      data?.nationality
        ? {
            label: data.nationality,
            value: data.nationality,
          }
        : ""
    );
    setFieldValue("health_insurance", data?.health_insurance || "");
    setFieldValue("file", data?.file ? data.file.split("/").pop() : "");
  };
  //state to show or hide phone no
  const [showPhoneNumber, setShowPhoneNumber] = useState(
    employeeDetails?.family_details
      ? Array((employeeDetails?.family_details || []).length).fill(true)
      : []
  );
  //function to do toogle for phone no
  const phonenumberToggle = (index) => {
    setShowPhoneNumber((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  //state to show or hide DOB
  const [showDob, setShowDob] = useState(
    employeeDetails?.family_details
      ? Array((employeeDetails?.family_details || []).length).fill(true)
      : []
  );
  //function to do toogle for DOB
  const dobToggle = (index) => {
    setShowDob((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  //function to replace phno and DOB to '*'
  function replacePhoneNumbers(number) {
    var cuantos = number.length;
    var tele = [];
    for (var i = 0; i < cuantos; i++) {
      if (i > 2) {
        tele[i] = "*";
      } else {
        tele[i] = number[i];
      }
    }
    var full_phone = tele.join("");

    return full_phone;
  }
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  //defining dropdown
  const maritalStatus = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widow(er)" },
  ];
  const nationalityStatus = [
    { value: "Indian", label: "Indian" },
    { value: "Other", label: "Other" },
  ];
  // const state = [
  //   { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  //   { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  //   { value: "Assam", label: "Assam" },
  //   { value: "Bihar", label: "Bihar" },
  //   { value: "Chhattisgarh", label: "Chhattisgarh" },
  //   { value: "Goa", label: "Goa" },
  //   { value: "Gujarat", label: "Gujarat" },
  //   { value: "Haryana", label: "Haryana" },
  //   { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  //   { value: "Jharkhand", label: "Jharkhand" },
  //   { value: "West Bengal", label: "West Bengal" },
  // ];
  const title = [
    { value: "Mr.", label: "Mr." },
    { value: "Miss.", label: "Miss." },
  ];
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];
  const relation = [
    { value: "Spouse", label: "Spouse" },
    { value: "Child", label: "Child" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
  ];
  const bloodGroup = [
    { value: "A+", label: "A +" },
    { value: "A-", label: "A -" },
    { value: "B+", label: "B +" },
    { value: "B-", label: "B -" },
    { value: "AB+", label: "AB +" },
    { value: "AB-", label: "AB -" },
    { value: "O+", label: "O +" },
    { value: "O-", label: "O -" },
  ];
  const employmentStatus = [
    { value: "Employed", label: "Employed" },
    { value: "Unemployed", label: "Unemployed" },
    { value: "Self Employed", label: "Self Employed" },
    { value: "Retired", label: "Retired" },
    { value: "Other", label: "Other" },
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
      title: "",
      name: "",
      gender: "",
      relation: "",
      address: "",
      blood_group: "",
      contact_number: "",
      date_of_birth: "",
      marital_status: "",
      marriage_date: "",
      employment: "",
      proffesion: "",
      nationality: "",
      insurance_name: "",
      remarks: "",
      is_depend: "",
      health_insurance: "",
      file: "",
    },
    validationSchema: EmployeeFamilyInformationSchema,
    onSubmit: async (values) => {
      // Trim all values
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 10);
      formData.append("form", 3);
      formData.append("title", values?.title?.value || "");
      formData.append(
        "marriage_date",
        values.marriage_date
          ? moment(values.marriage_date).format("YYYY-MM-DD")
          : ""
      );
      formData.append("relation", values?.relation?.value || "");
      formData.append("blood_group", values?.blood_group?.value || "");
      formData.append("gender", values?.gender?.value || "");
      formData.append("marital_status", values?.marital_status?.value || "");
      formData.append("employment", values?.employment?.value || "");
      formData.append("nationality", values?.nationality?.value || "");
      formData.append(
        "date_of_birth",
        values.date_of_birth
          ? moment(values.date_of_birth).format("YYYY-MM-DD")
          : ""
      );
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : particularEmployeeDetails?.file
          ? particularEmployeeDetails.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append("address", trimmedValues.address);
      formData.append("contact_number", trimmedValues.contact_number);
      formData.append("proffesion", trimmedValues.proffesion);
      formData.append("insurance_name", trimmedValues.insurance_name);
      formData.append("remarks", trimmedValues.remarks);
      formData.append("is_depend", values.is_depend);
      formData.append("health_insurance", values.health_insurance);
      particularEmployeeDetails?.id
        ? formData.append("id", particularEmployeeDetails?.id)
        : "";
      particularEmployeeDetails?.id
        ? formData.append("key", "update")
        : formData.append("key", "create");

      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          particularEmployeeDetails?.hasOwnProperty("id")
            ? toast.success("Family information Updated successfully")
            : toast.success("Family information Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api errors
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
    <Box>
      <Accordion
        sx={{
          mb: "15px !important",
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          className="accordion-head"
        >
          Family Information
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.is_depend}
                onChange={(e) => setFieldValue("is_depend", e.target.checked)}
                name="is_depend"
              />
            }
            label="Is Dependent"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.health_insurance}
                onChange={(e) =>
                  setFieldValue("health_insurance", e.target.checked)
                }
                name="health_insurance"
              />
            }
            label="Health Insurance"
          />
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Title</InputLabel>
                <Select
                  placeholder="Select Title"
                  name="title"
                  options={title}
                  value={values.title}
                  onChange={(selectedOption) => {
                    setFieldValue("title", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.title && touched.title ? (
                  <Typography component="span" className="error-msg">
                    {errors.title}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Name<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  placeholder="Enter Name"
                  size="small"
                  value={values.name}
                  name="name"
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
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Gender<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Select Gender"
                  name="gender"
                  options={gender}
                  value={values.gender}
                  onChange={(selectedOption) => {
                    setFieldValue("gender", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
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
                  Relation<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Select Relation"
                  name="relation"
                  options={relation}
                  value={values.relation}
                  onChange={(selectedOption) => {
                    setFieldValue("relation", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.relation && touched.relation ? (
                  <Typography component="span" className="error-msg">
                    {errors.relation}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Address<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="Address"
                  placeholder="Enter address"
                  size="small"
                  value={values.address}
                  name="address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.address && touched.address ? (
                  <Typography component="span" className="error-msg">
                    {errors.address}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Blood Group</InputLabel>
                <Select
                  placeholder="Select Blood Group"
                  name="blood_group"
                  options={bloodGroup}
                  value={values.blood_group}
                  onChange={(selectedOption) => {
                    setFieldValue("blood_group", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.blood_group && touched.blood_group ? (
                  <Typography component="span" className="error-msg">
                    {errors.blood_group}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Contact Number<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="contact-number"
                  placeholder="Enter contact number"
                  size="small"
                  value={values.contact_number}
                  name="contact_number"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "contact_number", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.contact_number && touched.contact_number ? (
                  <Typography component="span" className="error-msg">
                    {errors.contact_number}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Date Of Birth</InputLabel>
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
                  onChange={(date) => setFieldValue("date_of_birth", date)}
                  name="date_of_birth"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Date Of Birth"
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
                <InputLabel className="fixlabel">Marital Status</InputLabel>
                <Select
                  placeholder="Select Marital Status"
                  name="marital_status"
                  options={maritalStatus}
                  value={values.marital_status}
                  onChange={(selectedOption) => {
                    setFieldValue("marital_status", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.marital_status && touched.marital_status ? (
                  <Typography component="span" className="error-msg">
                    {errors.marital_status}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Marriage Date</InputLabel>
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
                    values.marriage_date ? new Date(values.marriage_date) : null
                  }
                  onChange={(date) => setFieldValue("marriage_date", date)}
                  name="marriage_date"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Marriage Date"
                  autoComplete="off"
                />

                {errors.marriage_date && touched.marriage_date ? (
                  <Typography component="span" className="error-msg">
                    {errors.marriage_date}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Employment</InputLabel>
                <Select
                  placeholder="Employment Status"
                  name="employment"
                  options={employmentStatus}
                  value={values.employment}
                  onChange={(selectedOption) => {
                    setFieldValue("employment", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.employment && touched.employment ? (
                  <Typography component="span" className="error-msg">
                    {errors.employment}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Profession</InputLabel>
                <TextField
                  variant="outlined"
                  id="profession"
                  placeholder="Enter Profession"
                  size="small"
                  value={values.proffesion}
                  name="proffesion"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.proffesion && touched.proffesion ? (
                  <Typography component="span" className="error-msg">
                    {errors.proffesion}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Nationality<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Nationality Status"
                  name="nationality"
                  options={nationalityStatus}
                  value={values.nationality}
                  onChange={(selectedOption) => {
                    setFieldValue("nationality", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.nationality && touched.nationality ? (
                  <Typography component="span" className="error-msg">
                    {errors.nationality}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Insurance Name</InputLabel>
                <TextField
                  variant="outlined"
                  id="insurance-name"
                  placeholder="Enter insurance name"
                  size="small"
                  value={values.insurance_name}
                  name="insurance_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.insurance_name && touched.insurance_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.insurance_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Remarks</InputLabel>
                <TextField
                  variant="outlined"
                  id="remarks"
                  placeholder="Enter Remarks"
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
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Attach Document</InputLabel>
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
          <Stack
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            mt={4}
            mb={3}
          >
            <LoadingButton
              variant="contained"
              className="text-capitalize"
              color="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              {particularEmployeeDetails?.hasOwnProperty("id")
                ? "Update"
                : "Submit"}
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

          <Typography component="h2" className="heading-3" mb={2}>
            Family List
          </Typography>
          <TableContainer sx={{ maxHeight: 350 }} className="table table-striped scroll-y">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell width={200} align="left">
                    Name
                  </TableCell>
                  <TableCell width={200} align="left">
                    Gender
                  </TableCell>
                  <TableCell align="left">Relation</TableCell>
                  <TableCell align="left">Contact Number</TableCell>
                  <TableCell align="left">Date Of Birth</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(employeeDetails?.family_details || [])?.length > 0 ? (
                  employeeDetails.family_details.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <Typography component="p" mb={0}>
                            {data?.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          {data?.gender || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {data?.relation || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {data?.contact_number ? (
                            <>
                              {showPhoneNumber[index]
                                ? replacePhoneNumbers(data.contact_number)
                                : data.contact_number}
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => phonenumberToggle(index)}
                                edge="end"
                              >
                                {showPhoneNumber[index] ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {data?.date_of_birth ? (
                            <>
                              {showDob[index]
                                ? replacePhoneNumbers(
                                    moment(data.date_of_birth).format(
                                      "DD-MM-YYYY"
                                    )
                                  )
                                : moment(data.date_of_birth).format(
                                    "DD-MM-YYYY"
                                  )}
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  dobToggle(index);
                                }}
                                edge="end"
                              >
                                {showDob[index] ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {data?.file && (
                            <Tooltip title="Download file">
                              <a href={data?.file} target="_blank">
                                <IconButton aria-label="Download">
                                  <DownloadIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                </IconButton>
                              </a>
                            </Tooltip>
                          )}
                          <IconButton
                            aria-label="Edit"
                            color="primary"
                            onClick={() => {
                              particularFamilyInformation(data);
                            }}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => {
                              openDeleteFamily(data);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      {"No family details has been added"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {isDeleteOpen && (
        <EmployeeFamilyInformationDelete
          isDeleteOpen={isDeleteOpen}
          closeDeleteFamily={closeDeleteFamily}
          employeeDetails={employeeDetails}
          deleteFamilyData={deleteFamilyData}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
    </Box>
  );
};

export default EmployeeFamilyInformation;
