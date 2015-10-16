## Overview

Since I'm still quite new to node.js I'm going to record how I got everything setup for this project for my reference.  Hopefully this will help others as well :)

## Setup steps

### Create package.json

I started off trying to install cucumber into the project using the following command line

```
npm install --save-dev cucumber
```

Actually I just needed to create a package.json file and then that can do the work for you.


### Install Grunt

Installing the grunt-cli using the following commands

```
npm set prefix=$HOME/.npm-packages
npm install -g grunt-cli
```

Ensure that your PATH has been updated to include the ".npm-packages/bin" directory

Also installing Grunt itself in the project as this is picked up by the grunt-cli.  Using the following command

```
npm install grunt --save-dev
```

### Creating basic Gruntfile


