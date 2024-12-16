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
import { useFormik } from "formik";
import { toast } from "react-toastify";
import moment from "moment";
import { EmployeeSkillSchema } from "@/validations/EmployeeSkillSchema";
import { LoadingButton } from "@mui/lab";
import { useAxios } from "@/contexts/AxiosProvider";
import { mapValues } from "lodash";
import { getYear, getMonth } from "date-fns";
const EditSkill = ({
  isEditOpen,
  closeEditSkill,
  employeeDetails,
  getEmployeeDetails,
  editSkillData,
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
  //trim all values
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  const { Axios } = useAxios();
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
    //storing skill data
    initialValues: {
      name: editSkillData.name || "",
      type: editSkillData.type || "",
      level: editSkillData.level || "",
      effective_date: editSkillData?.effective_date || "",
    },
    validationSchema: EmployeeSkillSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const force = 1;
      //triming and storing in one object
      const payload = trimValues({
        ...values,
        step: 11,
        form: 2,
        user_id: employeeDetails.id,
        key: "update",
        id: editSkillData.id,
        effective_date: values.effective_date
          ? moment(values.effective_date).format("YYYY-MM-DD")
          : "",
      });
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditSkill();
          toast.success("Skill updated successfully");
          resetForm();
          getEmployeeDetails(employeeDetails.id, force);
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
    <>
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
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Update Skill{" "}
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeEditSkill}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Skill Name<span>*</span></InputLabel>
                    <TextField
                      variant="outlined"
                      id="skill-name"
                      placeholder="Enter Skill name"
                      size="small"
                      name="name"
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name ? (
                      <Typography component="span" className="error-msg">
                        {errors.name}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Skill Type<span>*</span></InputLabel>
                    <TextField
                      variant="outlined"
                      id="skill-type"
                      placeholder="Enter Type name"
                      size="small"
                      name="type"
                      value={values.type}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.type && touched.type ? (
                      <Typography component="span" className="error-msg">
                        {errors.type}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Skill Level<span>*</span></InputLabel>
                    <TextField
                      variant="outlined"
                      id="skill-level"
                      placeholder="Enter between 1 to 10"
                      size="small"
                      name="level"
                      value={values.level}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "level", value: numericValue },
                        });
                      }}
                    />
                    {errors.level && touched.level ? (
                      <Typography component="span" className="error-msg">
                        {errors.level}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Effective Date<span>*</span></InputLabel>
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
                        values.effective_date
                          ? new Date(values.effective_date)
                          : null
                      }
                      onChange={(date) => setFieldValue("effective_date", date)}
                      name="effective_date"
                      onBlur={handleBlur}
                      className="dateTime-picker calender-icon"
                      placeholderText="Effective Date"
                      autoComplete="off"
                    />

                    {errors.effective_date && touched.effective_date ? (
                      <Typography component="span" className="error-msg">
                        {errors.effective_date}
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
                  onClick={closeEditSkill}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditSkill;
