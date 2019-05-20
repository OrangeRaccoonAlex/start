'use strict';

module.exports = (grunt) => {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  const sass = require('node-sass');
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      fonts: {
        expand: true,
        cwd: 'src/fonts/',
        src: ['**'],
        dest: 'public/fonts/'
      }
    },

    imagemin: {
      all: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/**/**/*.{png,jpg,jpeg,gif,svg}'],
          dest: 'public/img/'
        }]
      }
    },

    sass: {
      options: {
        outputStyle: 'compressed',
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          // application
          'public/css/app.min.css': 'src/scss/style.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            grid: false,
            flexbox: false,
            browsers: ['>0.2%', 'last 2 versions', 'Firefox ESR', 'ie >10']
          })
        ]
      },
      dist: {
        src: 'public/css/*.css'
      }
    },

    browserify: {
      dist: {
        files: {
          'public/js/app.js': 'src/js/index.js'
        },
        options: {
          transform: [['babelify', {presets: ['@babel/preset-env']}]],
          browserifyOptions: {
            debug: true
          }
        }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        separator: '\n',
        nonull: true
      },

      application: {
        files: {
          'public/js/vendor.js': []
        }
      }
    },

    uglify: {
      build: {
        files: {
          'public/js/app.min.js': 'public/js/app.js',
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'public/css/*.css',
            'public/js/*.js',
            'public/**/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: 'public'
        }
      }
    },

    watch: {
      styles: {
        files: [
          'src/**/*.scss',
          'src/**/*.sass',
          'src/**/*.css'
        ],
        tasks: [
          'sass',
          'concat'
        ]
      },
      scripts: {
        files: [
          'src/**/*.js'
        ],
        tasks: [
          'browserify:dist',
          'concat',
          'uglify'
        ]
      },
      imagemin: {
        files: [
          'src/img/**/**/**/*.{png,jpg,jpeg,gif,svg}'
        ],
        tasks: [
          'imagemin'
        ]
      }
    }
  });

  grunt.registerTask('build', [
    'copy',
    'imagemin',
    'sass',
    'postcss',
    'browserify:dist',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('dev', [
    'browserSync',

    'watch'
  ]);

  grunt.registerTask('default', [
    'build',

    'watch'
  ]);
};
