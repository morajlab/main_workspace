<?php

declare(strict_types=1);

require_once __DIR__ . '/src/autoload.php';

use Symplify\MonorepoSplit\Config;
use Symplify\MonorepoSplit\Utilities;
use Symplify\MonorepoSplit\ConfigFactory;
use Symplify\MonorepoSplit\Exception\ConfigurationException;

$utilities = new Utilities();

$utilities->note('Resolving configuration...');

$configFactory = new ConfigFactory();
try {
    $config = $configFactory->create(getenv());
} catch (ConfigurationException $configurationException) {
    $utilities->error($configurationException->getMessage());
    exit(0);
}

setupGitCredentials($config);


$cloneDirectory = sys_get_temp_dir() . '/monorepo_split/clone_directory';
$buildDirectory = sys_get_temp_dir() . '/monorepo_split/build_directory';

$hostRepositoryOrganizationName = $config->getGitRepository();

// info
$clonedRepository='https://' . $hostRepositoryOrganizationName;
$cloningMessage = sprintf('Cloning "%s" repository to "%s" directory', $clonedRepository, $cloneDirectory);
$utilities->note($cloningMessage);

$commandLine = 'git clone -- https://' . $config->getAccessToken() . '@' . $hostRepositoryOrganizationName . ' ' . $cloneDirectory;
exec_with_note($commandLine);


$utilities->note('Cleaning destination repository of old files');
// We're only interested in the .git directory, move it to $TARGET_DIR and use it from now on
mkdir($buildDirectory . '/.git', 0777, true);

$copyGitDirectoryCommandLine = sprintf('cp -r %s %s', $cloneDirectory . '/.git', $buildDirectory);
exec($copyGitDirectoryCommandLine, $outputLines, $exitCode);

if ($exitCode === 1) {
    die('Command failed');
}


// cleanup old unused data to avoid pushing them
exec('rm -rf ' . $cloneDirectory);
// exec('rm -rf .git');


// copy the package directory including all hidden files to the clone dir
// make sure the source dir ends with `/.` so that all contents are copied (including .github etc)
$copyMessage = sprintf('Copying contents to git repo of "%s" branch', $config->getCommitHash());
$utilities->note($copyMessage);
$commandLine = sprintf('cp -ra %s %s', $config->getPackageDirectory() . '/.', $buildDirectory);
exec($commandLine);

$utilities->note('Files that will be pushed');
list_directory_files($buildDirectory);


// WARNING! this function happen before we change directory
// if we do this in split repository, the original hash is missing there and it will fail
$commitMessage = createCommitMessage($config->getCommitHash());


$formerWorkingDirectory = getcwd();
chdir($buildDirectory);

$restoreChdirMessage = sprintf('Changing directory from "%s" to "%s"', $formerWorkingDirectory, $buildDirectory);
$utilities->note($restoreChdirMessage);


// avoids doing the git commit failing if there are no changes to be commit, see https://stackoverflow.com/a/8123841/1348344
exec_with_output_print('git status');

exec('git diff-index --quiet HEAD', $outputLines, $hasChangedFiles);


// 1 = changed files
// 0 = no changed files

if ($hasChangedFiles === 1) {
    $utilities->note('Adding git commit');
    exec_with_output_print('git add .');

    $message = sprintf('Pushing git commit with "%s" message to "%s"', $commitMessage, $config->getBranch());
    $utilities->note($message);

    exec("git commit --message '$commitMessage'");
    exec('git push --quiet origin ' . $config->getBranch());
} else {
    $utilities->note('No files to change');
}


// push tag if present
if ($config->getTag()) {
    $message = sprintf('Publishing "%s"', $config->getTag());
    $utilities->note($message);

    $commandLine = sprintf('git tag %s -m "%s"', $config->getTag(), $message);
    exec_with_note($commandLine);

    exec_with_note('git push --quiet origin ' . $config->getTag());
}


// restore original directory to avoid nesting WTFs
chdir($formerWorkingDirectory);
$chdirMessage = sprintf('Changing directory from "%s" to "%s"', $buildDirectory, $formerWorkingDirectory);
$utilities->note($chdirMessage);


function createCommitMessage(string $commitSha): string
{
    exec("git show -s --format=%B $commitSha", $outputLines);
    return $outputLines[0] ?? '';
}

function setupGitCredentials(Config $config): void
{
    if ($config->getUserName()) {
        exec('git config --global user.name ' . $config->getUserName());
    }

    if ($config->getUserEmail()) {
        exec('git config --global user.email ' . $config->getUserEmail());
    }
}
public function exec_with_output_print(string $commandLine): void
    {
        exec($commandLine, $outputLines);
        echo implode(PHP_EOL, $outputLines);
    }

    public function exec(string $commandLine, bool $log = false): void
    {
        if ($log) {
            $this->note('Running: ' . $commandLine);
        }

        exec($commandLine);
    }

    function list_directory_files(string $directory): void
    {
        $this->exec_with_output_print('ls -la ' . $directory);
    }