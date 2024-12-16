import React, { useState } from "react";
import {
  Backdrop,
  Box,
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
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import TimezoneSelect from "react-timezone-select";
import DatePicker from "react-datepicker";
import { useAxios } from "@/contexts/AxiosProvider";
import { ShiftsManagementSchema } from "@/validations/ShiftsManagementSchema";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/ShiftSlice";
import { mapValues } from "lodash";
import moment from "moment-timezone";

const EditShift = ({ isEditOpen, closeEditShift, editShiftData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { Axios } = useAxios();

  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );

  const convertTime = (shiftStart, shiftEnd, timezoneValue, convertTimezoneValue, setFieldValue) => {
    if (convertTimezoneValue) {
      if (shiftStart && timezoneValue) {
        const sourceStartTime = moment(shiftStart).format('YYYY-MM-DD HH:mm:ss');
        const sourceTime1 = moment.tz(sourceStartTime, timezoneValue);
        setFieldValue(
          'converted_shift_start',
          sourceTime1.clone().tz(convertTimezoneValue).format("HH:mm:ss")
        );
      } else {
        setFieldValue('converted_shift_start', '');
      }

      if (shiftEnd && timezoneValue) {
        const sourceEndTime = moment(shiftEnd).format('YYYY-MM-DD HH:mm:ss');
        const sourceTime2 = moment.tz(sourceEndTime, timezoneValue);
        setFieldValue(
          'converted_shift_end',
          sourceTime2.clone().tz(convertTimezoneValue).format("HH:mm:ss")
        );
      } else {
        setFieldValue('converted_shift_end', '');
      }
    }
  };

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
      name: editShiftData?.name || "",
      shift_start: editShiftData?.shift_start
        ? moment(editShiftData.shift_start, "HH:mm:ss a").toDate()
        : "",
      shift_end: editShiftData?.shift_end
        ? moment(editShiftData.shift_end, "HH:mm:ss a").toDate()
        : "",
      timezone: editShiftData?.timezone || "",
      converted_timezone: editShiftData?.converted_timezone || "",
      converted_shift_start: editShiftData?.converted_shift_start || "",
      converted_shift_end: editShiftData?.converted_shift_end || "",
    },
    validationSchema: ShiftsManagementSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = trimValues({
        ...values,
        shift_start: moment(values.shift_start).format("HH:mm:ss"),
        shift_end: moment(values.shift_end).format("HH:mm:ss"),
        timezone: values.timezone,
      });
      try {
        const res = await Axios.put(
          `shift/update/${editShiftData.id}`,
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditShift();
          dispatch(refresh());
          toast.success(res.data.message);
          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          dispatch(refresh());
          toast.error(error.response.data.message)
          closeEditShift();
        }
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
      }
    },
  });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isEditOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isEditOpen}>
        <Box className="modalContainer md">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
            sx={{ px: 3, py: 2 }}
          >
            <Typography variant="h6" component="h2">
              Update Shift
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditShift}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y hvh-50" sx={{ px: 3, py: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Name<span>*</span>
                  </InputLabel>
                  <TextField
                    id="name"
                    placeholder="Name"
                    variant="outlined"
                    value={values.name}
                    fullWidth
                    name="name"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {errors.name && touched.name ? (
                    <Typography
                      component="span"
                      className="error-msg mt-0"
                      style={{ margin: 5 }}
                    >
                      {errors.name}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Select Timezone<span>*</span>
                  </InputLabel>
                  <TimezoneSelect
                    name="timezone"
                    maxMenuHeight={200}
                    className="selectTag"
                    placeholder="Select Timezone"
                    value={values.timezone}
                    onChange={(timezone) => {
                      setFieldValue("timezone", timezone);
                      convertTime(
                        values.shift_start,
                        values.shift_end,
                        timezone.value,
                        values.converted_timezone.value,
                        setFieldValue
                      );
                    }}
                  />
                  {errors.timezone && touched.timezone ? (
                    <Typography
                      component="span"
                      className="error-msg  mt-0"
                      style={{ margin: 5 }}
                    >
                      {errors.timezone}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Select Shift start time<span>*</span>
                  </InputLabel>
                  <DatePicker
                    selected={Date.parse(values.shift_start)?values.shift_start:null}
                    onChange={(time) => {
                      setFieldValue("shift_start", time);
                      convertTime(
                        time,
                        values.shift_end,
                        values.timezone.value,
                        values.converted_timezone.value,
                        setFieldValue
                      );
                    }}
                    name="shift_start"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    timeFormat="HH:mm:ss"
                    dateFormat="HH:mm:ss"
                    className="dateTime-picker"
                    placeholderText="Shift Start Time"
                    autoComplete="off"
                    disabled={!values.timezone}
                  />
                  {errors.shift_start && touched.shift_start ? (
                    <Typography
                      component="span"
                      className="error-msg  mt-0"
                      style={{ margin: 5 }}
                    >
                      {errors.shift_start}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Select Shift end time<span>*</span>
                  </InputLabel>
                  <DatePicker
                    selected={Date.parse(values.shift_end)?values.shift_end:null}
                    onChange={(time) => {
                      setFieldValue("shift_end", time);
                      convertTime(
                        values.shift_start,
                        time,
                        values.timezone.value,
                        values.converted_timezone.value,
                        setFieldValue
                      );
                    }}
                    onBlur={handleBlur}
                    name="shift_end"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    timeFormat="HH:mm:ss"
                    dateFormat="HH:mm:ss"
                    className="dateTime-picker"
                    placeholderText="Shift End Time"
                    autoComplete="off"
                    disabled={!values.timezone}
                  />
                  {errors.shift_end && touched.shift_end ? (
                    <Typography
                      component="span"
                      className="error-msg  mt-0"
                      style={{ margin: 5 }}
                    >
                      {errors.shift_end}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Select Timezone to see convert Time
                  </InputLabel>
                  <TimezoneSelect
                    name="converted_timezone"
                    maxMenuHeight={200}
                    className="selectTag"
                    placeholder="Select Timezone"
                    value={values.converted_timezone}
                    onChange={(timezone) => {
                      setFieldValue("converted_timezone", timezone);   
                      convertTime(
                        values.shift_start,
                        values.shift_end,
                        values.timezone.value,
                        timezone.value,
                        setFieldValue
                      );
                    }}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Shift Start time based on Timezone
                  </InputLabel>
                  <TextField
                    placeholder="Start Time"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={
                     values.converted_shift_start || "Shift Start"
                    }
                    inputProps={{
                      readOnly: true,
                    }}
                    className="cursor-nodrop"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Shift End time based on Timezone
                  </InputLabel>
                  <TextField
                    placeholder="End Time"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={
                     values.converted_shift_end || "Shift End"
                    }
                    inputProps={{
                      readOnly: true,
                    }}
                    className="cursor-nodrop"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
          <Box className="modalFooter" sx={{ px: 3, py: 2 }}>
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

export default EditShift;
