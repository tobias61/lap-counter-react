require("source-map-support").install();
exports.id = 13;
exports.modules = {

/***/ "./src/data/types/RunnerType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const RunnerType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'Runner',
  fields: {
    id: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]),
      resolve: res => res.id
    },
    firstName: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.firstName
    },
    lastName: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.lastName
    },
    birthday: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.birthday
    },
    gender: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.gender
    },
    email: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.email
    },
    sponsor_amount: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLFloat"],
      resolve: res => res.sponsor_amount
    },
    sponsor: {
      type: __WEBPACK_IMPORTED_MODULE_1__SponsorType__["a" /* default */],
      resolve: res => __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__["a" /* default */].findById(res.sponsor_id)
    },
    number: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => res.number
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (RunnerType);

/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlcy8xMy5mNzQyYzcwZmYwY2JjYWMyZmVjZi5ob3QtdXBkYXRlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9kYXRhL3R5cGVzL1J1bm5lclR5cGUuanM/NTZiNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlIGFzIE9iamVjdFR5cGUsXG4gIEdyYXBoUUxJRCBhcyBJRCxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMRmxvYXQgYXMgRmxvYXRUeXBlLFxuICBHcmFwaFFMSW50IGFzIEludGVnZXJUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTcG9uc29yVHlwZSBmcm9tICcuL1Nwb25zb3JUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcblxuY29uc3QgUnVubmVyVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1J1bm5lcicsXG4gIGZpZWxkczoge1xuICAgIGlkOiB7XG4gICAgICB0eXBlOiBuZXcgTm9uTnVsbChJRCksXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmlkLFxuICAgIH0sXG4gICAgZmlyc3ROYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5maXJzdE5hbWUsXG4gICAgfSxcbiAgICBsYXN0TmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMubGFzdE5hbWUsXG4gICAgfSxcbiAgICBiaXJ0aGRheToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuYmlydGhkYXksXG4gICAgfSxcbiAgICBnZW5kZXI6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmdlbmRlcixcbiAgICB9LFxuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5lbWFpbCxcbiAgICB9LFxuICAgIHNwb25zb3JfYW1vdW50OiB7XG4gICAgICB0eXBlOiBGbG9hdFR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLnNwb25zb3JfYW1vdW50LFxuICAgIH0sXG4gICAgc3BvbnNvcjoge1xuICAgICAgdHlwZTogU3BvbnNvclR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gU3BvbnNvci5maW5kQnlJZChyZXMuc3BvbnNvcl9pZCksXG4gICAgfSxcbiAgICBudW1iZXI6IHtcbiAgICAgIHR5cGU6IEludGVnZXJUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5udW1iZXIsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSdW5uZXJUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1J1bm5lclR5cGUuanMiXSwibWFwcGluZ3MiOiI7O0E7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBakNBO0FBRkE7QUFDQTtBQXlDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9