# 04 LiveReload

This sample takes as starting point _03 Production.

In this sample we are going to create a livereload task for dist folder

Summary steps:

- Let's install a livereload plugin
- Let's configure our livereload plugin in gruntfile.js.
- Let's modify our html index to include a javascript file.
- Let's check that all is running smoothly.

# Steps to build it

## Prerequisites

Same as on _03 Production.

## Steps

- Let's install a livereload plugin.
```
npm install grunt-contrib-watch --save-dev
```

- Let's require this plugin on our _gruntfile.js_
```javascript
grunt.loadNpmTasks('grunt-contrib-watch');
```

- Let's configure the watch task (it will create parallel server to watch for changes).
```javascript
grunt.initConfig({
  ...
  watch: {
    options: {
      files: ['dist/**/*'],
      livereload: true,
    },
    buildprod: {
      files: ['src/**/*'],
      tasks: ['build-prod'],
    }
  },
```

- Let's add a new task called inspector
```javascript
grunt.registerTask('inspector', ['watch']);
```

- Right now we have to include a script tag in our index.html, at the end of the body
```html
<script src="//localhost:35729/livereload.js"></script>
```

- Now we can test it and check that everything is working as expected. We need two command window, one to launch the web server and the other to the inspector. fist cmd window:
```
grunt / grunt web
```
- second cmd window
```
grunt inspector
```


- Finally, if we change some file in SRC folder, the inspector launch build-prod and the site will refresh.
