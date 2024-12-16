/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { ProjectInformationDevSchema } from "@/validations/ProjectInformationDevSchema";
import { mapValues } from "lodash";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
const ProjectInformationFormDev = ({
  projectData,
  getProjectDetail,
  technologies,
  employees,
  clients,
}) => {
  let id;
  const { projeect_id } = useParams();
  // Function to trim all values
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
  const { TextEditor, getContent, setInitialValue, getCharacterCount } =
    useTextEditor({
      height: 200,
      initialValue: "",
    });
  //defining dropdown
  const projectType = [
    { label: "Web Development", value: "Web Development" },
    { label: "Mobile App Development", value: "Mobile App Development" },
    { label: "Software Development", value: "Software Development" },
    { label: "E-commerce Development", value: "E-commerce Development" },
    { label: "UI/UX Design", value: "UI/UX Design" },
    { label: "Database Management", value: "Database Management" },
    { label: "IT Infrastructure", value: "IT Infrastructure" },
    { label: "Artificial Intelligence", value: "Artificial Intelligence" },
    { label: "Machine Learning", value: "Machine Learning" },
    {
      label: "Internet of Things (IoT) Development",
      value: "Internet of Things (IoT) Development",
    },
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
    resetForm,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      client_id: "",
      name: "",
      start_date: "",
      end_date: "",
      estimation_type: "",
      estimation_value: "",
      manager_id: "",
      project_type: "",
      currency_type: "",
      cost: "",
      project_status: "",
      priority: "",
      technologies: [],
      description: "",
    },
    validationSchema: ProjectInformationDevSchema,
    onSubmit: async (values) => {
      if (getCharacterCount() > 300) return;
      setLoading(true);
      const payload = trimAllValues({
        ...values,
        step: 1,
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
        technologies: values.technologies.map((data) => data.value),
        estimation_type: values.estimation_type || "Hours",
        currency_type: values.currency_type || "$",
        department_name: "development",
        key: Object.keys(projectData || {}).length > 0 ? "update" : "create",
      });
      try {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(
            res.data?.message || "Project Information Added Successfully"
          );

          if (res.data.project_id) {
            // id = res.data.p roject_id;
            getProjectDetail(res.data.project_id);
          }
          if (projectData.id) {
            getProjectDetail(projectData.id);
          }

          // setContent("");
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
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    },
  });

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
      setFieldValue("estimation_type", projectData.estimation_type || "");
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
      setFieldValue("cost", projectData.cost || "");
      setFieldValue("currency_type", projectData.currency_type || "");
      setFieldValue("description", projectData.description || "");
      if (projectData?.description) {
        setInitialValue(projectData?.description);
      }

      setFieldValue(
        "technologies",
        (projectData.technologies || []).map((technology) => ({
          label: technology.name,
          value: technology.id,
        }))
      );
    }
  }, [projectData]);

  const getEditorChangeFunc = () => {
    setFieldValue("description", getContent());
  };
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
                placeholder="Select Client Name"
                options={clients}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                value={values.client_id}
                onChange={(selectedOption) => {
                  setFieldValue("client_id", selectedOption);
                }}
                name="client_id"
                onBlur={handleBlur}
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
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
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
                selected={
                  values.start_date ? new Date(values.start_date) : null
                }
                onBlur={handleBlur}
                name="start_date"
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
                selected={values.end_date ? new Date(values.end_date) : null}
                name="end_date"
                onBlur={handleBlur}
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
              <InputLabel className="fixlabel">Estimated Time</InputLabel>
              <Stack
                component={"div"}
                direction={"row"}
                alignItems={"center"}
                className="input-dropdown"
              >
                <input
                  type="text"
                  name="estimation_value"
                  id=""
                  placeholder="Enter hours/days"
                  value={values.estimation_value}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^\d.]/g, "");
                    handleChange({
                      target: {
                        name: "estimation_value",
                        value: numericValue,
                      },
                    });
                  }}
                />
                <select
                  onChange={(e) => {
                    const selectedOption = e.target.value;
                    setFieldValue("estimation_type", selectedOption);
                  }}
                  value={values.estimation_type}
                  onBlur={handleBlur}
                  name="estimation_type"
                >
                  <option value="Hours">Hours</option>
                  <option value="Day">Day</option>
                </select>
              </Stack>
              {errors.estimation_value && touched.estimation_value ? (
                <Typography component="span" className="error-msg">
                  {errors.estimation_value}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Project Manager<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Project Manager"
                options={employees}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                value={values.manager_id}
                onChange={(selectedOption) => {
                  setFieldValue("manager_id", selectedOption);
                }}
                name="manager_id"
                onBlur={handleBlur}
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
                Project Type<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Project Type"
                options={projectType}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                value={values.project_type}
                onChange={(selectedOption) => {
                  setFieldValue("project_type", selectedOption);
                }}
                name="project_type"
                onBlur={handleBlur}
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
              <InputLabel className="fixlabel">Project Cost</InputLabel>
              <Stack
                component={"div"}
                direction={"row"}
                alignItems={"center"}
                className="input-dropdown"
              >
                <input
                  type="text"
                  name="cost"
                  id=""
                  placeholder="Enter Project Cost"
                  value={values.cost}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^\d.]/g, "");
                    handleChange({
                      target: {
                        name: "cost",
                        value: numericValue,
                      },
                    });
                  }}
                />
                <select
                  onChange={(e) => {
                    const selectedOption = e.target.value;
                    setFieldValue("currency_type", selectedOption);
                  }}
                  value={values.currency_type}
                  onBlur={handleBlur}
                  name="currency_type"
                >
                  <option>$</option>
                  <option>₹</option>
                  <option>€</option>
                  <option>£</option>
                </select>
              </Stack>
              {errors.cost && touched.cost ? (
                <Typography component="span" className="error-msg">
                  {errors.cost}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Project Status<span>*</span>
              </InputLabel>
              <Select
                placeholder="Project Status"
                options={projectStatus}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                value={values.project_status}
                onChange={(selectedOption) => {
                  setFieldValue("project_status", selectedOption);
                }}
                name="project_status"
                onBlur={handleBlur}
              />
              {errors.project_status && touched.project_status ? (
                <Typography component="span" className="error-msg">
                  {errors.project_status}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Project Priority<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Priority"
                options={projectPriority}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                value={values.priority}
                onChange={(selectedOption) => {
                  setFieldValue("priority", selectedOption);
                }}
                name="priority"
                onBlur={handleBlur}
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
                Project Technology<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Technology"
                options={technologies}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                isMulti
                value={values.technologies}
                onChange={(selectedOption) => {
                  setFieldValue("technologies", selectedOption);
                }}
                name="technologies"
                onBlur={handleBlur}
              />
              {errors.technologies && touched.technologies ? (
                <Typography component="span" className="error-msg">
                  {errors.technologies}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={10} sm={6} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Project Description<span>*</span>
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
            className="text-capitalize"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {Object.keys(projectData || "").length > 0 ? "Update" : "Save"}
          </LoadingButton>
          <Link to={"/task/dev/list"}>
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

export default ProjectInformationFormDev;
