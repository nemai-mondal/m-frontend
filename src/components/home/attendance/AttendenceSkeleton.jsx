import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Box,
} from "@mui/material";

const AttendenceSkeleton = () => {
  return (
    <React.Fragment>
      <Box className="cardBox" sx={{ p: 0 }}>
        <Box sx={{ p: 0 }}>
          <Card
            variant="outlined"
            className="cardBox quote h_100"
            sx={{ p: 0 }}
          >
            <TableContainer
              sx={{ maxHeight: 314 }}
              className="table-striped scroll-y"
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" className="text-uppercase">
                      Date
                    </TableCell>
                    <TableCell align="left" className="text-uppercase">
                      Check-in
                    </TableCell>
                    <TableCell align="left" className="text-uppercase">
                      Check-out
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <CardContent sx={{ p: 2 }} className="cardheight scroll-hidden">
              <Skeleton
                animation="wave"
                sx={{ width: "100%", height: 50, mb: 1, mx: "auto" }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: "100%", height: 50, mb: 1, mx: "auto" }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: "100%", height: 50, mb: 1, mx: "auto" }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: "100%", height: 50, mb: 1, mx: "auto" }}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default AttendenceSkeleton;
