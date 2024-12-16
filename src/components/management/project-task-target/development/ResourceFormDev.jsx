/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MultipleResourceFormDev from "./MultipleResourceFormDev";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import DeleteResources from "./DeleteResources";
const ResourceFormDev = ({
  projectData,
  getProjectDetail,
  employees,
  departments,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState("");

  const [deleteResourceData, setDeleteResourceData] = useState("");

  const openDeleteResource = (data, dept_id) => {
    setIsDeleteOpen(true);
    setDeleteResourceData({
      data: data || "",
      dept_id: dept_id || "",
      projectData: projectData || {},
    });
  };
  const closeDeleteResource = () => {
    setIsDeleteOpen(false);
  };
  // const[timeMismatch,setTimeMismatch]=useState("")
  // const[totalTime,setTotalTime]=useState("")
  const [user, setUser] = useState(new Array(1));
  //state to store initial field for error
  const [errors, setErrors] = useState([
    {
      department_id: null,
      estimation_value: null,
      user_ids: null,
    },
  ]);
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //state to store initial field
  const [fields, setFields] = useState([
    {
      project_id: projectData.id,
      department_id: null,
      estimation_value: null,
      estimation_type: "Hours",
      user_ids: [],
    },
  ]);
  //state to store next id of field
  const [nextUniqueId, setNextUniqueId] = useState(1);

  //function to add field when user will click on add button
  const handleAddField = () => {
    const error = {
      department_id: null,
      estimation_value: null,
      user_ids: null,
    };
    const newField = {
      project_id: projectData.id,
      department_id: null,
      estimation_value: null,
      estimation_type: "Hours",
      user_ids: [],
    };
    setFields([...fields, newField]);
    setErrors([...errors, error]);
    const newUser = [...user, undefined];
    setUser(newUser);
    setNextUniqueId(nextUniqueId + 1);
  };
  //function to delete field
  const handleDeleteField = (index, dept_id) => {
    openDeleteResource(index, dept_id);
  };

  const isDepartmentFound = (id) => {
    let state = true;
    fields?.forEach((el) => {
      if (el?.department_id?.value) {
        if (id === el?.department_id?.value) {
          state = false;
        }
      }
    });
    return state;
  };

  const handleDepartments = () => {
    return departments?.filter((el) => isDepartmentFound(el?.value));
  };

  //function to set data in field
  const handleSetData = (key, val, index) => {
    const getData = (fields || []).map((el, i) => {
      if (i === index) {
        const updatedErrors = [...errors]; // Create a copy of the errors array

        // Update the error message for the specified key at the specified index
        updatedErrors[index][key] = null;

        // Update the state of errors with the new array
        setErrors(updatedErrors);
        if (key == "department_id") {
          return { ...el, [key]: val, user_ids: [] };
        }
        return { ...el, [key]: val };
      }
      return el; // Return the element unchanged for other indices
    });

    setFields(getData);
  };
  //function to get data from field
  const handleGetData = (key, index) => {
    const fieldAtIndex = fields[index]; // Access the field object at the specified index
    return fieldAtIndex[key]; // Access the value corresponding to the key
  };
  //funtion to submit data
  const handelSubmitData = async () => {
    // Create a new array to hold the updated errors
    const updatedErrors = [...errors];
    let transformedDataList = []; // Initialize an array to hold transformed data
    (fields || []).map(async (data, index) => {
      if (!data.department_id) {
        updatedErrors[index]["department_id"] = "Department Id Is Required";
      } else {
        updatedErrors[index]["department_id"] = null;
      }
      if ((data.user_ids || []).length === 0) {
        updatedErrors[index]["user_ids"] = "Resource Is Required";
      } else {
        updatedErrors[index]["user_ids"] = null;
      }

      // Update the state of errors with the new array
      setErrors(updatedErrors);

      // Only proceed with API call if there are no errors for this field

      const transformedData = { ...data };

      if (
        transformedData?.department_id &&
        typeof transformedData.department_id === "object"
      ) {
        transformedData.department_id = transformedData.department_id.value;
      }

      if (transformedData.user_ids && Array.isArray(transformedData.user_ids)) {
        transformedData.user_ids = transformedData.user_ids.map(
          (user) => user.value
        );
      }
      // if (data.estimation_value === "") {
      //   transformedData.estimation_value = null;
      // }
      // Push the transformed data to the list
      transformedDataList.push(transformedData);
    });
    const hasError = errors.some((error) =>
      Object.values(error).some((value) => value !== null)
    );

    if (hasError) {
      return;
    } else {
      const payload = {
        step: 2,
        resources: transformedDataList,
      };

      setLoading(true);
      try {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success(res.data?.message || "Resource Added Successfully");
          if (projectData.id) {
            getProjectDetail(projectData.id);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          toast.error(error?.response?.data?.message || "");
        }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getUser = async (id, unique_id) => {
    try {
      const res = await Axios.get(`department/get-user/${id}`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setUser((prevUser) => {
          const upateUsers = [...prevUser];
          upateUsers[unique_id] = (res.data?.data || []).map((m) => {
            return {
              value: m.id || "",
              label: `${m?.honorific ? `${m?.honorific} ` : ""}${
                m?.first_name || ""
              } ${m?.middle_name ? `${m.middle_name} ` : ""}${
                m?.last_name || ""
              }-${m.employee_id || ""}`,
            };
          });
          return upateUsers;
        });
        // setUser(
        //   (res.data?.data || []).map((m) => {
        //     return {
        //       value: m.id,
        //       label: `${m?.honorific ? `${m?.honorific} ` : ""}${
        //         m?.first_name || ""
        //       } ${m?.middle_name ? `${m.middle_name} ` : ""}${
        //         m?.last_name || ""
        //       }-${m.employee_id || ""}`,
        //     };
        //   })
        // );
      }
    } catch (error) {
      ("");
    }
  };
  //useeffect to add field based on whatever data present inside projectData
  useEffect(() => {
    if ((projectData?.task_and_target || []).length > 0) {
      let projectResourceData = (projectData.task_and_target || []).map(
        (item, index) => {
          item?.department?.id ? getUser(item.department.id, index) : "";
          return {
            project_id: projectData.id || null,
            department_id: item.department
              ? { label: item.department.name, value: item.department.id }
              : "",
            estimation_value: item.estimation_value || null,
            estimation_type: item.estimation_type || null,
            user_ids:
              item.users && (item?.users || []).length > 0
                ? item.users.map((el) => ({
                    value: el.user?.id || null,
                    label: `${
                      el?.user?.honorific ? `${el?.user?.honorific} ` : ""
                    }${el?.user?.first_name || ""} ${
                      el?.user?.middle_name ? `${el?.user.middle_name} ` : ""
                    }${el?.user?.last_name || ""}-${
                      el?.user.employee_id || ""
                    }`,
                  }))
                : [],
          };
        }
      );
      setUser(new Array(projectResourceData || [].length));
      setErrors(
        new Array((projectResourceData || []).length).fill({
          department_id: null,
          estimation_value: null,
          user_ids: null,
        })
      );
      setFields(projectResourceData);
      setNextUniqueId((projectData?.resources || []).length);
    }
  }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Typography component={"h2"} className="heading-5">
        Project Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <Box component={"div"} className="text-group">
            <Typography variant="h4">Project Title</Typography>
            <Typography variant="p">{projectData.name || "N/A"}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3} lg={3}>
          <Box component={"div"} className="text-group">
            <Typography variant="h4">Project Manager</Typography>
            <Typography variant="p">
              {" "}
              {projectData.project_manager
                ? `${
                    projectData.project_manager?.honorific
                      ? `${projectData.project_manager?.honorific} `
                      : ""
                  }${projectData.project_manager?.first_name || ""} ${
                    projectData.project_manager?.middle_name
                      ? `${projectData.project_manager.middle_name} `
                      : ""
                  }${projectData.project_manager?.last_name || ""}-${
                    projectData.project_manager?.employee_id || ""
                  }`
                : "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <Box component={"div"} className="text-group">
            <Typography variant="h4">Start Date</Typography>
            <Typography variant="p">
              {projectData.start_date || "N/A"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <Box component={"div"} className="text-group">
            <Typography variant="h4">End Date</Typography>
            <Typography variant="p">{projectData.end_date || "N/A"}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <Box component={"div"} className="text-group">
            <Typography variant="h4">Total Estimated Hours</Typography>
            <Typography variant="p">
              {projectData.estimation_value
                ? projectData.estimation_type === "Day"
                  ? `${projectData.estimation_value * 8} Hours`
                  : `${projectData.estimation_value} Hours`
                : "N/A"}
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
          onClick={handleAddField}
        >
          Add
        </Button>
      </Stack>
      {fields.map((projectData, index) => (
        <MultipleResourceFormDev
          key={index}
          unique_id={index}
          projectResource={projectData}
          handleSetData={handleSetData}
          employees={employees}
          departments={handleDepartments()}
          handleGetData={handleGetData}
          handleDeleteField={handleDeleteField}
          errors={errors}
          getUser={getUser}
          user={user[index]}
        />
      ))}
      {fields?.length > 0 ? (
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
            onClick={handelSubmitData}
            loading={loading}
          >
            save
            {/* {Object.keys(projectData?.resources[0] || []).length > 0
            ? "Update"
          : "Save"} */}
          </LoadingButton>
          <Link to={"/task/dev/list"}>
            <Button
              variant="outlined"
              color="primary"
              className="text-capitalize"
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      ) : (
        ""
      )}
      {isDeleteOpen && (
        <DeleteResources
          isDeleteOpen={isDeleteOpen}
          deleteResourceData={deleteResourceData}
          closeDeleteResource={closeDeleteResource}
          fields={fields}
          setFields={setFields}
          errors={errors}
          setErrors={setErrors}
          getProjectDetail={getProjectDetail}
        />
      )}
    </Box>
  );
};

export default ResourceFormDev;
