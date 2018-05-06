# Adding Grunt support to an Angularjs project

- Let' rearrange our project, encapsulate all the source code under a _src_ folder.

```
|   package.json
|   README.md
|
\---src
    |   index.html
    |   main.js
    |
    \---login
        |   loginContainer.html
        |   loginContainer.js
        |
        +---api
        |       loginservice.js
        |
        \---components
                centerContent.html
                centerContent.js
                loginForm.html
                loginForm.js
                panel.html
                panel.js
```


- Let's start by installing the following package we worked with in the previous sample:

```bash
npm install grunt grunt-contrib-clean grunt-contrib-concat grunt-contrib-connect grunt-contrib-copy grunt-contrib-uglify grunt-processhtml --save-dev
```

- Let's copy the previous gruntfile.js

_gruntfile.js_

```javascript
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8080,
          keepalive: true,
          base: 'dist',
          directory: 'dist',
          open: {
            target: 'http://localhost:8080/index.html'
          }
        }
      }
    },
    clean: ['dist'],
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
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['./src/calculator.js', './src/main.js'],
        dest: './dist/app.min.js',
      }
    },
    uglify: {
      build: {
        files: [
          {
            './dist/app.min.js': './dist/app.min.js'
          }
        ]
      }
    },
    processhtml: {
      dist: {
        files: {
          'dist/index.html': ['src/index.html']
        }
      }
    }
  });

  grunt.registerTask('web', ['connect']);
  grunt.registerTask('build-dev', ['clean', 'copy']);
  grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build', 'processhtml']);
  grunt.registerTask('default', ['build-dev', 'web']);
};
```

- Let's update the concat section:

```diff
    concat: {
      options: {
        separator: ';',
      },
      dist: {
-        src: ['./src/calculator.js', './src/main.js'],
-        dest: './dist/app.min.js',
+        src: ['./src/*.js', './src/login/**/*.js'],
+        dest: './dist/app.min.js',
      }
    },
```

- Let's remove the _html_ copy section

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
-          {
-            src: './src/index.html',
-            dest: './dist/index.html'
-          }
        ]
      }
    },
```

- Let's mark the scripts to be replaced in the HTML section by the process html plugin:

_index.html_

```diff
+ <!-- build:js app.min.js -->
  <script src="./main.js"></script>
  <script src="./login/loginContainer.js"></script>
  <script src="./login/components/centerContent.js"></script>
  <script src="./login/components/panel.js"></script>
  <script src="./login/components/loginForm.js"></script>
  <script src="./login/api/loginservice.js"></script>
+ <!-- /build -->
```

- Let's add an entry to build the project:

```diff
"scripts": {
  "start": "lite-server",
+ "build": "grunt build-prod",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

- This version cannot be run already (we need to process first the angular HTML templates), but let's give a try to both build processes
and check if we are getting the right progress.

```bash
npm run build
```

> If we want to test a bit how it works you can remove tasks from the _build-prod_ entry (e.g. remove the uglify) and check that things
are generated as expected.

> To take into account about traversing files and folders recursively, it will start by alphabetic order, if we need to make a file
to be the first to be executed we could try some workarounds:

- to name it something like: _@index.js_

- There are some workarounds:
  https://github.com/gruntjs/grunt-contrib-concat/issues/182

  https://github.com/gruntjs/grunt-contrib-concat/issues/23

- Now we have missing the HTML templates associated to the controls, to add them we will "compile" the templates into JS:

- Let's install _grunt-angular-templates_

```bash
npm install grunt-angular-templates --save-dev
```

- Let's configure it in our _gruntfile.js_ template:

- Load the task

_gruntfile.js_

```diff
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
+ grunt.loadNpmTasks('grunt-angular-templates');
```

- Configure it

_gruntfile.js_

```diff
  clean: ['dist'],
+  ngtemplates: {
+    mysample: {
+      module: 'mysample',
+      standalone: false,
+      cwd: 'src',
+      src: ['login/**/*.html'],
+      dest: './dist/mysample-tpl.js',
+      options:  {
+        url:    function(url) { return '/' + url}
+      }        
+    }
+  },
```

- Let's add it to our build process:

_gruntfile.js_

```diff
-  grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build', 'processhtml']);
+  grunt.registerTask('build-prod', ['clean', 'ngtemplates', 'concat', 'uglify:build', 'processhtml']);
  grunt.registerTask('default', ['build-dev', 'web']);
```

- Let's run a build and check new tpl result

```bash
npm run build
```

- Let's add it to our concat process:

_./gruntfile.js_

```diff
    concat: {
      options: {
        separator: ';',
      },
      dist: {
+        src: ['./src/*.js', './src/login/**/*.js', './dist/mysample-tpl.js'],
        dest: './dist/app.min.js',
      }
    },
```

- Now that we got the tpl included in _app.min.js_ let's remove the _mysample-tpl.js_ file, we got 
already _grunt-contrib-clean_ let's add some additional config on the task:

_gruntfile.js_

```diff
- clean: ['dist'],
+ clean: {
+    dist: ['dist'],
+    tpl: ['./dist/mysample-tpl.js']
+ },
```

- Let's call the proper clean subsections on each step:

_gruntfile.js_

```diff
- grunt.registerTask('build-prod', ['clean', 'ngtemplates', 'concat', 'uglify:build', 'processhtml']);
+ grunt.registerTask('build-prod', ['clean:dist', 'ngtemplates', 'concat', 'uglify:build', 'processhtml', 'clean:tpl']);
```

- Let's updat our start command to call the grunt web task.

_package.json_

```diff
  "scripts": {
-    "start": "lite-server",
+    "start": "grunt web",
    "build": "grunt build-prod",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- If we add the uglified version the app is not working we are missing some update on the code to make
_mninifiable_ friendly.

```diff
-angular.module('mysample', ['ngMessages']).controller('SampleCtrl', function ($scope) {
+angular.module('mysample', ['ngMessages']).controller('SampleCtrl', ['$scope',function ($scope) {

  $scope.testBinding = "Bindings up and running !!";

  $scope.login = {
    user: '',
    password: '',
  };

  $scope.onLogin = function() {
    if ($scope.login.user === 'admin' && $scope.login.password === 'test') {
      console.log('LOGIN SUCCEEDED');
    } else {
      console.log('LOGIN FAILED :-(');
    };    
  }  
-});
+}]);
```

> As an excercise
1. We could do this in a single step (build prod + web).
2. Unminified version is not working, we can check three steps for this:
   a. Include til the contact and add sourcemaps to allow seamlessly debugging.
   b. Add a task to copy all the _html_ files into the right folders.
   c. start directly from the root folder the web server.

****
- Now that we are generating an _app.min.js_ we can have cache issues:

grunt.loadNpmTasks('grunt-cache-breaker');

- Enviroment variables.

grunt.loadNpmTasks('grunt-file-creator');

# Excercise:

A. Create a separate module and add it to the grunt build process (trick: module definition should 
be made in a given folder root, controllers/services on a subfolder belonging to that parent folder)

