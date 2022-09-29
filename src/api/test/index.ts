import axios from "axios";

export const SetTimeoutTest = async (data: string) =>
  await axios.post("http://localhost:8080/test/confirm", {
    data,
  });
