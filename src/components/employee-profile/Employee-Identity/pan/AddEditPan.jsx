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
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { PanSchema } from "@/validations/PanSchema";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { mapValues } from "lodash";
const AddEditPan = ({
  isAddEditPanOpen,
  closeAddEditPan,
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
      name: employeeDetails?.pan?.name || "",
      number: employeeDetails?.pan?.number || "",
      file: employeeDetails?.pan?.file?.split("/").pop() || "",
    },
    validationSchema: PanSchema,
    onSubmit: async (values) => {
      // Trim all string values in the 'values' object
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 9);
      formData.append("form", 2);
      formData.append("number", trimmedValues.number);
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.pan?.file
          ? employeeDetails.pan.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append("key", employeeDetails?.pan?.name ? "update" : "create");
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          closeAddEditPan();
          employeeDetails.pan
            ? toast.success("Pan card Updated successfully")
            : toast.success("Pan card Added successfully");
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
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isAddEditPanOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddEditPanOpen}>
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
                Permanent Account Number (PAN)
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddEditPan}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      PAN Number<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-number"
                      placeholder="Enter pan number"
                      variant="outlined"
                      fullWidth
                      name="number"
                      size="small"
                      value={values.number}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.number && touched.number ? (
                      <Typography component="span" className="error-msg">
                        {errors.number}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Name In PAN<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter pan name"
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
                  onClick={closeAddEditPan}
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

export default AddEditPan;
