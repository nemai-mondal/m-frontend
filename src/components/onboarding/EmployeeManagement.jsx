import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  Stack,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  InputLabel,
  TextField,
  FormHelperText,
  FormGroup,
} from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { ImagePath } from "@/ImagePath";
import { useFormik } from "formik";
import { AddEmployeeSchema } from "@/validations/AddEmployeeSchema";
import Select from "react-select";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";

const EmployeeManagement = () => {
  const { Axios } = useAxios();

  const options = [
    { value: "MR", label: "MR" },
    { value: "MS", label: "MS" },
  ];
  const options1 = [
    { value: "hr", label: "hr" },
    { value: "admin", label: "admin" },
  ];
  const options2 = [
    { value: "developer", label: "developer" },
    { value: "tester", label: "tester" },
  ];
  const options3 = [{ value: "full stack", label: "full stack" }];

  //For Modal open close
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //For delete confirmation Modal open close
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [loading, setLoading] = useState(false);
  const [roleDetails, setRoleDetails] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [user, setUserData] = useState([]);
  const [userIdDelete, setUserIdDelete] = useState();

  const initialValues = {
    honorifics: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    joining_date: new Date(),
    date_of_birth: "",
    company_email: "",
    password: "",
    role: "",
    department: "",
    designation: "",
    phone: "",
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: AddEmployeeSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = { userid, name, email, password, role, departmentId };
      try {
        const { data } = await Axios.post("user/create", payload);

        if (data.status === true) {
          setLoading(false);
          setOpen(false);
          fetchUserData();
        }
      } catch (error) {
        setLoading(false);
        if (error.response.status === 422) {
          setErrors({ email_exist: "User Already Exist" });
        }
      }
    },
  });
  const handleChangejoining_date = (name, value) => {
    setValues({ ...values, [name]: value });
  };
  const handleChangedate_of_birth = (name, value) => {
    setValues({ ...values, [name]: value });
  };
  //fetching user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get(`user/list`);
      if (data) {
        setLoading(false);
        setUserData(data.data);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //deleting user
  const deleteUser = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.delete(`user/delete/${userIdDelete}`);

      if (data.status === true) {
        setLoading(false);
        setOpen1(false);
        fetchUserData();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getRoleDetails = async () => {
    try {
      const data = await Axios.get("role/list");

      if (data.status && data.status === 200) {
        setRoleDetails(data.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  const getDepartment = async () => {
    try {
      const data = await Axios.get("department/list");

      if (data.status && data.status === 200) {
        setDepartment(data.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  const getDesignation = async () => {
    try {
      const data = await Axios.get("designation/list");

      if (data.status && data.status === 200) {
        setDesignation(data.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  useEffect(() => {
    getRoleDetails();
    getDepartment();
    getDesignation();
  }, []);
  if (loading) {
    return (
      <div className="login-container">
        <img src={ImagePath.loadingImage1} alt="" className="login-loading" />
      </div>
    );
  }
  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <h2>Employee Management</h2>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <Typography color="text.primary">Employee Management</Typography>
        </Breadcrumbs>

        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Add Employee</span>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              className="cardHeaderBtn"
              onClick={handleOpen}
            >
              Add Employee
            </Button>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Role</TableCell>
                    <TableCell align="left">Dept. ID</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.length > 0 ? (
                    user.map((data) => {
                      return (
                        <React.Fragment key={data.id}>
                          <TableRow>
                            <TableCell align="left">{data.name}</TableCell>
                            <TableCell align="left">{data.email}</TableCell>
                            <TableCell align="left">N/A</TableCell>
                            <TableCell align="left">N/A</TableCell>
                            <TableCell align="right">
                              <IconButton aria-label="edit" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => {
                                  handleOpen1();
                                  setUserIdDelete(data.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Employees Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open1}>
          <Box className="modalContainer sm">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Are You Sure Want To Delete?
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={handleClose1}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody">
              <Stack spacing={2}></Stack>
            </Box>
            <Box className="modalFooter">
              <Stack spacing={10} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="error"
                  onClick={deleteUser}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ClearIcon />}
                  color="success"
                  onClick={handleClose1}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box className="modalContainer sm">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="modalHeader"
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Add Employee
              </Typography>
              <IconButton
                aria-label="close"
                color="error"
                onClick={handleClose}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box className="modalBody scroll-y hvh-50">
              <Stack spacing={2}>
                <InputLabel className="fixlabel">Employee ID</InputLabel>
                <TextField
                  id="UserId"
                  placeholder="Employee ID"
                  variant="outlined"
                  // value={values.honorifics}
                  fullWidth
                  name="employee_id"
                  size="small"
                  onChange={handleChange}
                />
                <Select
                  // defaultValue={selectedOption}
                  className="selectTag"
                  onChange={options}
                  options={options}
                />
                <FormGroup>
                  <InputLabel>First Name</InputLabel>
                  <TextField
                    id="UserId"
                    placeholder="First Name"
                    variant="outlined"
                    value={values.first_name}
                    fullWidth
                    name="first_name"
                    size="small"
                    onChange={handleChange}
                    error={
                      errors.first_name ? Boolean(errors.first_name) : null
                    }
                    helperText={errors.first_name ? errors.first_name : null}
                  />
                </FormGroup>
                <FormGroup>
                  <InputLabel>Middle Name</InputLabel>
                  <TextField
                    id="UserId"
                    placeholder="Middle Name"
                    variant="outlined"
                    value={values.middle_name}
                    fullWidth
                    name="Middle Name"
                    size="small"
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <InputLabel>Last Name</InputLabel>
                  <TextField
                    id="fullName"
                    placeholder="Last Name"
                    variant="outlined"
                    fullWidth
                    name="last_name"
                    size="small"
                    value={values.last_name}
                    onChange={handleChange}
                    error={errors.last_name ? Boolean(errors.last_name) : null}
                    helperText={errors.last_name ? errors.last_name : null}
                  />
                </FormGroup>
                <FormGroup>
                  <InputLabel>Phone Number</InputLabel>
                  <PhoneInput
                    name="phone"
                    defaultCountry="in"
                    value={values.phone}
                    onChange={(phone, { country }) => {
                      setFieldValue("phone", phone);
                    }}
                  />
                  {errors.phone ? (
                    <FormHelperText className="error-msg">
                      {errors.phone}
                    </FormHelperText>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <InputLabel>Enter Joining Date</InputLabel>
                  <DatePicker
                    popperPlacement="top-start"
                    selected={values.joining_date}
                    className="dateTime-picker calender-icon"
                    name="joining_date"
                    onChange={(date) => {
                      handleChangejoining_date("joining_date", date);
                    }}
                  />
                  {errors.joining_date ? (
                    <FormHelperText className="error-msg">
                      {errors.joining_date}
                    </FormHelperText>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <InputLabel>Enter Date of Birth</InputLabel>
                  <DatePicker
                    popperPlacement="top-start"
                    selected={values.date_of_birth}
                    className="dateTime-picker calender-icon"
                    name="date_of_birth"
                    onChange={(date) => {
                      handleChangedate_of_birth("date_of_birth", date);
                    }}
                  />
                  {errors.date_of_birth ? (
                    <FormHelperText className="error-msg">
                      {errors.date_of_birth}
                    </FormHelperText>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    id="email"
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                    name="company_email" // Correct field name
                    onChange={handleChange}
                    size="small"
                    error={Boolean(errors.company_email)}
                    helperText={errors.company_email}
                  />
                </FormGroup>

                <Select
                  // defaultValue={selectedOption}
                  className="selectTag"
                  placeholder="role"
                  onChange={options1}
                  options={options1}
                />

                <Select
                  // defaultValue={selectedOption}
                  className="selectTag"
                  placeholder="Department"
                  onChange={options2}
                  options={options2}
                />
                <Select
                  // defaultValue={selectedOptionpla
                  className="selectTag"
                  placeholder="Designation"
                  onChange={options3}
                  options={options3}
                />
              </Stack>
            </Box>
            <Box className="modalFooter">
              <Stack spacing={2} direction="row" justifyContent="end">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  startIcon={<AddIcon />}
                >
                  {" "}
                  Add
                </Button>
                <Button variant="contained" color="error">
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default EmployeeManagement;
