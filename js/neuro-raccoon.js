import { RaccoonElement, html, css } from './lit-raccoon.js';

class NeuroRaccon extends RaccoonElement {

    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true, category: 'settings' }
        }
    }

    static get styles() {
        return css`
            :host {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-sizing: border-box;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
			#snappy{
                background-color: deepskyblue;
                position: relative;
                display: block;
            }

        `;
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
			<svg id='snappy' class='img-responsive' viewBox="0 0 1200 700"></svg>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
        setTimeout(() => this.init(), 100);
        //window.addEventListener('resize', () => FLIP.throttle('resize', () => this.fontSize = this._fontSize, 300), false);
    }

    updated(e) {
        if (e.has('row') || e.has('column')) {
            this.row = this.row < 2 ? 2 : this.row > 10 ? 10 : this.row;
            this.column = this.column < 2 ? 2 : this.column > 10 ? 10 : this.column;
        }
        if (e.has('row') || e.has('column')) this.init();
    }

    async init() {
		await fetch("images/crazi-raccoon.svg")
		.then(response => response.text())
		.then(svg => {
			data.svg = svg;
		});
        const s = Snap(this.shadowRoot.getElementById("snappy")),
            vbW = 1200,
            vbH = 700,
            sun = s.circle(60, 600, 300),
            road1 = s.rect(-4, 580, vbW + 10, 130),
            road2 = s.rect(-4, 580, vbW + 10, 10);

        road2.attr({ fill: "grey" });
        sun.attr({ fill: "khaki", stroke: "goldenrod", strokeWidth: 40 });
        const night = s.rect(-4, -600, vbW + 10, 600);
        const moon = s.circle(980, 800, 60);
        moon.attr({ fill: "white" });
        let truck, lights, cactus, mountains, mountainRange, clouds, raccoon, mat1, mat2, fish;
        //const mystring = data.svg;
        //const blob = new Blob([mystring], { type: 'text/plain' });
        //const objectURL = URL.createObjectURL(blob);
        //Snap.load(objectURL, onSVGLoaded);
        Snap.load("images/crazi-raccoon.svg", onSVGLoaded);

        function onSVGLoaded(data) {
            truck = data.select("#tGroup");
            lights = data.select("#lights");
            cactus = data.select("#cGroup");
            mountains = data.select("#mGroup");
            mountainRange = data.select("#mrGroup");
            clouds = data.select("#clGroup");
            raccoon = data.select("#rGroup");
			fish = data.select("#fGroup");
            s.append(clouds);
            s.append(mountains);
            s.append(mountainRange);
            s.append(cactus);
            s.append(raccoon);
            s.append(truck);
			s.append(fish);
            lights.attr({ visibility: "hidden" });
            //let t = new Snap.Matrix();
            //t.translate(-1200, 0);
            truck.transform('t60');
            raccoon.transform('t100,136');
            //cactus.transform(t);
            cactus.transform('t-1200');
			fish.transform('t-600 s0.3');
            truck.hover(hoverOverTruck, hoverOutTruck);
            truck.mousedown(mouseDownTruck);
            sun.hover(hoverOverSun, hoverOutSun);
            sun.mousedown(mouseDownSun);
            moon.hover(hoverOverMoon, hoverOutMoon);
            moon.mousedown(mouseDownMoon);
            animateAll();
            let text = s.text(50, 80, '0');
            let text2 = s.text(1060, 80, '0');
            text2.attr({ fill: 'yellow', "font-size": "40px" })
            let value = 0;
            let _value = 0;
            let _int = setInterval(() => {
                mat1 = raccoon.getBBox();
                mat2 = fish.getBBox();
                let intersect = Snap.path.isBBoxIntersect(mat1, mat2)
                if (intersect) {
                    if (value > _value) {
                        _value = value;
                        text2.attr({ text: _value, });
                    }
                    value = 0;
                    text.attr({ text: '0', fill: 'yellow',  "font-size": "80px" });
                    clouds.attr({ fill: "red" });
                } else {
                    value += 1;
                    clouds.attr({ fill: "white" });
                    text.attr({ text: Math.round(value), fill: 'yellow', "font-size": "40px" });
                }
            }, 100)
            document.addEventListener('keyup', mouseDownTruck);
        }
        function animateAll() {
            animatetTruck1();
            animateCactus();
            animateFish();
            animateMountains();
            animateMountainRange();
            animateClouds();
        }
        function animatetTruck1() { truck.animate({ transform: 't120,10' }, 6000, mina.easeinout, animatetTruck2) }
        function animatetTruck2() { truck.animate({ transform: 't-10,0' }, 6000, mina.easeinout, animatetTruck1) }
        function animateCactus() { cactus.animate({ transform: 't1300' }, 4000, mina.linear, animateCactus2) }
        function animateCactus2() { cactus.transform('t-1200'); cactus.animate({ transform: 't1300' }, 4000, mina.linear, animateCactus) }
        function animateFish() { fish.animate({ transform: 't1400 s0.3' }, 5000, mina.linear, animateFish2) }
        // function animateFish2() { fish.transform('t-500 s0.3'); fish.animate({ transform: 't500'}, 3000, mina.linear, animateFish) }
        function animateFish2() { fish.transform('t-600 s0.3'); fish.animate({ transform: 't1400 s0.3'}, 5000, mina.linear, animateFish2) }
        function animateMountains() { mountains.animate({ transform: 't1200' }, 8000, '', animateMountains2) }
        function animateMountains2() { mountains.transform('t0'); animateMountains() }
        function animateMountainRange() { mountainRange.animate({ transform: 't1200' }, 4000, '', animateMountainRange2) }
        function animateMountainRange2() { mountainRange.transform('t0'); animateMountainRange() }
        function animateClouds() { clouds.animate({ transform: 't1200' }, 30000, '', animateClouds2) }
        function animateClouds2() { clouds.transform('t0'); animateClouds() }
        function animateCoon() { raccoon.animate({ transform: 't100,-270' }, 800, mina.backout, animateCoon2) }
        function animateCoon2() { raccoon.animate({ transform: 't100,140' }, 400, mina.bounce) }
        function hoverOverTruck() { document.body.style.cursor = "pointer" }
        function hoverOutTruck() { document.body.style.cursor = "default" }
        function mouseDownTruck() { animateCoon() }
        function hoverOverSun() { document.body.style.cursor = "pointer" }
        function hoverOutSun() { document.body.style.cursor = "default" }
        function lightsOn() { lights.attr({ visibility: "visible" }) }
        function hoverOverMoon() { document.body.style.cursor = "pointer" }
        function hoverOutMoon() { document.body.style.cursor = "default" }
        function mouseDownSun() {
            sun.animate({ transform: 't0,300' }, 1000, mina.bounce);
            night.animate({ transform: 't0,560' }, 1000, mina.bounce);
            moon.animate({ transform: 't0,-730' }, 1000, mina.bounce, lightsOn);
            clouds.attr({ "fill-opacity": 0.3 });
        }
        function mouseDownMoon() {
            sun.animate({ transform: 't60' }, 3000, mina.linear);
            night.animate({ transform: 't0,-560' }, 1000, mina.bounce);
            moon.animate({ transform: 't0,730' }, 1000, mina.bounce);
            clouds.attr({ "fill-opacity": 1 });
            lights.attr({ visibility: "hidden" });
        }
    }
}

const data = {};

customElements.define("neuro-raccoon", NeuroRaccon);