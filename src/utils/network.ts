import { networkInterfaces } from "os";

export function getNetwork(): Record<string, string[]> {
  const interfaces = networkInterfaces();
  const results: Record<string, string[]> = {};

  for (const key of Object.keys(interfaces)) {
    const currentNetwork = interfaces[key];
    if (currentNetwork)
      for (const network of currentNetwork) {
        const familyV4Value = typeof network.family === "string" ? "IPv4" : 4;
        if (network.family === familyV4Value && !network.internal) {
          if (!results[key]) {
            results[key] = [];
          }
          results[key].push(network.address);
        }
      }
  }
  return results;
}
