import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const NominationDetails = () => {
  return (
    <Box>
      <Accordion
        sx={{
          mt: 2,
          borderRadius: "5px !important",
          boxShadow: "none",
          border: "1px solid #ccc",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Nomination Details
        </AccordionSummary>
        <AccordionDetails>
          Nomination details form coming soon...
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default NominationDetails;
