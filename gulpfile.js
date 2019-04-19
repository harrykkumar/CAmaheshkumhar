var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
 
gulp.task( 'deploy', function () {
 
      var conn = ftp.create( {
        host:     'saniiro.com',
        user:     'app-saniiro',
        password: 'juutRoaM7Czt',
        parallel: 10,
        log:      gutil.log
    });  
 /* var conn = ftp.create( {
        host:     'saniiro.com',
        user:     'app1-saniiro',
        password: '5Jg7xFe3Y64x',
        parallel: 10,
        log:      gutil.log
    }); */
    var globs = [
        'dist/browser/**'
    ];
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
 
    return gulp.src( globs, {  buffer: false } )
        .pipe( conn.newer( '/app-saniiro/wwwroot' ) ) // only upload newer files
        .pipe( conn.dest( '/app-saniiro/wwwroot' ) );
 
} );