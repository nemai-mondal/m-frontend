import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";

const LeaveSkeleton = () => {
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <CardContent sx={{ p: 1 }} className="cardheight scroll-hidden">
          <Skeleton
            animation="wave"
            sx={{ width: "100%", height: 70, mb: 1, mx: "auto" }}
          />
          <Skeleton
            animation="wave"
            sx={{ width: "100%", height: 70, mb: 1, mx: "auto" }}
          />
          <Skeleton
            animation="wave"
            sx={{ width: "100%", height: 70, mb: 1, mx: "auto" }}
          />
          <Skeleton
            animation="wave"
            sx={{ width: "100%", height: 70, mb: 1, mx: "auto" }}
          />
       
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default LeaveSkeleton;
