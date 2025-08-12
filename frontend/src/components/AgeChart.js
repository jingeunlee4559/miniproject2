import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgeChart = () => {
    const data = {
        labels: ['10대', '20대', '30대', '40대', '50대 이상'],
        datasets: [
            {
                label: '연령별 비율',
                data: [5, 35, 30, 20, 10], // 하드코딩 비율
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: '연령별 비율' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default AgeChart;
