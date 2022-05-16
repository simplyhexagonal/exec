/// <reference types="node" />
export { version } from '../package.json';
export interface ExecOptions {
    realtimeStdout?: boolean;
    logStdout?: boolean;
    logStderr?: boolean;
    loggerInstance?: any;
    stdoutLogLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'all' | 'raw';
    stderrLogLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'all' | 'raw';
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
    execProcess: import("child_process").ChildProcess;
    execPromise: Promise<ExecResult>;
};
export default exec;
