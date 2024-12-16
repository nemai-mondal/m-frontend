import React, { Suspense, lazy, useContext } from "react";
import { Grid, Box } from "@mui/material";

const PunchInOut = lazy(() => import("./punch/PunchInOut"));

const HolidaysLeaves = lazy(() => import("./holidays-leaves/HolidaysLeaves"));
const HR_Announcement = lazy(() => import("./hr-announcement/HrAnnouncement"));

const EventsCelebrating = lazy(() =>
  import("./events-celebrating/EventsCelebrating")
);

import InOutActivitiesAttendence from "./attendance/InOutActivitiesAttendence";

const Quote = lazy(() => import("./quote/quote"));
import JoiningCandidate from "./joining-candidate/joining-candidate";
import InterviewsList from "./interviews/interviews";
import PunchInOutSkeleton from "./punch/PunchInOutSkeleton";
import QuoteSkeleton from "./quote/quoteSkeleton";
import HolidaysLeavesSkeleton from "./holidays-leaves/HolidaysLeavesSkeleton";
import HR_AnnouncementSkeleton from "./hr-announcement/HrAnnouncementSkeleton";
import EventsCelebratingSkeleton from "./events-celebrating/EventsCelebratingSkeleton";
import { AuthContext } from "@/contexts/AuthProvider";
import EmployeeViewDocument from "../management/amendment/EmployeeViewDocument";
import ViewWishMessage from "./events-celebrating/ViewWishMessage";
const HomePage = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {hasPermission("punchinout") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Suspense fallback={<PunchInOutSkeleton />}>
                <PunchInOut />
              </Suspense>
            </Grid>
          )}

          {hasPermission("attendence_and_activity") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <InOutActivitiesAttendence />
            </Grid>
          )}
          {hasPermission("quote") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Suspense fallback={<QuoteSkeleton />}>
                <Quote />
              </Suspense>
            </Grid>
          )}
          {hasPermission("holiday_and_leave") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Suspense fallback={<HolidaysLeavesSkeleton />}>
                <HolidaysLeaves />
              </Suspense>
            </Grid>
          )}

          {hasPermission("hr_announcement") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Suspense fallback={<HR_AnnouncementSkeleton />}>
                <HR_Announcement />
              </Suspense>
            </Grid>
          )}
          {hasPermission("celebrating_events") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <Suspense fallback={<EventsCelebratingSkeleton />}>
                <EventsCelebrating />
              </Suspense>
            </Grid>
          )}
          {hasPermission("employee_wish_view") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <ViewWishMessage />
            </Grid>
          )}
          {hasPermission("interview") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <InterviewsList />
            </Grid>
          )}
          {hasPermission("joining_candidate") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <JoiningCandidate />
            </Grid>
          )}
          {hasPermission("employee_document_view") && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
              <EmployeeViewDocument />
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default HomePage;
