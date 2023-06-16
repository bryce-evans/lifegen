"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const openAIChatRequest_1 = require("./openAIChatRequest");
const prompts_1 = require("./prompts");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const port = 3111;
app.use(body_parser_1.default.json());
app.post("/chat/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // make a chat request to OpenAI with the information about state of the world
    // and the action that the other agent took
    // req.body.actions is an array of the last 20 actions in string form. We must combine them into a single string.
    const messages = (0, utils_1.formatActionsToString)(req.body.actions);
    const text = yield (0, openAIChatRequest_1.OpenAIRequest)({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: prompts_1.Agent1SystemPrompt },
            {
                role: "user",
                content: "Here is the context, of the current situation. Use it to describe your next move:\n" +
                    messages,
            },
        ],
    });
    res.status(200).json({ action: text });
}));
app.listen(port, () => console.log(`Agent listening on port ${port}!`));
const serverUrl = "http://localhost:3123";
axios_1.default
    .post(`${serverUrl}/join`, {
    name: "Aelis Windrider",
    url: `http://localhost:${port}/chat/`,
})
    .then((res) => console.log(res.data))
    .catch((error) => console.error(`Failed to join server: ${error.response && error.response.data
    ? error.response.data.error
    : error}`));