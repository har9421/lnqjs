
'use strict';
module.exports = function (grunt) {
  grunt.initConfig({

    option : {
      separator : '\n\n//--------------------------------------------\n',
      banner : '\n\n//--------------------------------------------\n',
    },
     concat : {
       dist: {
        src: ['lq.js', 'modules/*.js'],
        dest: 'builds/linq.js'
       }
     },
     uglify: {
        target: {
          files: {
            'builds/linq.min.js': ['linq.js']
          }
        }
     },
     karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true
      }
    },
     serve:{
       options : {
           port: 9000
       }
     }

  });

  //grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-serve');

  
  grunt.registerTask('default', ['uglify','karma','serve']);
    
};