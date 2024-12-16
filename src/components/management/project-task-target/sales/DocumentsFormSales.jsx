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
import { mapValues } from "lodash";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImagePath } from "@/ImagePath";
import { HrDocumentSchema as HrDocumentSchemaValidation } from "../../../../validations/HrDocumentSchema";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import moment from "moment";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import DeleteDocumentModal from "./DeleteDocumentModal";
import { Link } from "react-router-dom";

const DocumentsFormSales = ({ projectData, getProjectDetail, loading }) => {
  const [uploading, setUploading] = useState(false);
  const { Axios } = useAxios();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({});

  const handledeleteModalOpen = (data) => {
    setDeleteModalOpen(true);
    setDeleteModalData({ ...data, project_id: projectData?.id });
  };

  const closeDeleteModal = () => {
    if (projectData?.id) {
      getProjectDetail(projectData?.id);
    }
    setDeleteModalData({});
    setDeleteModalOpen(false);
  };

  // Trim all string values in the 'values' object

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
      description: "",
      file: "",
    },
    validationSchema: HrDocumentSchemaValidation, // Validation schema
    onSubmit: async (values) => {
      setUploading(true);

      const trimmedValues = mapValues(values, (value) =>
        typeof value === "string" ? value.trim() : value
      );

      try {
        const formData = new FormData();
        formData.append("name", trimmedValues.name);
        formData.append("step", "3");
        formData.append("description", trimmedValues.description);
        formData.append("project_id", projectData?.id);
        formData.append("file", values?.file?.name ? values.file : "");
        formData.append("key", "create");

        const res = await Axios.post("project/create", formData);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(res?.data?.message || "New File uploaded successfully");
          getProjectDetail(projectData?.id);
          resetForm();
        }
      } catch (error) {
        if (error?.response && error?.response?.status === 422) {
          const apiErrors = error?.response?.data?.errors; //storing error if any error comes from api
          const errorObject = {};
          Object.keys(apiErrors || "").forEach((key) => {
            errorObject[key] = apiErrors[key][0];
          });
          toast.error(error?.response?.data?.message || "Invalid Data");
          setErrors(errorObject);
        }
        if (error?.response && error?.response?.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setUploading(false);
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
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Document Name <span>*</span>
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
              {errors?.name && touched?.name ? (
                <Typography component="span" className="error-msg">
                  {errors?.name}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Document Description <span>*</span>
              </InputLabel>
              <TextField
                variant="outlined"
                id="uploadedBy"
                placeholder="Enter document description"
                size="small"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors?.description && touched?.description ? (
                <Typography component="span" className="error-msg">
                  {errors?.description}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Attachment<span>*</span>{" "}
                <small>
                  (DOC, Word, Docx, PDF, xlx, xlsx - Maximum file size: 25 MB)
                </small>
              </InputLabel>
              <Box component="div" className="choosefile">
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  id="upload-decument"
                >
                  {values?.file?.name || "Choose file..."}
                </Typography>
                <input
                  type="file"
                  name="file"
                  id="file-upload"
                  onChange={(e) => {
                    setFieldValue("file", e.target.files[0]);
                    e.target.value = null;
                  }}
                />
                <Typography
                  component="label"
                  htmlFor="file-upload"
                  className="choosefile-button"
                >
                  Browse
                </Typography>
              </Box>
              {errors.file && touched.file ? (
                <Typography component="span" className="error-msg">
                  {errors.file}
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
            className="text-capitalize"
            color="primary"
            onClick={handleSubmit}
            loading={uploading}
          >
            Submit
          </LoadingButton>
          <Link to="/task/sales/list">
            <Button
              variant="outlined"
              color="primary"
              className="text-capitalize"
              onClick={resetForm}
            >
              Cancel
            </Button>
          </Link>
        </Stack>

        <TableContainer sx={{ maxHeight: 350 }} className="table-striped">
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 1400 }}
            className="table-responsive scroll-x"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ width: 200 }}>
                  Document Name
                </TableCell>
                <TableCell align="left" sx={{ width: 200 }}>
                  Uploaded By
                </TableCell>
                <TableCell align="left" sx={{ width: 100 }}>
                  Uploaded Date
                </TableCell>
                <TableCell align="left" sx={{ width: 120 }}>
                  Attachment
                </TableCell>
                <TableCell align="left" sx={{ width: 200 }}>
                  Description
                </TableCell>
                <TableCell sx={{ width: 100 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowSkeleton rows={10} columns={5} />
              ) : projectData?.documents?.length >= 1 ? (
                projectData?.documents
                  ?.filter((el) => el?.document_url !== null)
                  ?.map((el) => (
                    <TableRow key={el?.id}>
                      <TableCell align="left">{el?.name || "N/A"}</TableCell>
                      <TableCell align="left">
                        {el?.added_by_name || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        {el?.created_at
                          ? moment(el?.created_at).format("DD-MM-YYYY")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="left" valign="middle">
                        <Stack direction={"row"} alignItems={"center"}>
                          <img
                            src={
                              ImagePath[
                                el?.document_url
                                  ?.split("/")
                                  ?.pop()
                                  ?.split(".")
                                  ?.pop() === "xlsx" ||
                                el?.document_url
                                  ?.split("/")
                                  ?.pop()
                                  ?.split(".")
                                  ?.pop()
                                  ?.toLowerCase() === "xls"
                                  ? "xlsxIcon"
                                  : el?.document_url
                                      ?.split("/")
                                      ?.pop()
                                      ?.split(".")
                                      ?.pop() === "doc" ||
                                    el?.document_url
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
                            {el?.document_url?.split("/")?.pop() || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {el?.description || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <a href={el?.document_url} target="_blank">
                          <IconButton aria-label="Download">
                            <DownloadIcon fontSize="small" color="primary" />
                          </IconButton>
                        </a>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handledeleteModalOpen(el)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Document has been added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isDeleteModalOpen && (
        <DeleteDocumentModal
          isDeleteModalOpen={isDeleteModalOpen}
          deleteModalData={deleteModalData}
          closeDeleteModal={closeDeleteModal}
        />
      )}
      {/*  = ({
  , */}
    </React.Fragment>
  );
};

export default DocumentsFormSales;
