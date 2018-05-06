module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-babel');

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
    clean: {
      dist: ['dist'],
      tpl: ['./dist/mysample-tpl.js']
    },
    ngtemplates: {
      mysample: {
        module: 'mysample',
        standalone: false,
        cwd: 'src',
        src: ['login/**/*.html'],
        dest: './dist/mysample-tpl.js',
        options: {
          url: function (url) { return '/' + url }
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: './src/',
            src: ['*.js'],
            dest: './dist'
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['./src/*.js', './dist/mysample-tpl.js', './src/login/**/*.js'],
        dest: './dist/app.min.js',
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          'dist/app.min.js': 'dist/app.min.js'
        }
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
    },
    cachebreaker: {
      dev: {
        options: {
          match: ['app.min.js'],
        },
        files: {
          src: ['./dist/index.html']
        }
      }
    }
  });

  grunt.registerTask('web', ['connect']);
  grunt.registerTask('build-dev', ['clean', 'copy']);
  grunt.registerTask('build-prod', ['clean:dist', 'ngtemplates', 'concat', 'babel','uglify:build', 'processhtml', 'clean:tpl', 'cachebreaker']);
  grunt.registerTask('default', ['build-dev', 'web']);
};
