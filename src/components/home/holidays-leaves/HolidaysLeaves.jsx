import React from 'react';
import { Card, CardContent, Stack } from '@mui/material';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Leaves from './leaves';
import Holidays from './holidays';
import 'react-tabs/style/react-tabs.css';
import './holidays-leaves.css';
import { Link } from 'react-router-dom';

const HolidaysLeaves = () => {

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="card-header">
          <span>Upcoming Holidays & Leaves</span>
          <Link to='/view-all' size="small" className="cardHeaderBtn link-btn">View all</Link>
        </Stack>
        <CardContent sx={{ p: 0 }} className='cardheight scroll-y scroll-x-hidden'>
          <Tabs className='tab'>
            <TabList>
              <Tab>Leaves</Tab>
              <Tab>Holidays</Tab>
            </TabList>
            <TabPanel>
              <Leaves />
            </TabPanel>
            <TabPanel>
              <Holidays />
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default HolidaysLeaves;