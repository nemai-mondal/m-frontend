import React from "react";
import { Card, Stack, Box, Skeleton,
} from "@mui/material";
import "./punch.css";
const PunchInOutSkeleton = () => {
  
  return (
    <React.Fragment>
      <Card
        variant="outlined"
        className="cardBox punchInOut"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Skeleton animation="wave" sx={{width:'50%', height:24, mb:1, mx:'auto'}} />
          <Skeleton animation="wave" sx={{width:'50%', height:28, mb:1, mx:'auto'}} />
          <Skeleton animation="wave" sx={{width:'30%', height:20, mb:2, mx:'auto'}} />
          <Skeleton animation="wave" sx={{width:'30%', height:45, mb:1, mx:'auto'}} />
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Skeleton animation="wave" sx={{width:100, height:55, mb:2, mx:'auto'}} />
            <Skeleton animation="wave" sx={{width:100, height:55, mb:2, mx:'auto'}} />
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Skeleton animation="wave" sx={{width:'75%', height:65, mb:2, mx:'auto'}} />
          </Stack>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          className="shift-date"
        >
          <Skeleton animation="wave" sx={{width:100, height:25}} />
          <Skeleton animation="wave" sx={{width:100, height:25}} />
        </Stack>
      </Card>
    </React.Fragment>
  );
};

export default PunchInOutSkeleton;
