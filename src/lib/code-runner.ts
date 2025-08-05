import { chmod, unlink, writeFile } from "fs/promises";
import { promisify } from "util";
import { exec as rawExec } from "child_process";
import pty from "node-pty";
import { existsSync, mkdirSync } from "fs";

const exec = promisify(rawExec);

export async function runCCode(code: string, input: string): Promise<{ output: string | null; error: string | null }> {
  const tmpDir = "./tmp";
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir);
  }

  const id = Date.now() + "-" + Math.random().toString(36).slice(2);
  const codePath = `${tmpDir}/${id}.c`;
  const binaryPath = `${tmpDir}/${id}.out`;

  // Inject fflush to ensure output is flushed immediately
  const modifiedCode = code.replace(
    /int\s+main\s*\([^)]*\)\s*{/,
    match => match + `\n printf("\\n"); fflush(stdout);`
  );

  await writeFile(codePath, modifiedCode);

  try {
    await exec(`gcc ${codePath} -o ${binaryPath}`);
    await chmod(binaryPath, 0o755);
  } catch (err: any) {
    return { output: null, error: "Compilation failed: " + err.stderr };
  }

  return new Promise((resolve) => {
    const ptyProcess = pty.spawn(`./${id}.out`, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: tmpDir,
      env: process.env,
    });

    let output = "";
    const inputLines = input.split(/\r?\n/);
    let inputIndex = 0;

    const overallTimeout = setTimeout(() => {
      ptyProcess.kill();
      resolve({
        output: output.trim() + "\n\n[Execution timed out]",
        error: null,
      });
    }, 5000); // total safety timeout

    let idleTimeout: NodeJS.Timeout | null = null;

    const startIdleTimer = () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        if (inputIndex < inputLines.length) {
          const line = inputLines[inputIndex++];
          ptyProcess.write(line + "\r");
          startIdleTimer(); // reset after input
        }
      }, 10); // how long to wait before assuming it needs input
    };

    ptyProcess.onData((data) => {
      output += data;
      startIdleTimer(); // reset idle timer on new output
    });

    ptyProcess.onExit(async ({ exitCode }) => {
      clearTimeout(overallTimeout);
      if (idleTimeout) clearTimeout(idleTimeout);
      try {
        await unlink(codePath);
        await unlink(binaryPath);
      } catch (err) {
        console.warn("Cleanup failed:", err);
      }

      if (exitCode !== 0) {
        return resolve({ output: null, error: `Exited with code ${exitCode}` });
      }
      resolve({ output: output.trim(), error: null });
    });
  });
}
