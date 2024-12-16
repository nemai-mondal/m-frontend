/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddDocuments from "./AddDocuments";
import EditDocument from "./EditDocument";
import moment from "moment";
import DeleteDocument from "./DeleteDocument";

const EmployeeDocumentsForm = ({ employeeDetails, getEmployeeDetails }) => {
  const [mySelfDetails, setMySelfDetails] = useState([]);
  const [dependentDetails, setDependentDetails] = useState([]);

  const [isAddOpen, setIsAddOpen] = useState("");
  const [isEditOpen, setIsEditOpen] = useState("");
  const [editDocumentData, setEditDocumentData] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteDocumentData, setDeleteDocumentData] = useState("");
  const openAddDocument = () => {
    setIsAddOpen(true);
  };
  const closeAddDocument = () => {
    setIsAddOpen(false);
  };
  const openEditDocument = (data) => {
    setIsEditOpen(true);
    setEditDocumentData(data);
  };
  const closeEditDocument = () => {
    setIsEditOpen(false);
  };
  const openDeleteDocument = (data) => {
    setIsDeleteOpen(true);
    setDeleteDocumentData(data);
  };
  const closeDeleteDocument = () => {
    setIsDeleteOpen(false);
  };
  const separateAllDetails = () => {
    if ((employeeDetails?.employeedocument || []).length > 0) {
      let employeeDocuments = employeeDetails?.employeedocument?.filter(
        (data) => data.document?.employee_family_id === null
      );
      let dependentDocuments = employeeDetails?.employeedocument?.filter(
        (data) => data.document?.employee_family_id !== null
      );

      setMySelfDetails(employeeDocuments);
      setDependentDetails(dependentDocuments);
    }
  };
  useEffect(() => {
    separateAllDetails();
  }, []);
  return (
    <React.Fragment>
      <Box p={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="heading-5"
          alignItems={"center"}
          mb={3}
        >
          <Typography
            component="h2"
            className="heading-5"
            border={0}
            mb={0}
            pb={0}
          >
            Documents
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            className="text-capitalize"
            onClick={openAddDocument}
          >
            Add
          </Button>
        </Stack>

        <Typography component={"h6"} className="heading-3" border={0}>
          Employee
        </Typography>
        <TableContainer sx={{ maxHeight: 350 }} className="table-striped">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={"20%"} align="left">
                  Document Type
                </TableCell>
                <TableCell width={"20%"} align="left">
                  {" "}
                  Document No.
                </TableCell>
                <TableCell width={"15%"} align="left">
                  Expiry Date
                </TableCell>
                <TableCell width={"15%"} align="left">
                  Remark
                </TableCell>
                <TableCell width={"10%"} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(mySelfDetails || []).length > 0 ? (
                mySelfDetails.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {data.document?.document_type || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {" "}
                      {data.document?.document_no || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.document?.expiry_date
                        ? moment(data.document.expiry_date).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.document?.remarks || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => {
                          openEditDocument(data);
                        }}
                      >
                        <ModeEditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          openDeleteDocument(data);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    {"No document has been added"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography component={"h6"} className="heading-3" border={0} mt={3}>
          Dependent
        </Typography>
        <TableContainer sx={{ maxHeight: 350 }} className="table-striped">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={"20%"} align="left">
                  Document Type
                </TableCell>
                <TableCell width={"20%"} align="left">
                  {" "}
                  Document No.
                </TableCell>
                <TableCell width={"15%"} align="left">
                  Expiry Date
                </TableCell>
                <TableCell width={"15%"} align="left">
                  Remark
                </TableCell>
                <TableCell width={"10%"} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(dependentDetails || []).length > 0 ? (
                dependentDetails.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {data.document?.document_type || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {" "}
                      {data.document?.document_no || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.document?.expiry_date
                        ? moment(data.document.expiry_date).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.document?.remarks || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="Edit">
                        <ModeEditIcon
                          fontSize="small"
                          onClick={() => {
                            openEditDocument(data);
                          }}
                        />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          openDeleteDocument(data);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    {"No document has been added"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isAddOpen && (
        <AddDocuments
          isAddOpen={isAddOpen}
          closeAddDocument={closeAddDocument}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isEditOpen && (
        <EditDocument
          isEditOpen={isEditOpen}
          closeEditDocument={closeEditDocument}
          editDocumentData={editDocumentData}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isDeleteOpen && (
        <DeleteDocument
          isDeleteOpen={isDeleteOpen}
          closeDeleteDocument={closeDeleteDocument}
          deleteDocumentData={deleteDocumentData}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeDocumentsForm;
