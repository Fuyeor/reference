// @fuyeor/reference-generator/src/start-options.ts
import process from 'node:process';

/** Parses the optional module selector and rejects unsupported arguments. */
export function parseModuleName(
  args: string[] = process.argv.slice(2),
): string | undefined {
  const normalizedArgs = args[0] === '--' ? args.slice(1) : args;

  if (normalizedArgs.length === 0) {
    return undefined;
  }

  if (
    normalizedArgs.length !== 1 ||
    !normalizedArgs[0].startsWith('--module=')
  ) {
    throw new Error('Usage: start [--module={name}]');
  }

  const moduleName = normalizedArgs[0].slice('--module='.length).trim();

  if (!moduleName) {
    throw new Error('Module name cannot be empty.');
  }

  return moduleName;
}
