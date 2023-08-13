import ky from "ky";
import * as config from "./config";

export async function generateImage(text: string) {
  const url = `${config.apiBaseUrl}/api/gen`;
  console.log("url", url);
  return ky
    .post(url, {
      json: {
        query: text,
      },
      timeout: 60000,
    })
    .json<{ output: string }>();
}
