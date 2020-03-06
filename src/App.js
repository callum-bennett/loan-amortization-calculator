import React, { useState } from "react";
import styled from "styled-components";
import { Box, Grid, Zoom } from "@material-ui/core";
import Calculator from "./Calculator";
import Report from "./Report";

export default () => {
  const [data, setData] = useState(null);

  const handleCalculated = data => {
    setData(data);
  };

  const handleReset = () => {
    setData(null);
  };

  return (
    <Root>
      <Grid container>
        <Grid item xs={false} md={4} />
        <Grid item xs={12} md={4}>
          <Box mt={20}>
            {data === null ? (
              <Calculator onCalculated={handleCalculated} />
            ) : (
              <Report onReset={handleReset} data={data} />
            )}
          </Box>
        </Grid>
        <Grid item xs={false} md={4} />
      </Grid>
    </Root>
  );
};

const Root = styled.div`
  background: #efefef;
  height: 100vh;
`;
