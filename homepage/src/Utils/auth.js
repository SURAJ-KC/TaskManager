// Check if token exists and is not expired
export const getValidToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token || token === "null" || token === "undefined") return null;

  try {
    // Decode token payload (middle part of JWT string)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("accessToken");
      return null;
    }
    return token;
  } catch (e) {
    localStorage.removeItem("accessToken");
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};
export const loginUser = () => {
  window.location.href = "/homepage/src/Components/Dashboard/Dashboard.jsx"
}