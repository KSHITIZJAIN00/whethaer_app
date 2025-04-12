const express = require("express");
const weatherRoute = require("./routes/weather");

const app = express();
const port = process.env.PORT || 5000;

app.use("/api", weatherRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
