import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Stack,
  Box,
  Button,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  // Checkbox,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";

import "react-tabs/style/react-tabs.css";
import { AuthContext } from "@/contexts/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { refresh, setPerPage, setPage } from "../../../redux/LeavePolicySlice";
import "react-toastify/dist/ReactToastify.css";
import LeaveTypeModal from "./LeaveTypeModal";
import LeavePolicyModal from "./LeavePolicyModal";

const LeavePolicy = () => {
  const { hasPermission } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { isLoading, data, meta, params } = useSelector(
    (state) => state.leavePolicy
  );
  //creating array, based on data length to control checked/unchecked for every field
  // const [checkedItems, setCheckedItems] = useState([]);
  //state to store checked value on header section
  // const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [isLeavePolicyModalOpen, setLeavePolicyModalOpen] = useState(false);
  const [isLeaveTypeModalOpen, setLeaveTypeModalOpen] = useState(false);

  // const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // const [deleteLeavePloicyData, setDeleteLeavePolicyData] = useState(null);

  const [updateLeavePolicyData, setUpdateLeavePolicyData] = useState(null);

  // const handleDeleteLeavePolicy = async (id) => {
  //   try {
  //     dispatch(setLoading(true));
  //     await Axios.delete(`leave-type/delete/${id}`);
  //     dispatch(setLoading(false));
  //     toast.success("Leave policy deleted successfully.");
  //   } catch (e) {
  //     const error =
  //       e?.response?.data?.message || "Unable to connect to the server";
  //     dispatch(setLoading(false));
  //     toast.error(error);
  //     console.log("Error while deleting the Leave Policy" + e);
  //   }
  // };

  //function to checked and unchecked all field
  // const toggleSelectAll = () => {
  //   const newCheckedItems =
  //     checkedItems.length <= 1
  //       ? Array(data.length).fill(false)
  //       : [...checkedItems];
  //   const newSelectAllChecked = !selectAllChecked;
  //   data.forEach((_, index) => {
  //     newCheckedItems[index] = newSelectAllChecked;
  //   });
  //   setCheckedItems(newCheckedItems);
  //   setSelectAllChecked(newSelectAllChecked);
  // };

  //function to checked and unchecked particular field
  // const handleCheckboxChange = (index) => {
  //   const newCheckedItems =
  //     checkedItems.length <= 1
  //       ? Array(data.length).fill(false)
  //       : [...checkedItems];
  //   newCheckedItems[index] = !newCheckedItems[index];
  //   setCheckedItems(newCheckedItems);
  //   const select = newCheckedItems.filter((item) => item === true);

  //   if (select.length == 0 || select.length < checkedItems.length) {
  //     setSelectAllChecked(false);
  //   } else if (select.length === checkedItems.length) {
  //     setSelectAllChecked(true);
  //   }
  // };

  const closeModal = () => {
    setLeavePolicyModalOpen(false);
  };

  const handleAddNewLeavePolicyModel = () => {
    setLeaveTypeModalOpen(false);
  };

  // const closeDeleteModal = () => {
  //   setDeleteModalOpen(false);
  // };

  // const addDeleteLeavePolicyData = (data) => {
  //   setDeleteLeavePolicyData(data);
  //   setDeleteModalOpen(true);
  // };

  // Function used open the leave policy update modal
  const openLeavePolicyUpdateModal = (el) => {
    setUpdateLeavePolicyData(el);
    setLeavePolicyModalOpen(true);
  };

  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  const handlePerPageChange = (newPerPage) => {
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch, isLeavePolicyModalOpen]);

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox quote" sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Leave Policy</span>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ gap: 2 }}
            >
              {/* {checkedItems.some((el) => el === true) && (
                <Button variant="contained" color="error">
                  Delete
                </Button>
              )} */}
              {hasPermission("leave_policy_create") ? (
                <Button
                  variant="outlined"
                  onClick={() => setLeavePolicyModalOpen(true)}
                >
                  Set Leave Policy
                </Button>
              ) : (
                ""
              )}

              {hasPermission("leave_type_create") ? (
                <Button
                  variant="contained"
                  onClick={() => setLeaveTypeModalOpen(true)}
                >
                  Add New Leave
                </Button>
              ) : (
                ""
              )}
            </Stack>
          </Stack>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>
                    <Checkbox
                      checked={selectAllChecked}
                      onChange={toggleSelectAll}
                    />
                  </TableCell> */}
                  <TableCell align="center">SL No</TableCell>
                  <TableCell align="center">Leave Name</TableCell>
                  <TableCell align="center">Abbreviation</TableCell>
                  <TableCell align="center">Employment</TableCell>
                  <TableCell align="center">Credit</TableCell>
                  <TableCell align="center">Frequency</TableCell>
                  <TableCell align="center">Yearly</TableCell>
                  {hasPermission("leave_policy_update") ? (
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
                    columns={hasPermission("leave_policy_update") ? 8 : 7}
                  />
                ) : data.length >= 1 ? (
                  data.map((leavePolicy, index) => {
                    const slNo = index + 1;
                    return (
                      <TableRow key={leavePolicy?.id}>
                        {/* <TableCell scope="row">
                          <Checkbox
                            checked={checkedItems[index] || false}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </TableCell> */}
                        <TableCell align="center">{slNo}</TableCell>
                        <TableCell align="center">
                          {leavePolicy?.leave_type?.name || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {leavePolicy?.leave_type?.abbreviation || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {leavePolicy?.employment_type?.name || "N/A"}
                        </TableCell>

                        <TableCell align="center">
                          {leavePolicy?.leave_credit || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {leavePolicy?.frequency || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {leavePolicy?.leave_credit*12 || "N/A"}
                        </TableCell>

                        <TableCell align="center">
                          {hasPermission("leave_policy_update") ? (
                            <Tooltip title="View / Edit Leave Policy">
                              <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={() => {
                                  openLeavePolicyUpdateModal(leavePolicy);
                                }}
                              >
                                <EditIcon color="primary" fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}

                          {/* ) : (
                              ""
                            )} */}
                          {/* {hasPermission("department_delete") ? (
                              <>
                                <IconButton
                                  aria-label="delete"
                                  color="error"
                                  onClick={() =>
                                    addDeleteLeavePolicyData(leavePolicy)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              ""
                            )} */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No policy Has Been Added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
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
      {isLeavePolicyModalOpen && (
        <LeavePolicyModal
          isLeavePolicyModalOpen={isLeavePolicyModalOpen}
          closeModal={closeModal}
          updateLeavePolicyData={updateLeavePolicyData}
          setUpdateLeavePolicyData={setUpdateLeavePolicyData}
        />
      )}

      {/** Add/Update Leave policy Modal */}
      {isLeaveTypeModalOpen && (
        <LeaveTypeModal
          isLeaveTypeModalOpen={isLeaveTypeModalOpen}
          closeModal={handleAddNewLeavePolicyModel}
        />
      )}

      {/* Delete Leave policy Modal */}
      {/* {
        isDeleteModalOpen && (
          <DeleteLeavePolicy isDeleteModalOpen={isDeleteModalOpen} closeDeleteModal={closeDeleteModal} deleteLeavePloicyData={} />
        )
      } */}
    </React.Fragment>
  );
};

export default LeavePolicy;
