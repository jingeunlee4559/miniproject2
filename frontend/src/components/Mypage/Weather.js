import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import '../../css/Weather.css';

const Weather = ({ inptLocation, turnBack }) => {
    const [apiValue, setApiValue] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
                (error) => reject(error),
            );
        });
    };

    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${inptLocation ? `q=${inptLocation}` : `lat=${latitude}&lon=${longitude}`}&appid=${
                process.env.key
            }&units=metric&lang=kr`;

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${inptLocation ? `q=${inptLocation}` : `lat=${latitude}&lon=${longitude}`}&appid=${
                process.env.key
            }&units=metric&lang=kr`;

            const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);

            if (!weatherResponse.ok || !forecastResponse.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            const dailyForecasts = forecastData.list.filter((item) => item.dt_txt.endsWith('18:00:00'));

            setApiValue(weatherData);
            setForecastData(dailyForecasts);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const getWeather = async () => {
            try {
                const { latitude, longitude } = await getCurrentLocation();
                await fetchWeatherData(latitude, longitude);
            } catch (err) {
                setError('위치를 가져오는 데 실패했습니다');
                setLoading(false);
            }
        };

        getWeather();
    }, [inptLocation]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">로딩 중...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">오류: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <div className="weather-section">
                <div className="current-weather">
                    <h1>현재 날씨</h1>
                    <h2>{apiValue.name}</h2>
                    <img src={`https://openweathermap.org/img/wn/${apiValue.weather[0].icon}@2x.png`} alt={apiValue.weather[0].description} className="weather-icon" />
                    <h3>{apiValue.weather[0].description}</h3>
                    <h4>{apiValue.main.temp}°C</h4>
                    <h5>
                        최고: {apiValue.main.temp_max}°C | 최저: {apiValue.main.temp_min}°C
                    </h5>
                </div>
                <div className="forecast-container">
                    {forecastData.map((item, index) => (
                        <div key={index} className="forecast-item">
                            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} className="forecast-icon" />
                            <h5>{item.dt_txt.slice(5, 10)}</h5>
                            <p>{item.weather[0].description}</p>
                            <p>{item.main.temp}°C</p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default Weather;
