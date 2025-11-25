// @ts-nocheck
import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse, modify, applyEdits } from 'jsonc-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const distJsDir = join(distDir, 'js');
const distLuaDir = join(distDir, 'lua');

// Function to rename files with platform suffixes
function renamePlatformFiles(dir: string, suffix: string) {
    if (!existsSync(dir)) {
        return;
    }

    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
            renamePlatformFiles(fullPath, suffix);
        } else if (file.name.includes(`.tst${suffix}.`)) {
            const newName = file.name.replace(`.tst${suffix}`, '');
            const newPath = join(dir, newName);
            renameSync(fullPath, newPath);
            console.log(`  Renamed: ${file.name} → ${newName}`);
        }
    }
}

// Function to prepare platform directory
function preparePlatformDir(
    platformDir: string,
    platformName: string,
    suffix: string,
    mainFile: string,
    typesFile: string,
    packageName: string,
    readmeFileName: string,
    homepage: string
) {
    if (!existsSync(platformDir)) {
        console.log(`⚠ ${platformName} directory does not exist, skipping...`);
        return;
    }

    console.log(`\nPreparing ${platformName} platform...`);

    // Rename platform-specific files
    console.log(`  Renaming ${platformName} files...`);
    renamePlatformFiles(platformDir, suffix);

    // Read package.json
    const packageJsonPath = join(rootDir, 'package.json');
    const packageJsonText = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = parse(packageJsonText) as {
        name?: string;
        files?: string[];
        types?: string;
        main?: string;
        exports?: Record<string, unknown>;
    };

    // Edit paths relative to platform directory
    let modifiedText = packageJsonText;

    // Remove "dist/" from paths and clean up unnecessary fields
    const edits = [
        // Change package name
        ...modify(modifiedText, ['name'], packageName, {}),
        // Change homepage
        ...modify(modifiedText, ['homepage'], homepage, {}),
        // Remove "files" field to let .npmignore work
        ...modify(modifiedText, ['files'], undefined, {}),
        // types: relative to platform directory
        ...modify(modifiedText, ['types'], typesFile, {}),
        // main: relative to platform directory
        ...modify(modifiedText, ['main'], mainFile, {}),
        // Remove devDependencies (not needed in published package)
        ...modify(modifiedText, ['devDependencies'], undefined, {}),
        // Remove development scripts (not needed in published package)
        ...modify(modifiedText, ['scripts'], undefined, {}),
    ];

    // Apply all edits
    modifiedText = applyEdits(modifiedText, edits);

    // Save modified package.json to platform directory
    writeFileSync(join(platformDir, 'package.json'), modifiedText, 'utf-8');
    console.log(`  ✓ package.json created in ${platformName}/`);

    // Copy .npmignore if exists
    const npmignorePath = join(rootDir, '.npmignore');
    if (existsSync(npmignorePath)) {
        copyFileSync(npmignorePath, join(platformDir, '.npmignore'));
        console.log(`  ✓ .npmignore copied to ${platformName}/`);
    }

    // Copy README.md if exists
    const readmePath = join(rootDir, readmeFileName);
    if (existsSync(readmePath)) {
        copyFileSync(readmePath, join(platformDir, 'README.md'));
        console.log(`  ✓ README.md copied to ${platformName}/`);
    }

    // Copy LICENSE if exists
    const licensePath = join(rootDir, 'LICENSE');
    if (existsSync(licensePath)) {
        copyFileSync(licensePath, join(platformDir, 'LICENSE'));
        console.log(`  ✓ LICENSE copied to ${platformName}/`);
    }
}

// Prepare JS platform
preparePlatformDir(
    distJsDir,
    'JS',
    'js',
    './index.js',
    './index.d.ts',
    '@fundev-pro/log-ts',
    'README.tstjs.md',
    'https://github.com/fundev-pro/log-ts/tree/main/README.tstjs.md'
);

// Prepare Lua platform
preparePlatformDir(
    distLuaDir,
    'Lua',
    'l',
    './index.lua',
    './index.d.ts',
    '@fundev-pro/log-tstl',
    'README.tstl.md',
    'https://github.com/fundev-pro/log-ts/tree/main/README.tstl.md'
);

console.log('\n✓ Dist preparation completed');
console.log('To publish JS version: cd dist/js && npm publish');
console.log('To publish Lua version: cd dist/lua && npm publish');
