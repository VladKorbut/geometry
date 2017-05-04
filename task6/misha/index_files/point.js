class Point {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.x_speed = Math.cos(r);
        this.y_speed = Math.sin(r);
    }

    move() {
        this.x += this.x_speed;
        this.y += this.y_speed;
    }

    draw() {
        ellipse(this.x, Y - this.y, 7, 7)
    }

    point() {
        return [this.x, this.y];
    }
    
    setR(r) {
        this.r = r;;
        this.x_speed = Math.cos(r);
        this.y_speed = Math.sin(r);
    }

    getPoint() {
        return [this.x, this.y];
    }
}
