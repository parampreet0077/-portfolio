import axios from "axios";

export const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const FILE_ROOT = API_ROOT.replace(/\/api$/, "");

export const api = axios.create({ baseURL: API_ROOT });

export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${FILE_ROOT}${path}`;
};

export const downloadResume = async () => {
  const response = await api.get("/resume/download", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Parampreet-Singh-Resume.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
