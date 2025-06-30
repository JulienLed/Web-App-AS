import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

function Client() {
  const [clientInfos, setClientInfos] = useState({});
  const getClientInfos = async () => {
    try {
      const response = await fetch(`${apiUrl}/client`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log("Erreur niveau appel server Client : " + error);
    }
  };
  return (
    <>
      <h3>Bonjour Client.</h3>
      <p>Souhaitez-vous prendre un rendez-vous ?</p>
      <p>{}</p>
    </>
  );
}

export default Client;
