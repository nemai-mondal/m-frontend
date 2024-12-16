import { Fragment, useState, useRef, useEffect, useContext } from "react";
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
  Tooltip,
  InputLabel,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { useAxios } from "@/contexts/AxiosProvider";
import { mapValues } from "lodash";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { leaveType as LeaveTypeValidation } from "../../../validations/LeavePolicySchema";
import { useFormik } from "formik";
import { AuthContext } from "@/contexts/AuthProvider";
const LeaveTypeModal = ({ closeModal, isLeaveTypeModalOpen }) => {
  const { hasPermission } = useContext(AuthContext);
  const [leavePolicyLoading, setLeavePolicyLoading] = useState(false);
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [updateLeaveTypeData, setLeaveTypeUpdateData] = useState(null);

  const { Axios } = useAxios();
  const editorRef = useRef();
  // Trim all string values in the 'values' object
  const trimmedValues = (obj) =>
    mapValues(obj, (value) =>
      typeof value === "string" ? value.trim() : value
    );

  const getContent = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
    return "";
  };

  const setContent = (val = "") => {
    if (editorRef.current) {
      editorRef.current.setContent(val);
    }
  };

  //function to get Leave type data and send to the api
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
    initialValues: {
      name: "",
      comment: "",
      abbreviation: "",
    },

    validationSchema: LeaveTypeValidation, // Validation schema
    onSubmit: async (values) => {
      setLeavePolicyLoading(true);
      // Triming values
      const editorValue = getContent();
      setFieldValue(`comment`, editorValue);

      const payload = trimmedValues({
        name: values[`name`] || "",
        comment: values[`comment`] || editorValue || "",
        abbreviation: values[`abbreviation`] || "",
      });

      try {
        const res = !!updateLeaveTypeData
          ? await Axios.put(
              `leave-type/update/${updateLeaveTypeData.id}`,
              payload
            )
          : await Axios.post("leave-type/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(
            res?.data?.message || "New Leave policy added successfully"
          );
          getLeaveTypeList();
          handleResetForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors; //storing error if any error comes from api
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
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

  const handleResetForm = () => {
    !!updateLeaveTypeData && setLeaveTypeUpdateData(null);
    resetForm();
    setContent();
    getLeaveTypeList();
  };

  const getLeaveTypeList = async () => {
    try {
      const res = await Axios.get("leave-type/list");

      const newData = res?.data?.data;
      setLeaveTypeList(newData);
    } catch (e) {
      console.log("Error Unable to fetch LeaveTypeList");
    }
  };

  const updateLeaveType = (el) => {
    setLeaveTypeUpdateData(el);
    setFieldValue(`comment`, el?.comment || "");
    setFieldValue(`abbreviation`, el?.abbreviation || "");
    setFieldValue(`name`, el.name || "");
    setContent(el?.comment || "");
  };

  // function used to remove the HTML tags
  function removeTags(str) {
    if (str === null || str === "" || str ===undefined) return false;
    else str = str?.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  useEffect(() => {
    getLeaveTypeList();
  }, []);

  return (
    <Fragment>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isLeaveTypeModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isLeaveTypeModalOpen}>
          <Box
            className="modalContainer md hvh-70"
            style={{ overflow: "hidden" }}
          >
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
                  {!!updateLeaveTypeData
                    ? "Update Leave Type"
                    : "Add New Leave Type"}
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
            <Box
              className="modalBody scroll-y  hvh-70"
              style={{ overflow: "hidden", padding: "10px 25px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Leave Name<span>*</span></InputLabel>
                    <TextField
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Enter Leave Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name ? (
                      <Typography component="span" className="error-msg">
                        {errors.name}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Abbreviation<span>*</span></InputLabel>
                    <TextField
                      name="abbreviation"
                      value={values.abbreviation}
                      onChange={handleChange}
                      placeholder="Enter Abbreviation"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onBlur={handleBlur}
                    />
                    {errors.abbreviation && touched.abbreviation ? (
                      <Typography component="span" className="error-msg">
                        {errors.abbreviation}
                      </Typography>
                    ) : null}
                  </FormGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormGroup>
                    <InputLabel className="fixlabel">Description<span>*</span></InputLabel>
                    <Editor
                      tinymceScriptSrc="/tinymce/tinymce.min.js"
                      selector="textarea#codesample"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      initialValue=""
                      init={{
                        height: 200,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                          "save",
                          "code",
                          "editimage",
                        ],
                        toolbar:
                          "bold italic underline strikethrough undo redo link image bullist numlist blockquote code save removeformat help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        branding: false,
                      }}
                    />
                    {errors.comment && touched.comment ? (
                      <Typography component="span" className="error-msg">
                        {errors.comment}
                      </Typography>
                    ) : null}
                    {/* {errors[`comment`] && touched[` `] ? (
                      <Typography component="span" className="error-msg">
                        {errors[`comment`]}
                      </Typography>
                    ) : null} */}
                  </FormGroup>
                </Grid>
              </Grid>

              <Box className="modalFooter" style={{ padding: "25px 0 60px" }}>
                <Stack spacing={2} direction="row" justifyContent="flex-start">
                  <LoadingButton
                    variant="contained"
                    className="text-capitalize"
                    color="primary"
                    onClick={handleSubmit}
                    loading={leavePolicyLoading}
                  >
                    {!!updateLeaveTypeData ? "Update" : "Submit"}
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="text-capitalize"
                    onClick={handleResetForm}
                  >
                    {!!updateLeaveTypeData ? "Cancel" : "Reset Form"}
                  </Button>
                </Stack>
                <Stack my={2} direction="row" sx={{ flexWrap: "wrap" }} gap={3}>
                  {leaveTypeList.length >= 1 &&
                    leaveTypeList.map((el) => (
                      <Stack
                        direction="row"
                        gap={1}
                        sx={{
                          background: "#E9E9E9",
                          p: 1,
                          alignItems: "center",
                          borderRadius: 100,
                          color: "#4F5561",
                          paddingRight: "15px",
                          paddingLeft: "15px",
                        }}
                        key={el.id}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#4f5561",
                            fontWeight: 400,
                          }}
                        >
                          {el?.name || "N/A"}{" "}
                        </p>
                        <Tooltip title={removeTags(el?.comment)}>
                          <InfoOutlinedIcon
                            sx={{ cursor: "pointer", fontSize: "16px" }}
                          />
                        </Tooltip>
                        {hasPermission("leave_type_update") ? (
                          <Tooltip title={"Edit"}>
                            <EditIcon
                              sx={{ cursor: "pointer", fontSize: "16px" }}
                              onClick={() => updateLeaveType(el)}
                            />
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </Stack>
                    ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
};
export default LeaveTypeModal;
