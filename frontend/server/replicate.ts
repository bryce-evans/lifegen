import Replicate from "replicate";

export class ReplicateClient {
  async generate(query: string) {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN ?? "not found",
    });

    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: query,
        },
      }
    );
    return output;
  }
}
