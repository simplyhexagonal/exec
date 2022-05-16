import { exec as execCallback } from 'child_process';

import elean from '@simplyhexagonal/elean';
import MonoContext from '@simplyhexagonal/mono-context';

// @ts-ignore
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
  exitCode:number;
  stdoutOutput:string;
  stderrOutput:string;
}

export class ExecError extends Error {
  exitCode:number;
  stdoutOutput:string;
  stderrOutput:string;

  constructor(message:string, exitCode:number, stdoutOutput:string, stderrOutput:string) {
    super(message);

    this.exitCode = exitCode;
    this.stdoutOutput = stdoutOutput;
    this.stderrOutput = stderrOutput;
  };
}

const { REALTIME_LOG } = process.env;

const exec = (
  command: string,
  options?: ExecOptions,
) => {
  const {
    realtimeStdout,
    logStdout,
    logStderr,
    loggerInstance,
    stdoutLogLevel,
    stderrLogLevel,
  } = options || {};

  const shouldRealtimeLog = realtimeStdout || elean(REALTIME_LOG);

  const logger = loggerInstance || MonoContext.getStateValue('logger') || console;

  const child = execCallback(command);

  const {stdout, stderr} = child;

  const stdoutChunks: any[] = [];
  const stderrChunks: any[] = [];

  let stdoutOutput = '';
  let stderrOutput = '';

  stdout?.on('data', (chunk) => {
    logStdout && realtimeStdout && chunk && logger && logger[stdoutLogLevel || 'debug'](chunk);
    stdoutChunks.push(Buffer.from(chunk));
  });
  stderr?.on('data', (chunk) => {
    logStderr && realtimeStdout && chunk && logger && logger[stderrLogLevel || 'debug'](chunk);
    stderrChunks.push(Buffer.from(chunk));
  });

  const stdoutPromise = new Promise<void>((resolve, reject) => {
    stdout?.on('end', () => {
      stdoutOutput = Buffer.concat(stdoutChunks).toString('utf8');
      resolve();
    });
  });

  const stderrPromise = new Promise<void>((resolve, reject) => {
    stderr?.on('end', () => {
      stderrOutput = Buffer.concat(stderrChunks).toString('utf8');
      resolve();
    });
  });

  return {
    execProcess: child,
    execPromise: new Promise<ExecResult>(
      (resolve, reject) => {
        child.addListener('error', reject);
        child.addListener('exit', async (exitCode: number) => {
          await stdoutPromise;
          await stderrPromise;

          if (stdoutOutput && !shouldRealtimeLog && logStdout) {
            logger[stdoutLogLevel || 'debug'](stdoutOutput);
          }

          if (exitCode === 0 && stderrOutput && logStderr) {
            await logger[stderrLogLevel || 'warn'](stderrOutput);
          }

          if (exitCode !== 0 && logStderr) {
            logger[stderrLogLevel || 'warn'](`Error exit code of command "${command}" is: ${exitCode}`);

            reject(
              new ExecError(
                stderrOutput || stdoutOutput,
                exitCode,
                stdoutOutput,
                stderrOutput
              )
            );
          }

          resolve({
            exitCode,
            stdoutOutput,
            stderrOutput,
          });
        });
      }
    )
  };
};

export default exec;
