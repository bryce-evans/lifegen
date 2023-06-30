import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { OpenAIRequest } from "../../lib/utils";
import { Agent3SystemPrompt } from "../prompts";
import { formatActionsToString } from "../../lib/utils";
import { server_port, network_url, MAX_RETRIES } from "../../lib/constants";

const app: Express = express();
const port: number = 3113;

app.use(bodyParser.json());

app.post("/chat/", async (req: Request, res: Response) => {
  const messages = formatActionsToString(req.body.actions);

  const text = await OpenAIRequest({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: Agent3SystemPrompt },
      {
        role: "user",
        content:
          "Here is the context, of the current situation. Use it to describe your next move:\n" +
          messages,
      },
    ],
  });
  res.status(200).json({ action: text });
});

app.listen(port, () => console.log(`Agent listening on port ${port}!`));

const serverUrl: string = `http://${network_url}:${server_port}`;

let retries = 0;

const joinServer = () => {
  axios
    .post(`${serverUrl}/join`, {
      name: "Craig Johnson",
      url: `http://${network_url}:${port}/chat/`,
    })
    .then((res) => console.log(res.data))
    .catch((error) => {
      console.error(
        `Failed to join server: ${
          error.response && error.response.data
            ? error.response.data.error
            : error
        }`
      );

      if (retries < MAX_RETRIES) {
        retries++;
        setTimeout(joinServer, 10000); // Retry after 10 seconds
      }
    });
};

joinServer();