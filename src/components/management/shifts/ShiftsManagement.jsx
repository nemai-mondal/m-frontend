import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";

import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
} from "@/redux/ShiftSlice";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import AddIcon from "@mui/icons-material/Add";
import "react-international-phone/style.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import AddShift from "./AddShift";
import EditShift from "./EditShift";
import DeleteShift from "./DeleteShift";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
const ShiftTimeManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  //getting data from redux store
  const { data, meta, params, isLoading } = useSelector((state) => state.shift);
  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editShiftData, setEditShiftData] = useState("");
  const [deleteShiftData, setDeleteShiftData] = useState("");
  const openAddShift = () => {
    setIsAddOpen(true);
  };
  const closeAddShift = () => {
    setIsAddOpen(false);
  };
  const openEditShift = (data) => {
    setIsEditOpen(true);
    setEditShiftData(data);
  };
  const closeEditShift = () => {
    setIsEditOpen(false);
  };
  const openDeleteShift = (data) => {
    setIsDeleteOpen(true);
    setDeleteShiftData(data);
  };
  const closeDeleteShift = () => {
    setIsDeleteOpen(false);
  };

  //function to send page no to the redux store
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };
  //function to send per page no to the redux store
  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };
  //how many data should show in ui
  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  const userSearchData = (data) => {
    dispatch(setSearchData(data));
  };
  //sending value to created hook to delay
  const deferredQuery = useDebounce(params.search_key);
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch, deferredQuery]);

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span> Shifts</span>
            <Stack component="div" direction="row">
              <TextField
                variant="outlined"
                placeholder="Search..."
                size="small"
                sx={{ mr: 2 }}
                onChange={(e) => {
                  userSearchData(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {hasPermission("designation_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddShift}
                >
                  Add Shift
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Box className="table-responsive">
              <TableContainer className="table-striped">
                <Table sx={{ minWidth: 2100 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ width: 80 }}>
                        Sl.No
                      </TableCell>
                      <TableCell align="left" sx={{ width: 150 }}>
                        Name
                      </TableCell>
                      <TableCell align="left" sx={{ width: 200 }}>
                        Timezone
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Shift Start
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Shift End
                      </TableCell>
                      <TableCell align="left" sx={{ width: 200 }}>
                        Converted Timezone
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Converted Shift Start
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Convert Shift End
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Created At
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Last Updated At
                      </TableCell>
                      {hasAnyPermission(["shift_update", "shift_delete"]) && (
                        <TableCell align="center" sx={{ width: 150 }}>
                          Actions
                        </TableCell>
                      )}{" "}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRowSkeleton
                        rows={10}
                        columns={
                          hasAnyPermission(["shift_update", "shift_delete"])
                            ? 11
                            : 10
                        }
                      />
                    ) : (data || [])?.length > 0 ? (
                      data.map((data, index) => {
                        const slNo = (params.current_page - 1) * 10;
                        return (
                          <React.Fragment key={data.id}>
                            <TableRow>
                              <TableCell align="center">
                                {index + slNo + 1}
                              </TableCell>
                              <TableCell align="left">
                                {data?.name || "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {data?.timezone?.label || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.shift_start || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.shift_end || "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {data?.converted_timezone?.label || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.converted_shift_start || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.converted_shift_end || "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.created_at
                                  ? moment(data.created_at).format("DD-MM-YYYY")
                                  : "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                {data?.updated_at
                                  ? moment(data.updated_at).format("DD-MM-YYYY")
                                  : "N/A"}
                              </TableCell>

                              {hasAnyPermission([
                                "shift_update",
                                "shift_delete",
                              ]) && (
                                <TableCell align="center">
                                  {hasPermission("shift_update") && (
                                    <>
                                      <Tooltip title="Update Shift">
                                        <IconButton
                                          aria-label="edit"
                                          color="primary"
                                          onClick={() => {
                                            openEditShift(data);
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                  {hasPermission("shift_delete") && (
                                    <>
                                      <Tooltip title="Delete Shift">
                                        <IconButton
                                          aria-label="delete"
                                          color="error"
                                          onClick={() => {
                                            openDeleteShift(data);
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} align="center">
                          No Shift Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ pb: 2, pr: 4 }}
          >
            <Typography>Rows per page</Typography>
            <select
              className="small-select"
              onChange={(event) => {
                handlePerPageChange(parseInt(event.target.value, 10));
              }}
            >
              {paginationPerPage.map((item) => {
                return (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <Pagination
              count={meta?.last_page}
              page={params?.page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Card>
      </Box>

      {isAddOpen && (
        <AddShift isAddOpen={isAddOpen} closeAddShift={closeAddShift} />
      )}
      {isEditOpen && (
        <EditShift
          isEditOpen={isEditOpen}
          closeEditShift={closeEditShift}
          editShiftData={editShiftData}
        />
      )}
      {isDeleteOpen && (
        <DeleteShift
          isDeleteOpen={isDeleteOpen}
          closeDeleteShift={closeDeleteShift}
          deleteShiftData={deleteShiftData}
        />
      )}
    </React.Fragment>
  );
};

export default ShiftTimeManagement;
