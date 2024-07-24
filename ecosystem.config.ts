export const apps = [{
  name: "app",
  script: "./dist/index.js",
  error_file: "./err.log",
  out_file: "./out.log",
  env: {
    NODE_ENV: "prod"
  }
}];