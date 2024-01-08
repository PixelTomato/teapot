import { vertices } from "../assets/models/teapot.js";
import { Vector2, Vector3 } from "./vectors.js";
import { translate, rotateY, unifScale } from "./transforms.js";

const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");

const fov = 400;

let frame = 0;
let zDistance = 0;

function resize_viewport() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function project(vec3) {
    const x = vec3.x * fov / vec3.z + canvas.width / 2;
    const y = vec3.y * fov / vec3.z + canvas.height / 2;

    return new Vector3(x, y, 0);
}

function lineTri(pt1, pt2, pt3) {
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.lineTo(pt3.x, pt3.y);
    ctx.lineTo(pt1.x, pt1.y);
    ctx.stroke();
}

function fillTri(pt1, pt2, pt3) {
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.lineTo(pt3.x, pt3.y);
    ctx.lineTo(pt1.x, pt1.y);
    ctx.stroke();
    ctx.fill();
}

class Mesh {
    constructor() {
        this.vertices = [];
        this.points = [];
        this.indices = [];
    }

    loadVertices(verts) {
        for (let i = 0; i < verts.length; i += 3) {
            this.vertices.push(new Vector3(verts[i], verts[i + 1], verts[i + 2]));
        }
    }

    genIndices() {
        for (let i = 0; i < this.vertices.length - 3; i += 3) {
            this.indices.push(i, i + 1, i + 2);
        }
    }

    getTris() {
        let tris = [];
        for (let i = 0; i < mesh.indices.length - 3; i += 3) {
            tris.push([
                mesh.vertices[mesh.indices[i]],
                mesh.vertices[mesh.indices[i + 1]],
                mesh.vertices[mesh.indices[i + 2]]
            ]);
        }
        return tris;
    }
}

class DisplayList {
    constructor() {
        this.components = [];
    }

    addTri(tri) {
        this.components.push(tri);
    }

    addLine(line) {
        this.components.push(line);
    }

    addPoint(point) {
        this.components.push(point);
    }

    depthSort() {

    }

    project() {
        for (let i = 0; i < this.components.length; i++) {
            for (let a = 0; a < this.components[i].length; a++) {
                this.components[i][a] = toScreen(this.components[i][a]);
            }
        }
    }

    draw() {
        for (const tri of this.components) {
            fillTri(...tri);
        }
    }
}

function toScreen(vert) {
    let point = rotateY(vert, frame);
    point = unifScale(point, 1)
    point = translate(point, new Vector3(0, 1, 3))
    return project(point);
}

function drawWireMesh(mesh) {
    for (let i = 0; i < mesh.indices.length - 3; i += 3) {
        lineTri(
            toScreen(mesh.vertices[mesh.indices[i]]),
            toScreen(mesh.vertices[mesh.indices[i + 1]]),
            toScreen(mesh.vertices[mesh.indices[i + 2]])
        );
    }
}

function drawFillMesh(mesh) {
    let t = 0;
    for (let i = 0; i < mesh.indices.length - 3; i += 3) {
        ctx.fillStyle = t == 0 ? "purple" : "gray"; //`rgb(${r}, ${g}, ${b})`;
        fillTri(
            toScreen(mesh.vertices[mesh.indices[i]]),
            toScreen(mesh.vertices[mesh.indices[i + 1]]),
            toScreen(mesh.vertices[mesh.indices[i + 2]])
        );
        t = 1 - t;
    }
}

let mesh = new Mesh();
mesh.loadVertices(vertices);
mesh.genIndices();

function main() {
    const frameStart = performance.now();

    const displayList = new DisplayList();

    for (const tri of mesh.getTris()) {
        displayList.addTri(tri);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "blue";
    ctx.font = "12px arial";

    displayList.depthSort();
    displayList.project();
    displayList.draw();

    ++frame;

    ctx.fillStyle = "yellow";
    ctx.fillText(`Frame: ${frame}`, 6, 14);
    ctx.fillText(`Frame Time: ${performance.now() - frameStart}`, 6, 28);

    window.requestAnimationFrame(main);
}

window.addEventListener("resize", () => {
    resize_viewport();
});

resize_viewport();
main();
