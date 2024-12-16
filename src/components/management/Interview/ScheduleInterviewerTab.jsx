/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Box, Stack, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ScheduleIntervieweForm from "./ScheduleIntervieweForm";
const ScheduleInterviewerTab = ({ interviewData, getInterViewDetail }) => {
  //state to store initial field
  const [fields, setFields] = useState([
    {
      unique_id: 0,
      scheduledInterview: "",
      scheduledInterviewFeedback: "",
      name: "",
      profile: "",
    },
  ]);
  //state to store total assignment round
  const [totalAssignmentRound, setTotalAssignmentRound] = useState({});
  //state to store next id of field
  const [nextUniqueId, setNextUniqueId] = useState(1);
  //useeffect to filter Schedule Interviewer and Schedule Interviewer feedback when component will mount
  useEffect(() => {
    if ((interviewData?.scheduled_interviews || []).length > 0) {
      let scheduledInterviewData = interviewData.scheduled_interviews.map(
        (item, index) => {
          if ((interviewData?.scheduled_interview_feedbacks || []).length > 0) {
            var scheduledInterviewFeedback =
              interviewData.scheduled_interview_feedbacks.find(
                (innerItem) => innerItem.interview_schedule_id === item.id
              );
          }
          return {
            unique_id: index,
            scheduledInterview: item,
            scheduledInterviewFeedback: scheduledInterviewFeedback,
          };
        }
      );

      setFields(scheduledInterviewData);
      setNextUniqueId((interviewData?.scheduled_interviews || []).length);
    }
    if ((interviewData?.assignments || []).length > 0) {
      let totalAssignmentRound = interviewData.assignments.map(
        (item, index) => ({
          value: item.id,
          label: `${index + 1} Round Assignment`,
        })
      );
      setTotalAssignmentRound(totalAssignmentRound);
    }
  }, [interviewData]);
  //function to add field when user will click on add button
  const handleAddField = () => {
    const newField = {
      unique_id: nextUniqueId,
      scheduledInterview: "",
      scheduledInterviewFeedback: "",
      name: "",
      profile: "",
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
            Schedule Interviewer
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
          <ScheduleIntervieweForm
            key={field.unique_id}
            unique_id={field.unique_id}
            scheduledInterview={field.scheduledInterview}
            getInterViewDetail={getInterViewDetail}
            id={interviewData.id}
            scheduledInterviewFeedback={field.scheduledInterviewFeedback}
            name={interviewData.name||""}
            profile={interviewData.previous_designation||""}
            totalAssignmentRound={totalAssignmentRound}
          />
        ))}
      </Box>
    </React.Fragment>
  );
};

export default ScheduleInterviewerTab;
