
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
     serve:{
       options : {
           port: 9000
       }
     }

  });

  //grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-serve');



  grunt.registerTask('default', ['uglify','serve']);
    
};