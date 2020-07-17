if (!window.superskill) window.superskill = {};
if (!window.superskill.space) window.superskill.space = {};  

window.superskill.space = new function() {

  const PI180 = Math.PI / 180;

  let degreeToRadians = function(degree) {
    return degree * PI180;
  }

  let multiply = function(matrix, vector) {
    var result = [ 0, 0, 0, 0 ];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        result[i] += matrix[i*4 + j] * vector[j];
      }
    }
    return result;
  };

  let rotateX = function(vector, rads) {
    var cos = Math.cos(rads);
    var sin = Math.sin(rads);

    return multiply([
      1, 0,    0,   0,
      0, cos,  sin, 0,
      0, -sin, cos, 0,
      0, 0,    0,   1
    ], vector);
  }

  let rotateOnAxis = function(vector, axis, rads) {
    var ux = axis[0];
    var uy = axis[1];
    var uz = axis[2];

    var cos = Math.cos(rads);
    var sin = Math.sin(rads);

    return multiply([
      cos+ux*ux*(1-cos),    ux*uy*(1-cos)+uz*sin, ux*uz*(1-cos)-uy*sin, 0,
      uy*ux*(1-cos)-uz*sin, cos+uy*uy*(1-cos),    uy*uz*(1-cos)+ux*sin, 0,
      uz*ux*(1-cos)+uy*sin, uz*uy*(1-cos)-ux*sin, cos+uz*uz*(1-cos),    0,
      0,                    0,                    0,                    1
    ], vector);
  }

  this.rotate = function(object, x, y, z) {
    let radx = degreeToRadians(x);
    let rady = degreeToRadians(y);
    let radz = degreeToRadians(z);

    let coordinates = [
      [ 1, 0, 0, 1 ],
      [ 0, 1, 0, 1 ],
      [ 0, 0, 1, 1 ]
    ];

    object.rotation.x = 0;
    object.rotation.y = 0;
    object.rotation.z = 0;

    if (radx) {
      object.rotateOnAxis(new THREE.Vector3( coordinates[0][0], coordinates[0][1], coordinates[0][2] ), radx);
      coordinates[1] = rotateX(coordinates[1], radx);
      coordinates[2] = rotateX(coordinates[2], radx);
    }

    if (rady) {
      object.rotateOnAxis(new THREE.Vector3( coordinates[1][0], coordinates[1][1], coordinates[1][2] ), rady);
      coordinates[2] = rotateOnAxis(coordinates[2], coordinates[1], rady);
    }

    if (radz) {
      object.rotateOnAxis(new THREE.Vector3( coordinates[2][0], coordinates[2][1], coordinates[2][2] ), radz);
    }
  };

  return this;
}();
