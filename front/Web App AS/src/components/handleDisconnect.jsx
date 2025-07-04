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
      navigate("/");
  } catch (error) {
    console.log(error);
  }
};
export default handleDisconnect;
