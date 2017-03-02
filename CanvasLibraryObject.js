function CanvasLibraryObject(obj) {
  if (obj.zIndex === undefined || obj.x === undefined || obj.y === undefined) {
    throw new Error('Wrong Canvas object!');
  } else {
    for (var k in obj) {
      this[k] = obj[k];
    }
  }
}

CanvasLibraryObject.prototype.isOnThisElement = function (x, y) {
  var isOnElement = this.x < x && (this.x2 || this.width) + this.x > x && this.y < y && this.y + (this.y2 || this.height) > y;
  return isOnElement;
};

CanvasLibraryObject.prototype.addAnimation = function (name, animation) {
  if (this.animations === undefined) {
    this.animations = new CanvasLibraryAnimations(this);
  }
  this.animations.add(name, animation);
  return this;
};

CanvasLibraryObject.prototype.draw = function () {
};

CanvasLibraryObject.prototype.log = function () {
};

CanvasLibraryObject.prototype.destroy = function () {
  this.CanvasLibrary.deleteObjectByLink(this);
};
CanvasLibraryObject.prototype.getCoordinatesOfEvent = function (event) {
  var x = (event.layerX == undefined ? event.offsetX : event.layerX) + 1;
  var y = (event.layerY == undefined ? event.offsetY : event.layerY) + 1;

  return {
    x: x,
    y: y
  }
}

CanvasLibraryObject.prototype.emmitEvent = function (eventName, details) {
  var ev;
  if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
    ev = new CustomEvent(eventName, {
      'bubbles': false, 'cancelable': false
    });
  } else {
    ev = document.createEvent('Events');
    ev.initEvent(eventName, false, true);
  }
  ev.targetObject = this;
  this.elem.dispatchEvent(ev);
}

CanvasLibraryObject.prototype.addListeners = function (listeners) {
  if (!this.listeners) this.listeners = {};
  for (var listener in listeners) {

    if (!this.listeners[listener]) this.listeners[listener] = [];

    var currentCB = this.listeners[listener].push(listeners[listener](this));

    this.elem.addEventListener(listener, this.listeners[listener][currentCB - 1]);
  }
  return this;
}

CanvasLibraryObject.prototype.resetStyles = function (ctx) {
  ctx.fillStyle = "#000000";
  ctx.filter = "none";
  ctx.font = "10px sans-serif";
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";
  ctx.lineCap = "butt";
  ctx.lineDashOffset = 0;
  ctx.lineJoin = "miter";
  ctx.lineWidth = 1;
  ctx.miterLimit = 10;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "#000000";
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}