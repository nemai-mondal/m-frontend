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
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { refresh } from "@/redux/CandidateListSlice";
import { refresh as interviewRefresh } from "../../../redux/InterviewListSlice";
import { useDispatch } from "react-redux";
const DeleteCandidate = ({
  isDeleteOpen,
  deleteCandidateData,
  closeDeleteCandidate,
  candidate,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete quote
  const deleteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(
        `interview/delete/${deleteCandidateData.id}`
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteCandidate();
        if (candidate === "candidate") {
          toast.success("Candidate deleted successfully");
        } else {
          toast.success(res.data.message);
        }

        //dispatch to send request to redux store
        dispatch(refresh());
        dispatch(interviewRefresh());
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.error(error.response.data.message);
        closeDeleteCandidate();
      }
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  return (
    <>
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
                {deleteCandidateData.name || ""}
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
                  onClick={closeDeleteCandidate}
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
    </>
  );
};

export default DeleteCandidate;
