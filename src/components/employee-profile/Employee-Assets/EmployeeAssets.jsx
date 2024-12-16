/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
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
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddAssets from "./AddAssets";
import EditAssets from "./EditAssets";
import moment from "moment";
import DeleteAssets from "./DeleteAssets";

const EmployeeAssets = ({ employeeDetails, getEmployeeDetails }) => {
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isEditOpen, setIsEditOpen] = useState("");
  const [editAssetsData, setEditAssetsData] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteAssetsData, setDeleteAssetsData] = useState("");
  const openAddAssets = ({ employeeDetails, getEmployeeDetails }) => {
    setIsAddOpen(true);
  };
  const closeAddAssets = () => {
    setIsAddOpen(false);
  };
  const openEditAssets = (data) => {
    setIsEditOpen(true);
    setEditAssetsData(data);
  };
  const closeEditAssets = () => {
    setIsEditOpen(false);
  };
  const openDeleteAssets = (data) => {
    setIsDeleteOpen(true);
    setDeleteAssetsData(data);
  };
  const closeDeleteAssets = () => {
    setIsDeleteOpen(false);
  };
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
            Assets
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            className="text-capitalize"
            onClick={openAddAssets}
          >
            Add
          </Button>
        </Stack>
        <TableContainer sx={{ maxHeight: 350 }} className="table-striped">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Sr.No</TableCell>
                <TableCell align="left">Asset Type</TableCell>
                <TableCell align="left">Asset Name</TableCell>
                <TableCell align="left">Assign Date</TableCell>
                <TableCell align="left">Valid Till</TableCell>
                <TableCell align="left">Asset Status</TableCell>
                <TableCell width={"20%"} align="left">
                  Remark
                </TableCell>
                <TableCell width={"10%"} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(employeeDetails?.assets||[]).length > 0 ? (
                employeeDetails.assets.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{data?.sr_no || "N/A"}</TableCell>
                    <TableCell align="left">
                      {data?.assets_type || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data?.assets_name || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.assign_date
                        ? moment(data.assign_date).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data.valid_till
                        ? moment(data.valid_till).format("DD-MM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {data?.assets_status || "N/A"}
                    </TableCell>
                    <TableCell align="left">{data?.remarks || "N/A"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="Edit"
                        onClick={() => {
                          openEditAssets(data);
                        }}
                      >
                        <ModeEditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          openDeleteAssets(data);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                    {"No assets has been added"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isAddOpen && (
        <AddAssets
          isAddOpen={isAddOpen}
          closeAddAssets={closeAddAssets}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isEditOpen && (
        <EditAssets
          isEditOpen={isEditOpen}
          closeEditAssets={closeEditAssets}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          editAssetsData={editAssetsData}
        />
      )}
      {isDeleteOpen && (
        <DeleteAssets
          isDeleteOpen={isDeleteOpen}
          closeDeleteAssets={closeDeleteAssets}
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
          deleteAssetsData={deleteAssetsData}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeAssets;
