import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  InputLabel,
  TextField,
  Grid,
  Avatar,
  Typography,
  IconButton,
  Pagination,
  Skeleton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Select from "react-select";
import { Search } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import ProgressCircle from "@/components/common/ProgressCircle";
import AddEmployee from "../onboarding/AddEmployee";
import { Link } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import DeleteEmployee from "../onboarding/DeleteEmployee";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { MdUploadFile } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "@/contexts/AuthProvider";
import EmployeeListSkeleton from "./EmployeeListSkeleton";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useDispatch, useSelector } from "react-redux";
import {
  refresh,
  setPage,
  setPerPage,
  setEmployeeName,
  setDepartmentId,
} from "@/redux/EmployeeListSlice";
import EmployeeResetPasswordModal from "./EmployeeResetPasswordModal";
const EmployeeList = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.employeelist
  );
  //setting path to download sample file
  const addEmployeeSamplefile =
    "https://magichrms.magicmindtechnologies.com/addEmployeeSampleFile.csv";
  const { Axios } = useAxios();
  //state to store employment type
  const [employmentType, setEmploymentType] = useState([]);
  //state to toogle for disable import button
  const [disableImportBtn, setDisableImportBtn] = useState(false);
  //state to open add emp page
  const [isAddOpen, setIsAddOpen] = useState("");
  //state to open delete emp page
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  //state to store delete data
  const [deleteData, setIsdeleteData] = useState("");
  const [loading, setLoading] = useState(false);
  //state to store department
  const [departments, setDepartments] = useState([]);
  //state to open reset employee password page
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState("");
  //state to store reset password id
  const [resetPasswordData, setResetPasswordData] = useState("");

  const openResetPasswordModal = (id) => {
    setIsResetPasswordOpen(true);
    setResetPasswordData(id);
  };
  const closeResetPasswordModal = () => {
    setIsResetPasswordOpen(false);
  };
  const openAddEmployee = () => {
    setIsAddOpen(true);
  };
  const closeAddEmployee = () => {
    setIsAddOpen(false);
  };
  const openDeleteEmployee = (data) => {
    setIsDeleteOpen(true);
    setIsdeleteData(data);
  };
  const closeDeleteEmployee = () => {
    setIsDeleteOpen(false);
  };

  //function to get department details
  const fetchDepartment = async () => {
    try {
      const res = await Axios.get(`department/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const departmentAllData = (res.data?.data || []).map((activity) => ({
          value: activity.id||"",
          label: activity.name||"",
        }));
        setDepartments(departmentAllData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  const fetchEmploymentType = async () => {
    try {
      const res = await Axios.get("employment-type/list");
      if (res.status && res.status >= 200 && res.status < 300) {
        const employmentTypeData = (res.data?.data || []).map((data) => ({
          value: data.id|"",
          label: data.name||"",
        }));
        setEmploymentType(employmentTypeData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //useeffect to call function when component will be mount
  useEffect(() => {
    fetchEmploymentType();
    fetchDepartment();
  }, []);

  //sending csv file value to api
  const handleFileChange = async (e) => {
    const type = e.target.files[0].type.split("/").pop();
    const formData = new FormData();
    formData.append("csv_file", e.target.files[0]);

    if (type === "csv") {
      setDisableImportBtn(true);
      try {
        const res = await Axios.post("user/upload-csv", formData);
        if (res.status && res.status >= 200 && res.status < 300) {
          e.target.value = null;
          setDisableImportBtn(false);
          toast.success(res.data.message);
          dispatch(setPage(1));
          dispatch(refresh());
        }
      } catch (error) {
        e.target.value = null;
        setDisableImportBtn(false);
        toast.error(error.response.data.message);
      }
    } else {
      e.target.value = null;
      toast.error("only .csv file allowed");
    }
  };

  //state to store employee name
  const [name, setName] = useState();
  //state to store employee department
  const [department, setDepartment] = useState();
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
  //function to store employee name in redux store to fetch employee details
  const handlesetEmployeeName = (e) => {
    setName(e.target.value);
    dispatch(setEmployeeName(e.target.value));
  };
  //function to store department name in redux store to fetch employee details
  const handlesetDepartmentId = (e) => {
    setDepartment(e);
    dispatch(setDepartmentId(e.value));
  };
  //function to get employee details based on searched value
  const handleClick = () => {
    if (params.name || params.department_id) {
      dispatch(setPage(1));
      dispatch(refresh());
    } else {
      toast.info(
        "to search employee list you have to select atleast one field"
      );
    }
  };
  //function to reset all field value and to get all employee details
  const handleReset = () => {
    setName("");
    setDepartment(null);
    dispatch(setPage(1));
    dispatch(setEmployeeName(null));
    dispatch(setDepartmentId(null));
    dispatch(refresh());
  };
  //useeffect to send request to redux store when component mount
  useEffect(() => {
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
            <span>Employee List</span>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {hasPermission("user_create") && (
                <Stack direction="row" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="cardHeaderBtn h-35"
                    sx={{ mr: 2 }}
                    onClick={openAddEmployee}
                  >
                    Add
                  </Button>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    <Tooltip title="Import CSV file to add employee">
                      <Box className="uploadFile-btn" sx={{ mr: 2 }}>
                        <input
                          type="file"
                          id="csv_btn"
                          accept=".csv"
                          onChange={handleFileChange}
                          disabled={disableImportBtn}
                        />
                        <label htmlFor="csv_btn">
                          <MdUploadFile color="success" size={20} />
                        </label>
                        {disableImportBtn && (
                          <LinearProgress
                            sx={{ width: "100%", marginTop: "5px" }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </div>
                  <Tooltip title="Download sample CSV file">
                    <a
                      href={addEmployeeSamplefile}
                      download={addEmployeeSamplefile.split("/").pop()}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        className="cardHeaderBtn h-35"
                        style={{ minWidth: "42px" }}
                      >
                        <FaFileDownload size={18} />
                      </Button>
                    </a>
                  </Tooltip>
                </Stack>
              )}
            </Stack>
          </Stack>

          <CardContent>
            <Grid container spacing={2} p={0} sx={{ mb: 5 }}>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">Department List</InputLabel>
                <Select
                  placeholder="Select Department"
                  name="department_id"
                  options={departments}
                  value={department}
                  onChange={handlesetDepartmentId}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel className="fixlabel">Employee Name</InputLabel>
                <TextField
                  id="leaveType"
                  placeholder="Enter Employee Name"
                  value={name}
                  name="name"
                  onChange={handlesetEmployeeName}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <InputLabel className="fixlabel">&nbsp;</InputLabel>

                <LoadingButton
                  variant="contained"
                  className="primary-btn h-40 text-capitalize"
                  color="primary"
                  startIcon={<Search />}
                  onClick={handleClick}
                  // loading={isLoading}
                >
                  Search
                </LoadingButton>
              </Grid>
              <Grid>
                <LoadingButton
                  variant="outlined"
                  className=" h-40 text-capitalize"
                  sx={{ marginTop: "45px", width: "100px", marginLeft: "15px" }}
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </LoadingButton>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {isLoading ? (
                <EmployeeListSkeleton numberOfBox={6} />
              ) : data?.length > 0 ? (
                data.map((data, index) => {
                  return (
                    <Grid item xs={2} sm={12} md={6} lg={6} xl={4} key={index}>
                      <Card
                        variant="outlined"
                        className="cardBox employeeListBox"
                      >
                        <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                          {data.image ? (
                            <Avatar
                              alt="Remy Sharp"
                              src={data.image}
                              sx={{ width: 60, height: 60 }}
                            />
                          ) : (
                            <>
                              <Avatar
                                alt="Remy Sharp"
                                sx={{ width: 60, height: 60 }}
                              />
                            </>
                          )}

                          <Box component="div">
                            <Typography
                              component="h2"
                              className="heading-2"
                              mb={1}
                            >
                              {`${
                                data?.honorific ? `${data?.honorific} ` : ""
                              }${data?.first_name || ""} ${
                                data?.middle_name ? `${data.middle_name} ` : ""
                              }${data?.last_name || ""}`}
                            </Typography>
                            <Typography
                              component="p"
                              className="heading-3"
                              mb={1}
                            >
                              {data.designation?.name || "N/A"}
                            </Typography>
                            <Typography
                              component="p"
                              className="heading-4"
                              mb={1}
                            >
                              Employee ID:{" "}
                              <Typography component="span">
                                {data.employee_id || "N/A"}
                              </Typography>
                            </Typography>
                            <Typography
                              component="p"
                              className="heading-4"
                              mb={1}
                            >
                              Email:{" "}
                              <Typography component="span">
                                {data.email || "N/A"}
                              </Typography>
                            </Typography>
                            <Typography
                              component="p"
                              className="heading-4"
                              mb={1}
                            >
                              Department:{" "}
                              <Typography component="span">
                                {" "}
                                {data.department?.name || "N/A"}
                              </Typography>
                            </Typography>
                            <Typography
                              component="p"
                              className="heading-4"
                              mb={1}
                            >
                              Mobile No:{" "}
                              <Typography component="span">
                                {data?.personal_details?.phone || "N/A"}
                              </Typography>
                            </Typography>
                            {/* <Box className="progress-circle">
                              <ProgressCircle value={80} />
                            </Box> */}
                          </Box>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          className="card-footer"
                          sx={{ paddingY: "0px !important" }}
                        >
                          <Typography
                            component="p"
                            className="heading-4"
                            mb={0}
                          >
                            DOJ:{" "}
                            <Typography component="span">
                              {data?.joining?.length > 0
                                ? data?.joining[data.joining.length - 1]
                                    ?.date_of_joining
                                : "N/A"}
                            </Typography>
                          </Typography>
                          <Stack direction="row">
                            {hasPermission("user_reset_password") && (
                              <Tooltip title="Reset Password">
                                <IconButton
                                  aria-label="VisibilityIcon"
                                  color="primary"
                                  onClick={() => {
                                    openResetPasswordModal(data.id);
                                  }}
                                >
                                  <LockResetIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* <Tooltip title="View Profile">
                              <Link to={`/employee-profile/${data.id}`}>
                                {" "}
                                <IconButton
                                  aria-label="VisibilityIcon"
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Link>
                            </Tooltip> */}

                            {hasPermission("user_update") && (
                              <Tooltip title="View/Edit Profile">
                                <Link to={`/employee-profile/${data.id}`}>
                                  {" "}
                                  <IconButton
                                    aria-label="VisibilityIcon"
                                    color="primary"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                            )}
                            {hasPermission("user_deactivate") && (
                              <Tooltip title="Deactivate Employee">
                                <IconButton
                                  aria-label="DeleteIcon"
                                  color="error"
                                  onClick={() => {
                                    openDeleteEmployee(data);
                                  }}
                                >
                                  <PersonOffIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Grid container justifyContent="center">
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <p>No Employee Found</p>
                  </Grid>
                </Grid>
              )}
            </Grid>
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

      {/* <Stack spacing={2}>
      <Pagination count={1} showFirstButton showLastButton />
     
    </Stack> */}
      {isAddOpen && (
        <AddEmployee
          isAddOpen={isAddOpen}
          closeAddEmployee={closeAddEmployee}
          employmentType={employmentType}
        />
      )}
      {isDeleteOpen && (
        <DeleteEmployee
          isDeleteOpen={isDeleteOpen}
          closeDeleteEmployee={closeDeleteEmployee}
          deleteData={deleteData}
        />
      )}
      {isResetPasswordOpen && (
        <EmployeeResetPasswordModal
          isResetPasswordOpen={isResetPasswordOpen}
          closeResetPasswordModal={closeResetPasswordModal}
          resetPasswordData={resetPasswordData}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeList;
