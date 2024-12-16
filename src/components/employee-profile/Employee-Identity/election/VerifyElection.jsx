/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  Button,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import { FaEye } from "react-icons/fa";
import FileSaver from "file-saver";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
const VerifyElection = ({
  verifyElectionOpen,
  verifyElectionData,
  closeVerifyElection,
  getEmployeeDetails,
}) => {
  const { Axios } = useAxios();
  const onDownload = (data) => {
    FileSaver.saveAs(data, data.split("/").pop());
  };
  const [loading, setLoading] = useState(false);
  const verification = async (data) => {
    setLoading(true);
    try {
      const res = await Axios.post(
        `user/verify-voter/${verifyElectionData.id}?_method=put`,
        { lock: data }
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeVerifyElection(false);
        getEmployeeDetails(verifyElectionData.user_id, 1);
        toast.success(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={verifyElectionOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={verifyElectionOpen}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Election Card
            </Typography>

            <IconButton
              aria-label="close"
              color="error"
              onClick={closeVerifyElection}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
            <Grid spacing={2}>
              <InputLabel className="fixlabel">
                <p>{`Name: ${verifyElectionData.name || "N/A"}`}</p> <br />
                <p>{`Card Number: ${verifyElectionData.number || "N/A"}`}</p> <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ margin: 0 }}>View Identity:</p>
                  {verifyElectionData?.file ? (
                    // <a
                    //   href={`https://docs.google.com/gview?url=${verifyElectionData.file}&embedded=true`}
                    //   rel="noopener noreferrer"
                    //   target="_blank"
                    // >
                    <FaEye
                      style={{
                        fontSize: "22px",
                        color: "gray",
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        onDownload(verifyElectionData.file);
                      }}
                    />
                  ) : (
                    // </a>
                    "N/A"
                  )}
                </div>
              </InputLabel>
            </Grid>
          </Box>
          <Box className="modalFooter">
            <Stack spacing={2} direction="row" justifyContent="flex-start">
              {verifyElectionData?.lock === 0 ? (
                <LoadingButton
                  variant="contained"
                  className="text-capitalize"
                  color="primary"
                  onClick={() => {
                    verification(1);
                  }}
                  disabled={loading}
                >
                  Approve
                </LoadingButton>
              ) : verifyElectionData?.lock === 1 ? (
                <Button
                  variant="outlined"
                  color="error"
                  className="text-capitalize"
                  onClick={() => {
                    verification(0);
                  }}
                  disabled={loading}
                >
                  Reject
                </Button>
              ) : verifyElectionData?.lock === null ? (
                <>
                  <LoadingButton
                    variant="contained"
                    className="text-capitalize"
                    color="primary"
                    onClick={() => {
                      verification(1);
                    }}
                    disabled={loading}
                  >
                    Approve
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    color="error"
                    className="text-capitalize"
                    onClick={() => {
                      verification(0);
                    }}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                ""
              )}
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default VerifyElection;
