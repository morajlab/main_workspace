<?php

namespace Monosplit\Lib;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monosplit\Exception\LogException;
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

    public function debug(string $message, bool $format = false, $values = []): void
    {
        $this->logger->debug($format ? $this->format($message, $values) : $message);
    }

    public function success(string $message, bool $format = false, $values = []): void
    {
        $this->logger->info($format ? $this->format($message, $values) : $message);
    }

    public function error(string $message, bool $format = false, $values = []): void
    {
        $this->logger->error($format ? $this->format($message, $values) : $message);
    }

    public function warn(string $message, bool $format = false, $values = []): void
    {
        $this->logger->warning($format ? $this->format($message, $values) : $message);
    }

    public function format(string $template, $values): string
    {
        if (empty($values)) {
            throw new LogException('Values argument is empty');
        }

        return sprintf($template, ...$values);
    }
}
