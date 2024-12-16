/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormGroup,
  TextField,
  InputLabel,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Select from "react-select";
import { useFormik } from "formik";
import { mapValues } from "lodash";
import { useAxios } from "@/contexts/AxiosProvider";
import * as Yup from "yup";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useTextEditor from "../../common/useTextEditor";

const AssignmentForm = ({
  unique_id,
  assignment,
  getInterViewDetail,
  id,
  assignmentFeedback,
}) => {
  const { TextEditor, getContent, setInitialValue } = useTextEditor({
    height: 200,
    initialValue: "",
  });
  // const toolbarConfig = {

  //   spellChecker: false,
  //   toolbar: [
  //     'bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview'
  //     // Omitting the image icon to disable it
  //     // Omitting the preview icon to disable it
  //   ]
  //   }
  //function to get oridinal suffix of the number
  const getOrdinalSuffix = useCallback((number) => {
    if (number === 1) {
      return "1st";
    } else if (number === 2) {
      return "2nd";
    } else if (number === 3) {
      return "3rd";
    } else if (number >= 4 && number <= 20) {
      return number + "th";
    }

    const lastDigit = number % 10; //if the number is two digits
    switch (lastDigit) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  }, []);

  // State to store employees
  const [employees, setEmployees] = useState([]);
  const { Axios } = useAxios();
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
  //defining dropdown list
  const candidateStatus = [
    { value: "Not Started", label: "Not Started" },
    { value: "In-Progress", label: "In-Progress" },
    { value: "Submitted", label: "Submitted" },
  ];

  const rating = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ];
  const interviewStatus = [
    { value: "Hold", label: "Hold" },
    { value: "Reject", label: "Reject" },
    { value: "Close", label: "Close" },
    { value: "Pass", label: "Pass" },
  ];
  //state to show loading animation when user will add assignment
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  // validation for assignment data
  const SUPPORTED_FORMATS = ["application/pdf", "application/doc"];
  const AssignmentSchema = Yup.object({
    [`status${unique_id}`]: Yup.object().required("Status Required"),
    [[`name${unique_id}`]]: Yup.string()
      .trim()
      .max(80, "Character must be less than or equal 80")
      .required("Assignment Name Required"),
    [`details${unique_id}`]: Yup.string()
      .trim()
      .max(1000, "Character must be less than or equal 1000")
      .required("Details Required"),

    file: Yup.mixed()
      .nullable()
      .test(
        "Fichier taille",
        "File should not be more than 5mb",
        function (value) {
        
          const { size } = this.parent.file || {};
          return !size || (size && size <= 1024 * 1024 * 5);
        }
      )
      .test(
        "format",
        "Upload correct file type 'DOC' and 'PDF' ",
        function (value) {
          const { type } = this.parent.file || {};
          return !this.parent?.file?.name
            ? true
            : "" || !type
            ? false
            : "" || (type && SUPPORTED_FORMATS.includes(type));
        }
      ),
    [`assignment_date${unique_id}`]: Yup.date().required(
      "Assignment Date Required"
    ),
    [`submission_date${unique_id}`]: Yup.date()
      .nullable()
      .when([`assignment_date${unique_id}`], (assignment_date, schema) => {
        return assignment_date && !isNaN(new Date(assignment_date))
          ? schema.min(
              new Date(assignment_date),
              "Submission date must be after the Assignment date"
            )
          : schema;
      }),

    [`interviewers${unique_id}`]: Yup.array()
      .min(1, "Assignor Required")
      .required("Assignor Required"),
  });

  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //function to get assignment data and send to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues: {
      [`interview_id${unique_id}`]: "",

      [`status${unique_id}`]: "",
      [`name${unique_id}`]: "",
      [`details${unique_id}`]: "",
      [`remarks${unique_id}`]: "",
      file: "",
      [`assignment_date${unique_id}`]: "",
      [`submission_date${unique_id}`]: "",
      [`interview_round${unique_id}`]: "",
      [`interviewers${unique_id}`]: [],
    },

    validationSchema: AssignmentSchema, // Validation schema
    onSubmit: async (values) => {
      setAssignmentLoading(true);
      // Trim values and create
      const data = trimmedValues({
        interview_id: values[`interview_id${unique_id}`] || "",
        interview_round: values[`interview_round${unique_id}`] || "",
        name: values[`name${unique_id}`] || "",
        details: values[`details${unique_id}`] || "",
        remarks: values[`remarks${unique_id}`] || "",
        status: values[`status${unique_id}`]?.value || "",
        assignment_date: values[`assignment_date${unique_id}`]
          ? moment(values[`assignment_date${unique_id}`]).format("YYYY-MM-DD")
          : null,
        submission_date: values[`submission_date${unique_id}`]
          ? moment(values[`submission_date${unique_id}`]).format("YYYY-MM-DD")
          : null,
        interviewers: values[`interviewers${unique_id}`].map(
          ({ value }) => value
        ),
      });

      // Append key-value pairs to FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        key !== "file" ? formData.append(key, value) : "";
      });
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : assignment?.assignment_document_url
          ? assignment.assignment_document_url
          : ""
      );
      // values[`interviewers${unique_id}`].map(
      //   ({ value },index) => formData.append(`interviewers[${index}]`,value)
      // )
      assignment.id ? formData.append("assignment_id", assignment.id) : ""; //if assignment id present , will send assignment id to update assignment data
      try {
        const res = await Axios.post(`interview/assignment`, formData);

        if (res.status && res.status >= 200 && res.status < 300) {
          assignment
            ? toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Assignment Updated Successfully`
              )
            : toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Assignment Sent Successfully`
              );

          if (id) {
            getInterViewDetail(id); //calling function to get interview details if id present
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || {}).forEach((key) => {
            errorObject[`${key}${unique_id}`] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
      } finally {
        setAssignmentLoading(false);
      }
    },
  });
  //validation for assignment feedback
  const AssignmentFeedbackSchema = Yup.object({
    [`feedback_status${unique_id}`]: Yup.object().required("Status Required"),
    [[`rating${unique_id}`]]: Yup.object().required(
      "Assignment Rating Required"
    ),
    [`feedback${unique_id}`]: Yup.string()
      .trim()
      .max(3000, "Character must be less than or equal 30000")
      .required("Feedback Required"),

    [`feedback_submission_date${unique_id}`]: Yup.date().required(
      "Feedback Submission Date Required"
    ),
  });

  // Trim all string values in the 'values' object
  const feedbackTrimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //state to show loading animation when user will add assignment feedback
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  //function to get assignment feedback data and send to the api
  const {
    values: feedback_values,
    errors: feedback_errors,
    handleChange: feedback_handleChange,
    handleSubmit: feedback_handleSubmit,
    touched: feedback_touched,
    handleBlur: feedback_handleBlur,
    setFieldValue: feedback_setFieldValue,
  } = useFormik({
    initialValues: {
      [`feedback_status${unique_id}`]: "",
      [`rating${unique_id}`]: "",
      [`feedback${unique_id}`]: "",
      [`feedback_submission_date${unique_id}`]: "",
    },

    validationSchema: AssignmentFeedbackSchema, // Validation schema
    onSubmit: async (values) => {
      setFeedbackLoading(true);
      // Trim values
      const payload = feedbackTrimmedValues({
        interview_id: id || "",
        assignment_id: assignment?.id || "",
        status: values[`feedback_status${unique_id}`]?.value || "",
        rating: values[`rating${unique_id}`]?.value || "",
        feedback: values[`feedback${unique_id}`] || "",
        feedback_submission_date: values[`feedback_submission_date${unique_id}`]
          ? moment(values[`feedback_submission_date${unique_id}`]).format(
              "YYYY-MM-DD"
            )
          : "",
      });

      try {
        const res = await Axios.post(`interview/assignment-feedback`, payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          assignmentFeedback
            ? toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Assignment Feedback Updated Successfully`
              )
            : toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Assignment Feedback Added Successfully`
              );

          if (id) {
            getInterViewDetail(id); //calling function to get interview details
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || {}).forEach((key) => {
            errorObject[`${key}${unique_id}`] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
      } finally {
        setFeedbackLoading(false);
      }
    },
  });

  // Function to fetch employees from the server
  const getEmployees = useCallback(async () => {
    try {
      // Make the API request to fetch employees
      const res = await Axios.get("/user/list");

      // Update date with the fetched employees, or set to an empty array if undefined
      setEmployees(
        (res.data?.data || []).map((m) => {
          return {
            value: m.id || "",
            label: `${m?.honorific ? `${m.honorific} ` : ""}${
              m?.first_name || ""
            } ${m?.middle_name ? `${m.middle_name} ` : ""}${
              m?.last_name || ""
            }-${m.employee_id || ""}`,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching leave types", error);
    }
  }, []);
  //useeffect to get employees details when component will mount
  useEffect(() => {
    getEmployees();
    // setInterviewers();
  }, []);
  //useeffect to store assignment and assignment feedback data if data already present for update
  useEffect(() => {
    setFieldValue(`interview_id${unique_id}`, id || "");
    setFieldValue(`name${unique_id}`, assignment?.name || "");
    setFieldValue(`details${unique_id}`, assignment?.details || "");
    setFieldValue(`remarks${unique_id}`, assignment?.remarks || "");
    setFieldValue(
      `file`,
      assignment?.assignment_document_url?.split("/")?.pop() || ""
    );
    setFieldValue(
      `assignment_date${unique_id}`,
      assignment?.assignment_date || ""
    );
    setFieldValue(
      `submission_date${unique_id}`,
      assignment?.submission_date || ""
    );
    setFieldValue(
      `interview_round${unique_id}`,
      assignment?.interview_round || `${getOrdinalSuffix(unique_id + 1)} Round`
    );
    setFieldValue(
      `interviewers${unique_id}`,
      (assignment?.interviewers || []).length > 0
        ? (assignment?.interviewers || []).map((m) => ({
            label: `${m.user?.honorific ? `${m.user?.honorific} ` : ""}${
              m.user?.first_name || ""
            } ${m.user?.middle_name ? `${m.user.middle_name} ` : ""}${
              m.user?.last_name || ""
            } - ${m.user?.employee_id || ""}`,
            value: m.user?.id || "",
          }))
        : ""
    );

    setFieldValue(
      `status${unique_id}`,
      assignment?.status
        ? { label: assignment?.status, value: assignment?.status }
        : ""
    );
    feedback_setFieldValue(
      `feedback_status${unique_id}`,
      assignmentFeedback?.status
        ? {
            label: assignmentFeedback?.status,
            value: assignmentFeedback?.status,
          }
        : ""
    );
    feedback_setFieldValue(
      `rating${unique_id}`,
      assignmentFeedback?.rating
        ? {
            label: assignmentFeedback?.rating,
            value: assignmentFeedback?.rating,
          }
        : ""
    );
    feedback_setFieldValue(
      `feedback_submission_date${unique_id}`,
      assignmentFeedback?.feedback_submission_date || ""
    );
    feedback_setFieldValue(
      `feedback${unique_id}`,
      assignmentFeedback?.feedback || ""
    );
    setInitialValue(assignmentFeedback?.feedback || "");
  }, [assignment, assignmentFeedback]);
  const getEditorChangeFunc = (value) => {
    feedback_setFieldValue(`feedback${unique_id}`, value);
  };
  return (
    <React.Fragment>
      <Accordion
        sx={{
          mt: 2,
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {`${getOrdinalSuffix(unique_id + 1)} Round Assignment`}
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Assignment Name<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter Assignment Name"
                  size="small"
                  name={`name${unique_id}`}
                  value={values[`name${unique_id}`]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors[`name${unique_id}`] && touched[`name${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`name${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Assignment Details<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Enter Assignment Details"
                  size="small"
                  name={`details${unique_id}`}
                  value={values[`details${unique_id}`]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors[`details${unique_id}`] &&
                touched[`details${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`details${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Assignment Date<span>*</span>
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
                    values[`assignment_date${unique_id}`]
                      ? new Date(values[`assignment_date${unique_id}`])
                      : null
                  }
                  onChange={(date) => {
                    setFieldValue(`assignment_date${unique_id}`, date);
                  }}
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Assignment Date"
                  autoComplete="off"
                  name={`assignment_date${unique_id}`}
                />
                {errors[`assignment_date${unique_id}`] &&
                touched[`assignment_date${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`assignment_date${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Submission Date</InputLabel>
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
                    values[`submission_date${unique_id}`]
                      ? new Date(values[`submission_date${unique_id}`])
                      : null
                  }
                  onChange={(date) =>
                    setFieldValue(`submission_date${unique_id}`, date)
                  }
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="Submission Date"
                  autoComplete="off"
                  name={`submission_date${unique_id}`}
                />
                {errors[`submission_date${unique_id}`] &&
                touched[`submission_date${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`submission_date${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Attachment <small>(Pdf, Doc - up to 5 MB)</small>
                </InputLabel>
                <Box component="div" className="choosefile">
                  <Typography
                    component="label"
                    htmlFor={`file-upload-${unique_id}`} // Use unique_id to generate unique ID
                    style={{ cursor: "pointer" }}
                  >
                    {values.file?.name
                      ? values.file.name
                      : values.file
                      ? values.file
                      : "Choose File"}
                  </Typography>
                  <input
                    type="file"
                    id={`file-upload-${unique_id}`} // Use unique_id to generate unique IDs
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                    }}
                    name="file"
                    onBlur={handleBlur}
                    style={{ cursor: "pointer" }}
                  />
                  <Typography
                    component="label"
                    htmlFor={`file-upload-${unique_id}`} // Use unique_id to generate unique IDs
                    className="choosefile-button"
                  >
                    Browse
                  </Typography>
                  {errors.file && touched.file ? (
                    <Typography component="span" className="error-msg">
                      {errors.file}
                    </Typography>
                  ) : null}
                </Box>
              </FormGroup>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Status<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Candidate Status"
                  onChange={(values) =>
                    setFieldValue(`status${unique_id}`, values)
                  }
                  value={values[`status${unique_id}`]}
                  options={candidateStatus}
                  name={`status${unique_id}`}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                  onBlur={handleBlur}
                />
                {errors[`status${unique_id}`] &&
                touched[`status${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`status${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Assignor<span>*</span>
                </InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`interviewers${unique_id}`, values)
                  }
                  value={values[`interviewers${unique_id}`]}
                  options={employees}
                  name={`interviewers${unique_id}`}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                  placeholder="Search Employee"
                  isMulti
                  onBlur={handleBlur}
                />
                {errors[`interviewers${unique_id}`] &&
                touched[`interviewers${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interviewers${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Interview Stage</InputLabel>
                <TextField
                  variant="outlined"
                  id="outlined-basic"
                  placeholder="Interview Stage"
                  className="cursor-nodrop"
                  size="small"
                  // name={`name${unique_id}`}
                  value={values[`interview_round${unique_id}`]}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  inputProps={{
                    readOnly: true,
                  }}
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  color="primary"
                  onClick={handleSubmit}
                  loading={assignmentLoading}
                >
                  {assignment ? "Update" : "Save"}
                </LoadingButton>
                <Link to={"/candidate-list"}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="text-capitalize"
                  >
                    Cancel
                  </Button>
                </Link>
              </Stack>
            </Grid>
          </Grid>
          {(assignment.status === "Submitted" && (
            <>
              <Typography
                component={"h5"}
                className="heading-5 border-0"
                sx={{ mt: 4 }}
              >
                Assignment Feedback
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Status<span>*</span>
                    </InputLabel>
                    <Select
                      onChange={(values) =>
                        feedback_setFieldValue(
                          `feedback_status${unique_id}`,
                          values
                        )
                      }
                      value={feedback_values[`feedback_status${unique_id}`]}
                      name={`feedback_status${unique_id}`}
                      placeholder="Select Status"
                      options={interviewStatus}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                      onBlur={feedback_handleBlur}
                    />
                    {feedback_errors[`feedback_status${unique_id}`] &&
                    feedback_touched[`feedback_status${unique_id}`] ? (
                      <Typography component="span" className="error-msg">
                        {feedback_errors[`feedback_status${unique_id}`]}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Assignment Rating<span>*</span>
                    </InputLabel>
                    <Select
                      onChange={(values) =>
                        feedback_setFieldValue(`rating${unique_id}`, values)
                      }
                      value={feedback_values[`rating${unique_id}`]}
                      name={`rating${unique_id}`}
                      placeholder="Select Rating"
                      options={rating}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                      onBlur={feedback_handleBlur}
                    />
                    {feedback_errors[`rating${unique_id}`] &&
                    feedback_touched[`rating${unique_id}`] ? (
                      <Typography component="span" className="error-msg">
                        {feedback_errors[`rating${unique_id}`]}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Feedback Submission Date<span>*</span>
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
                        feedback_values[`feedback_submission_date${unique_id}`]
                          ? new Date(
                              feedback_values[
                                `feedback_submission_date${unique_id}`
                              ]
                            )
                          : null
                      }
                      onChange={(date) => {
                        feedback_setFieldValue(
                          `feedback_submission_date${unique_id}`,
                          date
                        );
                      }}
                      name={`feedback_submission_date${unique_id}`}
                      className="dateTime-picker calender-icon"
                      placeholderText="Feedback Submission Date"
                      autoComplete="off"
                      onBlur={feedback_handleBlur}
                    />
                    {feedback_errors[`feedback_submission_date${unique_id}`] &&
                    feedback_touched[`feedback_submission_date${unique_id}`] ? (
                      <Typography component="span" className="error-msg">
                        {
                          feedback_errors[
                            `feedback_submission_date${unique_id}`
                          ]
                        }
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={10} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Feedback<span>*</span>
                    </InputLabel>

                    <TextEditor getEditorChangeFunc={getEditorChangeFunc} />
                    {/* <SimpleMDE
                      value={feedback_values[`feedback${unique_id}`]}
                      onChange={(value) => {
                        feedback_setFieldValue(`feedback${unique_id}`, value);
                      }}
                      onBlur={feedback_handleBlur}
                      // options={toolbarConfig}
                    /> */}
                    {feedback_errors[`feedback${unique_id}`] &&
                    feedback_touched[`feedback${unique_id}`] ? (
                      <Typography component="span" className="error-msg">
                        {feedback_errors[`feedback${unique_id}`]}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
              </Grid>{" "}
              <br />
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  color="primary"
                  onClick={feedback_handleSubmit}
                  loading={feedbackLoading}
                >
                  {assignmentFeedback ? "Update" : "Save"}
                </LoadingButton>
                <Link to={"/candidate-list"}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="text-capitalize"
                  >
                    Cancel
                  </Button>
                </Link>
              </Stack>
            </>
          )) ||
            ""}
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
};

export default AssignmentForm;
