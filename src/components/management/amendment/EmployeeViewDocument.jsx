import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/contexts/AxiosProvider";

const EmployeeViewDocument = () => {
  const { Axios } = useAxios();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState(null); // Initialize as null

  // Function to fetch event celebration details from API
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true); // Set loading state to true while fetching
      const res = await Axios.get("amendment/publish-amendment-list");

      if (res.status >= 200 && res.status < 300) {
        setDocuments(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      } else {
        toast.error("An error occurred while fetching data");
      }
    } finally {
      setLoading(false); // Set loading state back to false when done fetching
    }
  }, [Axios]);

  // useEffect to fetch event celebration data when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Conditional rendering based on loading state and documents
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Documents</span>
        </Stack>
        <CardContent sx={{ p: 2 }} className="cardheight scroll-y">
          <TableContainer className="userList">
            <Table aria-label="simple table">
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : documents && (documents || []).length > 0 ? (
                  documents.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        <Stack direction="row">
                          <Box>
                            <Typography component="p">
                              {data.name || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {data.document ? (
                          <a
                            href={data.document}
                            download={data?.document?.split("/")?.pop()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              className="cardHeaderBtn"
                            >
                              view/Download
                            </Button>
                          </a>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                      No Documents Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default EmployeeViewDocument;
