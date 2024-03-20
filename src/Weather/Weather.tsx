import { MdOutlineWaterDrop } from "react-icons/md";
import { FiSunrise, FiSunset, FiSun } from "react-icons/fi";
import LineChart from './LineChart';
import { useEffect, useState } from "react";
import { IoIosSunny } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { convertTemperature, convertWindSpeed, customId, daysOfWeek, fetchWeatherData, groupForecastByDay } from "../conponent/data";
import CountrySearch from "../conponent/CountrySearch";
import TableLoader from "../conponent/TableLoader";


const Weather = () => {
	const [city, setCity] = useState<any>('');
	const [isError, setisError] = useState(false);
	const [weatherData, setWeatherData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [forecastData, setForecastData] = useState<any>([]);
	const [isAbbreviated, setIsAbbreviated] = useState(false);
	const [temperatureUnit, setTemperatureUnit] = useState('C'); // Default to Celsius
	const [windSpeedUnit, setWindSpeedUnit] = useState('km/h'); // Default to km/h
	const [greeting, setGreeting] = useState('');


	// Error Handling Effect
	useEffect(() => {
		if (isError) {
			// Display an error toast with the message and reset the state 
			toast.error(error, {
				toastId: customId
			});
		}
		setTimeout(() => {
			setisError(false)
		}, 5000);
	}, [isError, error]);




	const getLocationAndWeather = () => {
		if (navigator.geolocation) {
			// Get user's current location
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					fetchWeatherData(setError, setForecastData, setWeatherData, latitude, longitude, setLoading, setisError);
				},
				(error) => {
					setError('Geolocation error: ' + error.message);
				}
			);
		} else {
			setError('Geolocation is not supported by this browser.');
		}
	};

	// Call getLocationAndWeather when component mounts
	useEffect(() => {
		getLocationAndWeather();
	}, []);



	let timeToDisplay: any;

	const currentTime = Date.now() / 1000; // Current time in seconds 
	if (currentTime < weatherData?.sys?.sunset) {
		// If current time is before sunset, display sunset time
		timeToDisplay = new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
	} else {
		// Otherwise, display sunrise time
		timeToDisplay = new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
	}



	// Group forecast entries by day
	const groupedForecast = groupForecastByDay(forecastData?.daily);

	useEffect(() => {
		const currentHour = new Date().getHours();
		// Get the current hour 
		// Display greeting based on the time of day
		let greetingText = "";
		if (currentHour >= 5 && currentHour < 12) {
			greetingText = "Good morning";
		} else if (currentHour >= 12 && currentHour < 18) {
			greetingText = "Good afternoon";
		} else {
			greetingText = "Good evening";
		}
		// Set the greeting and icon in the state
		setGreeting(`Hi, ${greetingText}!`);
	}, []);



	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768 && !isAbbreviated) {
				setIsAbbreviated(true);
			} else if (window.innerWidth >= 768 && isAbbreviated) {
				setIsAbbreviated(false);
			}
		};
		// Add event listener to handle resize
		window.addEventListener('resize', handleResize);
		// Clean up event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [isAbbreviated]); // Run effect when isAbbreviated changes

	const cloudiness = weatherData?.clouds?.all; // Cloudiness in percentage
	const rainfall = (cloudiness / 100) * 5; // Assuming 5mm of rainfall for every 100% cloudiness
	// Assuming a baseline value for rainfall
	const baselineRainfall = 100; // mm (you can adjust this according to your requirement)

	// Calculate the percentage increase
	const percentageIncrease = ((rainfall - baselineRainfall) / baselineRainfall) * 100;


	return (
		<div>
			<ToastContainer position="top-right" />
			<div className='Weather_header_container'>
				<h1>{greeting}</h1>
				<div className='input_icon_container_main'>
					{isAbbreviated ? "" : <CountrySearch setCity={setCity} city={city} getLocationAndWeather={getLocationAndWeather} setError={setError} setForecastData={setForecastData} setWeatherData={setWeatherData} setisError={setisError} setLoading={setLoading} />}
					<div className="temperature">
						{/* Toggle buttons for temperature unit */}
						<div>
							{temperatureUnit === 'C' ?
								<button onClick={() => setTemperatureUnit('F')}  >F <span>&deg;</span></button>
								:
								<button onClick={() => setTemperatureUnit('C')}  >C<span>&deg;</span></button>
							}
						</div>
						{/* Toggle buttons for wind speed unit */}
						<div>
							{windSpeedUnit === 'km/h' ? <button onClick={() => setWindSpeedUnit('mph')}  >mph</button> : <button onClick={() => setWindSpeedUnit('km/h')}>km/h</button>}
						</div>
					</div>


					<div className='incon_text_container'>
						<div className='a'></div>
						<div className='b'></div>
						<div className='c'></div>
					</div>
				</div>
			</div>
			{isAbbreviated && <CountrySearch setCity={setCity} city={city} getLocationAndWeather={getLocationAndWeather} setError={setError} setForecastData={setForecastData} setWeatherData={setWeatherData} setisError={setisError} setLoading={setLoading} />}
			<div className='main_img_container_main'>
				<TableLoader isLoading={loading} />
				<div className='main_img_container'>
					<div className='main_img_container_sub'>
						<div>
							{/* Display weather icon */}
							{!weatherData?.weather[0]?.icon ? <IoIosSunny size={60} /> : <img src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}.png`} alt="weather icon" />}

							{/* Display temperature */}
							{/* Display temperature with selected unit */}
							<h1>{convertTemperature(weatherData?.main?.temp, temperatureUnit)} <span>&deg;{temperatureUnit}</span></h1>

							{/* Display city name */}
							<p>{weatherData?.weather[0]?.description}, {weatherData?.sys?.country}, {weatherData?.name}</p>
						</div>
						<div className='main_img_container_sub_time'>
							<p>Wind Speed: {convertWindSpeed(weatherData?.wind?.speed, windSpeedUnit)} {windSpeedUnit}</p>
							{/* Display sunset and sunrise */}
							<h4>{timeToDisplay}</h4>
							<h6>{currentTime < weatherData?.sys?.sunset ? 'Sunset' : 'Sunrise'}, {new Date(weatherData?.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h6>
						</div>
					</div>
				</div>

				{/* Display other weather information */}
				<div className='main_buttom_container'>
					<div className='d1'>
						<div className='main_buttom_container_first'>
							<div className='humidity_container'>
								<div className='humidity_container_first humidity_down'>
									<div>
										<MdOutlineWaterDrop size={30} />
									</div>
									<div className='humidity_text'>
										<p>Humidity</p>
										<h5>{weatherData?.main?.humidity}%</h5>
									</div>
								</div>
								<div className='humidity_container_first'>
									<div>
										<FiSun size={30} />
									</div>
									<div className='humidity_text'>
										<p>UV Index</p>
										<h5>	{!forecastData?.current?.uvi ? 0 : forecastData?.current?.uvi}</h5>
									</div>
								</div>
							</div>
							<div className='sunset_container humidity_right'>
								<div className='humidity_container_first humidity_down'>
									<div>
										<FiSunset size={30} />
									</div>
									<div className='humidity_text'>
										<p>Sunrise</p>
										<h5>{new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</h5>
									</div>
								</div>
								<div className='humidity_container_first'>
									<div>
										<FiSunrise size={30} />
									</div>
									<div className='humidity_text'>
										<p>Sunset</p>
										<h5>{new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</h5>
									</div>
								</div>
							</div>
						</div>
						<div className='main_buttom_container_second'>
							<div className='monthly_1'>
								<p>Monthly Rainfall</p>
								<h5>{rainfall?.toFixed(2)} mm</h5>
							</div>
							<div className='monthly_2'>
								<p>This Year</p>
								<h6>{percentageIncrease?.toFixed(2)}%</h6>
							</div>
						</div>
					</div>

					<div className='d2'>
						<div className='d2_one'>
							{/* Clouds observed  */}
							<div className='main_buttom_container_second_flex'>
								<p> Clouds observed over the past 7 days.</p>
							</div>
							{/* Display the LineChart component with forecast data */}
							{forecastData && <LineChart forecastData={forecastData} />}
						</div>
						<div className='d2_two'>
							{/* Render 7-day forecast */}

							{daysOfWeek?.map((day, index) => (
								<div key={index} className={`d2_two_deg_container ${index !== daysOfWeek?.length - 1 ? 'border_left' : ''}`}>
									<p>{isAbbreviated ? day.slice(0, 3) : day}</p>
									<div>
										{/* Add weather condition icon */}
										{groupedForecast[day] && (
											<img src={`http://openweathermap.org/img/wn/${groupedForecast[day]?.weather[0]?.icon}.png`} alt={groupedForecast[day]?.weather[0]?.description} />
										)}
									</div>
									<h6>{groupedForecast[day] ? Math.round(groupedForecast[day]?.temp?.min) : '-'} <span>&deg;</span></h6>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Weather



