import axios from "axios";
import _ from "lodash";

async function errorRetry() {
  try {
    await axios.get("http://localhost:8080/error-retry");
    console.log("success!");
  } catch (err) {}
}

(async () => await errorRetry())();
