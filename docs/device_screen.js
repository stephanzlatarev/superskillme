if (!window.superskill) window.superskill = {};
if (!window.superskill.devices) window.superskill.devices = {};

window.superskill.devices.screen = new function() {

  let startTime = 0;

  let objects = {};
  let pendingBindOnClick = {};

  let scene;
  let rotations = [];

  let renderer = new THREE.WebGLRenderer();

  $(document).ready(function() {
    let size = Math.min($(window).width(), $(window).height());
    renderer.setSize(size, size);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFFFFFF );

    let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, -200, 0);
    camera.lookAt(0, 0, 0);

    new THREE.Interaction(renderer, scene, camera);

    let light1 = new THREE.DirectionalLight(0xFFFFFF, 0.3); light1.position.set(-1, -1, 1); scene.add(light1);
    let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.3); light2.position.set(-1, -1, -1); scene.add(light2);
    let light3 = new THREE.DirectionalLight(0xFFFFFF, 0.3); light3.position.set(1, -1, 1); scene.add(light3);
    let light4 = new THREE.DirectionalLight(0xFFFFFF, 0.3); light4.position.set(1, -1, -1); scene.add(light4);

    let animate = function() {
      requestAnimationFrame(animate);

      let progress = (new Date().getTime() - startTime) / 1000;
      for (var r in rotations) {
        window.superskill.space.rotate(rotations[r].object, rotations[r].rotation[0] * progress, rotations[r].rotation[1] * progress, rotations[r].rotation[2] * progress);
      }

      renderer.render(scene, camera);
    }

    animate();
  });

  // Ensure the screen always fits the screen
  let resizeTime = 0;
  $(window).resize(function() {
    resizeTime = new Date().getTime() + 1000;
    setTimeout(function() {
      if (new Date().getTime() > resizeTime) {
        let size = Math.min($(window).width(), $(window).height());
        renderer.setSize(size, size);
        $("canvas").css("margin-top", ($(window).height() - size) / 2);
      }
    }, 1000);
  });

  let materials = {};

  let getMaterial = function(item) {
    var key = item.texture + '|' + JSON.stringify(item.size) + '|' + JSON.stringify(item.resolution) + '|' + JSON.stringify(item.clip);
    var material = materials[key];
    
    if (!material) {
      if (item.texture.charAt(0) === '#') {
        material = new THREE.MeshPhongMaterial( { color: item.texture, side: THREE.DoubleSide } );
      } else {
        var texture = new THREE.TextureLoader().load(item.texture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        let resolution = item.resolution ? item.resolution : [ 100, 100 ];
        texture.repeat.set( item.size[0] / resolution[0], item.size[1] / resolution[1] );

        material = new THREE.MeshPhongMaterial( { map: texture, transparent: true, side: THREE.DoubleSide } );
      }

      materials[key] = material;
    }

    return material;
  };

  let geometries = {};

  let getGeometry = function(data) {
    var type = 'rectangle';
    
    var geometry = geometries[type];

    if (!geometry) {
      geometry = new THREE.PlaneGeometry( 1, 1 );

      geometries[type] = geometry;
    }

    return geometry;
  };

  let addObject = function(parent, data) {
    if (!data.position) data.position = [ 0, 0, 0 ];
    if (!data.orientation) data.orientation = [ 0, 0, 0 ];
    if (!data.size) data.size = [ 100, 100, 100 ];

    let object = new THREE.Object3D();
    window.superskill.space.rotate(object, data.orientation[0], data.orientation[1], data.orientation[2]);

    if (data.items) {
      object.scale.set(data.size[0] / 100, data.size[1] / 100, data.size[2] / 100);

      for (var i in data.items) {
        addObject(object, data.items[i]);
      }
    } else if (data.texture) {
      object.scale.set(data.size[0], data.size[1], 1);

      object.add(new THREE.Mesh( getGeometry(data), getMaterial(data) ));
    }

    if (data.rotation || data.movement) {
      let wrap = new THREE.Object3D();
      wrap.position.set(data.position[0], data.position[1], data.position[2]);
      parent.add(wrap);
      wrap.add(object);

      return wrap;
    } else {
      object.position.set(data.position[0], data.position[1], data.position[2]);
      parent.add(object);

      return object;
    }
  };

  let load = function(instruction) {
    if (instruction.kind) {
      return window.superskill.loader.load(instruction.kind);
    } else {
      return true;
    }
  };

  let on = function(event, callback) {
    if (event.action === 'click') {
      if (objects[event.object]) {
        bindOnClick(event.object, callback);
      } else {
        pendingBindOnClick[event.object] = callback;
      }
    }
  };

  let bindOnClick = function(object, callback) {
    objects[object].on('click', function() {
      callback(event);
    });
  };

  let run = function(instruction) {
    if (!startTime) startTime = new Date().getTime() - instruction.time;

    if ((instruction.action === "appear") && instruction.kind) {
      // Add object to screen
      window.superskill.loader.load(instruction.kind, function(data) {
        if (instruction.position) data.position = instruction.position;
        if (instruction.orientation) data.orientation = instruction.orientation;
        if (instruction.rotation) data.rotation = instruction.rotation;
        if (instruction.size) data.size = instruction.size;

        let object = addObject(scene, data);

        if (instruction.object) {
          objects[instruction.object] = object;
          if (pendingBindOnClick[instruction.object]) {
            bindOnClick(instruction.object, pendingBindOnClick[instruction.object]);
            delete pendingBindOnClick[instruction.object];
          }
        }

        if (instruction.rotation) {
          rotations.push({ object: object, rotation: instruction.rotation });
        }
      });
    }
  };

  let clear = function() {
    scene.children.length = 0;
  };

  let device = {
    load: load,
    on: on,
    run: run,
    clear: clear
  };
  device.load.bind(device);
  device.on.bind(device);
  device.run.bind(device);
  device.clear.bind(device);

  return device;
}();
