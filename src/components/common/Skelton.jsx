import React from "react";
import { Grid, Skeleton, Stack, TextField } from "@mui/material";

const Skeleten = ({ row = 4, column = 4 }) => {
  return (
    <div className={""}>
      <Grid container spacing={2}>
        {[...Array(column)].map((_, lineIndex) => (
          <Grid key={lineIndex} container item spacing={3} marginLeft={1}>
            {[...Array(row)].map((_, fieldIndex) => (
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

export default Skeleten;
