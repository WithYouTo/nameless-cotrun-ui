//cnpm install --save-dev gulp jshint gulp-jshint gulp-uglify gulp-csslint gulp-clean-css gulp-less gulp-sourcemaps gulp-htmlmin gulp-imagemin gulp-concat gulp-rename gulp-replace gulp-clean gulp-livereload gulp-changed gulp-watch-path gulp-notify gulp-plumber del gulp-jsdoc3 fancy-log

var gulp = require('gulp');  //加载gulp
var log = require('fancy-log');

var jshint = require("gulp-jshint");//检查js
var jsuglify = require('gulp-uglify');  //压缩js
var jsdoc3 = require('gulp-jsdoc3');//生成js文档
var less = require('gulp-less');//编译less
var csslint = require("gulp-csslint");//检查css
var cssclean = require('gulp-clean-css');//压缩css
var htmlmin = require('gulp-htmlmin');//压缩html

var del = require('del');//删除
var concat = require('gulp-concat');//合并
var rename = require('gulp-rename');//重命名
var replace = require('gulp-replace');//替换
var watch_path = require('gulp-watch-path');
var livereload = require('gulp-livereload');
//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

//js检查配置
var jshintConfig = {
    "loopfunc": true//允许方法内循环
};
//js压缩配置
var jsuglifyConfig = {
    "output": {
        "comments": "/@version/"//保留版本信息
    }
};
//css压缩配置
var csscleanConfig = {
    advanced: false
};

//html压缩配置
var htmlminConfig = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

//jsdoc配置
var jsdocConfig = {
    "tags": {
        "allowUnknownTags": true
    },
    'templates': {
        'theme': 'cerulean',
        'includeDate': false,
        "sort": false
    },
    'opts': {
        // 'template': './node_modules/ink-docstrap/template'
    }
};

var build_tasks = {
    //压缩js
    js_min: function () {
        gulp.src(['src/views/**/*.js'])
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter())
            .pipe(jsuglify())
            .pipe(gulp.dest('dist/views/'));

        gulp.src(['src/lib/comm/**/*.js'])
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter())
            .pipe(jsuglify())
            .pipe(gulp.dest('dist/lib/comm/'));

        gulp.src(['src/lib/whui/**/*.js'])
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter())
            .pipe(jsuglify())
            .pipe(gulp.dest('dist/lib/whui/'));
    },
    //压缩css
    css_min: function () {
        gulp.src(['src/views/**/*.css'])
            .pipe(cssclean(csscleanConfig))
            .pipe(gulp.dest('dist/views/'));

        gulp.src(['src/lib/comm/**/*.css'])
            .pipe(cssclean(csscleanConfig))
            .pipe(gulp.dest('dist/lib/comm/'));

        gulp.src(['src/lib/whui/**/*.css'])
            .pipe(cssclean(csscleanConfig))
            .pipe(gulp.dest('dist/lib/whui/'));
    },
    //压缩html
    html_min:function () {
        gulp.src(['src/views/**/*.html'])
            .pipe(htmlmin(htmlminConfig))
            .pipe(gulp.dest('dist/views/'));
    }

};


gulp.task('clean', function (cb) {
    del(['dist/*']);
    setTimeout(function () {
        cb();
    }, 2000);
});

gulp.task('copy', ['clean'], function (cb) {
    gulp.src(['src/**'])
        .pipe(gulp.dest('dist/'));
    setTimeout(function () {
        cb();
    }, 5000);
});

gulp.task('build', ['copy'], function (cb) {
    for (var key in build_tasks) {
        build_tasks[key]();
    }
});

gulp.task('pack', ['clean', 'copy', 'build'], function () {
    log.info("pack finished");
});


var watch_tasks = {
    js_watch: function () {
        var src = ['src/views/**/*.js'];
        gulp.watch(src, function (event) {
            log.info('File ' + event.path + ' was ' + event.type);
            gulp.src(event.path)
                .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
                .pipe(jshint(jshintConfig))
                .pipe(jshint.reporter());
        });
    }
};

gulp.task('watch', function (cb) {
    for (var key in watch_tasks) {
        watch_tasks[key]();
    }
});

var check_tasks = {
    js_check: function () {
        var src = ['src/views/**/*.js'];
        gulp.src(src)
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter());
        log.info('js_check finished');
    }
};

gulp.task('check', function (cb) {
    for (var key in check_tasks) {
        check_tasks[key]();
    }
});