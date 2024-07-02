import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.messgae || "Something went wrong, failed to send request."
    );
  }
  return resData;
}

export default function useHttp(url, config, initialData) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);

  const sendRequest = useCallback(async function sendRequest(data) {
    setIsLoading(true);
    try {
      const resData = await sendHttpRequest(url, { ...config, body: data });
      setData(resData);
    } catch (error) {
      setError(error.message || "Somehing went wrong!");
    }
    setIsLoading(false);
  });
  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [url, config]);
  //   return { data, isLoading, error, sendRequest };
  return { data, isLoading, error, sendRequest };
}
