/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Button,
  Typography,
  FormGroup,
} from "@mui/material";
import Select from "react-select";
import { LoadingButton } from "@mui/lab";
import { ImagePath } from "@/ImagePath";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { mapValues, omit } from "lodash";
import { CandidateInformationSchema } from "@/validations/interview/CandidateInformationSchema";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaEye } from "react-icons/fa";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
const CandidateInformationForm = ({ getInterViewDetail, interviewData }) => {
  const { interview_id } = useParams();

  let id;
  //state to store departments
  const [departments, setDepartments] = useState([]);
  //state to store designations
  const [designations, setDesignations] = useState([]);
  //state to store particular department designation
  const [departmentDesignations, setDepartmentDesignations] = useState([]);
  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  // Define dropdown options
  const source = [
    { value: "Linkedin", label: "Linkedin" },
    { value: "Google", label: "Google" },
    { value: "Others", label: "Others" },
  ];

  const interpersonalCommunicationRate = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  const attitudeStatus = [
    { value: "Poor", label: "Poor" },
    { value: "Fair", label: "Fair" },
    { value: "Satisfactory", label: "Satisfactory" },
    { value: "Good", label: "Good" },
  ];

  const suitableForPosition = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const candidateStatus = [
    { value: "Hold", label: "Hold" },
    { value: "Reject", label: "Reject" },
    { value: "Close", label: "Close" },
    { value: "Shortlisted", label: "Shortlisted" },
  ];
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  // Axios instance
  const { Axios } = useAxios();
  // Function to send first screening feedback details to the server
  const sendFirstScreeningFeedbackDetails = async (feedbackData) => {
    try {
      const res = await Axios.post("/interview/screening", feedbackData);

      if (res.status && res.status >= 200 && res.status < 300) {
        if (Object.keys(interviewData||{}).length > 0)
          toast.success(
            "Candidate Information And First Screening Feedback Updated Successfully"
          );
        else
          toast.success(
            "Candidate Information And First Screening Feedback Added Successfully"
          );

        setLoading(false);

        if (interviewData.id) {
          getInterViewDetail(interviewData.id);
        }
        if (id) {
          getInterViewDetail(id);
        }
      }
    } catch (error) {
      handleAxiosError(error);
    }
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
      name: "",
      email: "",
      phone: "",
      applied_designation_id: "",
      applied_department_id: "",
      file: "",
      source_name: "",
      source_link: "",
      total_experience: "",
      previous_designation: "",
      previous_company: "",
      current_company: "",
      current_ctc: "",
      expected_ctc: "",
      highest_qualification: "",
      notice_period: "",
      primary_skill: "",
      secondary_skill: "",
      remarks: "",
      //screening feedback
      interview_id: "",
      status: "",
      feedback_remarks: "",
      attitude: "",
      is_suitable: "",
      work_exp_assessment: "",
      interpersonal_skill_score: "",
      communication_skill_score: "",
    },

    validationSchema: CandidateInformationSchema, // Validation schema
    onSubmit: async (values) => {
      setLoading(true);
      // List of fields to exclude
      const excludedFields = [
        "interview_id",
        "status",
        "feedback_remarks",
        "attitude",
        "is_suitable",
        "work_exp_assessment",
        "interpersonal_skill_score",
        "communication_skill_score",
      ];
      // Trim values and create FormData
      const data = trimmedValues(
        omit(
          {
            ...values,
            applied_designation_id: values.applied_designation_id
              ? values.applied_designation_id.value
              : "",
            applied_department_id: values.applied_department_id
              ? values.applied_department_id.value
              : "",
            source_name: values.source_name ? values.source_name.value : "",
          },
          excludedFields
        )
      );
      // Append key-value pairs to FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        key != "file" ? formData.append(key, value) : "";
      });
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : interviewData?.resume
          ? interviewData.resume
          : ""
      );
      try {
        const res = await Axios.post(
          interviewData?.id
            ? `interview/update/${interviewData.id}?_method=put`
            : "/interview/create",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          id = res.data?.interview_id || "";
          const feedbackData = trimmedValues({
            // Prepare feedback data
            interview_id: interviewData.id
              ? interviewData.id
              : res.data?.interview_id || null,
            status: values.status ? values.status?.value : null,
            attitude: values.attitude ? values.attitude?.value : null,
            is_suitable: values.is_suitable ? values.is_suitable?.value : null,
            interpersonal_skill_score: values.interpersonal_skill_score
              ? values.interpersonal_skill_score?.value
              : null,
            communication_skill_score: values.communication_skill_score
              ? values.communication_skill_score?.value
              : null,
            work_exp_assessment: values.work_exp_assessment || null,
            remarks: values.feedback_remarks || null,
          });

          sendFirstScreeningFeedbackDetails(feedbackData);
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
  });
  // Function to handle Axios errors and update the form accordingly
  const handleAxiosError = (error) => {
    setLoading(false);

    if (error.response) {
      if (error.response.status === 422) {
        const apiErrors = error.response.data.errors;
        const errorObject = {};
        Object.keys(apiErrors||{}).forEach((key) => {
          errorObject[key] = apiErrors[key][0];
        });
        setErrors(errorObject);
      } else if (error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //function to get department details
  const fetchDepartments = async () => {
    try {
      const res = await Axios.get(`department/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const departmentAllData = (res.data?.data || []).map((department) => ({
          value: department.id||"",
          label: department.name||"",
        }));
        setDepartments(departmentAllData);
        setDepartmentDesignations(
          (res.data?.data || []).reduce((accumulator, { designations }) => {
            if ((designations||[]).length > 0) {
              accumulator.push(
                ...designations.map((designation) => designation)
              );
            }
            return accumulator;
          }, [])
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //function to get designation details
  const fetchDepartmentDesignationsById = async (departmentId) => {
    setDesignations(
      (departmentDesignations||[])
        .filter((designation) => designation?.department_id === departmentId)
        .map((designation) => ({
          label: designation.name||"",
          value: designation.id||"",
        }))
    );
  };

  // Fetch department and designation details on component mount
  useEffect(() => {
    fetchDepartments();
    //calling a function to get particular interview details if interview id is present in url
    if (interview_id) {
      getInterViewDetail(interview_id);
    }
  }, []);
  //useeffect to set all data based on the field if data is present inside interviewData
  useEffect(() => {
    if (interviewData) {
      const {
        name,
        email,
        phone,
        designation,
        department,
        source_name,
        source_link,
        total_experience,
        previous_designation,
        previous_company,
        current_company,
        current_ctc,
        expected_ctc,
        highest_qualification,
        notice_period,
        primary_skill,
        secondary_skill,
        remarks,
        screening_feedback,
      } = interviewData;
      setFieldValue("name", name || "");
      setFieldValue("email", email || "");
      setFieldValue("phone", phone || "");
      setFieldValue(
        "applied_department_id",
        department ? { label: department.name||"", value: department.id||"" } : ""
      );
      if (department) {
        fetchDepartmentDesignationsById(department.id);
      }
      setFieldValue("file", interviewData?.resume?.split("/")?.pop() || "");
      setFieldValue(
        "applied_designation_id",
        designation ? { label: designation.name||"", value: designation.id||"" } : ""
      );
      setFieldValue(
        "source_name",
        source_name ? { label: source_name, value: source_name } : ""
      );
      setFieldValue("source_link", source_link || "");
      setFieldValue("total_experience", total_experience || "");
      setFieldValue("previous_designation", previous_designation || "");
      setFieldValue("previous_company", previous_company || "");
      setFieldValue("current_company", current_company || "");
      setFieldValue("current_ctc", current_ctc || "");
      setFieldValue("expected_ctc", expected_ctc || "");
      setFieldValue("highest_qualification", highest_qualification || "");
      setFieldValue("notice_period", notice_period || "");
      setFieldValue("primary_skill", primary_skill || "");
      setFieldValue("secondary_skill", secondary_skill || "");
      setFieldValue("remarks", remarks || "");
      // setFieldValue(
      //   "interview_id",
      //   (screening_feedback && screening_feedback.interview_id) ||
      //     interviewData.id ||
      //     ""
      // );
      setFieldValue(
        "status",
        screening_feedback && screening_feedback.status
          ? {
              label: screening_feedback.status,
              value: screening_feedback.status,
            }
          : ""
      );
      setFieldValue(
        "feedback_remarks",
        (screening_feedback && screening_feedback.remarks) || ""
      );
      setFieldValue(
        "attitude",
        screening_feedback && screening_feedback.attitude
          ? {
              label: screening_feedback.attitude,
              value: screening_feedback.attitude,
            }
          : ""
      );
      setFieldValue(
        "is_suitable",
        screening_feedback && screening_feedback.is_suitable != null
          ? {
              label: screening_feedback.is_suitable === 0 ? "No" : "Yes",
              value: screening_feedback.is_suitable.toString(),
            }
          : ""
      );
      setFieldValue(
        "work_exp_assessment",
        (screening_feedback && screening_feedback.work_exp_assessment) || ""
      );
      setFieldValue(
        "interpersonal_skill_score",
        screening_feedback && screening_feedback.interpersonal_skill_score
          ? {
              label: screening_feedback.interpersonal_skill_score,
              value: screening_feedback.interpersonal_skill_score,
            }
          : ""
      );
      setFieldValue(
        "communication_skill_score",
        screening_feedback && screening_feedback.communication_skill_score
          ? {
              label: screening_feedback.communication_skill_score,
              value: screening_feedback.communication_skill_score,
            }
          : ""
      );
    }
  }, [interviewData]);

  // // State to store uploaded file details
  // const [uploadedFile, setUploadedFile] = useState(null);

  // // Function to handle file preview
  // const previewFile = (file) => {
  //   if (file) {
  //     window.open(
  //       `https://docs.google.com/gview?url=${values.file}&embedded=true`,
  //       "_blank"
  //     );
  //   }
  // };

  return (
    <React.Fragment>
      <Box p={3}>
        <Typography component="h2" className="heading-5 border-0">
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Name<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Name"
                variant="outlined"
                fullWidth
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
                Email<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Email-Id"
                variant="outlined"
                fullWidth
                size="small"
                value={values.email}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? (
                <Typography component="span" className="error-msg">
                  {errors.email}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Contact<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Contact Information"
                variant="outlined"
                fullWidth
                size="small"
                value={values.phone}
                name="phone"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <Typography component="span" className="error-msg">
                  {errors.phone}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            {/* {uploadedFile ? (
              <div>
                <span style={{}}>{uploadedFile.name}</span>

                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <IconButton
                    onClick={() => previewFile(uploadedFile)}
                    color="primary"
                  >
                    <FaEye title="View" size={"20px"} />
                  </IconButton>
                  <a
                    href={URL.createObjectURL(values.file)}
                    download={uploadedFile.name}
                  >
                    <IconButton color="primary">
                      <FaCloudDownloadAlt title="dowenload" size={"20px"} />
                    </IconButton>
                  </a>
                  <IconButton
                    onClick={() => {
                      setUploadedFile(null), setFieldValue("file", null);
                    }}
                    color="error"
                  >
                    <DeleteIcon
                      fontSize="small"
                      titleAccess="Delete"
                      size={"20px"}
                    />
                  </IconButton>
                </div>
              </div>
            ) : ( */}
            <FormGroup>
              <InputLabel className="fixlabel">Resume</InputLabel>
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
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFieldValue("file", file);
                    // file.type === "application/pdf" ||
                    // file.type === "application/msword"
                    //   ? setUploadedFile({
                    //       name: file.name,
                    //       type: file.type,
                    //     })
                    //   : "";
                  }}
                />
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  className="choosefile-button"
                >
                  Browse
                </Typography>
              </Box>
              {errors.file && touched.file ? (
                <Typography component="span" className="error-msg">
                  {errors.file}
                </Typography>
              ) : null}
            </FormGroup>
            {/* )} */}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Department<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Department"
                options={departments}
                value={values.applied_department_id}
                name="applied_department_id"
                onChange={(selectedOptions) => {
                  setFieldValue("applied_department_id", selectedOptions);
                  values.applied_department_id.value !== selectedOptions.value
                    ? setFieldValue("applied_designation_id", "")
                    : "";
                  fetchDepartmentDesignationsById(selectedOptions.value);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.applied_department_id && touched.applied_department_id ? (
                <Typography component="span" className="error-msg">
                  {errors.applied_department_id}
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
                placeholder="Select Designation"
                options={designations}
                value={values.applied_designation_id}
                name="applied_designation_id"
                onChange={(selectedOptions) => {
                  setFieldValue("applied_designation_id", selectedOptions);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
                isDisabled={values.applied_department_id ? false : true}
              />
              {errors.applied_designation_id &&
              touched.applied_designation_id ? (
                <Typography component="span" className="error-msg">
                  {errors.applied_designation_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
        <Typography
          component="h2"
          className="heading-5 border-0"
          sx={{ mt: 5 }}
        >
          Professional Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Source<span>*</span>
              </InputLabel>
              <Select
                placeholder="Source"
                options={source}
                value={values.source_name}
                name="source_name"
                onChange={(selectedOptions) => {
                  setFieldValue("source_name", selectedOptions);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.source_name && touched.source_name ? (
                <Typography component="span" className="error-msg">
                  {errors.source_name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Link</InputLabel>
              <TextField
                placeholder="Enter Link"
                variant="outlined"
                fullWidth
                size="small"
                value={values.source_link}
                name="source_link"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.source_link && touched.source_link ? (
                <Typography component="span" className="error-msg">
                  {errors.source_link}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Years of Exprience</InputLabel>
              <TextField
                placeholder="Enter Year Of Exprience"
                variant="outlined"
                fullWidth
                size="small"
                value={values.total_experience}
                name="total_experience"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.total_experience && touched.total_experience ? (
                <Typography component="span" className="error-msg">
                  {errors.total_experience}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Job Profile<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Job Profile"
                variant="outlined"
                fullWidth
                size="small"
                value={values.previous_designation}
                name="previous_designation"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.previous_designation && touched.previous_designation ? (
                <Typography component="span" className="error-msg">
                  {errors.previous_designation}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Previous Organization
              </InputLabel>
              <TextField
                placeholder="Enter Organization Name"
                variant="outlined"
                fullWidth
                size="small"
                value={values.previous_company}
                name="previous_company"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.previous_company && touched.previous_company ? (
                <Typography component="span" className="error-msg">
                  {errors.previous_company}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Current Organization</InputLabel>
              <TextField
                placeholder="Enter Organization Name"
                variant="outlined"
                fullWidth
                size="small"
                value={values.current_company}
                name="current_company"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.current_company && touched.current_company ? (
                <Typography component="span" className="error-msg">
                  {errors.current_company}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Current CTC</InputLabel>
              <TextField
                placeholder="Enter Amount"
                variant="outlined"
                fullWidth
                size="small"
                value={values.current_ctc}
                name="current_ctc"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.current_ctc && touched.current_ctc ? (
                <Typography component="span" className="error-msg">
                  {errors.current_ctc}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Expected CTC<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Amount"
                variant="outlined"
                fullWidth
                size="small"
                value={values.expected_ctc}
                name="expected_ctc"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.expected_ctc && touched.expected_ctc ? (
                <Typography component="span" className="error-msg">
                  {errors.expected_ctc}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Highest Qualification<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Highest Qualification"
                variant="outlined"
                fullWidth
                size="small"
                value={values.highest_qualification}
                name="highest_qualification"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.highest_qualification && touched.highest_qualification ? (
                <Typography component="span" className="error-msg">
                  {errors.highest_qualification}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Notice Period</InputLabel>
              <TextField
                placeholder="EX - 30 Day's"
                variant="outlined"
                fullWidth
                size="small"
                value={values.notice_period}
                name="notice_period"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.notice_period && touched.notice_period ? (
                <Typography component="span" className="error-msg">
                  {errors.notice_period}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Primary Skills<span>*</span>
              </InputLabel>
              <TextField
                placeholder="Enter Primary Skills"
                variant="outlined"
                fullWidth
                size="small"
                value={values.primary_skill}
                name="primary_skill"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.primary_skill && touched.primary_skill ? (
                <Typography component="span" className="error-msg">
                  {errors.primary_skill}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Secondary Skills</InputLabel>
              <TextField
                placeholder="Enter Secondary Skills"
                variant="outlined"
                fullWidth
                size="small"
                value={values.secondary_skill}
                name="secondary_skill"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.secondary_skill && touched.secondary_skill ? (
                <Typography component="span" className="error-msg">
                  {errors.secondary_skill}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Remarks</InputLabel>
              <TextField
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
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
        </Grid>
        <Typography
          component="h2"
          className="heading-5 border-0"
          sx={{ mt: 5 }}
        >
          First Screening Feedback
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Actual Work Experience Assessment
              </InputLabel>
              <TextField
                placeholder="Comment About Work Experience "
                variant="outlined"
                fullWidth
                size="small"
                value={values.work_exp_assessment}
                name="work_exp_assessment"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.work_exp_assessment && touched.work_exp_assessment ? (
                <Typography component="span" className="error-msg">
                  {errors.work_exp_assessment}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Interpersonal Skill</InputLabel>
              <Select
                placeholder="Select Interpersonal Skill"
                options={interpersonalCommunicationRate}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
                value={values.interpersonal_skill_score}
                name="interpersonal_skill_score"
                onChange={(selectedOptions) => {
                  setFieldValue("interpersonal_skill_score", selectedOptions);
                }}
                onBlur={handleBlur}
              />
              {errors.interpersonal_skill_score &&
              touched.interpersonal_skill_score ? (
                <Typography component="span" className="error-msg">
                  {errors.interpersonal_skill_score}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Communication Skill</InputLabel>
              <Select
                placeholder="Select Communication Skill"
                options={interpersonalCommunicationRate}
                value={values.communication_skill_score}
                name="communication_skill_score"
                onChange={(selectedOptions) => {
                  setFieldValue("communication_skill_score", selectedOptions);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.communication_skill_score &&
              touched.communication_skill_score ? (
                <Typography component="span" className="error-msg">
                  {errors.communication_skill_score}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Attitude</InputLabel>
              <Select
                placeholder="Select Attitude"
                options={attitudeStatus}
                value={values.attitude}
                name="attitude"
                onChange={(selectedOptions) => {
                  setFieldValue("attitude", selectedOptions);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.attitude && touched.attitude ? (
                <Typography component="span" className="error-msg">
                  {errors.attitude}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Suitable for Position?
              </InputLabel>
              <Select
                placeholder="Suitable For Position?"
                options={suitableForPosition}
                value={values.is_suitable}
                name="is_suitable"
                onChange={(selectedOptions) => {
                  setFieldValue("is_suitable", selectedOptions);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag w-100"
                classNamePrefix="select"
              />
              {errors.is_suitable && touched.is_suitable ? (
                <Typography component="span" className="error-msg">
                  {errors.is_suitable}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">Status</InputLabel>
              <Select
                placeholder="Select Status"
                options={candidateStatus}
                value={values.status}
                name="status"
                onChange={(selectedOptions) => {
                  setFieldValue("status", selectedOptions);
                }}
                onBlur={handleBlur}
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
              <InputLabel className="fixlabel">Remarks</InputLabel>
              <TextField
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
                size="small"
                value={values.feedback_remarks}
                name="feedback_remarks"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.feedback_remarks && touched.feedback_remarks ? (
                <Typography component="span" className="error-msg">
                  {errors.feedback_remarks}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            className="text-capitalize"
            color="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {interviewData?.id ? "Update" : "Submit"}
          </LoadingButton>
          <Link to={"/candidate-list"}>
            <Button
              color="primary"
              variant="outlined"
              className=" text-capitalize"
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Box>
      <div id="file-preview-container"></div>
    </React.Fragment>
  );
};

export default CandidateInformationForm;
