import React, { useState } from "react";
import { Box, Grid, isWidthDown, withWidth } from "@material-ui/core";
import Calculator from "./Calculator";
import Report from "./Report";

const App = props => {
  const [data, setData] = useState(null);

  const handleCalculated = data => {
    setData(data);
  };

  return (
    <Box mt={isWidthDown("sm", props.width) ? 2 : 20}>
      <Grid container spacing={2} className="main">
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={3}>
          <Calculator onCalculated={handleCalculated} />
        </Grid>
        <Grid item xs={12} md={7}>
          {data !== null && <Report data={data} />}
        </Grid>
        <Grid item xs={false} md={1} />
      </Grid>
    </Box>
  );
};

export default withWidth()(App);
