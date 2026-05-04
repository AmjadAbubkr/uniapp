'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const bundledWindowsNode = path.join(
  projectRoot,
  '.tools',
  'node-v22.22.2-win-x64',
  'node.exe',
);
const configuredNode = process.env.REACT_NATIVE_NODE_PATH;
const nodeExecutable =
  configuredNode && configuredNode.trim()
    ? configuredNode.trim()
    : fs.existsSync(bundledWindowsNode)
      ? bundledWindowsNode
      : process.execPath;
const cliPath = path.join(projectRoot, 'node_modules', 'react-native', 'cli.js');

const result = spawnSync(nodeExecutable, [cliPath, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
