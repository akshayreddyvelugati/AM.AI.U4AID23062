import axios from "axios";

const LOG_API =
  "http://20.207.122.201/evaluation-service/logs";

const TOKEN = "YOUR_TOKEN";

type Stack = "frontend" | "backend";

type Level =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

interface LogProps {
  stack: Stack;
  level: Level;
  package: FrontendPackage;
  message: string;
}

export async function Log({
  stack,
  level,
  package: pkg,
  message,
}: LogProps) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

  } catch (error) {

    console.error("Logging failed");
  }
}