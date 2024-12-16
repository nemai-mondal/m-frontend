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
} from "@mui/material";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
import {
  refresh,
  setPage,
  setPerPage,

} from "@/redux/ProjectSlice";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
const ProjectManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.project
  );
  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editProjectData, setEditProjectData] = useState("");
  const [deleteProjectData, setDeleteProjectData] = useState("");
  //to open add modal
  const openAddProject = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddProject = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditProject = (data) => {
    setIsEditOpen(true);
    setEditProjectData(data);
  };
  //to close edit modal
  const closeEditProject = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteProject = (data) => {
    setIsDeleteOpen(true);
    setDeleteProjectData(data);
  };
  //to close delete modal
  const closeDeleteProject = () => {
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
    // dispatch(setSearchData(data));
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
            <span>Projects</span>
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

              {hasPermission("project_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddProject}
                >
                  Add Project
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Sl.No.</TableCell>
                    <TableCell align="left">Project Name</TableCell>
                    <TableCell align="left">Client Name</TableCell>
                    <TableCell align="left">Technologies Name</TableCell>
                    <TableCell align="left">Resources Name</TableCell>
                    <TableCell align="left">Start Date</TableCell>
                    <TableCell align="left">Duration</TableCell>
                    <TableCell align="left">Created At</TableCell>
                    <TableCell align="left">Last Updated At</TableCell>
                    {hasAnyPermission(["project_update", "project_delete"]) && (
                      <TableCell align="right">Actions</TableCell>
                    )}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission(["project_update", "project_delete"])
                          ? 10
                          : 9
                      }
                    />
                  ) : data?.data?.length > 0 ? (
                    data.data.map((data, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <React.Fragment key={data.id}>
                          <TableRow>
                            <TableCell align="left">
                              {index + slNo + 1}
                            </TableCell>
                            <TableCell align="left">
                              {data.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {data?.client?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {data?.technologies?.map((e, a) => `${e.name}, `)}
                            </TableCell>
                            {/* <TableCell align="left" className="text-capitalize">
                              {data?.resource?.map((e, a) => `${e.first_name},`)}
                            </TableCell> */}
                            <TableCell align="left" className="text-capitalize">
                              {data?.resource?.map((e, a) => (
                                <React.Fragment key={a}>
                                  {`${
                                    e.honorific +
                                    " " +
                                    e.first_name +
                                    " " +
                                    e.middle_name +
                                    " " +
                                    e.last_name
                                  }`}
                                  <br />
                                </React.Fragment>
                              ))}
                            </TableCell>
                            <TableCell align="left">
                              {data.start_date
                                ? moment(data.start_date).format("DD-MM-YYYY")
                                : ""}
                            </TableCell>
                            <TableCell align="left">
                              {data?.duration||"" + " Hrs."}
                            </TableCell>
                            <TableCell align="left">
                              {data.created_at
                                ? moment(data.created_at).format("DD-MM-YYYY")
                                : ""}
                            </TableCell>
                            <TableCell align="left">
                              {data.updated_at
                                ? moment(data.updated_at).format("YYYY-MM-DD")
                                : ""}
                            </TableCell>
                            {hasAnyPermission([
                              "project_update",
                              "project_delete",
                            ]) && (
                              <TableCell align="right">
                                {hasPermission("project_update") && (
                                  <>
                                    <IconButton
                                      aria-label="edit"
                                      color="primary"
                                      onClick={() => {
                                        openEditProject(data);
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </>
                                )}
                                {hasPermission("project_delete") && (
                                  <>
                                    <IconButton
                                      aria-label="delete"
                                      color="error"
                                      onClick={() => {
                                        openDeleteProject({
                                          id: data.id,
                                          name: data.name,
                                        });
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
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
                      <TableCell colSpan={10} align="center">
                        Project Not Found
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
        <AddProject isAddOpen={isAddOpen} closeAddProject={closeAddProject} />
      )}
      {isEditOpen && (
        <EditProject
          isEditOpen={isEditOpen}
          closeEditProject={closeEditProject}
          editProjectData={editProjectData}
        />
      )}
      {isDeleteOpen && (
        <DeleteProject
          isDeleteOpen={isDeleteOpen}
          closeDeleteProject={closeDeleteProject}
          deleteProjectData={deleteProjectData}
        />
      )}
    </React.Fragment>
  );
};

export default ProjectManagement;
