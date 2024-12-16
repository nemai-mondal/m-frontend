import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Stack,
  CardContent,
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { ImagePath } from "@/ImagePath";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useParams } from "react-router-dom";
import "./employee-profile.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import EmployeeAboutForm from "./EmployeeAboutForm";
import EmployeeJoiningDetailsForm from "./EmployeeJoiningDetails";
import EmployeeOrganizationDetailsForm from "./EmployeeOrganizationDetails";
import EmployeeAttendanceInformationForm from "./EmployeeAttendanceInformation";
import EmployeeEmployeeIdentityForm from "./Employee-Identity/EmployeeIdentity";
import EmployeeOtherDetails from "./Employee-Other-Details/EmployeeOtherDetails";
import EmployeeSeparationDetailsForm from "./EmployeeSeparationDetails";
import EmployeeDocumentsForm from "./Employee-Documents/EmployeeDocuments";
import EmployeeAssets from "./Employee-Assets/EmployeeAssets";
import { useAxios } from "@/contexts/AxiosProvider";
import { AuthContext } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import EmployeePersonalDetails from "./personal-details/EmployeePersonalDetails";
import moment from "moment";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AdminCredentialsModal from "./personal-details/AdminAccessModal";
import AdminAccessModal from "./personal-details/AdminAccessModal";
import EmplyeeProfileSkeleten from "./personal-details/EmplyeeProfileSkeleten";

