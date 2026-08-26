// @fuyeor/reference-generator/src/start-options.ts
import process from 'node:process';

const MODULE_OPTION_PREFIXES = ['--m=', '--module='] as const;

/** Parses the optional module selector and rejects unsupported arguments. */
export function parseModuleName(
  args: string[] = process.argv.slice(2),
): string | undefined {
  const normalizedArgs = args[0] === '--' ? args.slice(1) : args;

  if (normalizedArgs.length === 0) return undefined;

  const [moduleOption] = normalizedArgs;
  const prefix = MODULE_OPTION_PREFIXES.find((candidate) =>
    moduleOption.startsWith(candidate),
  );

  if (normalizedArgs.length !== 1 || !prefix) {
    throw new Error('Usage: start [--m={name}]');
  }

  const moduleName = moduleOption.slice(prefix.length).trim();

  if (!moduleName) throw new Error('Module name cannot be empty.');
  return moduleName;
}
