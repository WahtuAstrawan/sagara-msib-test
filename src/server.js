import app from "./app.js";
import { PORT } from "./config/env.js";

const port = PORT || 3000;

// Server
app.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});
