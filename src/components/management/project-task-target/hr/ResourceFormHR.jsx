import { useState, Fragment, useEffect } from "react";
import { Box, Grid, Stack, Button, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import "../style.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import DeleteModal from "./DeleteResourceModal";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import AssignedResource from "./Resource";
import { merge } from "lodash";

const AssignedResourceFormHR = ({
  projectData,
  designations,
  activities,
  getProjectDetails,
}) => {
  const initialResource = { designation: "", activities, employees: [] };
  const { Axios } = useAxios();

  // Assigned Resource
  const [addAssignResource, setAddAssignResource] = useState([initialResource]);

  // store resource errors. If data missing while sending payload
  const [resourceErrors, setResourceErros] = useState([]);

  const [resourceUploadigState, setResourceUploadingState] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState(false);

  const handleAddAssignResource = (resource) => {
    const { key, value, index } = resource;
    const newAddAssignResource = addAssignResource?.map((el, i) => {
      if (i == index) {
        if (key === "designation") {
          return { ...el, [key]: value, employees: [] };
        }
        if (key === "employees") {
          return { ...el, employees: value };
        }
        return { ...el, [key]: value };
      }
      return el;
    });
    setAddAssignResource(newAddAssignResource);
    handleValidation(newAddAssignResource, index, key);
  };

  const handleDeleteSource = (index, resource) => {
    setIsDeleteModalOpen(true);
    setDeleteModalData({ ...resource, index });
  };

  const handleAddSource = () => {
    const newprojectData = [...addAssignResource, initialResource];
    const newResourcesErros = [...resourceErrors, {}];
    setAddAssignResource(newprojectData);
    setResourceErros(newResourcesErros);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteResource = (index, addAssignResource) => {
    const newResources = addAssignResource?.filter((_, i) => i !== index);
    const newResourcesErros = resourceErrors?.filter((_, i) => i !== index);
    setResourceErros(newResourcesErros);
    setAddAssignResource(newResources);
    closeDeleteModal();
  };

  const handleValidation = (resources, index, key) => {
    const newErrors = [...resourceErrors];
    resources.forEach((el, i) => {
      let obj = {};
      if (i === index) {
        if (key == "designation" && !el?.designation) {
          obj["designation_id_error"] = "Designation is required";
        } else if (key == "designation" && el?.designation) {
          obj["designation_id_error"] = "";
        }
        if (
          key == "employees" &&
          (!el?.employees || el.employees.length === 0)
        ) {
          obj["user_ids_error"] = "Employees required";
        } else if (
          key == "employees" &&
          (el?.employees || el.employees.length >= 1)
        ) {
          obj["user_ids_error"] = "";
        }
      }

      newErrors[i] = { ...newErrors[i], ...obj };
    });

    setResourceErros(newErrors);
    return;
  };

  const handlePayloadValidation = (resources) => {
    let obj = {};
    let status = false;
    const newErrors = [...resourceErrors];
    resources.forEach((el, i) => {
      if (!el?.designation) {
        obj["designation_id_error"] = "Designation is required";
        status = true;
      } else if (el?.designation) {
        obj["designation_id_error"] = "";
      }

      if (!el?.employees || el.employees.length === 0) {
        obj["user_ids_error"] = "Employees required";
        status = true;
      } else if (el?.employees || el.employees.length >= 1) {
        obj["user_ids_error"] = "";
      }
      newErrors[i] = { ...newErrors[i], ...obj };
    });
    setResourceErros(newErrors);

    return status;
  };
  const handleSubmit = async (addAssignResource, message) => {
    if (handlePayloadValidation(addAssignResource)) {
      return;
    }

    let resources = addAssignResource.map((el) => {
      let obj = {
        project_id: projectData?.id,
        department_id: null,
        department_name: "hr",
      };

      obj["designation_id"] = el?.designation?.value || "";
      obj["user_ids"] = el?.employees?.map((el) => el?.value);
      const activityObj = {
        daily: null,
        wewkly: null,
        monthly: null,
      };
      obj["activity"] = el?.activities
        ?.filter((el) => el?.checked)
        ?.map((elem) => ({
          ...activityObj,
          id: elem?.id,
          [elem?.type?.toLowerCase() || "daily"]: elem.value || null,
        }));
      return obj;
    });
    const payload = {
      step: "4",
      resources,
    };
    try {
      setResourceUploadingState(true);
      const res = await Axios.post("project/create", payload);

      if (res.status && res.status >= 200 && res.status < 300) {
        toast.success(message || res?.data?.message || "New Resources Added");
        getProjectDetails(projectData?.id);
      }
    } catch (error) {
      setResourceUploadingState(false);
      if (error.response && error.response.status === 422) {
        toast.error(error.response?.data?.message || "Invalid Data");
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setResourceUploadingState(false);
    }
  };

  const isDesignationFound = (id) => {
    let state = true;
    addAssignResource?.forEach((el) => {
      if (el?.designation?.value) {
        if (id === el?.designation?.value) {
          state = false;
        }
      }
    });
    return state;
  };

  const handleDesignations = () => {
    return designations?.filter((el) => isDesignationFound(el?.value));
  };

  useEffect(() => {
    if (
      projectData?.task_and_target &&
      projectData?.task_and_target?.length >= 1
    ) {
      const newTastTargets = projectData?.task_and_target?.map((el, i) => {
        let obj = {};
        obj["designation"] = {
          value: el?.designation?.id,
          label: el?.designation?.name,
        };
        obj["employees"] =
          el?.users?.map((user) => ({
            value: user.id,
            label: user?.first_name + " " + user?.last_name,
          })) || [];
        let newActivities = activities;
        el?.activities.forEach((activity) => {
          const index = activities.findIndex(({ id }) => id === activity.id);
          if (index !== -1) {
            newActivities = newActivities.map((el, i1) => {
              if (i1 === index) {
                return {
                  ...activity,
                  checked: true,
                  value:
                    activity?.daily ||
                    activity?.weekly ||
                    activity?.monthly ||
                    "",
                  type: activity?.daily
                    ? "daily"
                    : activity?.weekly
                    ? "weekly"
                    : "monthly",
                };
              }
              return el;
            });
          }
        });
        obj["activities"] = newActivities || [];
        return obj;
      });
      setAddAssignResource(newTastTargets);
    }
  }, [projectData?.task_and_target]);
  return (
    <Fragment>
      <Box sx={{ p: 3 }}>
        <Typography component={"h2"} className="heading-5">
          Project Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Box component={"div"} className="text-group">
              <Typography variant="h4">Project Title</Typography>
              <Typography variant="p">{projectData?.name || "N/A"}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Box component={"div"} className="text-group">
              <Typography variant="h4">Project Manager</Typography>
              <Typography variant="p">
                {projectData?.project_manager
                  ? projectData?.project_manager?.honorific +
                    " " +
                    projectData?.project_manager?.first_name +
                    " " +
                    projectData?.project_manager?.middle_name +
                    " " +
                    projectData?.project_manager?.last_name +
                    " "
                  : "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Box component={"div"} className="text-group">
              <Typography variant="h4">Start Date</Typography>
              <Typography variant="p">
                {projectData?.start_date || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Box component={"div"} className="text-group">
              <Typography variant="h4">End Date</Typography>
              <Typography variant="p">
                {projectData?.end_date || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="heading-5"
          alignItems={"center"}
          sx={{ mt: 4, mb: 4 }}
        >
          <Typography
            component="h2"
            className="heading-5"
            border={0}
            mb={0}
            pb={0}
          >
            Assigned Resource
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            className="text-capitalize"
            onClick={handleAddSource}
          >
            Add
          </Button>
        </Stack>

        {addAssignResource?.length >= 1 &&
          addAssignResource?.map((resource, index) => (
            <AssignedResource
              key={index}
              handleAddAssignResource={handleAddAssignResource}
              resource={resource}
              index={index}
              handleDeleteSource={handleDeleteSource}
              resourceErrors={resourceErrors}
              designations={handleDesignations()}
              activities={activities}
              resourcesArrayLength={addAssignResource?.length || 1}
            />
          ))}

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          sx={{ mt: 4 }}
        >
          <LoadingButton
            loading={resourceUploadigState}
            variant="contained"
            className="text-capitalize"
            color="primary"
            onClick={() => handleSubmit(addAssignResource)}
          >
            Save
          </LoadingButton>

          {/* <Button
            variant="outlined"
            color="primary"
            className="text-capitalize"
          >
            Cancel
          </Button> */}

          <Link to="/task/hr/list">
            <Button
              variant="outlined"
              color="primary"
              className="text-capitalize"
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Box>

      {
        <DeleteModal
          isDeleteModalOpen={isDeleteModalOpen}
          deleteModalData={deleteModalData}
          closeDeleteModal={closeDeleteModal}
          deleteResource={deleteResource}
          addAssignResource={addAssignResource}
        />
      }
    </Fragment>
  );
};

export default AssignedResourceFormHR;
