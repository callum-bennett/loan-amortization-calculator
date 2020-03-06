import React from "react";
import styled from 'styled-components'
import {
  Button,
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";

export default props => {


  return (
    <Grid container>
      <Grid item>
        <ResetButton variant="contained" color="secondary" onClick={props.onReset}>
          Calculate another amount
        </ResetButton>
      </Grid>
      <Grid item>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment No.</TableCell>
                <TableCell>Payment Amount (£)</TableCell>
                <TableCell>Principal Amount Paid (£)</TableCell>
                <TableCell>Interest Amount Paid (£)</TableCell>
                <TableCell>Loan Outstanding Balance (£)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>{row.paymentAmount.toFixed(2)}</TableCell>
                  <TableCell>{row.principalAmountPaid.toFixed(2)}</TableCell>
                  <TableCell>{row.interestAmountPaid.toFixed(2)}</TableCell>
                  <TableCell>{Math.abs(row.outstandingBalance.toFixed(2))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item>
        <ResetButton variant="contained" color="secondary" onClick={props.onReset}>
          Calculate another amount
        </ResetButton>
      </Grid>
    </Grid>
  );
};

const ResetButton = styled(Button)`
width: 100%;
`
