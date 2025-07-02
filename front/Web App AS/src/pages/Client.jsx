import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL;

function Client() {
  const [clientInfos, setClientInfos] = useState({});
  const [rdvInfos, setRdvInfos] = useState({ theme: "Bilan budgétaire" });
  const [rdvs, setRdvs] = useState([]);
  const navigate = useNavigate();

  //Obtenir et load les infos client
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

  const getClientRdvs = async () => {
    try {
      const response = await fetch(`${apiUrl}/rdv/rdvs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log("Erreur niveau get rdvs : " + error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const dataInfos = await getClientInfos();
      const dataRdvs = await getClientRdvs();
      setRdvs(dataRdvs);
      setClientInfos(dataInfos);
    };
    getData();
  }, []);

  //Gérer les boutons de rdv
  const handleOnClick = (e) => {
    e.preventDefault();
    try {
      if (e.target.innerText === "Oui") {
        const validateRdv = async () => {
          const response = await fetch(`${apiUrl}/rdv`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              description: rdvInfos.description,
              theme: rdvInfos.theme,
            }),
          });
          const responseJson = await response.json();
          console.log(
            `La réponse du serveur % validation rdv : ` + responseJson
          );
        };
        validateRdv();
      } else if (e.target.innerText === "Non") {
        navigate(0);
      }
    } catch (error) {
      console.log("Erreur dans le bouton validation rdv : " + error);
    }
  };
  return (
    <>
      <h3>{`Bonjour ${clientInfos.name}`}</h3>
      <p>{`Votre nom : ${clientInfos.name}`}</p>
      <p>{`Votre adresse mail : ${clientInfos.mail}`}</p>
      <p>Vos rendez-vous : </p>
      <table>
        <thead>
          <tr>Thème</tr>
          <tr>Date</tr>
          <tr>Durée</tr>
        </thead>
        <tbody>
          {rdvs.map((rdv) => {
            return (
              <tr>
                <th>{rdv.theme}</th>
                <th>{rdv.date}</th>
                <th>{rdv.duration}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>Planifier un rendez-vous</p>
      <p>Choisissez un thème : </p>
      <select
        onChange={(e) => {
          setRdvInfos((prev) => ({ ...prev, theme: e.target.value }));
        }}
      >
        <option value="Bilan budgétaire">Bilan budgétaire</option>
        <option value="Visite à domicile">Visite à domicile</option>
        <option value="Appel de soutien">Appel de soutien</option>
        <option value="Réorientation">Réorientation</option>
        <option value="Création réseau">Création réseau</option>
      </select>
      <p>Pour un suivi personnalisé, expliquer ici votre situation : </p>
      <textarea
        cols={100}
        rows={10}
        value={rdvInfos.description}
        onChange={(e) => {
          setRdvInfos((prev) => ({ ...prev, description: e.target.value }));
        }}
        placeholder="Décriver ici votre situation"
      ></textarea>
      <p>Valider ?</p>
      <button onClick={(e) => handleOnClick(e)}>Oui</button>
      <button onClick={(e) => handleOnClick(e)}>Non</button>
    </>
  );
}

export default Client;
