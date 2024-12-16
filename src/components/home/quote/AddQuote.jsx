import { useFormik } from "formik";
import React, { useState } from "react";
import { QuoteSchema } from "@/validations/QuoteSchema";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/QuoteSlice";
import { mapValues } from "lodash";
import {
  Avatar,
  Backdrop,
  Box,
  Fade,
  FormGroup,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
const AddQuote = ({
  isAddOpen,
  closeAddQuote,
  getmotivationalQuote,
  getFirstQuote,
}) => {
  //dispatch to send request to the redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation when user will click add button
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  //form to get user input and send to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setErrors,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: { quote: "", said_by: "", image: "" },
    validationSchema: QuoteSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("quote", values.quote.trim());
        formData.append("said_by", values.said_by.trim());
        formData.append("image", values.image);

        const res = await Axios.post("motivational-quote/create", formData);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeAddQuote();

          getFirstQuote === true ? getmotivationalQuote() : dispatch(refresh());
          toast.success(res.data.message);

          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
          const errorObject = {};
          Object.keys(apiErrors||{}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server.");
        }
      }
    },
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    // Check if a file is selected
    if (file) {
      // Handle the selected file
      setFieldValue("image", file);
      const fileName = file.name.toLowerCase();
      // Check if the selected file has the correct extension
      if (
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".png")
      ) {
        // Handle the selected file
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage(null);
      }
    } else {
      // Handle the selected file
      setFieldValue("image", "");
      setPreviewImage(null);
    }
  };

  return (
    <React.Fragment>
      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={isAddOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isAddOpen}>
          <Box className="modalContainer md hr-annoucement-modal">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography component="h2" className="modal-title">
                Today's Quote
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeAddQuote}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50" sx={{ marginY: 2 }}>
              <Stack spacing={3}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                  Add Quote<span>*</span>
                  </InputLabel>
                  <TextField
                    id="enter-quote"
                    placeholder="Enter the quote"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={values.quote}
                    name="quote"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.quote && touched.quote ? errors.quote || "" : null
                    }
                    error={
                      errors.quote && touched.quote
                        ? Boolean(errors.quote)
                        : null
                    }
                  />
                </FormGroup>
                <Stack spacing={6} direction="row">
                  <FormGroup sx={{ width: "100%" }}>
                    <InputLabel className="fixlabel">
                    Add Author Name<span>*</span>
                    </InputLabel>
                    <TextField
                      id="author-name"
                      placeholder="Enter the author name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="said_by"
                      value={values.said_by}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.said_by && touched.said_by
                          ? errors.said_by || ""
                          : null
                      }
                      error={
                        errors.said_by && touched.said_by
                          ? Boolean(errors.said_by)
                          : null
                      }
                    />
                  </FormGroup>
                  <FormGroup sx={{ width: "100%" }}>
                    <Stack direction="row" alignItems="center">
                      <FormGroup>
                        <InputLabel className="fixlabel">
                        Author Image
                        </InputLabel>

                        <Avatar className="edit-avtar">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Selected"
                              className="avatar-image"
                            />
                          ) : (
                            <PersonIcon />
                          )}

                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            className="edit-avtar-h"
                          >
                            <Typography
                              component="label"
                              htmlFor="chooseAvatar"
                            >
                              <EditIcon />
                            </Typography>
                            <input
                              type="file"
                              id="chooseAvatar"
                              name="image"
                              accept=".jpeg, .jpg, .png"
                              onChange={handleFileInput}
                            />
                          </Stack>
                        </Avatar>
                      </FormGroup>
                    </Stack>
                    {errors.image ? (
                      <Typography component="span" className="error-msg">
                        {errors.image}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Stack>
              </Stack>
            </Box>
            <Box className="modalFooter" sx={{ pt: 0 }}>
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
                  Add
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default AddQuote;
