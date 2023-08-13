// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { ReplicateClient } from "@/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const query = req.query.query as string;
  if (!query) {
    res.status(400).json({ error: "query is required" });
    return;
  }

  try {
    const replicate = new ReplicateClient();
    const gen_output = await replicate.gen(query);
    res.json({ output: gen_output });
  } catch (error) {
    console.error("replicate error", error);
    res.status(500).json({ error: error ?? "" });
  }
}
