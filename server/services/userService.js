const API_URL = process.env.REACT_APP_API_URL;

const register = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    return res.json();
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
};

