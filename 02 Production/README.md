# 02 Prod

This sample takes as starting point _01 Dist_.

In this sample we are going to create a production ready package, we will
concatenate all js in a single bundle file, then minify it and update then
script references on the generated index.html

Summary steps:

- Let's install a file concat plugin
- Let's install an uglify  plugin.
- Let's configure our concat / uglify plugins in gruntfile.js.
- Let's refactor our copy plugin.
- Let's install a process html plugin.
- Let's check that all is running smoothly.

# Steps to build it

## Prerequisites

Same as on _00 Connect_ sample.

## Steps

- Let's install a file concat plugin.
```
npm install grunt-contrib-concat --save-dev
```

- Let's install a uglify plugin.
```
npm install grunt-contrib-uglify --save-dev
```

- Let's require this plugins on our _gruntfile.js_

_gruntfile.js_

```diff
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
+  grunt.loadNpmTasks('grunt-contrib-concat');
+  grunt.loadNpmTasks('grunt-contrib-uglify');
```

- Let's configure the concat task (it will create an app.min.js file on dist).

```diff
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: './src/',
            src: ['*.js'],
            dest: './dist'
          },
          {
            src: './src/index.html',
            dest: './dist/index.html'
          }
        ]
       }
-    }
+    }
+    concat: {
+      options: {
+        separator: ';',
+      },
+      dist: {
+        src: ['./src/calculator.js', './src/main.js'],
+        dest: './dist/app.min.js',
+      }
+    },      
```

- Let's configure the uglifiy task (it will minify the recently created app.min.js file on dist).

```diff
   concat: {
     options: {
       separator: ';',
     },
     dist: {
       src: ['./src/calculator.js', './src/main.js'],
       dest: './dist/app.min.js',
     }
   },      
+  uglify: {
+    build: {
+      files: [
+        {
+          './dist/app.min.js' : './dist/app.min.js'            
+        }
+      ]              
+    }        
+  }
```

- Let's add a new task called build-prod

```diff
  grunt.registerTask('build-dev', ['clean', 'copy']);
+  grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build']);
```

- Let's add a new task in our _package.json_

_package.json_

```diff
"scripts": {
  "start": "grunt web",
  "build": "grunt build-dev",
+ "build:prod": "grunt build-prod",   
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

- Right now we can make a quick check point and ensure we only have the minified js file on our dist folder.

```
npm run build:prod
```

- Still we have work todo... the HTML file on dist is gone (we are not calling the copy task), and what's worse
there are script tags under this HTML are pointing to the non minifed versions of the javascript files. In order
to solve this issue we are going install a new plugin.

```bash
npm install grunt-processhtml --save-dev
```

This plugin allows us to replace script tags by marking commented areas in the main HTML.

- Let's add some commented markup to the index.html file

_index.html_

```diff
<body>
  <h1>Hello Grunt!</h1>
</body>
+ <!-- build:js /app.min.js -->
+  <script src="./calculator.js"></script>
+  <script src="./main.js"></script>  
+ <!-- /build -->
</html>
```

- Let's jump into the _gruntfile.js_ file, register the plugin:

_gruntfile.js_

```diff
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
+ grunt.loadNpmTasks('grunt-processhtml');
```

- Let's configure it.

_gruntfile.js_

```diff
    uglify: {
      build: {
        files: [
          {
            './dist/app.min.js': './dist/app.min.js'
          }
        ]
      }
-    }
+    },
+    processhtml: {
+      dist: {
+        files: {
+          'dist/index.html': ['src/index.html']
+        }
+      }
+    }      
  });

```

- And add it to the build-prod process

```diff
- grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build']);
+ grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build', 'processhtml']);
```

- Now we can test it and check that everything is working as expected

```bash
npm run build:prod
```


- Finally, we can launch de site to test that everything is working as expected
```
npm start
```

> Excercise: usually we want to execute a build then launch the web server, what about create a default
task that would run both build + start on grunt and replace our package.json with that command.

Hints: Check _grunt.registerTask('default', ...)_
