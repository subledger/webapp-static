/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		uglify: {
			my_target: {
				files: {
					'dist/js/global.min.js': [
						'src/libs/jquery/jquery.min.js',
						'src/libs/selectyze.jquery.min.js',
						'src/libs/jquery-ui/jquery-ui.min.js',
						'src/libs/jquery-timepicker/jquery.timepicker.js'
					],
					'dist/js/custom.min.js': [
						'dist/js/custom.js'
					]
				}
			}
		},
		watch: {
			scripts: {
				files: 'dist/js/custom.js',
				tasks: ['default'],
				options: {
					interrupt: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Default task.
	grunt.registerTask('default', 'uglify');
};
