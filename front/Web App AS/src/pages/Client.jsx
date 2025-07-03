import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import getDateInfos from "../components/getDateInfos";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
//import "reactjs-popup/dist/index.css";

const apiUrl = import.meta.env.VITE_API_URL;

function Client() {
  const [clientInfos, setClientInfos] = useState({});
  const [rdvInfos, setRdvInfos] = useState({
    theme: "Bilan budgétaire",
    description: "",
  });
  const [rdvs, setRdvs] = useState([]);
  const [asArr, setAsArr] = useState("");
  const [isPopup, setIsPopup] = useState(false);
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

  const getAsArr = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/as`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      console.log("Erreur dans le getAs front : " + error);
    }
  };

  const getData = async () => {
    const dataInfos = await getClientInfos();
    const dataRdvs = await getClientRdvs();
    const dataAs = await getAsArr();
    setAsArr(dataAs);
    setRdvs(dataRdvs);
    setClientInfos(dataInfos);
  };

  useEffect(() => {
    getData();
  }, []);

  //Gérer les boutons de rdv
  const handleOnClick = async (e) => {
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
        await validateRdv();
        setRdvInfos({ theme: "Bilan budgétaire", description: "" });
        getData();
        setIsPopup(false);
        toast.success("Rendez-vous validé", {
          autoClose: 1000,
        });
      } else if (e.target.innerText === "Non") {
        setIsPopup(false);
        navigate(0);
      }
    } catch (error) {
      console.log("Erreur dans le bouton validation rdv : " + error);
    }
  };

  //Gérer le delete de rdvs
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/rdv/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log("Rdv effacé");
      getData();
      toast.success("Rendez-vous annulé", {
        autoClose: 1000,
      });
    } catch (error) {
      console.log("Erreur dans le delete front : " + error);
    }
  };
  return (
    <>
      <h3>{`Bonjour ${clientInfos.name}`}</h3>
      <p>{`Votre nom : ${clientInfos.name}`}</p>
      <p>{`Votre adresse mail : ${clientInfos.mail}`}</p>
      <p>Vos rendez-vous : </p>
      {rdvs.length > 0 ? (
        <table style={{ border: "2px, solid, white" }}>
          <thead>
            <tr>
              <th scope="col">Thème</th>
              <th scope="col">Date</th>
              <th scope="col">Durée</th>
              <th scope="col">Assistant social</th>
            </tr>
          </thead>
          <tbody>
            {rdvs.map((rdv) => {
              return (
                <tr key={rdv.id}>
                  <td>{rdv.theme || "Pas de thème"}</td>
                  <td>{getDateInfos(rdv.date)}</td>
                  <td
                    style={{ textAlign: "center" }}
                  >{`${rdv.duration} heure(s)`}</td>
                  <td style={{ textAlign: "center" }}>
                    {asArr.find((as) => as.id === rdv.id_as).name}
                  </td>
                  <td>
                    <AiOutlineClose onClick={() => handleDelete(rdv.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "Pas de rendez-vous prévu"
      )}
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
      <button onClick={() => setIsPopup(true)}>Oui</button>
      <button>Non</button>
      <Popup
        contentStyle={{
          border: "2px solid white",
          borderRadius: "5px",
          padding: "10px",
        }}
        overlayStyle={{ backgroundColor: "grey", opacity: "50%" }}
        open={isPopup}
        position={"center"}
        modal
        nested
      >
        <div style={{ paddingBottom: "5px" }}>Etes-vous sure ?</div>
        <button onClick={(e) => handleOnClick(e)}>Oui</button>
        <button onClick={(e) => handleOnClick(e)}>Non</button>
      </Popup>
    </>
  );
}

export default Client;
