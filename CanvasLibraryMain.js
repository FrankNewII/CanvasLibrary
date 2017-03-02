function CanvasLibrary(element, options) {
  this.elem = element;
  this.canvasObjects = [];
  this.thisFPSPerSecond = options.fpsPerSecond;
  this.appendEventListeners();
}

CanvasLibrary.prototype.initCanvasContext = function () {
  this.ctx = this.elem.getContext('2d');
}

CanvasLibrary.prototype.removeListeners = function (object) {
  var self = this;
  for (var eventName in object.listeners) {
    object.listeners[eventName].forEach(function (f) {
      self.elem.removeEventListener(eventName, f);
    });
  }
}

CanvasLibrary.prototype.getMouseCoordinates = function (event) {
  var x = (event.layerX == undefined ? event.offsetX : event.layerX) + 1;
  var y = (event.layerY == undefined ? event.offsetY : event.layerY) + 1;
  return { x: x, y: y };
}

CanvasLibrary.prototype.deleteObjectById = function (id) {
  var self = this;
  this.canvasObjects = this.canvasObjects.filter(function (object) {

    if (object.id == id) {

      if (object.listeners) {
        self.removeListeners(object)
      }

    } else {
      return object;
    }
  });
}

CanvasLibrary.prototype.deleteObjectByLink = function (link) {
  var index = this.canvasObjects.indexOf(link);
  if (~index) {
    if (this.canvasObjects[index].listeners) this.removeListeners(link);
    this.canvasObjects.splice(index, 1);
  }
}

CanvasLibrary.prototype.mousemove = function () {
  var self = this;
  return function (e) {
    var mouseCoordinates = self.getMouseCoordinates(e);
    for (var i = self.canvasObjects.length - 1; i >= 0; i--) {
      if (self.canvasObjects[i].hover !== undefined && typeof self.canvasObjects[i].hover == "function") {
        if (self.canvasObjects[i].isOnThisElement(mouseCoordinates.x, mouseCoordinates.y) && self.canvasObjects[i].isVisible) {
          self.canvasObjects[i].hover(true);
        } else {
          self.canvasObjects[i].hover(false);
        }
      }
      if (self.canvasObjects[i].mousemove !== undefined && typeof self.canvasObjects[i].mousemove == "function") {
        self.canvasObjects[i].mousemove(e);
      }
    }
  }
}

CanvasLibrary.prototype.click = function () {
  var self = this;
  return function (e) {
    var mouseCoordinates = self.getMouseCoordinates(e);
    var canvasObject;
    for (var i = self.canvasObjects.length - 1; i >= 0; i--) {
      canvasObject = self.canvasObjects[i];
      if (canvasObject.click !== undefined && typeof canvasObject.click == "function") {
        if (canvasObject.isActive && canvasObject.isOnThisElement(mouseCoordinates.x, mouseCoordinates.y)) {
          canvasObject.click(e);
          break;
        }
      }
    }
  }
}

CanvasLibrary.prototype.mousedown = function () {
  var self = this;
  return function (e) {
    var mouseCoordinates = self.getMouseCoordinates(e);
    var canvasObject;
    for (var i = self.canvasObjects.length - 1; i >= 0; i--) {
      canvasObject = self.canvasObjects[i];
      if (canvasObject.mousedown !== undefined && typeof (canvasObject.mousedown) == "function") {
        if (canvasObject.isActive && canvasObject.isOnThisElement(mouseCoordinates.x, mouseCoordinates.y)) {
          canvasObject.mousedown(e);
          break;
        }
      }
    }
  }
}

CanvasLibrary.prototype.mouseup = function () {
  var self = this;
  return function (e) {
    var canvasObject;
    for (var i = self.canvasObjects.length - 1; i >= 0; i--) {
      if (self.canvasObjects[i].mouseup !== undefined && typeof (self.canvasObjects[i].mouseup) == "function") {
        canvasObject = self.canvasObjects[i];
        canvasObject.mouseup(e);
      }
    }
  }
}

CanvasLibrary.prototype.mouseleave = function () {
  var self = this;
  return function (e) {
    for (var i = self.canvasObjects.length - 1; i >= 0; i--) {
      if (self.canvasObjects[i].mouseup !== undefined && typeof (self.canvasObjects[i].mouseup) == "function") {
        self.canvasObjects[i].mouseup(e);
      }
    }
  }
}

CanvasLibrary.prototype.appendEventListeners = function () {
  this.elem.addEventListener('mousemove', this.mousemove());
  this.elem.addEventListener('mouseleave', this.mouseleave());
  this.elem.addEventListener('mousedown', this.mousedown());
  this.elem.addEventListener('mouseup', this.mouseup());
  this.elem.addEventListener('click', this.click());
}

CanvasLibrary.prototype.draw = function () {
  var self = this;
  this.canvasObjects.forEach(function (obj, i, arr) {
    if (obj.currentAnimation !== undefined && obj.isVisible) obj.animations.nextFP(self.ctx);
    if (obj.isVisible === undefined || obj.isVisible) obj.draw(self.ctx);
  });

  self.nextFPTimer = setTimeout(function () {
    self.draw();
  }, 1000 / self.thisFPSPerSecond);
}

CanvasLibrary.prototype.addObjectToCanvas = function (obj) {
  obj.elem = this.elem;
  obj.CanvasLibrary = this;
  obj = new CanvasLibraryObject(obj);
  this.canvasObjects.push(obj);
  this.canvasObjects.sort(function (a, b) {
    return a.zIndex - b.zIndex;
  });
  return obj;
}