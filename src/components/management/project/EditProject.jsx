import { useFormik } from "formik";
import { mapValues } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { ProjectSchema } from "@/validations/ProjectSchema";
import moment from "moment";
import { refresh } from "@/redux/ProjectSlice";
import Select from "react-select";
import "react-international-phone/style.css";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
const EditProject = ({ isEditOpen, closeEditProject, editProjectData }) => {
  //triming all values
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //dispatch to send request to the redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //state to store client details
  const [clientDetails, setClientDetails] = useState([]);
  //state to store technology details
  const [technologies, setTechnologies] = useState([]);
  //state to store employee details
  const [resources, setResources] = useState([]);
  //function to store with labe and value
  const setAllSingleProjectDetails = () => {
    setFieldValue(
      "technologies",
      (editProjectData.technologies || []).map((e) => ({
        label: e.name,
        value: e.id,
      }))
    );
    setFieldValue(
      "resources",
      (editProjectData.resource || []).map((e) => ({
        label: e.first_name,
        value: e.id,
      }))
    );
  };
  //getting user input and sending to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    handleBlur,
    resetForm,
    setErrors,
  } = useFormik({
    initialValues: {
      name: editProjectData.name || "",
      client_id: editProjectData?.client
        ? {
            label: editProjectData.client.name,
            value: editProjectData.client.id,
          }
        : "",
      technologies: [],
      resources: [],
      start_date: editProjectData.start_date || "",
      duration: editProjectData.duration || "",
    },
    validationSchema: ProjectSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      const technologies = [];
      const resources = [];
      values.technologies.forEach((data, index) => {
        technologies[index] = data.value;
      });
      values.resources.forEach((data, index) => {
        resources[index] = data.value;
      });
      const payload = trimValues({
        ...values,
        technologies,
        resources,
        client_id: values.client_id.value,
        duration: Number(values.duration),
        start_date: moment(values.start_date).format("YYYY-MM-DD"),
      });

      try {
        const data = await Axios.put(
          `project/update/${editProjectData.id}`,
          payload
        );

        if (data.status && data.status >= 200 && data.status < 300) {
          setLoading(false);
          closeEditProject(false);
          toast.success("Project Updated successfully");
          //sending request to the redux store
          dispatch(refresh());
          resetForm();
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
  //fetching technology
  const getCLientDetails = async () => {
    try {
      const data = await Axios.get("client/list");
      if (data.status && data.status === 200) {
        const clientallData = data.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setClientDetails(clientallData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //fetching client
  const getTechnologies = async () => {
    try {
      const data = await Axios.get("technology/list");
      if (data.status && data.status === 200) {
        const technologyAllData = data.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setTechnologies(technologyAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //fetching employee
  const getResources = async () => {
    try {
      const data = await Axios.get("user/list");
      if (data.status && data.status === 200) {
        const resourceAllData = data.data.data.map((item) => ({
          value: item.id,
          label: item.first_name,
        }));
        setResources(resourceAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  useEffect(() => {
    getCLientDetails();
    getTechnologies();
    getResources();
    setAllSingleProjectDetails();
  }, []);
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Update Project
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditProject}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
            <Stack spacing={2}>
              <TextField
                id="UserId"
                label="Project Name"
                variant="outlined"
                value={values.name}
                fullWidth
                name="name"
                size="small"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.name && touched.name ? (
                <Typography component="span" className="error-msg">
                  {errors.name}
                </Typography>
              ) : null}
              <Select
                options={clientDetails}
                value={values.client_id}
                className="selectTag"
                placeholder="Select Client"
                name="client_id"
                onBlur={handleBlur}
                onChange={(selectedOptions) => {
                  setFieldValue("client_id", selectedOptions);
                }}
              />
              {errors.client_id && touched.client_id ? (
                <Typography component="span" className="error-msg">
                  {errors.client_id}
                </Typography>
              ) : null}
              <Select
                options={technologies}
                value={values.technologies}
                className="selectTag"
                isMulti
                placeholder="Select Technology"
                name="technologies"
                onBlur={handleBlur}
                onChange={(selectedOptions) => {
                  setFieldValue(
                    "technologies",
                    selectedOptions.map((e) => e)
                  );
                }}
              />
              {errors.technologies && touched.technologies ? (
                <Typography component="span" className="error-msg">
                  {errors.technologies}
                </Typography>
              ) : null}
              <Select
                options={resources}
                value={values.resources}
                className="selectTag"
                isMulti
                placeholder="Select Employee"
                name="resources"
                onBlur={handleBlur}
                onChange={(selectedOptions) => {
                  setFieldValue(
                    "resources",
                    selectedOptions.map((e) => e)
                  );
                }}
              />

              {errors.resources && touched.resources ? (
                <Typography component="span" className="error-msg">
                  {errors.resources}
                </Typography>
              ) : null}

              <DatePicker
                popperPlacement="top-start"
                selected={
                  values.start_date ? new Date(values.start_date) : null
                }
                className="dateTime-picker"
                placeholderText="Select Start Date"
                name="start_date"
                onBlur={handleBlur}
                onChange={(date) => {
                  setFieldValue("start_date", date);
                }}
              />
              {errors.start_date && touched.start_date ? (
                <Typography component="span" className="error-msg">
                  {errors.start_date}
                </Typography>
              ) : null}
              <TextField
                id="UserId"
                label="Project Duration in hr"
                variant="outlined"
                type="number"
                value={values.duration}
                fullWidth
                name="duration"
                size="small"
                // inputProps={{
                //   pattern: "[0-9]*",
                // }}
                onBlur={handleBlur}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange({
                    target: { name: "duration", value: numericValue },
                  });
                }}
              />
              {errors.duration && touched.duration ? (
                <Typography component="span" className="error-msg">
                  {errors.duration}
                </Typography>
              ) : null}
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

export default EditProject;
