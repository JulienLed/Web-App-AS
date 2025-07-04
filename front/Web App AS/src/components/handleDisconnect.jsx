const apiUrl = import.meta.env.VITE_API_URL;

const handleDisconnect = async (navigate) => {
  try {
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }),
      console.log("Déconnecté");
    navigate("/");
  } catch (error) {
    console.log("Erreur dans le logout front : " + error);
  }
};
export default handleDisconnect;
