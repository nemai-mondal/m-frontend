/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MultipleResourceFormMarketing from "./MultipleResourceFormMarketing";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { Link } from "react-router-dom";
import DeleteResourceModal from "./DeleteResource";
import { LoadingButton } from "@mui/lab";
const ResourceFormMarketing = ({
  projectData,
  designations,
  activities,
  getProjectDetail,
}) => {
  const initialResource = {
    designation: "",
    employees: [],
    activities: activities,
  };
  const [resources, setResources] = useState([initialResource]);
  //state to store initial field for error

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModaldata, setDeleteModalData] = useState({});

  const [errors, setErrors] = useState([]);
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);

  const closeDeleteModal = () => {
    setDeleteModalData({});
    setDeleteModalOpen(false);
  };

  //function to add field when user will click on add button
  const handleAddResource = () => {
    setResources([...resources, initialResource]);
    const newResourcesErros = [...errors, {}];
    setErrors(newResourcesErros);
  };

  const handleDeleteSource = (index, resource) => {
    setDeleteModalOpen(true);
    setDeleteModalData({ ...resource, index });
  };

  const deleteResource = (index, resources) => {
    const newResources = resources?.filter((_, i) => i !== index);
    const newResourcesErros = errors?.filter((_, i) => i !== index);
    setErrors(newResourcesErros);
    setResources(newResources);
    closeDeleteModal();
  };

  //function to set data in field
  const handleResource = (key, value, index) => {
    const newResources = resources?.map((el, i) => {
      if (i == index) {
        if (key === "designation") {
          return { ...el, [key]: value, employees: [] };
        }
        return { ...el, [key]: value };
      }
      return el;
    });
    handleValidation(newResources, index, key);
    setResources(newResources);
  };

  const handleValidation = (resources, index, key) => {
    const newErrors = [...errors];
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

    setErrors(newErrors);
    return;
  };

  const handlePayloadValidation = (resources) => {
    let obj = {};
    let status = false;
    const newErrors = [...errors];
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
    setErrors(newErrors);

    return status;
  };
  //funtion to submit data
  const handleSubmit = async (resources) => {
    if (handlePayloadValidation(resources)) {
      return;
    }

    let newResources = resources.map((el) => {
      let obj = {
        project_id: projectData?.id,
        department_id: null,
        department_name: "marketing",
        user_ids: [],
        activity: [],
      };

      obj["designation_id"] = el?.designation?.value || "";
      obj["user_ids"] = el?.employees?.map((el) => el?.value) || [];
      obj["activity"] =
        el?.activities
          ?.filter((el) => el?.checked)
          ?.map((elem) => ({
            id: elem?.id,
            weekly: elem?.weekly,
            monthly: elem?.monthly,
          })) || [];
      return obj;
    });
    const payload = {
      step: "4",
      resources: newResources,
    };
    try {
      setLoading(true);
      const res = await Axios.post("project/create", payload);

      if (res.status && res.status >= 200 && res.status < 300) {
        toast.success(res?.data?.message || "New Resources Added");
        getProjectDetail(projectData?.id);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 422) {
        toast.error(error.response?.data?.message || "Invalid Data");
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  const isDesignationFound = (id) => {
    let state = true;
    resources?.forEach((el) => {
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
                return { ...activity, checked: true };
              }
              return el;
            });
          }
        });
        obj["activities"] = newActivities || [];
        return obj;
      });
      setResources(newTastTargets);
    }
  }, [projectData?.task_and_target]);
  return (
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
          onClick={handleAddResource}
        >
          Add
        </Button>
      </Stack>
      {resources?.length >= 1 &&
        resources.map((resource, index) => (
          <MultipleResourceFormMarketing
            key={index}
            unique_id={index}
            projectResource={resource}
            handleResource={handleResource}
            handleDeleteSource={handleDeleteSource}
            errors={errors}
            designations={handleDesignations()}
            length={resources?.length}
          />
        ))}

      <Stack
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        sx={{ mt: 4 }}
      >
        <LoadingButton
          variant="contained"
          color="primary"
          className="text-capitalize"
          onClick={() => handleSubmit(resources)}
          loading={loading}
        >
          save
        </LoadingButton>
        <Link to={"/task/marketing/list"}>
          <Button
            variant="outlined"
            color="primary"
            className="text-capitalize"
          >
            Cancel
          </Button>
        </Link>
      </Stack>

      <DeleteResourceModal
        resources={resources}
        isDeleteModalOpen={isDeleteModalOpen}
        deleteModalData={deleteModaldata}
        closeDeleteModal={closeDeleteModal}
        deleteResource={deleteResource}
      />
    </Box>
  );
};

export default ResourceFormMarketing;
