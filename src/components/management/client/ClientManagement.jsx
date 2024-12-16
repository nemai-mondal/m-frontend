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
  Pagination,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
} from "@/redux/ClientSlice";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import DeleteClient from "./DeleteClient";

const ClientManagement = () => {
  // Accessing authentication context
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  // Redux hooks for dispatch and selector
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.client
  );
  // State variables for modal handling
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  const [deleteClientData, setDeleteClientData] = useState(null);

  // Function to open add client modal
  const openAddClient = () => {
    setIsAddOpen(true);
  };

  // Function to close add client modal
  const closeAddClient = () => {
    setIsAddOpen(false);
  };

  // Function to open edit client modal and set edit data
  const openEditClient = (data) => {
    setIsEditOpen(true);
    setEditClientData(data);
  };

  // Function to close edit client modal
  const closeEditClient = () => {
    setIsEditOpen(false);
  };

  // Function to open delete client modal and set delete data
  const openDeleteClient = (data) => {
    setIsDeleteOpen(true);
    setDeleteClientData(data);
  };

  // Function to close delete client modal
  const closeDeleteClient = () => {
    setIsDeleteOpen(false);
  };

  // Function to handle pagination change
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  // Function to handle change in number of items per page
  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };

  // Options for selecting number of items per page
  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  // Function to handle user search input
  const userSearchData = (data) => {
    dispatch(setSearchData(data));
  };

  // Debounced search input
  const deferredQuery = useDebounce(params.search_key);

  // Effect to refresh data on component mount or search input change
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
            <span> Clients</span>
            <Stack component="div" direction="row">
              {/* Search input field */}
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
              {/* Add client button */}
              {hasPermission("client_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddClient}
                >
                  Add Client
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table
                sx={{ minWidth: 2800 }}
                className="table-responsive scroll-x"
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    {/* Table headers */}
                    <TableCell
                      align="center"
                      // style={{ width: 50, whiteSpace: "nowrap" }}
                    >
                      Sl.No
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 280, whiteSpace: "nowrap" }}
                    >
                      Client Name
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 250, whiteSpace: "nowrap" }}
                    >
                      Contact Person
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 200, whiteSpace: "nowrap" }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      align="center"
                      // style={{ width: 150, whiteSpace: "nowrap" }}
                    >
                      Phone No
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 280, whiteSpace: "nowrap" }}
                    >
                      Company Name
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 280, whiteSpace: "nowrap" }}
                    >
                      Company Address
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 100, whiteSpace: "nowrap" }}
                    >
                      Source
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 200, whiteSpace: "nowrap" }}
                    >
                      Industry
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 80, whiteSpace: "nowrap" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ width: 120, whiteSpace: "nowrap" }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 150, whiteSpace: "nowrap" }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      align="left"
                      // style={{ width: 180, whiteSpace: "nowrap" }}
                    >
                      Country
                    </TableCell>
                    <TableCell
                      align="center"
                      // style={{ width: 150, whiteSpace: "nowrap" }}
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      align="center"
                      // style={{ width: 150, whiteSpace: "nowrap" }}
                    >
                      Last Updated At
                    </TableCell>
                    {/* Actions column */}
                    {hasAnyPermission(["client_update", "client_delete"]) && (
                      <TableCell
                        align="center"
                        style={{ width: 120, whiteSpace: "nowrap" }}
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    // Skeleton loader when data is loading
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission(["client_update", "client_delete"])
                          ? 16
                          : 15
                      }
                    />
                  ) : (data?.data||[]).length > 0 ? (
                    // Mapping data to table rows
                    data.data.map((data, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <TableRow key={data.id}>
                          <TableCell align="center" style={{ width: 50 }}>
                            {index + slNo + 1}
                          </TableCell>
                          <TableCell align="left" style={{ width: 280 }}>
                            {data?.name || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 250 }}>
                            {data?.contact_person || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 200 }}>
                            {data?.email || "N/A"}
                          </TableCell>
                          <TableCell align="center" style={{ width: 150 }}>
                            {data?.phone || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 280 }}>
                            {data?.company_name || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 280 }}>
                            {data?.company_address || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 100 }}>
                            {data?.opportunity_source || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 200 }}>
                            {data?.industry || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 80 }}>
                            {data?.status == 1 ? "Active" : "Deactive"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 120 }}>
                            {data?.type || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 150 }}>
                            {data?.site || "N/A"}
                          </TableCell>
                          <TableCell align="left" style={{ width: 180 }}>
                            {data?.country || "N/A"}
                          </TableCell>
                          <TableCell align="center" style={{ width: 150 }}>
                            {data?.created_at
                              ? moment(data.created_at).format("DD-MM-YYYY")
                              : "N/A"}
                          </TableCell>
                          <TableCell align="center" style={{ width: 150 }}>
                            {data?.updated_at
                              ? moment(data.updated_at).format("DD-MM-YYYY")
                              : "N/A"}
                          </TableCell>
                          {/* Action buttons */}
                          {hasAnyPermission([
                            "client_update",
                            "client_delete",
                          ]) && (
                            <TableCell align="center" style={{ width: 120 }}>
                              {hasPermission("client_update") && (
                                <Tooltip title='Update Client'>

                               
                                <IconButton
                                  aria-label="edit"
                                  color="primary"
                                  onClick={() => openEditClient(data)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                </Tooltip>
                              )}
                              {hasPermission("client_delete") && (
                                <Tooltip title="Delete Client">

                                
                                <IconButton
                                  aria-label="delete"
                                  color="error"
                                  onClick={() =>
                                    openDeleteClient({
                                      id: data.id||"",
                                      name: data.name||"",
                                    })
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  ) : (
                    // No data message
                    <TableRow>
                      <TableCell
                        colSpan={
                          hasAnyPermission(["client_update", "client_delete"])
                            ? 16
                            : 15
                        }
                        align="center"
                      >
                        No Client Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          {/* Pagination and rows per page selection */}
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
              onChange={(event) =>
                handlePerPageChange(parseInt(event.target.value, 10))
              }
            >
              {paginationPerPage.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <Pagination
              count={meta?.last_page || 1}
              page={params?.page || 1}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Card>
      </Box>
      {/* Modals for adding, editing, and deleting clients */}
      {isAddOpen && (
        <AddClient isAddOpen={isAddOpen} closeAddClient={closeAddClient} />
      )}
      {isEditOpen && (
        <EditClient
          isEditOpen={isEditOpen}
          closeEditClient={closeEditClient}
          editClientData={editClientData}
        />
      )}
      {isDeleteOpen && (
        <DeleteClient
          isDeleteOpen={isDeleteOpen}
          closeDeleteClient={closeDeleteClient}
          deleteClientData={deleteClientData}
        />
      )}
    </React.Fragment>
  );
};

export default ClientManagement;
