/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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
import useTextEditor from "../../../common/useTextEditor";
import { useAxios } from "@/contexts/AxiosProvider";
import { mapValues } from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import { ProjectInformationMarketingSchema } from "@/validations/ProjectInformationMarketingSchema";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
const ProjectInformationFormMarketing = ({
  projectData,
  getProjectDetail,
  employees,
  clients,
}) => {
  // Function to trim all values
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
  const { TextEditor, getContent, setInitialValue, getCharacterCount } =
    useTextEditor();
  //defining dropdown
  const projectType = [
    { label: "Web Development", value: "Web Development" },
    { label: "IOS Development", value: "IOS Development" },
    { label: "Andriod Development", value: "Andriod Development" },
  ];
  const projectStatus = [
    { label: "Planning", value: "Planning" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "On Hold", value: "On Hold" },
  ];
  const projectPriority = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
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
  //state to show loading animation
  const [loading, setLoading] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    // resetForm,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      client_id: "",
      name: "",
      start_date: "",
      end_date: "",
      estimation_type: "hours",
      estimation_value: "",
      manager_id: "",
      project_type: "",
      currency_type: "",
      cost: "",
      project_status: "",
      priority: "",
      description: "",
    },
    validationSchema: ProjectInformationMarketingSchema,
    onSubmit: async (values) => {
      if (getCharacterCount() > 300) return;
      setLoading(true);
      const payload = trimAllValues({
        ...values,
        step: "1",
        id: projectData.id || null,
        estimation_value: values.estimation_value || null,
        client_id: values.client_id?.value || null,
        start_date: values.start_date
          ? moment(values.start_date).format("YYYY-MM-DD")
          : null,
        end_date: values.end_date
          ? moment(values.end_date).format("YYYY-MM-DD")
          : null,
        manager_id: values.manager_id?.value || 1,
        project_type: values.project_type?.value || null,
        project_status: values.project_status?.value || null,
        priority: values.priority?.value || null,
        description: values.description,
        department_name: "marketing",
        key: Object.keys(projectData || "").length > 0 ? "update" : "create",
      });
      try {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(res.data.message);

          if (res.data.project_id) {
            getProjectDetail(res.data.project_id);
            setInitialValue(res.data?.description);
          }
          if (projectData.id) {
            getProjectDetail(projectData.id);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    },
  });
  const getEditorChangeFunc = () => {
    setFieldValue("description", getContent());
  };
  useEffect(() => {
    if (projectData) {
      setFieldValue(
        "client_id",
        projectData.client
          ? { label: projectData.client.name, value: projectData.client.id }
          : ""
      );
      setFieldValue("name", projectData.name || "");
      setFieldValue("start_date", projectData.start_date || "");
      setFieldValue("end_date", projectData.end_date || "");
      setFieldValue("estimation_value", projectData.estimation_value || "");
      // setFieldValue("estimation_type", projectData.estimation_type || "");
      setFieldValue(
        "manager_id",
        projectData.project_manager
          ? {
              label: `${
                projectData.project_manager?.honorific
                  ? `${projectData.project_manager?.honorific} `
                  : ""
              }${projectData.project_manager?.first_name || ""} ${
                projectData.project_manager?.middle_name
                  ? `${projectData.project_manager.middle_name} `
                  : ""
              }${projectData.project_manager?.last_name || ""}-${
                projectData.project_manager?.employee_id || ""
              }`,
              value: projectData.project_manager.id,
            }
          : ""
      );
      setFieldValue(
        "project_type",
        projectData.project_type
          ? { label: projectData.project_type, value: projectData.project_type }
          : ""
      );
      setFieldValue(
        "project_status",
        projectData.project_status
          ? {
              label: projectData.project_status,
              value: projectData.project_status,
            }
          : ""
      );
      setFieldValue(
        "priority",
        projectData.priority
          ? { label: projectData.priority, value: projectData.priority }
          : ""
      );
      setFieldValue("description", projectData.description || "");
      setFieldValue("cost", projectData.cost || "");
      // setFieldValue("currency_type", projectData.currency_type || "");

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
                Client Name<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Client Name"
                options={clients}
                value={values.client_id}
                name="client_id"
                onChange={(selectedOption) => {
                  setFieldValue("client_id", selectedOption);
                }}
                onBlur={handleBlur}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
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
                Project Title<span>*</span>
              </InputLabel>
              <TextField
                variant="outlined"
                id="client-name"
                placeholder="Enter Project Title"
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
                  setFieldValue("start_date", date);
                }}
                name="start_date"
                onBlur={handleBlur}
                selected={
                  values.start_date ? new Date(values.start_date) : null
                }
                className="dateTime-picker calender-icon"
                placeholderText="Start Date"
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
              <InputLabel className="fixlabel">End Date</InputLabel>
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
                  setFieldValue("end_date", date);
                }}
                name="end_date"
                onBlur={handleBlur}
                selected={values.end_date ? new Date(values.end_date) : null}
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

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Project Value</InputLabel>
                  <TextField
                    variant="outlined"
                    id="project-value"
                    placeholder="Enter Project Value"
                    size="small"
                    name="cost"
                    onChange={(e) => {
                      const pattern = /^\d+$/;
                      if (
                        pattern.test(e.target.value) ||
                        e.target.value == ""
                      ) {
                        setFieldValue("cost", e.target.value);
                      }
                    }}
                    value={values.cost}
                    onBlur={handleBlur}
                  />
                  {errors.cost && touched.cost ? (
                    <Typography component="span" className="error-msg">
                      {errors.cost}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Estimated Hours</InputLabel>
                  <TextField
                    variant="outlined"
                    id="estimated-hours"
                    placeholder="Enter Estimated Hours"
                    size="small"
                    name="estimation_value"
                    onChange={(e) => {
                      const pattern = /^\d+$/;
                      if (
                        pattern.test(e.target.value) ||
                        e.target.value == ""
                      ) {
                        setFieldValue("estimation_value", e.target.value);
                      }
                    }}
                    onBlur={handleBlur}
                    value={values?.estimation_value}
                  />
                  {errors.estimation_value && touched.estimation_value ? (
                    <Typography component="span" className="error-msg">
                      {errors.estimation_value}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Marketing Manager<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Manager"
                    options={employees}
                    value={values.manager_id}
                    onChange={(selectedOption) => {
                      setFieldValue("manager_id", selectedOption);
                    }}
                    name="manager_id"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.manager_id && touched.manager_id ? (
                    <Typography component="span" className="error-msg">
                      {errors.manager_id}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Project Type<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Project Type"
                    options={projectType}
                    value={values.project_type}
                    onChange={(selectedOption) => {
                      setFieldValue("project_type", selectedOption);
                    }}
                    name="project_type"
                    onBlur={handleBlur}
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Project Priority<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Project Priority"
                    options={projectPriority}
                    value={values.priority}
                    onChange={(selectedOption) => {
                      setFieldValue("priority", selectedOption);
                    }}
                    name="priority"
                    onBlur={handleBlur}
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
                    Project Status<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Project Status"
                    options={projectStatus}
                    value={values.project_status}
                    onChange={(selectedOption) => {
                      setFieldValue("project_status", selectedOption);
                    }}
                    name="project_status"
                    onBlur={handleBlur}
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
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Project Description</InputLabel>
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
            className="text-capitalize"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {Object.keys(projectData || "").length > 0 ? "Update" : "Save"}
          </LoadingButton>
          <Link to={"/task/marketing/list"}>
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

export default ProjectInformationFormMarketing;
