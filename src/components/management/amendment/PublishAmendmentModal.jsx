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
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { refresh } from "@/redux/AmendmentSlice";
import { useDispatch } from "react-redux";
const PublishAmendmentModal = ({
  isPublishOpen,
  publishData,
  closePublishModal,
}) => {
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { Axios } = useAxios();
  //state to show loading animation
  const [loading, setLoading] = useState(false);
//function to publish and un publish amendment
  const publishUnpublish = async () => {
    setLoading(true);
    try {
      const res = await Axios.post(
        `amendment/publish-amendment/${publishData.id}?_method=put`,
        { status: !publishData.status }
      );
      if (res.status && res.status >= 200 && res.status < 300) {
        dispatch(refresh());
        closePublishModal(false);
        {
          publishData.status === 0
            ? toast.success("Document Published Successfully")
            : toast.success("Document Un Published Successfully");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={isPublishOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isPublishOpen}>
        <Box className="modalContainer xs delete-modal">
          <Box className="modalBody">
            <Typography
              textAlign="center"
              component="h4"
              className="modal-title"
            >
              {publishData?.name || "N/A"}
            </Typography>
            <Typography textAlign="center" component="p" className="text">
              {`Are you want to ${
                publishData.status === 0 ? "publish" : "un publish"
              } this document?`}
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                color="primary"
                variant="outlined"
                size="large"
                fullWidth
                className=" text-capitalize"
                onClick={closePublishModal}
              >
                Cancel
              </Button>
              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                color="success"
                onClick={publishUnpublish}
                loading={loading}
              >
                {publishData.status === 0 ? "Publish" : "Un Publish"}
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PublishAmendmentModal;
