/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "react-datepicker";
import {
  Backdrop,
  Box,
  Fade,
  FormGroup,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getYear, getMonth } from "date-fns";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { AdminAccessSchema } from "@/validations/AdminAccessSchema";
const AdminAccessModal = ({
  editAccessOpen,
  editAccessData,
  closeEditAdminAccessModal,
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
  //dispatch to send request to the redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to store employee details
  const [employee, setEmployee] = useState("");
  const [shifts, setShifts] = useState("");
  //Get All Shifts list
  const getShifts = async () => {
    try {
      const res = await Axios.get("shift/list");
      if (res.status && res.status === 200) {
        const shifts = (res.data?.data || []).map((item) => ({
          value: item.id,
          label:
            item.name + " (" + item.shift_start + "-" + item.shift_end + ")",
        }));
        setShifts(shifts);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //fetching employee details
  const getEmployee = async () => {
    try {
      const res = await Axios.get("user/list");
      if (res.status && res.status === 200) {
        const employeeAllData = (res.data?.data || []).map((item) => ({
          value: item.id,
          label: `${item?.honorific ? `${item?.honorific} ` : ""}${
            item?.first_name || ""
          } ${item?.middle_name ? `${item.middle_name} ` : ""}${
            item?.last_name || ""
          }-${item?.employee_id || ""}`,
        }));
        setEmployee(employeeAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //getting user input and sending to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    handleBlur,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: editAccessData.email || "",
      machine_code:
        editAccessData?.assets?.length > 0
          ? editAccessData.assets[editAccessData.assets.length - 1].sr_no
          : "",
      date_of_joining:
        editAccessData?.joining?.length > 0
          ? editAccessData?.joining[editAccessData.joining.length - 1]
              ?.date_of_joining
          : "",
      reporting_manager_id: editAccessData?.reporting_manager?.id
        ? {
            label: `${
              editAccessData?.reporting_manager?.honorific
                ? `${editAccessData?.reporting_manager?.honorific} `
                : ""
            }${editAccessData?.reporting_manager?.first_name || ""} ${
              editAccessData?.reporting_manager?.middle_name
                ? `${editAccessData.reporting_manager?.middle_name} `
                : ""
            }${editAccessData?.reporting_manager?.last_name || ""}-${
              editAccessData?.reporting_manager?.employee_id || ""
            }`,
            value: editAccessData?.reporting_manager?.id,
          }
        : "",
      shift_id:
        editAccessData?.shift.length > 0
          ? {
              label: `${editAccessData.shift[0].name} (${editAccessData.shift[0].shift_start} ${editAccessData.shift[0].shift_end})`,
              value: editAccessData.shift[0].id,
            }
          : "",
    },
    validationSchema: AdminAccessSchema,
    onSubmit: async (values) => {
      const payload = {
        step: 4,
        user_id: editAccessData.id,
        email: values.email.trim(),
        machine_code: values.machine_code.trim(),
        date_of_joining: moment(values.date_of_joining).format("YYYY-MM-DD"),
        reporting_manager_id: values.reporting_manager_id.value,
        shift_id:values.shift_id.value
      };

      setLoading(true);
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditAdminAccessModal(false);
          //sending request to the redux store
          getEmployeeDetails(editAccessData.id, 1);
          toast.success(res.data.message);
          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors||"").forEach((key) => {
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

  //useeffect to call function when component will be mount
  useEffect(() => {
    getEmployee();
    getShifts();
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={editAccessOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={editAccessOpen}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Update Details
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditAdminAccessModal}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y hvh-50">
            <Stack spacing={2}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Email Id<span>*</span>
                </InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Email-Id"
                  variant="outlined"
                  value={values.email}
                  fullWidth
                  name="email"
                  size="small"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email ? (
                  <Typography component="span" className="error-msg">
                    {errors.email}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Machine Code<span>*</span>
                </InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Machine Code"
                  variant="outlined"
                  value={values.machine_code}
                  fullWidth
                  name="machine_code"
                  size="small"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.machine_code && touched.machine_code ? (
                  <Typography component="span" className="error-msg">
                    {errors.machine_code}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Reporting Manager
                  <Typography component={"span"}>*</Typography>
                </InputLabel>
                <Select
                  placeholder="Select Reporting Manager"
                  options={employee}
                  name="reporting_manager_id"
                  value={values.reporting_manager_id}
                  onChange={(selectedOptions) => {
                    setFieldValue("reporting_manager_id", selectedOptions);
                  }}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors.reporting_manager_id && touched.reporting_manager_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.reporting_manager_id}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Date Of Joining<span>*</span>
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
                  onBlur={handleBlur}
                  selected={
                    values.date_of_joining
                      ? new Date(values.date_of_joining)
                      : null
                  }
                  name="date_of_joining"
                  onChange={(date) => setFieldValue("date_of_joining", date)}
                  className="dateTime-picker calender-icon"
                  placeholderText="Enter DOJ"
                  autoComplete="off"
                />

                {errors.date_of_joining && touched.date_of_joining ? (
                  <Typography component="span" className="error-msg">
                    {errors.date_of_joining}
                  </Typography>
                ) : null}
              </FormGroup>

              <FormGroup>
                <InputLabel className="fixlabel">
                  Assign Shift<Typography component={"span"}>*</Typography>
                </InputLabel>
                <Select
                  placeholder="Select Shift"
                  menuPlacement="top"
                  options={shifts}
                  name="shift_id"
                  value={values.shift_id}
                  onChange={(selectedOptions) => {
                    setFieldValue("shift_id", selectedOptions);
                  }}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors.shift_id && touched.shift_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.shift_id}
                  </Typography>
                ) : null}
              </FormGroup>
            </Stack>
          </Box>
          <Box className="modalFooter" sx={{ pt: 0 }}>
            <Stack spacing={2} direction="row" justifyContent="start">
              <LoadingButton
                sx={{ minWidth: "170px" }}
                size="large"
                className="primary-btn text-capitalize"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                Update
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AdminAccessModal;
