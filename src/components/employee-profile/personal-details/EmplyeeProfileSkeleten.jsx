import React from "react";
// import { makeStyles } from '@mui/styles';
import { Grid, Skeleton, Stack, TextField } from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     margin: theme.spacing(2),
//   },
// }));

const EmplyeeProfileSkeleten = () => {
  // const classes = useStyles();

  return (
    <div className={""}>
      <Grid container spacing={2}>
        {[...Array(4)].map((_, lineIndex) => (
          <Grid key={lineIndex} container item spacing={3} marginLeft={1}>
            {[...Array(4)].map((_, fieldIndex) => (
              <Grid key={fieldIndex} item xs={3}>
                <Skeleton variant="text" width={260} height={60} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EmplyeeProfileSkeleten;
