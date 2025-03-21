import {
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  Matrix4,
  PlaneGeometry,
} from 'three';
import { map } from '@/helpers/MathUtils';
// import { Geometry } from 'three-stdlib';

const FACES = ['a', 'b', 'c'];

export function toVertices(geom) {
  buildFaces(geom);
  function buildFaces(geom) {
    let attributes = geom.attributes;
    let positions = attributes.position.array;
    let normals = attributes.normal.array;
    let uvs = attributes.uv.array;

    let tempNormals = [];
    let tempUVs = [];
    let tempUVs2 = [];

    geom.vertices = [];
    geom.faceVertexUvs = [[]];
    geom.faces = [];

    let indices = geom.index.array;

    function Face3(a, b, c, normal) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.normal = normal;
    }

    for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
      geom.vertices.push(
        new Vector3(positions[i], positions[i + 1], positions[i + 2])
      );
      tempNormals.push(new Vector3(normals[i], normals[i + 1], normals[i + 2]));
      tempUVs.push(new Vector2(uvs[j], uvs[j + 1]));
    }

    function addFace(a, b, c, materialIndex) {
      let vertexNormals = [
        tempNormals[a].clone(),
        tempNormals[b].clone(),
        tempNormals[c].clone(),
      ];
      let face = new Face3(a, b, c, vertexNormals);
      geom.faces.push(face);
      geom.faceVertexUvs[0].push([
        tempUVs[a].clone(),
        tempUVs[b].clone(),
        tempUVs[c].clone(),
      ]);
    }

    for (var i = 0; i < indices.length; i += 3) {
      addFace(indices[i], indices[i + 1], indices[i + 2]);
    }

    mergeVertices(geom);
  }

  function mergeVertices(geom) {
    var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
    var unique = [],
      changes = [];

    var v, key;
    var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    var precision = Math.pow(10, precisionPoints);
    var i, il, face;
    var indices, j, jl;

    for (i = 0, il = geom.vertices.length; i < il; i++) {
      v = geom.vertices[i];
      key =
        Math.round(v.x * precision) +
        '_' +
        Math.round(v.y * precision) +
        '_' +
        Math.round(v.z * precision);

      if (verticesMap[key] === undefined) {
        verticesMap[key] = i;
        unique.push(geom.vertices[i]);
        changes[i] = unique.length - 1;
      } else {
        //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
        changes[i] = changes[verticesMap[key]];
      }
    }

    // if faces are completely degenerate after merging vertices, we
    // have to remove them from the geometry.
    var faceIndicesToRemove = [];

    for (i = 0, il = geom.faces.length; i < il; i++) {
      face = geom.faces[i];

      face.a = changes[face.a];
      face.b = changes[face.b];
      face.c = changes[face.c];

      indices = [face.a, face.b, face.c];

      // if any duplicate vertices are found in a Face3
      // we have to remove the face as nothing can be saved
      for (var n = 0; n < 3; n++) {
        if (indices[n] === indices[(n + 1) % 3]) {
          faceIndicesToRemove.push(i);
          break;
        }
      }
    }

    for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
      var idx = faceIndicesToRemove[i];

      geom.faces.splice(idx, 1);

      for (j = 0, jl = geom.faceVertexUvs.length; j < jl; j++) {
        geom.faceVertexUvs[j].splice(idx, 1);
      }
    }

    // Use unique set of vertices

    var diff = geom.vertices.length - unique.length;
    geom.vertices = unique;
    return diff;
  }
}

export function toBuffer(geom) {
  let faces = geom.faces;
  let array = geom.attributes.position.array;

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let f = 0; f < FACES.length; f++) {
      let alpha = FACES[f];
      let index = face[alpha];
      let vertex = geom.vertices[index];

      array[index * 3 + 0] = vertex.x;
      array[index * 3 + 1] = vertex.y;
      array[index * 3 + 2] = vertex.z;
    }
  }
}

