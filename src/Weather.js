import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css'; // We'll create this CSS file

export default function Weather() {
    const [Search, setSearch] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const api = {
        key: '3a642d891c2fb46f35303100e3857d97',
        theUrl: "https://api.openweathermap.org/data/2.5/"
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Search.trim()) {
            getWeatherData(Search);
        }
    };

    const getWeatherData = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${api.theUrl}weather`, {
                params: {
                    q: city,
                    appid: api.key,
                    units: 'metric'
                }
            });
            setWeatherData(res.data);
        } catch (err) {
            console.error('Error:', err);
            setError("City not found. Please try another location.");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Search) {
            const timer = setTimeout(() => {
                getWeatherData(Search);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [Search]);

    const getWeatherBackground = () => {
        if (!weatherData) return 'default-bg';
        
        const weatherMain = weatherData.weather[0].main.toLowerCase();
        if (weatherMain.includes('rain')) return 'rain-bg';
        if (weatherMain.includes('cloud')) return 'cloud-bg';
        if (weatherMain.includes('clear')) return 'clear-bg';
        if (weatherMain.includes('snow')) return 'snow-bg';
        return 'default-bg';
    };

    return (
        <div className={`weather-app ${getWeatherBackground()}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="weather-card p-4 shadow-lg rounded-4">
                            <h1 className="text-center mb-4 app-title">
                                <i className="bi bi-cloud-sun me-2"></i>Weather Forecast
                            </h1>
                            
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control search-input" 
                                        placeholder="Search for a city..." 
                                        value={Search}
                                        onChange={handleSearch}
                                    />
                                    <button className="btn btn-primary search-btn" type="submit">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>

                            {loading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger text-center">{error}</div>
                            )}

                            {weatherData && weatherData.main && (
                                <div className="weather-info text-center">
                                    <div className="location mb-3">
                                        <h2 className="city-name">
                                            {weatherData.name}, {weatherData.sys.country}
                                        </h2>
                                        <p className="date mb-0">
                                            {new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>

                                    <div className="weather-main d-flex justify-content-center align-items-center mb-4">
                                        <div className="temperature-display">
                                            <span className="temperature">
                                                {Math.round(weatherData.main.temp)}°C
                                            </span>
                                            <div className="weather-range">
                                                <span className="high">
                                                    H: {Math.round(weatherData.main.temp_max)}°C
                                                </span>
                                                <span className="low">
                                                    L: {Math.round(weatherData.main.temp_min)}°C
                                                </span>
                                            </div>
                                        </div>
                                        <div className="weather-icon ms-3">
                                            <img 
                                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
                                                alt={weatherData.weather[0].description} 
                                                className="img-fluid"
                                            />
                                            <p className="weather-description text-capitalize">
                                                {weatherData.weather[0].description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="weather-details row g-3">
                                        <div className="col-6 col-md-3">
                                            <div className="detail-card p-2 rounded-3">
                                                <i className="bi bi-droplet"></i>
                                                <p>Humidity</p>
                                                <h4>{weatherData.main.humidity}%</h4>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="detail-card p-2 rounded-3">
                                                <i className="bi bi-wind"></i>
                                                <p>Wind</p>
                                                <h4>{weatherData.wind.speed} m/s</h4>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="detail-card p-2 rounded-3">
                                                <i className="bi bi-speedometer2"></i>
                                                <p>Pressure</p>
                                                <h4>{weatherData.main.pressure} hPa</h4>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <div className="detail-card p-2 rounded-3">
                                                <i className="bi bi-eye"></i>
                                                <p>Visibility</p>
                                                <h4>{(weatherData.visibility / 1000).toFixed(1)} km</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}