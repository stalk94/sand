const { Window } = require('skia-canvas');


const win = new Window(300, 300);
win.on("draw", (e)=> {
    let ctx = e.target.canvas.getContext("2d");
});