import { useEffect } from "react";

const Ws = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8393/ws");

    // Handle WebSocket events
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      console.log(`Received WebSocket message: ${event.data}`);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Return a function to close the WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, []);

  return "";
};

export default Ws;
