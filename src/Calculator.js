import React, { useState } from "react";
import styled from "styled-components";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { Formik } from "formik";
import * as Yup from "yup";

const DURATION = {
  MONTH: "months",
  YEAR: "years"
};

export default props => {
  const [state, setState] = useState({
    amount: 0,
    interestRate: 4.5,
    period: 12,
    periodType: DURATION.MONTH,
    loading: false,
    errors: {}
  });

  const calculateEqualTotalPayments = (amount, i, N) => {
    let n = 1;
    let data = [];

    let prevOutstandingBalance = amount;
    while (n <= N) {
      const paymentAmount = (i * amount) / (1 - Math.pow(1 + i, -N));
      const principalAmountPaid = paymentAmount * Math.pow(1 + i, -(1 + N - n));
      const interestAmountPaid = paymentAmount - principalAmountPaid;
      const outstandingBalance = prevOutstandingBalance - principalAmountPaid;

      data.push({
        paymentAmount,
        principalAmountPaid,
        interestAmountPaid,
        outstandingBalance
      });

      prevOutstandingBalance = outstandingBalance;
      n++;
    }

    return data;
  };

  const calculateEqualPrincipalPayments = (amount, i, N) => {
    let n = 1;
    let prevOutstandingBalance = amount;
    while (n <= N) {
      const interestAmountPaid = prevOutstandingBalance * i;

    }
  };

  /**
   *
   * @param annualInterestRate
   * @param periodType
   * @returns {number}
   */
  const calculateInterestRatePerPeriod = (annualInterestRate, periodType) => {
    let i = annualInterestRate / 100;
    if (periodType === DURATION.MONTH) {
      i = i / 12;
    }
    return i;
  };

  /**
   *
   * @param values
   */
  const handleSubmit = values => {
    setState({ loading: true });
    const i = calculateInterestRatePerPeriod(
      values.interestRate,
      values.periodType
    );
    const data = calculateEqualTotalPayments(values.amount, i, values.period);

    // setTimeout(() => {
    props.onCalculated(data);
    // }, 2000)
  };

  const handlePeriodChange = (e, value) => {
    if (value !== null) {
      setState({ periodType: value });
    }
  };

  return (
    <Card elevation={5}>
      <CardHeader title="Loan repayment calculator" />
      <CardContent>
        <Formik
          initialValues={{
            amount: 100000,
            interestRate: 5,
            period: 5,
            periodType: DURATION.YEAR
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            amount: Yup.number()
              .integer("Amount must be an integer")
              .positive("Amount cannot be less than 0")
              .required("Amount is required")
              .typeError("Amount must be a number"),
            interestRate: Yup.number()
              .min(0, "Interest rate cannot be less than 0")
              .max(100, "Interest rate cannot be greater than 100")
              .required()
              .typeError("Interest rate must be a number"),
            period: Yup.number().required(),
            periodType: Yup.string().required()
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1} direction="column">
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth={true}
                      margin="normal"
                      error={errors.amount && touched.amount}
                    >
                      <InputLabel htmlFor="amount">
                        Amount you plan to borrow
                      </InputLabel>
                      <Input
                        id="amount"
                        autoFocus={true}
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        startAdornment={
                          <InputAdornment position="start">£</InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.amount && touched.amount && errors.amount}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth={true}
                      margin="normal"
                      error={errors.interestRate && touched.interestRate}
                    >
                      <InputLabel htmlFor="interestRate">
                        With an annual interest rate of
                      </InputLabel>

                      <Input
                        id="interestRate"
                        value={values.interestRate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        endAdornment={
                          <InputAdornment position="start">%</InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.interestRate &&
                          touched.interestRate &&
                          errors.interestRate}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <PeriodGroup>
                      <FormControl
                        fullWidth={true}
                        margin="normal"
                        error={errors.period && touched.period}
                      >
                        <InputLabel htmlFor="period">
                          For a period of
                        </InputLabel>
                        <Input
                          id="period"
                          disabled={state.loading}
                          variant="outlined"
                          value={values.period}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          endAdornment={
                            <InputAdornment position="start">
                              {state.periodType ? state.periodType : ""}
                            </InputAdornment>
                          }
                        />
                        <FormHelperText>
                          {errors.period && touched.period && errors.period}
                        </FormHelperText>
                      </FormControl>
                      <ToggleButtonGroup
                        id="periodType"
                        value={values.periodType}
                        exclusive
                        // onChange={handlePeriodChange}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <ToggleButton value={DURATION.MONTH}>
                          Months
                        </ToggleButton>
                        <ToggleButton value={DURATION.YEAR}>Years</ToggleButton>
                      </ToggleButtonGroup>
                    </PeriodGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleReset}
                            disabled={!dirty || isSubmitting}
                          >
                            Clear
                          </Button>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                          >
                            Calculate repayments
                          </Button>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {state.loading && <LinearProgress />}
              </form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
};

const PeriodGroup = styled.div`
  display: flex;
  align-items: baseline;
  > :last-child {
    margin-left: 16px;
  }
`;
