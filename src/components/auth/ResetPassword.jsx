import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ImagePath } from "@/ImagePath";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import { useAxios } from "@/contexts/AxiosProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { ResetPasswordSchema } from "@/validations/ResetPasswordSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

const ResetPassword = () => {
  // const [cookies, removeCookie] = useCookies([employee_id, first_login]);
  // const first_login = parseInt(cookies[first_login]);
  // const employee_id = cookies[employee_id];
  const { Axios } = useAxios();
  //state to control show password toogle
  const [showPassword, setShowPassword] = useState(false);
  //function to control show password toogle
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword1, setShowPassword1] = useState(false);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };
  //searchParams to get token and time from url
  const [searchParams] = useSearchParams();
  //variable to store token from url
  const token = searchParams.get("token");
  //variable to store time from url
  const time = searchParams.get("stamp");
  //variable to store initial timing
  const initialTime = time;
  //state to control stopWatch on/off
  const [isRunning, setIsRunning] = useState(false);
  //state to store real time, how much time left
  const [remainingTime, setRemainingTime] = useState(
    initialTime - Math.floor(new Date().getTime() / 1000)
  );
  //navigating to other page
  const navigate = useNavigate();
  //state to show loading animation
  const [loading, setLoading] = useState();
  //function to send user input to api
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setErrors,
    touched,
  } = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      if (time > Math.floor(new Date().getTime() / 1000)) {
        try {
          const validate_token = false;
          const payload = {
            ...values,
            token,
            validate_token,
          };
          setLoading(true);
          const data = await Axios.post("reset-password", payload);
          setLoading(false);
          if (data.status && data.status >= 200 && data.status < 300) {
            // removeCookie(first_login);
            // removeCookie(employee_id);
            toast.success("Password Successfully Updated");
            setIsRunning(false);
            navigate("/");
          }
        } catch (error) {
          setLoading(false);
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message); //to show error from api
          }
          if (error.response && error.response.status === 500) {
            toast.error("Unable to connect to the server");
          }
        }
      }
    },
  });
  // useeffect to check token is valid or not when components mount
  useEffect(() => {
    const validate_token = async () => {
      const payload = { token };
      try {
        const { data } = await Axios.post("validate-token", payload);
        if (data.status === true) {
          setIsRunning(true);
        }
      } catch (error) {
        if (error.response) {
          toast.error("Reset Password Link Expired");
          setIsRunning(false);
          navigate("/");
        }
      }
    };
    validate_token();
  }, []);
  // useeffect to run stopwatch on page load and when component will mount
  useEffect(() => {
    let interval;
    if (isRunning && remainingTime >= 0) {
      interval = setInterval(() => {
        const newRemainingTime =
          initialTime - Math.floor(new Date().getTime() / 1000);
        setRemainingTime(newRemainingTime >= 0 ? newRemainingTime : 0);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, initialTime, remainingTime]);
  //function to convert second to HH:MM:SS formate
  const formatTime = (timeInSeconds) => {
    if (timeInSeconds >= 0) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  };

  return (
    <Box className="hvh-100">
      <Grid container spacing={0} className="h_100">
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <div className="login-left">
            <div className="loginlogo">
              <img src={ImagePath.Logo} alt="" />
            </div>
            <div className="form-box">
              <h1 className="heading-1">Reset Your Password</h1>
              <p className="link-text">Magicmind Technologies</p>
              <TextField
                autoFocus
                id="outlined-basic"
                placeholder="New Password"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="input mb-30"
                name="password"
                value={values.password}
                onChange={(e) => {
                  const nonSpaceValue = e.target.value.replace(/\s/g, "");
                  handleChange({
                    target: {
                      name: "password",
                      value: nonSpaceValue,
                    },
                  });
                }}
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                helperText={
                  errors.password && touched.password ? errors.password : null
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
              {/* Closing brace for TextField */}
              <TextField
                id="outlined-basic"
                placeholder="Confirm Password"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="input mb-30"
                name="password_confirmation"
                value={values.password_confirmation}
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
                type={showPassword1 ? "text" : "password"}
                helperText={
                  errors.password_confirmation && touched.password_confirmation
                    ? errors.password_confirmation
                    : null
                }
                error={
                  errors.password_confirmation && touched.password_confirmation
                    ? Boolean(errors.password_confirmation)
                    : null
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword1}
                        edge="end"
                      >
                        {showPassword1 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Closing brace for TextField */}
              <LoadingButton
                variant="contained"
                className="blue w-100"
                onClick={handleSubmit}
                loading={loading}
              >
                <span>Reset</span>
              </LoadingButton>
              <Stack
                alignItems="center"
                direction="row"
                sx={{ marginTop: 2 }}
                className="otpTimeing"
              >
                <AvTimerIcon />
                <Typography component="span" sx={{ marginLeft: 1 }}>
                  Remaining Time {formatTime(remainingTime)}
                </Typography>
              </Stack>
            </div>
            <Stack className="loginFooter">
              <div className="version">Version : 1.0.2</div>
              <div>
                <p className="login-link">
                  <Link to="/terms-conditions" target="_blank">
                    Terms & Conditions
                  </Link>{" "}
                  /{" "}
                  <Link to="/privacy-policy" target="_blank">
                    Privacy Policy
                  </Link>
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
  );
};

export default ResetPassword;
