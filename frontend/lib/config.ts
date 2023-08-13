export const environment = process.env.NODE_ENV || "development";
export const isDev = environment === "development";
export const port = process.env.PORT || "3000";
export const domain = "agentworld.vercel.app";
export const prodUrl = `https://${domain}`;
export const url = isDev ? `http://localhost:${port}` : prodUrl;

export const apiBaseUrl =
  isDev || !process.env.VERCEL_URL ? url : `https://${process.env.VERCEL_URL}`;
