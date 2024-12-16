/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
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
import React, { useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { AmendmentSchema } from "@/validations/AmendmentSchema";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/AmendmentSlice";
const EditAmendment = ({
  isEditOpen,
  closeEditAmendment,
  editAmendmentData,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to get user data and send to the api
  const {
    values,
    errors,
    handleSubmit,
    setErrors,
    resetForm,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues: {
      file: editAmendmentData?.document?.split("/")?.pop() || "",
      name: editAmendmentData?.name || "",
    },
    validationSchema: AmendmentSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append(
        "file",
        values?.file?.name
          ? values.file
          : editAmendmentData?.document
          ? editAmendmentData.document
          : ""
      );
      try {
        const res = await Axios.post(
          `amendment/update/${editAmendmentData.id}?_method=put`,
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditAmendment();
          dispatch(refresh());
          toast.success(res.data.message);
          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          //dispatch to send request to redux store
          dispatch(refresh());
          toast.error( error.response.data.message)
          closeEditAmendment();
        }
        
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
              Update Document
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditAmendment}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden">
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Name<span>*</span></InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Document Name"
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
                    className="error-msg"
                    style={{ margin: 5 }}
                  >
                    {errors.name}
                  </Typography>
                ) : null}{" "}
              </FormGroup> <br />

              <FormGroup>
                <InputLabel className="fixlabel">Document<span>*</span></InputLabel>
                <Box component="div" className="choosefile">
                  <Typography
                    component="label"
                    htmlFor="file-upload"
                    id="upload-decument"
                  >
                    {values?.file?.name
                      ? values.file.name
                      : values?.file
                      ? values.file
                      : "Choose File..."}
                  </Typography>
                  <input
                    type="file"
                    name="file"
                    id="file-upload"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                    }}
                    multiple
                  />
                  <Typography
                    component="label"
                    htmlFor="file-upload"
                    className="choosefile-button"
                  >
                    Browse
                  </Typography>
                  {errors.file && touched.file ? (
                    <Typography component="span" className="error-msg">
                      {errors.file}
                    </Typography>
                  ) : null}
                </Box>
              </FormGroup> <br />
            </Grid>
          </Box>
          <Box className="modalFooter" sx={{ pt: 2 }}>
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

export default EditAmendment;
