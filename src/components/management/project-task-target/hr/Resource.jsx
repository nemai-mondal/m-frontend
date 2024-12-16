import { Fragment, useEffect, useState } from "react";
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Select from "react-select";
import { useAxios } from "@/contexts/AxiosProvider";
import CloseIcon from "@mui/icons-material/Close";

const AssignedResource = ({
  handleAddAssignResource,
  resource,
  index,
  handleDeleteSource,
  resourceErrors,
  designations,
  resourcesArrayLength,
}) => {
  const { Axios } = useAxios();
  const [employeeList, setEmployeeList] = useState();

  const getEmployessList = async (value) => {
    try {
      if (!value) return;
      const res = await Axios.get(`designation/get-user/${value}`);

      const newData = res?.data?.data?.map((el) => ({
        value: el.id,
        label: el?.first_name || "" + " " + el?.last_name || "",
      }));
      setEmployeeList(newData);
    } catch (e) {
      console.log("Error Unable to fetch LeaveTypeList");
    }
  };

  const handleAddAssignActivity = (data) => {
    const { key, value, acitivityIndex } = data;
    const updatedActivities = resource.activities.map((activity, index) => {
      if (index === acitivityIndex) {
        return { ...activity, [key]: value };
      }
      return activity;
    });

    handleAddAssignResource({
      key: "activities",
      value: updatedActivities,
      index,
    });
  };
  useEffect(() => {
    if (resource?.designation) {
      getEmployessList(resource?.designation.value);
    }
  }, [resource?.designation]);

  return (
    <Grid container spacing={2} className="row-wrap">
      <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
        <FormGroup>
          <InputLabel className="fixlabel">
            Designation<span>*</span>
          </InputLabel>
          <Select
            placeholder="Select Designation"
            options={
              resource?.designation?.value
                ? [...designations, resource?.designation]
                : designations
            }
            className="basic-multi-select selectTag"
            classNamePrefix="select"
            name={"designation"}
            value={resource?.designation}
            onChange={(selectedOption) => {
              handleAddAssignResource({
                key: "designation",
                value: selectedOption,
                index,
              });
            }}
          />
          {resourceErrors?.[index]?.designation_id_error ? (
            <Typography component="span" className="error-msg">
              {resourceErrors?.[index]?.designation_id_error}
            </Typography>
          ) : null}
        </FormGroup>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
        <FormGroup
          sx={{
            input: {
              cursor: employeeList?.length >= 1 ? "auto" : "not-allowed",
            },
          }}
        >
          <InputLabel className="fixlabel">
            Name<span>*</span>
          </InputLabel>
          <Select
            key={resource?.designation?.value | index}
            placeholder="Slect Name"
            options={employeeList}
            isMulti
            value={resource?.employees || []}
            onChange={(selectedOption) => {
              handleAddAssignResource({
                key: "employees",
                value: selectedOption,
                index,
              });
            }}
            className="basic-multi-select selectTag"
            classNamePrefix="select"
          />
          {resourceErrors?.[index]?.user_ids_error ? (
            <Typography component="span" className="error-msg">
              {resourceErrors?.[index]?.user_ids_error}
            </Typography>
          ) : null}
        </FormGroup>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
        <FormGroup>
          <InputLabel className="fixlabel">Task & Target</InputLabel>
          <Stack direction={"row"} alignItems={"flex-start"} spacing={2}>
            <Box component={"div"} className="task-border">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <InputLabel className="fixlabel">Activity</InputLabel>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <InputLabel className="fixlabel">Target</InputLabel>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <InputLabel className="fixlabel isMobileHide">
                    Activity
                  </InputLabel>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <InputLabel className="fixlabel isMobileHide">
                    Target
                  </InputLabel>
                </Grid>
              </Grid>
              <Grid container spacing={3} alignItems={"center"}>
                {resource?.activities?.length >= 1 ? (
                  resource?.activities?.map((el, i) => (
                    <Fragment key={el?.id}>
                      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <FormGroup className="checkbox-group">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="checked"
                                checked={el?.checked || false}
                                onChange={(e) =>
                                  handleAddAssignActivity({
                                    key: "checked",
                                    value: e.target.checked,
                                    acitivityIndex: i,
                                    index,
                                    activities: resource?.activities,
                                  })
                                }
                              />
                            }
                            label={el.name}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <Stack
                          component={"div"}
                          direction={"row"}
                          alignItems={"center"}
                          className="input-dropdown sm"
                        >
                          <input
                            type="text"
                            name="value"
                            style={{
                              fontSize: "5px",
                              border: resource?.activities?.[i]?.value_error
                                ? `2px solid #ff3a3d`
                                : "",
                            }}
                            value={el?.value || ""}
                            onChange={(e) => {
                              const pattern = /^\d{1,10}$/;
                              if (
                                pattern.test(e.target.value) ||
                                e.target.value == ""
                              ) {
                                handleAddAssignActivity({
                                  key: "value",
                                  value: e.target.value,
                                  acitivityIndex: i,
                                  resourceIndex: index,
                                  activities: resource?.activities,
                                });
                              }
                            }}
                            placeholder="Target"
                          />

                          <select
                            name="type"
                            value={el?.type || "karthik"}
                            onChange={(e) =>
                              handleAddAssignActivity({
                                key: "type",
                                value: e.target.value,
                                acitivityIndex: i,
                                index,
                                activities: resource?.activities,
                              })
                            }
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </Stack>
                      </Grid>
                    </Fragment>
                  ))
                ) : (
                  <Box
                    sx={{
                      padding: 3,
                      textAlign: "center",
                      margin: 2,
                      width: "100%",
                    }}
                  >
                    No Activities found
                  </Box>
                )}
              </Grid>
            </Box>

            {resourcesArrayLength !== 1 && index !== 0 && (
              <IconButton
                aria-label="Remove"
                className="round-color"
                onClick={() => handleDeleteSource(index, resource)}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default AssignedResource;
