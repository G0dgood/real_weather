import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);



const LineChart = (forecastData: any) => {
	const [cloudData, setCloudData] = useState({ times: [], counts: [] });
	const weatherData: any = forecastData?.forecastData?.hourly

	useEffect(() => {
		// Create a mapping between timestamps and the number of clouds
		const cloudMapping: any = {};
		weatherData?.forEach((data: any) => {
			const time = new Date(data.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
			if (data.weather[0].main === 'Clouds') {
				cloudMapping[time] = data.clouds;
			}
		});

		// Extract timestamps of cloud occurrences
		const cloudTimes = Object.keys(cloudMapping);
		// Extract corresponding number of clouds for each timestamp
		const cloudCounts = cloudTimes.map(time => cloudMapping[time]);

		// Ensure we have data for 7 days
		const maxDataPoints = 7 * 24; // 7 days * 24 hours/day
		const slicedTimes: any = cloudTimes.slice(0, maxDataPoints);
		const slicedCounts: any = cloudCounts.slice(0, maxDataPoints);

		setCloudData({ times: slicedTimes, counts: slicedCounts });
	}, [weatherData]);

	const data = {
		labels: cloudData.times.slice(-7),
		datasets: [{
			data: cloudData.counts.slice(-7),
			fill: false,
			borderColor: '#8796FC',
			tension: 0.1
		}]
	};

	const options: ChartOptions<'line'> = {
		maintainAspectRatio: false,
		aspectRatio: 1,
		scales: {
			x: {
				grid: {
					display: false,
				}
			},
			y: {
				display: false
			}
		},
		plugins: {
			legend: {
				display: false // Hide legend
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return context.parsed.y.toString(); // Display data value on tooltip
					}
				}
			}
		},
		elements: {
			point: {
				radius: 2, // Specify the radius of the data points
				backgroundColor: 'transparent',
				pointStyle: 'circle' // Customize point style (optional)
			},
			line: {
				borderColor: 'red', // Remove graph lines
				// borderWidth: 0 // Remove graph lines
			},

		}
	};

	return (
		<div className='line-container'  >
			<Line
				data={data}
				options={options}
				width={80}
			/>
		</div>
	)
}

export default LineChart