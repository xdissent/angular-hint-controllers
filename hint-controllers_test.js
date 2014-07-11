describe('controllerDecorator', function() {
  var $controller;

  beforeEach(module('ngHintController'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should detect if a controller is instantiated on the window', function() {
    spyOn(console, 'log');
    window.controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
    };
    window.sampleControl = $controller(controllerMock);
    expect(console.log).toHaveBeenCalledWith('It is against Angular best practices to instantiate a controller on the window.');
  });

  it('should not log a message if the controller is on the local scope', function() {
    spyOn(console, 'log');
    angular.module('SampleApp', []).controller('SampleController', function() {});
    var ctrl = $controller('SampleController');
    expect(console.log).not.toHaveBeenCalled();
  });
});