const EmployeeProfile = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const { Axios } = useAxios();
  const [editAccessOpen, setAccessOpen] = useState("");
  const [editAccessData, setAccessData] = useState("");
  //to open edit modal and store edit data
  const openEditAdminAccessModal = (data) => {
    setAccessOpen(true);
    setAccessData(data);
  };
  //to close edit modal
  const closeEditAdminAccessModal = () => {
    setAccessOpen(false);
  };
  //useparams to get is from url
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  //state to store emp details

  const [employeeDetails, setEmployeeDetails] = useState({});
  const [employmentType, setEmploymentType] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [imageSizeExceeded, setImageSizeExceeded] = useState(false);
  //state to store particular department designation
  const [departmentDesignations, setDepartmentDesignations] = useState([]);
  const fetchDepartment = async () => {
    try {
      const res = await Axios.get(`department/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const department = (res.data?.data || []).map((data) => ({
          value: data.id,
          label: data.name,
        }));
        setDepartment(department);
        setDepartmentDesignations(
          (res.data?.data || []).reduce((accumulator, { designations }) => {
            if (designations.length > 0) {
              accumulator.push(
                ...designations.map((designation) => designation)
              );
            }
            return accumulator;
          }, [])
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  const fetchDesignation = async () => {
    try {
      const res = await Axios.get(`designation/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const designation = (res.data?.data || []).map((data) => ({
          value: data.id,
          label: data.name,
        }));
        setDesignation(designation);
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
          value: data.id,
          label: data.name,
        }));
        setEmploymentType(employmentTypeData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  const currentPathname = window.location.pathname;
  const [reload, setReload] = useState(true);
  //function to get employee details
  const getEmployeeDetails = async (personalid, force) => {
    if (personalid && force === 1) {
      let payload;
      if (personalid) {
        payload = personalid;
      }

      setLoading(true);
      try {
        const res = await Axios.get(`user/show/${payload}`);
        if (res.status && res.status >= 200 && res.status < 300) {
          setEmployeeDetails(res.data?.data || {});
          if ((res.data?.data?.id || {}) === user?.id) {
            setReload(false);
            setUser(res?.data?.data || {});
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    } else {
      let payload;
      if (personalid) {
        payload = personalid;
      }

      setLoading(true);
      try {
        const res = await Axios.get(`user/show/${payload}`);
        if (res.status && res.status >= 200 && res.status < 300) {
          setEmployeeDetails(res.data?.data || {});
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  //useeffect to call function when component will be mount
  useEffect(() => {
    if (id) {
      getEmployeeDetails(id);
    }
  }, [id]);
  useEffect(() => {
    if (!id && user.id && currentPathname === "/profile" && reload) {
      getEmployeeDetails(user.id);
    }
  }, [user, currentPathname]);
  useEffect(() => {
    fetchEmploymentType();
    fetchDepartment();
    fetchDesignation();
  }, []);
  const [disable, setDisable] = useState(false);
  //function to send image file to api
  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file && file.size >= 2 * 1024 * 1024) {
      setImageSizeExceeded(true);
      return;
    } else {
      setImageSizeExceeded(false);
    }
    const type = e.target.files[0].type.split("/").pop();
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("step", 3);
    formData.append("user_id",employeeDetails.id);
    if (type === "jpeg" || type === "png" || type === "jpg") {
      setDisable(true);
      try {
        const res = await Axios.post(
          "user/update-profile?_method=put",
          formData
        );
        if (res.status && res.status >= 200 && res.status < 300) {
          setDisable(false);
          getEmployeeDetails(employeeDetails.id, 1);
        }
      } catch (error) {
        setDisable(false);
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      }
    } else {
      setDisable(false);
      toast.error("only .jpeg, .jpg and .png file allowed");
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox quote" sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Employee Profile</span>
          </Stack>
          <CardContent className="employee-profile">
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Stack className="profileStructure">
                  <Box className="profile--warp">
                    <Box className="profile-dp">
                      {employeeDetails.image ? (
                        <img
                          src={employeeDetails.image}
                          className="employee-profile-dp"
                        />
                      ) : (
                        <Avatar
                          sx={{ width: 120, height: 120, borderRadius: "50%" }}
                          variant="rounded"
                        />
                      )}
                      <Box component={"div"} className="dpuploadBtn">
                        <input
                          type="file"
                          id="dp_upload"
                          accept=".jpeg, .jpg, .png"
                          onChange={handleFileInput}
                        />

                        <label htmlFor="dp_upload">
                          <CameraAltIcon />{" "}
                        </label>
                      </Box>
                    </Box>
                    {disable && (
                      <LinearProgress
                        sx={{
                          width: "50px",
                          marginTop: "5px",
                          marginLeft: "60px",
                        }}
                      />
                    )}
                    <Typography
                      style={{ position: "relative" }}
                      component={"span"}
                      className="dp-info"
                    >
                      <InfoOutlinedIcon /> Profile DP W:200px H:160px
                      {imageSizeExceeded && (
                        <>
                          {", "}
                          <span
                            style={{
                              color: "#ff3a3d",
                              position: "absolute",
                              paddingLeft: "5px",
                              width: "200px",
                              top: 0,
                            }}
                          >
                            maximum 2 MB allowed.
                          </span>
                        </>
                      )}
                    </Typography>
                  </Box>

                  <Box className="w-100">
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        pb: 2,
                      }}
                    >
                      <Box>
                        <Typography component="h5" className="title">
                          {`${
                            employeeDetails?.honorific
                              ? `${employeeDetails?.honorific} `
                              : ""
                          }${employeeDetails?.first_name || ""} ${
                            employeeDetails?.middle_name
                              ? `${employeeDetails.middle_name} `
                              : ""
                          }${employeeDetails?.last_name || ""} `}

                          {employeeDetails?.status === 1 ? (
                            <Chip
                              label="Active"
                              color="success"
                              variant="contained"
                              size="small"
                              className="chip success"
                            />
                          ) : employeeDetails?.status === 0 ? (
                            <Chip
                              label="Deactive"
                              color="success"
                              variant="contained"
                              size="small"
                              className="chip error"
                            />
                          ) : (
                            "N/A"
                          )}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          className="user-details"
                        >
                          <Typography component="p">
                            <WorkIcon />{" "}
                            {employeeDetails?.personal_details
                              ?.place_of_birth || "N/A"}
                          </Typography>
                          <Typography component="p">
                            <EmailIcon />{" "}
                            <Link
                              to={`mailto:${employeeDetails.email || "N/A"}`}
                            >
                              {employeeDetails.email || "N/A"}
                            </Link>
                          </Typography>
                          <Typography component="p">
                            <LocalPhoneIcon />{" "}
                            {employeeDetails?.personal_details?.phone || "N/A"}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box>
                        {hasPermission("user_update") && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            className="text-capitalize"
                            onClick={() => {
                              openEditAdminAccessModal(employeeDetails);
                            }}
                          >
                            {" "}
                            Edit
                          </Button>
                        )}
                      </Box>
                    </Stack>
                    <Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={9}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          flexWrap={"wrap"}
                          className="profile-info"
                        >
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              Job Title
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {employeeDetails?.designation?.name || "N/A"}
                            </Typography>
                          </Box>
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              Department
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {employeeDetails?.department?.name || "N/A"}
                            </Typography>
                          </Box>
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              Emp ID
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {employeeDetails?.employee_id || "N/A"}
                            </Typography>
                          </Box>
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              Machine Code
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {employeeDetails?.assets?.length > 0
                                ? employeeDetails.assets.map(
                                    (data, index) =>
                                      `${data.sr_no}${
                                        employeeDetails?.assets[index + 1]
                                          ? `, `
                                          : ""
                                      }`
                                  )
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              DOJ
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {employeeDetails?.joining?.length > 0
                                ? employeeDetails?.joining[
                                    employeeDetails.joining.length - 1
                                  ]?.date_of_joining || "N/A"
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box className="userList" mt={2}>
                            <Typography
                              component="p"
                              className="smallText"
                              mb={0.5}
                            >
                              Reporting To
                            </Typography>
                            <Typography component="h6" className="avtarName">
                              {/* <Link to="#"> */}
                              {employeeDetails?.reporting_manager?.id
                                ? `${
                                    employeeDetails.reporting_manager?.honorific
                                      ? `${employeeDetails.reporting_manager?.honorific} `
                                      : ""
                                  }${
                                    employeeDetails.reporting_manager
                                      ?.first_name || ""
                                  } ${
                                    employeeDetails.reporting_manager
                                      ?.middle_name
                                      ? `${employeeDetails.reporting_manager.middle_name} `
                                      : ""
                                  }${
                                    employeeDetails.reporting_manager
                                      ?.last_name || ""
                                  }`
                                : "N/A"}

                              {/* </Link> */}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>

          <Tabs
            className="line-tab min-h-tab-panel-400"
            style={{ marginTop: 30 }}
          >
            <TabList className="tab-list-wrap">
              <Tab>About</Tab>
              <Tab>Joining Details</Tab>
              <Tab>Organization Details</Tab>
              <Tab>Attendance Info</Tab>
              <Tab>Employee Identity</Tab>
              <Tab>Personal Details</Tab>
              <Tab>Other Details</Tab>
              <Tab>Separation</Tab>
              <Tab>Documents</Tab>
              <Tab>Assets</Tab>
            </TabList>
            {loading ? (
              <EmplyeeProfileSkeleten />
            ) : (
              <>
                <TabPanel>
                  <EmployeeAboutForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeJoiningDetailsForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                    employmentType={employmentType}
                  />{" "}
                </TabPanel>
                <TabPanel>
                  <EmployeeOrganizationDetailsForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                    department={department}
                    departmentDesignations={departmentDesignations}
                    designation={designation}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeAttendanceInformationForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                    department={department}
                  />{" "}
                </TabPanel>
                <TabPanel>
                  <EmployeeEmployeeIdentityForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeePersonalDetails
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeOtherDetails
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeSeparationDetailsForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeDocumentsForm
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
                <TabPanel>
                  <EmployeeAssets
                    employeeDetails={employeeDetails}
                    getEmployeeDetails={getEmployeeDetails}
                  />
                </TabPanel>
              </>
            )}
          </Tabs>
        </Card>
        {editAccessOpen && (
          <AdminAccessModal
            editAccessOpen={editAccessOpen}
            editAccessData={editAccessData}
            closeEditAdminAccessModal={closeEditAdminAccessModal}
            getEmployeeDetails={getEmployeeDetails}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default EmployeeProfile;
