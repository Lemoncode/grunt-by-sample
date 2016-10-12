module.exports = function(grunt) {
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build-dev', ['clean', 'copy']);
  grunt.registerTask('web', ['connect']);
  grunt.registerTask('default', ['web']);

};
