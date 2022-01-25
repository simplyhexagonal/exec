var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  ExecError: () => ExecError,
  default: () => src_default,
  version: () => version
});
var import_child_process = __toModule(require("child_process"));
var import_elean = __toModule(require("@simplyhexagonal/elean"));
var import_mono_context = __toModule(require("@simplyhexagonal/mono-context"));

// package.json
var version = "1.0.3";

// src/index.ts
var ExecError = class extends Error {
  constructor(message, exitCode, stdoutOutput, stderrOutput) {
    super(message);
    this.exitCode = exitCode;
    this.stdoutOutput = stdoutOutput;
    this.stderrOutput = stderrOutput;
  }
};
var { REALTIME_LOG } = process.env;
var shouldRealtimeLog = (0, import_elean.default)(REALTIME_LOG);
var realtimeLog = (...args) => {
  const logger = import_mono_context.default.getStateValue("logger") || console;
  if (shouldRealtimeLog) {
    logger.debug(...args);
  }
};
var exec = async (command) => {
  const logger = import_mono_context.default.getStateValue("logger") || console;
  const child = (0, import_child_process.exec)(command);
  const { stdout, stderr } = child;
  const stdoutChunks = [];
  const stderrChunks = [];
  let stdoutOutput = "";
  let stderrOutput = "";
  stdout?.on("data", (chunk) => {
    realtimeLog(chunk);
    stdoutChunks.push(Buffer.from(chunk));
  });
  stderr?.on("data", (chunk) => {
    realtimeLog(chunk);
    stderrChunks.push(Buffer.from(chunk));
  });
  const stdoutPromise = new Promise((resolve, reject) => {
    stdout?.on("end", () => {
      stdoutOutput = Buffer.concat(stdoutChunks).toString("utf8");
      resolve();
    });
  });
  const stderrPromise = new Promise((resolve, reject) => {
    stderr?.on("end", () => {
      stderrOutput = Buffer.concat(stderrChunks).toString("utf8");
      resolve();
    });
  });
  return await new Promise((resolve, reject) => {
    child.addListener("error", reject);
    child.addListener("exit", async (exitCode) => {
      await stdoutPromise;
      await stderrPromise;
      if (stdoutOutput && !shouldRealtimeLog) {
        logger.debug(stdoutOutput);
      }
      if (exitCode === 0 && stderrOutput) {
        await logger.warn(stderrOutput);
      }
      if (exitCode !== 0) {
        logger.debug(`Error exit code is: ${exitCode}`);
        reject(new ExecError(stderrOutput || stdoutOutput, exitCode, stdoutOutput, stderrOutput));
      }
      resolve({
        exitCode,
        stdoutOutput,
        stderrOutput
      });
    });
  });
};
var src_default = exec;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExecError,
  version
});
//# sourceMappingURL=exec.js.map
'undefined'!=typeof module&&(module.exports=exec.default),'undefined'!=typeof window&&(exec=exec.default);