import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Fade,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useCallback, useEffect, useState } from "react";
import { ImagePath } from "@/ImagePath";
import PersonIcon from "@mui/icons-material/Person";
import Select from "react-select";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import moment from "moment";
import { pluralize } from "@/utils";
import { LeaveApprovalSchema } from "@/validations/LeaveApprovalSchema";
import { toast } from "react-toastify";

export default function LeaveDetailModal({
  open,
  detail,
  onClosed,
  onComplete,
}) {
  const { Axios } = useAxios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to store employees
  const [employees, setEmployees] = useState([]);
  // State to store application
  const [application, setApplication] = useState({});
  // State to store action status
  const [status, setStatus] = useState("");
  // Function to fetch employees from the server
  const getEmployees = useCallback(async () => {
    try {
      // Make the API request to fetch employees
      const res = await Axios.get("/user/list");

      // Update date with the fetched employees, or set to an empty array if undefined
      setEmployees(
        (res.data?.data || []).map((m) => {
          return {
            value: m.email,
            label: `${m.honorific} ${m.first_name}${
              m.middle_name ? " " + m.middle_name : ""
            }${m.last_name ? " " + m.last_name : ""} - ${m.employee_id}`,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching leave types", error);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    onClosed(false);
  };

  useEffect(() => {
    if (open) {
      setIsModalOpen(open);
    }
  }, [open]);

  useEffect(() => {
    // Set the employee to the detail item or an empty object
    setApplication(detail?.item || {});
    setStatus(detail?.type || "");
    // Cleanup function
    return () => {
      // Clean up the employee state before unmounting
      setApplication({});
      setStatus("");
    };
  }, [detail]);

  // Use useEffect to fetch leave types when the component mounts
  useEffect(() => {
    getEmployees();
  }, []); // Dependency array ensures that the effect runs only on mount
  const onSubmitReview = async (values) => {
    try {
      const payload = {
        application_id: application.id,
        action:
          status === "approve"
            ? "approved"
            : status === "reject"
            ? "rejected"
            : "canceled",
        remarks: values.remarks,
        email_ids: values.email_ids.map((m) => m.value),
      };

      const res = await Axios.post("leave-application/review", payload);

      if (res.status === 201) {
        toast.success(
          `Successfully Leave ${
            status === "approve"
              ? "Approved"
              : status === "reject"
              ? "Rejected"
              : "Canceled"
          }.`
        );

        resetForm();
        closeModal();
        onComplete(status);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to connect to the server.");
      }
    }
  };

  const {
    values,
    errors,
    setFieldValue,
    handleSubmit,
    handleChange,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: {
      remarks: "",
      email_ids: [],
    },
    validationSchema: LeaveApprovalSchema,
    onSubmit: onSubmitReview,
  });
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isModalOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isModalOpen}>
        <Box
          className="modalContainer md"
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Stack direction="row" className="userList">
              {application?.user?.profile_image ? (
                <Avatar
                  alt={application?.user?.first_name}
                  src={application?.user?.profile_image}
                  className="avtar"
                />
              ) : (
                <Avatar className="avtar">
                  <PersonIcon />
                </Avatar>
              )}

              <Box>
                <Typography component="h6" className="avtarName">
                  {application?.user &&
                    `${application.user.honorific} ${
                      application.user.first_name
                    }${
                      application.user.middle_name
                        ? " " + application.user.middle_name
                        : ""
                    }${
                      application.user.last_name
                        ? " " + application.user.last_name
                        : ""
                    }`}
                </Typography>
                <Typography component="p" className="smallText">
                  {application?.designation?.name || "Not Available"}
                </Typography>
              </Box>
            </Stack>
            <IconButton aria-label="close" color="error" onClick={closeModal}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="scroll-y  hvh-50">
            <Box className="modalBody">
              <Stack
                className="userList"
                direction="row"
                spacing={5}
                justifyContent="space-between"
              >
                <Box>
                  <Typography component="p" className="smallText">
                    Employee ID
                  </Typography>
                  <Typography component="h6" className="avtarName">
                    {application?.user && application.user.employee_id}
                  </Typography>
                </Box>
                <Box>
                  <Typography component="p" className="smallText">
                    From
                  </Typography>
                  <Typography component="h6" className="avtarName">
                    {moment(application.leave_from).format("DD-MMM-YYYY")}
                  </Typography>
                </Box>
                <Box>
                  <Typography component="p" className="smallText">
                    Till
                  </Typography>
                  <Typography component="h6" className="avtarName">
                    {moment(application.leave_to).format("DD-MMM-YYYY")}
                  </Typography>
                </Box>
                <Box>
                  <Typography component="p" className="smallText">
                    Leave Type
                  </Typography>
                  <Typography component="h6" className="avtarName">
                    {application?.leave_type?.name || "Not Available"}
                  </Typography>
                </Box>
                <Box>
                  <Typography component="p" className="smallText">
                    Days Counts
                  </Typography>
                  <Typography component="h6" className="avtarName">
                    {application.total_days +
                      " " +
                      pluralize(application.total_days, "day")}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                component="h6"
                className="heading-3"
                sx={{ mt: 4, mb: "4px" }}
              >
                Remarks
              </Typography>
              <Typography component="p" className="text">
                {application?.leave_review?.[
                  application?.leave_review?.length - 1
                ]?.remarks || "Not Available"}
              </Typography>

              <Typography
                component="h6"
                className="heading-3"
                sx={{ mt: 4, mb: "4px" }}
              >
                Attachment
              </Typography>

              {application.attachment ? (
                <Button
                  variant="outlined"
                  className="text-capitalize download-btn"
                  sx={{ mb: 3 }}
                >
                  <img src={ImagePath.pdfIcon} alt="" /> Download
                </Button>
              ) : (
                <Typography component="p" className="text" sx={{ mb: 3 }}>
                  No Attachment
                </Typography>
              )}
              {/* <Typography
                component="h6"
                className="heading-3"
                sx={{ mt: 0, mb: 2 }}
              >
                Team members on Leave
              </Typography>
              <Stack direction="row" spacing={2}>
                <Avatar
                  alt="Remy Sharp"
                  src={ImagePath.Avtar}
                  sx={{ width: 24, height: 24 }}
                />
              </Stack> */}
            </Box>
            {application?.leave_status !== "rejected" && (
              <Box component="div" className="employee-panel" p={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormGroup>
                      <FormLabel sx={{ mb: 0 }}>Remarks</FormLabel>
                      <TextField
                        placeholder="Description"
                        variant="outlined"
                        size="small"
                        className="remarks-input"
                        sx={{ marginTop: "1px" }}
                        onChange={handleChange}
                        name="remarks"
                        value={values.remarks}
                      />
                      {errors.remarks && (
                        <FormHelperText className="error-msg">
                          {errors.remarks}
                        </FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <FormLabel sx={{ mb: 2 }}>Email Notification To</FormLabel>
                    <Select
                      isMulti
                      value={values.email_ids}
                      options={employees}
                      className="basic-multi-select selectTag"
                      classNamePrefix="select"
                      menuPlacement="top"
                      onChange={(values) => setFieldValue("email_ids", values)}
                      placeholder="Search Employee"
                      maxMenuHeight={300}
                    />
                    {errors.email_ids && (
                      <FormHelperText className="error-msg">
                        {errors.email_ids}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          <Box className="modalFooter">
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack className="userList">
                <Typography
                  component="h6"
                  className="heading-3"
                  sx={{ mt: 0, mb: 1 }}
                >
                  Leave Applied On
                </Typography>
                <Typography component="h6" className="avtarName">
                  {moment(application.created_at).format("DD-MMM-YYYY")}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                {application.leave_status === "pending" &&
                  status === "approve" && (
                    <Button
                      color="success"
                      variant="contained"
                      className="success-btn text-capitalize fs-12 fw-400"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Approve
                    </Button>
                  )}
                {application.leave_status === "pending" &&
                  status === "reject" && (
                    <Button
                      color="error"
                      variant="outlined"
                      className="text-capitalize fs-12 fw-400"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Reject
                    </Button>
                  )}
                {application.leave_status !== "pending" && (
                  <Button
                    color="error"
                    variant="outlined"
                    className="text-capitalize fs-12 fw-400"
                    type="button"
                    disabled={
                      isSubmitting ||
                      application.leave_status === "canceled" ||
                      moment(application.leave_from, "YYYY-MM-DD").isBefore(
                        moment(),
                        "day"
                      )
                    }
                    onClick={(event) => {
                      setStatus("cancel");
                      handleSubmit(event);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
