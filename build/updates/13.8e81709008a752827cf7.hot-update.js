require("source-map-support").install();
exports.id = 13;
exports.modules = {

/***/ "./src/data/queries/checkNumber.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CheckNumberType__ = __webpack_require__("./src/data/types/CheckNumberType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const checkNumber = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_CheckNumberType__["a" /* default */],
  args: {
    number: { type: new __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLInt"]) },
    runner_id: { type: new __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLString"]) }
  },
  resolve(root, { number, runner_id }) {
    return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].findOne({ where: { number } }).then(result => ({
      available: !result || result.id === runner_id
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (checkNumber);

/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlcy8xMy44ZTgxNzA5MDA4YTc1MjgyN2NmNy5ob3QtdXBkYXRlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9kYXRhL3F1ZXJpZXMvY2hlY2tOdW1iZXIuanM/NjQxYyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDaGVja051bWJlclR5cGUgZnJvbSAnLi4vdHlwZXMvQ2hlY2tOdW1iZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi8uLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJbnQsIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsIEdyYXBoUUxTdHJpbmd9IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBjaGVja051bWJlciA9IHtcbiAgdHlwZTogQ2hlY2tOdW1iZXJUeXBlLFxuICBhcmdzOiB7XG4gICAgbnVtYmVyOiB7IHR5cGU6IG5ldyBOb25OdWxsKEdyYXBoUUxJbnQpIH0sXG4gICAgcnVubmVyX2lkOiB7IHR5cGU6IG5ldyBOb25OdWxsKEdyYXBoUUxTdHJpbmcpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBudW1iZXIsIHJ1bm5lcl9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kT25lKHsgd2hlcmU6IHsgbnVtYmVyIH0gfSkudGhlbihyZXN1bHQgPT4gKHtcbiAgICAgIGF2YWlsYWJsZTogIXJlc3VsdCB8fCByZXN1bHQuaWQgPT09IHJ1bm5lcl9pZCxcbiAgICB9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjaGVja051bWJlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL2NoZWNrTnVtYmVyLmpzIl0sIm1hcHBpbmdzIjoiOztBOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFWQTtBQUNBO0FBWUE7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==