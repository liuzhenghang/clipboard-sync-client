import {App} from "./lib.js";
window.initApp=function (options) {
    const app = new App()
    app.connect(options)
    return app
}
