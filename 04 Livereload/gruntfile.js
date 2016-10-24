module.exports = function(grunt) {
  grunt.initConfig({
    clean:['dist'],
    connect: {
        server: {
          options: {
            hostname: 'localhost',
            port: 8080,
            keepalive:true,
            base: 'dist',
            directory: 'dist',
            open: {
              target: 'http://localhost:8080/index.html'
            }
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
                   },
                   {
                     src:'./src/index.html',
                     dest:'./dist/index.html'
                   }
       ]
      }
    },
    concat:{
      dist:{
        files:{
          './dist/app.min.js':[
            './src/calculator.js',
            './src/main.js'
          ]
        }
      }
    },
    uglify:{
      build:{
        files:[
          {
            './dist/app.min.js':'./dist/app.min.js'
          }
        ]
      }
    },
    processhtml:{
      dist:{
        files:{
          'dist/index.html':['src/index.html']
        }
      }
    },
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

  });
  grunt.registerTask('build-dev', ['clean', 'copy']);
  grunt.registerTask('web', ['connect']);
  grunt.registerTask('default', ['web']);
  grunt.registerTask('inspector', ['watch']);
  grunt.registerTask('build-prod', ['clean', 'concat', 'uglify:build', 'processhtml']);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