export function generateRibbon(thickness = 1, subdivisions = 1) {
  let geom = new PlaneGeometry(1, 1, 1, subdivisions);

  geom.applyMatrix4(new Matrix4().makeRotationZ(Math.PI / 2));
  toVertices(geom);

  let tmpVec = new Vector2();
  let xPositions = [];
  let angles = [];
  let uvs = [];
  let vertices = geom.vertices;
  let faceVertexUvs = geom.faceVertexUvs[0];
  let indices = [];

  geom.faces.forEach((face, i) => {
    let { a, b, c } = face;
    let v0 = vertices[a];
    let v1 = vertices[b];
    let v2 = vertices[c];
    let verts = [v0, v1, v2];
    let faceUvs = faceVertexUvs[i];

    verts.forEach((v, j) => {
      tmpVec.set(v.y, v.z).normalize();

      let angle = Math.atan2(tmpVec.y, tmpVec.x);
      angles.push(angle);

      xPositions.push(v.x);
      uvs.push(faceUvs[j].toArray());
      indices.push(
        Math.abs(Math.round(map(v.x, -0.5, 0.5, 0, subdivisions - 1)))
      );
    });
  });

  let posArray = new Float32Array(xPositions);
  let angleArray = new Float32Array(angles);
  let uvArray = new Float32Array(uvs.length * 2);

  for (let i = 0; i < posArray.length; i++) {
    let [u, v] = uvs[i];
    uvArray[i * 2 + 0] = u;
    uvArray[i * 2 + 1] = v;
  }

  let geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(posArray.length * 3), 3)
  );
  geometry.setAttribute('angle', new BufferAttribute(angleArray, 1));
  geometry.setAttribute(
    'cIndex',
    new BufferAttribute(new Float32Array(indices), 1)
  );
  geometry.setAttribute('tuv', new BufferAttribute(uvArray, 2));

  geom.dispose();
  return geometry;
}

export function generateTube(
  numSides = 8,
  subdivisions = 50,
  openEnded = false
) {
  let radius = 1;
  let length = 1;

  let geom = new CylinderGeometry(
    radius,
    radius,
    length,
    numSides,
    subdivisions,
    openEnded
  );

  geom.applyMatrix4(new Matrix4().makeRotationZ(Math.PI / 2));
  toVertices(geom);

  let tmpVec = new Vector2();
  let xPositions = [];
  let angles = [];
  let uvs = [];
  let vertices = geom.vertices;
  let faceVertexUvs = geom.faceVertexUvs[0];
  let indices = [];

  //   console.log(geom);
  geom.faces.forEach((face, i) => {
    let { a, b, c } = face;
    let v0 = vertices[a];
    let v1 = vertices[b];
    let v2 = vertices[c];
    let verts = [v0, v1, v2];
    let faceUvs = faceVertexUvs[i];

    verts.forEach((v, j) => {
      tmpVec.set(v.y, v.z).normalize();

      let angle = Math.atan2(tmpVec.y, tmpVec.x);
      angles.push(angle);

      xPositions.push(v.x);
      uvs.push(faceUvs[j].toArray());
      indices.push(
        Math.abs(Math.round(map(v.x, -0.5, 0.5, 0, subdivisions - 1)))
      );
    });
  });

  let posArray = new Float32Array(xPositions);
  let angleArray = new Float32Array(angles);
  let uvArray = new Float32Array(uvs.length * 2);

  for (let i = 0; i < posArray.length; i++) {
    let [u, v] = uvs[i];
    uvArray[i * 2 + 0] = u;
    uvArray[i * 2 + 1] = v;
  }

  let geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(posArray.length * 3), 3)
  );
  geometry.setAttribute('angle', new BufferAttribute(angleArray, 1));
  geometry.setAttribute(
    'cIndex',
    new BufferAttribute(new Float32Array(indices), 1)
  );
  geometry.setAttribute('tuv', new BufferAttribute(uvArray, 2));

  geom.dispose();
  return geometry;
}
