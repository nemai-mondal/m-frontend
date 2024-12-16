/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormGroup,  
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Select from "react-select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mapValues } from "lodash";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { EmployeeEmergencyAddressSchema } from "@/validations/EmployeeEmergencyAddressSchema";
import { LoadingButton } from "@mui/lab";
const EmployeeEmergencyAddress = ({ employeeDetails, getEmployeeDetails }) => {
  //defining dropdown
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
  // const state = [
  //   { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  //   { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  //   { value: "Assam", label: "Assam" },
  //   { value: "Bihar", label: "Bihar" },
  //   { value: "Chhattisgarh", label: "Chhattisgarh" },
  //   { value: "Goa", label: "Goa" },
  //   { value: "Gujarat", label: "Gujarat" },
  //   { value: "Haryana", label: "Haryana" },
  //   { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  //   { value: "Jharkhand", label: "Jharkhand" },
  //   { value: "West Bengal", label: "West Bengal" },
  // ];
  //function to trim all value
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  const [message, setMessage] = useState([]);
  //function to get userinput and send to the api
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
    //storing values
    initialValues: {
      addresses: [
        {
          contact_name: "",
          relation: "",
          city: "",
          state: "",
          line1: "",
          phone1: "",
          phone2: "",
          country: "",
          pincode: "",
        },
        {
          contact_name: "",
          relation: "",
          city: "",
          state: "",
          line1: "",
          phone1: "",
          phone2: "",
          country: "",
          pincode: "",
        },
      ],
    },
    validationSchema: EmployeeEmergencyAddressSchema,
    onSubmit: async (values) => {
      //storing and triming user input
      const payload = trimValues({
        ...values,
        user_id: employeeDetails.id,
        step: 10,
        form: 4,
        addresses: [
          {
            ...values.addresses[0],
            country: values.addresses[0]?.country?.value || "",
          },
          {
            ...values.addresses[1],
            country: values.addresses[1]?.country?.value || "",
          },
        ],
      });
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          payload
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          message
            ? toast.success("Emergency Address Updated successfully")
            : toast.success("Emergency Address Added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
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
  //storing all values when component mount
  useEffect(() => {
   ( employeeDetails?.addresses||[]).length > 0
      ? employeeDetails.addresses.forEach((data) => {
          if (data.address_type === "emergency_address_1") {
            setMessage(data);
            setFieldValue("addresses[0].contact_name", data.contact_name);
            setFieldValue("addresses[0].relation", data.relation);
            setFieldValue("addresses[0].phone1", data.phone1);
            setFieldValue("addresses[0].phone2", data.phone2);
            setFieldValue("addresses[0].line1", data.line1);
            setFieldValue("addresses[0].pincode", data.pincode);
            setFieldValue("addresses[0].state", data.state);
            setFieldValue("addresses[0].city", data.city);
            setFieldValue(
              "addresses[0].country",
              data.country
                ? {
                    values: data.country,
                    label: data.country,
                  }
                : ""
            );
          }
          if (data.address_type === "emergency_address_2") {
            setMessage(data);
            setFieldValue("addresses[1].contact_name", data.contact_name);
            setFieldValue("addresses[1].relation", data.relation);
            setFieldValue("addresses[1].phone1", data.phone1);
            setFieldValue("addresses[1].phone2", data.phone2);
            setFieldValue("addresses[1].line1", data.line1);
            setFieldValue("addresses[1].pincode", data.pincode);
            setFieldValue("addresses[1].state", data.state);
            setFieldValue("addresses[1].city", data.city);
            setFieldValue(
              "addresses[1].country",
              data.country
                ? {
                    values: data.country,
                    label: data.country,
                  }
                : ""
            );
          }
        })
      : "";
  }, []);
  return (
    <Box>
      <Accordion
        sx={{
          mb: '15px !important',
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
          className="accordion-head"
        >
          Emergency Address 1
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Name Of Contact<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  placeholder="Enter Name"
                  size="small"
                  name="addresses[0].contact_name"
                  value={values.addresses[0].contact_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].contact_name &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].contact_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].contact_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Relation With Employee
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="relation"
                  placeholder="Enter Relation"
                  size="small"
                  name="addresses[0].relation"
                  value={values.addresses[0].relation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].relation &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].relation ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].relation}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Phone Number</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  size="small"
                  name="addresses[0].phone1"
                  value={values.addresses[0].phone1}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[0].phone1",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].phone1 &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].phone1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].phone1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Mobile Number<span>*</span></InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobileNumber"
                  placeholder="Enter Mobile Number"
                  size="small"
                  name="addresses[0].phone2"
                  value={values.addresses[0].phone2}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[0].phone2",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].phone2 &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].phone2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].phone2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="addresses"
                  placeholder="Enter addresses"
                  size="small"
                  name="addresses[0].line1"
                  value={values.addresses[0].line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].line1 &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Postal Code<span>*</span></InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="pin"
                  placeholder="Enter Postal Code"
                  size="small"
                  name="addresses[0].pincode"
                  value={values.addresses[0].pincode}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[0].pincode",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].pincode &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].pincode ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].pincode}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Country<span>*</span></InputLabel>
                <Select
                  placeholder="Select Country"
                  name="addresses[0].country"
                  options={country}
                  value={values.addresses[0].country}
                  onBlur={handleBlur}
                  onChange={(selectedOption) => {
                    setFieldValue("addresses[0].country", selectedOption);
                  }}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].country &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].country ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].country}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">State<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  placeholder="Enter state name"
                  size="small"
                  name="addresses[0].state"
                  value={values.addresses[0].state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].state &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].state ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].state}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City</InputLabel>
                <TextField
                  variant="outlined"
                  id="City"
                  placeholder="City Name"
                  size="small"
                  name="addresses[0].city"
                  value={values.addresses[0].city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[0] &&
                errors.addresses[0].city &&
                touched.addresses &&
                touched.addresses[0] &&
                touched.addresses[0].city ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[0].city}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionSummary aria-controls="panel4-content" id="panel4-header">
          Emergency Address 2
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Name Of Contact<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  placeholder="Enter Name"
                  size="small"
                  name="addresses[1].contact_name"
                  value={values.addresses[1].contact_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].contact_name &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].contact_name ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].contact_name}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Relation With Employee
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="relation"
                  placeholder="Enter Relation"
                  size="small"
                  name="addresses[1].relation"
                  value={values.addresses[1].relation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].relation &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].relation ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].relation}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Phone Number</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  size="small"
                  name="addresses[1].phone1"
                  value={values.addresses[1].phone1}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[1].phone1",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].phone1 &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].phone1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].phone1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Mobile Number<span>*</span></InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobileNumber"
                  placeholder="Enter Mobile Number"
                  size="small"
                  name="addresses[1].phone2"
                  value={values.addresses[1].phone2}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[1].phone2",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].phone2 &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].phone2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].phone2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="addresses"
                  placeholder="Enter addresses"
                  size="small"
                  name="addresses[1].line1"
                  value={values.addresses[1].line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].line1 &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Postal Code<span>*</span></InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="pin"
                  placeholder="Enter Postal Code"
                  size="small"
                  name="addresses[1].pincode"
                  value={values.addresses[1].pincode}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "addresses[1].pincode",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].pincode &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].pincode ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].pincode}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Country<span>*</span></InputLabel>
                <Select
                  placeholder="Select Country"
                  name="addresses[1].country"
                  options={country}
                  value={values.addresses[1].country}
                  onBlur={handleBlur}
                  onChange={(selectedOption) => {
                    setFieldValue("addresses[1].country", selectedOption);
                  }}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].country &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].country ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].country}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">State<span>*</span></InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  placeholder="Enter state name"
                  size="small"
                  name="addresses[1].state"
                  value={values.addresses[1].state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].state &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].state ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].state}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City</InputLabel>
                <TextField
                  variant="outlined"
                  id="City"
                  placeholder="City Name"
                  size="small"
                  name="addresses[1].city"
                  value={values.addresses[1].city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.addresses &&
                errors.addresses[1] &&
                errors.addresses[1].city &&
                touched.addresses &&
                touched.addresses[1] &&
                touched.addresses[1].city ? (
                  <Typography component="span" className="error-msg">
                    {errors.addresses[1].city}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
          </Grid>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            mt={4}
            mb={3}
          >
            <LoadingButton
              variant="contained"
              className="text-capitalize"
              color="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Submit
            </LoadingButton>
            <Button
              variant="outlined"
              color="primary"
              className="text-capitalize"
              onClick={resetForm}
            >
              Reset
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EmployeeEmergencyAddress;
