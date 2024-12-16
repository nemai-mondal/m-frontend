import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Grid,
  InputLabel,
  TextField,
  Button,
  FormHelperText,
  Avatar,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-tabs/style/react-tabs.css";
import "./apply-leave.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { ApplyLeave as ApplyLeaveValidation } from "@/validations/LeaveSchema";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppliedLeave from "./AppliedLeave";
import { ImagePath } from "@/ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "@/redux/AppliedLeaveSlice";
import { refresh as leaveBalanceRefresh } from "@/redux/LeaveBalanceSlice";

const ApplyLeave = () => {
  const { Axios } = useAxios();
  const dispatch = useDispatch();
  const { data: leaveBalanceData } = useSelector((state) => state.leaveBalance);
  // State to store leave types
  const [leaveTypes, setLeaveTypes] = useState([]);
  // State to store employees
  const [employees, setEmployees] = useState([]);
  // State to store holidays
  const [holidays, setHolidays] = useState([]);
  // State to store leaveBalance
  const [leaveCLBalance, setLeaveCLBalance] = useState({});
  const [leavePLBalance, setLeavePLBalance] = useState({});
  const [leaveSLBalance, setLeaveSLBalance] = useState({});
  // const to store leave value
  const leaveValues = [
    { value: "first_half_day", label: "First Half" },
    { value: "second_half_day", label: "Second Half" },
    { value: "full_day", label: "Full Day" },
  ];

  // Function to fetch leave types from the server
  const getLeaveTypes = async () => {
    try {
      // Make the API request to fetch leave types
      // const res = await Axios.get("leave-application/balance");

      // Update state with the fetched leave types, or set to an empty array if undefined
      setLeaveTypes(
        (leaveBalanceData || []).map((m) => {
          return { value: m.id, label: m.leave_name };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching leave types", error);
    }
  };

  // Function to fetch employees from the server
  const getEmployees = useCallback(async () => {
    try {
      // Make the API request to fetch employees
      const res = await Axios.get("/user/list");

      // Update date with the fetched employees, or set to an empty array if undefined
      setEmployees(
        (res.data?.data || []).map((m) => {
          return {
            value: m.email,
            label: `${m.honorific} ${m.first_name}${
              m.middle_name ? " " + m.middle_name : ""
            }${m.last_name ? " " + m.last_name : ""} - ${m.employee_id}`,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching leave types", error);
    }
  }, []);

  const isWeekday = (date) => {
    const day = moment(date).day();
    return day !== 0 && day !== 6; // Disable Sunday (0) and Saturday (6)
  };

  const fetchHoliday = async () => {
    try {
      const res = await Axios.get(`holiday/list`);

      const allHolidayData = []
        .concat(
          ...res.data.data.map((data) => {
            return getDates(data.date_from, data.date_to);
          })
        )
        .slice(0, 15);

      setHolidays(allHolidayData);
    } catch (error) {
      // Log an error message if there's an issue fetching holidays
      console.error("Error fetching holidays", error);
    }
  };

  useEffect(() => {
    setLeaveCLBalance(leaveBalanceData.find((f) => f.abbreviation === "CL"));
    setLeavePLBalance(leaveBalanceData.find((f) => f.abbreviation === "PL"));
    setLeaveSLBalance(leaveBalanceData.find((f) => f.abbreviation === "SL"));
    getLeaveTypes();
  }, [leaveBalanceData]);

  useEffect(() => {
    dispatch(leaveBalanceRefresh());
  }, [dispatch]);

  // Use useEffect to fetch leave types when the component mounts
  useEffect(() => {
    fetchHoliday();
    getEmployees();
  }, []); // Dependency array ensures that the effect runs only on mount

  const [selectFileName, setSelectFileName] = useState("Choose file....");

  const onFileSelect = (e) => {
    if (e.target.files[0]?.name) {
      setSelectFileName(e.target.files[0].name);
      setFieldValue("attachments", e.target.files[0]);
    }
  };

  const getDates = (date_from, date_to) => {
    if (moment(date_from).isSame(date_to, "day")) {
      return [moment(date_from).format("YYYY-MM-DD")];
    } else {
      const dates = [];
      let currentDate = moment(date_from);
      let lastDate = moment(date_to);

      while (currentDate <= lastDate) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.clone().add(1, "days");
      }
      return dates.filter(isWeekday);
    }
  };

  const getLeaveAbleDates = (from_date, till_date) => {
    let leaveDates = getDates(from_date, till_date);
    const newDates = leaveDates.filter((h) => !holidays.includes(h));
    if (newDates.length < 1) {
      toast.error("Selected dates are holidays!");
    }
    return newDates;
  };

  function removeTags(str) {
    if (str === null || str === "" || str ===undefined) return false;
    else str = str?.toString();

    // Regular expression to remove HTML tags and &nbsp;
    return str.replace(/<[^>]+>|&nbsp;/gi, "");
  }
  const randColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()
    );
  };
  const colors = useMemo(() => {
    return leaveBalanceData?.map(() => randColor());
  }, [leaveBalanceData]);

  const onSubmitApplyLeave = async (values) => {
    try {
      let dates = getLeaveAbleDates(values.from_date, values.till_date);
      if (dates.length < 1) {
        return;
      }
      let data = {
        dates,
        ...{
          from_date: moment(values.from_date).format("YYYY-MM-DD"),
          till_date: moment(values.till_date).format("YYYY-MM-DD"),
        },
        leave_type_id: values.leave_type_id.value,
        leave_value_start: values.leave_value_start.value,
        leave_value_end: values.leave_value_end.value,
        remarks: values.remarks,
        attachments: values.attachments,
        email_notificaiton_to: values.email_notificaiton_to.map((m) => m.value),
      };

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      });

      const res = await Axios.post("leave-application/create", formData);

      if (res.status === 201) {
        toast.success("Successfully Leave Applied.");
        dispatch(refresh());
        dispatch(leaveBalanceRefresh());
        handleResetForm();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to connect to the server.");
      }
    }
  };

  const handleResetForm = () => {
    setSelectFileName("Choose file....");
    resetForm();
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    handleBlur,
    isSubmitting,
  } = useFormik({
    initialValues: {
      leave_type_id: "",
      leave_value_start: "",
      leave_value_end: "",
      remarks: "",
      attachments: "",
      email_notificaiton_to: [],
      from_date: new Date(),
      till_date: new Date(),
    },
    validationSchema: ApplyLeaveValidation,
    onSubmit: onSubmitApplyLeave,
  });
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
            <span>Apply Leave</span>
          </Stack>
          <CardContent sx={{ p: 2 }}>
            <div style={{ display: "flex", gap: "20px", overflow: "auto" }}>
              {leaveBalanceData?.length >= 1
                ? leaveBalanceData?.map((el, i) => (
                    <Grid
                      key={el?.id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      sx={{ minWidth: "350.44px" }}
                    >
                      <Card
                        variant="outlined"
                        className={`cardBox leavepanel ${
                          i % 2 == 0 ? "sick-leave" : "casual-leave"
                        }`}
                        sx={{ p: 2, border: 0 }}
                      >
                        <Stack direction={"row"} alignItems={"flex-start"}>
                          {/* <Avatar alt="PL Icon" src={ImagePath.plIcon} /> */}
                          <Avatar
                            sx={{ bgcolor: colors[i], fontSize: "14px" }}
                            className="avtar"
                          >
                            {el?.abbreviation}
                          </Avatar>
                          <Box pl={2}>
                            <Typography component={"h2"}>
                              {el?.leave_name}
                            </Typography>
                            <Typography component={"p"}>
                              {removeTags(el?.comment) || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          className="leave-border"
                        >
                          <Box className="leave-balance">
                            <Typography component={"p"}>Total Leave</Typography>
                            <Typography component={"span"}>
                              {el?.balance || "0"}
                            </Typography>
                          </Box>
                          <Box className="leave-balance">
                            <Typography component={"p"}>Used Leave</Typography>
                            <Typography component={"span"}>
                              {el?.used || "0"}
                            </Typography>
                          </Box>
                          <Box className="leave-balance">
                            <Typography component={"p"}>
                              Available Leave
                            </Typography>
                            <Typography component={"span"}>
                              {el?.available || "0"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  ))
                : ""}
            </div>

            <Box mt={3}>
              <Typography component="h2" sx={{ pb: 2 }} className="heading-2">
                Leave Apply{" "}
              </Typography>
              <Grid container spacing={2} p={0} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <InputLabel className="fixlabel">
                    Leave Type<span>*</span>
                  </InputLabel>
                  <Select
                    onChange={(value) => setFieldValue("leave_type_id", value)}
                    value={values.leave_type_id}
                    options={leaveTypes}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    placeholder="Select Leave Type"
                    onBlur={handleBlur}
                  />
                  {errors.leave_type_id && touched.leave_type_id && (
                    <FormHelperText className="error-msg">
                      {errors.leave_type_id}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={3}>
                  <InputLabel className="fixlabel">
                    From Date<span>*</span>
                  </InputLabel>
                  <DatePicker
                    onChange={(date) => setFieldValue("from_date", date)}
                    name="from_date"
                    selected={values.from_date}
                    className="dateTime-picker"
                    placeholderText="From Date"
                    minDate={new Date()}
                    filterDate={isWeekday}
                  />
                  {errors?.from_date && (
                    <FormHelperText className="error-msg">
                      {errors.from_date}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <InputLabel className="fixlabel">
                    Till Date<span>*</span>
                  </InputLabel>
                  <DatePicker
                    onChange={(date) => setFieldValue("till_date", date)}
                    name="till_date"
                    selected={values.till_date}
                    className="dateTime-picker"
                    placeholderText="Till Date"
                    minDate={new Date()}
                    filterDate={isWeekday}
                  />
                  {errors.till_date && (
                    <FormHelperText className="error-msg">
                      {errors.till_date}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={3}>
                  <InputLabel className="fixlabel">
                    Leave Value From<span>*</span>
                  </InputLabel>

                  <Select
                    onChange={(value) =>
                      setFieldValue("leave_value_start", value)
                    }
                    value={values.leave_value_start}
                    options={leaveValues}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    placeholder="Select Leave Value"
                  />
                  {errors.leave_value_start && touched.leave_value_start && (
                    <FormHelperText className="error-msg">
                      {errors.leave_value_start}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <InputLabel className="fixlabel">
                    Leave Value To<span>*</span>
                  </InputLabel>
                  <Select
                    onChange={(value) =>
                      setFieldValue("leave_value_end", value)
                    }
                    value={values.leave_value_end}
                    options={leaveValues}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    placeholder="Select Leave Value"
                    onBlur={handleBlur}
                  />
                  {errors.leave_value_end && touched.leave_value_end && (
                    <FormHelperText className="error-msg">
                      {errors.leave_value_end}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className="fixlabel">Remarks</InputLabel>
                  <TextField
                    id="remarks"
                    placeholder="Remarks Description"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    name="remarks"
                    onBlur={handleBlur}
                    value={values.remarks}
                  />
                  {errors.remarks &&
                    touched.remarks(
                      <FormHelperText className="error-msg">
                        {errors.remarks}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className="fixlabel">Attachment</InputLabel>
                  <Box component="div" className="choosefile">
                    <Typography
                      component="label"
                      htmlFor="file-upload"
                      id="file-upload-filename"
                    >
                      {selectFileName}
                    </Typography>
                    <input
                      type="file"
                      name="attachments"
                      id="file-upload"
                      onChange={(e) => {
                        onFileSelect(e);
                        e.target.value = null;
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
                  {errors.attachments && touched.attachments && (
                    <FormHelperText className="error-msg">
                      {errors.attachments}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className="fixlabel">Mail To</InputLabel>
                  <Select
                    onChange={(values) =>
                      setFieldValue("email_notificaiton_to", values)
                    }
                    value={values.email_notificaiton_to}
                    options={employees}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    placeholder="Search Employee"
                    isMulti
                  />
                  {errors.email_notificaiton_to && (
                    <FormHelperText className="error-msg">
                      {errors.email_notificaiton_to}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2}>
                <Button
                  color="primary"
                  variant="contained"
                  className="primary-btn text-capitalize"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  className=" text-capitalize"
                  onClick={handleResetForm}
                >
                  Cancel
                </Button>
              </Stack>

              <Typography
                component="h2"
                sx={{ pb: 2, marginTop: 5 }}
                className="heading-2"
              >
                Leave History
              </Typography>

              {/* Table Here*/}
              <AppliedLeave />
              {/* Table Here*/}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default ApplyLeave;
