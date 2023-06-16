"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ws_1 = __importStar(require("ws"));
const axios_1 = __importDefault(require("axios"));
const deque_1 = __importDefault(require("collections/deque"));
const app = (0, express_1.default)();
const port = 3123;
app.use(body_parser_1.default.json());
app.listen(port, () => console.log(`AgentWorld server listening on port ${port}!`));
const clients = new Set();
const users = [];
const actions = new deque_1.default([], 20);
app.post("/join", (req, res) => {
    const { name, url } = req.body;
    if (users.find((user) => user.name === name || user.url === url)) {
        return res.status(400).json({ error: "Name or URL is already in use." });
    }
    if (users.length >= 10) {
        return res.status(400).json({ error: "Server is full, cannot join." });
    }
    users.push({ name, url });
    if (users.length === 2) {
        startGame();
    }
    res.status(200).json({ message: "Joined successfully." });
});
const wss = new ws_1.Server({ port: 8080 });
const broadcast = (message) => {
    clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    });
};
const startGame = () => __awaiter(void 0, void 0, void 0, function* () {
    while (users.length > 1) {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            try {
                const response = yield axios_1.default.post(user.url, { actions: actions.toArray() }, { timeout: 15000 });
                actions.push({ user: user.name, action: response.data.action });
                console.log(`Received action from ${user.name}: ${response.data.action}`);
                process.stdout.write("Enter response to the action: ");
                const serverResponse = yield new Promise((resolve) => {
                    const listener = (data) => {
                        process.stdin.removeListener("data", listener);
                        resolve(data.toString().trim());
                    };
                    process.stdin.addListener("data", listener);
                });
                broadcast(`Action: ${response.data.action} | Server Response: ${serverResponse}`);
            }
            catch (error) {
                users.splice(i, 1);
                i--;
                console.log(`User ${user.name} has died.`);
                broadcast(`User ${user.name} has died.`);
            }
        }
    }
    console.log("Game over.");
});
wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
});
