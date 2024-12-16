/* eslint-disable react/prop-types */
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
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { mapValues } from "lodash";
import { useAxios } from "@/contexts/AxiosProvider";
import { EmployeeDocumentUpdateSchema } from "@/validations/EmployeeDocumentSchema";
import moment from "moment";
import { getYear, getMonth } from "date-fns";
import { LoadingButton } from "@mui/lab";
const EDitDocuments = ({
  isEditOpen,
  closeEditDocument,
  employeeDetails,
  getEmployeeDetails,
  editDocumentData,
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
  const [enableRelatedTo, setEnableRelatedTo] = useState(true);
  //defining dropdown
  const relatedTo = [
    { value: "My-Self", label: "My-Self" },
    { value: "Dependent", label: "Dependent" },
  ];

  const documentType = [
    { value: "Aadhaar Card", label: "Aadhaar Card" },
    { value: "Pan Card", label: "Pan Card" },
    { value: "Election Card", label: "Election Card" },
    { value: "Driving License", label: "Driving License" },
    { value: "Passport", label: "Passport" },
  ];
  const [familyMember, setFamilyMember] = useState([]);

  const checkRelatedTo = (data) => {
    if (data || editDocumentData) {
      setEnableRelatedTo(false);
    }
    if (data.value === "My-Self") {
      setFamilyMember([
        {
          label: `${employeeDetails.first_name} ${employeeDetails.middle_name} ${employeeDetails.last_name}-${employeeDetails.employee_id}(You)`,
          value: employeeDetails.id,
        },
      ]);

      setFieldValue("related_to_ids", {
        label: `${employeeDetails.first_name} ${employeeDetails.middle_name} ${employeeDetails.last_name}-${employeeDetails.employee_id}(You)`,
        value: employeeDetails.id,
      });
    }
    if (data.value === "Dependent") {
      let allData =
        employeeDetails?.family_details?.length > 0
          ? employeeDetails.family_details.map((data) => ({
              label: data.name,
              value: data.id,
            }))
          : [];
      allData.length > 0 ? setFamilyMember(allData) : setFamilyMember([]);

      allData.length > 0
        ? setFieldValue("related_to_ids", allData[0])
        : setFieldValue("related_to_ids", "");
    }
  };

  const [loading, setLoading] = useState(false);
  const { Axios } = useAxios();

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
    initialValues: {
      document_type: editDocumentData.document?.document_type
        ? {
            value: editDocumentData.document.document_type,
            label: editDocumentData.document.document_type,
          }
        : "",
      document_no: editDocumentData.document?.document_no || "",
      issue_place: editDocumentData.document?.issue_place || "",
      issue_date: editDocumentData.document?.issue_date || "",
      expiry_date: editDocumentData.document?.expiry_date || "",
      remarks: editDocumentData.document?.remarks || "",
      files: editDocumentData?.document?.file?.split("/").pop() || "",
      related_to: editDocumentData
        ? editDocumentData.document.employee_family_id === null
          ? { value: "My-Self", label: "My-Self" }
          : { value: "Dependent", label: "Dependent" }
        : "",
    },
    validationSchema: EmployeeDocumentUpdateSchema,
    onSubmit: async (values) => {
      // Trim all string values
      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );
      const formData = new FormData();
      if (editDocumentData.document.employee_family_id) {
        formData.append(
          "family_id",
          editDocumentData.document.employee_family_id
        );
      } else {
        formData.append("user_id", employeeDetails.id);
      }
      formData.append("step", 13);
      formData.append("related_to_ids", values.related_to_ids.value);
      formData.append("active_user_id", employeeDetails?.id);

      formData.append(`document_type`, values.document_type.value);
      formData.append("document_id", editDocumentData?.document?.id);

      values?.files[0]?.name
        ? values.files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          })
        : editDocumentData.documet?.file
        ? editDocumentData.document.file
        : "";
      formData.append("issue_place", trimmedValues.issue_place);
      formData.append("remarks", trimmedValues.remarks);
      formData.append("document_no", trimmedValues.document_no);
      formData.append(
        "issue_date",
        moment(values.issue_date).format("YYYY-MM-DD")
      );
      values.expiry_date
        ? formData.append(
            "expiry_date",
            moment(values.expiry_date).format("YYYY-MM-DD")
          )
        : "";
      formData.append("key", "update");
      setLoading(true);
      const force = 1;
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);

          closeEditDocument();

          toast.success("Document Updated successfully");
          getEmployeeDetails(employeeDetails.id, force);

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
  useEffect(() => {
    if (employeeDetails.id !== editDocumentData.document.employee_family_id) {
      let allData =
        (employeeDetails.family_details || []).length > 0
          ? employeeDetails.family_details.map((data) => ({
              label: data.name,
              value: data.id,
            }))
          : [];
      setFamilyMember(allData);
    }
  }, []);
  useEffect(() => {
    if (editDocumentData.document.employee_family_id === null) {
      setFieldValue("related_to_ids", {
        label: `${employeeDetails.first_name} ${employeeDetails.middle_name} ${employeeDetails.last_name}-${employeeDetails.employee_id}(You)`,
        value: employeeDetails.id,
      });
    } else {
      const newEmployeeDetails = employeeDetails?.family_details?.filter(
        (familyData) =>
          familyData.id === editDocumentData.document.employee_family_id
      );
      setFieldValue("related_to_ids", {
        label: newEmployeeDetails[0]?.name,
        value: editDocumentData.document.employee_family_id,
      });
    }
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
        <Box className="modalContainer md">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Update Document
            </Typography>
            <IconButton
              aria-label="close"
              color="error"
              onClick={closeEditDocument}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y hvh-50">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Related To</InputLabel>
                  <Select
                    placeholder="Related To"
                    options={relatedTo}
                    value={values.related_to}
                    name="related_to"
                    onChange={(e) => {
                      setFieldValue("related_to", e);
                      checkRelatedTo(e);
                    }}
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Document Owner<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Document Owner"
                    value={values.related_to_ids}
                    isDisabled={editDocumentData ? false : enableRelatedTo}
                    options={familyMember}
                    onChange={(selectedOptions) => {
                      setFieldValue("related_to_ids", selectedOptions);
                    }}
                    name="related_to_ids"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />

                  {errors.related_to_ids && touched.related_to_ids ? (
                    <Typography component="span" className="error-msg">
                      {errors.related_to_ids}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Document Type<span>*</span>
                  </InputLabel>
                  <Select
                    placeholder="Document Type"
                    options={documentType}
                    value={values.document_type}
                    onChange={(selectedOptions) => {
                      setFieldValue("document_type", selectedOptions);
                    }}
                    name="document_type"
                    onBlur={handleBlur}
                    className="basic-multi-select selectTag"
                    classNamePrefix="select"
                  />
                  {errors.document_type && touched.document_type ? (
                    <Typography component="span" className="error-msg">
                      {errors.document_type}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">Issue Place</InputLabel>
                  <TextField
                    id="Issue Place"
                    placeholder="Enter Issue Place"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="issue_place"
                    value={values.issue_place}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.issue_place && touched.issue_place ? (
                    <Typography component="span" className="error-msg">
                      {errors.issue_place}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Issue Date<span>*</span>
                  </InputLabel>
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
                          onChange={({ target: { value } }) =>
                            changeYear(value)
                          }
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
                      values.issue_date ? new Date(values.issue_date) : null
                    }
                    name="issue_date"
                    onChange={(date) => setFieldValue("issue_date", date)}
                    onBlur={handleBlur}
                    className="dateTime-picker calender-icon"
                    placeholderText="Issue Date"
                    autoComplete="off"
                  />

                  {errors.issue_date && touched.issue_date ? (
                    <Typography component="span" className="error-msg">
                      {errors.issue_date}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Expiry Date<span>*</span>
                  </InputLabel>
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
                          onChange={({ target: { value } }) =>
                            changeYear(value)
                          }
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
                      values.expiry_date ? new Date(values.expiry_date) : null
                    }
                    name="expiry_date"
                    onChange={(date) => setFieldValue("expiry_date", date)}
                    onBlur={handleBlur}
                    className="dateTime-picker calender-icon"
                    placeholderText="Expiry Date"
                    autoComplete="off"
                  />

                  {errors.expiry_date && touched.expiry_date ? (
                    <Typography component="span" className="error-msg">
                      {errors.expiry_date}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Document No<span>*</span>
                  </InputLabel>
                  <TextField
                    id=""
                    placeholder="Document no"
                    variant="outlined"
                    rows={4}
                    fullWidth
                    size="small"
                    value={values.document_no}
                    name="document_no"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.document_no && touched.document_no ? (
                    <Typography component="span" className="error-msg">
                      {errors.document_no}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">Remarks</InputLabel>
                  <TextField
                    id=""
                    placeholder="Remarks"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                    value={values.remarks}
                    name="remarks"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.remarks && touched.remarks ? (
                    <Typography component="span" className="error-msg">
                      {errors.remarks}
                    </Typography>
                  ) : null}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormGroup>
                  <InputLabel className="fixlabel">
                    Document<span>*</span>
                    <Typography component={"small"} fontSize={12}></Typography>
                  </InputLabel>
                  <Box component="div" className="choosefile">
                    <Typography
                      component="label"
                      htmlFor="file-upload"
                      id="upload-document"
                    >
                      {values?.files?.length >= 1
                        ? values.files[0].name
                        : editDocumentData?.files?.length >= 1
                        ? editDocumentData?.files?.[0].split("/").pop()
                        : "Choose file"}
                    </Typography>

                    <input
                      type="file"
                      name="files"
                      multiple
                      id="file-upload"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files);

                        setFieldValue("files", selectedFiles);
                      }}
                    />
                    <Typography
                      component="label"
                      htmlFor="file-upload"
                      className="choosefile-button"
                    >
                      Browse
                    </Typography>
                    {errors.files && touched.files ? (
                      <Typography component="span" className="error-msg">
                        {errors.files}
                      </Typography>
                    ) : null}
                  </Box>
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
                Update
              </LoadingButton>
              <Button
                variant="outlined"
                color="primary"
                className="text-capitalize"
                onClick={closeEditDocument}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EDitDocuments;
