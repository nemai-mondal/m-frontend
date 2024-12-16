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
import { useCallback, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
const DeleteSalesProject = ({
  isDeleteModalOpen,
  closeDeleteModal,
  deleteData,
}) => {
  //dispatch to send request to redux store

  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      const newResources = [];
      deleteData?.designations?.forEach((designation) => {
        const designationActvities = {
          department_id: null,
          department_name: "sales",
          designation_id: designation?.id,
          project_id: deleteData?.id,
          activity: [],
          user_ids: [],
        };

        const activities = designation?.activities?.filter((activity) =>
          activity?.designation_id === deleteData?.designation_id
            ? activity?.id !== deleteData?.activity_id
            : true
        );

        const users = designation?.users.map((el) => el?.user?.id);

        designationActvities["activity"] = activities.map((el) => ({
          id: el?.activity_id,
          weekly: el?.weekly,
          monthly: el?.monthly,
        }));
        if (activities?.length >= 1) {
          newResources.push({ ...designationActvities, user_ids: users });
        }
      });
      const payload = {
        step: "5",
        resources: newResources,
        key: "update",
        project_id: deleteData?.id,
      };
      if (newResources?.length >= 1) {
        const res = await Axios.post("project/create", payload);

        if (res.status && res.status >= 200 && res.status < 300) {
          toast.success("Activity deleted successfully");
        }
      } else {
        const res = await Axios.delete(`project/delete/${deleteData.id}`);

        if (res.status && res.status >= 200 && res.status < 300) {
          setLoading(false);
          toast.success("Activity deleted successfully");
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Unable to connect to the server"
      );
    } finally {
      closeDeleteModal();
    }
  }, []);

  return (
    <>
      <Modal
        aria-labelledby=""
        aria-describedby=""
        open={isDeleteModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isDeleteModalOpen}>
          <Box className="modalContainer xs delete-modal">
            <Box className="modalBody">
              <Typography
                textAlign="center"
                component="h4"
                className="modal-title"
              >
                {deleteData.name}
              </Typography>
              <Typography textAlign="center" component="p" className="text">
                Are you want to delete this permanently?
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  fullWidth
                  className=" text-capitalize"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  loading={loading}
                >
                  Delete
                </LoadingButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DeleteSalesProject;
