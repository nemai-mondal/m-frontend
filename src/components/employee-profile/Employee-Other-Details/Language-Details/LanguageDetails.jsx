import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddLanguage from "./AddLanguage";
import EditLanguage from "./EditLanguage";
import DeleteLanguage from "./DeleteLanguage";
const LanguageDetails = ({ employeeDetails, getEmployeeDetails }) => {
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isEditOpen, setIsEditOpen] = useState("");
  const [editLanguageData, setEditLanguageData] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteLanguageData, setDeleteLanguageData] = useState("");
  const openAddLanguage = () => {
    setIsAddOpen(true);
  };
  const closeAddLanguage = () => {
    setIsAddOpen(false);
  };
  const openEditLanguage = (data) => {
    setIsEditOpen(true);
    setEditLanguageData(data);
  };
  const closeEditLanguage = () => {
    setIsEditOpen(false);
  };
  const openDeleteLanguage = (data) => {
    setIsDeleteOpen(true);
    setDeleteLanguageData(data);
  };
  const closeDeleteLanguage = () => {
    setIsDeleteOpen(false);
  };
  return (
    <Box>
      <Accordion
        sx={{
          mt: 2,
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Language Details
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" justifyContent="end" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className="cardHeaderBtn"
            startIcon={<AddIcon />}
            onClick={openAddLanguage}
          >
            Add
          </Button>
          </Stack>
          <TableContainer
            sx={{ maxHeight: 350, mt: 2 }}
            className="table-striped scroll-y"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell width={150} align="left">
                    Language Name
                  </TableCell>
                  <TableCell width={150} align="left">
                    Mother Tongue
                  </TableCell>
                  <TableCell width={150} align="center">
                    Speak
                  </TableCell>
                  <TableCell width={150} align="center">
                    Write
                  </TableCell>
                  <TableCell width={150} align="center">
                    Read
                  </TableCell>
                  <TableCell width={150} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              {(employeeDetails?.languages||[]).length > 0 ? (
                employeeDetails.languages.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{data.name}</TableCell>
                    <TableCell align="left">
                      {data.native === 1
                        ? "Yes"
                        : data.native === 0
                        ? "No"
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {data.speak === 1
                        ? "Yes"
                        : data.speak === 0
                        ? "No"
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {data.write === 1
                        ? "Yes"
                        : data.write === 0
                        ? "No"
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {data.read === 1 ? "Yes" : data.read === 0 ? "No" : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => {
                          openEditLanguage(data);
                        }}
                      >
                        <ModeEditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          openDeleteLanguage(data);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    {"No language has been added"}
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {isAddOpen && (
        <AddLanguage
          isAddOpen={isAddOpen}
          closeAddLanguage={closeAddLanguage}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isEditOpen && (
        <EditLanguage
          isEditOpen={isEditOpen}
          closeEditLanguage={closeEditLanguage}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          editLanguageData={editLanguageData}
        />
      )}
      {isDeleteOpen && (
        <DeleteLanguage
          isDeleteOpen={isDeleteOpen}
          closeDeleteLanguage={closeDeleteLanguage}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          deleteLanguageData={deleteLanguageData}
        />
      )}
    </Box>
  );
};

export default LanguageDetails;
