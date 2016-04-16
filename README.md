# node_modules Snapshot

Tar up the `node_modules` directory and store it in a temp directory so it can be restored later
without running `npm install`.

This is useful on build nodes like Jenkins to speed up builds.

## Usage

```bash
$ node-modules-snapshot
No snapshot found at "/var/folders/3v/zdkckktj2194hxp_8mwytzcw0000gn/T/node-modules-snapshot/node-modules-snapshot/0cd711ab164722d7409c910c0054bb6d6fa63f3392615ef62c8964474ad202ba.tgz"
Running "npm install" in "/Users/nmalaguti/git/example/"...

Packaging up "/Users/nmalaguti/git/example/node_modules/"...
```

### Options

```
-c, --cwd: specific the directory to look in for npm-shrinkwrap.json and to run npm install in
-n, --dry-run: don't actually do anything, just log what would be done
```


