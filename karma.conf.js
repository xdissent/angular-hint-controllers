module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'controllerDecorator.js',
      'controllerDecorator_test.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    browsers: ['Chrome']
  });
};
