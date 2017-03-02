function CanvasLibraryAnimations(self) {
  this.object = self;
  this.object.animations = this.animations = Object.create(null);
  this.emmitEvent = this.object.emmitEvent;
  this.elem = this.object.elem;
}

CanvasLibraryAnimations.prototype.add = function (name, config) {
  if (name === undefined || config === undefined || config['fps'] === undefined) throw new Error('Wrong animations parameters');
  this.animations[name] = {
    FPSes: config['FPSes'] || config['fps'].length,
    iterations: config['iterations'],
    fps: config['fps']
  }
  return this;
}

CanvasLibraryAnimations.prototype.start = function (name) {
  if (name === undefined || this.animations[name] === undefined) throw new Error('Animation ' + name + ' not exist in ' + this.object.id + ' object');
  this.object.currentAnimation = name;
}

CanvasLibraryAnimations.prototype.stop = function (name) {
  if (name === undefined) throw new Error('Animation ' + name + ' not exist in ' + this.object.id + ' object');
  this.object.currentAnimation = undefined;
}

CanvasLibraryAnimations.prototype.nextFP = function (ctx) {
  var currentAnimationName = this.object.currentAnimation;
  var currentFP = this.animations[this.object.currentAnimation]['currentFP'];
  var totalFPsInAnimation = this.animations[currentAnimationName].FPSes;
  var currentCanvasLibraryObject = this.object;

  if (totalFPsInAnimation == currentFP) {
    this.animations[this.object.currentAnimation]['iterations']--;
    this.animations[this.object.currentAnimation]['currentFP'] = undefined;
    this.object.currentAnimation = undefined;
    this.emmitEvent('CanvasLibrary:animation:' + currentAnimationName + ':over', this.object);
    if (this.object.currentAnimation && this.animations[this.object.currentAnimation]['iterations'] == 0) {
      this.animations[this.object.currentAnimation] = undefined;
      this.object.currentAnimation = undefined;
      this.emmitEvent('CanvasLibrary:animation:' + currentAnimationName + ':deleted', this.object);
    }
  } else {

    if (currentFP === undefined) {
      currentFP = 0;
      this.emmitEvent('CanvasLibrary:animation:' + currentAnimationName + ':start', this.object);
    } else {
      ++currentFP;
    }

    if (typeof (this.animations[this.object.currentAnimation]['everyFPS']) == "function") {
      this.animations[this.object.currentAnimation]['everyFPS'](currentCanvasLibraryObject, ctx);
    }

    if (typeof (this.animations[this.object.currentAnimation]['fps']) == "function") {
      this.animations[this.object.currentAnimation]['fps'](currentCanvasLibraryObject, ctx);

    } else if (typeof (this.animations[this.object.currentAnimation]['fps'][currentFP]) == "object") {

      for (var currentStyle in this.animations[this.object.currentAnimation]['fps'][currentFP]) {

        this.object[currentStyle] = this.animations[this.object.currentAnimation]['fps'][currentFP][currentStyle];

      }

    }
    this.animations[this.object.currentAnimation]['currentFP'] = currentFP;
  }
};