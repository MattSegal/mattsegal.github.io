"""
Download run and this file to:
    - clone the repo
    - add static assets
    - push to GitHub page

params:
    project - project name
    source  - directory containing static assets

eg Powershell:

    $fileUrl = 'https://raw.githubusercontent.com/MattSegal/mattsegal.github.io/master/build.py'
    (New-Object System.Net.WebClient).DownloadString($fileUrl) > build.py
    build.py example ~/code/example/static
    Remove-Item build.py
    Remove-Item C:/tmp/github_page_deploy -Recurse -Force

"""
import os
import argparse
import subprocess
import shutil

REPO_ADDRESS = 'git@github.com:MattSegal/mattsegal.github.io.git'
LINUX_TMP_DIR = '/var/tmp/'
WINDOWS_TMP_DIR = 'C:/tmp/'

if os.path.isdir(LINUX_TMP_DIR):
    # Haven't tested any of this on Linux tho
    TEMP_BUILD_DIR = os.path.join(LINUX_TMP_DIR, 'github_page_deploy')
else:
    TEMP_BUILD_DIR = os.path.join(WINDOWS_TMP_DIR, 'github_page_deploy')

if not os.path.isdir(TEMP_BUILD_DIR):
    os.makedirs(TEMP_BUILD_DIR)

parser = argparse.ArgumentParser()
parser.add_argument('project', help='project name - used for directory structure')
parser.add_argument('source', help='directory containing static assets')
args = parser.parse_args()

# Validate
assert args.project, 'Project name required'
assert os.path.isdir(args.source), 'Source must be a directory'
index_file = os.path.join(args.source, 'index.html')
assert os.path.isfile(index_file), 'Source contain index.html'

# Clone or pull repository
git_dir = os.path.join(TEMP_BUILD_DIR, '.git')
if os.path.isdir(git_dir):
    # Assume clone directory is a valid git repo
    subprocess.call(['git', 'pull'], cwd=TEMP_BUILD_DIR)
else:
    subprocess.call(['git', 'clone', REPO_ADDRESS, TEMP_BUILD_DIR])

# Add project  static assets
print '\nUploading static assets for project {}'.format(args.project)
target_dir = os.path.join(TEMP_BUILD_DIR, args.project)
shutil.rmtree(target_dir)
shutil.copytree(args.source, target_dir)


# Add, commit and push updated webpage
commit_message = 'Updating project {}'.format(args.project)
subprocess.call(['git', 'add', '*'], cwd=TEMP_BUILD_DIR)
subprocess.call(['git', 'commit', '-m', commit_message], cwd=TEMP_BUILD_DIR)
subprocess.call(['git', 'push', 'origin', 'master'], cwd=TEMP_BUILD_DIR)

# TODO: Clean up afterwards
# Windows freaks out because some process is still using .git
# and it refuses to delete the repo =(
