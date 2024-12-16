import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Select from "react-select";
import { Padding, Search } from "@mui/icons-material";
import { ImagePath } from "@/ImagePath";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ProgressCircle from "@/components/common/progress";

const EmployeeList = () => {
  const selectDepartment = [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
  ];

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
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              className="cardHeaderBtn"
            >
              Add
            </Button>
          </Stack>
          <CardContent>
            <Grid container spacing={2} p={0} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <InputLabel className="fixlabel">Department Name</InputLabel>
                <Select
                  placeholder="Department Name"
                  name="Department Name"
                  options={selectDepartment}
                  className="basic-multi-select selectTag"
                  classNamePrefix="select"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <InputLabel className="fixlabel">Employee Name</InputLabel>
                <TextField
                  id="leaveType"
                  placeholder="Enter Employee Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={2}>
                <InputLabel className="fixlabel">&nbsp;</InputLabel>
                <Button
                  color="primary"
                  variant="contained"
                  className="primary-btn h-40 text-capitalize"
                  startIcon={<Search />}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                <Card variant="outlined" className="cardBox employeeListBox">
                  <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={ImagePath.Avtar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box component="div">
                      <Typography component="h2" className="heading-2" mb={1}>
                        Ahmad Franci
                      </Typography>
                      <Typography component="p" className="heading-3" mb={1}>
                        Senior HR Manager{" "}
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Employee ID:{" "}
                        <Typography component="span">EMP01002</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Email:{" "}
                        <Typography component="span">
                          gianamadsen@demomail.com
                        </Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Department:{" "}
                        <Typography component="span">Design</Typography>
                      </Typography>
                      <Typography component="p" className="heading-4" mb={1}>
                        Mobile No:{" "}
                        <Typography component="span">7980****65</Typography>
                      </Typography>
                      <Box className="progress-circle">
                        <ProgressCircle value={80} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="card-footer"
                    sx={{ paddingY: "0px !important" }}
                  >
                    <Typography component="p" className="heading-4" mb={0}>
                      DOJ: <Typography component="span">20-Jan-2024</Typography>
                    </Typography>
                    <Stack direction="row">
                      <IconButton aria-label="VisibilityIcon" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton aria-label="ModeEditIcon" color="success">
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton aria-label="DeleteIcon" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default EmployeeList;
