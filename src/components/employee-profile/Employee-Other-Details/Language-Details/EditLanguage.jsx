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
const EditLanguage = ({
  isEditOpen,
  closeEditLanguage,
  employeeDetails,
  getEmployeeDetails,
  editLanguageData,
}) => {
  //triming all values
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
    //storing language data
    initialValues: {
      name: editLanguageData.name || "",
      read: editLanguageData.read || "",
      write: editLanguageData.write || "",
      speak: editLanguageData.speak || "",
      native: editLanguageData.native || "",
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
        id: editLanguageData.id,
        user_id: employeeDetails.id,
        key: "update",
      });
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditLanguage();
          toast.success("Language updated successfully");
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
              Update Language
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditLanguage}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y hvh-50">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Language Name<span>*</span>
                  </InputLabel>
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
                    checked={values.native}
                    onChange={(e) => setFieldValue("native", e.target.checked)}
                  />
                }
                label="Mother Tongue"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.speak}
                    name="speak"
                    onChange={(e) => setFieldValue("speak", e.target.checked)}
                  />
                }
                label="Speak"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.write}
                    name="write"
                    onChange={(e) => setFieldValue("write", e.target.checked)}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.read}
                    name="read"
                    onChange={(e) => setFieldValue("read", e.target.checked)}
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
                Update
              </LoadingButton>
              <Button
                variant="outlined"
                color="primary"
                className="text-capitalize"
                onClick={closeEditLanguage}
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

export default EditLanguage;
