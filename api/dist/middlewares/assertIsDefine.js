"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefine = assertIsDefine;
function assertIsDefine(str, val) {
    if (!val) {
        console.log("error from assertIsDefine");
        throw new Error("Expected 'val' to be defined, but received " + val);
    }
    else {
        // console.log("assert value of",str , val)
        console.log("got cookie successfully.");
    }
}
