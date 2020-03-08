import React from "react";

import {
  Box,
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
  LinearProgress,
  MenuItem,
  Select
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";


const DURATION = {
  WEEK: "weeks",
  MONTH: "months",
  YEAR: "years"
};

export default props => {
  const { onReset } = props;

  /**
   * @param amount
   * @param i
   * @param periods
   * @returns {{name: string, rows: []}}
   */
  const calculateEqualTotalPayments = (amount, i, periods) => {
    let n = 1;
    let rows = [];

    let prevOutstandingBalance = amount;
    while (n <= periods) {
      const paymentAmount = (i * amount) / (1 - (1 + i) ** -periods);
      const principalAmountPaid = paymentAmount * (1 + i) ** -(1 + periods - n);
      const interestAmountPaid = paymentAmount - principalAmountPaid;
      const outstandingBalance = prevOutstandingBalance - principalAmountPaid;

      rows.push({
        paymentAmount,
        principalAmountPaid,
        interestAmountPaid,
        outstandingBalance
      });

      prevOutstandingBalance = outstandingBalance;
      n++;
    }

    return {
      name: "Equal Total Payments",
      rows
    };
  };

  /**
   * @param amount
   * @param i
   * @param periods
   * @returns {{name: string, rows: []}}
   */
  const calculateEqualPrincipalPayments = (amount, i, periods) => {
    let n = 1;
    let rows = [];
    let prevOutstandingBalance = amount;
    while (n <= periods) {
      const principalAmountPaid = amount / periods;
      const interestAmountPaid = prevOutstandingBalance * i;
      const paymentAmount = principalAmountPaid + interestAmountPaid;
      const outstandingBalance = interestAmountPaid / i - principalAmountPaid;

      rows.push({
        paymentAmount,
        principalAmountPaid,
        interestAmountPaid,
        outstandingBalance
      });

      prevOutstandingBalance = outstandingBalance;
      n++;
    }

    return {
      name: "Equal Principal Payments",
      rows
    };
  };

  /**
   *
   * @param apr
   * @param periodType
   * @returns {number}
   */
  const calculateInterestRatePerPeriod = (apr, periodType) => {
    let i = apr / 100;
    if (periodType === DURATION.MONTH) {
      i /= 12;
    } else if (periodType === DURATION.WEEK) {
      i /= 52;
    }
    return i;
  };

  /**
   * @param values
   * @param setSubmitting
   */
  const handleSubmit = (values, { setSubmitting }) => {
    const amount = parseInt(values.amount);
    const apr = parseFloat(values.apr);
    const periods = parseInt(values.period);
    const periodType = values.periodType;
    const currency = values.currency;
    const i = calculateInterestRatePerPeriod(apr, periodType);

    const equalTotalPayments = calculateEqualTotalPayments(amount, i, periods);
    const equalPrincipalPayments = calculateEqualPrincipalPayments(
      amount,
      i,
      periods
    );

    setTimeout(() => {
      props.onCalculated({
        currency,
        equalTotalPayments,
        equalPrincipalPayments
      });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Card elevation={5}>
      <CardHeader title="Loan repayment calculator" />
      <CardContent>
        <Formik
          initialValues={{
            amount: "10000",
            apr: "5",
            period: "12",
            periodType: DURATION.YEAR,
            currency: "£"
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            amount: Yup.number()
              .integer("Amount must be an integer")
              .positive("Amount cannot be less than 0")
              .required("Amount is required")
              .typeError("Amount must be a number"),
            apr: Yup.number()
              .min(0, "Interest rate cannot be less than 0")
              .max(100, "Interest rate cannot be greater than 100")
              .required("Interest rate is required")
              .typeError("Interest rate must be a number"),
            currency: Yup.string(),
            period: Yup.number()
              .integer("Amount must be an integer")
              .positive("Amount cannot be less than 0")
              .min(1, "Period be less than 1")
              .max(1000, "Period cannot be greater than 1000")
              .required("Period is required")
              .typeError("Period must be a number"),
            periodType: Yup.string().required()
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
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
                      <InputLabel htmlFor="amount">Loan amount</InputLabel>
                      <Input
                        id="amount"
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <Select
                              id="currency"
                              inputProps={{ tabIndex: "-1" }}
                              value={values.currency}
                              onChange={handleChange("currency")}
                              onBlur={handleBlur("currency")}
                            >
                              <MenuItem value="£">£</MenuItem>
                              <MenuItem value="$">$</MenuItem>
                              <MenuItem value="€">€</MenuItem>
                            </Select>
                          </InputAdornment>
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
                      error={errors.apr && touched.apr}
                    >
                      <InputLabel htmlFor="apr">
                        With an annual interest rate of
                      </InputLabel>
                      <Input
                        id="apr"
                        value={values.apr}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        endAdornment={
                          <InputAdornment position="start">%</InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.apr && touched.apr && errors.apr}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth={true}
                      margin="normal"
                      error={errors.period && touched.period}
                    >
                      <InputLabel htmlFor="period">
                        Paid back over a period of
                      </InputLabel>
                      <Input
                        id="period"
                        variant="outlined"
                        value={values.period}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <Select
                              id="periodType"
                              inputProps={{ tabIndex: "-1" }}
                              value={values.periodType}
                              onChange={handleChange("periodType")}
                              onBlur={handleBlur("periodType")}
                            >
                              <MenuItem value={DURATION.YEAR}>Years</MenuItem>
                              <MenuItem value={DURATION.MONTH}>Months</MenuItem>
                              <MenuItem value={DURATION.WEEK}>Weeks</MenuItem>
                            </Select>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.period && touched.period && errors.period}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <Button
                            tabIndex="-1"
                            variant="contained"
                            color="secondary"
                            onClick={onReset}
                            disabled={isSubmitting}
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
                            Calculate
                          </Button>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Box mt={1} style={{ minHeight: "5px" }}>
                    {isSubmitting && <LinearProgress />}
                  </Box>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
};
