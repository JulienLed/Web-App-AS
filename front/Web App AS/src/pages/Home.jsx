import { useNavigate } from "react-router";
import styles from "../css/Home.module.css";
import Registrer from "./Registrer";
import Login from "./Login";
import Popup from "reactjs-popup";

function Home({ popup, setPopup }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (e.target.value === "login") {
      setPopup((prev) => ({ ...prev, login: true }));
    } else if (e.target.value === "registrer") {
      setPopup((prev) => ({ ...prev, registrer: true }));
    }
  };
  return (
    <>
      <div className={styles.title}>
        <h1>Webb App AS</h1>
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.btn_1}
          value={"login"}
          onClick={(e) => handleClick(e)}
        >
          Vers le login
        </button>
        <button
          className={styles.btn_1}
          value={"registrer"}
          onClick={(e) => handleClick(e)}
        >
          Vers l'enregistrement
        </button>
      </div>
      <div className={styles.cursor_container}>
        <p className={`${styles.cursor} ${styles.typewriter1}`}>
          Cette application vous permet de prendre rendez-vous avec
        </p>
        <p className={`${styles.cursor} ${styles.typewriter2}`}>
          l'un de nos nombreux assistants sociaux. Le rendez-vous
        </p>
        <p className={`${styles.cursor} ${styles.typewriter3}`}>
          le plus proche sera automatiquement sélectionné.
        </p>
      </div>

      <div>
        <Popup
          className=".popup-content"
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
          className=".popup-content"
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
