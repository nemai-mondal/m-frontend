import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React from "react";

const EventsCelebratingSkeleton = () => {
  return (
    <>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Celebrating Events</span>
          <Button variant="outlined" size="small" className="cardHeaderBtn">
            View all
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
                        sx={{
                          width: "80%",
                          height: 25,
                          mb: 1,
                          mx: "auto",
                          mr: 15,
                        }}
                      />
                      <Skeleton
                        animation="wave"
                        sx={{
                          width: "80%",
                          height: 20,
                          mb: 0,
                          mx: "auto",
                          mr: 15,
                        }}
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
                        sx={{
                          width: "80%",
                          height: 25,
                          mb: 1,
                          mx: "auto",
                          mr: 15,
                        }}
                      />
                      <Skeleton
                        animation="wave"
                        sx={{
                          width: "80%",
                          height: 20,
                          mb: 0,
                          mx: "auto",
                          mr: 15,
                        }}
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
                        sx={{
                          width: "80%",
                          height: 25,
                          mb: 1,
                          mx: "auto",
                          mr: 15,
                        }}
                      />
                      <Skeleton
                        animation="wave"
                        sx={{
                          width: "80%",
                          height: 20,
                          mb: 0,
                          mx: "auto",
                          mr: 15,
                        }}
                      />
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default EventsCelebratingSkeleton;
