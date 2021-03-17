export const handleAllSignals = (cleanUp: () => void) => {
  process.on('exit', code => {
    cleanUp();
  });
  process.on('SIGTERM', (code: any) => {
    cleanUp();
    process.exit(code);
  });
  process.on('SIGINT', (code: any) => {
    cleanUp();
    process.exit(code);
  });
  process.on('unhandledRejection', err => {
    cleanUp();
    process.exit(1);
  });
  process.on('uncaughtException', err => {
    cleanUp();
    process.exit(1);
  });
}
