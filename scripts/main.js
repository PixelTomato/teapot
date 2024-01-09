import { Triangle, Vector2, Vector3, Transform, Mesh } from "./math.js";
import { Debug } from "./utilities.js";
import { teapotVertices } from "../models/teapot.js";
import { teacupVertices } from "../models/teacup.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
resize(); window.addEventListener("resize", resize);

let debugFrames = 0;
let debugTriangles = 0;

function drawTriangle(point1, point2, point3, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    if (fill) ctx.fill();
    if (stroke || stroke == undefined) ctx.stroke();
    ++debugTriangles;
}

function depthSort(triangles) {
    let _triangles = triangles;

    for (let i = 0; i < _triangles.length; i++) {
        let triangle = new Triangle(
            _triangles[i].a,
            _triangles[i].b,
            _triangles[i].c,
        );

        _triangles[i] = [triangle, Vector3.distance(triangle.center, new Vector3(0, 0, 0))];
    }

    _triangles.sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < _triangles.length; i++) {
        _triangles[i] = _triangles[i][0];
    }

    return _triangles;
}

function formFaces(vertices) {
    let faces = [];
    for (let i = 0; i < vertices.length - 9; i += 9) {
        faces.push(new Triangle(
            new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]),
            new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]),
            new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]),
        ));
    }
    return faces;
}

function drawMesh(mesh, fill, stroke) {
    mesh.triangles.forEach((triangle, i) => {
        const n = mesh.normals[i].magnitude;
        ctx.fillStyle = `hsla(255, 100%, ${n * 15 + 20}%, 30%)`;
        ctx.strokeStyle = `hsla(255, 100%, ${n * 15 + 16}%, 80%)`;
        drawTriangle(
            triangle.a,
            triangle.b,
            triangle.c,
            fill,
            stroke,
        );
    });
}

let teapotTriangles = formFaces(teapotVertices);
let teacupTriangles = formFaces(teacupVertices);
let particles = [];

function main() {
    const debug = new Debug(ctx);
    const frameStart = performance.now();

    debugTriangles = 0;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "gray";

    const speed = 85;
    const tilt = Math.sin(debugFrames / speed) * 30 + 30;

    for (let i = 0; i < Math.pow(tilt - 45, 3) / 250; i++) {
        particles.push(new Vector3(
            Math.random() / 15 + 0.1,
            0.05 - Math.sin(debugFrames / speed) / 4,
            4,
        ));
    }


    const teapot = new Mesh(teapotTriangles.slice());
    teapot.triangles = Mesh.rotateZ(teapot.triangles, Math.sin(debugFrames / speed) * 30 + 30);
    teapot.triangles = Mesh.scale(teapot.triangles, new Vector3(1, -1, -1));
    teapot.triangles = Mesh.translate(teapot.triangles, new Vector3(-2.5 + Math.sin(debugFrames / speed) / 2, Math.sin(debugFrames / speed), -4));
    teapot.triangles = depthSort(teapot.triangles);
    teapot.calculateNormals();
    teapot.triangles = Mesh.project(teapot.triangles, 400, canvas);

    const teacup = new Mesh(teacupTriangles.slice());
    teacup.triangles = Mesh.rotateY(teacup.triangles, 90);
    teacup.triangles = Mesh.scale(teacup.triangles, new Vector3(1, 1, 1));
    teacup.triangles = Mesh.translate(teacup.triangles, new Vector3(0, -1.5 + Math.sin(debugFrames / 50) / 4, -4));
    teacup.triangles = depthSort(teacup.triangles);
    teacup.calculateNormals();
    teacup.triangles = Mesh.project(teacup.triangles, 400, canvas);

    particles = particles.filter(e => { return e.y < 1.5 - Math.sin(debugFrames / 50) / 4 });

    for (let i = 0; i < particles.length; i++) {
        let point = particles[i];
        point = Transform.project(point, 400, canvas);
        ctx.fillStyle = `hsla(200, 255%, 20%, 5%)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        particles[i].y += 0.02;
    };

    drawMesh(teapot, true, false);
    drawMesh(teacup, true, false);

    debug.addLine("Frames Elapsed", debugFrames);
    debug.addLine("Frame Time", performance.now() - frameStart + "ms");
    debug.addLine("Triangles", debugTriangles);
    debug.addLine("Particle Count", particles.length);
    debug.draw();

    ++debugFrames;

    window.requestAnimationFrame(main);
}

main();
