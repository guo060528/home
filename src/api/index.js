/**
 * 带超时控制的 fetch
 * @param {String} url 请求地址
 * @param {Number} timeout 超时时间（毫秒）
 */
const fetchWithTimeout = async (url, timeout = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  return await fetchWithTimeout("https://v1.hitokoto.cn");
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  return await fetchWithTimeout(`https://restapi.amap.com/v3/ip?key=${key}`);
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  return await fetchWithTimeout(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  return await fetchWithTimeout("https://api.oioweb.cn/api/weather/GetWeather");
};
