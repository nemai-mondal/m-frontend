/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refresh, setDepartmentName } from "@/redux/ProjectSlice";
const DeleteResources = ({
  isDeleteOpen,
  deleteResourceData,
  closeDeleteResource,
  fields,
  setFields,
  getProjectDetail,
  errors,
setErrors
}) => {
  const dispatch = useDispatch();
  const { data, dept_id, projectData } = deleteResourceData;
  const { Axios } = useAxios();
  const [hasData, setHasData] = useState("");
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if ((projectData?.task_and_target||[])?.length > 0) {
      const hasDataValue = projectData.task_and_target.some(
        ({ department }) => department?.id? department.id === dept_id.value:false
      );
      setHasData(hasDataValue);
    } else {
      setHasData(false);
    }
  }, [projectData, dept_id]);
  //function to delete data
  const deleteData = async () => {
    fields.splice(data, 1);
    errors.splice(data,1)
    if (hasData) {
      let transformedDataList = []; // Initialize an array to hold transformed data
      (fields||[]).map(async (data) => {
        const transformedData = { ...data };
        if (
          transformedData?.department_id &&
          typeof transformedData.department_id === "object"
        ) {
          transformedData.department_id = transformedData.department_id.value;
        }
        if (
          transformedData?.user_ids &&
          Array.isArray(transformedData.user_ids)
        ) {
          transformedData.user_ids = (transformedData.user_ids||[]).map(
            (user) => user.value||null
          );
        }
        transformedDataList.push(transformedData);
      });
      const payload = {
        step: 2,
        resources: transformedDataList,
      };

      setLoading(true);
      try {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success("Resource Deleted Successfully");
          if (projectData.id) {
            getProjectDetail(projectData.id);
          }
          closeDeleteResource(false);
        }
      } catch (error) {
        // if (error.response && error.response.status === 422) {
        //   toast.error(error?.response?.data?.message || "");
        // }
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
        closeDeleteResource(false);
      }
    } else {
      setLoading(true);
      setFields(fields);
      setErrors(errors)
      setLoading(false);
      closeDeleteResource(false);
    }
  };
  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={isDeleteOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isDeleteOpen}>
        <Box className="modalContainer xs delete-modal">
          <Box className="modalBody">
            <Typography
              textAlign="center"
              component="h4"
              className="modal-title"
            >
              {/* <p>{`${deleteProjectData?.name || "N/A"}`}</p> */}
            </Typography>
            <Typography textAlign="center" component="p" className="text">
              Are you want to delete this?
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                color="primary"
                variant="outlined"
                size="large"
                fullWidth
                className=" text-capitalize"
                onClick={closeDeleteResource}
              >
                Cancel
              </Button>

              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                color="error"
                onClick={deleteData}
                loading={loading}
              >
                Delete
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteResources;
