import React, { useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CandidateInformationForm from "./CandidateInformationForm";
import AssignmentTab from "./AssignmentTab";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import ScheduleInterviewerTab from "./ScheduleInterviewerTab";
import HRFeedbackForm from "./HRFeedbackForm";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/CandidateListSlice";
import { useNavigate } from "react-router-dom";
const CandidateInformation = () => {
  const navigate = useNavigate();
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  // Axios instance
  const { Axios } = useAxios();
  //state to store interview detail
  let [interviewData, setInterviewData] = useState([]);

  //function to get particular interview detail
  const getInterViewDetail = async (interview_id) => {
    try {
      const res = await Axios.get(`interview/show/${interview_id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setInterviewData(res?.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //dispatch to send request to redux store
        dispatch(refresh());
        navigate("/candidate-list");
      }

      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Candidate Information</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Tabs className="line-tab">
              <TabList className="tab-list-wrap">
                <Tab>Candidate Information</Tab>
                {(interviewData?.screening_feedback?.status ===
                  "Shortlisted" && <Tab>Assignment</Tab>) || (
                  <Tab disabled>Assignment</Tab>
                )}
                {(interviewData?.screening_feedback?.status ===
                  "Shortlisted" && <Tab>Schedule Interview</Tab>) || (
                  <Tab disabled>Schedule Interview</Tab>
                )}
                {(interviewData?.screening_feedback?.status ===
                  "Shortlisted" && <Tab>HR Feedback</Tab>) || (
                  <Tab disabled>HR Feedback</Tab>
                )}
              </TabList>
              <TabPanel>
                <CandidateInformationForm
                  getInterViewDetail={getInterViewDetail}
                  interviewData={interviewData}
                />
              </TabPanel>
              <TabPanel>
                <AssignmentTab
                  interviewData={interviewData}
                  getInterViewDetail={getInterViewDetail}
                />
              </TabPanel>
              <TabPanel>
                <ScheduleInterviewerTab
                  interviewData={interviewData}
                  getInterViewDetail={getInterViewDetail}
                />
              </TabPanel>
              <TabPanel>
                <HRFeedbackForm
                  interviewData={interviewData}
                  getInterViewDetail={getInterViewDetail}
                />
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default CandidateInformation;
