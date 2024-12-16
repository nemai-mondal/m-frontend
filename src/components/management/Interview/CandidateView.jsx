import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Grid,
  IconButton,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ImagePath } from "@/ImagePath";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate, useParams } from "react-router-dom";
import ConvertToEmployee from "./ConvertToEmployee";
import { useDispatch } from "react-redux";
import { refresh } from "@/redux/CandidateListSlice";
const CandidateView = () => {
  const navigate = useNavigate();
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const [convertToEmployeeOpen, setConvertToEmployeeOpen] = useState(false);
  const [convertToEmployeeData, setConvertToEmployeedata] = useState(false);
  const openConvertToEmployee = (data) => {
    setConvertToEmployeeOpen(true);
    setConvertToEmployeedata(data);
  };
  const closeConvertToEmployee = () => {
    setConvertToEmployeeOpen(false);
  };
  //state to store departments
  const [departments, setDepartments] = useState([]);
  //function to get department details
  //state to store particular department designation
  const [departmentDesignations, setDepartmentDesignations] = useState([]);
  const fetchDepartments = async () => {
    try {
      const res = await Axios.get(`department/list`);

      if (res.status && res.status >= 200 && res.status < 300) {
        const departmentAllData = (res.data?.data || []).map((department) => ({
          value: department.id||"",
          label: department.name||"",
        }));
        setDepartments(departmentAllData);
        setDepartmentDesignations(
          (res.data?.data || []).reduce((accumulator, { designations }) => {
            if ((designations||[]).length > 0) {
              accumulator.push(
                ...designations.map((designation) => designation)
              );
            }
            return accumulator;
          }, [])
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  //useParams to get interview id from url
  const { interview_id } = useParams();
  // Axios instance
  const { Axios } = useAxios();
  //state to store interview detail
  let [interviewData, setInterviewData] = useState([]);
  //state to expand assignment tab
  const [assignmentExpanded, setAssignmentExpanded] = useState(
    Array((interviewData?.assignments?.length || []).length).fill(false)
  );
  //function to expand assignment tab
  const assignmentHandleChange = (index) => (event, isExpanded) => {
    setAssignmentExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = isExpanded;
      return newExpanded;
    });
  };
  //state to expand interview tab
  const [interviewExpanded, setInterviewExpanded] = useState(
    Array((interviewData?.scheduled_interviews?.length || []).length).fill(
      false
    )
  );
  //function to expand interview tab
  const interviewHandleChange = (index) => (event, isExpanded) => {
    setInterviewExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = isExpanded;
      return newExpanded;
    });
  };
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
  //useeffect to call function when component mount
  useEffect(() => {
    fetchDepartments();
    if (interview_id) {
      getInterViewDetail(interview_id);
    }
  }, [interview_id]);
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
            <Stack direction={"row"} spacing={1}>
              {/* <Button variant="outlined" size="small" className="cardHeaderBtn">
                Not Join
              </Button> */}
              {interviewData?.hr_head_feedback?.status == "Hired" ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className="cardHeaderBtn"
                  onClick={() => {
                    openConvertToEmployee(interviewData);
                  }}
                >
                  Convert to Employee
                </Button>
              ) : (
                ""
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Typography component={"h2"} className="heading-6">
              Personal Information
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Name</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Email</Typography>
                  <Typography component={"p"}>
                    {interviewData?.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Contact No.</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.phone || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Resume</Typography>
                  <Stack direction={"row"} alignItems={"center"}>
                    {interviewData?.resume ? (
                      <img
                        src={ImagePath.pdfIcon}
                        alt="resume"
                        style={{ height: 20 }}
                      />
                    ) : (
                      ""
                    )}
                    <Typography
                      component={"p"}
                      style={{
                        maxWidth: 140,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                      sx={{ mx: 1 }}
                    >
                      {interviewData?.resume?.split("/")?.pop() || "N/A"}
                    </Typography>
                    {interviewData?.resume ? (
                      <IconButton aria-label="download" size="small">
                        <a
                          href={interviewData.resume}
                          download={interviewData?.resume?.split("/")?.pop()}
                          target="_parent"
                        >
                          {" "}
                          <GetAppIcon style={{ color: "gray" }} />
                        </a>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Position Applied</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.designation?.name || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography component={"h2"} className="heading-6">
              Professional Information
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Source</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.source_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Link</Typography>
                  <Typography component={"p"}>
                    {interviewData?.source_link || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Years of Experience</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.total_experience || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Job Profile</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.previous_designation || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Previous Company</Typography>
                  <Typography component={"p"}>
                    {interviewData?.previous_company || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>
                    Previous Company Gross
                  </Typography>
                  <Typography component={"p"}>
                    {interviewData?.current_ctc || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Current Expectation</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.expected_ctc || "N/A"}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Current Agreed Gross</Typography>
                  <Typography component={"p"}>10,00,000</Typography>
                </Grid> */}
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>
                    Highest Qualification
                  </Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.highest_qualification || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Notice Period</Typography>
                  <Typography component={"p"}>
                    {interviewData?.notice_period || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Typography component={"h4"}>Primary Skills</Typography>
                  <Typography component={"p"}>
                    {interviewData?.primary_skill || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Typography component={"h4"}>Secondary Skills</Typography>
                  <Typography component={"p"}>
                    {interviewData?.secondary_skill || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={12}>
                  <Typography component={"h4"}>Remarks</Typography>
                  <Typography component={"p"}>
                    {interviewData?.remarks || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography component={"h2"} className="heading-6">
              First Screening Feedback
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>
                    Actual Work Experience Assessment
                  </Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.screening_feedback?.work_exp_assessment ||
                      "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Interpersonal Skill</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.screening_feedback
                      ?.interpersonal_skill_score || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Communication Skill</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.screening_feedback
                      ?.communication_skill_score || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>Attitude</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.screening_feedback?.attitude || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} xl>
                  <Typography component={"h4"}>
                    Suitable for Position?
                  </Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.screening_feedback?.is_suitable || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Typography component={"h4"}>Status</Typography>
                  {interviewData?.screening_feedback?.status === "Hold" ? (
                    <Chip label="Hold" size="small" className="chip warning" />
                  ) : interviewData?.screening_feedback?.status === "Reject" ? (
                    <Chip label="Reject" size="small" className="chip error" />
                  ) : interviewData?.screening_feedback?.status === "Close" ? (
                    <Chip label="Close" size="small" className="chip error" />
                  ) : interviewData?.screening_feedback?.status ===
                    "Shortlisted" ? (
                    <Chip
                      label="Shortlisted"
                      size="small"
                      className="chip success"
                    />
                  ) : (
                    "N/A"
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={9}>
                  <Typography component={"h4"}>Remarks</Typography>
                  <Typography component={"p"}>
                    {interviewData?.screening_feedback?.remarks || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography component={"h2"} className="heading-6">
              Assignments
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              {(interviewData?.assignments || []).length > 0 ? (
                interviewData.assignments.map((data, index) => (
                  <Accordion
                    key={index}
                    defaultExpanded={false}
                    sx={{
                      mb: 2,
                      borderRadius: "5px !important",
                      boxShadow: "none",
                      border: "1px solid #ccc",
                    }}
                    // assignmentExpanded={assignmentExpanded[index]}
                    onChange={assignmentHandleChange(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      {`Assignment ${index + 1}`}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box className="text-group">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Assignment Name
                            </Typography>
                            <Typography component={"p"}>
                              {data?.name || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Assignment Date
                            </Typography>
                            <Typography component={"p"}>
                              {data?.assignment_date || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Submission Date
                            </Typography>
                            <Typography component={"p"}>
                              {data?.submission_date || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Status
                            </Typography>

                            {data?.status === "In-Progress" ? (
                              <Chip
                                label="In-Progress"
                                size="small"
                                className="chip warning"
                              />
                            ) : data?.status === "Not Started" ? (
                              <Chip
                                label="Not Started"
                                size="small"
                                className="chip info"
                              />
                            ) : data?.status === "Submitted" ? (
                              <Chip
                                label="Submitted"
                                size="small"
                                className="chip success"
                              />
                            ) : (
                              "N/A"
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Assignment Details
                            </Typography>
                            <Typography component={"p"}>
                              {data?.details || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography component={"p"} style={{ marginTop: 25 }}>
                          Assignment Feedback
                        </Typography>
                        {(interviewData?.assignment_feedbacks || []).length >
                        0 ? (
                          interviewData.assignment_feedbacks.map(
                            (innerData, index) =>
                              innerData.assignment_id === data.id ? (
                                <Grid container spacing={2} key={index}>
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography component={"h4"}>
                                      Assignment Details
                                    </Typography>
                                    <Typography component={"p"}>
                                      {data?.details || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={2}>
                                    <Typography component={"h4"}>
                                      Feedback Submission Date
                                    </Typography>
                                    <Typography component={"p"}>
                                      {innerData?.feedback_submission_date ||
                                        "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={2}>
                                    <Typography component={"h4"}>
                                      Rating
                                    </Typography>
                                    <Typography component={"p"}>
                                      {" "}
                                      {innerData?.rating || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={2}>
                                    <Typography component={"h4"}>
                                      Status
                                    </Typography>
                                    {innerData?.status === "Hold" ? (
                                      <Chip
                                        label="Hold"
                                        size="small"
                                        className="chip warning"
                                      />
                                    ) : innerData?.status === "Reject" ? (
                                      <Chip
                                        label="Reject"
                                        size="small"
                                        className="chip error"
                                      />
                                    ) : innerData?.status === "Close" ? (
                                      <Chip
                                        label="Close"
                                        size="small"
                                        className="chip error"
                                      />
                                    ) : innerData?.status === "Pass" ? (
                                      <Chip
                                        label="Pass"
                                        size="small"
                                        className="chip success"
                                      />
                                    ) : (
                                      "N/A"
                                    )}
                                  </Grid>
                                </Grid>
                              ) : null
                          )
                        ) : (
                          <Typography component={"h4"} key={index}>
                            No Feedback Added
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography component={"h4"}>No Assignment Given</Typography>
              )}
            </Box>

            <Typography component={"h2"} className="heading-6">
              Interviews
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              {(interviewData?.scheduled_interviews || []).length > 0 ? (
                interviewData.scheduled_interviews.map((data, index) => (
                  <Accordion
                    key={index}
                    defaultExpanded={false}
                    sx={{
                      mb: 2,
                      borderRadius: "5px !important",
                      boxShadow: "none",
                      border: "1px solid #ccc",
                    }}
                    assignmentExpanded={assignmentExpanded === "interview1"}
                    onChange={interviewHandleChange(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="interview1-content"
                      id="interview1-header"
                    >
                      {`Round ${index + 1}`}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box className="text-group">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Interview Date
                            </Typography>
                            <Typography component={"p"}>
                              {data?.interview_date || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              Interviewer Name
                            </Typography>
                            <Typography component={"p"}>
                              {(data?.interviewers || []).map(
                                (m) =>
                                  `${
                                    m.user?.honorific
                                      ? `${m.user?.honorific} `
                                      : ""
                                  }${m.user?.first_name || ""} ${
                                    m.user?.middle_name
                                      ? `${m.user.middle_name} `
                                      : ""
                                  }${m.user?.last_name || ""} - ${
                                    m.user?.employee_id || ""
                                  }, `
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} lg={4} xl>
                            <Typography
                              component={"h4"}
                              style={{ marginTop: 0 }}
                            >
                              interview Agenda
                            </Typography>
                            <Typography component={"p"}>
                              {data?.interview_agenda || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography component={"p"} style={{ marginTop: 25 }}>
                          Interview Feedback
                        </Typography>
                        {(interviewData?.scheduled_interview_feedbacks || [])
                          .length > 0 ? (
                          interviewData.scheduled_interview_feedbacks.map(
                            (innerData, index) =>
                              innerData.interview_schedule_id === data.id ? (
                                <Grid container spacing={2} key={index}>
                                  <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <Typography component={"h4"}>
                                      Coding Quality
                                    </Typography>
                                    <Typography component={"p"}>
                                      {innerData?.code_quality || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <Typography component={"h4"}>
                                      Problem-solving skill
                                    </Typography>
                                    <Typography component={"p"}>
                                      {innerData?.problem_solving || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <Typography component={"h4"}>
                                      Status
                                    </Typography>
                                    {innerData?.status === "Hold" ? (
                                      <Chip
                                        label="Hold"
                                        size="small"
                                        className="chip warning"
                                      />
                                    ) : innerData?.status === "Rejected" ? (
                                      <Chip
                                        label="Rejected"
                                        size="small"
                                        className="chip error"
                                      />
                                    ) : innerData?.status === "Close" ? (
                                      <Chip
                                        label="Close"
                                        size="small"
                                        className="chip error"
                                      />
                                    ) : innerData?.status === "Pass" ? (
                                      <Chip
                                        label="Pass"
                                        size="small"
                                        className="chip success"
                                      />
                                    ) : (
                                      "N/A"
                                    )}
                                  </Grid>
                                </Grid>
                              ) :null
                          )
                        ) : (
                          <Typography component={"h4"} key={index}>
                            No Feedback Added
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography component={"h4"}>No Interview Sheduled</Typography>
              )}
            </Box>

            <Typography component={"h2"} className="heading-6">
              HR Feedback
            </Typography>
            <Box sx={{ p: 2 }} className="text-group">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <Typography component={"h4"}>
                    Cultural Fit Assessment
                  </Typography>
                  <Typography component={"p"}>
                    {interviewData?.hr_head_feedback?.cultural_fit_assessment ||
                      "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <Typography component={"h4"}>Overall Assessment</Typography>
                  <Typography component={"p"}>
                    {interviewData?.hr_head_feedback?.overall_assessment ||
                      "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Typography component={"h4"}>Strengths</Typography>
                  <Typography component={"p"}>
                    {interviewData?.hr_head_feedback?.strength?.replace(
                      /<\/?p>/g,
                      ""
                    ) || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Typography component={"h4"}>Weakness</Typography>
                  <Typography component={"p"}>
                    {interviewData?.hr_head_feedback?.weakness?.replace(
                      /<\/?p>/g,
                      ""
                    ) || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ p: 2 }} className="text-group">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <Typography component={"h4"}>Final Recommendation</Typography>
                  <Typography component={"p"}>
                    {" "}
                    {interviewData?.hr_head_feedback?.status || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Typography component={"h4"}>Additional Comment</Typography>
                  <Typography component={"p"}>
                    {interviewData?.hr_head_feedback?.feedback?.replace(
                      /<\/?p>/g,
                      ""
                    ) || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        {convertToEmployeeOpen && (
          <ConvertToEmployee
            departments={departments}
            departmentDesignations={departmentDesignations}
            convertToEmployeeOpen={convertToEmployeeOpen}
            closeConvertToEmployee={closeConvertToEmployee}
            convertToEmployeeData={convertToEmployeeData}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default CandidateView;
