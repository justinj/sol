"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (spec, schema) {
  var errors = schema.errors(spec);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
};

;