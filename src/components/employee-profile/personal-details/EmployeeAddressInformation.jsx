/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mapValues } from "lodash";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { EmployeeAddressSchema } from "@/validations/EmployeeAddressSchema";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { getYear, getMonth } from "date-fns";
const EmployeeAddressInformation = ({
  employeeDetails,
  getEmployeeDetails,
}) => {
  //function to set range
  const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  };
  //to select year in datepicker
  const years = range(1990, getYear(new Date()) + 100, 1);
  //to select month in datepicker
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //function to trim all value
  const trimValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();
  const [message, setMessage] = useState([]);
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
  const cityType = [
    { value: "Rural", label: "Rural" },
    { value: "Metro", label: "Metro" },
  ];
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
      //local/mailing address

      mailing_wef: null,
      mailing_city: "",
      mailing_state: "",
      mailing_line1: "",
      mailing_line2: "",
      mailing_line3: "",
      mailing_phone1: "",
      mailing_phone2: "",
      mailing_country: "",
      mailing_pincode: "",
      mailing_city_type: "",
      mailing_land_line1: "",
      mailing_land_line2: "",

      permanent_same_as_current: false,

      //permanent address
      parmanent_wef: null,
      parmanent_city: "",
      parmanent_state: "",
      parmanent_line1: "",
      parmanent_line2: "",
      parmanent_line3: "",
      parmanent_phone1: "",
      parmanent_phone2: "",
      parmanent_country: "",
      parmanent_pincode: "",
      parmanent_city_type: "",
      parmanent_land_line1: "",
      parmanent_land_line2: "",
    },
    validationSchema: EmployeeAddressSchema,
    onSubmit: async (values) => {
      //storing and triming user input
      const payload = trimValues({
        ...values,
        user_id: employeeDetails.id,
        step: 10,
        form: 2,
        mailing_city_type: values.mailing_city_type
          ? values.mailing_city_type.value
          : "",
        mailing_country: values.mailing_country
          ? values.mailing_country.value
          : "",
        mailing_wef: values.mailing_wef
          ? moment(values.mailing_wef).format("YYYY-MM-DD")
          : null,
        parmanent_wef: values.parmanent_wef
          ? moment(values.parmanent_wef).format("YYYY-MM-DD")
          : null,
        parmanent_city_type: values.parmanent_city_type
          ? values.parmanent_city_type.value
          : "",
        parmanent_country: values.parmanent_country
          ? values.parmanent_country.value
          : "",
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
            ? toast.success("Address information Updated successfully")
            : toast.success("Address information added successfully");
          getEmployeeDetails(employeeDetails.id, force);

          resetForm();
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing api error
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
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

  const handleSubmitValidation = () => {
    if (values.permanent_same_as_current) {
      MailingAsPermanent(true);
    }
    handleSubmit();
  };

  //storing mailing address as parmament address
  const MailingAsPermanent = (data) => {
    if (data === true) {
      setFieldValue("parmanent_wef", values.mailing_wef);
      setFieldValue("parmanent_city", values.mailing_city);
      setFieldValue("parmanent_state", values.mailing_state);
      setFieldValue("parmanent_line1", values.mailing_line1);
      setFieldValue("parmanent_line2", values.mailing_line2);
      setFieldValue("parmanent_line3", values.mailing_line3);
      setFieldValue("parmanent_phone1", values.mailing_phone1);
      setFieldValue("parmanent_phone2", values.mailing_phone2);
      setFieldValue("parmanent_country", values.mailing_country);
      setFieldValue("parmanent_pincode", values.mailing_pincode);
      setFieldValue("parmanent_city_type", values.mailing_city_type);
      setFieldValue("parmanent_land_line1", values.mailing_land_line1);
      setFieldValue("parmanent_land_line2", values.mailing_land_line2);
    }
    //storing mailing address as parmament address
    if (data === false) {
      setFieldValue("parmanent_wef", null);
      setFieldValue("parmanent_city", "");
      setFieldValue("parmanent_state", "");
      setFieldValue("parmanent_line1", "");
      setFieldValue("parmanent_line2", "");
      setFieldValue("parmanent_line3", "");
      setFieldValue("parmanent_phone1", "");
      setFieldValue("parmanent_phone2", "");
      setFieldValue("parmanent_country", "");
      setFieldValue("parmanent_pincode", "");
      setFieldValue("parmanent_city_type", "");
      setFieldValue("parmanent_land_line1", "");
      setFieldValue("parmanent_land_line2", "");
    }
  };
  //storing all values when component mount
  useEffect(() => {
    (employeeDetails?.addresses || [])?.length > 0
      ? employeeDetails.addresses.forEach((data) => {
          if (data.address_type === "permanent") {
            setMessage(data);
            setFieldValue("parmanent_wef", data.wef);
            setFieldValue("parmanent_city", data.city);
            setFieldValue("parmanent_state", data.state);
            setFieldValue("parmanent_line1", data.line1);
            setFieldValue("parmanent_line2", data.line2);
            setFieldValue("parmanent_line3", data.line3);
            setFieldValue("parmanent_phone1", data.phone1);
            setFieldValue("parmanent_phone2", data.phone2);
            setFieldValue(
              "parmanent_country",
              data.country
                ? {
                    value: data.country,
                    label: data.country,
                  }
                : ""
            );
            setFieldValue("parmanent_pincode", data.pincode);
            setFieldValue(
              "parmanent_city_type",
              data.city_type
                ? {
                    value: data.city_type,
                    label: data.city_type,
                  }
                : ""
            );
            setFieldValue("parmanent_land_line1", data.landline1);
            setFieldValue("parmanent_land_line2", data.landline2);
          }
          if (data.address_type === "mailing") {
            setMessage(data);
            setFieldValue("mailing_wef", data.wef);
            setFieldValue("mailing_city", data.city);
            setFieldValue("mailing_state", data.state);
            setFieldValue("mailing_line1", data.line1);
            setFieldValue("mailing_line2", data.line2);
            setFieldValue("mailing_line3", data.line3);
            setFieldValue("mailing_phone1", data.phone1);
            setFieldValue("mailing_phone2", data.phone2);
            setFieldValue(
              "mailing_country",
              data.country
                ? {
                    value: data.country,
                    label: data.country,
                  }
                : ""
            );
            setFieldValue("mailing_pincode", data.pincode);
            setFieldValue(
              "mailing_city_type",
              data.city_type
                ? {
                    value: data.city_type,
                    label: data.city_type,
                  }
                : ""
            );
            setFieldValue("mailing_land_line1", data.landline1);
            setFieldValue("mailing_land_line2", data.landline2);
            setFieldValue(
              "permanent_same_as_current",
              data.permanent_same_as_current
            );
          }
        })
      : "";
  }, []);
  return (
    <Box>
      <Accordion
        sx={{
          mb: "15px !important",
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          className="accordion-head"
        >
          Current Address
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Address 1<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter address"
                  size="small"
                  name="mailing_line1"
                  value={values.mailing_line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.mailing_line1 && touched.mailing_line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address 2</InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter address"
                  size="small"
                  name="mailing_line2"
                  value={values.mailing_line2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.mailing_line2 && touched.mailing_line2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_line2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address 3</InputLabel>
                <TextField
                  variant="outlined"
                  id="address-3"
                  placeholder="Enter address"
                  size="small"
                  name="mailing_line3"
                  value={values.mailing_line3}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.mailing_line3 && touched.mailing_line3 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_line3}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Pin Code<span>*</span>
                </InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="pin-code"
                  placeholder="Enter pin code"
                  size="small"
                  name="mailing_pincode"
                  value={values.mailing_pincode}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "mailing_pincode", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.mailing_pincode && touched.mailing_pincode ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_pincode}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Country<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Country"
                  name="mailing_country"
                  options={country}
                  value={values.mailing_country}
                  onChange={(selectedOption) => {
                    setFieldValue("mailing_country", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.mailing_country && touched.mailing_country ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_country}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  State<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter state name"
                  size="small"
                  name="mailing_state"
                  value={values.mailing_state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.mailing_state && touched.mailing_state ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_state}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City</InputLabel>
                <TextField
                  variant="outlined"
                  id="city"
                  placeholder="Enter City"
                  size="small"
                  value={values.mailing_city}
                  name="mailing_city"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.mailing_city && touched.mailing_city ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_city}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City Type</InputLabel>
                <Select
                  placeholder="Select City Type"
                  name="mailing_city_type"
                  maxMenuHeight={250}
                  options={cityType}
                  value={values.mailing_city_type}
                  onChange={(selectedOption) => {
                    setFieldValue("mailing_city_type", selectedOption);
                  }}
                  onBlur={handleBlur}
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {errors.mailing_city_type && touched.mailing_city_type ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_city_type}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Mobile Number 1<span>*</span>
                </InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobile-number"
                  placeholder="Enter mobile number"
                  size="small"
                  name="mailing_phone1"
                  value={values.mailing_phone1}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "mailing_phone1", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.mailing_phone1 && touched.mailing_phone1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_phone1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Mobile Number 2</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobile-number1"
                  placeholder="Enter mobile number"
                  size="small"
                  name="mailing_phone2"
                  value={values.mailing_phone2}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "mailing_phone2", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.mailing_phone2 && touched.mailing_phone2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_phone2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Landline Number 1</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="landline-number2"
                  placeholder="Enter Landline Number"
                  size="small"
                  name="mailing_land_line1"
                  value={values.mailing_land_line1}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "mailing_land_line1",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.mailing_land_line1 && touched.mailing_land_line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_land_line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Landline Number 2</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="landline-number2"
                  placeholder="Enter Landline Number"
                  size="small"
                  name="mailing_land_line2"
                  value={values.mailing_land_line2}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "mailing_land_line2",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {errors.mailing_land_line2 && touched.mailing_land_line2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_land_line2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">WEF</InputLabel>
                <DatePicker
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        padding: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option
                            key={option}
                            value={option}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                              color: "#333",
                              width: "10px",
                            }}
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                  selected={
                    values.mailing_wef ? new Date(values.mailing_wef) : null
                  }
                  onChange={(date) => setFieldValue("mailing_wef", date)}
                  name="mailing_wef"
                  onBlur={handleBlur}
                  className="dateTime-picker calender-icon"
                  placeholderText="WEF Date"
                  autoComplete="off"
                />

                {errors.mailing_wef && touched.mailing_wef ? (
                  <Typography component="span" className="error-msg">
                    {errors.mailing_wef}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
          </Grid>

          <FormControlLabel
            style={{ marginTop: "20px" }}
            control={
              <Checkbox
                checked={values.permanent_same_as_current}
                onChange={(e) => {
                  setFieldValue("permanent_same_as_current", e.target.checked);
                  MailingAsPermanent(e.target.checked);
                }}
                name="permanent_same_as_current"
              />
            }
            label="Permanent Address is same as Current Address"
          />

          <AccordionSummary
            style={{ marginTop: "10px" }}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Permanent Address
          </AccordionSummary>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Address 1<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter address"
                  size="small"
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  name="parmanent_line1"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_line1
                      : values.parmanent_line1
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_line1 &&
                touched.parmanent_line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address 2</InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter address"
                  size="small"
                  name="parmanent_line2"
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_line2
                      : values.parmanent_line2
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_line2 &&
                touched.parmanent_line2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_line2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Address 3</InputLabel>
                <TextField
                  variant="outlined"
                  id="address-3"
                  placeholder="Enter address"
                  size="small"
                  name="parmanent_line3"
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_line3
                      : values.parmanent_line3
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_line3 &&
                touched.parmanent_line3 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_line3}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Pin Code<span>*</span>
                </InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="pin-code"
                  placeholder="Enter pin code"
                  size="small"
                  name="parmanent_pincode"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_pincode
                      : values.parmanent_pincode
                  }
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "parmanent_pincode",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_pincode &&
                touched.parmanent_pincode ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_pincode}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup
                sx={{
                  input: {
                    cursor: values?.permanent_same_as_current
                      ? "not-allowed"
                      : "auto",
                  },
                }}
              >
                <InputLabel className="fixlabel">
                  Country<span>*</span>
                </InputLabel>
                <Select
                  placeholder="Country"
                  name="parmanent_country"
                  options={country}
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_country
                      : values.parmanent_country
                  }
                  onChange={(selectedOption) => {
                    setFieldValue("parmanent_country", selectedOption);
                  }}
                  onBlur={handleBlur}
                  isDisabled={
                    values?.permanent_same_as_current ? () => true : ""
                  }
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_country &&
                touched.parmanent_country ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_country}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  State<span>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="address-1"
                  placeholder="Enter state name"
                  size="small"
                  name="parmanent_state"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_state
                      : values.parmanent_state
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                />

                {!values?.permanent_same_as_current &&
                errors.parmanent_state &&
                touched.parmanent_state ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_state}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City</InputLabel>
                <TextField
                  variant="outlined"
                  id="city"
                  placeholder="Enter City"
                  size="small"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_city
                      : values.parmanent_city
                  }
                  name="parmanent_city"
                  onChange={handleChange}
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_city &&
                touched.parmanent_city ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_city}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">City Type</InputLabel>
                <Select
                  placeholder="Select City Type"
                  name="parmanent_city_type"
                  maxMenuHeight={250}
                  options={cityType}
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_city_type
                      : values.parmanent_city_type
                  }
                  onChange={(selectedOption) => {
                    setFieldValue("parmanent_city_type", selectedOption);
                  }}
                  onBlur={handleBlur}
                  isDisabled={
                    values?.permanent_same_as_current ? () => true : ""
                  }
                  menuPlacement="auto"
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_city_type &&
                touched.parmanent_city_type ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_city_type}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">
                  Mobile Number 1<span>*</span>
                </InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobile-number"
                  placeholder="Enter mobile number"
                  size="small"
                  name="parmanent_phone1"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_phone1
                      : values.parmanent_phone1
                  }
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "parmanent_phone1", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_phone1 &&
                touched.parmanent_phone1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_phone1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Mobile Number 2</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="mobile-number1"
                  placeholder="Enter mobile number"
                  size="small"
                  name="parmanent_phone2"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_phone2
                      : values.parmanent_phone2
                  }
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "parmanent_phone2", value: numericValue },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_phone2 &&
                touched.parmanent_phone2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_phone2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Landline Number 1</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="landline-number2"
                  placeholder="Enter Landline Number"
                  size="small"
                  name="parmanent_land_line1"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_land_line1
                      : values.parmanent_land_line1
                  }
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "parmanent_land_line1",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_land_line1 &&
                touched.parmanent_land_line1 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_land_line1}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup>
                <InputLabel className="fixlabel">Landline Number 2</InputLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  id="landline-number2"
                  placeholder="Enter Landline Number"
                  size="small"
                  name="parmanent_land_line2"
                  value={
                    values?.permanent_same_as_current
                      ? values.mailing_land_line2
                      : values.parmanent_land_line2
                  }
                  disabled={values?.permanent_same_as_current ? true : false}
                  sx={{
                    input: {
                      cursor: values?.permanent_same_as_current
                        ? "not-allowed"
                        : "auto",
                    },
                  }}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "parmanent_land_line2",
                        value: numericValue,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                />
                {!values?.permanent_same_as_current &&
                errors.parmanent_land_line2 &&
                touched.parmanent_land_line2 ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_land_line2}
                  </Typography>
                ) : null}
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <FormGroup
                sx={{
                  input: {
                    cursor: values?.permanent_same_as_current
                      ? "not-allowed"
                      : "auto",
                  },
                }}
              >
                <InputLabel className="fixlabel">WEF</InputLabel>
                <DatePicker
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        padding: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {"<"}
                      </button>
                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option
                            key={option}
                            value={option}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                              color: "#333",
                              width: "10px",
                            }}
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                  selected={
                    values.permanent_same_as_current
                      ? values.mailing_wef
                        ? new Date(values.mailing_wef)
                        : values.parmanent_wef
                        ? new Date(values.parmanent_wef)
                        : null
                      : null
                  }
                  onChange={(date) => setFieldValue("parmanent_wef", date)}
                  name="parmanent_wef"
                  onBlur={handleBlur}
                  disabled={values.permanent_same_as_current ? true : false}
                  className="dateTime-picker calender-icon"
                  placeholderText="WEF Date"
                  autoComplete="off"
                />

                {!values?.permanent_same_as_current &&
                errors.parmanent_wef &&
                touched.parmanent_wef ? (
                  <Typography component="span" className="error-msg">
                    {errors.parmanent_wef}
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
              onClick={handleSubmitValidation}
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

export default EmployeeAddressInformation;
