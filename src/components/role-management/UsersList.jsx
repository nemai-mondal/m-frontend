import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Pagination,
  Table,
  TableContainer,
  TableHead,
  IconButton,
  Chip,
  Button,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import Select from "react-select";
import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { ImagePath } from "@/ImagePath";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/contexts/AuthProvider";
import {
  refresh,
  setPage,
  setPerPage,
  setDepartmentId,
  setName,
} from "@/redux/UserSlice";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useAxios } from "@/contexts/AxiosProvider";
import { useConfirmationModal } from "@/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector((state) => state.user);
  const { Axios } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };

  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  const [departments, setDepartments] = useState([]);
  const [chipData, setChipData] = useState([]);
  const [roleAddModalOpen, setRoleAddModalOpen] = useState(false);
  const [roleModal, setRoleModal] = useState({});

  const handleRoleAddOpen = (item) => {
    setRoleModal(item);
    setChipData(item.roles.map(({ id, name }) => ({ value: id, label: name })));
    setRoleAddModalOpen(true);
  };

  const handleRoleAddClose = () => {
    setRoleAddModalOpen(false);
  };

  const longTextFormat = (item) => {
    if (!item || item.length === 0) {
      return "N/A";
    }

    const names = item.map(({ name }) =>
      name
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    );

    if (item.length > 3) {
      return names.slice(0, 3).join(", ") + ", etc.";
    } else {
      return names.join(", ");
    }
  };

  const [selectedRoles, setSelectedRoles] = useState("");
  const [roleList, setRoleList] = useState([]);

  const getRoleList = useCallback(async () => {
    try {
      const res = await Axios.get(`role/list`);

      setRoleList(
        (res.data.data || []).map(({ id, name }) => ({
          value: id,
          label: name
            .replace(/[^a-zA-Z0-9]+/g, " ")
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()),
        }))
      );
    } catch (error) {
      // Log an error message if there's an issue fetching holidays
      console.error("Error fetching holidays", error);
    }
  }, []); // Remove the dependency array from useCallback

  // Function to fetch departments from the server
  const getDepartments = useCallback(async () => {
    try {
      // Make the API request to fetch departments
      const res = await Axios.get("department/list");

      // Update date with the fetched departments, or set to an empty array if undefined
      setDepartments(
        (res.data?.data || []).map((m) => {
          return {
            value: m.id,
            label: m.name,
          };
        })
      );
    } catch (error) {
      // Log an error message if there's an issue fetching leave types
      console.error("Error fetching department list", error);
    }
  }, []);

  const confirmDeleteModal = useConfirmationModal({
    option: {
      title: "Warning!",
      question: "Are you sure, you want to permanently remove this role?",
      confirmButtonText: "Yes, Remove",
    },
    onConfirm: async (data) => {
      try {
        const res = await Axios.post(`user/remove-role`, {
          role_id: data?.role?.value,
          user_id: data?.user_id,
        });

        if (res.status === 200) {
          setChipData((prevChipData) =>
            prevChipData.filter((chip) => chip.value !== data?.role?.value)
          );

          confirmDeleteModal.closeModal();
          setSelectedRoles("");
          dispatch(refresh());
          toast.success(`Role Removed Successfully.`);
        } else {
          toast.error("Something went wrong.");
          confirmDeleteModal.closeModal();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Unable to connect to the server."
        );
        confirmDeleteModal.closeModal();
      }
    },
  });

  const confirmAddRoleModal = useConfirmationModal({
    option: {
      title: "Warning!",
      question: "Are you sure, you want to add this role?",
      confirmButtonText: "Yes, Confirm",
      confirmButtonColor: "success",
    },
    onConfirm: async (data) => {
      try {
        const role_ids = data?.roles?.map(({ value }) => value);

        const res = await Axios.post(`user/assign-role`, {
          role_ids,
          user_id: data?.user_id,
        });

        if (res.status === 200) {
          const newRoles = [...(data?.roles || [])];

          setChipData((prevChipData) => {
            return [...prevChipData, ...newRoles];
          });

          confirmAddRoleModal.closeModal();
          setSelectedRoles("");
          dispatch(refresh());
          toast.success(`New Role Assigned Successfully.`);
        } else {
          toast.error("Something went wrong.");
          confirmAddRoleModal.closeModal();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Unable to connect to the server."
        );
        confirmAddRoleModal.closeModal();
        setSelectedRoles("");
      }
    },
  });

  const [department, setDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDepartmentChange = (target) => {
    setDepartment(target);
    dispatch(setDepartmentId(target.value));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    dispatch(setName(event.target.value.trim()));
  };

  const handleSearch = () => {
    dispatch(setPage(1));
    dispatch(refresh());
  };

  const handleReset = () => {
    setDepartment("");
    setSearchTerm("");
    dispatch(setName(null));
    dispatch(setDepartmentId(null));
    handleSearch();
  };

  useEffect(() => {
    getRoleList();
    getDepartments();
  }, []);

  return (
    <React.Fragment>
      {/* Render the modal component */}
      {confirmDeleteModal.component}
      {confirmAddRoleModal.component}
      {/* Render the modal component */}

      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            {" "}
            <span>Users List</span>{" "}
          </Stack>
          <CardContent>
            <Grid container spacing={2} p={0} sx={{ mb: 5 }}>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">Department Name</InputLabel>
                <Select
                  placeholder="Department Name"
                  name="department_id"
                  options={departments}
                  value={department}
                  onChange={handleDepartmentChange}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">Employee Name</InputLabel>
                <TextField
                  id="leaveType"
                  placeholder="Enter Employee Name"
                  name="name"
                  value={searchTerm}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={handleSearchChange}
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">&nbsp;</InputLabel>
                <LoadingButton
                  variant="contained"
                  className="primary-btn h-40 text-capitalize"
                  color="primary"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  {" "}
                  Search{" "}
                </LoadingButton>
                <LoadingButton
                  variant="outlined"
                  className=" h-40 text-capitalize"
                  color="error"
                  onClick={handleReset}
                >
                  {" "}
                  Reset{" "}
                </LoadingButton>
              </Grid>
            </Grid>

            <TableContainer className="table-striped" sx={{ mt: 4 }}>
              <Table
                sx={{ minWidth: 1200 }}
                aria-label="simple table"
                className="table-responsive scroll-x"
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={50} align="left">
                      S.No.
                    </TableCell>
                    <TableCell width={250} align="left">
                      User Name
                    </TableCell>
                    <TableCell width={150} align="left">
                      Employee ID
                    </TableCell>
                    <TableCell width={250} align="left">
                      Email{" "}
                    </TableCell>
                    <TableCell width={150} align="left">
                      Roles
                    </TableCell>
                    <TableCell width={250} align="left">
                      Permission
                    </TableCell>
                    <TableCell width={150} align="center">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="userDeg">
                  {isLoading ? (
                    <TableRowSkeleton rows={params.per_page} columns={7} />
                  ) : data.length ? (
                    data.map((item, index) => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell align="left">
                            {index + (params.current_page - 1) * 10 + 1}
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" className="userList">
                              <Avatar
                                alt="Remy Sharp"
                                src={item.image || ImagePath.Avatar}
                                className="avtar"
                              />
                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  {`${item.honorific} ${item.first_name}${
                                    item.middle_name
                                      ? " " + item.middle_name
                                      : ""
                                  }${
                                    item.last_name ? " " + item.last_name : ""
                                  }`}
                                </Typography>
                                <Typography component="p" className="avtarDeg">
                                  {item.designation?.name || "Not Available"}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{item.employee_id}</TableCell>
                          <TableCell align="left">
                            {item.email || "N/A"}
                          </TableCell>
                          <TableCell align="left">
                            {item.roles.length > 0
                              ? longTextFormat(item.roles)
                              : "N/A"}{" "}
                            {hasPermission("user_role_assign") && (
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleRoleAddOpen(item)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.permissions.length > 0
                              ? longTextFormat(item.permissions)
                              : "N/A"}{" "}
                            <IconButton
                              aria-label="visibility"
                              onClick={() =>
                                navigate(`/permissions/${item.id}`)
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.status ? "Active" : "Inactive"}
                              color={item.status ? "success" : "warning"}
                              variant="contained"
                              size="small"
                              className={
                                "chip " + (item.status ? "success" : "error")
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No User Has Been Added
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              alignItems={"center"}
              sx={{ pb: 2, mt: 2 }}
            >
              <Typography>Row per page</Typography>
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
                count={meta?.last_page || 1}
                page={params?.page}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={roleAddModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={roleAddModalOpen}>
          <Box className="modalContainer md" component="div">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Stack direction="row" className="userList">
                <Avatar
                  alt="Remy Sharp"
                  src={roleModal.image || ImagePath.Avatar}
                  className="avtar"
                />
                <Box>
                  <Typography component="h6" className="avtarName">
                    {`${roleModal?.honorific} ${roleModal?.first_name}${
                      roleModal?.middle_name ? " " + roleModal?.middle_name : ""
                    }${roleModal?.last_name ? " " + roleModal?.last_name : ""}`}
                  </Typography>
                  <Typography component="p" className="smallText">
                    {roleModal?.designation?.name || "Not Available"}{" "}
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                aria-label="close"
                color="error"
                onClick={handleRoleAddClose}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="scroll-y  hvh-50">
              <Box className="modalBody">
                <Typography
                  component="h4"
                  className="heading-3"
                  sx={{ mb: "4px" }}
                >
                  Role
                </Typography>
                <Typography component="p" className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </Typography>
                <Stack
                  direction="row"
                  sx={{ mt: 4 }}
                  alignItems="center"
                  spacing={2}
                >
                  <Select
                    value={selectedRoles}
                    options={roleList.filter(
                      (role) =>
                        !chipData.some((chip) => chip.value === role.value)
                    )}
                    className="basic-multi-select selectTag w-100"
                    classNamePrefix="select"
                    placeholder="Select Roles"
                    isMulti
                    menuPlacement="top"
                    maxMenuHeight={120}
                    onChange={(values) => {
                      setSelectedRoles(values);
                    }}
                  />
                  <Button
                    component="button"
                    color="primary"
                    variant="contained"
                    className="primary-btn text-capitalize h-40"
                    disabled={selectedRoles.length === 0}
                    onClick={() =>
                      confirmAddRoleModal.openModal({
                        roles: selectedRoles,
                        user_id: roleModal?.id,
                      })
                    }
                  >
                    Add
                  </Button>
                </Stack>
                {/* Closeable Chip Start */}
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  sx={{ mt: 3, mb: 4 }}
                  spacing={2}
                >
                  {chipData?.map((data) => (
                    <Chip
                      deleteIcon={
                        <CloseIcon sx={{ fontSize: "18px !important" }} />
                      }
                      label={data.label}
                      onDelete={() =>
                        confirmDeleteModal.openModal({
                          role: data,
                          user_id: roleModal?.id,
                        })
                      }
                      key={data.value}
                      className="closeable-chip"
                    />
                  ))}
                </Stack>
                {/* Closeable Chip End */}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default UsersList;
