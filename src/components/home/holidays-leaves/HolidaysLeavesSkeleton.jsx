import React from 'react';
import { Card, CardContent, Stack, Skeleton } from '@mui/material';
import 'react-tabs/style/react-tabs.css';
import './holidays-leaves.css';
import { Link } from 'react-router-dom';

const HolidaysLeavesSkeleton = () => {

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="card-header">
          <span>Upcoming Holidays & Leaves</span>
          <Link to='/view-all' size="small" className="cardHeaderBtn link-btn">View all</Link>
        </Stack>
        <CardContent sx={{ p: 2 }} className='cardheight scroll-y scroll-x-hidden'>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:50, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" sx={{width:'50%', height:50, mb:1, mx:'auto'}} />
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:25, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:25, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:25, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:25, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} spacing={2} mb={2}>
            <Skeleton animation="wave" sx={{width:'50%', height:25, mb:1, mx:'auto'}} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
            <Skeleton animation="wave" variant="circular" width={30} height={30} />
          </Stack>
          
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default HolidaysLeavesSkeleton;