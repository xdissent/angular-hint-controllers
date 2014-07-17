describe('controllerDecorator', function() {
  var $controller;

  beforeEach(module('ngHintController'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should detect if a controller is instantiated on the window', function() {
    spyOn(hintLog, 'createErrorMessage');
    window.controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
    };
    window.sampleControl = $controller(controllerMock);
    expect(hintLog.createErrorMessage).toHaveBeenCalledWith('It is against Angular best practices to instantiate a controller on the window. This behavior is deprecated in Angular 1.3.0', 1);
  });

  it('should not log a message if the controller is on the local scope', function() {
    spyOn(console, 'log');
    angular.module('SampleApp', []).controller('SampleController', function() {});
    var ctrl = $controller('SampleController');
    expect(console.log).not.toHaveBeenCalled();
  });
});
