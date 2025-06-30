import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function registrer() {
  const [userInfo, setUserinfo] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userInfo.role === "as") {
        const response = await fetch(`${apiUrl}/registrer/as`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: userInfo.name,
            mail: userInfo.mail,
            password: userInfo.password,
          }),
        });
        if (response.ok) {
          console.log("Bien ajouté à la db");
        } else {
          console.log(
            "Il y a eu un problème lors du post du registrer : " +
              response.message
          );
        }
      } else {
        const response = await fetch(`${apiUrl}/registrer/client`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: userInfo.name,
            mail: userInfo.mail,
            password: userInfo.password,
          }),
        });
        if (!response.ok) {
          console.log("Erreur avec client : " + response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <p name="name">Nom :</p>
        <input
          onChange={(e) =>
            setUserinfo((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userInfo.name}
        ></input>
        <p name="mail">Adresse mail : </p>
        <input
          onChange={(e) =>
            setUserinfo((prev) => ({ ...prev, mail: e.target.value }))
          }
          value={userInfo.mail}
          type="email"
        ></input>
        <p name="password">Mot de passe : </p>
        <input
          onChange={(e) =>
            setUserinfo((prev) => ({ ...prev, password: e.target.value }))
          }
          value={userInfo.password}
          type="password"
        ></input>
        <p name="role">Role : </p>
        <select
          value={userInfo.role}
          onChange={(e) =>
            setUserinfo((prev) => ({ ...prev, role: e.target.value }))
          }
        >
          <option value={"as"}>Assistant social</option>
          <option value={"client"}>Bénéficiaire</option>
        </select>
        <button type="submit">S'enregistrer</button>
      </form>
    </>
  );
}
export default registrer;
