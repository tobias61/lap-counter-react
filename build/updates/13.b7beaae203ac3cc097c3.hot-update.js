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
    runner_id: { type: __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLString"] }
  },
  resolve(root, { number, runner_id }) {
    return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].findOne({ where: { number } }).then(result => {
      console.log(result.id, runner_id);
      return {
        available: !result || result.id === runner_id
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (checkNumber);

/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlcy8xMy5iN2JlYWFlMjAzYWMzY2MwOTdjMy5ob3QtdXBkYXRlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9kYXRhL3F1ZXJpZXMvY2hlY2tOdW1iZXIuanM/NjQxYyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDaGVja051bWJlclR5cGUgZnJvbSAnLi4vdHlwZXMvQ2hlY2tOdW1iZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi8uLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJbnQsIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsIEdyYXBoUUxTdHJpbmcgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgY2hlY2tOdW1iZXIgPSB7XG4gIHR5cGU6IENoZWNrTnVtYmVyVHlwZSxcbiAgYXJnczoge1xuICAgIG51bWJlcjogeyB0eXBlOiBuZXcgTm9uTnVsbChHcmFwaFFMSW50KSB9LFxuICAgIHJ1bm5lcl9pZDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBudW1iZXIsIHJ1bm5lcl9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kT25lKHsgd2hlcmU6IHsgbnVtYmVyIH0gfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0LmlkLCBydW5uZXJfaWQpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0YXZhaWxhYmxlOiAhcmVzdWx0IHx8IHJlc3VsdC5pZCA9PT0gcnVubmVyX2lkLFxuXHRcdFx0fVxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOdW1iZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9jaGVja051bWJlci5qcyJdLCJtYXBwaW5ncyI6Ijs7QTs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBYkE7QUFDQTtBQWVBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=