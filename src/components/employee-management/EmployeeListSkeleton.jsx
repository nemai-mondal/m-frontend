import { Card, Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

const EmployeeListSkeleton = ({ numberOfBox }) => {
  return Array.from({ length: numberOfBox }).map((_, index) => (
    <Grid item xs={2} sm={12} md={6} lg={6} xl={4} key={index}>
      <Card variant="outlined" className="cardBox employeeListBox" key={index}>
        <Stack direction="row" spacing={3} sx={{ p: 2 }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={60}
            height={60}
          />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width={260} height={40} />
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="text" width={190} height={20} />
            <Skeleton variant="text" width={190} height={20} />
            <Skeleton variant="text" width={190} height={20} />
            <Skeleton variant="text" width={190} height={20} />
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
          <Skeleton variant="text" width={100} height={25} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectengal" width={32} height={19} />
            <Skeleton variant="rectengal" width={32} height={19} />
            <Skeleton variant="rectengal" width={32} height={19} />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  ));
};

export default EmployeeListSkeleton;
