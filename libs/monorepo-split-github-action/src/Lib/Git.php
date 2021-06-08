<?php

namespace Monosplit\Lib;

use Monosplit\Exception\GitException;

final class Git
{
    private const CONFIG_PROPERTIES = ['user.email', 'user.name'];
    private Run $run;

    function __construct(private string $token = null, private string $user_name = null, private string $user_email = null)
    {
        $this->run = new Run();
    }

    public function setupCredentials(): void
    {
        if (!isset($this->user_name, $this->user_email)) {
            throw new GitException('Username or email is missing');
        }

        foreach (self::CONFIG_PROPERTIES as $property) {
            $this->run->exec('git config --global ' . $property . ' ' . $property === 'user.email' ? $this->user_email : $this->user_name);
        }
    }

    public function clone(string $hostRepositoryOrganizationName, string $directory): void
    {
        if (!isset($this->token)) {
            throw new GitException('Access token is missing');
        }

        $this->run->exec('git clone -- https://' . $this->token . '@' . $hostRepositoryOrganizationName . ' ' . $directory, true);
    }

    public function getCommitMessage(string $sha): string
    {
        $this->run->exec("git show -s --format=%B" . $sha);

        return $this->run->getOutput()[0] ?? '';
    }

    public function status(): string
    {
        $this->run->exec('git status');

        return $this->run->getOutput()[0];
    }

    public function hasChanged(): bool
    {
        $this->run->exec('git diff-index --quiet HEAD');

        if ($this->run->getExitCode() === 1) {
            return true;
        } else if ($this->run->getExitCode() === 0) {
            return false;
        }
    }

    public function addChanges(array $paths): void
    {
        $this->run->exec(sprintf('git add %s', implode(' ', $paths)), true);
    }

    public function addCommit(string $message): void
    {
        $this->run->exec(sprintf('git commit -m "%s"', $message));
    }

    public function addTag(string $name, string $message): void
    {
        $this->run->exec(sprintf('git tag %s -m "%s"', $name, $message));
    }

    public function push(string $remote = 'origin', string $branch = 'master'): void
    {
        $this->run->exec(sprintf('git push --quiet %s %s', $remote, $branch));
    }
}
