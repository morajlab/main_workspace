<?php

require_once __DIR__ . '/src/autoload.php';

use Monosplit\Lib\Git;
use Monosplit\Lib\Log;
use ACFileManager\File;
use Monosplit\Lib\ConfigFactory;
use Monosplit\Exception\ConfigurationException;

$logger = new Log('CHANNEL NAME');

$logger->debug('Resolving configuration...');

$configFactory = new ConfigFactory();

try {
    $config = $configFactory->create(getenv());
} catch (ConfigurationException $configurationException) {
    $logger->error($configurationException->getMessage());
    exit(0);
}

$git = new Git($config->getAccessToken(), $config->getUserName(), $config->getUserEmail());
$git->setupCredentials();

$cloneDirectory = sys_get_temp_dir() . '/monorepo_split/clone_directory';
$buildDirectory = sys_get_temp_dir() . '/monorepo_split/build_directory';

$hostRepositoryOrganizationName = $config->getGitRepository();

// info
$clonedRepository = 'https://' . $hostRepositoryOrganizationName;
$logger->debug('Cloning "%s" repository to "%s" directory', true, [$clonedRepository, $cloneDirectory]);

$git->clone($hostRepositoryOrganizationName, $cloneDirectory);

$logger->debug('Cleaning destination repository of old files');
// We're only interested in the .git directory, move it to $TARGET_DIR and use it from now on
File::makeDirectory($buildDirectory . '/.git', 0777, true);
File::copyDirectoryRecursively($cloneDirectory . '/.git', $buildDirectory);
// cleanup old unused data to avoid pushing them
File::deleteDirectory($cloneDirectory);


// copy the package directory including all hidden files to the clone dir
// make sure the source dir ends with `/.` so that all contents are copied (including .github etc)
$logger->debug('Copying contents to git repo of "%s" branch', true, $config->getCommitHash());
File::copyDirectoryRecursively($config->getPackageDirectory(), $buildDirectory);

$logger->debug('Files that will be pushed');
$logger->debug(File::scanPath($buildDirectory));

// WARNING! this function happen before we change directory
// if we do this in split repository, the original hash is missing there and it will fail
$commitMessage = $git->getCommitMessage($config->getCommitHash());

$formerWorkingDirectory = getcwd();
chdir($buildDirectory);

$logger->debug('Changing directory from "%s" to "%s"', true, [$formerWorkingDirectory, $buildDirectory]);


// avoids doing the git commit failing if there are no changes to be commit, see https://stackoverflow.com/a/8123841/1348344
$logger->debug($git->status());

if ($git->hasChanged()) {
    $logger->debug('Adding git commit');
    $git->addChanges(['.']);

    $logger->debug('Pushing git commit with "%s" message to "%s"', true, [$commitMessage, $config->getBranch()]);

    $git->addCommit($commitMessage);
    $git->push('origin', $config->getBranch());
} else {
    $logger->debug('No files to change');
}


// push tag if present
if ($config->getTag()) {
    $logger->debug('Publishing "%s"', true, $config->getTag());

    $git->addTag($config->getTag(), $message);
    $git->push('origin', $config->getTag());
}


// restore original directory to avoid nesting WTFs
chdir($formerWorkingDirectory);
$logger->debug('Changing directory from "%s" to "%s"', true, [$buildDirectory, $formerWorkingDirectory]);
