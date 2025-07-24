import { writeFile } from "fs/promises";
import { spawn } from "child_process";
import { promisify } from "util";
import { exec as rawExec } from "child_process";

const exec = promisify(rawExec);

export async function runCCode(code: string, input: string): Promise<{ output: string | null; error: string | null }> {
  const codePath = "/tmp/main.c";
  const binaryPath = "/tmp/main.out";

  // Save the code to a file
  await writeFile(codePath, code);

  // Compile the code
  try {
    await exec(`gcc ${codePath} -o ${binaryPath}`);
  } catch (err: any) {
    return { output: null, error: "Compilation failed: " + err.stderr };
  }

  // Run the binary and pass input
  return new Promise((resolve, reject) => {
    const proc = spawn(binaryPath);

    let output = "";
    let error = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      error += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        return resolve({ output: null, error: error || `Exited with code ${code}` });
      }
      resolve({ output, error: null });
    });

    // Send input
    proc.stdin.write(input);
    proc.stdin.end();
  });
}
