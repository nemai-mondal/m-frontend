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
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { AadhaarSchema } from "@/validations/AadhaarSchema";
import { mapValues } from "lodash";
const AddEditAadhaar = ({
  isAddEditAadhaarOpen,
  closeAddEditAadhaar,
  getEmployeeDetails,
  employeeDetails,
}) => {
  //state to show loading animation
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
      adhaar_no: employeeDetails?.adhaar?.adhaar_no || "",
      name: employeeDetails?.adhaar?.name || "",
      enrollment_no: employeeDetails?.adhaar?.enrollment_no || "",
      file: employeeDetails?.adhaar?.file?.split("/").pop() || "",
    },
    validationSchema: AadhaarSchema,
    onSubmit: async (values) => {
      // Trim all string values
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 9);
      formData.append("form", 1);
      formData.append("adhaar_no", trimmedValues.adhaar_no);
      formData.append("enrollment_no", trimmedValues.enrollment_no);
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.adhaar?.file
          ? employeeDetails.adhaar.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append(
        "key",
        employeeDetails?.adhaar?.name ? "update" : "create"
      );
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          closeAddEditAadhaar();
          employeeDetails?.adhaar
            ? toast.success("Aadhaar Updated successfully")
            : toast.success("Aadhaar Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
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
        open={isAddEditAadhaarOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddEditAadhaarOpen}>
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
                Aadhaar Card
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddEditAadhaar}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Aadhaar Card Number<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-number"
                      placeholder="Enter aadhaar number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      name="adhaar_no"
                      value={values.adhaar_no}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "adhaar_no", value: numericValue },
                        });
                      }}
                    />
                    {errors.adhaar_no && touched.adhaar_no ? (
                      <Typography component="span" className="error-msg">
                        {errors.adhaar_no}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Name In Aadhaar Card<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter aadhaar name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      size="small"
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
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Aadhaar Enrollment Number
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter enrollment number"
                      variant="outlined"
                      fullWidth
                      name="enrollment_no"
                      size="small"
                      value={values.enrollment_no}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: {
                            name: "enrollment_no",
                            value: numericValue,
                          },
                        });
                      }}
                    />
                    {errors.enrollment_no && touched.enrollment_no ? (
                      <Typography component="span" className="error-msg">
                        {errors.enrollment_no}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Upload Document<span>*</span>
                    </InputLabel>
                    <Box component="div" className="choosefile">
                      <Typography
                        component="label"
                        htmlFor="file-upload"
                        id="file-upload-filename"
                      >
                        {values.file?.name
                          ? values.file.name
                          : values.file
                          ? values.file
                          : "Choose File"}
                      </Typography>
                      <input
                        type="file"
                        name="file"
                        id="file-upload"
                        onChange={(e) => {
                          setFieldValue("file", e.target.files[0]);
                        }}
                        onBlur={handleBlur}
                      />
                      <Typography
                        component="label"
                        htmlFor="file-upload"
                        className="choosefile-button"
                      >
                        Browse
                      </Typography>
                      {errors.file ? (
                        <Typography component="span" className="error-msg">
                          {errors.file}
                        </Typography>
                      ) : null}
                    </Box>
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
                  Submit
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  className="text-capitalize"
                  onClick={closeAddEditAadhaar}
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

export default AddEditAadhaar;
