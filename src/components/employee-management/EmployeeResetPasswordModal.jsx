import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { refresh } from "@/redux/DesignationSlice";
import ClearIcon from "@mui/icons-material/Clear";
import {
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
import { EmployeeResetPasswordSchema } from "@/validations/EmployeeResetPasswordSchema";
const EmployeeResetPasswordModal = ({
  isResetPasswordOpen,
  closeResetPasswordModal,
  resetPasswordData,
}) => {
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //getting user input and sending to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    handleBlur,
    touched,
  } = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: EmployeeResetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await Axios.post(
          `user/reset-password/${resetPasswordData}`,
          values
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeResetPasswordModal(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
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
      open={isResetPasswordOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Reset Password
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeResetPasswordModal}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
            <Stack spacing={2}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Password<span>*</span>
                </InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Enter Password"
                  variant="outlined"
                  value={values.password}
                  fullWidth
                  name="password"
                  size="small"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const nonSpaceValue = e.target.value.replace(/\s/g, "");
                    handleChange({
                      target: {
                        name: "password",
                        value: nonSpaceValue,
                      },
                    });
                  }}
                />
                {errors.password && touched.password ? (
                  <Typography component="span" className="error-msg">
                    {errors.password}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Confirm Password<span>*</span>
                </InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Enter Confirm Password"
                  variant="outlined"
                  value={values.password_confirmation}
                  fullWidth
                  name="password_confirmation"
                  size="small"
                  onChange={(e) => {
                    const nonSpaceValue = e.target.value.replace(/\s/g, "");
                    handleChange({
                      target: {
                        name: "password_confirmation",
                        value: nonSpaceValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.password_confirmation &&
                touched.password_confirmation ? (
                  <Typography component="span" className="error-msg">
                    {errors.password_confirmation}
                  </Typography>
                ) : null}
              </FormGroup>
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
                Reset
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EmployeeResetPasswordModal;
