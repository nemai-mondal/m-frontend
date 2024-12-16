import React, { useEffect, useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import { useFormik } from "formik";
import { mapValues } from "lodash";
import { HrActivities as HrActivitiesValidation } from "@/validations/HrAcivitiesSchema";
import { LoadingButton } from "@mui/lab";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import useTextEditor from "../../../common/useTextEditor";
import moment from "moment";
import { Link } from "react-router-dom";
const ProjectInformationFormHR = ({
  clients,
  employees,
  projectData,
  getProjectDetails,
}) => {
  const { Axios } = useAxios();

  const { TextEditor, getContent, setInitialValue, getCharacterCount } =
    useTextEditor({
      height: 200,
      initialValue: "",
    });

  const projectType = [
    { label: "Recruitment", value: "Recruitment" },
    { label: "Onboarding", value: "Onboarding" },
    { label: "Induction", value: "Induction" },
    { label: "Employee Exit", value: "Employee Exit" },
    { label: "HR Activity", value: "HR Activity" },
    { label: "Team Session/Meeting", value: "Team Session/Meeting" },
    {
      label: "HR Compliance and Regulations",
      value: "HR Compliance and Regulations",
    },
    {
      label: "Rewards and recognition program",
      value: "Rewards and recognition program",
    },
    { label: "Payroll", value: "Payroll" },
    { label: "Employee Attendance", value: "Employee Attendance" },
  ];

  const projectPriority = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const noticePeriod = [
    { label: "Immediate", value: "Immediate" },
    { label: "15 days", value: "15 days" },
    { label: "30 days", value: "30 days" },
    { label: "60 days", value: "60 days" },
    { label: "90 days", value: "90 days" },
  ];

  const selectLevels = [
    { label: "Entry-Level", value: "Entry-Level" },
    { label: "Fresher", value: "Fresher" },
    { label: "Junior", value: "Junior" },
    { label: "Mid-Level", value: "Mid-Level" },
    { label: "Senior", value: "Senior" },
    { label: "Managerial", value: "Managerial" },
    { label: "Leadership", value: "Leadership" },
    { label: "Executive", value: "Executive" },
    { label: "C-Level", value: "C-Level" },
    {
      label: "Subject Matter Expert (SME)",
      value: "Subject Matter Expert (SME)",
    },
  ];

  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [informationFormLoading, setInformationLoading] = useState(false);

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
      step: "1",
      name: "",
      client_id: "",
      manager_id: "",
      start_date: "",
      end_date: "",
      project_type: "",
      priority: "",
      experience: "",
      salary_range: "",
      no_of_openings: "",
      notice_period: "",
      description: "",
      project_status: "",
      department_id: "",
    },
    validationSchema: HrActivitiesValidation, // Validation schema
    onSubmit: async (values) => {
      if (getCharacterCount() > 300) return;
      setInformationLoading(true);
      // Triming values
      const payload = trimmedValues({
        step: "1",
        name: values[`name`] || "",
        client_id: values[`client_id`].value || "",
        manager_id: values[`manager_id`].value || "",
        start_date: values[`start_date`] || "",
        end_date: values[`end_date`] || "",
        project_type: values[`project_type`].value || "",
        priority: values[`priority`].value || "",
        experience: values[`experience`] || "",
        salary_range: values[`salary_range`] || "",
        no_of_openings: values[`no_of_openings`] || "",
        notice_period: values[`notice_period`].value || "",
        description: values[`description`] || "",
        project_status: values[`project_status`].value || "",
        department_id: null,
        department_name: "hr",
        key: Object.keys(projectData || "").length > 0 ? "update" : "create",
      });

      if (projectData?.id) {
        payload["id"] = projectData?.id || "";
      }

      try {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(res?.data?.message || "New Task added successfully");

          if (res.data.project_id) {
            getProjectDetails(res.data.project_id);
            setInitialValue(res.data?.description);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing error if any error comes from api
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          toast.error(res?.data?.message || "Invalid Data");
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setInformationLoading(false);
      }
    },
  });

  const convertDateFormat = (date) => {
    if (!date) return "";
    const dateComponents = date.split("-");

    const year = parseInt(dateComponents[0]);
    const month = parseInt(dateComponents[1]) - 1;
    const day = parseInt(dateComponents[2]);
    const dateObj = new Date(year, month, day);

    return dateObj;
  };
  const getEditorChangeFunc = () => {
    setFieldValue("description", getContent());
  };

  useEffect(() => {
    if (projectData) {
      setFieldValue("name", projectData?.name || "");
      setFieldValue(
        "client_id",
        projectData?.client
          ? { label: projectData?.client?.name, value: projectData?.client?.id }
          : ""
      );
      setFieldValue(
        "project_type",
        projectData?.project_type
          ? {
              label: projectData?.project_type,
              value: projectData?.project_type,
            }
          : ""
      );

      setFieldValue(
        "project_status",
        projectData?.project_status
          ? {
              label: projectData?.project_status,
              value: projectData?.project_status,
            }
          : ""
      );

      setFieldValue(
        "manager_id",
        projectData?.project_manager
          ? {
              label: `${projectData?.project_manager?.honorific} ${
                projectData?.project_manager?.first_name
              }${
                projectData?.project_manager?.middle_name
                  ? " " + projectData?.project_manager?.middle_name
                  : ""
              }${
                projectData?.project_manager?.last_name
                  ? " " + projectData?.project_manager?.last_name
                  : ""
              } - ${projectData?.project_manager?.employee_id}`,
              value: projectData?.project_manager?.id,
            }
          : ""
      );
      setFieldValue(
        "priority",
        projectData.priority
          ? { label: projectData.priority, value: projectData.priority }
          : ""
      );

      setFieldValue(
        "notice_period",
        projectData.notice_period
          ? {
              label: projectData.notice_period,
              value: projectData.notice_period,
            }
          : ""
      );
      setFieldValue("no_of_openings", projectData.no_of_openings || "");
      setFieldValue("experience", projectData.experience || "");
      setFieldValue("salary_range", projectData.salary_range || "");
      setFieldValue("select_level", projectData.salary_range || "");
      setFieldValue("start_date", projectData?.start_date || "");
      setStartDate(convertDateFormat(projectData?.start_date || ""));
      setFieldValue("end_date", projectData?.end_date || "");
      setEndDate(convertDateFormat(projectData?.end_date || ""));
      if (projectData?.description) {
        setFieldValue("description", projectData?.description);
        setInitialValue(projectData?.description);
      }
    }
  }, [projectData]);

  return (
    <React.Fragment>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Select Client<span>*</span>
              </InputLabel>
              <Select
                value={values.client_id}
                placeholder="Client Name"
                options={clients}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onChange={(selectedOptions) => {
                  setFieldValue("client_id", selectedOptions);
                }}
              />
              {errors.client_id && touched.client_id ? (
                <Typography component="span" className="error-msg">
                  {errors.client_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Title<span>*</span>
              </InputLabel>
              <TextField
                value={values.name}
                variant="outlined"
                id="project-tame"
                placeholder="Enter Project Title"
                onChange={handleChange}
                name="name"
                size="small"
                onBlur={handleBlur}
              />
              {errors.name && touched.name ? (
                <Typography component="span" className="error-msg">
                  {errors.name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Start Date<span>*</span>
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
                onChange={(date) => {
                  setStartDate(date);
                  setFieldValue(
                    "start_date",
                    moment(date).format("YYYY-MM-DD")
                  );
                }}
                selected={startDate}
                className="dateTime-picker calender-icon"
                placeholderText="Strat Date"
                autoComplete="off"
              />
              {errors.start_date && touched.start_date ? (
                <Typography component="span" className="error-msg">
                  {errors.start_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                End Date<span>*</span>
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
                onChange={(date) => {
                  setFieldValue("end_date", moment(date).format("YYYY-MM-DD"));
                  setEndDate(date);
                }}
                selected={endDate}
                className="dateTime-picker calender-icon"
                placeholderText="End Date"
                autoComplete="off"
              />
              {errors.end_date && touched.end_date ? (
                <Typography component="span" className="error-msg">
                  {errors.end_date}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Task<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select"
                options={projectType}
                value={values.project_type}
                onChange={(selectedOptions) => {
                  setFieldValue("project_type", selectedOptions);
                }}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
              />
              {errors.project_type && touched.project_type ? (
                <Typography component="span" className="error-msg">
                  {errors.project_type}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Manager<span>*</span>
              </InputLabel>
              <Select
                value={values.manager_id}
                placeholder="Manager"
                options={employees}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onChange={(selectedOptions) => {
                  setFieldValue("manager_id", selectedOptions);
                }}
              />
              {errors.manager_id && touched.manager_id ? (
                <Typography component="span" className="error-msg">
                  {errors.manager_id}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Experience<span>*</span>
              </InputLabel>
              <TextField
                value={values.experience}
                variant="outlined"
                id="experience"
                name="experience"
                placeholder="Enter total experience"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.experience && touched.experience ? (
                <Typography component="span" className="error-msg">
                  {errors.experience}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Salary Range<span>*</span>
              </InputLabel>
              <TextField
                variant="outlined"
                id="salary-range"
                name="salary_range"
                placeholder="Enter salary amount"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.salary_range}
              />
              {errors.salary_range && touched.salary_range ? (
                <Typography component="span" className="error-msg">
                  {errors.salary_range}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Select Level<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select"
                    options={selectLevels}
                    value={values.project_status}
                    onChange={(selectedOptions) => {
                      setFieldValue("project_status", selectedOptions);
                    }}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.project_status && touched.project_status ? (
                    <Typography component="span" className="error-msg">
                      {errors.project_status}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Number Of Openings<span>*</span>
                  </InputLabel>
                  <TextField
                    variant="outlined"
                    id="no-opening"
                    value={values.no_of_openings}
                    placeholder="Number Of Openings"
                    size="small"
                    name="no_of_openings"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.no_of_openings && touched.no_of_openings ? (
                    <Typography component="span" className="error-msg">
                      {errors.no_of_openings}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Priority<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select"
                    options={projectPriority}
                    value={values.priority}
                    onChange={(selectedOptions) => {
                      setFieldValue("priority", selectedOptions);
                    }}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.priority && touched.priority ? (
                    <Typography component="span" className="error-msg">
                      {errors.priority}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Notice Period<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select"
                    options={noticePeriod}
                    value={values.notice_period}
                    onChange={(selectedOptions) => {
                      setFieldValue("notice_period", selectedOptions);
                    }}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.notice_period && touched.notice_period ? (
                    <Typography component="span" className="error-msg">
                      {errors.notice_period}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Description<span>*</span>
              </InputLabel>
              <TextEditor getEditorChangeFunc={getEditorChangeFunc} />
              {getCharacterCount() > 300 || errors.description ? (
                <Typography component="span" className="error-msg">
                  {errors.description
                    ? errors.description
                    : "Description must be less than or equal to 300 characters"}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          sx={{ mt: 4 }}
        >
          <LoadingButton
            variant="contained"
            className="text-capitalize"
            color="primary"
            onClick={handleSubmit}
            loading={informationFormLoading}
          >
            {projectData ? "Update" : "Submit"}
          </LoadingButton>
          {/* <Button
            variant="outlined"
            color="primary"
            className="text-capitalize"
            onClick={handleResetForm}
          >
            Reset Form
          </Button> */}
          <Link to="/task/hr/list">
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

export default ProjectInformationFormHR;
