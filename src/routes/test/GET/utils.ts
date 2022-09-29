import { SetTimeoutTest } from "@api";

export const TestUtils = (data: string) => {
  console.log("시작되었음!");
  setTimeout(async () => {
    console.log("지금 나갑니당.");

    SetTimeoutTest(data);
  }, 5000);
};
