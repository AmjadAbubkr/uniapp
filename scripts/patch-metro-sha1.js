'use strict';

const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'metro',
  'src',
  'node-haste',
  'DependencyGraph.js',
);

const importNeedle = 'var _path = _interopRequireDefault(require("path"));';
const importPatch =
  'var _crypto = _interopRequireDefault(require("crypto"));\n' + importNeedle;

const functionNeedle = `  async getOrComputeSha1(mixedPath) {
    const result = await this._fileSystem.getOrComputeSha1(mixedPath);
    if (!result || !result.sha1) {
      throw new Error(\`Failed to get the SHA-1 for: \${mixedPath}.
      Potential causes:
        1) The file is not watched. Ensure it is under the configured \\\`projectRoot\\\` or \\\`watchFolders\\\`.
        2) Check \\\`blockList\\\` in your metro.config.js and make sure it isn't excluding the file path.
        3) The file may have been deleted since it was resolved - try refreshing your app.
        4) Otherwise, this is a bug in Metro or the configured resolver - please report it.\`);
    }
    return result;
  }`;

const functionPatch = `  async getOrComputeSha1(mixedPath) {
    const result = await this._fileSystem.getOrComputeSha1(mixedPath);
    if (result?.sha1) {
      return result;
    }
    try {
      const stat = await _fs.default.promises.stat(mixedPath);
      if (stat.isFile()) {
        const content = await _fs.default.promises.readFile(mixedPath);
        return {
          content,
          sha1: _crypto.default.createHash("sha1").update(content).digest("hex"),
        };
      }
    } catch {}
    throw new Error(\`Failed to get the SHA-1 for: \${mixedPath}.
      Potential causes:
        1) The file is not watched. Ensure it is under the configured \\\`projectRoot\\\` or \\\`watchFolders\\\`.
        2) Check \\\`blockList\\\` in your metro.config.js and make sure it isn't excluding the file path.
        3) The file may have been deleted since it was resolved - try refreshing your app.
        4) Otherwise, this is a bug in Metro or the configured resolver - please report it.\`);
  }`;

if (!fs.existsSync(targetFile)) {
  console.error(`Metro dependency graph file not found: ${targetFile}`);
  process.exit(1);
}

let source = fs.readFileSync(targetFile, 'utf8');

if (!source.includes('_crypto.default.createHash("sha1")')) {
  if (!source.includes(importNeedle) || !source.includes(functionNeedle)) {
    console.error('Metro source layout did not match the expected patch targets.');
    process.exit(1);
  }

  source = source.replace(importNeedle, importPatch);
  source = source.replace(functionNeedle, functionPatch);
  fs.writeFileSync(targetFile, source, 'utf8');
  console.log('Applied Metro SHA-1 fallback patch.');
  } else {
    console.log('Metro SHA-1 fallback patch already applied.');
  }

  const elementsAssetsDir = path.join(
    __dirname,
    '..',
    'node_modules',
    '@react-navigation',
    'elements',
    'lib',
    'module',
    'assets',
  );

  if (fs.existsSync(elementsAssetsDir)) {
    const resolutions = ['1x', '2x', '3x', '4x'];
    let patched = 0;
    for (const res of resolutions) {
      const generic = path.join(elementsAssetsDir, `back-icon@${res}.png`);
      const android = path.join(elementsAssetsDir, `back-icon@${res}.android.png`);
      if (!fs.existsSync(generic) && fs.existsSync(android)) {
        fs.copyFileSync(android, generic);
        patched++;
      }
    }
    if (patched > 0) {
      console.log(`Patched ${patched} missing back-icon resolution files for react-navigation.`);
    }
  }
