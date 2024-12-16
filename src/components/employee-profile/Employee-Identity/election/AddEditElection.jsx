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
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { ElectionSchema } from "@/validations/ElectionSchema";
import { mapValues } from "lodash";
const AddEditElection = ({
  isAddEditElectionOpen,
  closeAddEditElection,
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
      name: employeeDetails?.voter_card?.name || "",
      number: employeeDetails?.voter_card?.number || "",
      file: employeeDetails?.voter_card?.file?.split("/").pop() || "",
    },
    validationSchema: ElectionSchema,
    onSubmit: async (values) => {
      // Trim all string values
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      formData.append("user_id", employeeDetails.id);
      formData.append("step", 9);
      formData.append("form", 3);
      formData.append("number", trimmedValues.number);
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : employeeDetails?.voter_card?.file
          ? employeeDetails.voter_card.file
          : ""
      );
      formData.append("name", trimmedValues.name);
      formData.append(
        "key",
        employeeDetails?.voter_card?.name ? "update" : "create"
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

          closeAddEditElection();
          employeeDetails.voter_card
            ? toast.success("Election Card Updated successfully")
            : toast.success("Election Card Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing pi error
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
        open={isAddEditElectionOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddEditElectionOpen}>
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
                Election Card
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddEditElection}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Election Card Number<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-number"
                      placeholder="Enter election card number"
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
                      Name In Election Card<span>*</span>
                    </InputLabel>
                    <TextField
                      id="aadhaar-name"
                      placeholder="Enter election card name"
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
                  onClick={closeAddEditElection}
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

export default AddEditElection;
