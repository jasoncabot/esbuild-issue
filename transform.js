const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const binaryFile = path.join(__dirname, "src", "test.bin");
const testFileContent = fs.readFileSync(binaryFile).toString();

// Step 1 - use esbuild.transform
const transformSyncResult = esbuild.transformSync(testFileContent, { loader: "base64" }).code;
const transformOutputPath = path.join(__dirname, "dist", "transform-result.js");
fs.writeFileSync(transformOutputPath, transformSyncResult);

// Step 2 - use esbuild.build
const buildOutputPath = path.join(__dirname, "dist", "build-result.js");
esbuild.buildSync({
    outfile: buildOutputPath,
    entryPoints: [binaryFile],
    loader: { ".bin": "base64" }
});

// Step 3 - Compare the results and see the diff in base64 encodede string

const a = fs.readFileSync(transformOutputPath).toString();
const b = fs.readFileSync(buildOutputPath).toString();

console.log("These should be equal");
console.log("A: " + a);
console.log("B: " + b);
