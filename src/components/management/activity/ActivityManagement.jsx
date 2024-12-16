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
  Tooltip,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import AddActivity from "./AddActivity";
import EditActivity from "./EditActivity";
import DeleteActivity from "./DeleteActivity";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
} from "@/redux/ActivitySlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
const ActivityManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  //getting data from redux store
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.activity
  );
  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editActivityData, setEditActivityData] = useState("");
  const [deleteActivityData, setDeleteActivityData] = useState("");
  //to open add modal
  const openAddActivity = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddActivity = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditActivity = (data) => {
    setIsEditOpen(true);
    setEditActivityData(data);
  };
  //to close edit modal
  const closeEditActivity = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteActivity = (data) => {
    setIsDeleteOpen(true);
    setDeleteActivityData(data);
  };
  //to close delete modal
  const closeDeleteActivity = () => {
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
            <span> Activities</span>
            <Stack component="div" direction="row">
              <TextField
                variant="outlined"
                placeholder="Search by Activity"
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
              {/* {has} */}

              {hasPermission("activity_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddActivity}
                >
                  Add Activity
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 1400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 50 }}>
                      Sl.No.
                    </TableCell>
                    <TableCell align="left" sx={{ width: 200 }}>
                      Activity Name
                    </TableCell>
                    <TableCell align="left" sx={{ width: 200 }}>
                      Department Name
                    </TableCell>
                    <TableCell align="center" sx={{ width: 100 }}>
                      Created At
                    </TableCell>
                    <TableCell align="center" sx={{ width: 100 }}>
                      Last Updated At
                    </TableCell>
                    {hasAnyPermission([
                      "activity_update",
                      "activity_delete",
                    ]) && (
                      <TableCell align="center" sx={{ width: 100 }}>
                        Actions
                      </TableCell>
                    )}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={6}
                      columns={
                        hasAnyPermission(["activity_update", "activity_delete"])
                          ? 6
                          : 5
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
                            <TableCell align="left">
                              {data?.department?.name || "N/A"}
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
                              "activity_update",
                              "activity_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("activity_update") && (
                                  <>
                                    <Tooltip title="Update Activity">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => {
                                          openEditActivity(data);
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}

                                {hasPermission("activity_delete") && (
                                  <>
                                    <Tooltip title="Delete Activity">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => {
                                          openDeleteActivity({
                                            id: data.id||"",
                                            name: data.name||"",
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
                      <TableCell colSpan={6} align="center">
                        No Activity Found
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
        <AddActivity
          isAddOpen={isAddOpen}
          closeAddActivity={closeAddActivity}
        />
      )}
      {isEditOpen && (
        <EditActivity
          isEditOpen={isEditOpen}
          closeEditActivity={closeEditActivity}
          editActivityData={editActivityData}
        />
      )}
      {isDeleteOpen && (
        <DeleteActivity
          isDeleteOpen={isDeleteOpen}
          closeDeleteActivity={closeDeleteActivity}
          deleteActivityData={deleteActivityData}
        />
      )}
    </React.Fragment>
  );
};

export default ActivityManagement;
