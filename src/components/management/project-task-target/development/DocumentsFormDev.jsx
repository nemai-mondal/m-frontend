import React, { useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  Button,
  Typography,
  IconButton,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImagePath } from "@/ImagePath";
import { useFormik } from "formik";
import { ProjectDocumentDevSchema } from "@/validations/ProjectDocumentDevSchema";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import DeleteDocument from "./DeleteDocument";
import { Link } from "react-router-dom";
const DocumentsFormDev = ({ projectData, getProjectDetail }) => {
  const { Axios } = useAxios();
  const [isDeleteOpen, setIsDeleteOpen] = useState("");

  const [deleteDocumentData, setDeleteDocumentData] = useState("");

  const openDeleteDocument = (data) => {
    setIsDeleteOpen(true);
    setDeleteDocumentData(data);
  };
  const closeDeleteDocument = () => {
    setIsDeleteOpen(false);
  };
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    touched,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      file: "",
      description: "",
    },
    validationSchema: ProjectDocumentDevSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", values.description.trim() || "");
      formData.append("file", values.file || "");
      formData.append("name", values.name.trim() || "");
      formData.append("step", 3);
      formData.append("project_id", projectData.id);
      formData.append("key", "create");
      try {
        const res = await Axios.post("project/create", formData);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(res.data?.message || "Document Added Successfully");
          if (projectData.id) {
            getProjectDetail(projectData.id);
          }
          resetForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const apiErrors = error.response.data.errors;
          const errorObject = {};
          Object.keys(apiErrors || {}).forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          setErrors(errorObject);
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <React.Fragment>
      <Box sx={{ p: 3 }}>
        <Typography component={"h2"} className="heading-5">
          Project Documents
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4} md={3} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Document Name<span>*</span>
              </InputLabel>
              <TextField
                variant="outlined"
                id="document-name"
                placeholder="Enter Document Name"
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
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Attachment{" "}
                <span>*</span>
                <small>(PDF, DOC, Docx, xls , xlsx - Maximum file size: 25 MB)</small>
              </InputLabel>
              <Box component="div" className="choosefile">
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  id="upload-decument"
                >
                  {values?.file?.name
                    ? values.file.name
                    : values?.file
                    ? values.file
                    : "Choose File..."}
                </Typography>
                <input
                  type="file"
                  name="file"
                  id="file-upload"
                  onChange={(e) => {
                    setFieldValue("file", e.target.files[0]);
                    e.target.value = null;
                  }}
                  onBlur={handleBlur}
                />
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  className="choosefile-button"
                >
                  Browse
                </Typography>
                {errors.file && touched.file ? (
                  <Typography component="span" className="error-msg">
                    {errors.file}
                  </Typography>
                ) : null}
              </Box>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Document Description</InputLabel>
              <TextField
                variant="outlined"
                id="uploadedBy"
                placeholder="Enter Document Description"
                size="small"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.description && touched.description ? (
                <Typography component="span" className="error-msg">
                  {errors.description}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
        </Grid>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          sx={{ mt: 4 }}
        >
          <LoadingButton
            variant="contained"
            color="primary"
            className="text-capitalize"
            onClick={handleSubmit}
            loading={loading}
          >
            Upload
          </LoadingButton>
          <Link to={"/task/dev/list"}>
            <Button
              variant="outlined"
              color="primary"
              className="text-capitalize"
            >
              Cancel
            </Button>
          </Link>
        </Stack>

          <TableContainer  className="table-striped">
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 1400 }} className="table-responsive scroll-x">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{width:200}}>Document Name</TableCell>
                  <TableCell align="left" sx={{width:200}}>Uploaded By</TableCell>
                  <TableCell align="left" sx={{width:100}}>Uploaded Date</TableCell>
                  <TableCell align="left" sx={{width:120}}>Attachment</TableCell>
                  <TableCell align="left" sx={{width:200}}>Description</TableCell>
                  <TableCell sx={{width:100}} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(projectData?.documents||[])?.length > 0 ? (
                  projectData.documents.map((document, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {document?.name || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {document.user
                          ? `${
                              document?.user?.honorific
                                ? `${document?.user?.honorific} `
                                : ""
                            }${document?.user?.first_name || ""} ${
                              document?.user?.middle_name
                                ? `${document?.user.middle_name} `
                                : ""
                            }${document?.user?.last_name || ""}- ${
                              document.user?.employee_id || ""
                            }`
                          : "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {document.created_at
                          ? moment(document.created_at).format("DD-MM-YYYY")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="left" valign="middle">
                        <Stack direction={"row"} alignItems={"center"}>
                          <img
                            src={
                              ImagePath[
                                document?.document_url
                                  ?.split("/")
                                  ?.pop()
                                  ?.split(".")
                                  ?.pop() === "xlsx" ||
                                document?.document_url
                                  ?.split("/")
                                  ?.pop()
                                  ?.split(".")
                                  ?.pop()
                                  ?.toLowerCase() === "xls"
                                  ? "xlsxIcon"
                                  : document?.document_url
                                      ?.split("/")
                                      ?.pop()
                                      ?.split(".")
                                      ?.pop() === "doc" ||
                                    document?.document_url
                                      ?.split("/")
                                      ?.pop()
                                      ?.split(".")
                                      ?.pop()
                                      ?.toLowerCase() === "docx"
                                  ? "docIcon"
                                  : "pdfIcon"
                              ]
                            }
                            alt="resume"
                            style={{ height: 20, marginRight: 8 }}
                          />
                          <Typography
                            component={"p"}
                            style={{
                              maxWidth: 140,
                              fontSize: 13,
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                            sx={{ mx: 1 }}
                          >
                            {document?.document_url?.split("/")?.pop() || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {document.description || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {document.document_url ? (
                          <a
                            href={document.document_url}
                            download={document?.document_url?.split("/")?.pop()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconButton aria-label="Download">
                              <DownloadIcon fontSize="small" color="primary" />
                            </IconButton>
                          </a>
                        ) : (
                          ""
                        )}

                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            openDeleteDocument(document);
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableCell align="center" colSpan={6}>
                    {"No Document Found"}
                  </TableCell>
                )}
              </TableBody>
            </Table>
          </TableContainer>
       
      </Box>
      {isDeleteOpen && (
        <DeleteDocument
          isDeleteOpen={isDeleteOpen}
          closeDeleteDocument={closeDeleteDocument}
          getProjectDetail={getProjectDetail}
          deleteDocumentData={deleteDocumentData}
        />
      )}
    </React.Fragment>
  );
};

export default DocumentsFormDev;
