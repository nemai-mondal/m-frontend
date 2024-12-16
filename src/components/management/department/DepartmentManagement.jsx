import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  Stack,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import DeleteDepartment from "./DeleteDepartment";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
} from "@/redux/DepartmentSlice";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";

const DepartmentManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  //getting data from redux store
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.department
  );
  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editDepartmentData, setEditDepartmentData] = useState("");
  const [deleteDepartmentData, setDeleteDepartmentData] = useState("");
  //to open add modal
  const openAddDepartment = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddDepartment = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditDepartment = (data) => {
    setIsEditOpen(true);
    setEditDepartmentData(data);
  };
  //to close edit modal
  const closeEditDepartment = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteDepartment = (data) => {
    setIsDeleteOpen(true);
    setDeleteDepartmentData(data);
  };
  //to close delete modal
  const closeDeleteDepartment = () => {
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
  //function when user will search any data using search field
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
            <span> Departments</span>
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
              {hasPermission("department_create") ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddDepartment}
                >
                  Add Department
                </Button>
              ) : (
                ""
              )}
            </Stack>
          </Stack>

          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sl.No</TableCell>
                    <TableCell align="left">Department Name</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Last Updated At</TableCell>
                    {hasAnyPermission([
                      "department_update",
                      "department_delete",
                    ]) ? (
                      <TableCell align="center">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission([
                          "department_update",
                          "department_delete",
                        ])
                          ? 5
                          : 4
                      }
                    />
                  ) : (data?.data||[]).length > 0 ? (
                    data.data.map((data, index) => {
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
                              "department_update",
                              "department_delete",
                            ]) ? (
                              <TableCell align="center">
                                {hasPermission("department_update") ? (
                                  <>
                                    <Tooltip title="Update Department">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => {
                                          openEditDepartment(data);
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  ""
                                )}
                                {hasPermission("department_delete") ? (
                                  <>
                                    <Tooltip title="Delete Department">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => {
                                          openDeleteDepartment({
                                            id: data.id||"",
                                            name: data.name||"",
                                          });
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  ""
                                )}
                              </TableCell>
                            ) : (
                              ""
                            )}
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Department Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ pb: 2 }}
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
        <AddDepartment
          isAddOpen={isAddOpen}
          closeAddDepartment={closeAddDepartment}
        />
      )}
      {isEditOpen && (
        <EditDepartment
          isEditOpen={isEditOpen}
          closeEditDepartment={closeEditDepartment}
          editDepartmentData={editDepartmentData}
        />
      )}
      {isDeleteOpen && (
        <DeleteDepartment
          isDeleteOpen={isDeleteOpen}
          closeDeleteDepartment={closeDeleteDepartment}
          deleteDepartmentData={deleteDepartmentData}
        />
      )}
    </React.Fragment>
  );
};

export default DepartmentManagement;
