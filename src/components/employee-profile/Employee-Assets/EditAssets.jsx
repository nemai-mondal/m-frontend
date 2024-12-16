/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "react-select";
import { toast } from "react-toastify";
import { mapValues } from "lodash";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { EmployeeAssetsSchema } from "@/validations/EmployeeAssetsSchema";
import { LoadingButton } from "@mui/lab";
import { getYear, getMonth } from "date-fns";
import moment from "moment";
const EditAssets = ({
  isEditOpen,
  closeEditAssets,
  employeeDetails,
  getEmployeeDetails,
  editAssetsData,
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
  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const assetsStatus = [
    { value: "in_use", label: "In Use" },
    { value: "broken", label: "Broken" },
    { value: "lost", label: "Lost" },
    { value: "submited", label: "Submited" },
  ];

  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
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
      //storing assets data
      sr_no: editAssetsData?.sr_no || "",
      remarks: editAssetsData?.remarks || "",
      valid_till: editAssetsData?.valid_till || "",
      assets_name: editAssetsData?.assets_name || "",
      assign_date: editAssetsData?.assign_date || "",
      assets_type: editAssetsData?.assets_type || "",
      assets_status: editAssetsData?.assets_status
        ? {
            label: editAssetsData.assets_status,
            value: editAssetsData.assets_status,
          }
        : "",
    },
    validationSchema: EmployeeAssetsSchema,
    onSubmit: async (values) => {
      //triming and storing in one object
      const payload = trimmedValues({
        ...values,
        assets_status: values?.assets_status ? values.assets_status.value : "",
        assign_date: values.assign_date
          ? moment(values.assign_date).format("YYYY-MM-DD")
          : "",
        valid_till: values.valid_till
          ? moment(values.valid_till).format("YYYY-MM-DD")
          : "",
        step: 14,
        user_id: employeeDetails.id,
        key: "update",
        id: editAssetsData.id,
      });
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          closeEditAssets();
          toast.success("Assets Updated successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
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
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isEditOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isEditOpen}>
        <Box className="modalContainer md">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Update Assets
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditAssets}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y hvh-50">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Sr.No<span>*</span></InputLabel>
                  <TextField
                    id="srno"
                    placeholder="Enter Sr.No"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="sr_no"
                    value={values.sr_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.sr_no && touched.sr_no ? (
                    <Typography component="span" className="error-msg">
                      {errors.sr_no}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Asset type<span>*</span></InputLabel>
                  <TextField
                    id="asset-type"
                    placeholder="Enter asset type"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="assets_type"
                    value={values.assets_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.assets_type && touched.assets_type ? (
                    <Typography component="span" className="error-msg">
                      {errors.assets_type}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Asset Name<span>*</span></InputLabel>
                  <TextField
                    id="asset-name"
                    placeholder="Enter Asset Name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="assets_name"
                    value={values.assets_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.assets_name && touched.assets_name ? (
                    <Typography component="span" className="error-msg">
                      {errors.assets_name}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Asset Status<span>*</span></InputLabel>
                  <Select
                    placeholder="Asset Status"
                    options={assetsStatus}
                    value={values.assets_status}
                    name="assets_status"
                    onChange={(selectedOption) => {
                      setFieldValue("assets_status", selectedOption);
                    }}
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.assets_status && touched.assets_status ? (
                    <Typography component="span" className="error-msg">
                      {errors.assets_status}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Assign Date<span>*</span></InputLabel>
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
                    selected={
                      values.assign_date ? new Date(values.assign_date) : null
                    }
                    onChange={(date) => setFieldValue("assign_date", date)}
                    name="assign_date"
                    onBlur={handleBlur}
                    className="dateTime-picker calender-icon"
                    placeholderText="Assign Date"
                    autoComplete="off"
                  />

                  {errors.assign_date && touched.assign_date ? (
                    <Typography component="span" className="error-msg">
                      {errors.assign_date}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Valid Till<span>*</span></InputLabel>
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
                    selected={
                      values.valid_till ? new Date(values.valid_till) : null
                    }
                    onChange={(date) => setFieldValue("valid_till", date)}
                    name="valid_till"
                    onBlur={handleBlur}
                    className="dateTime-picker calender-icon"
                    placeholderText="Valid Till Date"
                    autoComplete="off"
                  />

                  {errors.remavalid_tillrks && touched.valid_till ? (
                    <Typography component="span" className="error-msg">
                      {errors.valid_till}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">Remarks</InputLabel>
                  <TextField
                    id=""
                    placeholder="Remarks"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                    name="remarks"
                    value={values.remarks}
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
                Update
              </LoadingButton>
              <Button
                variant="outlined"
                color="primary"
                className="text-capitalize"
                onClick={closeEditAssets}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditAssets;
