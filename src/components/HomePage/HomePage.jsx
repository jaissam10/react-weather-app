import s from "./HomePage.module.scss";
import { frenchCitiesList } from "../../dummyData/cities-fr";
import { useEffect, useState } from "react";
import { apiCall } from "../../utils/http";
import { apiUrls, DAYS } from "../../utils/constants";

const HomePage = () => {
  const { fetchCurrentWeather, foreCastWeather } = apiUrls;
  const [currWeatherData, setCurrWeatherData] = useState(null);
  const [foreCastWeatherData, setForeCastWeatherData] = useState(null);

  useEffect(() => {
    // console.log("data", foreCastWeatherData);
    fetchCurrentWeatherApi(frenchCitiesList[0]);
  }, []);

  const fetchCurrentWeatherApi = async ({ lat, lon }) => {
    setCurrWeatherData(null);
    setForeCastWeatherData(null);
    const currWeatherDataApi = apiCall({
      url: `${fetchCurrentWeather}?lat=${lat}&lon=${lon}`,
      method: "GET",
      body: null,
    });
    const foreCastWeatherDataApi = apiCall({
      url: `${foreCastWeather}?lat=${lat}&lon=${lon}&cnt=17`,
      method: "GET",
      body: null,
    });
    // console.log("currWeatherData", currWeatherData);
    Promise.allSettled([currWeatherDataApi, foreCastWeatherDataApi]).then(
      (results) => {
        setCurrWeatherData(
          results[0].status === "fulfilled" ? results[0].value : null
        );
        // Logic of fore cast data
        const foreCastWeatherDataApi =
          results[1].status === "fulfilled" ? results[1].value : null;
        const foreCastWeatherArr = [];
        if (foreCastWeatherDataApi) {
          for (let i = 0; i < 3; i++) {
            const data = foreCastWeatherDataApi.list[i * 8];
            let temp = data.main.temp;
            let icon = data.weather[0].icon;
            foreCastWeatherArr.push({
              dt: data.dt,
              temp,
              icon,
              day: DAYS[new Date(data.dt_txt).getDay()],
            });
          }
        }
        setForeCastWeatherData(foreCastWeatherArr);
      }
    );
  };

  return (
    <div className={s.homePageContainer}>
      <div className={s.selectCityContainer}>
        <span>Select City</span>
        <select
          className={s.selectBox}
          onChange={(e) => {
            console.log("changed");
            const currCity = JSON.parse(e.target.value);
            fetchCurrentWeatherApi(currCity);
          }}
        >
          {frenchCitiesList.map((cityObj) => (
            <option key={cityObj.id} value={JSON.stringify(cityObj)}>
              {cityObj.nm}
            </option>
          ))}
        </select>
      </div>
      <div className={s.weatherContainer}>
        {currWeatherData || foreCastWeatherData ? (
          <>
            <div className={s.currWeatherContainer}>
              <span>{currWeatherData?.name}</span>

              <img
                src={`http://openweathermap.org/img/wn/${currWeatherData?.weather?.[0]?.icon}.png`}
                alt="wth"
                width={50}
                height={50}
              />
              <span>
                {currWeatherData?.main?.temp}
                <span>&#176;</span>
              </span>
            </div>
            <div className={s.foreCastWeatherContainer}>
              {foreCastWeatherData &&
                foreCastWeatherData.map(({ dt, day, icon, temp }) => {
                  return (
                    <div key={dt} className={s.weatherContainer}>
                      <span>{day}</span>
                      <img
                        src={`http://openweathermap.org/img/wn/${icon}.png`}
                        alt="wth"
                        width={50}
                        height={50}
                      />
                      <span>
                        {temp}
                        <span>&#176;</span>
                      </span>
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          <div className={s.loader}></div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
