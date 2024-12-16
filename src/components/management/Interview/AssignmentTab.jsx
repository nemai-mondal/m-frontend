/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Box, Stack, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentForm from "./AssignmentForm";
const AssignmentTab = ({ interviewData, getInterViewDetail }) => {
  //state to store initial field
  const [fields, setFields] = useState([
    { unique_id: 0, assignment: "", assignmentFeedback: "" },
  ]);
  //state to store next id of field
  const [nextUniqueId, setNextUniqueId] = useState(1);
  //useeffect to filter assignment and assignment feedback when component will mount
  useEffect(() => {
    if ((interviewData?.assignments || []).length > 0) {
      let assignmentsData = interviewData.assignments.map((item, index) => {
        if ((interviewData?.assignment_feedbacks || []).length > 0) {
          var assignmentFeedback = interviewData.assignment_feedbacks.find(
            (anotherItem) => anotherItem.assignment_id === item.id
          );
        }
        return {
          unique_id: index,
          assignment: item,
          assignmentFeedback: assignmentFeedback,
        };
      });

      setFields(assignmentsData);
      setNextUniqueId((interviewData?.assignments || []).length);
    }
  }, [interviewData]);
  //function to add field when user will click on add button
  const handleAddField = () => {
    const newField = {
      unique_id: nextUniqueId,
      assignment: "",
      assignmentFeedback: "",
    };
    setFields([...fields, newField]);
    setNextUniqueId(nextUniqueId + 1);
  };
  return (
    <React.Fragment>
      <Box p={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="heading-5"
          alignItems={"center"}
          mb={3}
        >
          <Typography
            component="h2"
            className="heading-5"
            border={0}
            mb={0}
            pb={0}
          >
            Assignment
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            className="text-capitalize"
            onClick={handleAddField}
          >
            Add
          </Button>
        </Stack>

        {fields.map((field) => (
          <AssignmentForm
            key={field.unique_id}
            unique_id={field.unique_id}
            assignment={field.assignment}
            getInterViewDetail={getInterViewDetail}
            id={interviewData.id}
            assignmentFeedback={field.assignmentFeedback}
          />
        ))}
      </Box>
    </React.Fragment>
  );
};

export default AssignmentTab;
