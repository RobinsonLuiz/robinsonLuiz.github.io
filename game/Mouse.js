class Mouse {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    getPosition(element, event) {
        let mx = 0, my = 0, canvasOpt = element.getCanvas();
        if (canvasOpt) {
            if (canvasOpt.offsetParent !== undefined) {
                do {
                    mx += canvasOpt.offsetLeft;
                    my += canvasOpt.offsetTop;
                } while ((canvasOpt = canvasOpt.offsetParent));
            }
            mx += 2
            mx += 2;
            this.x = event.pageX - mx;
            this.y = event.pageY - my;
            return this;
        }
    }
}