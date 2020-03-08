import React from "react";
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Typography
} from "@material-ui/core";

import ShowChartIcon from "@material-ui/icons/ShowChart";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import Comparison from "./Comparison";

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

export default props => {
  const {
    data: { currency, equalTotalPayments, equalPrincipalPayments }
  } = props;

  const [tab, setTab] = React.useState(0);

  const renderHeader = text => {
    return (
      <TableCell>
        <Typography variant="body1">{text}</Typography>
      </TableCell>
    );
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderTable = data => {
    return (
      <TableContainer style={{ maxHeight: "600px" }}>
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              {renderHeader(`Payment No.`)}
              {renderHeader(`Payment Amount (${currency})`)}
              {renderHeader(`Principal Amount Paid (${currency})`)}
              {renderHeader(`Interest Amount Paid (${currency})`)}
              {renderHeader(`Loan Outstanding Balance (${currency})`)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{row.paymentAmount.toFixed(2)}</TableCell>
                <TableCell>{row.principalAmountPaid.toFixed(2)}</TableCell>
                <TableCell>{row.interestAmountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  {Math.abs(row.outstandingBalance.toFixed(2))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Paper elevation={5}>
      <Paper square>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Equal Total Payments" icon={<TrendingFlatIcon />} />
          <Tab label="Equal Principal Payments" icon={<TrendingDownIcon />} />
          <Tab label="Comparison" icon={<ShowChartIcon />} />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={0}>
        {renderTable(equalTotalPayments)}
      </TabPanel>

      <TabPanel value={tab} index={1}>
        {renderTable(equalPrincipalPayments)}
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Comparison data={props.data} />
      </TabPanel>
    </Paper>
  );
};
