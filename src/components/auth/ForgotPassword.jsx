import React, { useState } from "react";
import "./auth.css";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import { ImagePath } from "@/ImagePath";
import { Link } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { ForgotPasswordSchema } from "@/validations/ForgotPasswordSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPassword = () => {
  const { Axios } = useAxios();
  //to show loading
  const [loading, setLoading] = useState();
  //handleing form validation & sending userEmail
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues: { email: "" },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await Axios.post("forgot-password", values);

        setLoading(false);

        if (res.status && res.status >= 200 && res.status < 300) {
          resetForm();
          toast.success(res.data.message);
        }
      } catch (error) {
        // Handle login errors
        setLoading(false);
        if (error.response && error.response.status === 422) {
          setErrors({ email: error.response.data.email[0] });
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    },
  });

  return (
    <React.Fragment>
      <Box className="hvh-100">
        <Grid container spacing={0} className="h_100">
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <div className="login-left">
              <div className="loginlogo">
                <Link to={"/"}>
                  <img src={ImagePath.Logo} alt="" title="Go to login page" />
                </Link>
              </div>
              <div className="form-box">
                <h1 className="heading-1">Forgot Password</h1>
                <p className="link-text">Magicmind Technologies</p>
                <TextField
                  autoFocus
                  id="outlined-basic"
                  placeholder="Enter Your Email"
                  variant="outlined"
                  className="input mb-30"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  error={errors.email ? Boolean(errors.email) : null}
                  onChange={handleChange}
                  helperText={errors.email ? errors.email : null}
                />
                <br />
                <Stack
                  spacing={{ xs: 1, sm: 2 }}
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Link to="/" className="forgot-password">
                    Back to Login Page
                  </Link>
                </Stack>

                <LoadingButton
                  variant="contained"
                  className="blue w-100"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={values.email ? false : true}
                >
                  <span>Submit</span>
                </LoadingButton>
                <Typography component="span" className="info" sx={{ mt: 2 }}>
                  <span style={{ fontSize: "20px" }}>*</span> 
                   The reset password link will be sent to your entered email
                  address. Kindly check your email.
                </Typography>
              </div>
              <Stack className="loginFooter">
                <div className="version">Version : 1.0.2</div>
                <div>
                  <p className="login-link">
                  <Link to="/terms-conditions" target="_blank">Terms & Conditions</Link> /{" "}
                    <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
                  </p>
                  <span className="copyright">
                    &copy; 2023 MagicHR. All Rights Reserved
                  </span>
                </div>
              </Stack>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} className="h_100">
            <div className="login-right">
              <img src={ImagePath.loginImg} alt="" className="loginImg" />
            </div>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default ForgotPassword;
