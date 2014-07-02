describe('controllerDecorator', function() {
  var $controller;

  beforeEach(module('ngHintController'));

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should detect if a controller is instantiated on the window', function() {
    spyOn(console, 'log');
    var controllerMock = function() {
        var element = document.createElement('a');
        element.innerHTML = 'testValue';
    };
    var sampleControl = $controller(controllerMock);
    expect(console.log).toHaveBeenCalledWith('It is against Angular best practices to instantiate a controller on the window.');
  });
});