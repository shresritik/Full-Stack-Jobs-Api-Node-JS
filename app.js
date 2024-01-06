require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/jobs");
const authenticateUser = require("./middleware/authentication");
const morgan = require("morgan");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
//limit api hit rate
const rateLimiter = require("express-rate-limit");
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15min
    max: 100, //limit each IP to 100 requests per windowsMs
  })
);
//extra security packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
app.use(morgan("tiny"));
// extra packages
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authenticateUser, jobRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
