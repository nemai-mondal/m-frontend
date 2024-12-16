import React from "react";
import { Box } from "@mui/material";
import EmployeePersonalInformation from "./EmployeePersonalInformation";
import EmployeeAddressInformation from "./EmployeeAddressInformation";
import EmployeeFamilyInformation from "./EmployeeFamilyInformation";
import EmployeeEmergencyAddress from "./EmployeeEmergencyAddress";
import EmployeeQualificationDetails from "./EmployeeQualificationDetails";

const EmployeePersonalDetails = ({ employeeDetails, getEmployeeDetails }) => {
  return (
    <React.Fragment>
      <Box p={3}>
        <EmployeePersonalInformation
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
        <EmployeeAddressInformation
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
        <EmployeeFamilyInformation
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
        <EmployeeEmergencyAddress
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
        <EmployeeQualificationDetails
          employeeDetails={employeeDetails}
          getEmployeeDetails={getEmployeeDetails}
        />
      </Box>
    </React.Fragment>
  );
};

export default EmployeePersonalDetails;
