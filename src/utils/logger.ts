import chalk from "chalk";
import Elysia from "elysia";

export const info_log = (msg: string) => {
  console.log(`${chalk.blueBright("info")} ${msg}`);
};

export const error_log = (msg: string) => {
  console.log(`${chalk.redBright("error")} ${msg}`);
};

export const warn_log = (msg: string) => {
  console.log(`${chalk.yellowBright("warn")} ${msg}`);
};

export const success_log = (msg: string) => {
  console.log(`${chalk.greenBright("success")} ${msg}`);
};

export const http_log = (msg: string) => {
  console.log(`${chalk.magentaBright("http")} ${msg}`);
};

export const http_logger = new Elysia().onRequest(({ request }) => {
  const url = new URL(request.url);
  if (url.pathname.includes("favicon.ico")) return;
  http_log(`${chalk.gray(`[${request.method}]`)} ${url.pathname}`);
});
