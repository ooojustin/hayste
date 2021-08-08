import { api } from "../redux/auth/actions";

export const loadSteamAccounts = (query = "") => 
    api.get(`steam/accounts?query=${query}`);

export const addSteamAccount = (username, password) => 
    api.post("steam/accounts", { username, password });

export const deleteSteamAccount = id =>
    api.delete(`steam/accounts/${id}`);
