import Registrer from "./Registrer";
import Login from "./Login";
import Popup from "reactjs-popup";

const apiUrl = import.meta.env.VITE_API_URL;

function Home({ popup, setPopup }) {
  const handleClick = async (e) => {
    if (e.target.value === "login") {
      setPopup((prev) => ({ ...prev, login: true }));
    } else if (e.target.value === "registrer") {
      setPopup((prev) => ({ ...prev, registrer: true }));
    } else if (e.target.value === "google") {
      try {
        window.location.href = `${apiUrl}/login/google`;
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="title">
        <h1>Web App AS</h1>
      </div>
      <div className="buttons">
        <button
          className="btn_1"
          value={"login"}
          onClick={(e) => handleClick(e)}
        >
          Vers le login
        </button>
        <button
          className="btn_1"
          value={"google"}
          onClick={(e) => handleClick(e)}
        >
          Login avec Google
        </button>
        <button
          className="btn_1"
          value={"registrer"}
          onClick={(e) => handleClick(e)}
        >
          Vers l'enregistrement
        </button>
      </div>
      <div className="cursor_container">
        <p className="cursor typewriter1">
          Cette application vous permet de prendre rendez-vous avec
        </p>
        <p className="cursor typewriter2">
          l'un de nos nombreux assistants sociaux. Le rendez-vous
        </p>
        <p className="cursor typewriter3">
          le plus proche sera automatiquement sélectionné.
        </p>
      </div>

      <div>
        <Popup
          className="popup-content"
          open={popup.login}
          overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          position={"center"}
          modal
          nested
          closeOnDocumentClick={false}
        >
          <Login popup={popup} setPopup={setPopup} />
        </Popup>
        <Popup
          className="popup-content"
          overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          open={popup.registrer}
          position={"center"}
          modal
          nested
          closeOnDocumentClick={false}
        >
          <Registrer popup={popup} setPopup={setPopup} />
        </Popup>
      </div>
    </>
  );
}
export default Home;
