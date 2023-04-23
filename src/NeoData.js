import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const NeoData = () => {
  const [neoData, setNeoData] = useState(null);
  const [startDate, setStartDate] = useState("2015-09-01");
  const [endDate, setEndDate] = useState("2015-09-05");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=2pGeMFLgf1NlneAE8tytjeMQx5h5FnJEad6dyKeb`
      );
      setNeoData(response.data);
    };
    fetchData();
  }, [startDate, endDate]);

  const getAsteroidStats = () => {
    const asteroidStats = [];
    const dates = Object.keys(neoData.near_earth_objects).sort(); // Sort dates in ascending order

    for (let date of dates) {
      const asteroids = neoData.near_earth_objects[date];
      const totalAsteroids = asteroids.length;

      // Get the fastest asteroid in km/h
      let fastestAsteroid = null;
      let fastestSpeed = -Infinity;
      asteroids.forEach((asteroid) => {
        const speed =
          asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
        if (speed > fastestSpeed) {
          fastestAsteroid = asteroid;
          fastestSpeed = speed;
        }
      });

      // Get the closest asteroid
      let closestAsteroid = null;
      let closestDistance = Infinity;
      asteroids.forEach((asteroid) => {
        const distance =
          asteroid.close_approach_data[0].miss_distance.kilometers;
        if (distance < closestDistance) {
          closestAsteroid = asteroid;
          closestDistance = distance;
        }
      });

      // Get the average size of the asteroids in kilometers
      let totalSize = 0;
      asteroids.forEach((asteroid) => {
        const size = asteroid.estimated_diameter.kilometers.average;
        totalSize += size;
      });
      const averageSize = totalSize / asteroids.length;

      asteroidStats.push({
        date: date,
        asteroids: totalAsteroids,
        fastestAsteroid: fastestAsteroid.name,
        fastestSpeed: fastestSpeed,
        closestAsteroid: closestAsteroid.name,
        closestDistance: closestDistance,
        averageSize: averageSize,
      });
    }
    return asteroidStats;
  };

  const asteroidStats = neoData ? getAsteroidStats() : null;

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFetchDataClick = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      alert("Please select a date range within the last 7 days.");
      return;
    }

    const fetchData = async () => {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`
      );
      setNeoData(response.data);
    };
    fetchData();
  };

  return (
    <div>
        <p>
            (there is a limit of sending number of request per hour with an IP to the API and date
            range is also there of 7 days)
          </p>
      <div>
        <label htmlFor="start-date-input">Start Date:</label>
        <input
          id="start-date-input"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label htmlFor="end-date-input">End Date:</label>
        <input
          id="end-date-input"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      <button onClick={handleFetchDataClick} className="btn btn-primary">
        Fetch Data
      </button>
      {asteroidStats ? (
        <div className="mx-auto container">
          <h2>Asteroid Stats:</h2>{" "}
          
          <LineChart width={600} height={300} data={asteroidStats}>
            <XAxis dataKey="date" />
            <YAxis dataKey="asteroids"/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="asteroids" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="fastestSpeed" stroke="#82ca9d" />
            <Line type="monotone" dataKey="closestDistance" stroke="#ffc658" />
            {/* <Line type="monotone" dataKey="averageSize" stroke="#8884d8" /> */}
          </LineChart>
        </div>
      ) : (
        <p>Loading NEO data...</p>
      )}
    </div>
  );
};

export default NeoData;



