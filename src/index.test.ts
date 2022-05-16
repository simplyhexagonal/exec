import exec, { ExecError } from './';

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
});
