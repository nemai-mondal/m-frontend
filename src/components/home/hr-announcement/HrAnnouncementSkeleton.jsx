import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Skeleton,
  Button,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "./hr-announcement.css";
import AddIcon from "@mui/icons-material/Add";

const HR_AnnouncementSkeleton = () => {
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>HR Announcement</span>
          <Button
            variant="outlined"
            size="small"
            className="cardHeaderBtn"
            startIcon={<AddIcon />}
          >
            ADD
          </Button>
        </Stack>
        <CardContent sx={{ p: 2 }} className="cardheight scroll-y">
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Stack direction="row" alignItems="flex-start">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ mr: 2 }}
                    />
                    <Box sx={{ width: "100%" }}>
                      <Skeleton
                        animation="wave"
                        sx={{ width: "100%", height: 25, mb: 1, mx: "auto" }}
                      />
                      <Skeleton
                        animation="wave"
                        sx={{ width: "100%", height: 20, mb: 0, mx: "auto" }}
                      />
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Stack direction="row" alignItems="flex-start">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ mr: 2 }}
                    />
                    <Box sx={{ width: "100%" }}>
                      <Skeleton
                        animation="wave"
                        sx={{ width: "100%", height: 25, mb: 1, mx: "auto" }}
                      />
                      <Skeleton
                        animation="wave"
                        sx={{ width: "100%", height: 20, mb: 0, mx: "auto" }}
                      />
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default HR_AnnouncementSkeleton;
