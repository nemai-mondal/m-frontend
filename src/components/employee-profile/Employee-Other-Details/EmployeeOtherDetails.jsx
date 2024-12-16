import React from "react";
import { Box, Typography } from "@mui/material";
import SkillDetails from "./Skill-Details/SkillDetails";
import LanguageDetails from "./Language-Details/LanguageDetails";
import NominationDetails from "./Nomination-Details.jsx/NominationDetails";

const EmployeeOthersDetailsForm = ({ employeeDetails, getEmployeeDetails }) => {
  return (
    <React.Fragment>
      <Box p={3}>
        <Typography component="h2" className="heading-5" mb={2}>
          Others Details
        </Typography>
        {/* <NominationDetails /> */}
        <SkillDetails
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
        <LanguageDetails
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      </Box>
    </React.Fragment>
  );
};

export default EmployeeOthersDetailsForm;
