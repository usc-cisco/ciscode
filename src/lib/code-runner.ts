import { unlink, writeFile } from "fs/promises";
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

  // Save code to file
  await writeFile(codePath, code);
  
  // Compile the code
  try {
    await exec(`gcc ${codePath} -o ${binaryPath}`);
    // await chmod(binaryPath, 0o755); // make it executable
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
    const inputs = input.split(/\r?\n/);
    let inputIndex = 0;

    const timeout = setTimeout(() => {
      ptyProcess.kill(); // kill after time limit
      resolve({
        output: output.trim() + "\n\n[Execution timed out]",
        error: null,
      });
    }, 4000); // 4 second time limit

    ptyProcess.onData((data) => {
      output += data;

      // When a prompt is detected, send next line
      if (inputIndex < inputs.length && /[:?>]\s*$/.test(data)) {
        const line = inputs[inputIndex++];
        ptyProcess.write(line + "\r"); // simulate Enter key
      }
    });

    ptyProcess.onExit(async ({ exitCode }) => {
      try {
        await unlink(codePath);
        await unlink(binaryPath);
      } catch (err) {
        console.warn("Cleanup failed:", err);
      }

      if (exitCode !== 0) {
        return resolve({ output: null, error: `Exited with code ${exitCode}` });
      }
      resolve({ output, error: null });
    });
  });
}