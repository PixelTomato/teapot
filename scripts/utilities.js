class Debug {
    constructor(ctx) {
        this.ctx = ctx;
        this.lines = [];
    }

    addLine(name, value) {
        this.lines.push([name, value]);
    }

    draw() {
        this.ctx.fillStyle = "cornflowerblue";
        this.ctx.font = "12px monospace"

        let y = 0;

        this.lines.forEach(line => {
            this.ctx.fillText(`${line[0]} - ${line[1]}`, 2, y += 12);
        });
    }
}

export {Debug};