import { LitElement,  html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

class CrazyRaccoon extends LitElement {

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
			#game{
                background-color: deepskyblue;
                position: relative;
                display: block;
            }
            .a {
                fill: #1d1d1b;
              }

              .b {
                fill: #797979;
              }

              .c {
                fill: #fff;
              }

              .d {
                fill: #484848;
              }

        `;
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
			<svg id='game' viewBox="0 0 1200 700"></svg>
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
        const s = Snap(this.shadowRoot.getElementById("game")),
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
        let truck, lights, cactus, mountains, mountainRange, clouds, raccoon, raccoonBox, fishBox, fish, madFish;
        let costText;
        let populationText;
        let bestCostText;
        let currentPopulation = 0;
        let value = 0;
        const raccoons = Array(1);
        Snap.load("images/crazy-raccoon.svg", onSVGLoaded);

        function onSVGLoaded(data) {
            truck = data.select("#tGroup");
            lights = data.select("#lights");
            cactus = data.select("#cGroup");
            mountains = data.select("#mGroup");
            mountainRange = data.select("#mrGroup");
            clouds = data.select("#clGroup");
            raccoon = data.select("#rGroup");
            fish = data.select("#fGroup");
            madFish = data.select("#mfGroup");
            s.append(clouds);

            costText = s.text(50, 80, '0');
            populationText = s.text(550, 80, `0:0`);
            bestCostText = s.text(1060, 80, '0');
            populationText.attr({ fill: 'yellow', "font-size": "40px" });
            costText.attr({ fill: 'yellow', "font-size": "40px" });
            bestCostText.attr({ fill: 'yellow', "font-size": "40px" });
            s.append(mountains);
            s.append(mountainRange);
            s.append(cactus);
            s.append(fish);
            s.append(madFish);
            s.append(raccoon);
            raccoon.transform('t100,136');
            s.append(truck);
            lights.attr({ visibility: "hidden" });
            truck.transform('t60');
            cactus.transform('t-1200');
			fish.transform('t-600,100');
            madFish.transform('t-600,150');
            truck.hover(hoverOverTruck, hoverOutTruck);
            truck.mousedown(mouseDownTruck);
            sun.hover(hoverOverSun, hoverOutSun);
            sun.mousedown(mouseDownSun);
            moon.hover(hoverOverMoon, hoverOutMoon);
            moon.mousedown(mouseDownMoon);
            animateAll();

            let _value = 0;
            let _int = setInterval(() => {
                value += 1;
                costText.attr({ text: Math.round(value), fill: 'yellow', "font-size": "40px" });
                fishBox = fish.getBBox();
                if (clouds.attr("fill") === "red") {
                    clouds.attr({ fill: "white" });
                };

                if (raccoon.inAnim().length === 0 && raccoon.energy <= 0 || raccoon.hasFish) {
                    return;
                }
                raccoonBox = raccoon.getBBox();
                if (raccoon.inAnim().length !== 0) {
                    let intersect = Snap.path.isBBoxIntersect(raccoonBox, fishBox);
                    if ( intersect ){
                        raccoon.energy += 50;
                        raccoon.hasFish = true;
                        if ( clouds.attr("fill") !== "red" ){
                            clouds.attr({ fill: "red" });
                        }
                    }
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
        function animateFish() { fish.animate({ transform: 't1400,100' }, 5000, mina.linear, animateFish2) }
        function animateFish2() { fish.transform('t-600,100'); fish.animate({ transform: 't1400,100'}, 5000, mina.linear, animateFish2) }
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
        function raccoonJump( raccoon ){
            raccoon.animate( { transform: 't100,-270' }, 800, mina.backout, () => {
                raccoon.animate( { transform: 't100,140' }, 400, mina.bounce, () => {
                    // if ( raccoon.energy <= 0 ){
                    //     raccoon.attr( { visibility: "hidden" } );
                    // }
                })
            })
        }

    }
}

const data = {};

customElements.define("crazy-raccoon", CrazyRaccoon);