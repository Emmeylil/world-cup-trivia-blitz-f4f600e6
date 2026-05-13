import server from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  // TanStack Start's server object has a fetch method that handles the Request
  return server.fetch(request);
}
