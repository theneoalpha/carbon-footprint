import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: [
    'Building',
    'Transport',
    'Power',
    'Industry',
    'Energy Sector and Agriculture',
  ],
  datasets: [
    {
      label: '# of Votes',
      data: [7.25, 13, 44, 31, 4],
      backgroundColor: [
        'rgba(162, 213, 159, 1)',
        'rgba(98, 187, 160, 1)',
        'rgba(72, 139, 118, 1)',
        'rgba(27, 80, 109, 1)',
        'rgba(44, 130, 179, 1)',
        'rgba(155, 209, 229, 1)',
      ],
      borderColor: [
        'rgba(36, 59, 74, 1)',
        'rgba(36, 59, 74, 1)',
        'rgba(36, 59, 74, 1)',
        'rgba(36, 59, 74, 1)',
        'rgba(36, 59, 74, 1)',
        'rgba(36, 59, 74, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const MeanIndividual = () => {
  return (
    <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
      <Doughnut
        data={data}
        height={'400px'}
        options={{
          maintainAspectRatio: false,
          resizeDelay: 0,
          responsive: true,
        }}
      ></Doughnut>
    </div>
  );
};

export default MeanIndividual;
