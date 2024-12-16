/* eslint-disable react/prop-types */
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
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
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useAxios } from "@/contexts/AxiosProvider";
import { EmployeeLanguageSchema } from "@/validations/EmployeeLanguageSchema";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
const AddLanguage = ({
  isAddOpen,
  closeAddLanguage,
  employeeDetails,
  getEmployeeDetails,
}) => {
  //triming all values 1
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
  } = useFormik({
    initialValues: {
      name: "",
      read: "",
      write: "",
      speak: "",
      native: "",
    },
    validationSchema: EmployeeLanguageSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const force = 1;
      //triming and storing in one object
      const payload = trimValues({
        ...values,
        read: Number(values.read),
        speak: Number(values.speak),
        write: Number(values.write),
        native: Number(values.native),
        step: 11,
        form: 3,
        user_id: employeeDetails.id,
        key: "create",
      });
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeAddLanguage();
          toast.success("Language added successfully");
          resetForm();
          getEmployeeDetails(employeeDetails.id, force);
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;//storing api error
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
        open={isAddOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddOpen}>
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
                Add Language
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddLanguage}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Language Name<span>*</span></InputLabel>
                    <TextField
                      variant="outlined"
                      id="skill-name"
                      placeholder="Enter Language Name"
                      size="small"
                      name="name"
                      value={values.name}
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
              </Grid>
              <Stack
                spacingX={2}
                mt={2}
                direction={"row"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="native"
                      value={values.native}
                      onChange={handleChange}
                    />
                  }
                  label="Mother Tongue"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value={values.speak}
                      name="speak"
                      onChange={handleChange}
                    />
                  }
                  label="Speak"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value={values.write}
                      name="write"
                      onChange={handleChange}
                    />
                  }
                  label="Write"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value={values.read}
                      name="read"
                      onChange={handleChange}
                    />
                  }
                  label="Read"
                />
              </Stack>
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
                  Save
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  className="text-capitalize"
                  onClick={closeAddLanguage}
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

export default AddLanguage;
