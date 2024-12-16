import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormGroup,
  Grid,
  InputLabel,
  TextField,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import DatePicker from "react-datepicker";
import HelpIcon from "@mui/icons-material/Help";
import Select from "react-select";
import { getYear, getMonth } from "date-fns";
import "./style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { WorkLogSchema } from "@/validations/WorkLogSchema";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { useAxios } from "@/contexts/AxiosProvider";
import useTextEditor from "../common/useTextEditor";
// import PieChart from "../highcharts/PieChart";
// import PieChartDepartment from "../highcharts/PieChartDonut";
import { AuthContext } from "@/contexts/AuthProvider";
const AddTimeSheet = () => {
  const { user } = useContext(AuthContext);
  const { Axios } = useAxios();
  const navigate = useNavigate();
  const { TextEditor, getContent, setContent, getCharacterCount } =
    useTextEditor({
      height: 200,
      initialValue: "",
    });
  const longText = `Use the format: (2w 4d 6h 45m) w = weeks
  d = days
  h = hours
  m = minutes`;
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  // const [showHighchart, setShowHighchart] = useState(false);
  // const [projectChartData, setProjectChartData] = useState([]);
  // const [departmentChartData, setDepartmentChartData] = useState([]);

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
  //function to get project Details
  const fetchProject = useCallback(async (id) => {
    try {
      const res = await Axios.get(`project/get-project/${id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        let projectAllData = (res.data?.data || []).map((project) => ({
          value: project.id||"",
          label: project.name||"",
        }));
        setProjects(projectAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  //function to get activity details
  const fetchActivity = useCallback(async (id) => {
    try {
      const res = await Axios.get(`department/show/${id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const activityAllData = (res.data?.data?.activities || []).map(
          (activity) => ({
            value: activity.id||"",
            label: activity.name||"",
          })
        );
        setActivity(activityAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  //function to get client detail
  const getCLient = useCallback(async () => {
    try {
      const res = await Axios.get("client/list");
      if (res.status && res.status >= 200 && res.status < 300) {
        const clientallData = (res.data?.data || []).map((item) => ({
          value: item.id||"",
          label: item.name||"",
        }));
        setClient(clientallData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  //function to handel error ,get user input and send data to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    handleBlur,
    setFieldValue,
    touched,
  } = useFormik({
    initialValues: {
      activity_id: "",
      project_id: "",
      client_id: "",
      date: "",
      description: "",
      time_spent: "",
      task_url: "",
    },
    validationSchema: WorkLogSchema,
    onSubmit: async (values) => {
      // let timeInMinutes = values.time_spent.split(":");
      // if (timeInMinutes.length == 2 && timeInMinutes[0] && timeInMinutes[1]) {
      //   timeInMinutes = `${values.time_spent}:00`;
      // }
      // if (timeInMinutes.length == 1 && timeInMinutes[0]) {
      //   timeInMinutes = `${values.time_spent}:00:00`;
      // }
      // if (timeInMinutes.length == 2 && timeInMinutes[1]) {
      //   timeInMinutes = `00${values.time_spent}:00`;
      // }
      if (getCharacterCount() > 1000) return;

      const formatTime = (timeString) => {
        const timeComponents = timeString.split(" ");

        // Variable to store the total minutes
        let totalMinutes = 0;
        timeComponents.forEach((component) => {
          // Get the Number
          const value = parseInt(component);
          // Get the last character
          const unit = component.slice(-1);

          // Use a switch case to handle different time
          switch (unit) {
            case "w":
              totalMinutes += value * 5 * 8 * 60;
              break;
            case "d":
              totalMinutes += value * 8 * 60;
              break;
            case "h":
              totalMinutes += value * 60;
              break;
            case "m":
              totalMinutes += value;
              break;
            default:
              break;
          }
        });

        // Calculate days, hours, and minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.floor((totalMinutes % 1) * 60);
        // Return the time
        return `${hours}:${minutes}:${seconds}`;
      };
      const payload = {
        ...values,
        client_id: values.client_id.value,
        project_id: values.project_id.value,
        activity_id: values.activity_id.value,
        date: moment(values.date).format("YYYY-MM-DD"),
        time_spent: formatTime(values.time_spent),
      };
      if (formatTime(values.time_spent).split(":")[0] > 838) {
        toast.info("More than 838 hours not allowed");
        return;
      }
      try {
        setLoading(true);
        const res = await Axios.post("worklog/create", payload);
        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          toast.success("Timesheet submitted successfully");
          setContent("");
          resetForm();
          navigate("/work-sheet");
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
  });
  //useeffect to get client ,project and activity details when component mount
  useEffect(() => {
    if (user?.department?.id) {
      fetchActivity(user.department.id);
    }
    getCLient();
  }, [user]);
  //function to send message when no data is there
  const noClientsMessage = () => {
    return "No Client Has Been Added";
  };
  //function to send message when no data is there
  const noProjectsMessage = () => {
    return "No Project Has Been Added";
  };
  //function to send message when no data is there
  const noActivityMessage = () => {
    return "No Activity Has Been Added";
  };

  // const getProjectChartData = useCallback(async (project_id) => {
  //   try {
  //     const res = await Axios.get(`worklog/team/${project_id}`);

  //     setShowHighchart(true);
  //     setProjectChartData(res.data.data);
  //     setDepartmentChartData(res.data);
  //   } catch (error) {
  //     setShowHighchart(false);
  //     if (error.response && error.response.status === 500) {
  //       toast.error("Unable to connect to the server");
  //     }
  //   }
  // }, []);

  const getEditorChangeFunc = () => {
    setFieldValue("description", getContent());
  };

  const handleResetForm = () => {
    setContent("");
    resetForm();
  };

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox quote" sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Add Time Sheet</span>
          </Stack>
          <CardContent sx={{ p: 2, borderBottom: "1px solid lightgrey" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel className="fixlabel">
                  Select Client<span>*</span>
                </InputLabel>
                <Select
                  options={client}
                  // defaultValue={"select client"}
                  value={values.client_id}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Select Client"
                  name="client_id"
                  onChange={(selectedOptions) => {
                    selectedOptions.value !== values.client_id.value
                      ? setFieldValue("project_id", "")
                      : "";
                    fetchProject(selectedOptions.value);
                    setFieldValue("client_id", selectedOptions);
                  }}
                  onBlur={handleBlur}
                  noOptionsMessage={noClientsMessage}
                />
                {errors.client_id && touched.client_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.client_id}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel className="fixlabel">
                  Select Project<span>*</span>
                </InputLabel>
                <Select
                  options={projects}
                  value={values.project_id}
                  name="project_id"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Select Project"
                  noOptionsMessage={noProjectsMessage}
                  onChange={(selectedOptions) => {
                    setFieldValue("project_id", selectedOptions);
                  }}
                  onBlur={handleBlur}
                  isDisabled={values.client_id ? false : true}
                />
                {errors.project_id && touched.project_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.project_id}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel className="fixlabel">
                  Select Date<span>*</span>
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
                    setFieldValue("date", date);
                  }}
                  selected={values.date}
                  className="dateTime-picker calender-icon"
                  placeholderText="Start Date"
                  autoComplete="off"
                />
                {errors.date && touched.date ? (
                  <Typography component="span" className="error-msg">
                    {errors.date}
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel className="fixlabel">
                  Select Activity<span>*</span>
                </InputLabel>
                <Select
                  options={activity}
                  value={values.activity_id}
                  name="activity_id"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                  placeholder="Select Activity"
                  noOptionsMessage={noActivityMessage}
                  onChange={(selectedOptions) => {
                    setFieldValue("activity_id", selectedOptions);
                  }}
                  onBlur={handleBlur}
                  isDisabled={values.project_id ? false : true}
                />
                {errors.activity_id && touched.activity_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.activity_id}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup sx={{ mt: 2 }}>
                  <InputLabel className="fixlabel">
                    Spend Hours<span>*</span> - (Ex - 2w 4d 6h 45m){" "}
                    <Tooltip title={longText}>
                      <HelpIcon
                        sx={{
                          fontSize: 14,
                          marginLeft: 1,
                          position: "relative",
                          top: 2,
                          color: "#7ea5cb",
                          cursor: "help",
                        }}
                      />
                    </Tooltip>
                  </InputLabel>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={values.time_spent}
                    name="time_spent"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.time_spent && touched.time_spent ? (
                    <Typography component="span" className="error-msg">
                      {errors.time_spent}
                    </Typography>
                  ) : null}
                </FormGroup>
                <FormGroup sx={{ mt: 2 }}>
                  <InputLabel className="fixlabel">Task ID</InputLabel>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={values.task_url}
                    name="task_url"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.task_url && touched.task_url ? (
                    <Typography component="span" className="error-msg">
                      {errors.task_url}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormGroup sx={{ mt: 2 }}>
                  <InputLabel className="fixlabel">Description</InputLabel>
                  <TextEditor getEditorChangeFunc={getEditorChangeFunc} />
                  {getCharacterCount() > 1000 || errors.description ? (
                    <Typography component="span" className="error-msg">
                      {errors.description
                        ? errors.description
                        : "Description must be less than or equal to 1000 characters"}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} mt={3}>
              <LoadingButton
                variant="contained"
                className="primary-btn text-capitalize"
                color="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                Submit
              </LoadingButton>
              <Button
                color="primary"
                variant="outlined"
                className=" text-capitalize"
                onClick={handleResetForm}
              >
                Reset Form
              </Button>
            </Stack>
          </CardContent>

          {/* {showHighchart && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <PieChart projectChartData={projectChartData} />
              </Grid>
              <Grid item xs={6}>
                <PieChartDepartment departmentChartData={departmentChartData} />
              </Grid>
            </Grid>
          )} */}

          {/* <Grid container spacing={2}>
            <Grid item xs={6}>
              <PieChart projectChartData={projectChartData} />
            </Grid>
            <Grid item xs={6}>
              <PieChartDepartment departmentChartData={departmentChartData} />
            </Grid>
          </Grid> */}
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default AddTimeSheet;
