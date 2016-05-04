module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-cucumberjs');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    mochaTest: {
        test: {
          options: {
            reporter: 'spec',
            captureFile: 'results.txt', // Optionally capture the reporter output to a file 
            quiet: false, // Optionally suppress output to standard out (defaults to false) 
            clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
          },
          src: ['test/**/*_test.js']
        }
      },
    
    cucumberjs: {
      options: {
        format: 'pretty'
      },
      
      features: [] 
    }
  });


  // Default task(s).
  grunt.registerTask('default', ['cucumberjs']);
  grunt.registerTask('test', [ 'mochaTest']);
};