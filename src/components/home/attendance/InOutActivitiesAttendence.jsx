import { Card, CardContent, Stack } from "@mui/material";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Attendance from "./Attendance";
import Activities from "./Activities";

const InOutActivitiesAttendence = () => {
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>7 Days Activities/Attendance</span>
        </Stack>
        <CardContent
          sx={{ p: 0 }}
          className="cardheight scroll-hidden"
        >
          <Tabs className="tab">
            <TabList>
              <Tab>In/Out Activities</Tab>
              <Tab>Attendance</Tab>
            </TabList>
            <TabPanel>
              <Activities />
            </TabPanel>
            <TabPanel>
              <Attendance />
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default InOutActivitiesAttendence;
