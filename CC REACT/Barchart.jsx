import React, { useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AccountingContext } from './AccountingContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const { items } = useContext(AccountingContext);

    // Prepare data for the chart
    const data = {
        labels: ['Purchases', 'Sales', 'Credits'],
        datasets: [
            {
                label: 'Amount',
                data: [
                    items.purchases.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0,
                    items.sales.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0,
                    items.credits.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgb(144, 238, 144)'],
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Financial Overview',
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
