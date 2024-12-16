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
const VerifyAadhaar = ({
  verifyAadhaarOpen,
  verifyAadhaarData,
  closeVerifyAadhaar,
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
        `user/verify-adhaar/${verifyAadhaarData.id}?_method=put`,
        { lock: data }
      );

      if (res.status && res.status >= 200 && res.status < 300) {
        setLoading(false);
        closeVerifyAadhaar(false);
        getEmployeeDetails(verifyAadhaarData.user_id, 1);
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
      open={verifyAadhaarOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={verifyAadhaarOpen}>
        <Box className="modalContainer sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="modalHeader"
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Aadhaar Card
            </Typography>

            <IconButton
              aria-label="close"
              color="error"
              onClick={closeVerifyAadhaar}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box className="modalBody scroll-y scroll-y-hidden  h-60vh">
            <Grid spacing={2}>
              <InputLabel className="fixlabel">
                <p>{`Name: ${verifyAadhaarData.name || "N/A"}`}</p> <br />
                <p>{`Card Number: ${verifyAadhaarData.adhaar_no || "N/A"}`}</p>{" "}
                <br />
                <p>{`Enrollment Number: ${
                  verifyAadhaarData.enrollment_no || "N/A"
                }`}</p>{" "}
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ margin: 0 }}>View Identity:</p>
                  {verifyAadhaarData?.file ? (
                    // <a
                    //   href={`https://docs.google.com/gview?url=${verifyAadhaarData.file}&embedded=true`}
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
                        onDownload(verifyAadhaarData.file);
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
              {verifyAadhaarData?.lock === 0 ? (
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
              ) : verifyAadhaarData?.lock === 1 ? (
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
              ) : verifyAadhaarData?.lock === null ? (
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

export default VerifyAadhaar;
