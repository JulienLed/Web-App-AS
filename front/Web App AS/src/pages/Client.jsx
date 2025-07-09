import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import getDateInfos from "../components/getDateInfos";
import handleDisconnect from "../components/handleDisconnect";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import { motion, AnimatePresence } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

function Client() {
  const [clientInfos, setClientInfos] = useState({});
  const [rdvInfos, setRdvInfos] = useState({
    theme: "Bilan budgétaire",
    description: "",
  });
  const [rdvs, setRdvs] = useState([]);
  const [idRdv, setIdRdv] = useState(0);
  const [asArr, setAsArr] = useState("");
  const [isPopup, setIsPopup] = useState({
    validate: false,
    disconnect: false,
    deleteRdv: false,
  });
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
      if (response.status === 401) {
        navigate(`/login`);
      }
      const responseJson = await response.json();
      if (responseJson.role === "as") {
        toast.error(
          "Les assistants sociaux ne peuvent pas prendre rendez-vous",
          {
            autoClose: 2000,
          }
        );
        handleDisconnect(navigate);
        return;
      }
      return responseJson;
    } catch (error) {
      console.log(error);
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
      if (response.status === 401) navigate(`/login`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(error);
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
      if (response.status === 401) navigate(`/login`);
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      getData();
      toast.success("Rendez-vous annulé", {
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Popup
        className="popup-content"
        open={isPopup.deleteRdv}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        position={"center"}
        modal
        nested
        closeOnDocumentClick={false}
      >
        <p className="p_client">
          Etes-vous sure de vouloir annuler ce rendez-vous ?
        </p>
        <button
          className="btn_1"
          onClick={() => {
            handleDelete(idRdv);
            setIsPopup((prev) => ({ ...prev, deleteRdv: false }));
          }}
        >
          Oui
        </button>
        <button
          className="btn_1"
          onClick={() => setIsPopup((prev) => ({ ...prev, deleteRdv: false }))}
        >
          Non
        </button>
      </Popup>
      <Popup
        className="popup-content"
        open={isPopup.disconnect}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        position={"center"}
        modal
        nested
        closeOnDocumentClick={false}
      >
        <p className="p_client">Etes-vous sure de vouloir vous déconnecter ?</p>
        <button
          className="btn_1"
          onClick={() => {
            setIsPopup((prev) => ({ ...prev, disconnect: false }));
            handleDisconnect(navigate);
          }}
        >
          Oui
        </button>
        <button
          className="btn_1"
          onClick={() => setIsPopup((prev) => ({ ...prev, disconnect: false }))}
        >
          Non
        </button>
      </Popup>
      <h3>{`Bonjour ${clientInfos.name}`}</h3>
      <p className="p_client">Vos rendez-vous : </p>
      {rdvs.length > 0 ? (
        <table className="table_client" style={{ border: "2px, solid, white" }}>
          <thead>
            <tr>
              <th scope="col">Thème</th>
              <th scope="col">Date</th>
              <th scope="col">Durée</th>
              <th scope="col">Assistant social</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rdvs.map((rdv) => {
                return (
                  <motion.tr
                    key={rdv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{rdv.theme || "Pas de thème"}</td>
                    <td>{getDateInfos(rdv.date)}</td>
                    <td
                      style={{ textAlign: "center" }}
                    >{`${rdv.duration} heure(s)`}</td>
                    <td style={{ textAlign: "center" }}>
                      {asArr.find((as) => as.id === rdv.id_as).name}
                    </td>
                    <td>
                      <AiOutlineClose
                        className="buttonDeleteRdv"
                        onClick={() => {
                          setIdRdv(rdv.id);
                          setIsPopup((prev) => ({ ...prev, deleteRdv: true }));
                        }}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      ) : (
        "Pas de rendez-vous prévu"
      )}
      <p className="p_client">Planifier un rendez-vous</p>
      <p className="p_client">Choisissez un thème : </p>
      <select
        value={rdvInfos.theme}
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
      <p className="p_client">
        Pour un suivi personnalisé, expliquer ici votre situation :{" "}
      </p>
      <textarea
        cols={100}
        rows={10}
        value={rdvInfos.description}
        onChange={(e) => {
          setRdvInfos((prev) => ({ ...prev, description: e.target.value }));
        }}
        placeholder="Décriver ici votre situation"
      ></textarea>
      <p className="p_client">Valider ?</p>
      <button
        className="btn_1"
        onClick={() => setIsPopup((prev) => ({ ...prev, validate: true }))}
      >
        Oui
      </button>
      <button className="btn_1">Non</button>
      <Popup
        className="popup-content"
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        open={isPopup.validate}
        position={"center"}
        modal
        nested
        closeOnDocumentClick={false}
      >
        <div style={{ paddingBottom: "5px" }}>Etes-vous sure ?</div>
        <button
          className="btn_1"
          onClick={(e) => {
            handleOnClick(e),
              setIsPopup((prev) => ({ ...prev, validate: false }));
          }}
        >
          Oui
        </button>
        <button
          className="btn_1"
          onClick={(e) => {
            handleOnClick(e),
              setIsPopup((prev) => ({ ...prev, validate: false }));
          }}
        >
          Non
        </button>
      </Popup>
      <button
        className="btn_1"
        onClick={() => setIsPopup((prev) => ({ ...prev, disconnect: true }))}
      >
        Déconnexion
      </button>
    </>
  );
}

export default Client;
