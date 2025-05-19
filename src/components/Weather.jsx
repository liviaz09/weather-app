import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'
import searchIcon from '../assets/search.png'
import clearIcon from '../assets/clear.png'
import cloudIcon from '../assets/cloud.png'
import drizzleIcon from '../assets/drizzle.png'
import humidityIcon from '../assets/humidity.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import windIcon from '../assets/wind.png'

const Weather = () => {

    const inputRef = useRef();
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          search(inputRef.current.value);
        }
      };
    const [weatherData, setWeatherData] = useState(false);
    const [unit, setUnit] = useState('celsius'); // celsius or fahrenheit

    const allIcons = {
        "01d" : clearIcon,
        "01n" : clearIcon,
        "02d" : cloudIcon,
        "02n" : cloudIcon,
        "03d" : cloudIcon,
        "03n" : cloudIcon,
        "04d" : drizzleIcon,
        "04n" : drizzleIcon,
        "09d" : rainIcon,
        "09n" : rainIcon,
        "10d" : rainIcon,
        "10n" : rainIcon,
        "13d" : snowIcon,
        "13n" : snowIcon

    }

    const search = async (city)=>{
        if(city === ""){
            alert=("Enter city name");
            return;
        }

        try {
            const weatherUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(weatherUrl);
            const data = await response.json();

            if(!response.ok){
                alert(data.message);
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clearIcon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })
        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetching weather data");
            
        }

        
    }

    useEffect(()=>{
        search("Vancouver");
    },[])

    const toggleUnit = () => {
        setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
    };

    const convertTemperature = (tempC) => {
        return unit === 'celsius'
            ? `${Math.round(tempC)}°C`
            : `${Math.round((tempC * 9) / 5 + 32)}°F`;
    };

  return (
    <div className='weather'>
        <div className='searchBar'>
            <input ref={inputRef} type='text' placeholder='Search city' onKeyDown={handleKeyDown}/>
            <img src={searchIcon} alt="searchIcon" onClick={()=>search(inputRef.current.value)}/>
            <div className="unit-toggle">
                <label className="switch">
                    <input type="checkbox" onChange={toggleUnit} checked={unit === 'fahrenheit'} />
                    <span className="slider round"></span>
                </label>
                <span>{unit === 'celsius' ? ' Celsius' : ' Fahrenheit'}</span>
            </div>
        </div>
        {weatherData?<>

        <img src={weatherData.icon} alt="clearIcon" className='weatherIcon'/>
        <p className='temperature'>{convertTemperature(weatherData.temperature)}</p>
        <p className='location'>{weatherData.location}</p>
        <div className='weatherData'>
            <div className='col'>
                <img src={humidityIcon} alt="humidityIcon" />
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className='col'>
                <img src={windIcon} alt="" />
                <div>
                    <p> {weatherData.windSpeed} Km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        </>:<></>}

    </div>
  )
}

export default Weather