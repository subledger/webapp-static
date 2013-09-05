
var grunt = require("grunt");

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
        compile: {
            options: {
                baseUrl: "src/js/",
                mainConfigFile: "src/js/app.js",
                out: "dist/js/app.js",
                name: "app",
                useStrict: false
            }
        }
    },
    copy: {
        imgs: {
            files: [

                {expand: true, cwd: 'src/', src: ['img/**'], dest: 'dist/'}, // makes all src relative to cwd
                {src: 'src/js/libs/modernizr.custom.19922.min.js', dest: 'dist/js/libs/modernizr.custom.19922.min.js'},
                {src: 'src/js/libs/requirejs/require.js', dest: 'dist/js/libs/requirejs/require.js'}
            ]

        }   /*   ,
        html: {
            src: 'src/index.html',
            dest: 'dist/index.html'
        },     */

    },
    cssmin: {
        combine: {
            files: {
                'dist/css/styles.css': ['src/css/jquery-ui.min.css',  'src/css/jquery.timepicker.css', 'src/css/styles.css']
            }
        }
    },
    htmlbuild: {
        dist: {
            src: 'src/index.html',
            dest: 'dist/index.html',
            options: {
                beautify: true
            }
        }

    },
    less: {
        development: {
            options: {
                paths: ["src/less"]
            },
            files: {
                "src/css/styles.css": "src/less/styles.less"
            }
        }
    },
    watch: {
        css: {
            files: 'src/less/*.less',
            tasks: ['less']
        }
    }
});

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-html-build');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');


grunt.registerTask('dev', ['less', 'watch']);
grunt.registerTask('build', ['less', 'requirejs', 'cssmin', 'copy', 'htmlbuild']);
