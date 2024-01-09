const RAD = Math.PI / 180;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static distance(point1, point2) {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;
        const c = point1.z - point2.z;

        return Math.sqrt(a * a + b * b + c * c);
    }

    static crossProduct(point1, point2) {
        return new Vector3(
            point1.y * point2.z - point1.z * point2.y,
            point1.z * point2.x - point1.x * point2.z,
            point1.x * point2.y - point1.y * point2.x,
        );
    }
}

class Triangle { // Normal is cross of AB and AC
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    get center() {
        return new Vector3(
            (this.a.x + this.b.x + this.c.x) / 3,
            (this.a.y + this.b.y + this.c.y) / 3,
            (this.a.z + this.b.z + this.c.z) / 3,
        );
    }

    get normal() {
        return Vector3.crossProduct(this.a, this.b);
    }

    static translate(triangle, offset) {
        return new Triangle(
            Transform.translate(triangle.a, offset),
            Transform.translate(triangle.b, offset),
            Transform.translate(triangle.c, offset),
        );
    }

    static _rotateX(triangle, sin, cos) {
        return new Triangle(
            Transform._rotateX(triangle.a, sin, cos),
            Transform._rotateX(triangle.b, sin, cos),
            Transform._rotateX(triangle.c, sin, cos),
        );
    }

    static _rotateY(triangle, sin, cos) {
        return new Triangle(
            Transform._rotateY(triangle.a, sin, cos),
            Transform._rotateY(triangle.b, sin, cos),
            Transform._rotateY(triangle.c, sin, cos),
        );
    }

    static _rotateZ(triangle, sin, cos) {
        return new Triangle(
            Transform._rotateZ(triangle.a, sin, cos),
            Transform._rotateZ(triangle.b, sin, cos),
            Transform._rotateZ(triangle.c, sin, cos),
        );
    }

    static scale(triangle, offset) {
        return new Triangle(
            Transform.scale(triangle.a, offset),
            Transform.scale(triangle.b, offset),
            Transform.scale(triangle.c, offset),
        );
    }

    static project(triangle, fov, viewport) {
        return new Triangle(
            Transform.project(triangle.a, fov, viewport),
            Transform.project(triangle.b, fov, viewport),
            Transform.project(triangle.c, fov, viewport),
        );
    }
}

class Mesh {
    constructor(triangles) {
        this.triangles = triangles;
        this.normals = [];
    }

    calculateNormals() {
        this.normals = [];
        this.triangles.forEach(triangle => {
            this.normals.push(triangle.normal);
        });
    }

    static translate(triangles, offset) {
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle.translate(triangle, offset));
        });
        return out;
    }

    static rotateX(triangles, offset) {
        const _offset = offset * RAD;
        const sin = Math.sin(_offset);
        const cos = Math.cos(_offset);
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle._rotateX(triangle, sin, cos))
        });
        return out;
    }

    static rotateY(triangles, offset) {
        const _offset = offset * RAD;
        const sin = Math.sin(_offset);
        const cos = Math.cos(_offset);
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle._rotateY(triangle, sin, cos))
        });
        return out;
    }

    static rotateZ(triangles, offset) {
        const _offset = offset * RAD;
        const sin = Math.sin(_offset);
        const cos = Math.cos(_offset);
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle._rotateZ(triangle, sin, cos))
        });
        return out;
    }

    static scale(triangles, offset) {
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle.scale(triangle, offset));
        });
        return out;
    }

    static project(triangles, fov, viewport) {
        let out = [];
        triangles.forEach(triangle => {
            out.push(Triangle.project(triangle, fov, viewport));
        });
        return out;
    }
}

class Transform {
    static translate(point, offset) {
        return new Vector3(
            point.x + offset.x,
            point.y + offset.y,
            point.z + offset.z,
        );
    }

    static rotateX(point, offset) {
        return new Vector3(
            point.x,
            point.y * Math.cos(offset * RAD) - point.z * Math.sin(offset * RAD),
            point.y * Math.sin(offset * RAD) + point.z * Math.cos(offset * RAD),
        );
    }

    static rotateY(point, offset) {
        return new Vector3(
            point.z * Math.sin(offset * RAD) + point.x * Math.cos(offset * RAD),
            point.y,
            point.z * Math.cos(offset * RAD) - point.x * Math.sin(offset * RAD),
        );
    }

    static rotateZ(point, offset) {
        return new Vector3(
            point.x * Math.cos(offset * RAD) - point.y * Math.sin(offset * RAD),
            point.x * Math.sin(offset * RAD) + point.y * Math.cos(offset * RAD),
            point.z,
        );
    }

    static _rotateX(point, sin, cos) {
        return new Vector3(
            point.x,
            point.y * cos - point.z * sin,
            point.y * sin + point.z * cos,
        );
    }

    static _rotateY(point, sin, cos) {
        return new Vector3(
            point.z * sin + point.x * cos,
            point.y,
            point.z * cos - point.x * sin,
        );
    }

    static _rotateZ(point, sin, cos) {
        return new Vector3(
            point.x * cos - point.y * sin,
            point.x * sin + point.y * cos,
            point.z,
        );
    }

    static scale(point, offset) {
        return new Vector3(
            point.x * offset.x,
            point.y * offset.y,
            point.z * offset.z,
        );
    }

    static project(point, fov, viewport) {
        return new Vector2(
            point.x * fov / point.z + viewport.width / 2,
            point.y * fov / point.z + viewport.height / 2,
        );
    }
}

export { Vector2, Vector3, Triangle, Transform, Mesh };