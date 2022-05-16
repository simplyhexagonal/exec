/// <reference types="node" />
export { version } from '../package.json';
export interface ExecOptions {
    logStdout?: boolean;
    logStderr?: boolean;
    loggerInstance?: any;
}
export interface ExecResult {
    exitCode: number;
    stdoutOutput: string;
    stderrOutput: string;
}
export declare class ExecError extends Error {
    exitCode: number;
    stdoutOutput: string;
    stderrOutput: string;
    constructor(message: string, exitCode: number, stdoutOutput: string, stderrOutput: string);
}
declare const exec: (command: string, options?: ExecOptions | undefined) => {
    process: import("child_process").ChildProcess;
    promise: Promise<ExecResult>;
};
export default exec;
