<?php

namespace Monosplit\Lib;

final class Run
{
    private Log $logger;
    private int $exitCode;
    private array $output;

    function __construct()
    {
        $this->logger = new Log('Run');
    }

    public function exec(string $command, bool $log = false): void
    {
        if ($log) {
            $this->logger->debug($command);
        }

        exec($command, $this->output, $this->exitCode);
    }

    public function getOutput(): array
    {
        return $this->output;
    }

    public function getExitCode(): int
    {
        return $this->exitCode;
    }
}
