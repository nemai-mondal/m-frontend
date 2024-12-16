import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";
import AddEditAadhaar from "./aadhaar/AddEditAadhaar";
import DeleteAadhaar from "./aadhaar/DeleteAadhaar";
import AddEditPan from "./pan/AddEditPan";
import DeletePan from "./pan/DeletePan";
import AddEditElection from "./election/AddEditElection";
import DeleteElection from "./election/DeleteElection";
import AddEditDrivingLicense from "./driving/AddEditDrivingLicense";
import DeleteDrivingLicense from "./driving/DeleteDrivingLicense";
import AddEditPassport from "./passport/AddEditPassport";
import DeletePassport from "./passport/DeletePassport";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifyAadhaar from "./aadhaar/VerifyAadhaar";
import VerifyPan from "./pan/VerifyPan";
import VerifyElection from "./election/VerifyElection";
import VerifyDrivingLicense from "./driving/verifyDrivingLicense";
import VerifyPassport from "./passport/VerifyPassport";
import { AuthContext } from "@/contexts/AuthProvider";
const EmployeeEmployeeIdentityForm = ({
  employeeDetails,
  getEmployeeDetails,
}) => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);

  const [aadharnumber, setAadharnumber] = useState(
    String(employeeDetails.adhaar?.adhaar_no || "N/A")
  );
  const [pan, setPan] = useState(String(employeeDetails.pan?.number || "N/A"));
  const [electionCard, setElectionCard] = useState(
    String(employeeDetails.voter_card?.number || "N/A")
  );
  const [drivingLicense, setDrivingLicense] = useState(
    String(employeeDetails.driving_license?.number || "N/A")
  );
  const [passport, setPassport] = useState(
    String(employeeDetails.passport?.number || "N/A")
  );
  function replacePhoneNumbers(passport) {
    var cuantos = passport.length;
    var modifiedPassport = [];

    for (var i = 0; i < cuantos; i++) {
      if (i > 2) {
        modifiedPassport[i] = "*";
      } else {
        modifiedPassport[i] = passport[i];
      }
    }

    var full_passport = modifiedPassport.join("");

    return full_passport;
  }

  const [showAadharnumber, setShowAadharnumber] = useState(true);
  const aadharnumberToggle = () => {
    setShowAadharnumber((show) => !show);
    showAadharnumber ? replacePhoneNumbers(aadharnumber) : aadharnumber;
  };

  const [showPan, setShowPan] = useState(true);
  const panToggle = () => {
    setShowPan((show) => !show);
    showPan ? replacePhoneNumbers(pan) : pan;
  };

  const [showElectionCard, setShowElectionCard] = useState(true);
  const electionCardToggle = () => {
    setShowElectionCard((show) => !show);
    showElectionCard ? replacePhoneNumbers(electionCard) : electionCard;
  };
  const [showDrivingLicense, setShowDrivingLicense] = useState(true);
  const drivingLicenseToggle = () => {
    setShowDrivingLicense((show) => !show);
    showDrivingLicense ? replacePhoneNumbers(drivingLicense) : drivingLicense;
  };
  const [showPassport, setShowPassport] = useState(true);
  const passportToggle = () => {
    setShowPassport((show) => !show);
    showPassport ? replacePhoneNumbers(passport) : passport;
  };

  //aadhaar
  const [isAddEditAadhaarOpen, setIsAddEditAadhaarOpen] = useState("");
  const [isDeleteAadhaarOpen, setIsDeleteAadhaarOpen] = useState("");
  const [verifyAadhaarOpen, setVerifyAadhaarOpen] = useState(false);
  const [verifyAadhaarData, setVerifyAadhaarData] = useState("");

  const openAddEditAadhaar = () => {
    setIsAddEditAadhaarOpen(true);
  };
  const closeAddEditAadhaar = () => {
    setIsAddEditAadhaarOpen(false);
  };
  const openDeleteAadhaar = () => {
    setIsDeleteAadhaarOpen(true);
  };
  const closeDeleteAadhaar = () => {
    setIsDeleteAadhaarOpen(false);
  };
  const openVerifyAadhaar = (data) => {
    setVerifyAadhaarOpen(true);
    setVerifyAadhaarData(data);
  };
  const closeVerifyAadhaar = () => {
    setVerifyAadhaarOpen(false);
  };

  //pan
  const [isAddEditPanOpen, setIsAddEditPanOpen] = useState("");
  const [isDeletePanOpen, setIsDeletePanOpen] = useState("");
  const [verifyPanOpen, setVerifyPanOpen] = useState(false);
  const [verifyPanData, setVerifyPanData] = useState("");

  const openAddEditPan = () => {
    setIsAddEditPanOpen(true);
  };
  const closeAddEditPan = () => {
    setIsAddEditPanOpen(false);
  };
  const openDeletePan = () => {
    setIsDeletePanOpen(true);
  };
  const closeDeletePan = () => {
    setIsDeletePanOpen(false);
  };
  const openVerifyPan = (data) => {
    setVerifyPanOpen(true);
    setVerifyPanData(data);
  };
  const closeVerifyPan = () => {
    setVerifyPanOpen(false);
  };

  //electionElection
  const [isAddEditElectionOpen, setIsAddEditElectionOpen] = useState("");
  const [isDeleteElectionOpen, setIsDeleteElectionOpen] = useState("");
  const [verifyElectionOpen, setVerifyElectionOpen] = useState(false);
  const [verifyElectionData, setVerifyElectionData] = useState("");

  const openAddEditElection = () => {
    setIsAddEditElectionOpen(true);
  };
  const closeAddEditElection = () => {
    setIsAddEditElectionOpen(false);
  };
  const openDeleteElection = () => {
    setIsDeleteElectionOpen(true);
  };
  const closeDeleteElection = () => {
    setIsDeleteElectionOpen(false);
  };
  const openVerifyElection = (data) => {
    setVerifyElectionOpen(true);
    setVerifyElectionData(data);
  };
  const closeVerifyElection = () => {
    setVerifyElectionOpen(false);
  };

  //driving
  const [isAddEditDrivingLicenseOpen, setIsAddEditDrivingLicenseOpen] =
    useState("");
  const [isDeleteDrivingLicenseOpen, setIsDeleteDrivingLicenseOpen] =
    useState("");
  const [verifyDrivingLicenseOpen, setVerifyDrivingLicenseOpen] = useState("");
  const [verifyDrivingLicenseData, setVerifyDrivingLicenseData] = useState("");

  const openAddEditDrivingLicense = () => {
    setIsAddEditDrivingLicenseOpen(true);
  };
  const closeAddEditDrivingLicense = () => {
    setIsAddEditDrivingLicenseOpen(false);
  };
  const openDeleteDrivingLicense = () => {
    setIsDeleteDrivingLicenseOpen(true);
  };
  const closeDeleteDrivingLicense = () => {
    setIsDeleteDrivingLicenseOpen(false);
  };
  const openVerifyDrivingLicense = (data) => {
    setVerifyDrivingLicenseOpen(true);
    setVerifyDrivingLicenseData(data);
  };
  const closeVerifyDrivingLicense = () => {
    setVerifyDrivingLicenseOpen(false);
  };

  //Passport
  const [isAddEditPassportOpen, setIsAddEditPassportOpen] = useState("");
  const [isDeletePassportOpen, setIsDeletePassportOpen] = useState("");
  const [verifyPassportOpen, setVerifyPassportOpen] = useState("");
  const [verifyPassportData, setVerifyPassportData] = useState("");

  const openAddEditPassport = () => {
    setIsAddEditPassportOpen(true);
  };
  const closeAddEditPassport = () => {
    setIsAddEditPassportOpen(false);
  };
  const openDeletePassport = () => {
    setIsDeletePassportOpen(true);
  };
  const closeDeletePassport = () => {
    setIsDeletePassportOpen(false);
  };
  const openVerifyPassport = (data) => {
    setVerifyPassportOpen(true);
    setVerifyPassportData(data);
  };
  const closeVerifyPassport = () => {
    setVerifyPassportOpen(false);
  };
  return (
    <React.Fragment>
      <Box p={3}>
        <Typography component="h2" className="heading-5" mb={0}>
          Employee Identity
        </Typography>
        <TableContainer
          sx={{ maxHeight: 350 }}
          className="table-striped scroll-y"
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={130} align="left" className="text-uppercase">
                  Identity Type Name
                </TableCell>
                <TableCell width={110} align="left" className="text-uppercase">
                  Identity Number
                </TableCell>
                <TableCell
                  width={110}
                  align="center"
                  className="text-uppercase"
                >
                  Approval Status
                </TableCell>
                <TableCell
                  width={110}
                  align="center"
                  className="text-uppercase"
                >
                  Approval Action
                </TableCell>
                <TableCell
                  width={110}
                  align="center"
                  className="text-uppercase"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Typography component="p" mb={0}>
                    Aadhaar Card Number
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {employeeDetails?.adhaar?.adhaar_no ? (
                    <>
                      {showAadharnumber
                        ? replacePhoneNumbers(aadharnumber)
                        : employeeDetails.adhaar.adhaar_no}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={aadharnumberToggle}
                        edge="end"
                      >
                        {showAadharnumber ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.adhaar?.lock === 0 ? (
                    <Chip
                      label="Not Verified"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  ) : employeeDetails?.adhaar?.lock === 1 ? (
                    <Chip
                      label="Verified"
                      color="success"
                      variant="contained"
                      size="small"
                      className="chip success"
                    />
                  ) : employeeDetails?.adhaar?.lock === null ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      variant="contained"
                      size="small"
                      className="chip warning"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  )}
                </TableCell>

                <TableCell align="center">
                  {employeeDetails?.adhaar?.lock === 0 ? (
                    <NoEncryptionGmailerrorredIcon />
                  ) : employeeDetails?.adhaar?.lock === 1 ? (
                    <LockIcon />
                  ) : (
                    <NoEncryptionGmailerrorredIcon />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.adhaar?.id ? (
                    <>
                      {hasPermission("user_update") && (
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            openVerifyAadhaar(employeeDetails.adhaar);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {employeeDetails?.adhaar?.lock !== 1 ? (
                        <>
                          <IconButton
                            aria-label="Edit"
                            onClick={openAddEditAadhaar}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={openDeleteAadhaar}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <IconButton aria-label="Add" onClick={openAddEditAadhaar}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Typography component="p" mb={0}>
                    Pan Card Number
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {employeeDetails?.pan?.number ? (
                    <>
                      {showPan
                        ? replacePhoneNumbers(pan)
                        : employeeDetails.pan.number}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={panToggle}
                        edge="end"
                      >
                        {showPan ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell align="center">
                  {employeeDetails?.pan?.lock === 0 ? (
                    <Chip
                      label="Not Verified"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  ) : employeeDetails?.pan?.lock === 1 ? (
                    <Chip
                      label="Verified"
                      color="success"
                      variant="contained"
                      size="small"
                      className="chip success"
                    />
                  ) : employeeDetails?.pan?.lock === null ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      variant="contained"
                      size="small"
                      className="chip warning"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.pan?.lock === 0 ? (
                    <NoEncryptionGmailerrorredIcon />
                  ) : employeeDetails?.pan?.lock === 1 ? (
                    <LockIcon />
                  ) : (
                    <NoEncryptionGmailerrorredIcon />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.pan?.id ? (
                    <>
                      {hasPermission("user_update") && (
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            openVerifyPan(employeeDetails?.pan);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {employeeDetails?.pan?.lock !== 1 ? (
                        <>
                          <IconButton
                            aria-label="Edit"
                            onClick={openAddEditPan}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={openDeletePan}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <IconButton aria-label="Add" onClick={openAddEditPan}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Typography component="p" mb={0}>
                    Election Card
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {employeeDetails?.voter_card?.number ? (
                    <>
                      {showElectionCard
                        ? replacePhoneNumbers(electionCard)
                        : employeeDetails.voter_card.number}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={electionCardToggle}
                        edge="end"
                      >
                        {showElectionCard ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell align="center">
                  {employeeDetails?.voter_card?.lock === 0 ? (
                    <Chip
                      label="Not Verified"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  ) : employeeDetails?.voter_card?.lock === 1 ? (
                    <Chip
                      label="Verified"
                      color="success"
                      variant="contained"
                      size="small"
                      className="chip success"
                    />
                  ) : employeeDetails?.voter_card?.lock === null ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      variant="contained"
                      size="small"
                      className="chip warning"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.voter_card?.lock === 0 ? (
                    <NoEncryptionGmailerrorredIcon />
                  ) : employeeDetails?.voter_card?.lock === 1 ? (
                    <LockIcon />
                  ) : (
                    <NoEncryptionGmailerrorredIcon />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.voter_card?.id ? (
                    <>
                      {hasPermission("user_update") && (
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            openVerifyElection(employeeDetails?.voter_card);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {employeeDetails?.voter_card?.lock !== 1 ? (
                        <>
                          <IconButton
                            aria-label="Edit"
                            onClick={openAddEditElection}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={openDeleteElection}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <IconButton aria-label="Add" onClick={openAddEditElection}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Typography component="p" mb={0}>
                    Driving License
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {employeeDetails?.driving_license?.number ? (
                    <>
                      {showDrivingLicense
                        ? replacePhoneNumbers(drivingLicense)
                        : employeeDetails.driving_license.number}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={drivingLicenseToggle}
                        edge="end"
                      >
                        {showDrivingLicense ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell align="center">
                  {employeeDetails?.driving_license?.lock === 0 ? (
                    <Chip
                      label="Not Verified"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  ) : employeeDetails?.driving_license?.lock === 1 ? (
                    <Chip
                      label="Verified"
                      color="success"
                      variant="contained"
                      size="small"
                      className="chip success"
                    />
                  ) : employeeDetails?.driving_license?.lock === null ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      variant="contained"
                      size="small"
                      className="chip warning"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.driving_license?.lock === 0 ? (
                    <NoEncryptionGmailerrorredIcon />
                  ) : employeeDetails?.driving_license?.lock === 1 ? (
                    <LockIcon />
                  ) : (
                    <NoEncryptionGmailerrorredIcon />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.driving_license?.id ? (
                    <>
                      {hasPermission("user_update") && (
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            openVerifyDrivingLicense(
                              employeeDetails?.driving_license
                            );
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {employeeDetails?.driving_license?.lock !== 1 ? (
                        <>
                          <IconButton
                            aria-label="Edit"
                            onClick={openAddEditDrivingLicense}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={openDeleteDrivingLicense}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <IconButton
                      aria-label="Add"
                      onClick={openAddEditDrivingLicense}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Typography component="p" mb={0}>
                    Passport
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {employeeDetails?.passport?.number ? (
                    <>
                      {showPassport
                        ? replacePhoneNumbers(passport)
                        : employeeDetails.passport.number}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={passportToggle}
                        edge="end"
                      >
                        {showPassport ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.passport?.lock === 0 ? (
                    <Chip
                      label="Not Verified"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  ) : employeeDetails?.passport?.lock === 1 ? (
                    <Chip
                      label="Verified"
                      color="success"
                      variant="contained"
                      size="small"
                      className="chip success"
                    />
                  ) : employeeDetails?.passport?.lock === null ? (
                    <Chip
                      label="Pending"
                      color="warning"
                      variant="contained"
                      size="small"
                      className="chip warning"
                    />
                  ) : (
                    <Chip
                      label="Not Uploaded"
                      color="error"
                      variant="contained"
                      size="small"
                      className="chip error"
                    />
                  )}
                </TableCell>

                <TableCell align="center">
                  {employeeDetails?.passport?.lock === 0 ? (
                    <NoEncryptionGmailerrorredIcon />
                  ) : employeeDetails?.passport?.lock === 1 ? (
                    <LockIcon />
                  ) : (
                    <NoEncryptionGmailerrorredIcon />
                  )}
                </TableCell>
                <TableCell align="center">
                  {employeeDetails?.passport?.id ? (
                    <>
                      {hasPermission("user_update") && (
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            openVerifyPassport(employeeDetails?.passport);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {employeeDetails?.passport?.lock !== 1 ? (
                        <>
                          <IconButton
                            aria-label="Edit"
                            onClick={openAddEditPassport}
                          >
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={openDeletePassport}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <IconButton aria-label="Add" onClick={openAddEditPassport}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* <Box className="modalFooter">
        <Stack spacing={2} direction="row" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            className="text-capitalize"
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="text-capitalize"
          >
            Cancel
          </Button>
        </Stack>
      </Box> */}

      {isAddEditAadhaarOpen && (
        <AddEditAadhaar
          isAddEditAadhaarOpen={isAddEditAadhaarOpen}
          closeAddEditAadhaar={closeAddEditAadhaar}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {isDeleteAadhaarOpen && (
        <DeleteAadhaar
          isDeleteAadhaarOpen={isDeleteAadhaarOpen}
          closeDeleteAadhaar={closeDeleteAadhaar}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {verifyAadhaarOpen && (
        <VerifyAadhaar
          verifyAadhaarOpen={verifyAadhaarOpen}
          verifyAadhaarData={verifyAadhaarData}
          closeVerifyAadhaar={closeVerifyAadhaar}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isAddEditPanOpen && (
        <AddEditPan
          isAddEditPanOpen={isAddEditPanOpen}
          closeAddEditPan={closeAddEditPan}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {isDeletePanOpen && (
        <DeletePan
          isDeletePanOpen={isDeletePanOpen}
          closeDeletePan={closeDeletePan}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}

      {verifyPanOpen && (
        <VerifyPan
          verifyPanOpen={verifyPanOpen}
          verifyPanData={verifyPanData}
          closeVerifyPan={closeVerifyPan}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}

      {isAddEditElectionOpen && (
        <AddEditElection
          isAddEditElectionOpen={isAddEditElectionOpen}
          closeAddEditElection={closeAddEditElection}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {isDeleteElectionOpen && (
        <DeleteElection
          isDeleteElectionOpen={isDeleteElectionOpen}
          closeDeleteElection={closeDeleteElection}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {verifyElectionOpen && (
        <VerifyElection
          verifyElectionOpen={verifyElectionOpen}
          verifyElectionData={verifyElectionData}
          closeVerifyElection={closeVerifyElection}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isAddEditDrivingLicenseOpen && (
        <AddEditDrivingLicense
          isAddEditDrivingLicenseOpen={isAddEditDrivingLicenseOpen}
          closeAddEditDrivingLicense={closeAddEditDrivingLicense}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {isDeleteDrivingLicenseOpen && (
        <DeleteDrivingLicense
          isDeleteDrivingLicenseOpen={isDeleteDrivingLicenseOpen}
          closeDeleteDrivingLicense={closeDeleteDrivingLicense}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {verifyDrivingLicenseOpen && (
        <VerifyDrivingLicense
          verifyDrivingLicenseOpen={verifyDrivingLicenseOpen}
          verifyDrivingLicenseData={verifyDrivingLicenseData}
          closeVerifyDrivingLicense={closeVerifyDrivingLicense}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
      {isAddEditPassportOpen && (
        <AddEditPassport
          isAddEditPassportOpen={isAddEditPassportOpen}
          closeAddEditPassport={closeAddEditPassport}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {isDeletePassportOpen && (
        <DeletePassport
          isDeletePassportOpen={isDeletePassportOpen}
          closeDeletePassport={closeDeletePassport}
          getEmployeeDetails={getEmployeeDetails}
          employeeDetails={employeeDetails}
        />
      )}
      {verifyPassportOpen && (
        <VerifyPassport
          verifyPassportOpen={verifyPassportOpen}
          verifyPassportData={verifyPassportData}
          closeVerifyPassport={closeVerifyPassport}
          getEmployeeDetails={getEmployeeDetails}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeEmployeeIdentityForm;
