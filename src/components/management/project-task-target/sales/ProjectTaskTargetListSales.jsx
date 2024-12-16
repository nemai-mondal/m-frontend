import { Fragment, useContext, useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "@/contexts/AuthProvider";
import {
  refresh,
  setPage,
  setPerPage,
  setDepartmentName,
} from "@/redux/ProjectSalesSlice";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import DeleteSalesProject from "./DeleteSalesProject";

const ProjectTaskTargetListSales = () => {
  const dispatch = useDispatch();
  const { hasAnyPermission, hasPermission } = useContext(AuthContext);
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.project
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState("");
  const [deleteData, setDeleteData] = useState("");

  //to close delete modal
  const closeDeleteModal = () => {
    dispatch(setDepartmentName("sales"));
    dispatch(setPerPage(20));
    dispatch(refresh());
    setIsDeleteModalOpen(false);
  };

  //to open delete modal and store delete data
  const openDeleteModal = (data, designation_id, activity_id) => {
    setIsDeleteModalOpen(true);
    setDeleteData({ ...data, designation_id, activity_id });
  };

  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

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

  useEffect(() => {
    dispatch(setDepartmentName("sales"));
    dispatch(setPerPage(20));
    dispatch(refresh());
  }, []);
  return (
    <Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Sales Task & Target List</span>
            <Stack direction="row" spacing={1} alignItems={"center"}>
              {/* <Button variant="outlined" size="small" className="" sx={{ minWidth: 40, borderColor: "#303030" }}>
              <FilterAltRoundedIcon sx={{ fontSize: 22, color: "#303030" }} />
            </Button> */}
              <Link to={"/task/sales/create"}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                >
                  Add
                </Button>
              </Link>
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: 500 }} className="table-striped">
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align="center">Sl No</TableCell> */}
                    <TableCell align="left">Designation</TableCell>
                    <TableCell align="left">Activity</TableCell>
                    <TableCell align="center">Weekly Target</TableCell>
                    <TableCell align="center">Monthly Target</TableCell>
                    <TableCell align="center">Created By</TableCell>
                    <TableCell align="center">Last Modified Date</TableCell>
                    <TableCell align="center">Last Modified By</TableCell>
                    <TableCell width={"10%"} align="center">
                      Action
                    </TableCell>
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
                          ? 10
                          : 9
                      }
                    />
                  ) : data?.data?.length >= 1 ? (
                    data?.data?.map((project) => {
                      // let index = 1;
                      return project?.designations?.map((designation) =>
                        designation?.activities?.map((activity, i3) => (
                          <TableRow key={i3}>
                            {/* <TableCell align="center">{index++}</TableCell> */}
                            <TableCell align="left">
                              {designation?.name || "N/A"}
                            </TableCell>
                            <TableCell align="left">
                              {activity?.activity?.name || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {activity?.weekly || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {activity?.monthly || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {project?.user
                                ? project?.user?.honorific +
                                  " " +
                                  project?.user?.first_name +
                                  " " +
                                  project?.user?.middle_name +
                                  " " +
                                  project?.user?.last_name
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {project?.updated_at?.split("T")?.[0] || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {project?.updated_by_user
                                ? project?.updated_by_user?.honorific +
                                  " " +
                                  project?.updated_by_user?.first_name +
                                  " " +
                                  project?.updated_by_user?.middle_name +
                                  " " +
                                  project?.updated_by_user?.last_name
                                : ""}
                            </TableCell>
                            {hasAnyPermission([
                              "sales_task_update",
                              "sales_task_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("sales_task_update") && (
                                  <Link
                                    to={`/task/sales/update/${project?.id}`}
                                  >
                                    <Tooltip title="View/Edit">
                                    <IconButton aria-label="EditIcon">
                                      <EditIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    </IconButton>
                                    </Tooltip>
                                  </Link>
                                )}
                                {hasPermission("sales_task_delete") && (
                                  <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() =>
                                      openDeleteModal(
                                        project,
                                        designation?.id,
                                        activity?.id
                                      )
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No Project Has Been Added
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          {/* <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ pb: 2, mt: 2 }}
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
              showFirstButton
              showLastButton
              onChange={handlePageChange}
            />
          </Stack> */}
        </Card>
      </Box>
      {isDeleteModalOpen && (
        <DeleteSalesProject
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          deleteData={deleteData}
        />
      )}
    </Fragment>
  );
};

export default ProjectTaskTargetListSales;
