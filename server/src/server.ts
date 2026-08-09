

import app from "./app";
import port from "../src/config/env";


// listen
app.listen(port, () => {
  console.log("Server is running.");
});
