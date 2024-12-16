/* eslint-disable react/prop-types */
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
import DatePicker from "react-datepicker";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Select from "react-select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mapValues } from "lodash";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import moment from "moment";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { EmployeeQualificationSchema } from "@/validations/EmployeeQualificationSchema";
import EmployeeQualificationDelete from "./EmployeeQualificationDelete";
import { getYear, getMonth } from "date-fns";
import DownloadIcon from "@mui/icons-material/Download";
const EmployeeQualificationDetails = ({
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
  //state to open delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  //state to store delete data
  const [deleteQualificationData, setDeleteQualificationData] = useState("");

  const openDeleteQualification = (data) => {
    setIsDeleteOpen(true);
    setDeleteQualificationData(data);
  };
  const closeDeleteQualification = () => {
    setIsDeleteOpen(false);
  };
  //state to store particular family details for update
  const [particularQualificationDetails, setParticularQualificationDetails] =
    useState({});
  //function to reset data
  const reset = () => {
    resetForm();
    setParticularQualificationDetails(() => {});
  };
  //function to store value for update
  const particularQualificationInformation = (data) => {
    setParticularQualificationDetails(() => {
      return data;
    });
    setFieldValue("year", data?.year || "");
    setFieldValue("to_date", data?.to_date || "");
    setFieldValue("from_date", data?.from_date || "");
    setFieldValue(
      "grade",
      data?.grade
        ? {
            label: data.grade,
            value: data.grade,
          }
        : ""
    );
    setFieldValue(
      "qualification",
      data?.qualification
        ? {
            label: data.qualification,
            value: data.qualification,
          }
        : ""
    );
    setFieldValue(
      "stream_type",
      data?.stream_type
        ? {
            label: data.stream_type,
            value: data.stream_type,
          }
        : ""
    );
    setFieldValue("percentage", data?.percentage || "");
    setFieldValue("specialization", data?.specialization || "");
    setFieldValue("institute_name", data?.institute_name || "");
    setFieldValue("university_name", data?.university_name || "");
    setFieldValue("date_of_passing", data?.date_of_passing || "");
    setFieldValue(
      "nature_of_course",
      data?.nature_of_course
        ? {
            label: data.nature_of_course,
            value: data.nature_of_course,
          }
        : ""
    );
    setFieldValue("duration_of_course", data?.duration_of_course || "");
    setFieldValue(
      "qualification_status",
      data?.qualification_status
        ? {
            label: data.qualification_status,
            value: data.qualification_status,
          }
        : ""
    );
    setFieldValue(
      "is_highest_qualification",
      data?.is_highest_qualification || ""
    );
    setFieldValue(
      "qualification_course_type",
      data?.qualification_course_type || ""
    );
    setFieldValue("remarks", data?.remarks || "");
    setFieldValue(
      "file",
      data?.document_url ? data.document_url.split("/").pop() : ""
    );
  };
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  const qualifications = [
    { value: "10th", label: "10th" },
    { value: "12th", label: "High Secondary" },
    { value: "Graduation", label: "Graduation" },
    { value: "Post Graduation", label: "Post Graduation" },
    { value: "Doctorate Degree", label: "Doctorate Degree" },
  ];
  const grade = [
    { value: "A+", label: "A+" },
    { value: "A", label: "A" },
    { value: "B+", label: "B+" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];
  const streamType = [
    { value: "General", label: "General" },
    { value: "ECA", label: "Engineering & Computer Application" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
    { value: "EE", label: "Electronics and Electrical Engineering" },
    { value: "IT", label: "Information Technology" },
    { value: "ECOTech", label: "Eco Tech" },
  ];
  const natureCourse = [
    { value: "Regular", label: "Regular Course" },
    { value: "Distance", label: "Distance Learning" },
  ];
  const courseStatus = [
    { value: "Running", label: "Running" },
    { value: "Completed", label: "Completed" },
    { value: "Paused", label: "Paused" },
    { value: "Dropout", label: "Dropout" },
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
      year: "",
      grade: "",
      qualification: "",
      to_date: "",
      from_date: "",
      stream_type: "",
      percentage: "",
      specialization: "",
      institute_name: "",
      university_name: "",
      date_of_passing: "",
      nature_of_course: "",
      duration_of_course: "",
      qualification_status: "",
      is_highest_qualification: "",
      qualification_course_type: "",
      remarks: "",
      file: "",
    },
    validationSchema: EmployeeQualificationSchema,
    onSubmit: async (values) => {
      // Trim all string
      const trimValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 10);
      formData.append("form", 5);
      formData.append("year", trimValues.year || "");
      formData.append("grade", values?.grade?.value || "");
      formData.append("percentage", trimValues.percentage || "");
      formData.append("specialization", trimValues.specialization || "");
      formData.append("institute_name", trimValues.institute_name || "");
      formData.append("university_name", trimValues.university_name || "");
      formData.append("remarks", trimValues.remarks || "");
      formData.append("qualification", values?.qualification?.value || "");
      formData.append(
        "duration_of_course",
        trimValues.duration_of_course || ""
      );
      formData.append(
        "qualification_course_type",
        trimValues.qualification_course_type || ""
      );
      formData.append(
        "is_highest_qualification",
        values.is_highest_qualification || ""
      );
      formData.append(
        "to_date",
        values.to_date ? moment(values.to_date).format("YYYY-MM-DD") : ""
      );
      formData.append(
        "from_date",
        values.from_date ? moment(values.from_date).format("YYYY-MM-DD") : ""
      );
      formData.append(
        "date_of_passing",
        values.date_of_passing
          ? moment(values.date_of_passing).format("YYYY-MM-DD")
          : ""
      );
      formData.append("stream_type", values?.stream_type?.value || "");
      formData.append(
        "nature_of_course",
        values?.nature_of_course?.value || ""
      );
      formData.append(
        "qualification_status",
        values?.qualification_status?.value || ""
      );
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.qualifications?.file
          ? employeeDetails.qualifications.file
          : ""
      );
      particularQualificationDetails?.id
        ? formData.append("key", "update")
        : formData.append("key", "create");
      particularQualificationDetails?.id
        ? formData.append("id", particularQualificationDetails.id)
        : "";
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          particularQualificationDetails?.hasOwnProperty("id")
            ? toast.success("Qualification details Updated successfully")
            : toast.success("Qualification details Added successfully");
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
          aria-controls="panel5-content"
          id="panel5-header"
          className="accordion-head"
        >
          Qualification Details{" "}
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Qualifications<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Select Qualifications"
                  name="qualifications"
                  options={qualifications}
                  value={values.qualification}
                  onChange={(selectedOption) => {
                    setFieldValue("qualification", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.qualification && touched.qualification ? (
                  <Typography component="span" className="error-msg">
                    {errors.qualification}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Stream Type<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Stream Type"
                  name="stream_type"
                  options={streamType}
                  value={values.stream_type}
                  onChange={(selectedOption) => {
                    setFieldValue("stream_type", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.stream_type && touched.stream_type ? (
                  <Typography component="span" className="error-msg">
                    {errors.stream_type}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Qualification Course Type
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="courseType"
                  placeholder="Enter the course"
                  size="small"
                  value={values.qualification_course_type}
                  onChange={handleChange}
                  name="qualification_course_type"
                  onBlur={handleBlur}
                />
                {errors.qualification_course_type &&
                touched.qualification_course_type ? (
                  <Typography component="span" className="error-msg">
                    {errors.qualification_course_type}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Specialization<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="specialization"
                  placeholder="Specialization with"
                  size="small"
                  value={values.specialization}
                  onChange={handleChange}
                  name="specialization"
                  onBlur={handleBlur}
                />
                {errors.specialization && touched.specialization ? (
                  <Typography component="span" className="error-msg">
                    {errors.specialization}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Nature Of Course</InputLabel>
                <Select
                  placeholder="Nature Of Course"
                  name="nature_of_course"
                  options={natureCourse}
                  value={values.nature_of_course}
                  onChange={(selectedOption) => {
                    setFieldValue("nature_of_course", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.nature_of_course && touched.nature_of_course ? (
                  <Typography component="span" className="error-msg">
                    {errors.nature_of_course}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Qualification Status
                </InputLabel>
                <Select
                  placeholder="Course Status"
                  name="qualification_status"
                  options={courseStatus}
                  value={values.qualification_status}
                  onChange={(selectedOption) => {
                    setFieldValue("qualification_status", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.qualification_status && touched.qualification_status ? (
                  <Typography component="span" className="error-msg">
                    {errors.qualification_status}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Institute Name<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="institute-name"
                  placeholder="Enter institute name"
                  size="small"
                  value={values.institute_name}
                  onChange={handleChange}
                  name="institute_name"
                  onBlur={handleBlur}
                />
                {errors.institute_name && touched.institute_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.institute_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  University Name<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="university-name"
                  placeholder="Enter university name"
                  size="small"
                  value={values.university_name}
                  onChange={handleChange}
                  name="university_name"
                  onBlur={handleBlur}
                />
                {errors.university_name && touched.university_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.university_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">From Date</InputLabel>

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
                    values.from_date ? new Date(values.from_date) : null
                  }
                  onChange={(date) => setFieldValue("from_date", date)}
                  name="from_date"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="From Date"
                  autoComplete="off"
                />

                {errors.from_date && touched.from_date ? (
                  <Typography component="span" className="error-msg">
                    {errors.from_date}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">To Date</InputLabel>
                <DatePicker
                  selected={values.to_date ? new Date(values.to_date) : null}
                  onChange={(date) => setFieldValue("to_date", date)}
                  name="to_date"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="End Date"
                />
                {errors.to_date && touched.to_date ? (
                  <Typography component="span" className="error-msg">
                    {errors.to_date}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Date Of Passing</InputLabel>

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
                    values.date_of_passing
                      ? new Date(values.date_of_passing)
                      : null
                  }
                  onChange={(date) => setFieldValue("date_of_passing", date)}
                  name="date_of_passing"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Passing Date"
                  autoComplete="off"
                />

                {errors.date_of_passing && touched.date_of_passing ? (
                  <Typography component="span" className="error-msg">
                    {errors.date_of_passing}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Percentage<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="percentage"
                  placeholder="Enter Percentage"
                  size="small"
                  value={values.percentage}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "percentage", value: numericValue },
                    });
                  }}
                  name="percentage"
                  onBlur={handleBlur}
                />
                {errors.percentage && touched.percentage ? (
                  <Typography component="span" className="error-msg">
                    {errors.percentage}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Grade</InputLabel>

                <Select
                  placeholder="Select grade"
                  name="grade"
                  options={grade}
                  value={values.grade}
                  onChange={(selectedOption) => {
                    setFieldValue("grade", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.grade && touched.grade ? (
                  <Typography component="span" className="error-msg">
                    {errors.grade}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Duration Of Course</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="course-duration"
                  placeholder="Enter duration"
                  size="small"
                  value={values.duration_of_course}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "duration_of_course",
                        value: numericValue,
                      },
                    });
                  }}
                  name="duration_of_course"
                  onBlur={handleBlur}
                />
                {errors.duration_of_course && touched.duration_of_course ? (
                  <Typography component="span" className="error-msg">
                    {errors.duration_of_course}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Year</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="course-year"
                  placeholder="Enter Year"
                  size="small"
                  value={values.year}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "year", value: numericValue },
                    });
                  }}
                  name="year"
                  onBlur={handleBlur}
                />
                {errors.year && touched.year ? (
                  <Typography component="span" className="error-msg">
                    {errors.year}
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
                  onChange={handleChange}
                  name="remarks"
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
                    htmlFor="file-upload1"
                    id="file-upload-filename1"
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
                    id="file-upload1"
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                    }}
                    onBlur={handleBlur}
                  />
                  <Typography
                    component="label"
                    htmlFor="file-upload1"
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
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <InputLabel className="fixlabel">&nbsp;</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.is_highest_qualification}
                    onChange={(e) =>
                      setFieldValue(
                        "is_highest_qualification",
                        e.target.checked
                      )
                    }
                    name="is_highest_qualification"
                  />
                }
                label="Is Highest Qualification"
              />
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
              {particularQualificationDetails?.hasOwnProperty("id")
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
            Qualification Details
          </Typography>
          <TableContainer
            sx={{ maxHeight: 350 }}
            className="table-striped scroll-y"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    width={100}
                    align="left"
                    className="text-uppercase"
                  >
                    Qualification Name
                  </TableCell>
                  <TableCell width={80} align="left" className="text-uppercase">
                    Stream
                  </TableCell>
                  <TableCell
                    width={150}
                    align="left"
                    className="text-uppercase"
                  >
                    Specialization
                  </TableCell>
                  <TableCell
                    width={200}
                    align="left"
                    className="text-uppercase"
                  >
                    Institute Name
                  </TableCell>
                  <TableCell
                    width={200}
                    align="left"
                    className="text-uppercase"
                  >
                    University Name
                  </TableCell>
                  <TableCell width={80} align="left" className="text-uppercase">
                    Percentage
                  </TableCell>
                  <TableCell
                    width={100}
                    align="center"
                    className="text-uppercase"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(employeeDetails?.qualifications || [])?.length > 0 ? (
                  employeeDetails.qualifications.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <Typography component="p" mb={0}>
                            {data?.qualification || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          {data?.stream_type || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {data?.specialization || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {data?.institute_name || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {data?.university_name || "N/A"}
                        </TableCell>
                        <TableCell align="left">
                          {" "}
                          {data?.percentage || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {data?.document_url && (
                            <Tooltip title="Download file">
                              <a href={data?.document_url} target="_blank">
                                <IconButton aria-label="Download">
                                  <DownloadIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                </IconButton>
                              </a>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton
                              aria-label="Edit"
                              color="primary"
                              onClick={() => {
                                particularQualificationInformation(data);
                              }}
                            >
                              <ModeEditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => {
                                openDeleteQualification(data);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      {"No Qualification details has been added"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {isDeleteOpen && (
        <EmployeeQualificationDelete
          isDeleteOpen={isDeleteOpen}
          closeDeleteQualification={closeDeleteQualification}
          employeeDetails={employeeDetails}
          deleteQualificationData={deleteQualificationData}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
    </Box>
  );
};

export default EmployeeQualificationDetails;
