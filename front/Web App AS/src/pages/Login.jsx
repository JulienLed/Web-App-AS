import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

function Login({ setPopup }) {
  const [loginInfo, setLoginInfo] = useState({ mail: "", pwd: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mail: loginInfo.mail, password: loginInfo.pwd }),
      });
      const resJson = await response.json();
      if (response.ok) {
        setLoginInfo({ mail: "", pwd: "" });
        navigate(`/client`);
      } else {
        toast.error(resJson.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="loginForm" onSubmit={handleLogin}>
      <div className="group">
        <input
          type="email"
          required
          value={loginInfo.mail}
          onChange={(e) =>
            setLoginInfo((prev) => ({ ...prev, mail: e.target.value }))
          }
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Mail</label>
      </div>

      <div className="group">
        <input
          type="password"
          required
          value={loginInfo.pwd}
          onChange={(e) =>
            setLoginInfo((prev) => ({ ...prev, pwd: e.target.value }))
          }
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Mot de passe</label>
      </div>

      <button
        type="submit"
        className="btn_1"
        onClick={() => setPopup((prev) => ({ ...prev, login: false }))}
      >
        Connexion
      </button>
      <button
        type="button"
        className="btn_1"
        onClick={() => {
          setPopup((prev) => ({ ...prev, login: false }));
          navigate(`/`);
        }}
      >
        Retour
      </button>
    </form>
  );
}

export default Login;
