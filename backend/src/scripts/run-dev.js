#!/usr/bin/env node

/**
 * This script runs the development server with proper environment setup
 */

const { spawn } = require("child_process");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },

  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  },
};

console.log(
  `${colors.fg.cyan}${colors.bright}Starting WhatsApp Hosting Backend...${colors.reset}`,
);
console.log(
  `${colors.fg.yellow}Press Ctrl+C to stop the server${colors.reset}`,
);

// Run the server using nodemon
const nodemon = spawn("npx", ["nodemon"], {
  stdio: "inherit",
  shell: true,
});

nodemon.on("close", (code) => {
  if (code !== 0) {
    console.log(
      `${colors.fg.red}Server process exited with code ${code}${colors.reset}`,
    );
  }
  process.exit(code);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log(
    `${colors.fg.yellow}\nGracefully shutting down...${colors.reset}`,
  );
  nodemon.kill();
  process.exit(0);
});
