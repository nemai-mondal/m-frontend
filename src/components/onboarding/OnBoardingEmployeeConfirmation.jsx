import React, { useState } from "react";
import {
  Box,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Typography,
  Modal,
  Fade,
  Backdrop,
  FormGroup,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { OnBoardConfirmationSchema } from "@/validations/OnBoardConfirmationSchema";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const OnBoardingEmployeeConfirmation = ({
  isOpen,
  closeModal,
  user,
  userRefresh,
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
  // Function to trim all values
  const trimAllValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);
  // const [employee, setEmployee] = useState("");
  const titleStatus = [
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
  ];
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  // const contract_type = [
  //   { value: "Permanent", label: "Permanent" },
  //   { value: "Contract", label: "Contract" },
  // ];
  //fetching employee
  // const getEmployee = async () => {
  //   try {
  //     const res = await Axios.get("user/list");
  //     if (res.status && res.status === 200) {
  //       const employeeAllData = (res.data?.data || []).map((item) => ({
  //         value: item.id,
  //         label: `${item.first_name} ${item.middle_name} ${item.last_name}-${item.employee_id}`,
  //       }));
  //       setEmployee(employeeAllData);
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 500) {
  //       toast.error("Unable to connect to the server");
  //     }
  //   }
  // };
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
      employee_id: user?.employee_id || "",
      // shift_id:
      //   user?.shift.length > 0
      //     ? {
      //         value: user.shift[0].shift_id,
      //         label:
      //           user.shift[0].name +
      //           " (" +
      //           user.shift[0].shift_start +
      //           "-" +
      //           user.shift[0].shift_end +
      //           ")",
      //       }
      //     : "",
      // shift_id: user?.shift.length > 0 ? { value: user.shift[0].shift_id, label: user.shift[0].name +' ('+ user.shift[0].shift_start + '-' + user.shift[0].shift_end +')' } : "",
      honorific: user.honorific
        ? { value: user.honorific, label: user.honorific }
        : "",
      first_name: user?.first_name || "",
      middle_name: user?.middle_name || "",
      last_name: user?.last_name || "",
      date_of_birth: user?.personal_details?.date_of_birth || "",
      gender: user?.personal_details?.gender
        ? {
            value: user.personal_details.gender,
            label: user.personal_details.gender,
          }
        : "",
      // office_email: user?.email || "",
      personal_phone: user?.personal_details?.phone || "",
      // contract_type: user?.professional_details?.contract_type || "",
      // reporting_manager_id: user?.reporting_manager.first_name || "",
    },
    validationSchema: OnBoardConfirmationSchema,
    onSubmit: async (values) => {
      const payload = trimAllValues({
        ...values,
        honorific: values.honorific?.value || "",
        gender: values.gender?.value || "",
        // contract_type: values.contract_type?.value || "",
        // reporting_manager_id: values.reporting_manager_id || "",
        date_of_birth: values.date_of_birth
          ? moment(values.date_of_birth).format("YYYY-MM-DD")
          : "",
        onboard_confirmed: true,
        user_id: user.id,
        step: 2,
      });
      setLoading(true);
      try {
        const res = await Axios.put("user/update-profile?_method=put", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          user.onboard_confirmed = 1;
          userRefresh("refresh");
          closeModal();
          toast.success("Welcome to Magicminds");
          // getEmployeeList();
          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors||{}).forEach((key) => {
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
  // useEffect(() => {
  //   getEmployee();
  // }, []);
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isOpen}>
          <Box className="modalContainer lg">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  {`${user?.honorific ? `${user?.honorific} ` : ""}${
                    user?.first_name || ""
                  } ${user?.middle_name ? `${user.middle_name} ` : ""}${
                    user?.last_name || ""
                  }`}
                </Typography>
                <Typography component="p" className="modal-subtitle">
                  Welcome to Magicminds
                </Typography>
              </Box>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Employee ID</InputLabel>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      name="employee_id"
                      placeholder="Employee-Id"
                      value={values.employee_id || "Employee-Id"}
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Title</InputLabel>
                    <Select
                      placeholder="Select Title"
                      options={titleStatus}
                      name="honorific"
                      defaultValue={values.honorific}
                      value={values.honorific}
                      onChange={(selectedOptions) => {
                        setFieldValue("honorific", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      First Name <Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <TextField
                      id=""
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.first_name && touched.first_name ? (
                      <Typography component="span" className="error-msg">
                        {errors.first_name}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Middle Name</InputLabel>
                    <TextField
                      id=""
                      name="middle_name"
                      value={values.middle_name}
                      onChange={handleChange}
                      placeholder="Enter Middle Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Last Name</InputLabel>
                    <TextField
                      id=""
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Date Of Birth<Typography component={"span"}>*</Typography>
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
                      name="date_of_birth"
                      selected={
                        values.date_of_birth
                          ? new Date(values.date_of_birth)
                          : null
                      }
                      onChange={(date) => setFieldValue("date_of_birth", date)}
                      className="dateTime-picker calender-icon"
                      placeholderText="Enter Date Of Birth"
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    {errors.date_of_birth && touched.date_of_birth ? (
                      <Typography component="span" className="error-msg">
                        {errors.date_of_birth}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Gender<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <Select
                      placeholder="Select Gender"
                      options={gender}
                      value={values.gender}
                      defaultValue={values.gender}
                      name="gender"
                      onChange={(selectedOptions) => {
                        setFieldValue("gender", selectedOptions);
                      }}
                      className="basic-multi-select selectTag w-100"
                      classNamePrefix="select"
                    />
                    {errors.gender && touched.gender ? (
                      <Typography component="span" className="error-msg">
                        {errors.gender}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Email Address
                      {/* <Typography component={"span"}>*</Typography> */}
                    </InputLabel>
                    <TextField
                      type="email"
                      value={user.email || "Email Address"}
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      placeholder="Email Address"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Mobile Number<Typography component={"span"}>*</Typography>
                    </InputLabel>
                    <TextField
                      type="phone"
                      name="personal_phone"
                      value={values.personal_phone}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.personal_phone && touched.personal_phone ? (
                      <Typography component="span" className="error-msg">
                        {errors.personal_phone}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Date Of Joining
                    </InputLabel>
                    <DatePicker
                      // onBlur={handleBlur}

                      selected={
                       ( user?.joining||[])?.length > 0
                          ? new Date(
                              user.joining[
                                user.joining.length - 1
                              ]?.date_of_joining
                            )
                          : null
                      }
                      readOnly
                      name="date_of_joining"
                      // onChange={(date) =>
                      //   setFieldValue("date_of_joining", date)
                      // }
                      className="dateTime-picker calender-icon cursor-nodrop"
                      placeholderText="N/A"
                      style={{ pointerEvents: "none" }}
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Contract Type</InputLabel>
                    <TextField
                      type="text"
                      value={user?.professional_details?.contract_type || "N/A"}
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      placeholder="Contract Type"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Reporting Manager
                      {/* <Typography component={"span"}>*</Typography> */}
                    </InputLabel>
                    <TextField
                      type="text"
                      value={
                        user?.reporting_manager?.id
                          ? `${
                              user?.reporting_manager?.honorific
                                ? `${user.reporting_manager.honorific} `
                                : ""
                            }${user?.reporting_manager?.first_name || ""} ${
                              user?.reporting_manager?.middle_name
                                ? `${user.reporting_manager.middle_name} `
                                : ""
                            }${user?.reporting_manager?.last_name || ""}-${
                              user.reporting_manager?.employee_id || ""
                            }`
                          : "N/A"
                      }
                      placeholder="Reporting Manager"
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Shift
                      {/* <Typography component={"span"}>*</Typography> */}
                    </InputLabel>
                    <TextField
                      type="text"
                      value={
                        (user?.shift||[]).length > 0
                          ? `${user.shift[0].name} (${user.shift[0].shift_start} ${user.shift[0].shift_end})`
                          : "N/A"
                      }
                      placeholder="Shift Details"
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Employment type
                    </InputLabel>
                    <TextField
                      type="text"
                      value={
                        (user?.employment_type||[]).length > 0
                          ? user.employment_type[
                              user.employment_type.length - 1
                            ].name
                          : "N/A"
                      }
                      placeholder="Employment type"
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Department</InputLabel>
                    <TextField
                      type="text"
                      value={user?.department?.name || "N/A"}
                      placeholder="Department"
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Designation</InputLabel>
                    <TextField
                      type="text"
                      value={user?.designation?.name || "N/A"}
                      placeholder="Designation"
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                      }}
                      className="cursor-nodrop"
                      fullWidth
                      size="small"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
            <Box className="modalFooter">
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  color="primary"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Confirm
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default OnBoardingEmployeeConfirmation;
