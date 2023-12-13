import { vertices } from "../assets/models/teapot.js";
import { Vector2, Vector3 } from "./vectors.js";

const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");

const fov = 400;

let frame = 0;
let zDistance = 0;

function resize_viewport() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

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

function project(vec3) {
    const x = vec3.x * fov / vec3.z + canvas.width / 2;
    const y = vec3.y * fov / vec3.z + canvas.height / 2;

    return new Vector3(x, y, 0);
}

let prev = new Vector3(0, 0, 0);

function main() {
    let debugVerts = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "blue";
    
    for (let i = 0; i < vertices.length; i += 3) {
        const vert = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        let point = vert;
        
        point = rotateY(point, frame / 10000);
        point = unifScale(point, -1)
        point = translate(point, new Vector3(0, 1, 3))
        point = project(point);

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.fillRect(point.x, point.y, 2, 2);

        prev = point;

        ++debugVerts;
        ++frame;
    }

    ctx.fillText(`Verts: ${debugVerts}`, 6, 14)

    window.requestAnimationFrame(main);
}

window.addEventListener("resize", () => {
    resize_viewport();
});

resize_viewport();
main();
