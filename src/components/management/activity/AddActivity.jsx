/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { AddActivitySchema } from "@/validations/ActivitySchema";
import { useAxios } from "@/contexts/AxiosProvider";
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
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/ActivitySlice";
const AddActivity = ({ isAddOpen, closeAddActivity }) => {
  //state to store department
  const [departments, setDepartments] = useState([]);
  //dispatch to send request to the redux store
  const dispatch = useDispatch();
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
    resetForm,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      department_id: "",
    },
    validationSchema: AddActivitySchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name.trim(),
        department_id: values.department_id.value,
      };

      setLoading(true);
      try {
        const res = await Axios.post("activity/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeAddActivity();
          //sending request to the redux store
          dispatch(refresh());
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
          toast.error("Unable to connect to the server");
        }
      }
    },
  });

  // Get Departments List
  const getDepartments = async () => {
    try {
      const response = await Axios.get("department/list");

      if (response.status && response.status === 200) {
        const departments = (response.data?.data || []).map((department) => ({
          value: department.id||"",
          label: `${department.name||""}`,
        }));
        setDepartments(departments);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //useeffect to call function when component will be mount
  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isAddOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isAddOpen}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add Activity
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeAddActivity}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  minH-350">
            <Stack spacing={2}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Select Department<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Select Department"
                  options={departments}
                  name="department_id"
                  value={values.department_id}
                  maxMenuHeight={200}
                  onChange={(selectedOptions) => {
                    setFieldValue("department_id", selectedOptions);
                  }}
                  className="basic-multi-select selectTag w-100"
                  classNamePrefix="select"
                />
                {errors.department_id && touched.department_id ? (
                  <Typography component="span" className="error-msg">
                    {errors.department_id}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Activity Name<span>*</span>
                </InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Activity Name"
                  variant="outlined"
                  value={values.name}
                  fullWidth
                  name="name"
                  size="small"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <Typography component="span" className="error-msg">
                    {errors.name}
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
                Add
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddActivity;
