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
import "react-tabs/style/react-tabs.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";

const JoiningCandidate = () => {
  const { Axios } = useAxios();
  //state to store joining candidate detils
  const [joiningCandidates, setJoiningCandidates] = useState([]);

  //fetching joining candidates list
  const getJoiningCandidatesList = async () => {
    try {
      const res = await Axios.get(`interview/joining?limit=7`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setJoiningCandidates(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  useEffect(() => {
    getJoiningCandidatesList();
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
          <span>Joining Candidate</span>
          <Link to={"/candidate-list"}>
            <Button variant="outlined" size="small" className="cardHeaderBtn">
              View All
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
                <TableCell align="left">Recruiter</TableCell>
                <TableCell align="left">Joining Date</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {joiningCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No joining candidates...
                  </TableCell>
                </TableRow>
              ) : (
                joiningCandidates.map((candidate, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {candidate?.interview?.name || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {candidate?.interview?.candidate_added_by?.first_name
                          ? candidate.interview.candidate_added_by.first_name +
                            " "
                          : ""}
                        {candidate?.interview?.candidate_added_by?.middle_name
                          ? candidate.interview.candidate_added_by.middle_name +
                            " "
                          : ""}
                        {candidate?.interview?.candidate_added_by?.last_name
                          ? candidate.interview.candidate_added_by.last_name
                          : "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        {candidate?.joining_date || "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          className="link-text"
                          to={`/candidate-view/${candidate.interview_id}`}
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

export default JoiningCandidate;
