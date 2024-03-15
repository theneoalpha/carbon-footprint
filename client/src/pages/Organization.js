import React, { useState } from 'react';
import Chart from 'chart.js/auto';

import './assets/css/organization.css';
export default function  Organization() {
    const [results, setResults] = useState({
        domainFootprints: {},
        mostIntensive: '',
        totalCarbon: 0
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Get input values
        const electricity = parseFloat(event.target.elements.electricity.value);
        const lpg = parseFloat(event.target.elements.lpg.value);
        const water = parseFloat(event.target.elements.water.value);
        const foodWaste = parseFloat(event.target.elements.foodWaste.value);
        const transportation = parseFloat(event.target.elements.transportation.value);
        const employees = parseInt(event.target.elements.employees.value);

        // Emission factors
        const electricityEmissionFactor = 0.4368; // g CO2e/kWh
        const lpgEmissionFactor = 2.9878; // g CO2e/kg
        const waterEmissionFactor = 0.18712; // g CO2e/m3
        const foodWasteEmissionFactor = 0.770; // g CO2e/kg/year
        const transportationEmissionFactor = 2.2435; // g CO2e/l

        // Calculate total emissions for each domain
        const totalElectricity = electricity * electricityEmissionFactor;
        const totalLpg = lpg * lpgEmissionFactor;
        const totalWater = water * waterEmissionFactor;
        const totalFoodWaste = foodWaste * foodWasteEmissionFactor;
        const totalTransportation = transportation * transportationEmissionFactor * employees;

        // Calculate total carbon consumption
        const totalCarbon = totalElectricity + totalLpg + totalWater + totalFoodWaste + totalTransportation;

        // Display domain-wise results
        const domainFootprints = {
            "Electricity": totalElectricity,
            "LPG": totalLpg,
            "Water": totalWater,
            "Food Waste": totalFoodWaste,
            "Transportation": totalTransportation
        };

        const sortedDomains = Object.keys(domainFootprints).sort((a, b) => domainFootprints[b] - domainFootprints[a]);

        // Display most intensive domain
        const mostIntensive = sortedDomains[0];

        // Update state
        setResults({ domainFootprints, mostIntensive, totalCarbon });

        // Create bar chart
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(domainFootprints),
                datasets: [{
                    label: 'Carbon Footprint (g CO2e)',
                    data: Object.values(domainFootprints),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div className="calculator-main">
            <h1>Carbon Footprint of An Organization </h1>
            <form id="carbonForm" onSubmit={handleSubmit}>
                <div id='form'>
                    <div className='leftForm'>
                        <label htmlFor="electricity">Electricity Consumption (kWh):</label>
                        <label htmlFor="lpg">LPG Consumption (kg):</label>
                        <label htmlFor="water">Water Consumption (m3):</label>
                        <label htmlFor="foodWaste">Food Waste (kg):</label>
                        <label htmlFor="transportation">Transportation and Generator (l):</label>
                        <label htmlFor="employees">Number of Employees:</label>



                    </div>
                    <div className='rightForm'>
                        <input type="number" id="electricity" name="electricity" required /><br />
                        <input type="number" id="lpg" name="lpg" required /><br />
                        <input type="number" id="water" name="water" required /><br />
                        <input type="number" id="foodWaste" name="foodWaste" required /><br />
                        <input type="number" id="transportation" name="transportation" required /><br />
                        <input type="number" id="employees" name="employees" required /><br />
                    </div>
                </div>
                
                

                
                

                
                

                
                

                
                

                
                

                <button  className='organ' type="submit">Calculate</button>
            </form>

            <div id="results">
                <h2>Domain-wise Results</h2>
                <canvas id="chart"></canvas>
                <ul id="domainList">
                    {Object.keys(results.domainFootprints).map((domain, index) => (
                        <li key={index}>{index + 1}. {domain}: {results.domainFootprints[domain].toFixed(2)} g CO2e</li>
                    ))}
                </ul>
                <p id="mostIntensive">{results.mostIntensive} is the most carbon-intensive domain.</p>
                <p id="totalConsumption">Total Carbon Consumption: {results.totalCarbon.toFixed(2)} g CO2e</p>
            </div>
        </div>
    );
};


