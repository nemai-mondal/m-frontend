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
} from "@mui/material";

const InOutActivitiesSkeleton = () => {
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <TableContainer
          sx={{ maxHeight: 314 }}
          className="table-striped scroll-y"
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={80} align="left" className="text-uppercase">
                  Date
                </TableCell>
                <TableCell width={80} align="left" className="text-uppercase">
                  Time
                </TableCell>
                <TableCell width={80} align="left" className="text-uppercase">
                  Terminal
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
    </React.Fragment>
  );
};

export default InOutActivitiesSkeleton;
