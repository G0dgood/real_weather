export const YOUR_API_KEY = "4d8fb5b93d4af21d66a2948710284366"
// export const YOUR_API_KEY = "56a2c31c64a6247e0e851f88799c0dd5"
export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// Toast identifiers
	export const customId = "custom-id-yes";

	// Function to group forecast entries by day
	export const groupForecastByDay = (forecastData: any[]) => {
		const groupedForecast: any = {};
		forecastData?.forEach((forecast: { dt: number; }) => {
			const date = new Date(forecast.dt * 1000);
			const day = date?.toLocaleDateString('en-US', { weekday: 'long' });
			if (!groupedForecast[day]) {
				groupedForecast[day] = forecast;
			}
		});
		return groupedForecast;
	};


			export const convertTemperature = (tempInCelsius: number ,temperatureUnit: string) => {
		if (temperatureUnit === 'C') {
			return tempInCelsius?.toFixed(0);
		} else {
			// Convert Celsius to Fahrenheit
			return (tempInCelsius * 9 / 5 + 32)?.toFixed(0);
		}
	};

		export const convertWindSpeed = (speedInKmh: number ,windSpeedUnit: string) => {
		if (windSpeedUnit === 'km/h') {
			return speedInKmh?.toFixed(1);
		} else {
			// Convert km/h to mph
			return (speedInKmh * 0.621371)?.toFixed(1);
		}
		};
	

			export const fetchWeatherData = async (setError: (arg0: string) => void ,setForecastData: (arg0: any) => void, setWeatherData: (arg0: any) => void ,latitude: any, longitude: any ,setLoading: (arg0: boolean) => void ,setisError: (arg0: boolean) => void) => {
		try {
			setLoading(true);
			// Fetch weather data using latitude and longitude
			const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${YOUR_API_KEY}&units=metric`);
			if (!response.ok) {
				setisError(true)
				setLoading(false);
				throw new Error('Failed to fetch weather data');
			}
			const data = await response.json();
			setWeatherData(data);
			setLoading(false);

			// Fetch forecast data using latitude and longitude
			const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${YOUR_API_KEY}&units=metric`);
			if (!forecastResponse.ok) {
				setisError(true)
				setLoading(false);
				throw new Error('Failed to fetch forecast data');
			}
			const forecastData = await forecastResponse.json();
			setForecastData(forecastData);
		} catch (error: any) {
			setError('Error fetching data: ' + error.message);
		}
			};
	

			
	export const fetchWeatherDataByCity = async (setError: (arg0: string) => void ,setForecastData: (arg0: any) => void ,setWeatherData: (arg0: any) => void ,setisError: (arg0: boolean) => void,setLoading: (arg0: boolean) => void,city: any) => {
		try {
			setLoading(true);
			// Fetch latitude and longitude coordinates for the city
			const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${YOUR_API_KEY}&units=metric`);
			if (!response.ok) {
				setisError(true)
				setLoading(false);
				throw new Error('Failed to fetch coordinates');
			}
			const data = await response.json();
			setWeatherData(data);
			setLoading(false);

			const { coord } = data;
			const { lat, lon } = coord;

			// Fetch forecast data using latitude and longitude coordinates
			const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${YOUR_API_KEY}&units=metric`);
			if (!forecastResponse.ok) {
				setisError(true)
				setLoading(false);
				throw new Error('Failed to fetch forecast data');
			}
			const forecastData = await forecastResponse.json();
			setForecastData(forecastData);
		} catch (error: any) {
			setError('Error fetching data: ' + error.message);
		}
	};


