import * as THREE from 'three';
import { ThreeBSP } from './threeCSG';

class Object3D {
  constructor() {
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.xp = 0;
    this.yp = 0;
    this.zp = 0;
  }

  rotate(x, y, z) {
    this.rotateX = x;
    this.rotateY = y;
    this.rotateZ = z;
    return this;
  }

  translate(x, y, z) {
    this.xp += x;
    this.yp += y;
    this.zp += z;
    return this;
  }

  locate(mesh) {
    mesh.position.set(this.xp, this.yp, this.zp);
    mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);

    return mesh;
  }
}

class CubeClass extends Object3D {
  constructor(x, y, z) {
    super();
    this.sx = x;
    this.sy = y;
    this.sz = z;
  }

  toTHREEMesh() {
    const geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class SphereClass extends Object3D {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  toTHREEMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 20, 20);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class CylinderClass extends Object3D {
  constructor(...args) {
    super();
    console.log(args.length);
    if (args.length == 2) {
      this.r1 = args[0];
      this.r2 = args[0];
      this.h = args[1];
      this.fn = 20;
    } else if (args.length == 3) {
      this.r1 = args[0];
      this.r2 = args[1];
      this.h = args[2];
      this.fn = 20;
    } else if (args.length == 4) {
      this.r1 = args[0];
      this.r2 = args[1];
      this.h = args[2];
      this.fn = args[3];
    }
  }

  toTHREEMesh() {
    const geometry = new THREE.CylinderGeometry(this.r1, this.r2, this.h, this.fn);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class BooleanBSP {
  constructor() {
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.xp = 0;
    this.yp = 0;
    this.zp = 0;
  }

  rotate(x, y, z) {
    this.rotateX = x;
    this.rotateY = y;
    this.rotateZ = z;
    return this;
  }

  translate(x, y, z) {
    this.xp += x;
    this.yp += y;
    this.zp += z;
    return this;
  }

  locate(mesh) {
    mesh.position.set(this.xp, this.yp, this.zp);
    mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);

    return mesh;
  }

  toTHREEMesh() {
    const result = this.resultBSP.toMesh(new THREE.MeshNormalMaterial());
    result.geometry.computeVertexNormals();
    return this.locate(result);
  }
}

class UnionClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super();
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.union(meshBSP2);
  }
}

class DifferenceClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super();
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.subtract(meshBSP2);
  }
}

class IntersectionClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super();
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.intersect(meshBSP2);
  }
}

export function Cube(sx, sy, sz) {
  return new CubeClass(sx, sy, sz);
}

export function Sphere(r) {
  return new SphereClass(r);
}


export function Cylinder(...args) {
  return new CylinderClass(...args);
}

export function Union(obj1, obj2) {
  return new UnionClassBSP(obj1, obj2);
}

export function Difference(obj1, obj2) {
  return new DifferenceClassBSP(obj1, obj2);
}

export function Intersection(obj1, obj2) {
  return new IntersectionClassBSP(obj1, obj2);
}
