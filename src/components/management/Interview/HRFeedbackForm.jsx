/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Grid,
  FormGroup,
  TextField,
  InputLabel,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Select from "react-select";
import * as Yup from "yup";
import { mapValues } from "lodash";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useTextEditor from "../../common/useTextEditor";
const HRFeedbackForm = ({ interviewData, getInterViewDetail }) => {
  const { TextEditor, getContent, setInitialValue } = useTextEditor({
    height: 200,
    initialValue: "",
  });
  const {
    TextEditor: StrengthsTextEditor,
    getContent: StrengthsGetContent,
    setInitialValue: StrengthsSetInitialValue,
  } = useTextEditor({
    height: 200,
    initialValue: "",
  });
  const {
    TextEditor: WeaknessTextEditor,
    getContent: WeaknessGetContent,
    setInitialValue: WeaknessSetInitialValue,
  } = useTextEditor({
    height: 200,
    initialValue: "",
  });
  const { Axios } = useAxios();
  //defining dropdown
  const rating = [
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

  const hiredStatus = [
    { value: "Hired", label: "Hired" },
    { value: "Not-Hired", label: "Not-Hired" },
    {
      value: "Further Consideration Needed",
      label: "Further Consideration Needed",
    },
  ];

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

  //state to show loading animation when feedback will be add
  const [hrFeedbackLoading, setHrFeedbackLoading] = useState(false);
  const hrFeedbackSchema = Yup.object({
    cultural_fit_assessment: Yup.object().required(
      "Cultural Fit Assessment Required"
    ),
    overall_assessment: Yup.object().required("Overall assessment required"),
    status: Yup.object().required("Final Recommendation Required"),
    strength: Yup.string()
      .trim()
      .max(600, "Character must be less than or equal 600")
      .required("Strength Required"),

    weakness: Yup.string()
      .trim()
      .max(600, "Character must be less than or equal 600")
      .required("Weakness Required"),

    feedback: Yup.string()
      .trim()
      .max(3000, "Character must be less than or equal 3000")
      .nullable(),

    joining_date: Yup.date().nullable(),
  });

  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //function to get feedback data and send to the api
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
      cultural_fit_assessment: "",
      overall_assessment: "",
      status: "",
      strength: "",
      weakness: "",
      feedback: "",
      joining_date: "",
    },

    validationSchema: hrFeedbackSchema, // Validation schema
    onSubmit: async (values) => {
      setHrFeedbackLoading(true);
      const payload = trimmedValues({
        ...values,
        interview_id: interviewData?.id || "",
        cultural_fit_assessment: values?.cultural_fit_assessment?.value || "",
        overall_assessment: values?.overall_assessment?.value || "",
        status: values?.status?.value || "",
        joining_date: values.joining_date
          ? moment(values.joining_date).format("YYYY-MM-DD")
          : null,
      });
      try {
        const res = await Axios.post(
          `interview/interview-hr-feedback`,
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          interviewData.hr_head_feedback
            ? toast.success("Final Feedback updated successfully")
            : toast.success("Final Feedback added successfully");

          if (interviewData.id) {
            getInterViewDetail(interviewData.id); //calling function to get interview details if id present
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || {}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
      } finally {
        setHrFeedbackLoading(false);
      }
    },
  });

  //state to show loading animation when user will add employment verification data
  const [employmentVerificationLoading, setemploymentVerificationLoading] =
    useState(false);
  // validation for employment verification data
  const SUPPORTED_FORMATS = ["application/pdf", "application/doc"];
  const EmploymentVerificationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .max(80, "Character must be less than or equal 80")
      .required("Candidate Name Required"),
    email: Yup.string().trim().email().required("Email Required"),
    file: Yup.mixed()
      .nullable()
      .test(
        "Fichier taille",
        "File should not be more than 2mb",
        function (value) {
          const { size } = this.parent.file || {};
          return !size || (size && size <= 1024 * 1024 * 2);
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
  });

  //function to get assignment data and send to the api
  const {
    values: verification_values,
    errors: verification_errors,
    handleChange: verification_handleChange,
    handleSubmit: verification_handleSubmit,
    touched: verification_touched,
    handleBlur: verification_handleBlur,
    setFieldValue: verification_setFieldValue,
    setErrors: verification_setErrors,
    resetForm: verification_resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      file: "",
    },

    validationSchema: EmploymentVerificationSchema, // Validation schema
    onSubmit: async (values) => {
      setemploymentVerificationLoading(true);
      // Trim values and create FormData

      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("email", values.email.trim());
      formData.append("file", values.file);
      try {
        const res = await Axios.post(
          `interview/employment-verification`,
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success("Employment verification sent successfully");
          verification_resetForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || {}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
      } finally {
        setemploymentVerificationLoading(false);
      }
    },
  });
  //storing feedback details when component will be mount
  useEffect(() => {
    if (interviewData.hr_head_feedback) {
      const { hr_head_feedback } = interviewData;
      setFieldValue(
        "cultural_fit_assessment",
        hr_head_feedback?.cultural_fit_assessment
          ? {
              value: hr_head_feedback.cultural_fit_assessment,
              label: hr_head_feedback.cultural_fit_assessment,
            }
          : ""
      );
      setFieldValue(
        "overall_assessment",
        hr_head_feedback?.overall_assessment
          ? {
              value: hr_head_feedback.overall_assessment,
              label: hr_head_feedback.overall_assessment,
            }
          : ""
      );
      setFieldValue("joining_date", hr_head_feedback?.joining_date || "");
      setFieldValue("strength", hr_head_feedback?.strength || "");
      StrengthsSetInitialValue(hr_head_feedback?.strength || "");
      setFieldValue("weakness", hr_head_feedback?.weakness || "");
      WeaknessSetInitialValue(hr_head_feedback?.weakness || "");
      setFieldValue("feedback", hr_head_feedback?.feedback || "");
      setInitialValue(hr_head_feedback?.feedback || "");
      setFieldValue(
        "status",
        hr_head_feedback?.status
          ? {
              value: hr_head_feedback.status,
              label: hr_head_feedback.status,
            }
          : ""
      );
    }
  }, [interviewData.hr_head_feedback]);
  const getEditorChangeFunc = (value) => {
    setFieldValue("feedback", value || "");
  };
  const StrengthsGetEditorChangeFunc = (value) => {
    setFieldValue("strength", value || "");
  };
  const WeaknessGetEditorChangeFunc = (value) => {
    setFieldValue("weakness", value || "");
  };
  return (
    <React.Fragment>
      <Box p={3}>
        <Typography component={"h5"} className="heading-5 border-0">
          Interview Feedback
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Candidate Name</InputLabel>
              <TextField
                id="candidate-name"
                placeholder="Candidate Name"
                size="small"
                value={interviewData?.name || ""}
                inputProps={{
                  readOnly: true,
                }}
                className="cursor-nodrop"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Interview Date</InputLabel>

              <TextField
                id="profile"
                placeholder="Interview Date"
                size="small"
                value={
                  ((interviewData?.scheduled_interviews || []).length > 0 &&
                    interviewData?.scheduled_interviews[
                      interviewData.scheduled_interviews.length - 1
                    ].interview_date) ||
                  ""
                }
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
                id="profile"
                placeholder="Profile"
                size="small"
                value={interviewData?.previous_designation || ""}
                inputProps={{
                  readOnly: true,
                }}
                className="cursor-nodrop"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Cultural Fit Assessment<span>*</span>
              </InputLabel>
              <Select
                onChange={(values) =>
                  setFieldValue(`cultural_fit_assessment`, values)
                }
                value={values.cultural_fit_assessment}
                name="cultural_fit_assessment"
                onBlur={handleBlur}
                placeholder="Cultural Fit Assessment"
                options={rating}
                menuPlacement={"auto"}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.cultural_fit_assessment &&
              touched.cultural_fit_assessment ? (
                <Typography component="span" className="error-msg">
                  {errors.cultural_fit_assessment}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Overall Assessment<span>*</span>
              </InputLabel>
              <Select
                onChange={(values) =>
                  setFieldValue(`overall_assessment`, values)
                }
                value={values.overall_assessment}
                name="overall_assessment"
                onBlur={handleBlur}
                placeholder="Overall Assessment"
                options={rating}
                menuPlacement={"auto"}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.overall_assessment && touched.overall_assessment ? (
                <Typography component="span" className="error-msg">
                  {errors.overall_assessment}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Joining Date</InputLabel>
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
                  values.joining_date ? new Date(values.joining_date) : null
                }
                onChange={(date) => setFieldValue("joining_date", date)}
                onBlur={handleBlur}
                name="joining_date"
                className="dateTime-picker calender-icon"
                placeholderText="Joining Date"
                autoComplete="off"
              />
              {errors.joining_date && touched.joining_date ? (
                <Typography component="span" className="error-msg">
                  {errors.joining_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Final Recommendation<span>*</span>
              </InputLabel>
              <Select
                onChange={(values) => setFieldValue(`status`, values)}
                value={values.status}
                name="status"
                onBlur={handleBlur}
                placeholder="Final Recommendation"
                options={hiredStatus}
                menuPlacement={"auto"}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.status && touched.status ? (
                <Typography component="span" className="error-msg">
                  {errors.status}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Strengths<span>*</span>
              </InputLabel>
              <StrengthsTextEditor
                getEditorChangeFunc={StrengthsGetEditorChangeFunc}
              />
              {errors.strength && touched.strength ? (
                <Typography component="span" className="error-msg">
                  {errors.strength}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Weakness<span>*</span>
              </InputLabel>
              <WeaknessTextEditor
                getEditorChangeFunc={WeaknessGetEditorChangeFunc}
              />
              {errors.weakness && touched.weakness ? (
                <Typography component="span" className="error-msg">
                  {errors.weakness}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Additional Comments</InputLabel>
              <TextEditor getEditorChangeFunc={getEditorChangeFunc} />
              {errors.feedback && touched.feedback ? (
                <Typography component="span" className="error-msg">
                  {errors.feedback}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid> <br />
        <Stack spacing={2} direction="row" justifyContent="flex-start">
          <LoadingButton
            variant="contained"
            className="text-capitalize"
            color="primary"
            onClick={handleSubmit}
            loading={hrFeedbackLoading}
          >
            {interviewData?.hr_head_feedback ? "Update" : "Save"}
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

        <Typography
          component={"h5"}
          sx={{ mt: 4 }}
          className="heading-5 border-0"
        >
          Employment Verification
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Candidate Name<span>*</span></InputLabel>
              <TextField
                id="candidate-name"
                placeholder="Enter Name"
                size="small"
                value={verification_values.name}
                onChange={verification_handleChange}
                onBlur={verification_handleBlur}
                name="name"
              />
              {verification_errors.name && verification_touched.name ? (
                <Typography component="span" className="error-msg">
                  {verification_errors.name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Recipient Email ID<span>*</span></InputLabel>
              <TextField
                id="recipient-email-id"
                placeholder="Recipient Email ID"
                size="small"
                value={verification_values.email}
                onChange={verification_handleChange}
                onBlur={verification_handleBlur}
                name="email"
              />
              {verification_errors.email && verification_touched.email ? (
                <Typography component="span" className="error-msg">
                  {verification_errors.email}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Form upload <small>( PDF, DOC- Maximum file size: 2 MB)</small>
              </InputLabel>
              <Box component="div" className="choosefile">
                <Typography component="label" htmlFor="file-upload">
                  {verification_values?.file?.name || "Choose File.."}
                </Typography>
                <input
                  type="file"
                  name="file"
                  id="file-upload"
                  onChange={(e) => {
                    verification_setFieldValue("file", e.target.files[0]);
                  }}
                  onBlur={verification_handleBlur}
                />
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  className="choosefile-button"
                >
                  Browse
                </Typography>
                {verification_errors.file && verification_touched.file ? (
                  <Typography component="span" className="error-msg">
                    {verification_errors.file}
                  </Typography>
                ) : null}
              </Box>
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
            onClick={verification_handleSubmit}
            loading={employmentVerificationLoading}
          >
            Send
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
      </Box>
    </React.Fragment>
  );
};

export default HRFeedbackForm;
