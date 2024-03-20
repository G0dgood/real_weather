import { LuSearch } from 'react-icons/lu'
import { fetchWeatherDataByCity } from './data';



const CountrySearch = ({ setCity, city, getLocationAndWeather, setError, setForecastData, setWeatherData, setisError, setLoading, cityName }: any) => {


	const handleSearch = (e: any) => {
		e.preventDefault();
		if (city?.trim() !== '') {
			// If user entered a city name, perform search based on the city
			fetchWeatherDataByCity(setError, setForecastData, setWeatherData, setisError, setLoading, city);
		} else {
			// If no city name entered, use geolocation to fetch weather data
			getLocationAndWeather();
		}
	};


	return (
		<form className='input_icon_container' onSubmit={handleSearch}>
			<input
				placeholder='Enter city name...'
				value={city}
				onChange={(e) => setCity(e.target.value)}
			/>
			<button onSubmit={handleSearch} type="submit" className="search_btn"><LuSearch color='#C5C5DE' size={20} /></button>

		</form>
	)
}

export default CountrySearch