export const clearSpecificLocalStorageData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("mor_cond_id");
    localStorage.removeItem("mor_apto");
    localStorage.removeItem("mor_bloco");
    localStorage.removeItem("encryptedCPF");
    localStorage.removeItem("encryptedPassword");
};