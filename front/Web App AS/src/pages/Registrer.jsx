import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

function Registrer({ popup, setPopup }) {
  const [userInfo, setUserinfo] = useState({
    role: "as",
    name: "",
    mail: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = userInfo.role === "as" ? "as" : "client";
      const response = await fetch(`${apiUrl}/registrer/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userInfo.name,
          mail: userInfo.mail,
          password: userInfo.password,
        }),
      });

      if (response.status === 201) {
        toast.success(`${userInfo.name} bien enregistré`, { autoClose: 1000 });
        setUserinfo({ role: "as", name: "", mail: "", password: "" });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        console.log("Erreur lors du post : ", response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className="registerForm" onSubmit={handleSubmit}>
        <div className="group">
          <input
            required
            type="text"
            value={userInfo.name}
            onChange={(e) =>
              setUserinfo((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Nom</label>
        </div>

        <div className="group">
          <input
            required
            type="email"
            value={userInfo.mail}
            onChange={(e) =>
              setUserinfo((prev) => ({ ...prev, mail: e.target.value }))
            }
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Adresse mail</label>
        </div>

        <div className="group">
          <input
            required
            type="password"
            value={userInfo.password}
            onChange={(e) =>
              setUserinfo((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Mot de passe</label>
        </div>

        <div className="group">
          <select
            required
            value={userInfo.role}
            onChange={(e) => setUserinfo({ ...userInfo, role: e.target.value })}
          >
            <option value="" disabled hidden></option>
            <option value="as">Assistant social</option>
            <option value="client">Bénéficiaire</option>
          </select>
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Rôle</label>
        </div>

        <button
          className="btn_1"
          type="submit"
          onClick={() => setPopup((prev) => ({ ...prev, registrer: false }))}
        >
          S'enregistrer
        </button>
        <button
          type="button"
          className="btn_1"
          onClick={() => setPopup((prev) => ({ ...prev, registrer: false }))}
        >
          Retour
        </button>
      </form>
    </>
  );
}

export default Registrer;
