import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = () => {
    const data = {
        labels: ['남성', '여성'],
        datasets: [
            {
                label: '성별 비율',
                data: [60, 40], // 남성 60%, 여성 40% (하드코딩)
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default GenderChart;
