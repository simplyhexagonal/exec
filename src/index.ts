import { exec as execCallback } from 'child_process';

import elean from '@simplyhexagonal/elean';
import MonoContext from '@simplyhexagonal/mono-context';

// @ts-ignore
export { version } from '../package.json';

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

const shouldRealtimeLog = elean(REALTIME_LOG);

const realtimeLog = (...args: any[]) => {
  const logger = MonoContext.getStateValue('logger') || console;

  if (shouldRealtimeLog) {
    logger.debug(...args);
  }
}

export default async (command: string) => {
  const logger = MonoContext.getStateValue('logger') || console;

  const child = execCallback(command);

  const {stdout, stderr} = child;

  const stdoutChunks: any[] = [];
  const stderrChunks: any[] = [];

  let stdoutOutput = '';
  let stderrOutput = '';

  stdout?.on('data', (chunk) => {realtimeLog(chunk);stdoutChunks.push(Buffer.from(chunk));});
  stderr?.on('data', (chunk) => {realtimeLog(chunk);stderrChunks.push(Buffer.from(chunk));});

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

  return await (
    new Promise<ExecResult>(
      (resolve, reject) => {
        child.addListener('error', reject);
        child.addListener('exit', async (exitCode: number) => {
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
  );
};
