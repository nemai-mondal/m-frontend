import React, { useCallback, useContext, useEffect, useState } from "react";
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
  TextField,
  InputAdornment,
  Pagination,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { refresh, setPage, setPerPage, setSearchName } from "@/redux/RoleSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteRole from "./DeleteRole";
import { useDebounce } from "@/hooks";
import { AuthContext } from "@/contexts/AuthProvider";
const RoleList = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);

  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, meta, params, isLoading } = useSelector((state) => state.role);

  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteData, setDeleteData] = useState("");

  //to close delete modal
  const closeDeleteRole = () => {
    setIsDeleteOpen(false);
  };

  //to open delete modal and store delete data
  const openDeleteRole = (data) => {
    setIsDeleteOpen(true);
    setDeleteData(data);
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  const handlePerPageChange = (newPerPage) => {
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };

  // Debounce the search term with a delay of 500ms
  const debouncedSearchTerm = useDebounce(params?.name, 500);

  const handleSearchChange = (value) => {
    dispatch(setSearchName(value));
  };

  // useEffect to trigger API call when debouncedSearchTerm changes
  useEffect(() => {
    // Perform API call with the debounced search term
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch, debouncedSearchTerm]);

  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  const formatPermissions = (item) => {
    const permissions = item?.permissions;

    if (!permissions || permissions.length === 0) {
      return "N/A";
    }

    const permissionNames = permissions.map(({ name }) =>
      name
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    );

    if (permissions.length > 3) {
      return permissionNames.slice(0, 3).join(", ") + ", etc.";
    } else {
      return permissionNames.join(", ");
    }
  };

  const serialNo = useCallback(
    (index) => {
      if (
        !params ||
        typeof params.current_page !== "number" ||
        typeof params.per_page !== "number"
      ) {
        return null;
      }

      const slNo = (params.current_page - 1) * params.per_page;
      return index + slNo + 1;
    },
    [params]
  );

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
            <span>Roles</span>
            <Stack component="div" direction="row">
              <TextField
                variant="outlined"
                placeholder="Search..."
                size="small"
                sx={{ mr: 2 }}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {hasPermission("role_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={() => navigate("/role")}
                >
                  Add Role
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 2 }}>
            <TableContainer className="userList">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Sl.No.</TableCell>
                    <TableCell align="left">Role Name</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Permission</TableCell>
                    {hasAnyPermission(["role_update", "role_delete"]) && (
                      <TableCell align="right">Actions</TableCell>
                    )}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={params?.per_page}
                      columns={
                        hasAnyPermission(["role_update", "role_delete"]) ? 5 : 4
                      }
                    />
                  ) : (data||[]).length > 0 ? (
                    data.map((item, index) => {
                      return (
                        <React.Fragment key={item.id}>
                          <TableRow>
                            <TableCell align="left">
                              {serialNo(index)}
                            </TableCell>
                            <TableCell align="left">
                              {item?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {item?.description || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {formatPermissions(item)}
                            </TableCell>
                            {item.name !== "super_admin" ? (
                              hasAnyPermission([
                                "role_update",
                                "role_delete",
                              ]) && (
                                <TableCell align="right">
                                  {hasPermission("role_update") && (
                                    <IconButton
                                      aria-label="edit"
                                      color="primary"
                                      onClick={() =>
                                        navigate(`/role/${item.id}`)
                                      }
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  {hasPermission("role_delete") && (
                                    <IconButton
                                      aria-label="delete"
                                      color="error"
                                      onClick={() => openDeleteRole(item)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </TableCell>
                              )
                            ) : (
                              <TableCell colSpan={2}></TableCell>
                            )}
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Roles Not Found
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

      {isDeleteOpen && (
        <DeleteRole
          isDeleteOpen={isDeleteOpen}
          closeDeleteRole={closeDeleteRole}
          deleteData={deleteData}
        />
      )}
    </React.Fragment>
  );
};

export default RoleList;
