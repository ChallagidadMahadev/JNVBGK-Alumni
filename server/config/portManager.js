import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT_FILE = path.join(process.cwd(), ".port");

export const savePort = (port) => {
  try {
    fs.writeFileSync(PORT_FILE, port.toString());
    console.log(`Port ${port} saved to ${PORT_FILE}`);
  } catch (error) {
    console.error("Error saving port:", error);
  }
};

export const getPort = () => {
  try {
    if (fs.existsSync(PORT_FILE)) {
      const port = parseInt(fs.readFileSync(PORT_FILE, "utf8"));
      console.log(`Read port ${port} from ${PORT_FILE}`);
      return port;
    }
  } catch (error) {
    console.error("Error reading port:", error);
  }
  return 5000;
};
