import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./Forcast";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    city: undefined,
    country: undefined,
    main: undefined,
    icon: "CLEAR_DAY",
    forecast: [], 
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch(() => {
          this.getWeather(28.67, 77.22);
          alert("You have disabled location service.");
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(() => {
      if (this.state.lat && this.state.lon) {
        this.getWeather(this.state.lat, this.state.lon);
      }
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getWeather = async (lat, lon) => {

    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();

    const forecast_call = await fetch(
      `${apiKeys.base}forecast?lat=${lat}&lon=${lon}&units=metric&cnt=6&APPID=${apiKeys.key}`
    );
    const forecast_data = await forecast_call.json();

    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      country: data.sys.country,
      main: data.weather[0].main,
      forecast: forecast_data.list, 
    });

    const iconMap = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
    };
    this.setState({ icon: iconMap[this.state.main] || "CLEAR_DAY" });
  };

  render() {
    return this.state.temperatureC ? (
      <div className="weather-dashboard">
        <h1>Weather Dashboard</h1>

        <div className="two-panel-layout">
          <div className="left-panel">
            <div className="city-info">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>

            <div className="weather-card">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.temperatureC}°C</p>
              <span>{this.state.main}</span>
            </div>

            <div className="date-time">
              <div className="current-time">
                <Clock format="hh:mm:ss A" ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
          </div>

          <div className="right-panel">
            <Forcast icon={this.state.icon} weather={this.state.main} />
          </div>
        </div>

        {/* Forecast */}
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {this.state.forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-date">
                  {new Date(day.dt * 1000).toLocaleDateString()}
                </div>
                <ReactAnimatedWeather
                  icon={day.weather[0].main === "Rain" ? "RAIN" : "CLEAR_DAY"}
                  color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
                />
                <p>{Math.round(day.main.temp)}°C</p>
                <span>{day.weather[0].main}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div>
        <img src={loader} style={{ width: "50%" }} alt="Loading" />
        <h3>Detecting your location...</h3>
      </div>
    );
  }
}

export default Weather;
