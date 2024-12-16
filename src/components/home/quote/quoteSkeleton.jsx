import React from "react";
import { Card, CardContent, Stack, Skeleton } from "@mui/material";
import "./quote.css";

const QuoteSkeleton = () => {
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Today’s Quote</span>

          <Skeleton
            animation="wave"
            sx={{ width: "14%", height: 30, mb: 1, mx: "auto", ml: 45 }}
          />
        </Stack>

        <CardContent sx={{ p: 2, height: "calc(100% - 49px)" }}>
          <Stack alignItems="center" justifyContent="center" className="h_100">
            <Skeleton
              animation="wave"
              sx={{ width: "100%", height: 20, mb: 1, mx: "auto" }}
            />
            <Skeleton
              animation="wave"
              sx={{ width: "50%", height: 20, mb: 2, mx: "auto" }}
            />

            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
            <Skeleton
              animation="wave"
              sx={{ width: "25%", height: 20, mt: 2, mx: "auto" }}
            />
          </Stack>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default QuoteSkeleton;
