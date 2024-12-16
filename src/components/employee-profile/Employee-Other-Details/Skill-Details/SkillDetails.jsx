import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
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
import AddSkill from "./AddSkill";
import moment from "moment";
import EditSkill from "./EditSkill";
import DeleteSkill from "./DeleteSkill";

const SkillDetails = ({ employeeDetails, getEmployeeDetails }) => {
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isEditOpen, setIsEditOpen] = useState("");
  const [editSkillData, setEditSkillData] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteSkillData, setDeleteSkillData] = useState("");
  const openAddSkill = () => {
    setIsAddOpen(true);
  };
  const closeAddSkill = () => {
    setIsAddOpen(false);
  };
  const openEditSkill = (data) => {
    setIsEditOpen(true);
    setEditSkillData(data);
  };
  const closeEditSkill = () => {
    setIsEditOpen(false);
  };
  const openDeleteSkill = (data) => {
    setIsDeleteOpen(true);
    setDeleteSkillData(data);
  };
  const closeDeleteSkill = () => {
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
          Skill Set Details
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" justifyContent="end" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className="cardHeaderBtn"
            startIcon={<AddIcon />}
            onClick={openAddSkill}
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
                  <TableCell width={"20%"} align="left">
                    Skill Name
                  </TableCell>
                  <TableCell width={"20%"} align="left">
                    Skill Type
                  </TableCell>
                  <TableCell width={"20%"} align="center">
                    Skill Level
                  </TableCell>
                  <TableCell width={"20%"} align="center">
                    Effective Date
                  </TableCell>
                  <TableCell width={"20%"} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              {(employeeDetails?.skills||[]).length > 0 ? (
                employeeDetails.skills.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{data?.name || "N/A"}</TableCell>
                    <TableCell align="left">{data?.type || "N/A"}</TableCell>
                    <TableCell align="center">{data?.level || "N/A"}</TableCell>
                    <TableCell align="center">
                      {data.effective_date
                        ? moment(data.effective_date).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => openEditSkill(data)}
                      >
                        <ModeEditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => openDeleteSkill(data)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    {"No skill has been added"}
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {isAddOpen && (
        <AddSkill
          isAddOpen={isAddOpen}
          closeAddSkill={closeAddSkill}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isEditOpen && (
        <EditSkill
          isEditOpen={isEditOpen}
          closeEditSkill={closeEditSkill}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          editSkillData={editSkillData}
        />
      )}
      {isDeleteOpen && (
        <DeleteSkill
          isDeleteOpen={isDeleteOpen}
          closeDeleteSkill={closeDeleteSkill}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          deleteSkillData={deleteSkillData}
        />
      )}
    </Box>
  );
};

export default SkillDetails;
