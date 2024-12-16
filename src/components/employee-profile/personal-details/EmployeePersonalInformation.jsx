/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { EmployeePersonalInformationSchema } from "@/validations/EmployeePersonalInformationSchema";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const EmployeePersonalInformation = ({
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
        personal_email: "",
        hobbies: "",
        religion: "",
        nationality: "",
        father_name: "",
        mother_name: "",
        spouse_name: "",
        marriage_date: "",
        marital_status: "",
        state_of_birth: "",
        place_of_birth: "",
        country_of_birth: "",
        confirmation_date: "",
        identification_mark1: "",
        identification_mark2: "",
        physical_disabilities: "",
      },
    });
  };
  //function to trim all value
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  //defining dropdown
  const maritalStatus = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widow(er)" },
  ];
  const religionStatus = [
    { value: "Christianity", label: "Christianity" },
    { value: "Islam", label: "Islam" },
    { value: "Buddhism", label: "Buddhism" },
    { value: "Hinduism", label: "Hinduism" },
  ];
  const nationalityStatus = [
    { value: "Indian", label: "Indian" },
    { value: "Other", label: "Other" },
  ];
  const country = [
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "UK", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "Japan", label: "Japan" },
    { value: "South Africa", label: "South Africa" },
  ];

  const physicalDisabilities = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
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
    //storing values
    initialValues: {
      personal_email: employeeDetails?.personal_details?.personal_email || "",
      hobbies: employeeDetails?.personal_details?.hobbies || "",
      religion: employeeDetails?.personal_details?.religion
        ? {
            label: employeeDetails.personal_details.religion,
            value: employeeDetails.personal_details.religion,
          }
        : "",
      nationality: employeeDetails?.personal_details?.nationality
        ? {
            label: employeeDetails.personal_details.nationality,
            value: employeeDetails.personal_details.nationality,
          }
        : "",
      father_name: employeeDetails?.personal_details?.father_name || "",
      mother_name: employeeDetails?.personal_details?.mother_name || "",
      spouse_name: employeeDetails?.personal_details?.spouse_name || "",
      marriage_date: employeeDetails?.personal_details?.marriage_date || "",
      marital_status: employeeDetails?.personal_details?.marital_status
        ? {
            label: employeeDetails.personal_details.marital_status,
            value: employeeDetails.personal_details.marital_status,
          }
        : "",
      state_of_birth: employeeDetails?.personal_details?.state_of_birth || "",
      place_of_birth: employeeDetails?.personal_details?.place_of_birth || "",
      country_of_birth: employeeDetails?.personal_details?.country_of_birth
        ? {
            label: employeeDetails.personal_details.country_of_birth,
            value: employeeDetails.personal_details.country_of_birth,
          }
        : "",
      confirmation_date:
        employeeDetails?.personal_details?.confirmation_date || "",
      identification_mark1:
        employeeDetails?.personal_details?.identification_mark1 || "",
      identification_mark2:
        employeeDetails?.personal_details?.identification_mark2 || "",
      physical_disabilities: employeeDetails?.personal_details
        ?.physical_disabilities
        ? {
            label: employeeDetails.personal_details.physical_disabilities,
            value: employeeDetails.personal_details.physical_disabilities,
          }
        : "",
    },
    validationSchema: EmployeePersonalInformationSchema,
    onSubmit: async (values) => {
      //storing and triming user input
      const payload = trimValues({
        ...values,
        user_id: employeeDetails.id,
        step: 10,
        form: 1,
        marital_status: values.marital_status.value,
        marriage_date: values.marriage_date
          ? moment(values.marriage_date).format("YYYY-MM-DD")
          : "",
        religion: values.religion.value,
        nationality: values.nationality.value,
        country_of_birth: values.country_of_birth.value,

        physical_disabilities: values.physical_disabilities.value,
        confirmation_date: values.confirmation_date
          ? moment(values.confirmation_date).format("YYYY-MM-DD")
          : "",
      });
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          employeeDetails.personal_details
            ? toast.success("Personal information Updated successfully")
            : toast.success("Personal information Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error 1
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
    <Box>
      <Typography component="h2" className="heading-5" mb={2}>
        Personal Details
      </Typography>
      <Accordion
        sx={{
          mb: '15px !important',
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="accordion-head"
        >
          Personal Information
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Father Name</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter father name"
                  size="small"
                  name="father_name"
                  value={values.father_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.father_name && touched.father_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.father_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Mother Name</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter mother name"
                  size="small"
                  name="mother_name"
                  value={values.mother_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.mother_name && touched.mother_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.mother_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Marital Status<span>*</span></InputLabel>
                <Select
                  placeholder="Select Marital Status"
                  name="marital_statuse"
                  options={maritalStatus}
                  value={values.marital_status}
                  onChange={(selectedOption) => {
                    setFieldValue("marital_status", selectedOption);
                  }}
                  onBlur={handleBlur}
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
                  onChange={(date) => {
                  
                    setFieldValue("marriage_date", date);
                  }}
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
                <InputLabel className="fixlabel">Spouse Name</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter spouse name"
                  size="small"
                  name="spouse_name"
                  value={values.spouse_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.spouse_name && touched.spouse_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.spouse_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Personal Email ID<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter email id"
                  size="small"
                  name="personal_email"
                  value={values.personal_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.personal_email && touched.personal_email ? (
                  <Typography component="span" className="error-msg">
                    {errors.personal_email}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Religion</InputLabel>
                <Select
                  placeholder="Select Religion"
                  name="religion"
                  options={religionStatus}
                  value={values.religion}
                  onChange={(selectedOption) => {
                    setFieldValue("religion", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.religion && touched.religion ? (
                  <Typography component="span" className="error-msg">
                    {errors.religion}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Nationality<span>*</span></InputLabel>
                <Select
                  placeholder="Select Nationality"
                  name="nationality"
                  options={nationalityStatus}
                  value={values.nationality}
                  onBlur={handleBlur}
                  onChange={(selectedOption) => {
                    setFieldValue("nationality", selectedOption);
                  }}
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
                <InputLabel className="fixlabel">Country Of Birth<span>*</span></InputLabel>
                <Select
                  placeholder="Country Of Birth"
                  name="country_of_birth"
                  maxMenuHeight={250}
                  options={country}
                  value={values.country_of_birth}
                  onChange={(selectedOption) => {
                    setFieldValue("country_of_birth", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.country_of_birth && touched.country_of_birth ? (
                  <Typography component="span" className="error-msg">
                    {errors.country_of_birth}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">State Of Birth<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter State of birth"
                  size="small"
                  name="state_of_birth"
                  value={values.state_of_birth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.state_of_birth && touched.state_of_birth ? (
                  <Typography component="span" className="error-msg">
                    {errors.state_of_birth}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Place Of Birth</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Place Of Birth"
                  size="small"
                  name="place_of_birth"
                  value={values.place_of_birth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.place_of_birth && touched.place_of_birth ? (
                  <Typography component="span" className="error-msg">
                    {errors.place_of_birth}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Physical Disabilities<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Physical Disabilities"
                  name="physical-disabilities"
                  maxMenuHeight={250}
                  options={physicalDisabilities}
                  value={values.physical_disabilities}
                  onChange={(selectedOption) =>
                    setFieldValue("physical_disabilities", selectedOption)
                  }
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.physical_disabilities &&
                touched.physical_disabilities ? (
                  <Typography component="span" className="error-msg">
                    {errors.physical_disabilities}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Identification Mark 1
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Identification Mark 1"
                  size="small"
                  value={values.identification_mark1}
                  name="identification_mark1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.identification_mark1 && touched.identification_mark1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.identification_mark1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Identification Mark 2
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Identification Mark 2"
                  size="small"
                  value={values.identification_mark2}
                  name="identification_mark2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.identification_mark2 && touched.identification_mark2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.identification_mark2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Hobbies</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter Hobbies"
                  size="small"
                  value={values.hobbies}
                  name="hobbies"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.hobbies && touched.hobbies ? (
                  <Typography component="span" className="error-msg">
                    {errors.hobbies}
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
                  onChange={(date) => setFieldValue("confirmation_date", date)}
                  name="confirmation_date"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Confirmation Date"
                  autoComplete="off"
                />

                {errors.confirmation_date && touched.confirmation_date ? (
                  <Typography component="span" className="error-msg">
                    {errors.confirmation_date}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
          </Grid>
          <Stack spacing={2} direction="row" justifyContent="flex-start" mt={4}>
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EmployeePersonalInformation;
