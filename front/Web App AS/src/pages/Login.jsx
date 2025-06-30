import { useState } from "react";
import { useNavigate } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [responseToShow, setResponseToShow] = useState(
    "Pas de réponse Serveur"
  );
  const [loginInfo, setLoginInfo] = useState({});
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ mail: loginInfo.mail, password: loginInfo.pwd }),
      });
      const resJson = await response.json();
      setResponseToShow(resJson);
      if (response.ok) {
        navigate(`/client`);
      }
    } catch (error) {
      console.log("Erreur dans le log in : " + error);
    }
  };
  return (
    <>
      <form onSubmit={(e) => handleLogin(e)}>
        <p>Mail :</p>
        <input
          onChange={(e) =>
            setLoginInfo((prev) => ({ ...prev, mail: e.target.value }))
          }
          value={loginInfo.mail}
        ></input>
        <p>Mot de passe :</p>
        <input
          type="password"
          onChange={(e) =>
            setLoginInfo((prev) => ({ ...prev, pwd: e.target.value }))
          }
          value={loginInfo.pwd}
        ></input>
        <button type="submit">Connexion</button>
      </form>
      <>{`Réponse du serveur : ${
        responseToShow.message || "Pas de message serveur"
      }`}</>
    </>
  );
}

export default Login;
