import React from "react";
import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import Chart from "./Chart";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default props => {
  const classes = useStyles();

  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className={classes.root}>

    <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tab}
        onChange={handleChange}
        aria-label="Vertical tabs example"
         className={classes.tabs}
      >
        <Tab label="Payment Amount" {...a11yProps(0)} />
        <Tab label="Principal Amount Paid" {...a11yProps(1)} />
        <Tab label="Interest Amount Paid" {...a11yProps(2)} />
        <Tab label="Loan Outstanding Balance" {...a11yProps(3)} />
      </Tabs>


      <TabPanel value={tab} index={0} style={{width: "100%"}}>
        <Chart field={"paymentAmount"} data={props.data} style={{width: "100%"}} />
      </TabPanel>
      <TabPanel value={tab} index={1} style={{width: "100%"}}>
        <Chart field={"principalAmountPaid"} data={props.data} />
      </TabPanel>
      <TabPanel value={tab} index={2} style={{width: "100%"}}>
        <Chart field={"interestAmountPaid"} data={props.data} />
      </TabPanel>
      <TabPanel value={tab} index={3} style={{width: "100%"}}>
        <Chart field={"outstandingBalance"} data={props.data} />
      </TabPanel>
    </div>
  );
};
