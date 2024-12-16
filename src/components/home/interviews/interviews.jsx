import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  Card,
  TableContainer,
  TableRow,
  Button,
  Stack,
  TableHead,
} from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import "react-tabs/style/react-tabs.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";

const InterviewsList = () => {
  const { Axios } = useAxios();
  //state to store interview details
  const [interviews, setInterviews] = useState([]);

  //fetching upcoming interviews list
  const getInterviewsList = async () => {
    try {
      const res = await Axios.get(`interview/upcoming?limit=7`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setInterviews(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  useEffect(() => {
    getInterviewsList();
  }, []);

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100" sx={{ p: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Interviews</span>
          <Link to={"/candidate-information"}>
            <Button
              variant="outlined"
              size="small"
              className="cardHeaderBtn"
              startIcon={<AddIcon />}
            >
              ADD
            </Button>
          </Link>
        </Stack>
        <TableContainer
          className="table-striped table-fs-12 scroll-y"
          sx={{ minHeight: 350, maxHeight: 350  }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Candidate Name</TableCell>
                <TableCell align="left">Mode</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Time</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    No upcoming interviews...
                  </TableCell>
                </TableRow>
              ) : (
                interviews.map((interview, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {interview?.interview?.name || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {interview?.interview_mode || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {interview?.interview_date || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {interview?.interview_time || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          className="link-text"
                          to={`/candidate-information/${interview.interview_id}`}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </React.Fragment>
  );
};

export default InterviewsList;
