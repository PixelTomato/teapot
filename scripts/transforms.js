import { Vector3 } from "./vectors.js"

function translate(vec3, offset) {
    return new Vector3(vec3.x + offset.x, vec3.y + offset.y, vec3.z + offset.z);
}

function rotateY(vec3, amt) {
    const x = vec3.z * Math.sin(amt * Math.PI / 180) + vec3.x * Math.cos(amt * Math.PI / 180);
    const z = vec3.z * Math.cos(amt * Math.PI / 180) - vec3.x * Math.sin(amt * Math.PI / 180);

    return new Vector3(x, vec3.y, z);
}

function unifScale(vec3, amt) {
    return new Vector3(vec3.x * amt, vec3.y * amt, vec3.z * amt);
}

export {translate, rotateY, unifScale};
