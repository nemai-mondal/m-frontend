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
import { refresh } from "@/redux/AmendmentSlice";
import { useDispatch } from "react-redux";
const DeleteMultiAmendment = ({
  isMultiDeleteOpen,
  deleteMultiDocumentData,
  closeDeleteMultiCandidate,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
  //function to delete amendment
  const deleteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios.post(`amendment/multi-delete`, {
        amendment_ids: deleteMultiDocumentData,
      });

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeDeleteMultiCandidate();
        //dispatch to send request to redux store
        dispatch(refresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        closeDeleteMultiCandidate();
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
        open={isMultiDeleteOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isMultiDeleteOpen}>
          <Box className="modalContainer xs delete-modal">
            <Box className="modalBody">
              <Typography textAlign="center" component="p" className="text">
                {`Are you sure want to delete ${deleteMultiDocumentData.length} document permanently?`}
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  fullWidth
                  className=" text-capitalize"
                  onClick={closeDeleteMultiCandidate}
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

export default DeleteMultiAmendment;
