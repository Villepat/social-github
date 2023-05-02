import { useState, useEffect } from "react";

function useFetchUserList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const requestOption = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send the cookie along with the request
      };

      try {
        const response = await fetch(
          "http://localhost:6969/api/userlist",
          requestOption
        );
        const data = await response.json();

        if (response.status !== 200) {
          throw Error(data.message);
        } else {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export default useFetchUserList;
