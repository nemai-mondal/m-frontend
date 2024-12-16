/* eslint-disable no-unused-vars */
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
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { mapValues } from "lodash";
import moment from "moment";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import useTextEditor from "../../common/useTextEditor";
const ScheduleIntervieweForm = ({
  unique_id,
  scheduledInterview,
  getInterViewDetail,
  id,
  scheduledInterviewFeedback,
  name,
  profile,
  totalAssignmentRound,
}) => {
  const { TextEditor, getContent, setInitialValue } = useTextEditor({
    height: 200,
    initialValue: "",
  });
  const { TextEditor:TextEditor1, getContent:getContent1, setInitialValue:setInitialValue1 } = useTextEditor({
    height: 200,
    initialValue: "",
  });
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
  //defining dropdown
  const selectInterviewType = [
    { value: "Phone Interview", label: "Phone Interview" },
    { value: "Video Interview", label: "Video Interview" },
    { value: "On-site Interview", label: "On-site Interview" },
  ];

  const meetingPaltform = [
    { value: "Google Meet", label: "Google Meet" },
    { value: "Zoom", label: "Zoom" },
    { value: "MS Team", label: "MS Team" },
  ];

  const interviewDuration = [
    { value: "30 minute", label: "30 min" },
    { value: "1 hour", label: "1 hour" },
    { value: "1.5 hour", label: "1.5 hour" },
    { value: "2 hour", label: "2 hour" },
  ];

  const assignmentGiven = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const reminderInterval = [
    { value: "5 Mins", label: "5 Mins" },
    { value: "10 Mins", label: "10 Mins" },
    { value: "15 Mins", label: "15 Mins" },
  ];

  const status = [
    { value: "Sent", label: "Sent" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Rescheduled", label: "Rescheduled" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Conducted", label: "Conducted" },
  ];

  const codingQuality = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
  ];

  const problemSolvingSkill = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 8, label: 9 },
    { value: 10, label: 10 },
  ];
  const overall_rating = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 8, label: 9 },
    { value: 10, label: 10 },
  ];
  const interviewStatus = [
    { value: "Hold", label: "Hold" },
    { value: "Rejected", label: "Rejected" },
    { value: "Close", label: "Close" },
    { value: "Pass", label: "Pass" },
  ];
  // State to store employees
  const [employees, setEmployees] = useState([]);
  const { Axios } = useAxios();

  //state to show loading animation when user will add shedule interview
  const [sheduleInterviewLoading, setSheduleInterviewLoading] = useState(false);
  // validation for shedule interview data
  const InterviewScheduleSchema = Yup.object({
    [`interview_mode${unique_id}`]: Yup.object().required(
      "Interview Type Required"
    ),
    [`interview_duration${unique_id}`]: Yup.object().required(
      "Interview Duration Required"
    ),
    [`assignment_given${unique_id}`]: Yup.object().nullable(),
    [`interview_platform${unique_id}`]: Yup.object().nullable(),
    [`related_to${unique_id}`]: Yup.object().nullable(),
    [`reminder${unique_id}`]: Yup.object().nullable(),
    [`status${unique_id}`]: Yup.object().nullable(),

    [[`interview_agenda${unique_id}`]]: Yup.string()
      .trim()
      .max(100, "Character must be less than or equal 100")
      .nullable(),
    [`interview_url${unique_id}`]: Yup.string()
      .trim()
      .max(100, "Character must be less than or equal 100")
      .nullable(),

    [`interview_date${unique_id}`]: Yup.date().required(
      "Interview Date Required"
    ),
    [`interview_time${unique_id}`]: Yup.date().required(
      "Interview Time Required"
    ),

    [`interviewers${unique_id}`]: Yup.array()
      .min(1, "Interviewer Required")
      .required("Interviewer Required"),
  });

  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //function to get shedule interview data and send to the api
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
      [`interview_mode${unique_id}`]: "",
      [`interview_date${unique_id}`]: "",
      [`interview_time${unique_id}`]: "",
      [`interview_duration${unique_id}`]: "",
      [`interview_url${unique_id}`]: "",
      [`interview_agenda${unique_id}`]: "",
      [`assignment_given${unique_id}`]: "",
      [`related_to${unique_id}`]: "",
      [`reminder${unique_id}`]: "",
      [`status${unique_id}`]: "",
      [`interview_platform${unique_id}`]: "",
      [`interviewers${unique_id}`]: [],
    },

    validationSchema: InterviewScheduleSchema, // Validation schema
    onSubmit: async (values) => {
      setSheduleInterviewLoading(true);
      // Triming values
      const payload = trimmedValues({
        interview_id: id || "",
        interview_url: values[`interview_url${unique_id}`] || "",
        interview_agenda: values[`interview_agenda${unique_id}`] || "",
        interview_mode: values[`interview_mode${unique_id}`].value || "",
        assignment_given: values[`assignment_given${unique_id}`].value || "",
        related_to: values[`related_to${unique_id}`].value || "",
        assignment_id: values[`related_to${unique_id}`].value || "",
        reminder: values[`reminder${unique_id}`].value || "",
        status: values[`status${unique_id}`].value || "",
        interview_platform:
          values[`interview_platform${unique_id}`].value || "",
        interview_duration:
          values[`interview_duration${unique_id}`].value || "",

        interview_date: values[`interview_date${unique_id}`]
          ? moment(values[`interview_date${unique_id}`]).format("YYYY-MM-DD")
          : "",
        interview_time: values[`interview_time${unique_id}`]
          ? moment(values[`interview_time${unique_id}`]).format("HH:mm:ss")
          : "",
        interviewers: values[`interviewers${unique_id}`].map(
          ({ value }) => value
        ),
        ...((scheduledInterview?.id && {
          interview_schedule_id: scheduledInterview.id,
        }) ||
          ""),
      });

      try {
        const res = await Axios.post(`interview/interview-schedule`, payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          scheduledInterview
            ? toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Scheduled Updated Successfully`
              )
            : toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Scheduled Successfully`
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
        setSheduleInterviewLoading(false);
      }
    },
  });

  //state to show loading animation when user will add shedule interview feedback
  const [interviewFeedbackLoading, setInterviewFeedbackLoading] =
    useState(false);
  // validation for shedule interview feedback data
  const interviewFeedbackSchema = Yup.object({
    [`code_quality${unique_id}`]: Yup.object().required(
      "Code Quality Rating Required"
    ),
    [`problem_solving${unique_id}`]: Yup.object().required(
      "Problem Solving Rating Required"
    ),
    [`status${unique_id}`]: Yup.object().nullable(),
    [`overall_rating${unique_id}`]: Yup.object().required(
      "Overall Rating Required"
    ),
    [[`technical_feedback${unique_id}`]]: Yup.string()
      .trim()
      .max(3000, "Character must be less than or equal 3000")
      .required("Technical Screening Feedback Required"),

    [[`additional_feedback${unique_id}`]]: Yup.string()
      .trim()
      .max(3000, "Character must be less than or equal 3000")
      .nullable(),
  });

  // Trim all string values in the 'values' object
  const feedbackTrimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //function to get shedule interview feedback data and send to the api
  const {
    values: feedback_values,
    errors: feedback_errors,
    handleChange: feedback_handleChange,
    handleSubmit: feedback_handleSubmit,
    touched: feedback_touched,
    handleBlur: feedback_handleBlur,
    setFieldValue: feedback_setFieldValue,
    setErrors: feedback_setErrors,
  } = useFormik({
    initialValues: {
      [`technical_feedback${unique_id}`]: "",
      [`code_quality${unique_id}`]: "",
      [`problem_solving${unique_id}`]: "",
      [`status${unique_id}`]: "",
      [`overall_rating${unique_id}`]: "",
      [`additional_feedback${unique_id}`]: "",
    },

    validationSchema: interviewFeedbackSchema, // Validation schema
    onSubmit: async (values) => {
      setInterviewFeedbackLoading(true);
      // Triming values
      const payload = feedbackTrimmedValues({
        interview_id: id || "",
        interview_schedule_id: scheduledInterview.id || "",
        technical_feedback: values[`technical_feedback${unique_id}`] || "",
        additional_feedback:values[`additional_feedback${unique_id}`] || "",
        code_quality: values[`code_quality${unique_id}`].value || "",
        problem_solving: values[`problem_solving${unique_id}`].value || "",
        status: values[`status${unique_id}`].value || "",
        overall_rating: values[`overall_rating${unique_id}`].value || "",
      });

      try {
        const res = await Axios.post(
          `interview/interview-schedule-feedback`,
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          scheduledInterview
            ? toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Feedback Updated Successfully`
              )
            : toast.success(
                `${getOrdinalSuffix(
                  unique_id + 1
                )} Round Interview Feedback Added Successfully`
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
          feedback_setErrors(errorObject);
        }
      } finally {
        setInterviewFeedbackLoading(false);
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
  //storing data when component will mount
  useEffect(() => {
    if (scheduledInterview) {
      setFieldValue(
        `interviewers${unique_id}`,
        (scheduledInterview?.interviewers || []).map((m) => ({
          label: `${m?.user?.honorific ? `${m.user.honorific} ` : ""}${
            m?.user?.first_name || ""
          } ${m?.user?.middle_name ? `${m.user.middle_name} ` : ""}${
            m?.user?.last_name || ""
          }-${m?.user?.employee_id || ""}`,
          value: m.user?.id || "",
        }))
      );
      setFieldValue(
        `interview_mode${unique_id}`,
        scheduledInterview?.interview_mode
          ? {
              label: scheduledInterview?.interview_mode,
              value: scheduledInterview?.interview_mode,
            }
          : ""
      );
      setFieldValue(
        `interview_date${unique_id}`,
        scheduledInterview?.interview_date || ""
      );
      setFieldValue(
        `interview_time${unique_id}`,
        scheduledInterview?.interview_time
          ? moment(scheduledInterview.interview_time, "HH:mm:ss").toDate()
          : null
      );
      setFieldValue(
        `interview_duration${unique_id}`,
        scheduledInterview?.interview_duration
          ? {
              label: scheduledInterview?.interview_duration,
              value: scheduledInterview?.interview_duration,
            }
          : ""
      );
      setFieldValue(
        `interview_platform${unique_id}`,
        scheduledInterview?.interview_platform
          ? {
              label: scheduledInterview?.interview_platform,
              value: scheduledInterview?.interview_platform,
            }
          : ""
      );
      setFieldValue(
        `interview_url${unique_id}`,
        scheduledInterview?.interview_url || ""
      );
      setFieldValue(
        `interview_agenda${unique_id}`,
        scheduledInterview?.interview_agenda || ""
      );
      setFieldValue(
        `assignment_given${unique_id}`,
        scheduledInterview?.assignment_given
          ? {
              label: scheduledInterview?.assignment_given,
              value: scheduledInterview?.assignment_given,
            }
          : ""
      );
      setFieldValue(
        `related_to${unique_id}`,
        scheduledInterview?.assignment
          ? {
              label: scheduledInterview?.assignment?.interview_round || "",
              value: scheduledInterview?.assignment.id,
            }
          : ""
      );
      setFieldValue(
        `reminder${unique_id}`,
        scheduledInterview?.reminder
          ? {
              label: scheduledInterview?.reminder,
              value: scheduledInterview?.reminder,
            }
          : ""
      );
      setFieldValue(
        `status${unique_id}`,
        scheduledInterview?.status
          ? {
              label: scheduledInterview?.status,
              value: scheduledInterview?.status,
            }
          : ""
      );
    }

    if (scheduledInterviewFeedback) {
      feedback_setFieldValue(
        `code_quality${unique_id}`,
        scheduledInterviewFeedback?.code_quality
          ? {
              label: scheduledInterviewFeedback?.code_quality,
              value: scheduledInterviewFeedback?.code_quality,
            }
          : ""
      );
      feedback_setFieldValue(
        `problem_solving${unique_id}`,
        scheduledInterviewFeedback?.problem_solving
          ? {
              label: scheduledInterviewFeedback?.problem_solving,
              value: scheduledInterviewFeedback?.problem_solving,
            }
          : ""
      );
      feedback_setFieldValue(
        `overall_rating${unique_id}`,
        scheduledInterviewFeedback?.overall_rating
          ? {
              label: scheduledInterviewFeedback?.overall_rating,
              value: scheduledInterviewFeedback?.overall_rating,
            }
          : ""
      );
      feedback_setFieldValue(
        `status${unique_id}`,
        scheduledInterviewFeedback?.status
          ? {
              label: scheduledInterviewFeedback?.status,
              value: scheduledInterviewFeedback?.status,
            }
          : ""
      );
      feedback_setFieldValue(
        `additional_feedback${unique_id}`,
        scheduledInterviewFeedback?.additional_feedback || ""
      );
      feedback_setFieldValue(
        `technical_feedback${unique_id}`,
        scheduledInterviewFeedback?.technical_feedback || ""
      );
      setInitialValue(scheduledInterviewFeedback?.technical_feedback || "")
      setInitialValue1(scheduledInterviewFeedback?.additional_feedback || "",)
    }
  }, [scheduledInterview, scheduledInterviewFeedback]);
  const getEditorChangeFunc = (value) => {
    feedback_setFieldValue(`technical_feedback${unique_id}`, value || "");
  };
  const getEditorChangeFunc1 = (value) => {
 
    feedback_setFieldValue(
      `additional_feedback${unique_id}`,
      value || ""
    );
  };
  return (
    <React.Fragment>
      <Accordion
        defaultExpanded={true}
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
          {`${getOrdinalSuffix(unique_id + 1)} Round`}
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"h5"} className="heading-5 border-0">
            Interview Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Interview Type<span>*</span>
                </InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`interview_mode${unique_id}`, values)
                  }
                  value={values[`interview_mode${unique_id}`]}
                  name={`interview_mode${unique_id}`}
                  placeholder="Select Interview Type"
                  options={selectInterviewType}
                  onBlur={handleBlur}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`interview_mode${unique_id}`] &&
                touched[`interview_mode${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_mode${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Interview Date<span>*</span>
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
                    values[`interview_date${unique_id}`]
                      ? new Date(values[`interview_date${unique_id}`])
                      : null
                  }
                  onChange={(date) =>
                    setFieldValue(`interview_date${unique_id}`, date)
                  }
                  onBlur={handleBlur}
                  name={`interview_date${unique_id}`}
                  className="dateTime-picker calender-icon"
                  placeholderText="Select Interview Date"
                  autoComplete="off"
                />
                {errors[`interview_date${unique_id}`] &&
                touched[`interview_date${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_date${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Interview Time<span>*</span>
                </InputLabel>
                <DatePicker
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  selected={
                    values[`interview_time${unique_id}`]
                      ? new Date(values[`interview_time${unique_id}`])
                      : null
                  }
                  onChange={(date) =>
                    setFieldValue(`interview_time${unique_id}`, date)
                  }
                  onBlur={handleBlur}
                  name={`interview_time${unique_id}`}
                  className="dateTime-picker time-icon"
                  placeholderText="Select Interview Time"
                  autoComplete="off"
                />
                {errors[`interview_time${unique_id}`] &&
                touched[`interview_time${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_time${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Interview Duration<span>*</span>
                </InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`interview_duration${unique_id}`, values)
                  }
                  value={values[`interview_duration${unique_id}`]}
                  name={`interview_duration${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Interview Duration"
                  options={interviewDuration}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`interview_duration${unique_id}`] &&
                touched[`interview_duration${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_duration${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Interviewer<span>*</span>
                </InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`interviewers${unique_id}`, values)
                  }
                  value={values[`interviewers${unique_id}`]}
                  name={`interviewers${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Interviewer Name"
                  options={employees}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                  isMulti
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
                <InputLabel className="fixlabel">Candidate Name</InputLabel>
                <TextField
                  variant="outlined"
                  id="candidate-name"
                  placeholder="Candidate Name"
                  size="small"
                  value={name}
                  inputProps={{
                    readOnly: true,
                  }}
                  className="cursor-nodrop"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Profile</InputLabel>
                <TextField
                  variant="outlined"
                  id="profile"
                  placeholder="Profile"
                  size="small"
                  value={profile}
                  inputProps={{
                    readOnly: true,
                  }}
                  className="cursor-nodrop"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Interview Paltform</InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`interview_platform${unique_id}`, values)
                  }
                  value={values[`interview_platform${unique_id}`]}
                  name={`interview_platform${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Interview Paltform"
                  options={meetingPaltform}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`interview_platform${unique_id}`] &&
                touched[`interview_platform${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_platform${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Meeting Link</InputLabel>
                <TextField
                  id="MeetingLink"
                  placeholder="Enter Meeting Link"
                  size="small"
                  name={`interview_url${unique_id}`}
                  value={values[`interview_url${unique_id}`]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors[`interview_url${unique_id}`] &&
                touched[`interview_url${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_url${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Interview Agenda</InputLabel>
                <TextField
                  id="InterviewAgenda"
                  placeholder="Enter Agenda"
                  size="small"
                  name={`interview_agenda${unique_id}`}
                  value={values[`interview_agenda${unique_id}`]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors[`interview_agenda${unique_id}`] &&
                touched[`interview_agenda${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`interview_agenda${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Assignment Given</InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`assignment_given${unique_id}`, values)
                  }
                  value={values[`assignment_given${unique_id}`]}
                  name={`assignment_given${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Assignment Given"
                  options={assignmentGiven}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`assignment_given${unique_id}`] &&
                touched[`assignment_given${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`assignment_given${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Related To</InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`related_to${unique_id}`, values)
                  }
                  value={values[`related_to${unique_id}`]}
                  name={`related_to${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Related To"
                  options={totalAssignmentRound}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`related_to${unique_id}`] &&
                touched[`related_to${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`related_to${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Reminder Option</InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`reminder${unique_id}`, values)
                  }
                  value={values[`reminder${unique_id}`]}
                  name={`reminder${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Reminder"
                  options={reminderInterval}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`reminder${unique_id}`] &&
                touched[`reminder${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`reminder${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Status</InputLabel>
                <Select
                  onChange={(values) =>
                    setFieldValue(`status${unique_id}`, values)
                  }
                  value={values[`status${unique_id}`]}
                  name={`status${unique_id}`}
                  onBlur={handleBlur}
                  placeholder="Select Status"
                  options={status}
                  menuPlacement={"auto"}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors[`status${unique_id}`] &&
                touched[`status${unique_id}`] ? (
                  <Typography component="span" className="error-msg">
                    {errors[`status${unique_id}`]}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
          </Grid>
          <Stack
            spacing={2}
            sx={{ mt: 4 }}
            direction="row"
            justifyContent="flex-start"
          >
            <LoadingButton
              variant="contained"
              className="text-capitalize"
              color="primary"
              onClick={handleSubmit}
              loading={sheduleInterviewLoading}
            >
              {scheduledInterview ? "Update" : "Save"}
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

          {scheduledInterview.status === "Conducted" &&
            ((
              <>
                <Typography
                  component={"h5"}
                  className="heading-5 border-0"
                  sx={{ mt: 4 }}
                >
                  Interview Feedback
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <FormGroup>
                      <InputLabel className="fixlabel">Interviewer</InputLabel>
                      <TextField
                        id="interviewer-name"
                        placeholder="Enter Interviewer Name"
                        size="small"
                        value={(scheduledInterview?.interviewers || []).map(
                          (m) =>
                            `${m.user.honorific} ${m.user.first_name}${
                              m.user?.middle_name
                                ? " " + m.user?.middle_name
                                : ""
                            }${
                              m.user?.last_name ? " " + m.user?.last_name : ""
                            } - ${m.user?.employee_id}`
                        )}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <FormGroup>
                      <InputLabel className="fixlabel">
                        Coding Quality<span>*</span>
                      </InputLabel>
                      <Select
                        onChange={(values) =>
                          feedback_setFieldValue(
                            `code_quality${unique_id}`,
                            values
                          )
                        }
                        value={feedback_values[`code_quality${unique_id}`]}
                        name={`code_quality${unique_id}`}
                        onBlur={feedback_handleBlur}
                        placeholder="Coding Quality"
                        options={codingQuality}
                        menuPlacement={"auto"}
                        className="basic-multi-select selectTag"
                        classNamePrefix="select"
                      />
                      {feedback_errors[`code_quality${unique_id}`] &&
                      feedback_touched[`code_quality${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`code_quality${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <FormGroup>
                      <InputLabel className="fixlabel">
                        Problem-solving skill<span>*</span>
                      </InputLabel>
                      <Select
                        onChange={(values) =>
                          feedback_setFieldValue(
                            `problem_solving${unique_id}`,
                            values
                          )
                        }
                        value={feedback_values[`problem_solving${unique_id}`]}
                        name={`problem_solving${unique_id}`}
                        onBlur={feedback_handleBlur}
                        placeholder="Problem Solving Skill"
                        options={problemSolvingSkill}
                        menuPlacement={"auto"}
                        className="basic-multi-select selectTag"
                        classNamePrefix="select"
                      />
                      {feedback_errors[`problem_solving${unique_id}`] &&
                      feedback_touched[`problem_solving${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`problem_solving${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <FormGroup>
                      <InputLabel className="fixlabel">
                        Overall Rating<span>*</span>
                      </InputLabel>
                      <Select
                        onChange={(values) =>
                          feedback_setFieldValue(
                            `overall_rating${unique_id}`,
                            values
                          )
                        }
                        value={feedback_values[`overall_rating${unique_id}`]}
                        name={`overall_rating${unique_id}`}
                        onBlur={feedback_handleBlur}
                        placeholder="Select Rating"
                        options={overall_rating}
                        menuPlacement={"auto"}
                        className="basic-multi-select selectTag"
                        classNamePrefix="select"
                      />
                      {feedback_errors[`overall_rating${unique_id}`] &&
                      feedback_touched[`overall_rating${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`overall_rating${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <InputLabel className="fixlabel">
                        Technical Screening Feedback<span>*</span>
                      </InputLabel>
                      <TextEditor getEditorChangeFunc={getEditorChangeFunc} />
                      {/* <SimpleMDE
                        className="w-100"
                        value={
                          feedback_values[`technical_feedback${unique_id}`]
                        }
                        onChange={(value) => {
                          feedback_setFieldValue(
                            `technical_feedback${unique_id}`,
                            value
                          );
                        }}
                        onBlur={feedback_handleBlur}
                      /> */}
                      {feedback_errors[`technical_feedback${unique_id}`] &&
                      feedback_touched[`technical_feedback${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`technical_feedback${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <FormGroup>
                      <InputLabel className="fixlabel">
                        Additional Feedback
                      </InputLabel>
                      <TextEditor1 getEditorChangeFunc={getEditorChangeFunc1} />

                      {/* <SimpleMDE
                        className="w-100"
                        value={
                          feedback_values[`additional_feedback${unique_id}`]
                        }
                        onChange={(value) => {
                          feedback_setFieldValue(
                            `additional_feedback${unique_id}`,
                            value
                          );
                        }}
                        onBlur={feedback_handleBlur}
                      /> */}
                      {feedback_errors[`additional_feedback${unique_id}`] &&
                      feedback_touched[`additional_feedback${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`additional_feedback${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <FormGroup>
                      <InputLabel className="fixlabel">Status</InputLabel>
                      <Select
                        onChange={(values) =>
                          feedback_setFieldValue(`status${unique_id}`, values)
                        }
                        value={feedback_values[`status${unique_id}`]}
                        name={`status${unique_id}`}
                        onBlur={feedback_handleBlur}
                        placeholder="Slect Status"
                        options={interviewStatus}
                        menuPlacement={"auto"}
                        className="basic-multi-select selectTag"
                        classNamePrefix="select"
                      />
                      {feedback_errors[`status${unique_id}`] &&
                      feedback_touched[`status${unique_id}`] ? (
                        <Typography component="span" className="error-msg">
                          {feedback_errors[`status${unique_id}`]}
                        </Typography>
                      ) : null}
                    </FormGroup>
                  </Grid>
                </Grid>
                <Stack
                  spacing={2}
                  sx={{ mt: 3 }}
                  direction="row"
                  justifyContent="flex-start"
                >
                  <LoadingButton
                    variant="contained"
                    className="text-capitalize"
                    color="primary"
                    onClick={feedback_handleSubmit}
                    loading={interviewFeedbackLoading}
                  >
                    {scheduledInterviewFeedback ? "Update" : "Save"}
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
            ) ||
              "")}
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
};

export default ScheduleIntervieweForm;
