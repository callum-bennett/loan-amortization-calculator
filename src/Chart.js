import React from "react";
import { Line } from "react-chartjs-2";

export default props => {
  const { equalTotalPayments, equalPrincipalPayments } = props.data;

  const paymentDataToDataset = (paymentData, label, color) => {
    const data = Object.values(paymentData).map(v => {
      return Number(v[props.field]).toFixed(2);
    });

    return {
      data,
      label,
      borderColor: color,
      fill: false,
      pointRadius: 0
    };
  };

  const dataset1 = paymentDataToDataset(
    equalTotalPayments.rows,
    equalTotalPayments.name,
    "#98C725"
  );
  const dataset2 = paymentDataToDataset(
    equalPrincipalPayments.rows,
    equalPrincipalPayments.name,
    "#59B0B9"
  );

  const data = {
    labels: Object.keys(props.data.equalPrincipalPayments.rows).map(
      (k, i) => i + 1
    ),
    datasets: [dataset1, dataset2]
  };

  const options = {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            fontSize: 16,
            labelString: props.data.currency
          }
        }
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Payment no."
          }
        }
      ]
    }
  };

  return <Line data={data} options={options} />;
};
