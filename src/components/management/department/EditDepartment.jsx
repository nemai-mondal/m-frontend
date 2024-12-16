/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
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
import { useFormik } from "formik";
import React, { useState } from "react";
import { DepartmentSchema } from "@/validations/DepartmentSchema";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/DepartmentSlice";
import { mapValues } from "lodash";

const EditDepartment = ({
  isEditOpen,
  closeEditDepartment,
  editDepartmentData,
}) => {
  //triming all values
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //dispatch send request to redus store
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
    touched,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues: { name: editDepartmentData.name||"", id: editDepartmentData.id||"" },
    validationSchema: DepartmentSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await Axios.put(
          `department/update/${editDepartmentData.id}`,
          trimValues(values)
        );
        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeEditDepartment();
              //dispatch send request to redus store
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
          closeEditDepartment();
        }
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors||{}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject); //storing api error
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
          <Box className="modalContainer sm">
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
                Update Department
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={closeEditDepartment}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
              <Stack spacing={2}>
                <FormGroup>
                  <InputLabel className="fixlabel">Department Name<span>*</span></InputLabel>
                  <TextField
                    id="UserId"
                    placeholder="Department Name"
                    variant="outlined"
                    value={values.name}
                    fullWidth
                    name="name"
                    size="small"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={
                      errors.name && touched.name ? Boolean(errors.name) : null
                    }
                    helperText={
                      errors.name && touched.name ? errors.name : null
                    }
                  />
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
                  Update
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    
  );
};

export default EditDepartment;
