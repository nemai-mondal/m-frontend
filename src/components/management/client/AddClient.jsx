import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { refresh } from "@/redux/ClientSlice";
import { mapValues } from "lodash";
import Select from "react-select";
import {
  Backdrop,
  Box,
  Button,
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
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import { ClientSchema } from "@/validations/ClientSchema";
const AddClient = ({ isAddOpen, closeAddClient }) => {
  // Define dropdown options
  const source = [
    { value: "Linkedin", label: "Linkedin" },
    { value: "Google", label: "Google" },
    { value: "Others", label: "Others" },
  ];
  const industry = [
    {
      label: "Information Technology (IT)",
      value: "Information Technology (IT)",
    },
    {
      label: "Healthcare",
      value: "Healthcare",
    },
    {
      label: "Finance and Banking",
      value: "Finance and Banking",
    },
    {
      label: "Education",
      value: "Education",
    },
    {
      label: "Retail",
      value: "Retail",
    },
    {
      label: "Manufacturing",
      value: "Manufacturing",
    },
    {
      label: "Hospitality and Tourism",
      value: "Hospitality and Tourism",
    },
    {
      label: "Transportation and Logistics",
      value: "Transportation and Logistics",
    },
    {
      label: "Real Estate",
      value: "Real Estate",
    },
    {
      label: "Entertainment and Media",
      value: "Entertainment and Media",
    },
    {
      label: "Agriculture",
      value: "Agriculture",
    },
    {
      label: "Biotechnology and Pharmaceuticals",
      value: "Biotechnology and Pharmaceuticals",
    },
    {
      label: "Consulting",
      value: "Consulting",
    },
    {
      label: "Gaming",
      value: "Gaming",
    },
    {
      label: "Human Resources and Recruitment",
      value: "Human Resources and Recruitment",
    },
    {
      label: "Sports and Recreation",
      value: "Sports and Recreation",
    },
  ];
  const status = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 0 },
  ];
  const site = [
    { label: "Domestic", value: "domestic" },
    { label: "International", value: "international" },
  ];
  const category = [
    { label: "New", value: "new" },
    { label: "Existing", value: "existing" },
  ];
  const country = [
    { value: "IND", label: "India" },
    { value: "USA", label: "United States of America" },
    { value: "UK", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "Japan", label: "Japan" },
    { value: "South Africa", label: "South Africa" },
  ];
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
  //getting user input and sending to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    handleBlur,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      site: "",
      type: "",
      email: "",
      phone: "",
      country: "",
      industry: "",
      company_name: "",
      company_address: "",
      contact_person: "",
      opportunity_source: "",
      status: "",
    },
    validationSchema: ClientSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = trimValues({
        ...values,
        site: values?.site?.value || "",
        type: values?.type?.value || "",
        country: values?.country?.value || "",
        industry: values?.industry?.value || "",
        opportunity_source: values?.opportunity_source?.value || "",
        status: values?.status?.value.toString() || "",
      });

      try {
        const res = await Axios.post("client/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          closeAddClient(false);
          //sending request to the redux store
          dispatch(refresh());
          toast.success(res.data.message);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing error if any error comes from api
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
              Add Client
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeAddClient}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box className="modalBody scroll-y hvh-70">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Client Name<span>*</span>
                  </InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Client Name"
                    variant="outlined"
                    fullWidth
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
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Client Contact Person<span>*</span>
                  </InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Client Contact Person"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="contact_person"
                    value={values.contact_person}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.contact_person && touched.contact_person ? (
                    <Typography component="span" className="error-msg">
                      {errors.contact_person}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Contact Email<span>*</span>
                  </InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Contact Email"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email ? (
                    <Typography component="span" className="error-msg">
                      {errors.email}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Phone Number</InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Phone Number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="phone"
                    value={values.phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      handleChange({
                        target: {
                          name: "phone",
                          value: numericValue,
                        },
                      });
                    }}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone ? (
                    <Typography component="span" className="error-msg">
                      {errors.phone}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Company Name</InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Comapny Name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="company_name"
                    value={values.company_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.company_name && touched.company_name ? (
                    <Typography component="span" className="error-msg">
                      {errors.company_name}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Company Address</InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Company Address"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="company_address"
                    value={values.company_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.company_address && touched.company_address ? (
                    <Typography component="span" className="error-msg">
                      {errors.company_address}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Source of the Opportunity<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Source of the Opportunity"
                    options={source}
                    name="opportunity_source"
                    value={values.opportunity_source}
                    onChange={(selectedOptions) => {
                      setFieldValue("opportunity_source", selectedOptions);
                    }}
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.opportunity_source && touched.opportunity_source ? (
                    <Typography component="span" className="error-msg">
                      {errors.opportunity_source}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Industry<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Industry"
                    menuPlacement="top"
                    value={values.industry}
                    options={industry}
                    maxMenuHeight={200}
                    onChange={(selectedOptions) => {
                      setFieldValue("industry", selectedOptions);
                    }}
                    name="industry"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.industry && touched.industry ? (
                    <Typography component="span" className="error-msg">
                      {errors.industry}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Client Status<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Client Status"
                    options={status}
                    value={values.status}
                    onChange={(selectedOptions) => {
                      setFieldValue("status", selectedOptions);
                    }}
                    name="status"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.status && touched.status ? (
                    <Typography component="span" className="error-msg">
                      {errors.status}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Client Type<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Client Type"
                    value={values.site}
                    options={site}
                    onChange={(selectedOptions) => {
                      setFieldValue("site", selectedOptions);
                    }}
                    name="site"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.site && touched.site ? (
                    <Typography component="span" className="error-msg">
                      {errors.site}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Client Category<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Select Client Category"
                    menuPlacement="top"
                    value={values.type}
                    options={category}
                    onChange={(selectedOptions) => {
                      setFieldValue("type", selectedOptions);
                    }}
                    name="type"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.type && touched.type ? (
                    <Typography component="span" className="error-msg">
                      {errors.type}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Country</InputLabel>
                  <Select
                    placeholder="Select Country"
                    menuPlacement="top"
                    value={values.country}
                    options={country}
                    onChange={(selectedOptions) => {
                      setFieldValue("country", selectedOptions);
                    }}
                    name="country"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                    inputProps={{ autoComplete: "off" }} 
                  
                  />

                  {errors.country && touched.country ? (
                    <Typography component="span" className="error-msg">
                      {errors.country}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
            </Grid>
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
                Add
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddClient;
