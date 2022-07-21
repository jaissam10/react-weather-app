const API_KEY = "MDMxOGRhMDBhMzJhZjk3ODc3ZjVkY2NhNzllNzkxNDE=";

export const apiCall = ({ url, ...apiOptions }) => {
  // console.log("api call ->", url, apiOptions);
  return fetch(
    `${url}&units=metric&lang=fr&appid=${atob(API_KEY)}`,
    apiOptions
  ).then((res) => res.json());
};
