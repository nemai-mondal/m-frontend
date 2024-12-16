import { Fragment, useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Grid,
  FormGroup,
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { mapValues } from "lodash";
import { LeavePolicy as LeavePolicyValidation } from "../../../validations/LeavePolicySchema";
import { useFormik } from "formik";
const LeavePolicyModal = ({
  closeModal,
  isLeavePolicyModalOpen,
  updateLeavePolicyData,
  setUpdateLeavePolicyData,
}) => {
  const [leavePolicyLoading, setLeavePolicyLoading] = useState(false);
  const [leaveTypeList, setLeaveTypeList] = useState([null]);
  const [employeeTypeList, setEmployeeLeaveTypeList] = useState([null]);
  const { Axios } = useAxios();

  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );

  // Initial Policy values
  const initialValues = !!updateLeavePolicyData
    ? {
        leave_credit: updateLeavePolicyData?.leave_credit || "",
        employment_type_id:
          {
            value: updateLeavePolicyData?.employment_type?.id,
            label: updateLeavePolicyData?.employment_type?.name,
          } || "",
        leave_type_id:
          {
            value: updateLeavePolicyData?.leave_type?.id,
            label: updateLeavePolicyData?.leave_type?.name,
          } || "",
        frequency: "monthly",
      }
    : {
        leave_credit: "",
        employment_type_id: "",
        leave_type_id: "",
        frequency: "monthly",
      };

  //function to get set leave policy data and send to the api
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues,

    validationSchema: LeavePolicyValidation, // Validation schema
    onSubmit: async (values) => {
      setLeavePolicyLoading(true);

      // Triming values
      const payload = trimmedValues({
        leave_credit: parseInt(values[`leave_credit`]),
        employment_type_id: values[`employment_type_id`].value,
        leave_type_id: values[`leave_type_id`].value,
        frequency: "monthly",
      });
      try {
        const res = !!updateLeavePolicyData
          ? await Axios.put(
              `leave-ratio/update/${updateLeavePolicyData?.id}`,
              payload
            )
          : await Axios.post("leave-ratio/create", payload);
        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(
            res?.data?.message || "New Leave policy added successfully"
          );
          resetForm();
          closeModal();
          setUpdateLeavePolicyData(null);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 422
        ) {
          const apiErrors = error.response.data.errors; //storing error if any error comes from api
          const errorObject = {};
          Object.keys(apiErrors|"").forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLeavePolicyLoading(false);
      }
    },
  });

  const getLeaveTypeList = async () => {
    try {
      const res = await Axios.get("leave-type/list");

      const newData = res?.data?.data?.map((el) => ({
        value: el.id,
        label: el.name,
      }));

      setLeaveTypeList(newData);
    } catch (e) {
      console.log("Error Unable to fetch LeaveTypeList");
    }
  };

  const getEmpTypeList = async () => {
    try {
      const res = await Axios.get("employment-type/list");
      const newData = res?.data?.data?.map((el) => ({
        value: el.id,
        label: el.name,
      }));

      setEmployeeLeaveTypeList(newData);
    } catch (e) {
      console.log("Error Unable to fetch LeaveTypeList");
    }
  };

  const hanldeResetForm = () => {
    setUpdateLeavePolicyData(null);
    !!updateLeavePolicyData ? closeModal() : resetForm();
  };

  useEffect(() => {
    getLeaveTypeList();
    getEmpTypeList();
  }, []);
  return (
    <Fragment>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isLeavePolicyModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isLeavePolicyModalOpen}>
          <Box className="modalContainer md hvh-70">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  {!!updateLeavePolicyData
                    ? "Update Leave Policy"
                    : "Set Leave Policy"}
                </Typography>
                <Typography
                  component="p"
                  className="modal-subtitle"
                ></Typography>
              </Box>
              <IconButton aria-label="close" color="error" onClick={closeModal}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={12} md={6}>
                  <FormGroup size="small">
                    <InputLabel className="fixlabel">Leave Type</InputLabel>
                    <FormControl size="small">
                      <Select
                        value={values.leave_type_id}
                        placeholder="Leave Type"
                        name="leave_type_id"
                        options={leaveTypeList}
                        onChange={(selectedOptions) => {
                          setFieldValue("leave_type_id", selectedOptions);
                        }}
                        className="basic-multi-select selectTag w-100"
                        classNamePrefix="select"
                      />
                      {errors.leave_type_id && touched.leave_type_id ? (
                        <Typography component="span" className="error-msg">
                          {errors.leave_type_id}
                        </Typography>
                      ) : null}
                    </FormControl>
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormGroup size="small">
                    <InputLabel className="fixlabel">
                      Employment Type
                    </InputLabel>
                    <FormControl size="small">
                      <Select
                        value={values.employment_type_id}
                        placeholder="Employment Type"
                        name="employment_type_id"
                        options={employeeTypeList}
                        onChange={(selectedOptions) => {
                         
                          setFieldValue("employment_type_id", selectedOptions);
                        }}
                        className="basic-multi-select selectTag w-100"
                        classNamePrefix="select"
                      />
                      {errors.employment_type_id &&
                      touched.employment_type_id ? (
                        <Typography component="span" className="error-msg">
                          {errors.employment_type_id}
                        </Typography>
                      ) : null}
                    </FormControl>
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">
                      Leave per month
                    </InputLabel>
                    <TextField
                      name="leave_credit"
                      value={values.leave_credit}
                      onChange={handleChange}
                      placeholder="EX - 1"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.leave_credit && touched.leave_credit ? (
                      <Typography component="span" className="error-msg">
                        {errors.leave_credit}
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
                  loading={leavePolicyLoading}
                >
                  {!!updateLeavePolicyData ? "Update" : "Submit"}
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  className="text-capitalize"
                  onClick={hanldeResetForm}
                >
                  {!!updateLeavePolicyData ? "Cancel" : "Reset Form"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
};
export default LeavePolicyModal;
