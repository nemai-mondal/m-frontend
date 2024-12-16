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
  TextField,
  InputAdornment,
  Pagination,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@mui/icons-material/Search";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import AddQuote from "@/components/home/quote/AddQuote";
import EditQuote from "@/components/home/quote/EditQuote";
import DeleteQuote from "./DeleteQuote";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setPerPage, setSearchData } from "@/redux/QuoteSlice";
import { refresh } from "@/redux/QuoteSlice";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
const MotivationalManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);

  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector((state) => state.quote);

  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editQuoteData, setEditQuoteData] = useState("");
  const [deleteQuoteData, setDeleteQuoteData] = useState("");
  //to open add modal
  const openAddQuote = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddQuote = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditQuote = (data) => {
    setIsEditOpen(true);
    setEditQuoteData(data);
  };
  //to close edit modal
  const closeEditQuote = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteQuote = (data) => {
    setIsDeleteOpen(true);
    setDeleteQuoteData(data);
  };
  //to close delete modal
  const closeDeleteQuote = () => {
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
            <span> Motivational Quotes</span>
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

              {hasPermission("motivational_quote_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddQuote}
                >
                  Add Motivational Quote
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 1250 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sl.No</TableCell>
                    <TableCell align="left">Quote</TableCell>
                    <TableCell align="left">Author Name</TableCell>
                    <TableCell align="left">Author image</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Last Updated At</TableCell>
                    {hasAnyPermission([
                      "motivational_quote_update",
                      "motivational_quote_delete",
                    ]) && <TableCell align="center">Actions</TableCell>}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission([
                          "motivational_quote_update",
                          "motivational_quote_delete",
                        ])
                          ? 7
                          : 6
                      }
                    />
                  ) : (data||[])?.length > 0 ? (
                    data.map((data, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <React.Fragment key={data.id}>
                          <TableRow>
                            <TableCell align="center">
                              {index + slNo + 1}
                            </TableCell>
                            <TableCell align="left">
                              {data.quote || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {data.said_by || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              <Avatar className="edit-avtar">
                                {data.image ? (
                                  <img
                                    src={data.image}
                                    alt="Selected"
                                    className="avatar-image"
                                  />
                                ) : (
                                  <PersonIcon />
                                )}
                              </Avatar>
                            </TableCell>
                            <TableCell align="center">
                              {data.created_at
                                ? moment(data.created_at).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data.updated_at
                                ? moment(data.updated_at).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>

                            {hasAnyPermission([
                              "motivational_quote_update",
                              "motivational_quote_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("motivational_quote_update") && (
                                  <>
                                  <Tooltip title="Update Quote">

                                 
                                    <IconButton
                                      aria-label="edit"
                                      color="primary"
                                      onClick={() => {
                                        openEditQuote(data);
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {hasPermission("motivational_quote_delete") && (
                                  <>
                                  <Tooltip title="Delete Quote">
                                    <IconButton
                                      aria-label="delete"
                                      color="error"
                                      onClick={() => {
                                        openDeleteQuote({
                                          id: data.id||"",
                                          quote: data.quote||"",
                                        });
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
                      <TableCell colSpan={7} align="center">
                        No Quote Found
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
        <AddQuote isAddOpen={isAddOpen} closeAddQuote={closeAddQuote} />
      )}
      {isEditOpen && (
        <EditQuote
          isEditOpen={isEditOpen}
          closeEditQuote={closeEditQuote}
          editQuoteData={editQuoteData}
        />
      )}
      {isDeleteOpen && (
        <DeleteQuote
          isDeleteOpen={isDeleteOpen}
          closeDeleteQuote={closeDeleteQuote}
          deleteQuoteData={deleteQuoteData}
        />
      )}
    </React.Fragment>
  );
};

export default MotivationalManagement;
