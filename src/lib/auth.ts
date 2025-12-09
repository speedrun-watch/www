
export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("exp");
};

export const isTokenValid = () => {
  const exp = localStorage.getItem("exp");
  if (!exp) return false;

  // Check if exp is in seconds or milliseconds. 
  // Usually JWT exp is in seconds.
  // If it's a small number (like < 1e11), it's likely seconds.
  let expTime = parseInt(exp, 10);
  
  // If expTime is in seconds, convert to milliseconds for comparison with Date.now()
  if (expTime < 100000000000) {
    expTime *= 1000;
  }

  return Date.now() < expTime;
};

export const getToken = () => {
    return localStorage.getItem("jwt");
}
