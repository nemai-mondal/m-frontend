/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import "../style.css";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";

const MultipleResourceFormMarketing = ({
  unique_id,
  projectResource,
  designations,
  handleResource,
  length,
  handleDeleteSource,
  errors,
}) => {
  const { Axios } = useAxios();
  const [employeeList, setEmployeeList] = useState();

  const getEmployessList = async (value) => {
    try {
      if (!value) return;
      const res = await Axios.get(`designation/get-user/${value}`);

      const newData = res?.data?.data?.map((el) => ({
        value: el.id,
        label: el?.first_name + " " + el?.last_name,
      }));
      setEmployeeList(newData);
    } catch (e) {
      console.log("Error Unable to fetch LeaveTypeList");
    }
  };

  const handleActivities = (key, value, acitivityIndex, activities) => {
    const updatedActivities = activities.map((activity, index) => {
      if (index === acitivityIndex) {
        return { ...activity, [key]: value };
      }
      return activity;
    });

    handleResource("activities", updatedActivities, unique_id);
  };

  const handleInputNumber = (value) => {
    const inputValue = value;
    const regex = /^[0-9]*$/;
    if (regex.test(inputValue)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (projectResource?.designation) {
      getEmployessList(projectResource?.designation?.value);
    }
  }, [projectResource?.designation]);

  return (
    <React.Fragment>
      <Box>
        {/* 1st row Start 1 */}
        <Grid container spacing={2} className="row-wrap">
          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Designation<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Designation"
                options={
                  projectResource?.designation?.value
                    ? [...designations, projectResource?.designation]
                    : designations
                }
                value={projectResource?.designation}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onChange={(selectedOption) => {
                  getEmployessList(selectedOption?.value);
                  handleResource("designation", selectedOption, unique_id);
                }}
              />
              {errors?.[unique_id]?.designation_id_error ? (
                <Typography component="span" className="error-msg">
                  {errors?.[unique_id]?.designation_id_error}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
            <FormGroup>
              <InputLabel className="fixlabel">
                Name<span>*</span>
              </InputLabel>
              <Select
                placeholder="Select Name"
                options={employeeList}
                isMulti
                value={projectResource?.employees || []}
                className="basic-multi-select selectTag"
                classNamePrefix="select"
                onChange={(selectedOption) => {
                  handleResource("employees", selectedOption, unique_id);
                }}
              />
              {errors?.[unique_id]?.user_ids_error ? (
                <Typography component="span" className="error-msg">
                  {errors?.[unique_id]?.user_ids_error}
                </Typography>
              ) : null}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <FormGroup>
              <InputLabel className="fixlabel">Task & Target</InputLabel>
              <Stack direction={"row"} alignItems={"flex-start"} spacing={2}>
                <Box component={"div"} className="task-border">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                              <InputLabel className="fixlabel">
                                Activity
                              </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                              <InputLabel className="fixlabel">
                                Weekly
                              </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                              <InputLabel className="fixlabel">
                                Monthly
                              </InputLabel>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                              <InputLabel className="fixlabel">
                                Activity
                              </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                              <InputLabel className="fixlabel">
                                Weekly
                              </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                              <InputLabel className="fixlabel">
                                Monthly
                              </InputLabel>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        {projectResource?.activities?.map((el, i) => (
                          <Grid
                            key={i}
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                          >
                            <Grid
                              key={el?.id}
                              container
                              spacing={2}
                              alignItems={"center"}
                            >
                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup className="checkbox-group">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={el?.checked || false}
                                        onChange={(e) =>
                                          handleActivities(
                                            "checked",
                                            e.target.checked,
                                            i,
                                            projectResource?.activities
                                          )
                                        }
                                      />
                                    }
                                    label={el?.name || "N/A"}
                                  />
                                </FormGroup>
                              </Grid>
                              <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <input
                                  type="text"
                                  value={el?.weekly || ""}
                                  onChange={(e) => {
                                    const pattern = /^\d{1,10}$/;
                                    if (
                                      pattern.test(e.target.value) ||
                                      e.target.value == ""
                                    ) {
                                      handleInputNumber(e.target.value)
                                        ? handleActivities(
                                            "weekly",
                                            e.target.value,
                                            i,
                                            projectResource?.activities
                                          )
                                        : null;
                                    }
                                  }}
                                  className="extra-small-input"
                                />
                              </Grid>
                              <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <input
                                  type="text"
                                  value={el?.monthly || ""}
                                  onChange={(e) => {
                                    const pattern = /^\d{1,10}$/;
                                    if (
                                      pattern.test(e.target.value) ||
                                      e.target.value == ""
                                    ) {
                                      handleInputNumber(e.target.value)
                                        ? handleActivities(
                                            "monthly",
                                            e.target.value,
                                            i,
                                            projectResource?.activities
                                          )
                                        : null;
                                    }
                                  }}
                                  className="extra-small-input"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                {length !== 1 && unique_id !== 0 && (
                  <IconButton
                    aria-label="Remove"
                    className="round-color"
                    onClick={() => {
                      handleDeleteSource(unique_id, projectResource);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Stack>
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default MultipleResourceFormMarketing;
