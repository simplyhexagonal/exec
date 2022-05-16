import exec, { ExecError } from './';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockLogger = (logTracking: string[]) => ({
  debug: (message: any) => logTracking.push(`debug: ${message}`),
  warn: (message: any) => logTracking.push(`warn: ${message}`),
});

describe('Simply Hexagonal exec', () => {
  it('can handle a successful command', async () => {
    const result = await exec('echo hello world').execPromise;

    expect(result.stdoutOutput).toBe('hello world\n');
    expect(result.exitCode).toBe(0);
  });

  it('can handle a failing command', async () => {
    const result = await exec('>&2 echo hello world && exit 1').execPromise.catch((e) => e);

    expect(result.stdoutOutput).toBe('');
    expect(result.exitCode).toBe(1);
    expect(result.stderrOutput).toBe('hello world\n');
  });

  it('can return the child process', async () => {
    const {
      execProcess,
      execPromise,
    } = exec('sleep 2; echo hello world');

    execProcess.kill('SIGINT');

    const result = await execPromise.catch<ExecError>((e) => e);

    expect(result.stdoutOutput).toBe('');
    expect(result.stderrOutput).toBe('');
    expect(result.exitCode).toBe(null);
  });

  it('can control real-time logging', async () => {
    let result;
    const logs: string[] = [];
  
    result = await exec('printf "hello world"').execPromise;

    expect(logs.length === 0);
    expect(logs[0]).toBeUndefined();
    expect(result.stdoutOutput).toBe('hello world');
    expect(result.exitCode).toBe(0);

    const { execPromise } = exec(
      'printf "hello world"; sleep 1;',
      {
        logStdout: true,
        realtimeStdout: true,
        loggerInstance: mockLogger(logs)
      }
    );

    await sleep(500);

    expect(logs.length === 1);
    expect(logs[0]).toBe('debug: hello world');

    result = await execPromise;

    expect(result.stdoutOutput).toBe('hello world');
    expect(result.exitCode).toBe(0);
  });
});
