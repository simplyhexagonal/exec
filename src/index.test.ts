import exec, { ExecError } from './';

describe('Simply Hexagonal exec', () => {
  it('can handle a successful command', async () => {
    const result = await exec('echo hello world').promise;

    expect(result.stdoutOutput).toBe('hello world\n');
    expect(result.exitCode).toBe(0);
  });

  it('can handle a failing command', async () => {
    const result = await exec('>&2 echo hello world && exit 1').promise.catch((e) => e);

    expect(result.stdoutOutput).toBe('');
    expect(result.exitCode).toBe(1);
    expect(result.stderrOutput).toBe('hello world\n');
  });

  it('can return the child process', async () => {
    const {
      process,
      promise,
    } = exec('sleep 2; echo hello world');

    process.kill('SIGINT');

    const result = await promise.catch<ExecError>((e) => e);

    expect(result.stdoutOutput).toBe('');
    expect(result.stderrOutput).toBe('');
    expect(result.exitCode).toBe(null);
  });
});
