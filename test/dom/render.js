define(["require", "exports", "sky-view"], function (require, exports, sky_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    sky_view_1.render(sky_view_1.tag("div", { class: "1" },
        sky_view_1.tag("div", { class: "2", id: "hello" }, "hello world")), document.body);
});
