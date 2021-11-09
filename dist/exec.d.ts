export { version } from '../package.json';
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
declare const _default: (command: string) => Promise<ExecResult>;
export default _default;
