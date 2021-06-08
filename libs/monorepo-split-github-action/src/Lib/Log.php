<?php

namespace Symplify\MonorepoSplit;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use \Bramus\Monolog\Formatter\ColoredLineFormatter;

class Log
{
    private Logger $logger;

    function __construct(string $name)
    {
        $formatter = new ColoredLineFormatter(null, "[%datetime%][%channel%][%level_name%]: %message%\n");
        $stream = new StreamHandler('php://stdout');

        $stream->setFormatter($formatter);

        $this->logger = new Logger($name);
        $this->logger->pushHandler($stream);
    }

    public function debug(string $message): void
    {
        $this->logger->debug($message);
    }

    public function success(string $message): void
    {
        $this->logger->info($message);
    }

    public function error(string $message): void
    {
        $this->logger->error($message);
    }

    public function warn(string $message): void
    {
        $this->logger->warning($message);
    }
}
