import React, { useContext, useEffect, useState } from "react";
import "./auth.css";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { ImagePath } from "@/ImagePath";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthProvider";
import { useAxios } from "@/contexts/AxiosProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { LoginSchema } from "@/validations/LoginSchema";
import { toast } from "react-toastify";
const LoginPage = () => {
  //sending user Globally
  const { login } = useContext(AuthContext);
  const { Axios } = useAxios();

  //to hide and show password
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  //to show loading animation
  const [loading, setLoading] = useState(false);
  //handleing form ,form validation & getting login details

  const handelLogin = async (values) => {
    try {
      setLoading(true);

      const { data } = await Axios.post("login", values);
      let currentDate = new Date();
      if (data.first_login === 1) {
        setLoading(false);
        const url = `/update-password?token=${data.token}&stamp=${data.timestamp}&firstLogin=${data.first_login}`;
        navigate(url, { replace: true });
        return;
      }
      // Handle successful login
      login({
        access_token: data.access_token,
        access_token_expires: currentDate.setSeconds(data.expires_in),
        refresh_token: data.access_token,
        refresh_token_expires: currentDate.setSeconds(
          data.refresh_token_expires_in
        ),
        user: data.user,
      }).then(() => {
        setLoading(false);
        navigate("/home");
      });
    } catch (error) {
      // Handle login errors
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setErrors({ employee_id: error.response.data.message });
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  // Defineing form validation and submission logic using useFormik hook
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setErrors,
    touched,
  } = useFormik({
    initialValues: { employee_id: "", password: "", remember_me: false },
    validationSchema: LoginSchema,
    onSubmit: handelLogin,
  });
  // Adding event listener for Enter key press to submit form
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSubmit]);
  return (
    <React.Fragment>
      {/* {redirectUrl && <Redirect to={redirectUrl} />} */}

      <Box className="hvh-100">
        <Grid container spacing={0} className="h_100">
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <div className="login-left">
              <div className="loginlogo">
                <img src={ImagePath.Logo} alt="" />
              </div>
              <div className="form-box">
                <h1 className="heading-1">Login to MagicHR</h1>
                <p className="link-text">Magicmind Technologies </p>
                <TextField
                  autoFocus
                  id="outlined-basic"
                  placeholder="Employee ID"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  className="input mb-30"
                  name="employee_id"
                  onBlur={handleBlur}
                  value={values.employee_id}
                  error={
                    errors.employee_id && touched.employee_id
                      ? Boolean(errors.employee_id)
                      : null
                  }
                  onChange={handleChange}
                  helperText={
                    errors.employee_id && touched.employee_id
                      ? errors.employee_id || ""
                      : null
                  }
                />

                <br />

                <TextField
                  id="outlined-adornment-password"
                  placeholder="Password"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  className="input"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={showPassword ? "text" : "password"}
                  helperText={
                    errors.password && touched.password
                      ? errors.password || ""
                      : null
                  }
                  error={
                    errors.password && touched.password
                      ? Boolean(errors.password)
                      : null
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack
                  spacing={{ xs: 1, sm: 2 }}
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="remember_me"
                        value={values.remember_me}
                        onChange={handleChange}
                      />
                    }
                    label="Remember Me"
                  />
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </Stack>

                <LoadingButton
                  variant="contained"
                  className="blue w-100"
                  type="submit"
                  loading={loading}
                  onClick={handleSubmit}
                >
                  <span>Login</span>
                </LoadingButton>
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
          <Grid item xs={false} sm={false} md={false} lg={6} className="h_100">
            <div className="login-right">
              <img src={ImagePath.loginImg} alt="" className="loginImg" />
            </div>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default LoginPage;
