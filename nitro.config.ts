import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  preset: "vercel",
  srcDir: "src",
  build: {
    rollup: {
      emitCJS: true,
    },
  },
});
