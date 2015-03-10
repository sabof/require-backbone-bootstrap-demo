// -*- mode: js2 -*-
module.exports = function(grunt) {
  grunt.initConfig({});

  grunt.config.set('watch');

  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['jshint']);
};
