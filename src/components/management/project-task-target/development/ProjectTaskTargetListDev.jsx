import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Button,
  IconButton,
  Pagination,
  Typography,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setDepartmentName,
} from "@/redux/ProjectSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import DeleteProject from "./DeleteProject";
import { AuthContext } from "@/contexts/AuthProvider";
const ProjectTaskTargetList = () => {
  const { hasAnyPermission, hasPermission } = useContext(AuthContext);
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [deleteProjectData, setDeleteProjectData] = useState("");
  const openDeleteProject = (data) => {
    setIsDeleteOpen(true);
    setDeleteProjectData(data);
  };
  const closeDeleteProject = () => {
    setIsDeleteOpen(false);
  };
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.project
  );
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
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setDepartmentName("development"));
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch]);

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
            <span>Project Task & Target List (Development)</span>
            <Stack direction="row" spacing={1} alignItems={"center"}>
              {/* <Button
                variant="outlined"
                size="small"
                className=""
                sx={{ minWidth: 40, borderColor: "#303030" }}
              >
                <FilterAltRoundedIcon sx={{ fontSize: 22, color: "#303030" }} />
              </Button> */}
              {hasPermission("development_task_create") && (
                <Link to={"/task/dev/create"}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="cardHeaderBtn"
                  >
                    Add
                  </Button>
                </Link>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: 350 }} className="table-striped">
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sl No</TableCell>
                    <TableCell align="left">Client Name</TableCell>
                    <TableCell align="left">Project Name</TableCell>
                    <TableCell align="left">Project Type</TableCell>
                    <TableCell align="left">PM Name</TableCell>
                    <TableCell align="left">Estimated Time</TableCell>
                    {hasAnyPermission([
                      "development_task_update",
                      "development_task_delete",
                    ]) && (
                      <TableCell width={"10%"} align="center">
                        Action
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={5}
                      columns={
                        hasAnyPermission([
                          "development_task_update",
                          "development_task_delete",
                        ])
                          ? 7
                          : 6
                      }
                    />
                  ) : data?.data?.length > 0 ? (
                    data.data.map((project, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {index + slNo + 1}
                          </TableCell>
                          <TableCell align="left">
                            {project.client?.name || "N/A"}
                          </TableCell>
                          <TableCell align="left">
                            {project.name || "N/A"}
                          </TableCell>
                          <TableCell align="left">
                            {project.project_type || "N/A"}
                          </TableCell>
                          <TableCell align="left">
                            {" "}
                            {project.project_manager
                              ? `${
                                  project.project_manager?.honorific
                                    ? `${project.project_manager?.honorific} `
                                    : ""
                                }${project.project_manager?.first_name || ""} ${
                                  project.project_manager?.middle_name
                                    ? `${project.project_manager.middle_name} `
                                    : ""
                                }${project.project_manager?.last_name || ""}`
                              : "N/A"}
                          </TableCell>
                          <TableCell align="left">
                            {project.estimation_value || "N/A"}
                          </TableCell>
                          {hasAnyPermission([
                            "development_task_update",
                            "development_task_delete",
                          ]) && (
                            <TableCell align="center">
                              {hasPermission("development_task_update") && (
                                <Tooltip title="Update/view Project">
                                  <Link to={`/task/dev/update/${project.id}`}>
                                    <IconButton aria-label="EditIcon">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              )}
                              {hasPermission("development_task_delete") && (
                                <Tooltip title="Delete Project">
                                  <IconButton
                                    aria-label="DeleteIcon"
                                    onClick={() => {
                                      openDeleteProject(project);
                                    }}
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      color="error"
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No Project Found
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
      {isDeleteOpen && (
        <DeleteProject
          isDeleteOpen={isDeleteOpen}
          deleteProjectData={deleteProjectData}
          closeDeleteProject={closeDeleteProject}
        />
      )}
    </React.Fragment>
  );
};

export default ProjectTaskTargetList;
