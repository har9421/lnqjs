module.exports = function(config){
    config.set({
        frameworks : ['jasmine'],
        browsers : ['Chrome'],
        files : [
            'test/*.js'
        ]
    });

};