class Mouse {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    getPosition(element, event) {
        let mx = 0,
            my = 0,
            canvasOpt = element.getCanvas();
        if (canvasOpt) {
            if (canvasOpt.offsetParent !== undefined) {
                do {
                    mx += canvasOpt.offsetLeft;
                    my += canvasOpt.offsetTop;
                } while ((canvasOpt = canvasOpt.offsetParent));
            }
            console.log(event.touches.length);
            this.x = (event.touches.length ? event.touches[0].pageX : event.pageX) - mx;
            this.y = (event.touches.length ? event.touches[0].pageY : event.pageY) - my;
            return this;
        }
    }
}