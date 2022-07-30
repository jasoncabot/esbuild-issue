# How to reproduce:

```
git clone git@github.com:jasoncabot/esbuild-issue.git
cd esbuild-issue
yarn
yarn transform
```

Expected Output

```
These should be equal
A: module.exports = "xA==";
B: module.exports = "xA==";
```

Actual Output

```
These should be equal
A: module.exports = "77+9";
B: module.exports = "xA==";
```

# Why?

The test file is a binary file that contains nothing but a single byte `C4`

This file is loaded with the esbuild base64 loader and should be converted to a valid base64 representation of this byte

Currently when decoding from base64 encoded string this gives the response of `EF BF BD` instead of `C4` which is incorrect.

It is likely that at some point in the transform process the string to be transformed is treated as a valid UTF-8 string **even for the base64 and binary loaders** where this isn't always going to be true.

# Why is this an issue?

Different output between transform and build was causing unit tests to behave differently when running tests (using esbuild-jest which uses esbuild.transform under the hood) and in production (which uses esbuild.build) with pure binary files.

I store several Flatbuffer encoded files along with the source code and expect them to be encoded 1:1 without any processing into the resulting output.
