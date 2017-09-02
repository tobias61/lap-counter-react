require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "updates/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "updates/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1f3bebcd5802d0a237f0"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		13: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./chunks/" + ({"0":"sponsors-create","1":"runners-update","2":"runners-create","3":"home","4":"privacy","5":"about","6":"register","7":"not-found","8":"login","9":"contact","10":"runners","11":"sponsors","12":"import"}[chunkId]||chunkId) + ".js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.resolve();
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// uncatched error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using System.import().catch()
/******/ 		});
/******/ 	};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(13)(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n", "", {"version":3,"sources":["/Developer/Projects/lap-counter/lap-counter-react/src/routes/error/ErrorPage.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;AAEH;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;EAC5B,yBAAyB;MACrB,sBAAsB;UAClB,wBAAwB;EAChC,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,wBAAwB;EACxB,mBAAmB;EACnB,YAAY;CACb;;AAED;EACE,UAAU;CACX;;AAED;EACE,iBAAiB;EACjB,YAAY;CACb;;AAED;EACE,sBAAsB;EACtB,iBAAiB;CAClB","file":"ErrorPage.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/isomorphic-style-loader/lib/insertCss.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(28);

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = __webpack_require__(29);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var prefix = 's';
var inserted = {};

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

/**
 * Remove style/link elements for specified node IDs
 * if they are no longer referenced by UI components.
 */
function removeCss(ids) {
  ids.forEach(function (id) {
    if (--inserted[id] <= 0) {
      var elem = document.getElementById(prefix + id);
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  });
}

/**
 * Example:
 *   // Insert CSS styles object generated by `css-loader` into DOM
 *   var removeCss = insertCss([[1, 'body { color: red; }']]);
 *
 *   // Remove it from the DOM
 *   removeCss();
 */
function insertCss(styles) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$replace = _ref.replace,
      replace = _ref$replace === undefined ? false : _ref$replace,
      _ref$prepend = _ref.prepend,
      prepend = _ref$prepend === undefined ? false : _ref$prepend;

  var ids = [];
  for (var i = 0; i < styles.length; i++) {
    var _styles$i = (0, _slicedToArray3.default)(styles[i], 4),
        moduleId = _styles$i[0],
        css = _styles$i[1],
        media = _styles$i[2],
        sourceMap = _styles$i[3];

    var id = moduleId + '-' + i;

    ids.push(id);

    if (inserted[id]) {
      if (!replace) {
        inserted[id]++;
        continue;
      }
    }

    inserted[id] = 1;

    var elem = document.getElementById(prefix + id);
    var create = false;

    if (!elem) {
      create = true;

      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.id = prefix + id;

      if (media) {
        elem.setAttribute('media', media);
      }
    }

    var cssText = css;
    if (sourceMap && typeof btoa === 'function') {
      // skip IE9 and below, see http://caniuse.com/atob-btoa
      cssText += '\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';
      cssText += '\n/*# sourceURL=' + sourceMap.file + '?' + id + '*/';
    }

    if ('textContent' in elem) {
      elem.textContent = cssText;
    } else {
      elem.styleSheet.cssText = cssText;
    }

    if (create) {
      if (prepend) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
      } else {
        document.head.appendChild(elem);
      }
    }
  }

  return removeCss.bind(null, ids);
}

module.exports = insertCss;

/***/ }),

/***/ "./src/actions/runtime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = setRuntimeVariable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__("./src/constants/index.js");
/* eslint-disable import/prefer-default-export */



function setRuntimeVariable({ name, value }) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* SET_RUNTIME_VARIABLE */],
    payload: {
      name,
      value
    }
  };
}

/***/ }),

/***/ "./src/components/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const ContextType = _extends({
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  // Universal HTTP client
  fetch: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired
}, __WEBPACK_IMPORTED_MODULE_2_react_redux__["Provider"].childContextTypes, {
  // Apollo Client
  client: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired
});

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent {

  getChildContext() {
    return this.props.context;
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.Children.only(this.props.children);
  }
}

App.propTypes = {
  context: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape(ContextType).isRequired,
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.element.isRequired
};
App.childContextTypes = ContextType;
/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ "./src/components/Html.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_serialize_javascript__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_serialize_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_serialize_javascript__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__config__);
var _jsxFileName = '/Developer/Projects/lap-counter/lap-counter-react/src/components/Html.js';
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






/* eslint-disable react/no-danger */

class Html extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.Component {

  render() {
    const { title, description, styles, scripts, app, children } = this.props;
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'html',
      { className: 'no-js', lang: 'en', __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'head',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { charSet: 'utf-8', __source: {
            fileName: _jsxFileName,
            lineNumber: 42
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { httpEquiv: 'x-ua-compatible', content: 'ie=edge', __source: {
            fileName: _jsxFileName,
            lineNumber: 43
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'title',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            },
            __self: this
          },
          title
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { name: 'description', content: description, __source: {
            fileName: _jsxFileName,
            lineNumber: 47
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          },
          __self: this
        }),
        scripts.map(script => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('link', { key: script, rel: 'preload', href: script, as: 'script', __source: {
            fileName: _jsxFileName,
            lineNumber: 50
          },
          __self: this
        })),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png', __source: {
            fileName: _jsxFileName,
            lineNumber: 52
          },
          __self: this
        }),
        styles.map(style => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('style', {
          key: style.id,
          id: style.id,
          dangerouslySetInnerHTML: { __html: style.cssText },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          },
          __self: this
        }))
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'body',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: children }, __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          dangerouslySetInnerHTML: { __html: `window.App=${__WEBPACK_IMPORTED_MODULE_2_serialize_javascript___default.a(app)}` },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          },
          __self: this
        }),
        scripts.map(script => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', { key: script, src: script, __source: {
            fileName: _jsxFileName,
            lineNumber: 66
          },
          __self: this
        })),
        __WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          dangerouslySetInnerHTML: {
            __html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + `ga('create','${__WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId}','auto');ga('send','pageview')`
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 68
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          src: 'https://www.google-analytics.com/analytics.js',
          async: true,
          defer: true,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 77
          },
          __self: this
        })
      )
    );
  }
}

Html.propTypes = {
  title: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  description: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  styles: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    id: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    cssText: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
  }).isRequired),
  scripts: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired),
  app: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object, // eslint-disable-line
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
};
Html.defaultProps = {
  styles: [],
  scripts: []
};
/* harmony default export */ __webpack_exports__["a"] = (Html);

/***/ }),

/***/ "./src/config.js":
/***/ (function(module, exports, __webpack_require__) {

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (false) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID // UA-XXXXX-X
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc'
    },

    // https://cloud.google.com/console/project
    google: {
      id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd'
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ'
    }
  }
};

/***/ }),

/***/ "./src/constants/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* eslint-disable import/prefer-default-export */

const SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';
/* harmony export (immutable) */ __webpack_exports__["a"] = SET_RUNTIME_VARIABLE;


/***/ }),

/***/ "./src/core/createApolloClient/createApolloClient.server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createApolloClient;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_apollo_client__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_apollo_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_apollo_client__);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }





// Execute all GraphQL requests directly without
class ServerInterface {
  constructor(optionsData) {
    this.schema = optionsData.schema;
    this.optionsData = optionsData;
  }

  query({ query, variables, operationName }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        let validationRules = __WEBPACK_IMPORTED_MODULE_0_graphql__["specifiedRules"];
        const customValidationRules = _this.optionsData.validationRules;
        if (customValidationRules) {
          validationRules = validationRules.concat(customValidationRules);
        }

        const validationErrors = __WEBPACK_IMPORTED_MODULE_0_graphql__["validate"](_this.schema, query, validationRules);
        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        const result = yield __WEBPACK_IMPORTED_MODULE_0_graphql__["execute"](_this.schema, query, _this.optionsData.rootValue, _this.optionsData.context, variables, operationName);

        return result;
      } catch (contextError) {
        return { errors: [contextError] };
      }
    })();
  }
}

function createApolloClient(options) {
  return new __WEBPACK_IMPORTED_MODULE_1_apollo_client___default.a({
    reduxRootSelector: state => state.apollo,
    networkInterface: new ServerInterface(options),
    queryDeduplication: true
  });
}

/***/ }),

/***/ "./src/createFetch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function createFetch(fetch, { baseUrl, cookie }) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST', // handy with GraphQL backends
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: _extends({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, cookie ? { Cookie: cookie } : null)
  };

  return (url, options) => url.startsWith('/graphql') || url.startsWith('/api') ? fetch(`${baseUrl}${url}`, _extends({}, defaults, options, {
    headers: _extends({}, defaults.headers, options && options.headers)
  })) : fetch(url, options);
}

/* harmony default export */ __webpack_exports__["a"] = (createFetch);

/***/ }),

/***/ "./src/data/import/csv-import.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_csv__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_csv___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_csv__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_async__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);








class CSVImporter {

  constructor(filePath) {
    this.encoding = 'UTF-8';

    this.filePath = filePath;
  }

  performImport() {
    return this.loadCSV().then(res => new Promise((finish, reject) => {
      const data = this.transformArraytoObject(res);

      let users = [];
      __WEBPACK_IMPORTED_MODULE_2_async__["eachSeries"](data, (item, callback) => {
        if (item['Vorname Läufer 1']) {
          __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].count({
            where: {
              email: item['E-Mail'],
              insert: item.Submitted
            }
          }).then(count => {
            if (count === 0) {
              __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].create({
                email: item['E-Mail'],
                contact_firstName: item.Vorname,
                contact_lastName: item.Name,
                name: item['Name Firma / Verein / Schule o. ä.'] || `${item.Vorname} ${item.Name}`,
                insert: item.Submitted,
                personal: false
              }).then(sponsor => {
                __WEBPACK_IMPORTED_MODULE_5__models_Team__["a" /* default */].create({
                  name: item['Name Firma / Verein / Schule o. ä.'] || `${item.Vorname} ${item.Name}`,
                  sponsor_id: sponsor.id,
                  insert: item.Submitted
                }).then(team => {
                  const runners = [];
                  for (let i = 1; i <= 30; i++) {
                    if (item[`Vorname Läufer ${i}`]) {
                      const runnerConf = {
                        lastName: item[`Name Läufer ${i}`],
                        firstName: item[`Vorname Läufer ${i}`],
                        gender: item[`Geschlecht Läufer ${i}`],
                        birthday: __WEBPACK_IMPORTED_MODULE_6_moment__(item[`Geburtsdatum Läufer ${i}`], 'YYYY-MM-DD').toDate(),
                        team_id: team.id,
                        insert: item.Submitted
                      };
                      runners.push(runnerConf);
                    }
                  }
                  __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].bulkCreate(runners).then(res => {
                    users = runners;
                    callback();
                  }).catch(err => {
                    callback();
                  });
                });
              }).catch(err => {
                callback();
              });
            } else {
              callback();
            }
          });
        } else {
          __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].count({
            where: {
              email: item['E-Mail'],
              insert: item.Submitted
            }
          }).then(count => {
            if (count === 0) {
              __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].create({
                email: item['E-Mail'],
                contact_firstName: item.Vorname,
                contact_lastName: item.Name,
                name: item.Sponsor || `${item.Vorname} ${item.Name}`,
                insert: item.Submitted,
                personal: true
              }).then(sponsor => {
                __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].create({
                  email: item['E-Mail'],
                  lastName: item.Name,
                  firstName: item.Vorname,
                  gender: item.Geschlecht,
                  birthday: __WEBPACK_IMPORTED_MODULE_6_moment__(item[`Geburtsdatum`], 'YYYY-MM-DD').toDate(),
                  sponsor_id: sponsor.id,
                  insert: item.Submitted
                }).then(res => {
                  users.push(res);
                  callback();
                }).catch(err => {
                  callback();
                });
              }).catch(err => {
                callback();
              });
            } else {
              callback();
            }
          });
        }
      }, err => {
        if (err) {
          reject(err);
        } else {
          finish(users);
        }
      });
    }));
  }

  loadCSV() {
    return new Promise((res, rej) => {
      __WEBPACK_IMPORTED_MODULE_0_fs__["readFile"](this.filePath, this.encoding, (err, file) => {
        if (err) {
          rej(err);
          return;
        }
        __WEBPACK_IMPORTED_MODULE_1_csv__["parse"](file, (err, data) => {
          err ? rej(err) : res(data);
        });
      });
    });
  }

  transformArraytoObject(input) {
    if (!input || input.length < 2) {
      return null;
    }

    const keys = input.shift();
    return input.map(row => row.reduce((res, cur, index) => {
      res[keys[index]] = cur.replace(/^\s+|\s+$/g, '');
      return res;
    }, {}));
  }
}

/* harmony default export */ __webpack_exports__["a"] = (CSVImporter);

/***/ }),

/***/ "./src/data/import/import-request.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = postCSVImport;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__csv_import__ = __webpack_require__("./src/data/import/csv-import.js");




function postCSVImport(req, res) {
  console.log(req.files);
  // return res.status(200).send("Success");
  if (!req.files) return res.status(400).send('No files were uploaded.');

  const files = Object.keys(req.files).map(key => req.files[key]);

  let importRes = [];
  __WEBPACK_IMPORTED_MODULE_0_async__["eachSeries"](files, (file, callback) => {
    const filepath = __WEBPACK_IMPORTED_MODULE_1_path__["resolve"](`./import/${new Date().getTime()}_${file.name}`);
    file.mv(filepath, err => {
      if (err) {
        callback(err);
        return;
      }
      const importer = new __WEBPACK_IMPORTED_MODULE_2__csv_import__["a" /* default */](filepath);
      importer.performImport().then(res => {
        importRes = res;
        callback();
      }).catch(err => {
        callback(err);
      });
    });
  }, err => {
    if (err) return res.status(500).send(err);
    res.jsonp(importRes);
  });
}

/***/ }),

/***/ "./src/data/models/Lap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Runner__ = __webpack_require__("./src/data/models/Runner.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const Lap = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('Lap', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  insert: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.DATE,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.NOW
  },

  runner_id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,

    references: {
      // This is a reference to another model
      model: __WEBPACK_IMPORTED_MODULE_2__Runner__["a" /* default */],

      // This is the column name of the referenced model
      key: 'id'
    }
  }
}, {});

/* harmony default export */ __webpack_exports__["a"] = (Lap);

/***/ }),

/***/ "./src/data/models/Runner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Team__ = __webpack_require__("./src/data/models/Team.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const Runner = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('Runner', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  firstName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  lastName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  gender: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(50)
  },

  email: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255),
    validate: { isEmail: true }
  },

  insert: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.DATE,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.NOW
  },

  birthday: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.DATE
  },

  sponsor_amount: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  },

  sponsor_name: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  sponsor_id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,

    references: {
      // This is a reference to another model
      model: __WEBPACK_IMPORTED_MODULE_2__Sponsor__["a" /* default */],

      // This is the column name of the referenced model
      key: 'id',

      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.Deferrable.INITIALLY_IMMEDIATE
    }
  },

  team_id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,

    references: {
      // This is a reference to another model
      model: __WEBPACK_IMPORTED_MODULE_3__Team__["a" /* default */],

      // This is the column name of the referenced model
      key: 'id',

      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.Deferrable.INITIALLY_IMMEDIATE
    }
  },

  number: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.INTEGER,
    unique: true
  }
}, {
  indexes: [{ fields: ['email'] }]
});

/* harmony default export */ __webpack_exports__["a"] = (Runner);

/***/ }),

/***/ "./src/data/models/Sponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const Sponsor = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('Sponsor', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  email: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255),
    validate: { isEmail: true }
  },

  insert: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.DATE,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.NOW
  },

  name: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  contact_firstName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  contact_lastName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  contact_address: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  sponsor_amount: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  },

  personal: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
  },

  cash: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
  },

  donation_receipt: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
  },

  fiftyFifty: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
  }

});

/* harmony default export */ __webpack_exports__["a"] = (Sponsor);

/***/ }),

/***/ "./src/data/models/Team.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const Team = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('Team', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  name: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  sponsor_amount: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  },

  insert: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.DATE,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.NOW
  },

  isSchool: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN
  },

  sponsor_id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    references: {
      // This is a reference to another model
      model: __WEBPACK_IMPORTED_MODULE_2__Sponsor__["a" /* default */],

      // This is the column name of the referenced model
      key: 'id',

      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.Deferrable.INITIALLY_IMMEDIATE
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (Team);

/***/ }),

/***/ "./src/data/models/User.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const User = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('User', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  email: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255),
    validate: { isEmail: true }
  },

  emailConfirmed: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [{ fields: ['email'] }]
});

/* harmony default export */ __webpack_exports__["a"] = (User);

/***/ }),

/***/ "./src/data/models/UserClaim.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserClaim = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserClaim', {
  type: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  },

  value: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserClaim);

/***/ }),

/***/ "./src/data/models/UserLogin.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserLogin = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserLogin', {
  name: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(50),
    primaryKey: true
  },

  key: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100),
    primaryKey: true
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserLogin);

/***/ }),

/***/ "./src/data/models/UserProfile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserProfile = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserProfile', {
  userId: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    primaryKey: true
  },

  displayName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100)
  },

  picture: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  gender: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(50)
  },

  location: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100)
  },

  website: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserProfile);

/***/ }),

/***/ "./src/data/models/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__User__ = __webpack_require__("./src/data/models/User.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UserLogin__ = __webpack_require__("./src/data/models/UserLogin.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UserClaim__ = __webpack_require__("./src/data/models/UserClaim.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UserProfile__ = __webpack_require__("./src/data/models/UserProfile.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__User__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__UserLogin__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__UserClaim__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_4__UserProfile__["a"]; });
/* unused harmony reexport Sponsor */
/* unused harmony reexport Team */
/* unused harmony reexport Runner */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */










__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_2__UserLogin__["a" /* default */], {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_3__UserClaim__["a" /* default */], {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasOne(__WEBPACK_IMPORTED_MODULE_4__UserProfile__["a" /* default */], {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

function sync(...args) {
  return __WEBPACK_IMPORTED_MODULE_0__sequelize__["a" /* default */].sync(...args);
}

/* harmony default export */ __webpack_exports__["e"] = ({ sync });


/***/ }),

/***/ "./src/data/mutations/addLap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerLapsType__ = __webpack_require__("./src/data/types/RunnerLapsType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const addLap = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_RunnerLapsType__["a" /* default */],
  args: { number: { type: new __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLInt"]) } },
  resolve(root, { number }) {
    return __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].findOne({ where: { number } }).then(res => {
      if (res) {
        const before = new Date();
        before.setSeconds(before.getSeconds() - 30);
        return __WEBPACK_IMPORTED_MODULE_2__models_Lap__["a" /* default */].count({
          where: {
            runner_id: res.id,
            insert: {
              $gte: before
            }
          }
        }).then(count => {
          if (count === 0) {
            return __WEBPACK_IMPORTED_MODULE_2__models_Lap__["a" /* default */].create({
              runner_id: res.id
            });
          }
          return {
            runner_id: res.id
          };
        });
      } else {
        return new Error('Kein Läufer gefunden');
      }
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (addLap);

/***/ }),

/***/ "./src/data/mutations/addRunnersToTeam.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__ = __webpack_require__("./src/data/types/SuccessType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const addRunnersToTeam = {
  type: __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__["a" /* default */],
  args: {
    team_id: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]) },
    runner_ids: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"])) }
  },
  resolve(root, { team_id, runner_ids }) {
    return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].update({ team_id }, { where: { id: runner_ids } }).then((affectedCount, affectedRows) => ({
      success: true,
      message: 'Runners updated'
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (addRunnersToTeam);

/***/ }),

/***/ "./src/data/mutations/createPersonalRunner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__ = __webpack_require__("./src/data/types/CreateRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__types_CreatePersonalRunnerInputType__ = __webpack_require__("./src/data/types/CreatePersonalRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__types_CreateSponsorInputType__ = __webpack_require__("./src/data/types/CreateSponsorInputType.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */








const createPersonalRunner = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__["a" /* default */],
  args: { runner: { type: __WEBPACK_IMPORTED_MODULE_3__types_CreatePersonalRunnerInputType__["a" /* default */] } },
  resolve(root, { runner }) {
    const reducer = (res, cur) => {
      res[cur] = runner[cur];
      return res;
    };
    const runnerValues = Object.keys(__WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__["a" /* RunnerInputFields */]).reduce(reducer, {});
    const sponsorValues = Object.keys(__WEBPACK_IMPORTED_MODULE_5__types_CreateSponsorInputType__["a" /* CreateSponsorInputTypeFields */]).reduce(reducer, {
      personal: true
    });
    if (runner.sponsor_email) {
      sponsorValues.email = runner.sponsor_email;
    }
    return __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].create(sponsorValues).then(res => __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].create(_extends({}, runnerValues, { sponsor_id: res.id })));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createPersonalRunner);

/***/ }),

/***/ "./src/data/mutations/createRunner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__ = __webpack_require__("./src/data/types/CreateRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const createRunner = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__["a" /* default */],
  args: { runner: { type: __WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__["b" /* default */] } },
  resolve(root, { runner }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].create(runner);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createRunner);

/***/ }),

/***/ "./src/data/mutations/createSponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_CreateSponsorInputType__ = __webpack_require__("./src/data/types/CreateSponsorInputType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const createSponsor = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_SponsorType__["a" /* default */],
  args: { sponsor: { type: __WEBPACK_IMPORTED_MODULE_2__types_CreateSponsorInputType__["b" /* default */] } },
  resolve(root, { sponsor }) {
    sponsor.personal = false;
    return __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__["a" /* default */].create(sponsor);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createSponsor);

/***/ }),

/***/ "./src/data/mutations/createTeam.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateTeamInputType__ = __webpack_require__("./src/data/types/CreateTeamInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const createTeam = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_TeamType__["a" /* default */],
  args: { team: { type: __WEBPACK_IMPORTED_MODULE_0__types_CreateTeamInputType__["a" /* default */] } },
  resolve(root, { team }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Team__["a" /* default */].create(team);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createTeam);

/***/ }),

/***/ "./src/data/mutations/deleteRunner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__ = __webpack_require__("./src/data/types/SuccessType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const deleteRunner = {
  type: __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__["a" /* default */],
  args: { id: { type: __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"] } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_0__models_Runner__["a" /* default */].destroy({
      where: {
        id
      }
    }).then(affectedRows => ({ success: true, message: affectedRows }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (deleteRunner);

/***/ }),

/***/ "./src/data/mutations/deleteSponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__ = __webpack_require__("./src/data/types/SuccessType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const deleteSponsor = {
  type: __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__["a" /* default */],
  args: { id: { type: __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLString"] } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_0__models_Sponsor__["a" /* default */].destroy({
      where: {
        id
      }
    }).then(affectedRows => ({ success: true, message: affectedRows }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (deleteSponsor);

/***/ }),

/***/ "./src/data/mutations/deleteTeam.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__ = __webpack_require__("./src/data/types/SuccessType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const deleteTeam = {
  type: __WEBPACK_IMPORTED_MODULE_2__types_SuccessType__["a" /* default */],
  args: { id: { type: new __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"]) } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_0__models_Team__["a" /* default */].destroy({
      where: {
        id
      }
    }).then(affectedRows => ({ success: true, message: affectedRows }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (deleteTeam);

/***/ }),

/***/ "./src/data/mutations/removeRunnerFromTeam.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerLapsType__ = __webpack_require__("./src/data/types/RunnerLapsType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__types_TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */







const removeRunnerFromTeam = {
  type: __WEBPACK_IMPORTED_MODULE_4__types_TeamType__["a" /* default */],
  args: {
    team_id: { type: new __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"]) },
    runner_id: { type: new __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"]) }
  },
  resolve(root, { team_id, runner_id }) {
    return __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].findById(runner_id).then(res => res.update({ team_id: null }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (removeRunnerFromTeam);

/***/ }),

/***/ "./src/data/mutations/setTeamSponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const setTeamSponsor = {
  type: __WEBPACK_IMPORTED_MODULE_2__types_TeamType__["a" /* default */],
  args: {
    team_id: { type: new __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"]) },
    sponsor_id: { type: __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLID"] }
  },
  resolve(root, { team_id, sponsor_id }) {
    return __WEBPACK_IMPORTED_MODULE_0__models_Team__["a" /* default */].findById(team_id).then(res => res.update({ sponsor_id }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (setTeamSponsor);

/***/ }),

/***/ "./src/data/mutations/updatePersonalRunner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__ = __webpack_require__("./src/data/types/CreateRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__types_CreatePersonalRunnerInputType__ = __webpack_require__("./src/data/types/CreatePersonalRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__types_CreateSponsorInputType__ = __webpack_require__("./src/data/types/CreateSponsorInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_graphql__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */









const updatePersonalRunner = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__["a" /* default */],
  args: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_6_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_6_graphql__["GraphQLID"]) },
    runner: { type: __WEBPACK_IMPORTED_MODULE_3__types_CreatePersonalRunnerInputType__["a" /* default */] }
  },
  resolve(root, { runner, id }) {
    const reducer = (res, cur) => {
      res[cur] = runner[cur];
      return res;
    };
    const runnerValues = Object.keys(__WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__["a" /* RunnerInputFields */]).reduce(reducer, {});
    const sponsorValues = Object.keys(__WEBPACK_IMPORTED_MODULE_5__types_CreateSponsorInputType__["a" /* CreateSponsorInputTypeFields */]).reduce(reducer, {
      personal: true
    });
    if (sponsorValues.sponsor_email) {
      sponsorValues.email = sponsorValues.sponsor_email;
      delete sponsorValues.sponsor_email;
    }
    return __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].findById(id).then(foundRunner => {
      if (!foundRunner.sponsor_id) {
        return __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].create(sponsorValues).then(res => {
          runnerValues.sponsor_id = res.id;
          return foundRunner.update(_extends({}, runnerValues));
        });
      }
      return __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__["a" /* default */].update(sponsorValues, {
        where: { id: foundRunner.sponsor_id }
      }).then(res => foundRunner.update(_extends({}, runnerValues)));
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (updatePersonalRunner);

/***/ }),

/***/ "./src/data/mutations/updateRunner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__ = __webpack_require__("./src/data/types/CreateRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const createRunner = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerType__["a" /* default */],
  args: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLID"]) },
    runner: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0__types_CreateRunnerInputType__["b" /* default */]) }
  },
  resolve(root, { id, runner }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].findById(id).then(res => res.update(runner));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createRunner);

/***/ }),

/***/ "./src/data/mutations/updateSponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateSponsorInputType__ = __webpack_require__("./src/data/types/CreateSponsorInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const createSponsor = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_SponsorType__["a" /* default */],
  args: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLID"]) },
    sponsor: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0__types_CreateSponsorInputType__["b" /* default */]) }
  },
  resolve(root, { id, sponsor }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__["a" /* default */].findById(id).then(res => res.update(sponsor));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (createSponsor);

/***/ }),

/***/ "./src/data/mutations/updateTeam.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_CreateTeamInputType__ = __webpack_require__("./src/data/types/CreateTeamInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const updateTeam = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_TeamType__["a" /* default */],
  args: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLID"]) },
    team: { type: new __WEBPACK_IMPORTED_MODULE_3_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0__types_CreateTeamInputType__["a" /* default */]) }
  },
  resolve(root, { id, team }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Team__["a" /* default */].findById(id).then(res => res.update(team));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (updateTeam);

/***/ }),

/***/ "./src/data/queries/allRunnerResults.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerListType__ = __webpack_require__("./src/data/types/RunnerListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sequelize__ = __webpack_require__("./src/data/sequelize.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const results = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerListType__["a" /* default */],
  args: {
    sort: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }

  },
  resolve(root, { sort }) {
    const orderBy = sort || '-birthday';
    return __WEBPACK_IMPORTED_MODULE_2__sequelize__["a" /* default */].query(`SELECT
        Runner.*,
        COUNT(Runner.id) as laps,
        cast(strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', datetime(birthday, 'localtime')) as int) as age,
        datetime(birthday, 'localtime') as birthday
FROM Lap LEFT JOIN Runner ON Lap.runner_id = Runner.id
GROUP BY Runner.id
ORDER BY ${orderBy}`).then(results => {
      return {
        runners: results[0].map(row => {
          const runner = Object.keys(row).filter(key => !key.includes('sponsor_')).reduce((res, cur) => {
            res[cur] = row[cur];
            return res;
          }, {});
          return _extends({}, runner);
        })
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (results);

/***/ }),

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
      return {
        available: !result || result.id === runner_id
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (checkNumber);

/***/ }),

/***/ "./src/data/queries/me.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_UserType__ = __webpack_require__("./src/data/types/UserType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const me = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_UserType__["a" /* default */],
  resolve({ request }) {
    return request.user && {
      id: request.user.id,
      email: request.user.email
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (me);

/***/ }),

/***/ "./src/data/queries/news.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_NewsItemType__ = __webpack_require__("./src/data/types/NewsItemType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





// React.js News Feed (RSS)
const url = 'https://api.rss2json.com/v1/api.json' + '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const news = {
  type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_2__types_NewsItemType__["a" /* default */]),
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    if (new Date() - lastFetchTime > 1000 * 60 * 10 /* 10 mins */) {
        lastFetchTime = new Date();
        lastFetchTask = __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default.a(url).then(response => response.json()).then(data => {
          if (data.status === 'ok') {
            items = data.items;
          }

          lastFetchTask = null;
          return items;
        }).catch(err => {
          lastFetchTask = null;
          throw err;
        });

        if (items.length) {
          return items;
        }

        return lastFetchTask;
      }

    return items;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (news);

/***/ }),

/***/ "./src/data/queries/personalResults.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_RunnerListType__ = __webpack_require__("./src/data/types/RunnerListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sequelize__ = __webpack_require__("./src/data/sequelize.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const results = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_RunnerListType__["a" /* default */],
  args: {
    minAge: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    maxAge: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  },
  resolve(root, { minAge, maxAge }) {
    return __WEBPACK_IMPORTED_MODULE_2__sequelize__["a" /* default */].query(`SELECT
        Runner.id as id,
        COUNT(Runner.id) as laps,
        cast(strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', datetime(birthday, 'localtime')) as int) as age,
        datetime(Runner.birthday, 'localtime') as birthday,
        Runner.firstName,
        Runner.lastName,
        Runner.email as email,
        Runner.gender,
        Runner.number,

        Runner.sponsor_amount as sponsor_amount,
        Sponsor.id as sponsor_id,
        Sponsor.email as sponsor_email,
        Sponsor.name as sponsor_name,
        Sponsor.contact_firstName as sponsor_contact_firstName,
        Sponsor.contact_lastName as sponsor_contact_lastName,
        Sponsor.sponsor_amount as sponsor_sponsor_amount,
        Sponsor.donation_receipt as sponsor_donation_receipt
FROM Lap LEFT JOIN Runner ON Lap.runner_id = Runner.id INNER JOIN Sponsor ON Runner.sponsor_id = Sponsor.id
WHERE age >= ${minAge} and age <= ${maxAge} and Runner.sponsor_id NOT NULL
GROUP BY Runner.id
ORDER BY -Laps`).then(results => {
      return {
        runners: results[0].map(row => {
          const runner = Object.keys(row).filter(key => !key.includes('sponsor_')).reduce((res, cur) => {
            res[cur] = row[cur];
            return res;
          }, {});
          const sponsor = Object.keys(row).filter(key => key.includes('sponsor_')).reduce((res, cur) => {
            res[cur.replace('sponsor_', '')] = row[cur];
            return res;
          }, {});
          console.log(sponsor);
          return _extends({}, runner, {
            sponsor_id: sponsor.id,
            sponsor: _extends({}, sponsor, {
              sponsor_amount: row.sponsor_sponsor_amount
            })
          });
        })
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (results);

/***/ }),

/***/ "./src/data/queries/runner.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const runner = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_RunnerType__["a" /* default */],
  args: { id: { type: __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLString"] } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].findById(id);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (runner);

/***/ }),

/***/ "./src/data/queries/runnerLaps.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerLapsType__ = __webpack_require__("./src/data/types/RunnerLapsType.js");
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





const runnerLaps = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_RunnerLapsType__["a" /* default */],
  args: { id: { type: new __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLString"]) } },
  resolve(root, { id }) {
    return {
      runner_id: id
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (runnerLaps);

/***/ }),

/***/ "./src/data/queries/runnerList.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerListType__ = __webpack_require__("./src/data/types/RunnerListType.js");
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





const runnerList = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_RunnerListType__["a" /* default */],
  args: {
    query: { type: __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLString"] }
  },
  resolve(root, { query }) {
    const resultCall = result => ({
      total: result.count,
      runners: result.rows
    });
    if (query && query !== '') {
      return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].findAndCountAll({
        where: {
          sponsor_id: {
            $ne: null
          },
          $or: [{
            firstName: { $like: `%${query}%` }
          }, {
            lastName: { $like: `%${query}%` }
          }, {
            email: { $like: `%${query}%` }
          }]
        }
      }).then(resultCall);
    }
    return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].findAndCountAll({
      where: {
        sponsor_id: {
          $ne: null
        }
      }
    }).then(resultCall);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (runnerList);

/***/ }),

/***/ "./src/data/queries/schoolTeamResults.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_TeamListType__ = __webpack_require__("./src/data/types/TeamListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const results = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_TeamListType__["a" /* default */],
  args: {},
  resolve(root, { min, max }) {

    return __WEBPACK_IMPORTED_MODULE_2__sequelize__["a" /* default */].query(`SELECT Team.*, count(Lap.id) as laps
FROM
	(SELECT count(team_id) as team_size, Team.* FROM Team LEFT JOIN Runner ON Team.id = Runner.team_id GROUP BY team_id ) as Team
	INNER JOIN Runner ON Team.id = Runner.team_id
	INNER JOIN Lap on Runner.id = Lap.runner_id
GROUP BY team_id
HAVING team.isSchool = 1
ORDER BY -laps`).then(results => ({
      teams: results[0].map(row => row)
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (results);

/***/ }),

/***/ "./src/data/queries/sponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
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





const sponsor = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_SponsorType__["a" /* default */],
  args: { id: { type: __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLString"] } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__["a" /* default */].findById(id);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (sponsor);

/***/ }),

/***/ "./src/data/queries/sponsorList.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_SponsorListType__ = __webpack_require__("./src/data/types/SponsorListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const sponsorList = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_SponsorListType__["a" /* default */],
  resolve() {
    return __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__["a" /* default */].findAndCountAll().then(result => ({
      total: result.count,
      sponsors: result.rows
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (sponsorList);

/***/ }),

/***/ "./src/data/queries/team.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const team = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_TeamType__["a" /* default */],
  args: { id: { type: __WEBPACK_IMPORTED_MODULE_1_graphql__["GraphQLString"] } },
  resolve(root, { id }) {
    return __WEBPACK_IMPORTED_MODULE_2__models_Team__["a" /* default */].findById(id);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (team);

/***/ }),

/***/ "./src/data/queries/teamList.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_TeamListType__ = __webpack_require__("./src/data/types/TeamListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const teamList = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_TeamListType__["a" /* default */],
  resolve() {
    return __WEBPACK_IMPORTED_MODULE_1__models_Team__["a" /* default */].findAndCountAll().then(result => {
      return {
        total: result.count,
        teams: result.rows
      };
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (teamList);

/***/ }),

/***/ "./src/data/queries/teamResults.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_TeamListType__ = __webpack_require__("./src/data/types/TeamListType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const results = {
  type: __WEBPACK_IMPORTED_MODULE_1__types_TeamListType__["a" /* default */],
  args: {
    min: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    max: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  },
  resolve(root, { min, max }) {
    const havingArr = [];
    if (min) {
      havingArr.push(`team_size >= ${min}`);
    }
    if (max) {
      havingArr.push(`team_size <= ${max}`);
    }

    const having = havingArr.length ? `HAVING ${havingArr.join(' and ')}` : '';

    return __WEBPACK_IMPORTED_MODULE_2__sequelize__["a" /* default */].query(`SELECT Team.*, count(Lap.id) as laps
FROM 
	(SELECT count(team_id) as team_size, Team.* FROM Team LEFT JOIN Runner ON Team.id = Runner.team_id GROUP BY team_id ) as Team 
	INNER JOIN Runner ON Team.id = Runner.team_id 
	INNER JOIN Lap on Runner.id = Lap.runner_id 
GROUP BY team_id
${having}
ORDER BY -laps`).then(results => ({
      teams: results[0].map(row => row)
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (results);

/***/ }),

/***/ "./src/data/queries/teamRunnerList.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_RunnerListType__ = __webpack_require__("./src/data/types/RunnerListType.js");
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





const teamRunnerList = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_RunnerListType__["a" /* default */],
  args: {
    team_id: { type: new __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLID"]) }
  },
  resolve(root, { team_id }) {
    return __WEBPACK_IMPORTED_MODULE_1__models_Runner__["a" /* default */].findAndCountAll({
      where: { team_id }
    }).then(result => ({
      total: result.count,
      runners: result.rows
    }));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (teamRunnerList);

/***/ }),

/***/ "./src/data/queries/teamSponsor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Team__ = __webpack_require__("./src/data/models/Team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__types_SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const teamSponsor = {
  type: __WEBPACK_IMPORTED_MODULE_3__types_SponsorType__["a" /* default */],
  args: {
    team_id: { type: new __WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_2_graphql__["GraphQLID"]) }
  },
  resolve(root, { team_id }) {
    return __WEBPACK_IMPORTED_MODULE_0__models_Team__["a" /* default */].findById(team_id).then(result => __WEBPACK_IMPORTED_MODULE_1__models_Sponsor__["a" /* default */].findById(result.sponsor_id));
  }
};

/* harmony default export */ __webpack_exports__["a"] = (teamSponsor);

/***/ }),

/***/ "./src/data/schema.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__queries_runnerList__ = __webpack_require__("./src/data/queries/runnerList.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__queries_runner__ = __webpack_require__("./src/data/queries/runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__queries_news__ = __webpack_require__("./src/data/queries/news.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queries_me__ = __webpack_require__("./src/data/queries/me.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mutations_createRunner__ = __webpack_require__("./src/data/mutations/createRunner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__queries_sponsor__ = __webpack_require__("./src/data/queries/sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__queries_sponsorList__ = __webpack_require__("./src/data/queries/sponsorList.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__mutations_createSponsor__ = __webpack_require__("./src/data/mutations/createSponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__mutations_deleteRunner__ = __webpack_require__("./src/data/mutations/deleteRunner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__mutations_deleteSponsor__ = __webpack_require__("./src/data/mutations/deleteSponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__mutations_updateRunner__ = __webpack_require__("./src/data/mutations/updateRunner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__mutations_updateSponsor__ = __webpack_require__("./src/data/mutations/updateSponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__queries_runnerLaps__ = __webpack_require__("./src/data/queries/runnerLaps.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__mutations_addLap__ = __webpack_require__("./src/data/mutations/addLap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__queries_checkNumber__ = __webpack_require__("./src/data/queries/checkNumber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__mutations_createTeam__ = __webpack_require__("./src/data/mutations/createTeam.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__mutations_updateTeam__ = __webpack_require__("./src/data/mutations/updateTeam.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__mutations_deleteTeam__ = __webpack_require__("./src/data/mutations/deleteTeam.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__mutations_createPersonalRunner__ = __webpack_require__("./src/data/mutations/createPersonalRunner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__mutations_updatePersonalRunner__ = __webpack_require__("./src/data/mutations/updatePersonalRunner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__queries_team__ = __webpack_require__("./src/data/queries/team.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__queries_teamList__ = __webpack_require__("./src/data/queries/teamList.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__queries_teamRunnerList__ = __webpack_require__("./src/data/queries/teamRunnerList.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__mutations_addRunnersToTeam__ = __webpack_require__("./src/data/mutations/addRunnersToTeam.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__mutations_removeRunnerFromTeam__ = __webpack_require__("./src/data/mutations/removeRunnerFromTeam.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__queries_teamSponsor__ = __webpack_require__("./src/data/queries/teamSponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__mutations_setTeamSponsor__ = __webpack_require__("./src/data/mutations/setTeamSponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__queries_personalResults__ = __webpack_require__("./src/data/queries/personalResults.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__queries_teamResults__ = __webpack_require__("./src/data/queries/teamResults.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__queries_allRunnerResults__ = __webpack_require__("./src/data/queries/allRunnerResults.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__queries_schoolTeamResults__ = __webpack_require__("./src/data/queries/schoolTeamResults.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */


































const schema = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLSchema"]({
  query: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
    name: 'Query',
    fields: {
      news: __WEBPACK_IMPORTED_MODULE_3__queries_news__["a" /* default */],
      me: __WEBPACK_IMPORTED_MODULE_4__queries_me__["a" /* default */],
      runnerList: __WEBPACK_IMPORTED_MODULE_1__queries_runnerList__["a" /* default */],
      runner: __WEBPACK_IMPORTED_MODULE_2__queries_runner__["a" /* default */],
      sponsor: __WEBPACK_IMPORTED_MODULE_6__queries_sponsor__["a" /* default */],
      sponsorList: __WEBPACK_IMPORTED_MODULE_7__queries_sponsorList__["a" /* default */],
      team: __WEBPACK_IMPORTED_MODULE_21__queries_team__["a" /* default */],
      teamList: __WEBPACK_IMPORTED_MODULE_22__queries_teamList__["a" /* default */],
      runnerLaps: __WEBPACK_IMPORTED_MODULE_13__queries_runnerLaps__["a" /* default */],
      checkNumber: __WEBPACK_IMPORTED_MODULE_15__queries_checkNumber__["a" /* default */],
      teamRunnerList: __WEBPACK_IMPORTED_MODULE_23__queries_teamRunnerList__["a" /* default */],
      teamSponsor: __WEBPACK_IMPORTED_MODULE_26__queries_teamSponsor__["a" /* default */],
      personalResults: __WEBPACK_IMPORTED_MODULE_28__queries_personalResults__["a" /* default */],
      teamResults: __WEBPACK_IMPORTED_MODULE_29__queries_teamResults__["a" /* default */],
      allRunnerResults: __WEBPACK_IMPORTED_MODULE_30__queries_allRunnerResults__["a" /* default */],
      schoolTeamResults: __WEBPACK_IMPORTED_MODULE_31__queries_schoolTeamResults__["a" /* default */]
    }
  }),
  mutation: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
    name: 'Mutation',
    fields: {
      createRunner: __WEBPACK_IMPORTED_MODULE_5__mutations_createRunner__["a" /* default */],
      updateRunner: __WEBPACK_IMPORTED_MODULE_11__mutations_updateRunner__["a" /* default */],
      deleteRunner: __WEBPACK_IMPORTED_MODULE_9__mutations_deleteRunner__["a" /* default */],
      createSponsor: __WEBPACK_IMPORTED_MODULE_8__mutations_createSponsor__["a" /* default */],
      deleteSponsor: __WEBPACK_IMPORTED_MODULE_10__mutations_deleteSponsor__["a" /* default */],
      updateSponsor: __WEBPACK_IMPORTED_MODULE_12__mutations_updateSponsor__["a" /* default */],
      createTeam: __WEBPACK_IMPORTED_MODULE_16__mutations_createTeam__["a" /* default */],
      updateTeam: __WEBPACK_IMPORTED_MODULE_17__mutations_updateTeam__["a" /* default */],
      deleteTeam: __WEBPACK_IMPORTED_MODULE_18__mutations_deleteTeam__["a" /* default */],
      addLap: __WEBPACK_IMPORTED_MODULE_14__mutations_addLap__["a" /* default */],
      createPersonalRunner: __WEBPACK_IMPORTED_MODULE_19__mutations_createPersonalRunner__["a" /* default */],
      updatePersonalRunner: __WEBPACK_IMPORTED_MODULE_20__mutations_updatePersonalRunner__["a" /* default */],
      addRunnersToTeam: __WEBPACK_IMPORTED_MODULE_24__mutations_addRunnersToTeam__["a" /* default */],
      removeRunnerFromTeam: __WEBPACK_IMPORTED_MODULE_25__mutations_removeRunnerFromTeam__["a" /* default */],
      setTeamSponsor: __WEBPACK_IMPORTED_MODULE_27__mutations_setTeamSponsor__["a" /* default */]
    }
  })
});

/* harmony default export */ __webpack_exports__["a"] = (schema);

/***/ }),

/***/ "./src/data/sequelize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__config__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const sequelize = new __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a(__WEBPACK_IMPORTED_MODULE_1__config___default.a.databaseUrl, {
  define: {
    freezeTableName: true
  }
});

/* harmony default export */ __webpack_exports__["a"] = (sequelize);

/***/ }),

/***/ "./src/data/types/CheckNumberType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const CheckNumberType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'CheckNumberType',
  fields: {
    available: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (CheckNumberType);

/***/ }),

/***/ "./src/data/types/CreatePersonalRunnerInputType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CreateRunnerInputType__ = __webpack_require__("./src/data/types/CreateRunnerInputType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CreateSponsorInputType__ = __webpack_require__("./src/data/types/CreateSponsorInputType.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





const RunnerWithSponsorInput = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInputObjectType"]({
  name: 'RunnerWithSponsorInput',
  fields: _extends({}, __WEBPACK_IMPORTED_MODULE_1__CreateRunnerInputType__["a" /* RunnerInputFields */], __WEBPACK_IMPORTED_MODULE_2__CreateSponsorInputType__["a" /* CreateSponsorInputTypeFields */], {
    name: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  })
});

/* harmony default export */ __webpack_exports__["a"] = (RunnerWithSponsorInput);

/***/ }),

/***/ "./src/data/types/CreateRunnerInputType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const RunnerInputFields = {
  gender: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
  firstName: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
  lastName: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
  birthday: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
  email: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  number: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
  sponsor_id: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"] },
  team_id: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"] }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = RunnerInputFields;


const CreateRunnerInputType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInputObjectType"]({
  name: 'RunnerInput',
  fields: RunnerInputFields
});

/* harmony default export */ __webpack_exports__["b"] = (CreateRunnerInputType);

/***/ }),

/***/ "./src/data/types/CreateSponsorInputType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */


const CreateSponsorInputTypeFields = {
  email: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  sponsor_email: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  name: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  contact_firstName: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  contact_lastName: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  contact_address: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  sponsor_amount: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  private: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
  cash: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
  donation_receipt: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
  fiftyFifty: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = CreateSponsorInputTypeFields;


const CreateSponsorInputType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInputObjectType"]({
  name: 'SponsorInput',
  fields: CreateSponsorInputTypeFields
});

/* harmony default export */ __webpack_exports__["b"] = (CreateSponsorInputType);

/***/ }),

/***/ "./src/data/types/CreateTeamInputType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const CreateTeamInputType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInputObjectType"]({
  name: 'TeamInput',
  fields: {
    name: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    sponsor_id: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    sponsor_amount: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLFloat"] },
    isSchool: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (CreateTeamInputType);

/***/ }),

/***/ "./src/data/types/LapTimeType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const LapTimeType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'LapTime',
  fields: {
    index: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"]),
      resolve: res => res.index
    },
    time: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => res.time
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (LapTimeType);

/***/ }),

/***/ "./src/data/types/NewsItemType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const NewsItemType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'NewsItem',
  fields: {
    title: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    link: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    author: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    pubDate: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    content: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (NewsItemType);

/***/ }),

/***/ "./src/data/types/RunnerLapsType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






const RunnerLapsType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'RunnerLaps',
  fields: {
    count: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => __WEBPACK_IMPORTED_MODULE_3__models_Lap__["a" /* default */].count({ where: { runner_id: res.runner_id } })
    },
    runner: {
      type: __WEBPACK_IMPORTED_MODULE_1__RunnerType__["a" /* default */],
      resolve: res => __WEBPACK_IMPORTED_MODULE_2__models_Runner__["a" /* default */].findById(res.runner_id)
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (RunnerLapsType);

/***/ }),

/***/ "./src/data/types/RunnerListType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RunnerType__ = __webpack_require__("./src/data/types/RunnerType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const RunnerListType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'RunnerList',
  fields: {
    total: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    runners: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_1__RunnerType__["a" /* default */])
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (RunnerListType);

/***/ }),

/***/ "./src/data/types/RunnerType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LapTimeType__ = __webpack_require__("./src/data/types/LapTimeType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
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
    age: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => Math.floor(__WEBPACK_IMPORTED_MODULE_5_moment__(new Date()).diff(__WEBPACK_IMPORTED_MODULE_5_moment__(res.birthday), 'years', true))
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
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.sponsor_amount
    },
    laps: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => {
        if (res.laps) {
          return res.laps;
        }
        return __WEBPACK_IMPORTED_MODULE_4__models_Lap__["a" /* default */].count({ where: { runner_id: res.id } }).then(count => count);
      }
    },
    sponsor: {
      type: __WEBPACK_IMPORTED_MODULE_1__SponsorType__["a" /* default */],
      resolve: res => {
        if (res.sponsor) {
          return res.sponsor;
        }
        return __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__["a" /* default */].findById(res.sponsor_id);
      }
    },
    number: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => res.number
    },
    lapTimes: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_3__LapTimeType__["a" /* default */]),
      resolve: res => {
        return __WEBPACK_IMPORTED_MODULE_4__models_Lap__["a" /* default */].findAll({ where: { runner_id: res.id }, order: [['insert', 'ASC']] }).then(list => {
          const times = list.map((lap, index) => {
            if (index < list.length - 1) {
              return {
                index: index + 1,
                time: __WEBPACK_IMPORTED_MODULE_5_moment__(list[index + 1].insert).diff(__WEBPACK_IMPORTED_MODULE_5_moment__(lap.insert))
              };
            } else {
              return null;
            }
          }).filter(item => item && item.time !== 0);

          return times;
          // const sorted = _.sortBy(times, 'time');
          // console.log(sorted);
          // return _.first(sorted).time;
        });
      }
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (RunnerType);

/***/ }),

/***/ "./src/data/types/SponsorListType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const SponsorListType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'SponsorList',
  fields: {
    total: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    sponsors: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_1__SponsorType__["a" /* default */])
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (SponsorListType);

/***/ }),

/***/ "./src/data/types/SponsorType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const SponsorType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'Sponsor',
  fields: {
    id: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]),
      resolve: res => res.id
    },
    name: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.name
    },
    email: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.email
    },
    contact_firstName: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.contact_firstName
    },
    contact_lastName: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.contact_lastName
    },
    contact_address: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.contact_address
    },
    sponsor_amount: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.sponsor_amount
    },
    personal: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"],
      resolve: res => res.personal
    },

    cash: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"],
      resolve: res => res.cash
    },

    donation_receipt: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"],
      resolve: res => res.donation_receipt
    },

    fiftyFifty: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"],
      resolve: res => res.fiftyFifty
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (SponsorType);

/***/ }),

/***/ "./src/data/types/SuccessType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const SuccessType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'Success',
  fields: {
    success: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
    message: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (SuccessType);

/***/ }),

/***/ "./src/data/types/TeamListType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TeamType__ = __webpack_require__("./src/data/types/TeamType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const TeamListType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'TeamList',
  fields: {
    total: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    teams: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_1__TeamType__["a" /* default */])
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (TeamListType);

/***/ }),

/***/ "./src/data/types/TeamType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SponsorType__ = __webpack_require__("./src/data/types/SponsorType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */








const TeamType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'Team',
  fields: {
    id: {
      type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]),
      resolve: res => res.id
    },
    name: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.name
    },
    sponsor: {
      type: __WEBPACK_IMPORTED_MODULE_1__SponsorType__["a" /* default */],
      resolve: res => __WEBPACK_IMPORTED_MODULE_2__models_Sponsor__["a" /* default */].findById(res.sponsor_id)
    },
    isSchool: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"],
      resolve: res => res.isSchool
    },
    laps: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => {
        if (res.laps) {
          return res.laps;
        }
        return __WEBPACK_IMPORTED_MODULE_3__sequelize__["a" /* default */].query(`SELECT count(*) as count FROM Lap LEFT JOIN Runner ON Lap.runner_id = Runner.id WHERE Runner.team_id = '${res.id}'`).then(results => {
          if (results.length && results[0].length) {
            return results[0][0].count;
          }
          return null;
        });
      }
    },
    team_size: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => {
        if (res.team_size) {
          return res.team_size;
        }
        return __WEBPACK_IMPORTED_MODULE_5__models_Runner__["a" /* default */].count({ where: { team_id: res.id } });
      }
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (TeamType);

/***/ }),

/***/ "./src/data/types/UserType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const UserType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'User',
  fields: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]) },
    email: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserType);

/***/ }),

/***/ "./src/passport.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_facebook__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_facebook___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport_facebook__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_models__ = __webpack_require__("./src/data/models/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__config__);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */






/**
 * Sign in with Facebook.
 */
__WEBPACK_IMPORTED_MODULE_0_passport___default.a.use(new __WEBPACK_IMPORTED_MODULE_1_passport_facebook__["Strategy"]({
  clientID: __WEBPACK_IMPORTED_MODULE_3__config___default.a.auth.facebook.id,
  clientSecret: __WEBPACK_IMPORTED_MODULE_3__config___default.a.auth.facebook.secret,
  callbackURL: '/login/facebook/return',
  profileFields: ['displayName', 'name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  /* eslint-disable no-underscore-dangle */
  const loginName = 'facebook';
  const claimType = 'urn:facebook:access_token';
  const fooBar = (() => {
    var _ref = _asyncToGenerator(function* () {
      if (req.user) {
        const userLogin = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */].findOne({
          attributes: ['name', 'key'],
          where: { name: loginName, key: profile.id }
        });
        if (userLogin) {
          // There is already a Facebook account that belongs to you.
          // Sign in with that account or delete it, then link it with your current account.
          done();
        } else {
          const user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].create({
            id: req.user.id,
            email: profile._json.email,
            logins: [{ name: loginName, key: profile.id }],
            claims: [{ type: claimType, value: profile.id }],
            profile: {
              displayName: profile.displayName,
              gender: profile._json.gender,
              picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
            }
          }, {
            include: [{ model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */], as: 'logins' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["b" /* UserClaim */], as: 'claims' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["d" /* UserProfile */], as: 'profile' }]
          });
          done(null, {
            id: user.id,
            email: user.email
          });
        }
      } else {
        const users = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].findAll({
          attributes: ['id', 'email'],
          where: { '$logins.name$': loginName, '$logins.key$': profile.id },
          include: [{
            attributes: ['name', 'key'],
            model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */],
            as: 'logins',
            required: true
          }]
        });
        if (users.length) {
          const user = users[0].get({ plain: true });
          done(null, user);
        } else {
          let user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].findOne({
            where: { email: profile._json.email }
          });
          if (user) {
            // There is already an account using this email address. Sign in to
            // that account and link it with Facebook manually from Account Settings.
            done(null);
          } else {
            user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].create({
              email: profile._json.email,
              emailConfirmed: true,
              logins: [{ name: loginName, key: profile.id }],
              claims: [{ type: claimType, value: accessToken }],
              profile: {
                displayName: profile.displayName,
                gender: profile._json.gender,
                picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
              }
            }, {
              include: [{ model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */], as: 'logins' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["b" /* UserClaim */], as: 'claims' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["d" /* UserProfile */], as: 'profile' }]
            });
            done(null, {
              id: user.id,
              email: user.email
            });
          }
        }
      }
    });

    return function fooBar() {
      return _ref.apply(this, arguments);
    };
  })();

  fooBar().catch(done);
}));

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_passport___default.a);

/***/ }),

/***/ "./src/reducers/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = createRootReducer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user__ = __webpack_require__("./src/reducers/user.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__runtime__ = __webpack_require__("./src/reducers/runtime.js");




function createRootReducer({ apolloClient }) {
  return __WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"]({
    apollo: apolloClient.reducer(),
    user: __WEBPACK_IMPORTED_MODULE_1__user__["a" /* default */],
    runtime: __WEBPACK_IMPORTED_MODULE_2__runtime__["a" /* default */]
  });
}

/***/ }),

/***/ "./src/reducers/runtime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = runtime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__("./src/constants/index.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



function runtime(state = {}, action) {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* SET_RUNTIME_VARIABLE */]:
      return _extends({}, state, {
        [action.payload.name]: action.payload.value
      });
    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = user;
function user(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

/***/ }),

/***/ "./src/requests/generate-qrcodes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = generateQRCodes;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qrcode__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qrcode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_qrcode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_async__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_html_pdf__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_html_pdf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_html_pdf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_base64_img__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_base64_img___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_base64_img__);








function generateQRCodes(req, res) {
  const options = { format: 'Letter' };
  const html = __WEBPACK_IMPORTED_MODULE_1_fs__["readFileSync"](__WEBPACK_IMPORTED_MODULE_2_path__["resolve"]('./src/requests/qr-code-sheet-template.html'), 'utf8');
  const filepath = __WEBPACK_IMPORTED_MODULE_2_path__["resolve"](`./tmp/${new Date().getTime()}_qrcodes.pdf`);

  const codes = [];
  for (let i = 100; i < 1000; i++) {
    codes.push({
      text: `${i}`
    });
  }

  __WEBPACK_IMPORTED_MODULE_3_async__["eachSeries"](codes, (code, callback) => {
    __WEBPACK_IMPORTED_MODULE_0_qrcode__["drawSvg"](code.text, {
      errorCorrectionLevel: 'H'
    }, (err, svgCode) => {
      if (err) {
        callback(err);
        return;
      }

      const codepath = __WEBPACK_IMPORTED_MODULE_2_path__["resolve"](`./tmp/qrcode_${code.text}.svg`);
      if (!__WEBPACK_IMPORTED_MODULE_1_fs__["existsSync"](codepath)) {
        __WEBPACK_IMPORTED_MODULE_1_fs__["writeFile"](codepath, svgCode, error => {
          code.image = codepath;
          callback(error);
        });
      } else {
        code.image = codepath;
        callback();
      }
    });
  }, err => {
    if (err) return res.status(500).send(err);

    // const logoBase64 = base64img.base64Sync(
    //   path.resolve(`./public/unicef_logo.jpg`),
    // );
    // console.log(logoBase64);
    const template = __WEBPACK_IMPORTED_MODULE_5_lodash__["template"](html);
    const assetPath = `file://${__WEBPACK_IMPORTED_MODULE_2_path__["resolve"]('./')}/`;
    __WEBPACK_IMPORTED_MODULE_4_html_pdf__["create"](template({ codes }), {
      base: assetPath,
      timeout: 60000
    }).toFile(filepath, (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendFile(filepath);
    });
  });
}

/***/ }),

/***/ "./src/router.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_universal_router__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_universal_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_universal_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__("./src/routes/index.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




/* harmony default export */ __webpack_exports__["default"] = (new __WEBPACK_IMPORTED_MODULE_0_universal_router___default.a(__WEBPACK_IMPORTED_MODULE_1__routes__["a" /* default */], {
  resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route.load().then(action => action.default(context, params));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return null;
  }
}));

/***/ }),

/***/ "./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {


    var content = __webpack_require__("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css");
    var insertCss = __webpack_require__("./node_modules/isomorphic-style-loader/lib/insertCss.js");

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    module.exports = content.locals || {};
    module.exports._getContent = function() { return content; };
    module.exports._getCss = function() { return content.toString(); };
    module.exports._insertCss = function(options) { return insertCss(content, options) };
    
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
      module.hot.accept("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css", function() {
        content = __webpack_require__("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css");

        if (typeof content === 'string') {
          content = [[module.i, content, '']];
        }

        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  

/***/ }),

/***/ "./src/routes/error/ErrorPage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ErrorPage_css__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ErrorPage_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ErrorPage_css__);
var _jsxFileName = '/Developer/Projects/lap-counter/lap-counter-react/src/routes/error/ErrorPage.js';
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






class ErrorPage extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.Component {

  render() {
    if (true && this.props.error) {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'h1',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            },
            __self: this
          },
          this.props.error.name
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'pre',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 35
            },
            __self: this
          },
          this.props.error.stack
        )
      );
    }

    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'h1',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 44
          },
          __self: this
        },
        'Error'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'p',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 45
          },
          __self: this
        },
        'Sorry, a critical error occurred on this page.'
      )
    );
  }
}

ErrorPage.propTypes = {
  error: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    name: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    message: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    stack: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
  })
};
ErrorPage.defaultProps = {
  error: null
};

/* harmony default export */ __webpack_exports__["b"] = (__WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles___default.a(__WEBPACK_IMPORTED_MODULE_3__ErrorPage_css___default.a)(ErrorPage));

/***/ }),

/***/ "./src/routes/error/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ErrorPage__ = __webpack_require__("./src/routes/error/ErrorPage.js");
var _jsxFileName = '/Developer/Projects/lap-counter/lap-counter-react/src/routes/error/index.js';
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




function action() {
  return {
    title: 'Demo Error',
    component: __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__ErrorPage__["b" /* default */], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16
      },
      __self: this
    })
  };
}

/* harmony default export */ __webpack_exports__["default"] = (action);

/***/ }),

/***/ "./src/routes/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [{
    path: '/',
    load: () => __webpack_require__.e/* import() */(3).then(__webpack_require__.bind(null, "./src/routes/home/index.js"))
  }, {
    path: '/contact',
    load: () => __webpack_require__.e/* import() */(9).then(__webpack_require__.bind(null, "./src/routes/contact/index.js"))
  }, {
    path: '/login',
    load: () => __webpack_require__.e/* import() */(8).then(__webpack_require__.bind(null, "./src/routes/login/index.js"))
  }, {
    path: '/register',
    load: () => __webpack_require__.e/* import() */(6).then(__webpack_require__.bind(null, "./src/routes/register/index.js"))
  }, {
    path: '/about',
    load: () => __webpack_require__.e/* import() */(5).then(__webpack_require__.bind(null, "./src/routes/about/index.js"))
  }, {
    path: '/privacy',
    load: () => __webpack_require__.e/* import() */(4).then(__webpack_require__.bind(null, "./src/routes/privacy/index.js"))
  }, {
    path: '/import',
    load: () => __webpack_require__.e/* import() */(12).then(__webpack_require__.bind(null, "./src/routes/import/index.js"))
  }, {
    path: '/runners',
    load: () => __webpack_require__.e/* import() */(10).then(__webpack_require__.bind(null, "./src/routes/runners/index.js"))
  }, {
    path: '/runners/create',
    load: () => __webpack_require__.e/* import() */(2).then(__webpack_require__.bind(null, "./src/routes/runners/create.js"))
  }, {
    path: '/runners/:id',
    load: () => __webpack_require__.e/* import() */(1).then(__webpack_require__.bind(null, "./src/routes/runners/update.js"))
  }, {
    path: '/sponsors',
    load: () => __webpack_require__.e/* import() */(11).then(__webpack_require__.bind(null, "./src/routes/sponsors/index.js"))
  }, {
    path: '/sponsors/create',
    load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/sponsors/create.js"))
  },
  // Wildcard routes, e.g. { path: '*', ... } (must go last)
  {
    path: '*',
    load: () => __webpack_require__.e/* import() */(7).then(__webpack_require__.bind(null, "./src/routes/not-found/index.js"))
  }],

  action({ next }) {
    return _asyncToGenerator(function* () {
      // Execute each child route until one of them return the result
      const route = yield next();

      // Provide default values for title, description etc.
      route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
      route.description = route.description || '';

      return route;
    })();
  }
};

// The error page is available by permanent url for development mode
if (true) {
  routes.children.unshift({
    path: '/error',
    action: __webpack_require__("./src/routes/error/index.js").default
  });
}

/* harmony default export */ __webpack_exports__["a"] = (routes);

/***/ }),

/***/ "./src/server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cookie_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_express_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_express_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_node_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_apollo__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_apollo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_react_apollo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_pretty_error__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_pretty_error___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_pretty_error__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_createApolloClient__ = __webpack_require__("./src/core/createApolloClient/createApolloClient.server.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_App__ = __webpack_require__("./src/components/App.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_Html__ = __webpack_require__("./src/components/Html.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__routes_error_ErrorPage__ = __webpack_require__("./src/routes/error/ErrorPage.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__routes_error_ErrorPage_css__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__routes_error_ErrorPage_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__routes_error_ErrorPage_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__createFetch__ = __webpack_require__("./src/createFetch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__passport__ = __webpack_require__("./src/passport.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__router__ = __webpack_require__("./src/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__data_models__ = __webpack_require__("./src/data/models/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__data_schema__ = __webpack_require__("./src/data/schema.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__assets_json__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__assets_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__assets_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__store_configureStore__ = __webpack_require__("./src/store/configureStore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__actions_runtime__ = __webpack_require__("./src/actions/runtime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_26__config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__data_import_import_request__ = __webpack_require__("./src/data/import/import-request.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_express_fileupload__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_express_fileupload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28_express_fileupload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__requests_generate_qrcodes__ = __webpack_require__("./src/requests/generate-qrcodes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__simulator__ = __webpack_require__("./src/simulator.js");
var _jsxFileName = '/Developer/Projects/lap-counter/lap-counter-react/src/server.js',
    _this = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new __WEBPACK_IMPORTED_MODULE_1_bluebird___default.a(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return __WEBPACK_IMPORTED_MODULE_1_bluebird___default.a.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
























 // eslint-disable-line import/no-unresolved








const app = __WEBPACK_IMPORTED_MODULE_2_express___default.a();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(__WEBPACK_IMPORTED_MODULE_2_express___default.a.static(__WEBPACK_IMPORTED_MODULE_0_path___default.a.resolve(__dirname, 'public')));
app.use(__WEBPACK_IMPORTED_MODULE_3_cookie_parser___default.a());
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.urlencoded({ extended: true }));
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(__WEBPACK_IMPORTED_MODULE_5_express_jwt___default.a({
  secret: __WEBPACK_IMPORTED_MODULE_26__config___default.a.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}));
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof __WEBPACK_IMPORTED_MODULE_5_express_jwt__["UnauthorizedError"]) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(__WEBPACK_IMPORTED_MODULE_19__passport__["a" /* default */].initialize());

if (true) {
  app.enable('trust proxy');
}
// const simulator = new LapSimulator();
// simulator.start();


app.get('/generate-qrcodes', __WEBPACK_IMPORTED_MODULE_29__requests_generate_qrcodes__["a" /* default */]);
app.get('/login/facebook', __WEBPACK_IMPORTED_MODULE_19__passport__["a" /* default */].authenticate('facebook', {
  scope: ['email', 'user_location'],
  session: false
}));
app.get('/login/facebook/return', __WEBPACK_IMPORTED_MODULE_19__passport__["a" /* default */].authenticate('facebook', {
  failureRedirect: '/login',
  session: false
}), (req, res) => {
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken___default.a.sign(req.user, __WEBPACK_IMPORTED_MODULE_26__config___default.a.auth.jwt.secret, { expiresIn });
  res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
  res.redirect('/');
});
app.use(__WEBPACK_IMPORTED_MODULE_28_express_fileupload__());
app.post('/upload', __WEBPACK_IMPORTED_MODULE_27__data_import_import_request__["a" /* postCSVImport */]);

//
// Register API middleware
// -----------------------------------------------------------------------------
const graphqlMiddleware = __WEBPACK_IMPORTED_MODULE_6_express_graphql___default.a(req => ({
  schema: __WEBPACK_IMPORTED_MODULE_22__data_schema__["a" /* default */],
  graphiql: true,
  rootValue: { request: req },
  pretty: true
}));

app.use('/graphql', graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', (() => {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    try {
      const css = new Set();

      const apolloClient = __WEBPACK_IMPORTED_MODULE_13__core_createApolloClient__["a" /* default */]({
        schema: __WEBPACK_IMPORTED_MODULE_22__data_schema__["a" /* default */],
        rootValue: { request: req }
      });

      // Universal HTTP client
      const fetch = __WEBPACK_IMPORTED_MODULE_18__createFetch__["a" /* default */](__WEBPACK_IMPORTED_MODULE_8_node_fetch___default.a, {
        baseUrl: __WEBPACK_IMPORTED_MODULE_26__config___default.a.api.serverUrl,
        cookie: req.headers.cookie,
        apolloClient
      });

      const initialState = {
        user: req.user || null
      };

      const store = __WEBPACK_IMPORTED_MODULE_24__store_configureStore__["a" /* default */](initialState, {
        cookie: req.headers.cookie,
        apolloClient,
        fetch,
        // I should not use `history` on server.. but how I do redirection? follow universal-router
        history: null
      });

      store.dispatch(__WEBPACK_IMPORTED_MODULE_25__actions_runtime__["a" /* setRuntimeVariable */]({
        name: 'initialNow',
        value: Date.now()
      }));

      // Global (context) variables that can be easily accessed from any React component
      // https://facebook.github.io/react/docs/context.html
      const context = {
        // Enables critical path CSS rendering
        // https://github.com/kriasoft/isomorphic-style-loader
        insertCss: function (...styles) {
          // eslint-disable-next-line no-underscore-dangle
          console.log(styles);
          styles.forEach(function (style) {
            return css.add(style._getCss());
          });
        },
        fetch,
        // You can access redux through react-redux connect
        store,
        storeSubscription: null,
        // Apollo Client for use with react-apollo
        client: apolloClient
      };

      const route = yield __WEBPACK_IMPORTED_MODULE_20__router__["default"].resolve(_extends({}, context, {
        path: req.path,
        query: req.query
      }));

      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect);
        return;
      }

      const data = _extends({}, route);

      const rootComponent = __WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_14__components_App__["a" /* default */],
        { context: context, store: store, __source: {
            fileName: _jsxFileName,
            lineNumber: 195
          },
          __self: _this
        },
        route.component
      );
      yield __WEBPACK_IMPORTED_MODULE_11_react_apollo__["getDataFromTree"](rootComponent);
      // this is here because of Apollo redux APOLLO_QUERY_STOP action
      yield __WEBPACK_IMPORTED_MODULE_1_bluebird___default.a.delay(0);
      data.children = yield __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToString(rootComponent);
      data.styles = [{ id: 'css', cssText: [...css].join('') }];

      data.scripts = [__WEBPACK_IMPORTED_MODULE_23__assets_json___default.a.vendor.js];
      if (route.chunks) {
        data.scripts.push(...route.chunks.map(function (chunk) {
          return __WEBPACK_IMPORTED_MODULE_23__assets_json___default.a[chunk].js;
        }));
      }
      data.scripts.push(__WEBPACK_IMPORTED_MODULE_23__assets_json___default.a.client.js);

      // Furthermore invoked actions will be ignored, client will not receive them!
      if (true) {
        // eslint-disable-next-line no-console
        console.log('Serializing store...');
      }
      data.app = {
        apiUrl: __WEBPACK_IMPORTED_MODULE_26__config___default.a.api.clientUrl,
        state: context.store.getState()
      };

      const html = __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToStaticMarkup(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_15__components_Html__["a" /* default */], _extends({}, data, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 221
        },
        __self: _this
      })));
      res.status(route.status || 200);
      res.send(`<!doctype html>${html}`);
    } catch (err) {
      next(err);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new __WEBPACK_IMPORTED_MODULE_12_pretty_error___default.a();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToStaticMarkup(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_15__components_Html__["a" /* default */],
    {
      title: 'Internal Server Error',
      description: err.message,
      styles: [{ id: 'css', cssText: __WEBPACK_IMPORTED_MODULE_17__routes_error_ErrorPage_css___default.a._getCss() }] // eslint-disable-line no-underscore-dangle
      , __source: {
        fileName: _jsxFileName,
        lineNumber: 240
      },
      __self: _this
    },
    __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToString(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_16__routes_error_ErrorPage__["a" /* ErrorPageWithoutStyle */], { error: err, __source: {
        fileName: _jsxFileName,
        lineNumber: 245
      },
      __self: _this
    }))
  ));
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = __WEBPACK_IMPORTED_MODULE_21__data_models__["e" /* default */].sync().catch(err => console.error(err.stack));
if (false) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (true) {
  app.hot = module.hot;
  module.hot.accept("./src/router.js", function() { /* harmony import */ __WEBPACK_IMPORTED_MODULE_20__router__ = __webpack_require__("./src/router.js");  });
}

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./src/simulator.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_models_Lap__ = __webpack_require__("./src/data/models/Lap.js");



class LapSimulator {
  constructor() {}

  start() {
    __WEBPACK_IMPORTED_MODULE_0__data_models_Runner__["a" /* default */].findAll().then(res => {
      this.interval = setInterval(() => {
        const max = res.length - 1;
        const min = 0;
        const index = this.getRandomInt(min, max);
        const runner = res[index];
        console.log('Add Lap', runner.id, index);
        __WEBPACK_IMPORTED_MODULE_1__data_models_Lap__["a" /* default */].create({
          runner_id: runner.id
        });
      }, 1000);
    });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  stop() {
    if (this.interval) {
      this.interval.cancel();
    }
  }
}

/* unused harmony default export */ var _unused_webpack_default_export = (LapSimulator);

/***/ }),

/***/ "./src/store/configureStore.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = configureStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reducers__ = __webpack_require__("./src/reducers/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__createHelpers__ = __webpack_require__("./src/store/createHelpers.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__logger__ = __webpack_require__("./src/store/logger/logger.server.js");






function configureStore(initialState, config) {
  const helpers = __WEBPACK_IMPORTED_MODULE_3__createHelpers__["a" /* default */](config);
  const { apolloClient } = config;

  const middleware = [__WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a.withExtraArgument(helpers), apolloClient.middleware()];

  let enhancer;

  if (true) {
    middleware.push(__WEBPACK_IMPORTED_MODULE_4__logger__["a" /* default */]());

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f;
    if (false) {
      devToolsExtension = window.devToolsExtension();
    }

    enhancer = __WEBPACK_IMPORTED_MODULE_0_redux__["compose"](__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"](...middleware), devToolsExtension);
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const rootReducer = __WEBPACK_IMPORTED_MODULE_2__reducers__["default"]({
    apolloClient
  });

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = __WEBPACK_IMPORTED_MODULE_0_redux__["createStore"](rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (true) {
    module.hot.accept("./src/reducers/index.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_2__reducers__ = __webpack_require__("./src/reducers/index.js"); (() =>
    // eslint-disable-next-line global-require
    store.replaceReducer(__webpack_require__("./src/reducers/index.js").default))(__WEBPACK_OUTDATED_DEPENDENCIES__); });
  }

  return store;
}

/***/ }),

/***/ "./src/store/createHelpers.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createHelpers;
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const graphqlRequestDeprecatedMessage = `\`graphqlRequest\` has been deprecated.
You should use Apollo: \`client.query({ query, variables...})\` or \`client.mutate()\`
Don't forget to enclose your query to gql\`…\` tag or import *.graphql file.
See docs at http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient\\.query`;

function createGraphqlRequest(apolloClient) {
  return (() => {
    var _ref = _asyncToGenerator(function* (queryOrString, variables, options = {}) {
      if (true) {
        // eslint-disable-next-line no-console
        console.error(graphqlRequestDeprecatedMessage);
      }

      const { skipCache } = options;
      let query = queryOrString;
      if (typeof queryOrString === 'string') {
        const gql = yield new Promise(function(resolve) { resolve(); }).then((function (require) {
          return __webpack_require__(12);
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
        query = gql([queryOrString]);
      }

      if (skipCache) {
        return apolloClient.networkInterface.query({ query, variables });
      }

      let isMutation = false;
      if (query.definitions) {
        isMutation = query.definitions.some(function (definition) {
          return definition && definition.operation === 'mutation';
        });
      }
      if (isMutation) {
        return apolloClient.mutate({ mutation: query, variables });
      }
      return apolloClient.query({ query, variables });
    });

    function graphqlRequest(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return graphqlRequest;
  })();
}

function createHelpers({ apolloClient, fetch, history }) {
  return {
    client: apolloClient,
    history,
    fetch,
    // @deprecated('Use `client` instead')
    apolloClient,
    // @deprecated('Use `client.query()` or `client.mutate()` instead')
    graphqlRequest: createGraphqlRequest(fetch)
  };
}

/***/ }),

/***/ "./src/store/logger/logger.server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createLogger;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_util__);


function inspectObject(object) {
  return __WEBPACK_IMPORTED_MODULE_0_util__["inspect"](object, {
    colors: true
  });
}

function singleLine(str) {
  return str.replace(/\s+/g, ' ');
}

const actionFormatters = {
  // This is used at feature/apollo branch, but it can help you when implementing Apollo
  APOLLO_QUERY_INIT: a => `queryId:${a.queryId} variables:${inspectObject(a.variables)}\n   ${singleLine(a.queryString)}`,

  APOLLO_QUERY_RESULT: a => `queryId:${a.queryId}\n   ${singleLine(inspectObject(a.result))}`,

  APOLLO_QUERY_STOP: a => `queryId:${a.queryId}`
};

// Server side redux action logger
function createLogger() {
  // eslint-disable-next-line no-unused-vars
  return store => next => action => {
    let formattedPayload = '';
    const actionFormatter = actionFormatters[action.type];
    if (typeof actionFormatter === 'function') {
      formattedPayload = actionFormatter(action);
    } else if (action.toString !== Object.prototype.toString) {
      formattedPayload = action.toString();
    } else if (typeof action.payload !== 'undefined') {
      formattedPayload = inspectObject(action.payload);
    } else {
      formattedPayload = inspectObject(action);
    }

    console.log(` * ${action.type}: ${formattedPayload}`); // eslint-disable-line no-console
    return next(action);
  };
}

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),

/***/ 10:
/***/ (function(module, exports) {

module.exports = require("isomorphic-style-loader/lib/withStyles");

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = require("react-apollo");

/***/ }),

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(14);
module.exports = __webpack_require__("./src/server.js");


/***/ }),

/***/ 14:
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("express-graphql");

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),

/***/ 26:
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),

/***/ 32:
/***/ (function(module, exports) {

module.exports = require("universal-router");

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

module.exports = require("./assets.json");

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

module.exports = require("csv");

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

module.exports = require("express-fileupload");

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

module.exports = require("qrcode");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = require("html-pdf");

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = require("base64-img");

/***/ }),

/***/ 42:
/***/ (function(module, exports) {

module.exports = require("antd");

/***/ }),

/***/ 43:
/***/ (function(module, exports) {

module.exports = require("history/createBrowserHistory");

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = require("numeral");

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3dlYnBhY2svYm9vdHN0cmFwIDFmM2JlYmNkNTgwMmQwYTIzN2YwIiwid2VicGFjazovLy8uL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzcz82YWM2IiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvYWN0aW9ucy9ydW50aW1lLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvY29tcG9uZW50cy9BcHAuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb21wb25lbnRzL0h0bWwuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb25maWcuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb25zdGFudHMvaW5kZXguanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb3JlL2NyZWF0ZUFwb2xsb0NsaWVudC9jcmVhdGVBcG9sbG9DbGllbnQuc2VydmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvY3JlYXRlRmV0Y2guanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL2ltcG9ydC9jc3YtaW1wb3J0LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9pbXBvcnQvaW1wb3J0LXJlcXVlc3QuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9MYXAuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9SdW5uZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9TcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tb2RlbHMvVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbW9kZWxzL1VzZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyQ2xhaW0uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyTG9naW4uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyUHJvZmlsZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbW9kZWxzL2luZGV4LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvYWRkTGFwLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvYWRkUnVubmVyc1RvVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVBlcnNvbmFsUnVubmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlUnVubmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlU3BvbnNvci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVRlYW0uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy9kZWxldGVSdW5uZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy9kZWxldGVTcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvZGVsZXRlVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3JlbW92ZVJ1bm5lckZyb21UZWFtLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvc2V0VGVhbVNwb25zb3IuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy91cGRhdGVQZXJzb25hbFJ1bm5lci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVJ1bm5lci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVNwb25zb3IuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy91cGRhdGVUZWFtLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL2FsbFJ1bm5lclJlc3VsdHMuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvY2hlY2tOdW1iZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvbWUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvbmV3cy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy9wZXJzb25hbFJlc3VsdHMuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvcnVubmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3J1bm5lckxhcHMuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvcnVubmVyTGlzdC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy9zY2hvb2xUZWFtUmVzdWx0cy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy9zcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3Nwb25zb3JMaXN0LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3RlYW0uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvdGVhbUxpc3QuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvdGVhbVJlc3VsdHMuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvdGVhbVJ1bm5lckxpc3QuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvdGVhbVNwb25zb3IuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3NjaGVtYS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvc2VxdWVsaXplLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9DaGVja051bWJlclR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL0NyZWF0ZVBlcnNvbmFsUnVubmVySW5wdXRUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9DcmVhdGVSdW5uZXJJbnB1dFR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL0NyZWF0ZVRlYW1JbnB1dFR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL0xhcFRpbWVUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9OZXdzSXRlbVR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1J1bm5lckxhcHNUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9SdW5uZXJMaXN0VHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvUnVubmVyVHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvU3BvbnNvckxpc3RUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9TcG9uc29yVHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvU3VjY2Vzc1R5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1RlYW1MaXN0VHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvVGVhbVR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1VzZXJUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcGFzc3BvcnQuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9yZWR1Y2Vycy9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JlZHVjZXJzL3J1bnRpbWUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9yZWR1Y2Vycy91c2VyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcmVxdWVzdHMvZ2VuZXJhdGUtcXJjb2Rlcy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9lcnJvci9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3NlcnZlci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3NpbXVsYXRvci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvc3RvcmUvY3JlYXRlSGVscGVycy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3N0b3JlL2xvZ2dlci9sb2dnZXIuc2VydmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImdyYXBocWxcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJzZXF1ZWxpemVcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlc1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInJlYWN0LWFwb2xsb1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImdyYXBocWwtdGFnXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYmFiZWwtcG9seWZpbGxcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJibHVlYmlyZFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImV4cHJlc3NcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJjb29raWUtcGFyc2VyXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJleHByZXNzLWp3dFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInJlYWN0XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiZXhwcmVzcy1ncmFwaHFsXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwibm9kZS1mZXRjaFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInJlYWN0LWRvbS9zZXJ2ZXJcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJwcmV0dHktZXJyb3JcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJhcG9sbG8tY2xpZW50XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicmVhY3QtcmVkdXhcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeVwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicHJvcC10eXBlc1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInBhc3Nwb3J0XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicGFzc3BvcnQtZmFjZWJvb2tcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJ1bml2ZXJzYWwtcm91dGVyXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiaXNvbW9ycGhpYy1mZXRjaFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcIi4vYXNzZXRzLmpzb25cIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJyZWR1eC10aHVua1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInV0aWxcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJjc3ZcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJleHByZXNzLWZpbGV1cGxvYWRcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJxcmNvZGVcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJwYXRoXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiaHRtbC1wZGZcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJiYXNlNjQtaW1nXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYW50ZFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImhpc3RvcnkvY3JlYXRlQnJvd3Nlckhpc3RvcnlcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJudW1lcmFsXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYXN5bmNcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJtb21lbnRcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJyZWR1eFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImZzXCIiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwidXBkYXRlcy9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR0cnkge1xyXG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJ1cGRhdGVzL1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XHJcbiBcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiBcdFx0fVxyXG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHsgLy9lc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjFmM2JlYmNkNTgwMmQwYTIzN2YwXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHRmb3IodmFyIGNodW5rSWQgaW4gaW5zdGFsbGVkQ2h1bmtzKVxyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDEzOiAwXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCkge1xuIFx0XHQvLyBcIjBcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSAwKSB7XG4gXHRcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vY2h1bmtzL1wiICsgKHtcIjBcIjpcInNwb25zb3JzLWNyZWF0ZVwiLFwiMVwiOlwicnVubmVycy11cGRhdGVcIixcIjJcIjpcInJ1bm5lcnMtY3JlYXRlXCIsXCIzXCI6XCJob21lXCIsXCI0XCI6XCJwcml2YWN5XCIsXCI1XCI6XCJhYm91dFwiLFwiNlwiOlwicmVnaXN0ZXJcIixcIjdcIjpcIm5vdC1mb3VuZFwiLFwiOFwiOlwibG9naW5cIixcIjlcIjpcImNvbnRhY3RcIixcIjEwXCI6XCJydW5uZXJzXCIsXCIxMVwiOlwic3BvbnNvcnNcIixcIjEyXCI6XCJpbXBvcnRcIn1bY2h1bmtJZF18fGNodW5rSWQpICsgXCIuanNcIik7XG4gXHRcdFx0dmFyIG1vcmVNb2R1bGVzID0gY2h1bmsubW9kdWxlcywgY2h1bmtJZHMgPSBjaHVuay5pZHM7XG4gXHRcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0lkcy5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gdW5jYXRjaGVkIGVycm9yIGhhbmRsZXIgZm9yIHdlYnBhY2sgcnVudGltZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vZSA9IGZ1bmN0aW9uKGVycikge1xuIFx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuIFx0XHRcdHRocm93IGVycjsgLy8gY2F0Y2ggdGhpcyBlcnJvciBieSB1c2luZyBTeXN0ZW0uaW1wb3J0KCkuY2F0Y2goKVxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMTMpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxZjNiZWJjZDU4MDJkMGEyMzdmMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKipcXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXFxuICpcXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXFxuICpcXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtcGFjazogY2VudGVyO1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDAgMzJweDtcXG4gIHBhZGRpbmc6IDAgMnJlbTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICM4ODg7XFxufVxcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG5oMSB7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgY29sb3I6ICM1NTU7XFxufVxcblxcbnByZSB7XFxuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7Ozs7Ozs7R0FPRzs7QUFFSDtFQUNFLHFCQUFxQjtFQUNyQixxQkFBcUI7RUFDckIsY0FBYztFQUNkLDBCQUEwQjtNQUN0Qix1QkFBdUI7VUFDbkIsb0JBQW9CO0VBQzVCLHlCQUF5QjtNQUNyQixzQkFBc0I7VUFDbEIsd0JBQXdCO0VBQ2hDLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixtQkFBbUI7RUFDbkIsWUFBWTtDQUNiOztBQUVEO0VBQ0UsVUFBVTtDQUNYOztBQUVEO0VBQ0UsaUJBQWlCO0VBQ2pCLFlBQVk7Q0FDYjs7QUFFRDtFQUNFLHNCQUFzQjtFQUN0QixpQkFBaUI7Q0FDbEJcIixcImZpbGVcIjpcIkVycm9yUGFnZS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyoqXFxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxcbiAqXFxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbiAqXFxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXFxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDMycHg7XFxuICBwYWRkaW5nOiAwIDJyZW07XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAjNTU1O1xcbn1cXG5cXG5wcmUge1xcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlLFwibW9kdWxlc1wiOnRydWUsXCJsb2NhbElkZW50TmFtZVwiOlwiW25hbWVdLVtsb2NhbF0tW2hhc2g6YmFzZTY0OjVdXCIsXCJtaW5pbWl6ZVwiOmZhbHNlLFwiZGlzY2FyZENvbW1lbnRzXCI6e1wicmVtb3ZlQWxsXCI6dHJ1ZX19IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJjb25maWdcIjp7XCJwYXRoXCI6XCIuL3Rvb2xzL3Bvc3Rjc3MuY29uZmlnLmpzXCJ9fSEuL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWUsXCJtb2R1bGVzXCI6dHJ1ZSxcImxvY2FsSWRlbnROYW1lXCI6XCJbbmFtZV0tW2xvY2FsXS1baGFzaDpiYXNlNjQ6NV1cIixcIm1pbmltaXplXCI6ZmFsc2UsXCJkaXNjYXJkQ29tbWVudHNcIjp7XCJyZW1vdmVBbGxcIjp0cnVlfX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzP3tcImNvbmZpZ1wiOntcInBhdGhcIjpcIi4vdG9vbHMvcG9zdGNzcy5jb25maWcuanNcIn19IS4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9zdHJpbmdpZnkgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnknKTtcblxudmFyIF9zdHJpbmdpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5KTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5Jyk7XG5cbnZhciBfc2xpY2VkVG9BcnJheTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZWRUb0FycmF5Mik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogSXNvbW9ycGhpYyBDU1Mgc3R5bGUgbG9hZGVyIGZvciBXZWJwYWNrXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTUtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcHJlZml4ID0gJ3MnO1xudmFyIGluc2VydGVkID0ge307XG5cbi8vIEJhc2U2NCBlbmNvZGluZyBhbmQgZGVjb2RpbmcgLSBUaGUgXCJVbmljb2RlIFByb2JsZW1cIlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd0Jhc2U2NC9CYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5nI1RoZV9Vbmljb2RlX1Byb2JsZW1cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgcDEpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICB9KSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHN0eWxlL2xpbmsgZWxlbWVudHMgZm9yIHNwZWNpZmllZCBub2RlIElEc1xuICogaWYgdGhleSBhcmUgbm8gbG9uZ2VyIHJlZmVyZW5jZWQgYnkgVUkgY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ3NzKGlkcykge1xuICBpZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoLS1pbnNlcnRlZFtpZF0gPD0gMCkge1xuICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXggKyBpZCk7XG4gICAgICBpZiAoZWxlbSkge1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBFeGFtcGxlOlxuICogICAvLyBJbnNlcnQgQ1NTIHN0eWxlcyBvYmplY3QgZ2VuZXJhdGVkIGJ5IGBjc3MtbG9hZGVyYCBpbnRvIERPTVxuICogICB2YXIgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKFtbMSwgJ2JvZHkgeyBjb2xvcjogcmVkOyB9J11dKTtcbiAqXG4gKiAgIC8vIFJlbW92ZSBpdCBmcm9tIHRoZSBET01cbiAqICAgcmVtb3ZlQ3NzKCk7XG4gKi9cbmZ1bmN0aW9uIGluc2VydENzcyhzdHlsZXMpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgX3JlZiRyZXBsYWNlID0gX3JlZi5yZXBsYWNlLFxuICAgICAgcmVwbGFjZSA9IF9yZWYkcmVwbGFjZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJHJlcGxhY2UsXG4gICAgICBfcmVmJHByZXBlbmQgPSBfcmVmLnByZXBlbmQsXG4gICAgICBwcmVwZW5kID0gX3JlZiRwcmVwZW5kID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkcHJlcGVuZDtcblxuICB2YXIgaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9zdHlsZXMkaSA9ICgwLCBfc2xpY2VkVG9BcnJheTMuZGVmYXVsdCkoc3R5bGVzW2ldLCA0KSxcbiAgICAgICAgbW9kdWxlSWQgPSBfc3R5bGVzJGlbMF0sXG4gICAgICAgIGNzcyA9IF9zdHlsZXMkaVsxXSxcbiAgICAgICAgbWVkaWEgPSBfc3R5bGVzJGlbMl0sXG4gICAgICAgIHNvdXJjZU1hcCA9IF9zdHlsZXMkaVszXTtcblxuICAgIHZhciBpZCA9IG1vZHVsZUlkICsgJy0nICsgaTtcblxuICAgIGlkcy5wdXNoKGlkKTtcblxuICAgIGlmIChpbnNlcnRlZFtpZF0pIHtcbiAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICBpbnNlcnRlZFtpZF0rKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0ZWRbaWRdID0gMTtcblxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4ICsgaWQpO1xuICAgIHZhciBjcmVhdGUgPSBmYWxzZTtcblxuICAgIGlmICghZWxlbSkge1xuICAgICAgY3JlYXRlID0gdHJ1ZTtcblxuICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgZWxlbS5pZCA9IHByZWZpeCArIGlkO1xuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjc3NUZXh0ID0gY3NzO1xuICAgIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHNraXAgSUU5IGFuZCBiZWxvdywgc2VlIGh0dHA6Ly9jYW5pdXNlLmNvbS9hdG9iLWJ0b2FcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArIGI2NEVuY29kZVVuaWNvZGUoKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHNvdXJjZU1hcCkpICsgJyovJztcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VVUkw9JyArIHNvdXJjZU1hcC5maWxlICsgJz8nICsgaWQgKyAnKi8nO1xuICAgIH1cblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgfVxuXG4gICAgaWYgKGNyZWF0ZSkge1xuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlbW92ZUNzcy5iaW5kKG51bGwsIGlkcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3NzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQgKi9cblxuaW1wb3J0IHsgU0VUX1JVTlRJTUVfVkFSSUFCTEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UnVudGltZVZhcmlhYmxlKHsgbmFtZSwgdmFsdWUgfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNFVF9SVU5USU1FX1ZBUklBQkxFLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICB9LFxuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hY3Rpb25zL3J1bnRpbWUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgUHJvdmlkZXIgYXMgUmVkdXhQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY29uc3QgQ29udGV4dFR5cGUgPSB7XG4gIC8vIEVuYWJsZXMgY3JpdGljYWwgcGF0aCBDU1MgcmVuZGVyaW5nXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlhc29mdC9pc29tb3JwaGljLXN0eWxlLWxvYWRlclxuICBpbnNlcnRDc3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIC8vIFVuaXZlcnNhbCBIVFRQIGNsaWVudFxuICBmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgLy8gSW50ZWdyYXRlIFJlZHV4XG4gIC8vIGh0dHA6Ly9yZWR1eC5qcy5vcmcvZG9jcy9iYXNpY3MvVXNhZ2VXaXRoUmVhY3QuaHRtbFxuICAuLi5SZWR1eFByb3ZpZGVyLmNoaWxkQ29udGV4dFR5cGVzLFxuICAvLyBBcG9sbG8gQ2xpZW50XG4gIGNsaWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuLyoqXG4gKiBUaGUgdG9wLWxldmVsIFJlYWN0IGNvbXBvbmVudCBzZXR0aW5nIGNvbnRleHQgKGdsb2JhbCkgdmFyaWFibGVzXG4gKiB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBmcm9tIGFsbCB0aGUgY2hpbGQgY29tcG9uZW50cy5cbiAqXG4gKiBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL2NvbnRleHQuaHRtbFxuICpcbiAqIFVzYWdlIGV4YW1wbGU6XG4gKlxuICogICBjb25zdCBjb250ZXh0ID0ge1xuICogICAgIGhpc3Rvcnk6IGNyZWF0ZUJyb3dzZXJIaXN0b3J5KCksXG4gKiAgICAgc3RvcmU6IGNyZWF0ZVN0b3JlKCksXG4gKiAgIH07XG4gKlxuICogICBSZWFjdERPTS5yZW5kZXIoXG4gKiAgICAgPEFwcCBjb250ZXh0PXtjb250ZXh0fT5cbiAqICAgICAgIDxMYXlvdXQ+XG4gKiAgICAgICAgIDxMYW5kaW5nUGFnZSAvPlxuICogICAgICAgPC9MYXlvdXQ+XG4gKiAgICAgPC9BcHA+LFxuICogICAgIGNvbnRhaW5lcixcbiAqICAgKTtcbiAqL1xuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29udGV4dDogUHJvcFR5cGVzLnNoYXBlKENvbnRleHRUeXBlKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRpYyBjaGlsZENvbnRleHRUeXBlcyA9IENvbnRleHRUeXBlO1xuXG4gIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIE5PVEU6IElmIHlvdSBuZWVkIHRvIGFkZCBvciBtb2RpZnkgaGVhZGVyLCBmb290ZXIgZXRjLiBvZiB0aGUgYXBwLFxuICAgIC8vIHBsZWFzZSBkbyB0aGF0IGluc2lkZSB0aGUgTGF5b3V0IGNvbXBvbmVudC5cbiAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvQXBwLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzZXJpYWxpemUgZnJvbSAnc2VyaWFsaXplLWphdmFzY3JpcHQnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kYW5nZXIgKi9cblxuY2xhc3MgSHRtbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHN0eWxlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBjc3NUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICksXG4gICAgc2NyaXB0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkKSxcbiAgICBhcHA6IFByb3BUeXBlcy5vYmplY3QsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc3R5bGVzOiBbXSxcbiAgICBzY3JpcHRzOiBbXSxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIHN0eWxlcywgc2NyaXB0cywgYXBwLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGh0bWwgY2xhc3NOYW1lPVwibm8tanNcIiBsYW5nPVwiZW5cIj5cbiAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgPG1ldGEgY2hhclNldD1cInV0Zi04XCIgLz5cbiAgICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJ4LXVhLWNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiIC8+XG4gICAgICAgICAgPHRpdGxlPlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgIDwvdGl0bGU+XG4gICAgICAgICAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD17ZGVzY3JpcHRpb259IC8+XG4gICAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xXCIgLz5cbiAgICAgICAgICB7c2NyaXB0cy5tYXAoc2NyaXB0ID0+XG4gICAgICAgICAgICA8bGluayBrZXk9e3NjcmlwdH0gcmVsPVwicHJlbG9hZFwiIGhyZWY9e3NjcmlwdH0gYXM9XCJzY3JpcHRcIiAvPixcbiAgICAgICAgICApfVxuICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiAvPlxuICAgICAgICAgIHtzdHlsZXMubWFwKHN0eWxlID0+XG4gICAgICAgICAgICA8c3R5bGVcbiAgICAgICAgICAgICAga2V5PXtzdHlsZS5pZH1cbiAgICAgICAgICAgICAgaWQ9e3N0eWxlLmlkfVxuICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHN0eWxlLmNzc1RleHQgfX1cbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICl9XG4gICAgICAgIDwvaGVhZD5cbiAgICAgICAgPGJvZHk+XG4gICAgICAgICAgPGRpdiBpZD1cImFwcFwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogY2hpbGRyZW4gfX0gLz5cbiAgICAgICAgICA8c2NyaXB0XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGB3aW5kb3cuQXBwPSR7c2VyaWFsaXplKGFwcCl9YCB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3NjcmlwdHMubWFwKHNjcmlwdCA9PiA8c2NyaXB0IGtleT17c2NyaXB0fSBzcmM9e3NjcmlwdH0gLz4pfVxuICAgICAgICAgIHtjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWQgJiZcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tcbiAgICAgICAgICAgICAgICBfX2h0bWw6XG4gICAgICAgICAgICAgICAgICAnd2luZG93LmdhPWZ1bmN0aW9uKCl7Z2EucS5wdXNoKGFyZ3VtZW50cyl9O2dhLnE9W107Z2EubD0rbmV3IERhdGU7JyArXG4gICAgICAgICAgICAgICAgICBgZ2EoJ2NyZWF0ZScsJyR7Y29uZmlnLmFuYWx5dGljc1xuICAgICAgICAgICAgICAgICAgICAuZ29vZ2xlVHJhY2tpbmdJZH0nLCdhdXRvJyk7Z2EoJ3NlbmQnLCdwYWdldmlldycpYCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+fVxuICAgICAgICAgIHtjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWQgJiZcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzXCJcbiAgICAgICAgICAgICAgYXN5bmNcbiAgICAgICAgICAgICAgZGVmZXJcbiAgICAgICAgICAgIC8+fVxuICAgICAgICA8L2JvZHk+XG4gICAgICA8L2h0bWw+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIdG1sO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL0h0bWwuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaWYgKHByb2Nlc3MuZW52LkJST1dTRVIpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdEbyBub3QgaW1wb3J0IGBjb25maWcuanNgIGZyb20gaW5zaWRlIHRoZSBjbGllbnQtc2lkZSBjb2RlLicsXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBOb2RlLmpzIGFwcFxuICBwb3J0OiBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDAsXG5cbiAgLy8gQVBJIEdhdGV3YXlcbiAgYXBpOiB7XG4gICAgLy8gQVBJIFVSTCB0byBiZSB1c2VkIGluIHRoZSBjbGllbnQtc2lkZSBjb2RlXG4gICAgY2xpZW50VXJsOiBwcm9jZXNzLmVudi5BUElfQ0xJRU5UX1VSTCB8fCAnJyxcbiAgICAvLyBBUEkgVVJMIHRvIGJlIHVzZWQgaW4gdGhlIHNlcnZlci1zaWRlIGNvZGVcbiAgICBzZXJ2ZXJVcmw6XG4gICAgICBwcm9jZXNzLmVudi5BUElfU0VSVkVSX1VSTCB8fFxuICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDB9YCxcbiAgfSxcblxuICAvLyBEYXRhYmFzZVxuICBkYXRhYmFzZVVybDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMIHx8ICdzcWxpdGU6ZGF0YWJhc2Uuc3FsaXRlJyxcblxuICAvLyBXZWIgYW5hbHl0aWNzXG4gIGFuYWx5dGljczoge1xuICAgIC8vIGh0dHBzOi8vYW5hbHl0aWNzLmdvb2dsZS5jb20vXG4gICAgZ29vZ2xlVHJhY2tpbmdJZDogcHJvY2Vzcy5lbnYuR09PR0xFX1RSQUNLSU5HX0lELCAvLyBVQS1YWFhYWC1YXG4gIH0sXG5cbiAgLy8gQXV0aGVudGljYXRpb25cbiAgYXV0aDoge1xuICAgIGp3dDogeyBzZWNyZXQ6IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ1JlYWN0IFN0YXJ0ZXIgS2l0JyB9LFxuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9cbiAgICBmYWNlYm9vazoge1xuICAgICAgaWQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX0FQUF9JRCB8fCAnMTg2MjQ0NTUxNzQ1NjMxJyxcbiAgICAgIHNlY3JldDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX1NFQ1JFVCB8fCAnYTk3MGFlMzI0MGFiNGI5YjhhYWUwZjlmMDY2MWM2ZmMnLFxuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vY29uc29sZS9wcm9qZWN0XG4gICAgZ29vZ2xlOiB7XG4gICAgICBpZDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCB8fFxuICAgICAgICAnMjUxNDEwNzMwNTUwLWFoY2cwb3U1bWdmaGw4aGx1aTF1cnJ1N2puNXMxMmttLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcbiAgICAgIHNlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQgfHwgJ1k4eVI5eVpBaG05alE4RktBTDhRSUVjZCcsXG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vYXBwcy50d2l0dGVyLmNvbS9cbiAgICB0d2l0dGVyOiB7XG4gICAgICBrZXk6IHByb2Nlc3MuZW52LlRXSVRURVJfQ09OU1VNRVJfS0VZIHx8ICdJZTIwQVp2TEpJMmxRRDVEc2d4Z2phdW5zJyxcbiAgICAgIHNlY3JldDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuVFdJVFRFUl9DT05TVU1FUl9TRUNSRVQgfHxcbiAgICAgICAgJ0tUWjZjeG9LbkVha1FDZVNwWmxhVUNKV0dBbFRFQkpqMHkyRU1rVUJ1akE3eldTdmFRJyxcbiAgICB9LFxuICB9LFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29uZmlnLmpzIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xuXG5leHBvcnQgY29uc3QgU0VUX1JVTlRJTUVfVkFSSUFCTEUgPSAnU0VUX1JVTlRJTUVfVkFSSUFCTEUnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb25zdGFudHMvaW5kZXguanMiLCJpbXBvcnQgeyB2YWxpZGF0ZSwgZXhlY3V0ZSwgc3BlY2lmaWVkUnVsZXMgfSBmcm9tICdncmFwaHFsJztcblxuaW1wb3J0IEFwb2xsb0NsaWVudCBmcm9tICdhcG9sbG8tY2xpZW50JztcblxuLy8gRXhlY3V0ZSBhbGwgR3JhcGhRTCByZXF1ZXN0cyBkaXJlY3RseSB3aXRob3V0XG5jbGFzcyBTZXJ2ZXJJbnRlcmZhY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zRGF0YSkge1xuICAgIHRoaXMuc2NoZW1hID0gb3B0aW9uc0RhdGEuc2NoZW1hO1xuICAgIHRoaXMub3B0aW9uc0RhdGEgPSBvcHRpb25zRGF0YTtcbiAgfVxuXG4gIGFzeW5jIHF1ZXJ5KHsgcXVlcnksIHZhcmlhYmxlcywgb3BlcmF0aW9uTmFtZSB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCB2YWxpZGF0aW9uUnVsZXMgPSBzcGVjaWZpZWRSdWxlcztcbiAgICAgIGNvbnN0IGN1c3RvbVZhbGlkYXRpb25SdWxlcyA9IHRoaXMub3B0aW9uc0RhdGEudmFsaWRhdGlvblJ1bGVzO1xuICAgICAgaWYgKGN1c3RvbVZhbGlkYXRpb25SdWxlcykge1xuICAgICAgICB2YWxpZGF0aW9uUnVsZXMgPSB2YWxpZGF0aW9uUnVsZXMuY29uY2F0KGN1c3RvbVZhbGlkYXRpb25SdWxlcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZSh0aGlzLnNjaGVtYSwgcXVlcnksIHZhbGlkYXRpb25SdWxlcyk7XG4gICAgICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yczogdmFsaWRhdGlvbkVycm9ycyB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKFxuICAgICAgICB0aGlzLnNjaGVtYSxcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHRoaXMub3B0aW9uc0RhdGEucm9vdFZhbHVlLFxuICAgICAgICB0aGlzLm9wdGlvbnNEYXRhLmNvbnRleHQsXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3BlcmF0aW9uTmFtZSxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoY29udGV4dEVycm9yKSB7XG4gICAgICByZXR1cm4geyBlcnJvcnM6IFtjb250ZXh0RXJyb3JdIH07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUFwb2xsb0NsaWVudChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQXBvbGxvQ2xpZW50KHtcbiAgICByZWR1eFJvb3RTZWxlY3Rvcjogc3RhdGUgPT4gc3RhdGUuYXBvbGxvLFxuICAgIG5ldHdvcmtJbnRlcmZhY2U6IG5ldyBTZXJ2ZXJJbnRlcmZhY2Uob3B0aW9ucyksXG4gICAgcXVlcnlEZWR1cGxpY2F0aW9uOiB0cnVlLFxuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29yZS9jcmVhdGVBcG9sbG9DbGllbnQvY3JlYXRlQXBvbGxvQ2xpZW50LnNlcnZlci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogQGZsb3cgKi9cblxudHlwZSBGZXRjaCA9ICh1cmw6IHN0cmluZywgb3B0aW9uczogP2FueSkgPT4gUHJvbWlzZTxhbnk+O1xuXG50eXBlIE9wdGlvbnMgPSB7XG4gIGJhc2VVcmw6IHN0cmluZyxcbiAgY29va2llPzogc3RyaW5nLFxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBhcm91bmQgdGhlIEhUTUw1IEZldGNoIEFQSSB0aGF0IHByb3ZpZGVzXG4gKiBkZWZhdWx0IGFyZ3VtZW50cyB0byBmZXRjaCguLi4pIGFuZCBpcyBpbnRlbmRlZCB0byByZWR1Y2UgdGhlIGFtb3VudFxuICogb2YgYm9pbGVycGxhdGUgY29kZSBpbiB0aGUgYXBwbGljYXRpb24uXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9BUEkvRmV0Y2hfQVBJL1VzaW5nX0ZldGNoXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZldGNoKGZldGNoOiBGZXRjaCwgeyBiYXNlVXJsLCBjb29raWUgfTogT3B0aW9ucykge1xuICAvLyBOT1RFOiBUd2VhayB0aGUgZGVmYXVsdCBvcHRpb25zIHRvIHN1aXRlIHlvdXIgYXBwbGljYXRpb24gbmVlZHNcbiAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgbWV0aG9kOiAnUE9TVCcsIC8vIGhhbmR5IHdpdGggR3JhcGhRTCBiYWNrZW5kc1xuICAgIG1vZGU6IGJhc2VVcmwgPyAnY29ycycgOiAnc2FtZS1vcmlnaW4nLFxuICAgIGNyZWRlbnRpYWxzOiBiYXNlVXJsID8gJ2luY2x1ZGUnIDogJ3NhbWUtb3JpZ2luJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAuLi4oY29va2llID8geyBDb29raWU6IGNvb2tpZSB9IDogbnVsbCksXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gKHVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkpID0+XG4gICAgdXJsLnN0YXJ0c1dpdGgoJy9ncmFwaHFsJykgfHwgdXJsLnN0YXJ0c1dpdGgoJy9hcGknKVxuICAgICAgPyBmZXRjaChgJHtiYXNlVXJsfSR7dXJsfWAsIHtcbiAgICAgICAgICAuLi5kZWZhdWx0cyxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIC4uLmRlZmF1bHRzLmhlYWRlcnMsXG4gICAgICAgICAgICAuLi4ob3B0aW9ucyAmJiBvcHRpb25zLmhlYWRlcnMpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICA6IGZldGNoKHVybCwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZldGNoO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jcmVhdGVGZXRjaC5qcyIsImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGNzdiBmcm9tICdjc3YnO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSAnYXN5bmMnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcbmltcG9ydCBUZWFtIGZyb20gJy4uL21vZGVscy9UZWFtJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5jbGFzcyBDU1ZJbXBvcnRlciB7XG4gIGZpbGVQYXRoO1xuICBlbmNvZGluZyA9ICdVVEYtOCc7XG5cbiAgY29uc3RydWN0b3IoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gIH1cblxuICBwZXJmb3JtSW1wb3J0KCkge1xuICAgIHJldHVybiB0aGlzLmxvYWRDU1YoKS50aGVuKFxuICAgICAgcmVzID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChmaW5pc2gsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnRyYW5zZm9ybUFycmF5dG9PYmplY3QocmVzKTtcblxuICAgICAgICAgIGxldCB1c2VycyA9IFtdO1xuICAgICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgKGl0ZW0sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpdGVtWydWb3JuYW1lIEzDpHVmZXIgMSddKSB7XG4gICAgICAgICAgICAgICAgU3BvbnNvci5jb3VudCh7XG4gICAgICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogaXRlbVsnRS1NYWlsJ10sXG4gICAgICAgICAgICAgICAgICAgIGluc2VydDogaXRlbS5TdWJtaXR0ZWQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLnRoZW4oY291bnQgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIFNwb25zb3IuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogaXRlbVsnRS1NYWlsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgY29udGFjdF9maXJzdE5hbWU6IGl0ZW0uVm9ybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250YWN0X2xhc3ROYW1lOiBpdGVtLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ05hbWUgRmlybWEgLyBWZXJlaW4gLyBTY2h1bGUgby4gw6QuJ10gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2l0ZW0uVm9ybmFtZX0gJHtpdGVtLk5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgICAgIHBlcnNvbmFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihzcG9uc29yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRlYW0uY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydOYW1lIEZpcm1hIC8gVmVyZWluIC8gU2NodWxlIG8uIMOkLiddIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7aXRlbS5Wb3JuYW1lfSAke2l0ZW0uTmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzcG9uc29yX2lkOiBzcG9uc29yLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih0ZWFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcnVubmVycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1bYFZvcm5hbWUgTMOkdWZlciAke2l9YF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJ1bm5lckNvbmYgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBpdGVtW2BOYW1lIEzDpHVmZXIgJHtpfWBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGl0ZW1bYFZvcm5hbWUgTMOkdWZlciAke2l9YF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmRlcjogaXRlbVtgR2VzY2hsZWNodCBMw6R1ZmVyICR7aX1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmlydGhkYXk6IG1vbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtW2BHZWJ1cnRzZGF0dW0gTMOkdWZlciAke2l9YF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1lZWVktTU0tREQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLnRvRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtX2lkOiB0ZWFtLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5lcnMucHVzaChydW5uZXJDb25mKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgUnVubmVyLmJ1bGtDcmVhdGUocnVubmVycylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnMgPSBydW5uZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBSdW5uZXIuY291bnQoe1xuICAgICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBTcG9uc29yLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RfZmlyc3ROYW1lOiBpdGVtLlZvcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgY29udGFjdF9sYXN0TmFtZTogaXRlbS5OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uU3BvbnNvciB8fCBgJHtpdGVtLlZvcm5hbWV9ICR7aXRlbS5OYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiBpdGVtLlN1Ym1pdHRlZCxcbiAgICAgICAgICAgICAgICAgICAgICBwZXJzb25hbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihzcG9uc29yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJ1bm5lci5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogaXRlbVsnRS1NYWlsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBpdGVtLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogaXRlbS5Wb3JuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5kZXI6IGl0ZW0uR2VzY2hsZWNodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmlydGhkYXk6IG1vbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtW2BHZWJ1cnRzZGF0dW1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnWVlZWS1NTS1ERCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkudG9EYXRlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNwb25zb3JfaWQ6IHNwb25zb3IuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogaXRlbS5TdWJtaXR0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzLnB1c2gocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmluaXNoKHVzZXJzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgbG9hZENTVigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBmcy5yZWFkRmlsZSh0aGlzLmZpbGVQYXRoLCB0aGlzLmVuY29kaW5nLCAoZXJyLCBmaWxlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWooZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3N2LnBhcnNlKGZpbGUsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICBlcnIgPyByZWooZXJyKSA6IHJlcyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyYW5zZm9ybUFycmF5dG9PYmplY3QoaW5wdXQpIHtcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGtleXMgPSBpbnB1dC5zaGlmdCgpO1xuICAgIHJldHVybiBpbnB1dC5tYXAocm93ID0+XG4gICAgICByb3cucmVkdWNlKChyZXMsIGN1ciwgaW5kZXgpID0+IHtcbiAgICAgICAgcmVzW2tleXNbaW5kZXhdXSA9IGN1ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9LCB7fSksXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDU1ZJbXBvcnRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9pbXBvcnQvY3N2LWltcG9ydC5qcyIsImltcG9ydCAqIGFzIGFzeW5jIGZyb20gJ2FzeW5jJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ1NWSW1wb3J0ZXIgZnJvbSAnLi9jc3YtaW1wb3J0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBvc3RDU1ZJbXBvcnQocmVxLCByZXMpIHtcbiAgY29uc29sZS5sb2cocmVxLmZpbGVzKTtcbiAgLy8gcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKFwiU3VjY2Vzc1wiKTtcbiAgaWYgKCFyZXEuZmlsZXMpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgnTm8gZmlsZXMgd2VyZSB1cGxvYWRlZC4nKTtcblxuICBjb25zdCBmaWxlcyA9IE9iamVjdC5rZXlzKHJlcS5maWxlcykubWFwKGtleSA9PiByZXEuZmlsZXNba2V5XSk7XG5cblxuICBsZXQgaW1wb3J0UmVzID0gW107XG4gIGFzeW5jLmVhY2hTZXJpZXMoXG4gICAgZmlsZXMsXG4gICAgKGZpbGUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgICAgYC4vaW1wb3J0LyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9XyR7ZmlsZS5uYW1lfWAsXG4gICAgICApO1xuICAgICAgZmlsZS5tdihmaWxlcGF0aCwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGltcG9ydGVyID0gbmV3IENTVkltcG9ydGVyKGZpbGVwYXRoKTtcbiAgICAgICAgaW1wb3J0ZXJcbiAgICAgICAgICAucGVyZm9ybUltcG9ydCgpXG4gICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIGltcG9ydFJlcyA9IHJlcztcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyKTtcbiAgICAgIHJlcy5qc29ucChpbXBvcnRSZXMpO1xuICAgIH0sXG4gICk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvaW1wb3J0L2ltcG9ydC1yZXF1ZXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuL1J1bm5lcic7XG5cbmNvbnN0IExhcCA9IE1vZGVsLmRlZmluZShcbiAgJ0xhcCcsXG4gIHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgaW5zZXJ0OiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5EQVRFLFxuICAgICAgZGVmYXVsdFZhbHVlOiBEYXRhVHlwZS5OT1csXG4gICAgfSxcblxuICAgIHJ1bm5lcl9pZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcblxuICAgICAgcmVmZXJlbmNlczoge1xuICAgICAgICAvLyBUaGlzIGlzIGEgcmVmZXJlbmNlIHRvIGFub3RoZXIgbW9kZWxcbiAgICAgICAgbW9kZWw6IFJ1bm5lcixcblxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBjb2x1bW4gbmFtZSBvZiB0aGUgcmVmZXJlbmNlZCBtb2RlbFxuICAgICAgICBrZXk6ICdpZCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHt9LFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgTGFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9MYXAuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5pbXBvcnQgU3BvbnNvciBmcm9tICcuL1Nwb25zb3InO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi9UZWFtJztcblxuY29uc3QgUnVubmVyID0gTW9kZWwuZGVmaW5lKFxuICAnUnVubmVyJyxcbiAge1xuICAgIGlkOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgICAgZGVmYXVsdFZhbHVlOiBEYXRhVHlwZS5VVUlEVjEsXG4gICAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICAgIH0sXG5cbiAgICBmaXJzdE5hbWU6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICAgIH0sXG5cbiAgICBsYXN0TmFtZToge1xuICAgICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gICAgfSxcblxuICAgIGdlbmRlcjoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDUwKSxcbiAgICB9LFxuXG4gICAgZW1haWw6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICAgICAgdmFsaWRhdGU6IHsgaXNFbWFpbDogdHJ1ZSB9XG4gICAgfSxcblxuICAgIGluc2VydDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuREFURSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuTk9XLFxuICAgIH0sXG5cbiAgICBiaXJ0aGRheToge1xuICAgICAgdHlwZTogRGF0YVR5cGUuREFURSxcbiAgICB9LFxuXG4gICAgc3BvbnNvcl9hbW91bnQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyxcbiAgICB9LFxuXG4gICAgc3BvbnNvcl9uYW1lOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgICB9LFxuXG4gICAgc3BvbnNvcl9pZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcblxuICAgICAgcmVmZXJlbmNlczoge1xuICAgICAgICAvLyBUaGlzIGlzIGEgcmVmZXJlbmNlIHRvIGFub3RoZXIgbW9kZWxcbiAgICAgICAgbW9kZWw6IFNwb25zb3IsXG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29sdW1uIG5hbWUgb2YgdGhlIHJlZmVyZW5jZWQgbW9kZWxcbiAgICAgICAga2V5OiAnaWQnLFxuXG4gICAgICAgIC8vIFRoaXMgZGVjbGFyZXMgd2hlbiB0byBjaGVjayB0aGUgZm9yZWlnbiBrZXkgY29uc3RyYWludC4gUG9zdGdyZVNRTCBvbmx5LlxuICAgICAgICBkZWZlcnJhYmxlOiBEYXRhVHlwZS5EZWZlcnJhYmxlLklOSVRJQUxMWV9JTU1FRElBVEUsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICB0ZWFtX2lkOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuXG4gICAgICByZWZlcmVuY2VzOiB7XG4gICAgICAgIC8vIFRoaXMgaXMgYSByZWZlcmVuY2UgdG8gYW5vdGhlciBtb2RlbFxuICAgICAgICBtb2RlbDogVGVhbSxcblxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBjb2x1bW4gbmFtZSBvZiB0aGUgcmVmZXJlbmNlZCBtb2RlbFxuICAgICAgICBrZXk6ICdpZCcsXG5cbiAgICAgICAgLy8gVGhpcyBkZWNsYXJlcyB3aGVuIHRvIGNoZWNrIHRoZSBmb3JlaWduIGtleSBjb25zdHJhaW50LiBQb3N0Z3JlU1FMIG9ubHkuXG4gICAgICAgIGRlZmVycmFibGU6IERhdGFUeXBlLkRlZmVycmFibGUuSU5JVElBTExZX0lNTUVESUFURSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIG51bWJlcjoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuSU5URUdFUixcbiAgICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgaW5kZXhlczogW3sgZmllbGRzOiBbJ2VtYWlsJ10gfV0sXG4gIH0sXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL1J1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcblxuY29uc3QgU3BvbnNvciA9IE1vZGVsLmRlZmluZSgnU3BvbnNvcicsIHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG5cbiAgZW1haWw6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgICB2YWxpZGF0ZTogeyBpc0VtYWlsOiB0cnVlIH1cbiAgfSxcblxuICBpbnNlcnQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5EQVRFLFxuICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuTk9XLFxuICB9LFxuXG4gIG5hbWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcblxuICBjb250YWN0X2ZpcnN0TmFtZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICB9LFxuXG4gIGNvbnRhY3RfbGFzdE5hbWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcblxuICBjb250YWN0X2FkZHJlc3M6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcblxuICBzcG9uc29yX2Ftb3VudDoge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyxcbiAgfSxcblxuICBwZXJzb25hbDoge1xuICAgIHR5cGU6IERhdGFUeXBlLkJPT0xFQU4sXG4gIH0sXG5cbiAgY2FzaDoge1xuICAgIHR5cGU6IERhdGFUeXBlLkJPT0xFQU4sXG4gIH0sXG5cbiAgZG9uYXRpb25fcmVjZWlwdDoge1xuICAgIHR5cGU6IERhdGFUeXBlLkJPT0xFQU4sXG4gIH0sXG5cblx0ZmlmdHlGaWZ0eToge1xuXHRcdHR5cGU6IERhdGFUeXBlLkJPT0xFQU4sXG4gIH0sXG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcG9uc29yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9TcG9uc29yLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi9TcG9uc29yJztcblxuY29uc3QgVGVhbSA9IE1vZGVsLmRlZmluZSgnVGVhbScsIHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG5cbiAgbmFtZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICB9LFxuXG4gIHNwb25zb3JfYW1vdW50OiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HLFxuICB9LFxuXG4gIGluc2VydDoge1xuICAgIHR5cGU6IERhdGFUeXBlLkRBVEUsXG4gICAgZGVmYXVsdFZhbHVlOiBEYXRhVHlwZS5OT1csXG4gIH0sXG5cbiAgaXNTY2hvb2w6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICB9LFxuXG4gIHNwb25zb3JfaWQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgIHJlZmVyZW5jZXM6IHtcbiAgICAgIC8vIFRoaXMgaXMgYSByZWZlcmVuY2UgdG8gYW5vdGhlciBtb2RlbFxuICAgICAgbW9kZWw6IFNwb25zb3IsXG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNvbHVtbiBuYW1lIG9mIHRoZSByZWZlcmVuY2VkIG1vZGVsXG4gICAgICBrZXk6ICdpZCcsXG5cbiAgICAgIC8vIFRoaXMgZGVjbGFyZXMgd2hlbiB0byBjaGVjayB0aGUgZm9yZWlnbiBrZXkgY29uc3RyYWludC4gUG9zdGdyZVNRTCBvbmx5LlxuICAgICAgZGVmZXJyYWJsZTogRGF0YVR5cGUuRGVmZXJyYWJsZS5JTklUSUFMTFlfSU1NRURJQVRFLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvVGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcblxuY29uc3QgVXNlciA9IE1vZGVsLmRlZmluZShcbiAgJ1VzZXInLFxuICB7XG4gICAgaWQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG4gICAgICBkZWZhdWx0VmFsdWU6IERhdGFUeXBlLlVVSURWMSxcbiAgICAgIHByaW1hcnlLZXk6IHRydWUsXG4gICAgfSxcblxuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgICAgIHZhbGlkYXRlOiB7IGlzRW1haWw6IHRydWUgfSxcbiAgICB9LFxuXG4gICAgZW1haWxDb25maXJtZWQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLkJPT0xFQU4sXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBpbmRleGVzOiBbeyBmaWVsZHM6IFsnZW1haWwnXSB9XSxcbiAgfSxcbik7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL1VzZXIuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IFVzZXJDbGFpbSA9IE1vZGVsLmRlZmluZSgnVXNlckNsYWltJywge1xuICB0eXBlOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HLFxuICB9LFxuXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJDbGFpbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvVXNlckNsYWltLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuXG5jb25zdCBVc2VyTG9naW4gPSBNb2RlbC5kZWZpbmUoJ1VzZXJMb2dpbicsIHtcbiAgbmFtZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyg1MCksXG4gICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgfSxcblxuICBrZXk6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMTAwKSxcbiAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJMb2dpbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvVXNlckxvZ2luLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuXG5jb25zdCBVc2VyUHJvZmlsZSA9IE1vZGVsLmRlZmluZSgnVXNlclByb2ZpbGUnLCB7XG4gIHVzZXJJZDoge1xuICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG4gICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgfSxcblxuICBkaXNwbGF5TmFtZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygxMDApLFxuICB9LFxuXG4gIHBpY3R1cmU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcblxuICBnZW5kZXI6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoNTApLFxuICB9LFxuXG4gIGxvY2F0aW9uOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDEwMCksXG4gIH0sXG5cbiAgd2Vic2l0ZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJQcm9maWxlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9Vc2VyUHJvZmlsZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHNlcXVlbGl6ZSBmcm9tICcuLi9zZXF1ZWxpemUnO1xuaW1wb3J0IFVzZXIgZnJvbSAnLi9Vc2VyJztcbmltcG9ydCBVc2VyTG9naW4gZnJvbSAnLi9Vc2VyTG9naW4nO1xuaW1wb3J0IFVzZXJDbGFpbSBmcm9tICcuL1VzZXJDbGFpbSc7XG5pbXBvcnQgVXNlclByb2ZpbGUgZnJvbSAnLi9Vc2VyUHJvZmlsZSc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4vUnVubmVyJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4vU3BvbnNvcic7XG5pbXBvcnQgVGVhbSBmcm9tICcuL1RlYW0nO1xuXG5Vc2VyLmhhc01hbnkoVXNlckxvZ2luLCB7XG4gIGZvcmVpZ25LZXk6ICd1c2VySWQnLFxuICBhczogJ2xvZ2lucycsXG4gIG9uVXBkYXRlOiAnY2FzY2FkZScsXG4gIG9uRGVsZXRlOiAnY2FzY2FkZScsXG59KTtcblxuVXNlci5oYXNNYW55KFVzZXJDbGFpbSwge1xuICBmb3JlaWduS2V5OiAndXNlcklkJyxcbiAgYXM6ICdjbGFpbXMnLFxuICBvblVwZGF0ZTogJ2Nhc2NhZGUnLFxuICBvbkRlbGV0ZTogJ2Nhc2NhZGUnLFxufSk7XG5cblVzZXIuaGFzT25lKFVzZXJQcm9maWxlLCB7XG4gIGZvcmVpZ25LZXk6ICd1c2VySWQnLFxuICBhczogJ3Byb2ZpbGUnLFxuICBvblVwZGF0ZTogJ2Nhc2NhZGUnLFxuICBvbkRlbGV0ZTogJ2Nhc2NhZGUnLFxufSk7XG5cbmZ1bmN0aW9uIHN5bmMoLi4uYXJncykge1xuICByZXR1cm4gc2VxdWVsaXplLnN5bmMoLi4uYXJncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgc3luYyB9O1xuZXhwb3J0IHsgVXNlciwgVXNlckxvZ2luLCBVc2VyQ2xhaW0sIFVzZXJQcm9maWxlLCBTcG9uc29yLCBUZWFtLCBSdW5uZXIgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvaW5kZXguanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSdW5uZXJMYXBzVHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJMYXBzVHlwZSc7XG5pbXBvcnQge1xuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IExhcCBmcm9tICcuLi9tb2RlbHMvTGFwJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5cbmNvbnN0IGFkZExhcCA9IHtcbiAgdHlwZTogUnVubmVyTGFwc1R5cGUsXG4gIGFyZ3M6IHsgbnVtYmVyOiB7IHR5cGU6IG5ldyBOb25OdWxsKEludGVnZXJUeXBlKSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBudW1iZXIgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZmluZE9uZSh7IHdoZXJlOiB7IG51bWJlciB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgY29uc3QgYmVmb3JlID0gbmV3IERhdGUoKTtcbiAgICAgICAgYmVmb3JlLnNldFNlY29uZHMoYmVmb3JlLmdldFNlY29uZHMoKSAtIDMwKTtcbiAgICAgICAgcmV0dXJuIExhcC5jb3VudCh7XG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIHJ1bm5lcl9pZDogcmVzLmlkLFxuICAgICAgICAgICAgaW5zZXJ0OiB7XG4gICAgICAgICAgICAgICRndGU6IGJlZm9yZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSkudGhlbihjb3VudCA9PiB7XG4gICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTGFwLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHJ1bm5lcl9pZDogcmVzLmlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBydW5uZXJfaWQ6IHJlcy5pZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2VpbiBMw6R1ZmVyIGdlZnVuZGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRMYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2FkZExhcC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtHcmFwaFFMSUQsIEdyYXBoUUxMaXN0LCBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4uL21vZGVscy9SdW5uZXInO1xuaW1wb3J0IFN1Y2Nlc3NUeXBlIGZyb20gJy4uL3R5cGVzL1N1Y2Nlc3NUeXBlJztcblxuY29uc3QgYWRkUnVubmVyc1RvVGVhbSA9IHtcbiAgdHlwZTogU3VjY2Vzc1R5cGUsXG4gIGFyZ3M6IHtcbiAgICB0ZWFtX2lkOiB7IHR5cGU6IG5ldyBOb25OdWxsKEdyYXBoUUxJRCkgfSxcbiAgICBydW5uZXJfaWRzOiB7IHR5cGU6IG5ldyBHcmFwaFFMTGlzdChuZXcgTm9uTnVsbChHcmFwaFFMSUQpKSB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgdGVhbV9pZCwgcnVubmVyX2lkcyB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci51cGRhdGUoXG4gICAgICB7IHRlYW1faWQgfSxcbiAgICAgIHsgd2hlcmU6IHsgaWQ6IHJ1bm5lcl9pZHMgfSB9LFxuICAgICkudGhlbigoYWZmZWN0ZWRDb3VudCwgYWZmZWN0ZWRSb3dzKSA9PiAoe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6ICdSdW5uZXJzIHVwZGF0ZWQnLFxuICAgIH0pKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFJ1bm5lcnNUb1RlYW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2FkZFJ1bm5lcnNUb1RlYW0uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDcmVhdGVSdW5uZXJJbnB1dFR5cGUsIHtcbiAgUnVubmVySW5wdXRGaWVsZHMsXG59IGZyb20gJy4uL3R5cGVzL0NyZWF0ZVJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyB9IGZyb20gJy4uL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUnO1xuXG5jb25zdCBjcmVhdGVQZXJzb25hbFJ1bm5lciA9IHtcbiAgdHlwZTogUnVubmVyVHlwZSxcbiAgYXJnczogeyBydW5uZXI6IHsgdHlwZTogQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgcnVubmVyIH0pIHtcbiAgICBjb25zdCByZWR1Y2VyID0gKHJlcywgY3VyKSA9PiB7XG4gICAgICByZXNbY3VyXSA9IHJ1bm5lcltjdXJdO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIGNvbnN0IHJ1bm5lclZhbHVlcyA9IE9iamVjdC5rZXlzKFJ1bm5lcklucHV0RmllbGRzKS5yZWR1Y2UocmVkdWNlciwge30pO1xuICAgIGNvbnN0IHNwb25zb3JWYWx1ZXMgPSBPYmplY3Qua2V5cyhcbiAgICAgIENyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHMsXG4gICAgKS5yZWR1Y2UocmVkdWNlciwge1xuICAgICAgcGVyc29uYWw6IHRydWUsXG4gICAgfSk7XG4gICAgaWYgKHJ1bm5lci5zcG9uc29yX2VtYWlsKXtcbiAgICAgIHNwb25zb3JWYWx1ZXMuZW1haWwgPSBydW5uZXIuc3BvbnNvcl9lbWFpbDtcbiAgICB9XG4gICAgcmV0dXJuIFNwb25zb3IuY3JlYXRlKHNwb25zb3JWYWx1ZXMpLnRoZW4ocmVzID0+XG4gICAgICBSdW5uZXIuY3JlYXRlKHsgLi4ucnVubmVyVmFsdWVzLCBzcG9uc29yX2lkOiByZXMuaWQgfSksXG4gICAgKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBlcnNvbmFsUnVubmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy9jcmVhdGVQZXJzb25hbFJ1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVJ1bm5lcklucHV0VHlwZSBmcm9tICcuLi90eXBlcy9DcmVhdGVSdW5uZXJJbnB1dFR5cGUnO1xuaW1wb3J0IFJ1bm5lclR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyVHlwZSc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4uL21vZGVscy9SdW5uZXInO1xuXG5jb25zdCBjcmVhdGVSdW5uZXIgPSB7XG4gIHR5cGU6IFJ1bm5lclR5cGUsXG4gIGFyZ3M6IHsgcnVubmVyOiB7IHR5cGU6IENyZWF0ZVJ1bm5lcklucHV0VHlwZSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBydW5uZXIgfSkge1xuICAgIHJldHVybiBSdW5uZXIuY3JlYXRlKHJ1bm5lcik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVJ1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gJy4uL3R5cGVzL1Nwb25zb3JUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcbmltcG9ydCBDcmVhdGVTcG9uc29ySW5wdXRUeXBlIGZyb20gJy4uL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUnO1xuXG5jb25zdCBjcmVhdGVTcG9uc29yID0ge1xuICB0eXBlOiBTcG9uc29yVHlwZSxcbiAgYXJnczogeyBzcG9uc29yOiB7IHR5cGU6IENyZWF0ZVNwb25zb3JJbnB1dFR5cGUgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgc3BvbnNvciB9KSB7XG4gICAgc3BvbnNvci5wZXJzb25hbCA9IGZhbHNlO1xuICAgIHJldHVybiBTcG9uc29yLmNyZWF0ZShzcG9uc29yKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNwb25zb3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVNwb25zb3IuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDcmVhdGVUZWFtSW5wdXRUeXBlIGZyb20gJy4uL3R5cGVzL0NyZWF0ZVRlYW1JbnB1dFR5cGUnO1xuaW1wb3J0IFRlYW1UeXBlIGZyb20gJy4uL3R5cGVzL1RlYW1UeXBlJztcbmltcG9ydCBUZWFtIGZyb20gJy4uL21vZGVscy9UZWFtJztcblxuY29uc3QgY3JlYXRlVGVhbSA9IHtcbiAgdHlwZTogVGVhbVR5cGUsXG4gIGFyZ3M6IHsgdGVhbTogeyB0eXBlOiBDcmVhdGVUZWFtSW5wdXRUeXBlIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IHRlYW0gfSkge1xuICAgIHJldHVybiBUZWFtLmNyZWF0ZSh0ZWFtKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVRlYW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVRlYW0uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgeyBHcmFwaFFMSUQgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTdWNjZXNzVHlwZSBmcm9tICcuLi90eXBlcy9TdWNjZXNzVHlwZSc7XG5cbmNvbnN0IGRlbGV0ZVJ1bm5lciA9IHtcbiAgdHlwZTogU3VjY2Vzc1R5cGUsXG4gIGFyZ3M6IHsgaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gUnVubmVyLmRlc3Ryb3koe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgaWQsXG4gICAgICB9LFxuICAgIH0pLnRoZW4oYWZmZWN0ZWRSb3dzID0+ICh7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IGFmZmVjdGVkUm93cyB9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWxldGVSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2RlbGV0ZVJ1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgR3JhcGhRTFN0cmluZyB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFN1Y2Nlc3NUeXBlIGZyb20gJy4uL3R5cGVzL1N1Y2Nlc3NUeXBlJztcblxuY29uc3QgZGVsZXRlU3BvbnNvciA9IHtcbiAgdHlwZTogU3VjY2Vzc1R5cGUsXG4gIGFyZ3M6IHsgaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCB9KSB7XG4gICAgcmV0dXJuIFNwb25zb3IuZGVzdHJveSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBpZCxcbiAgICAgIH0sXG4gICAgfSkudGhlbihhZmZlY3RlZFJvd3MgPT4gKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogYWZmZWN0ZWRSb3dzIH0pKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlbGV0ZVNwb25zb3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2RlbGV0ZVNwb25zb3IuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBUZWFtIGZyb20gJy4uL21vZGVscy9UZWFtJztcbmltcG9ydCB7IEdyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGwgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTdWNjZXNzVHlwZSBmcm9tICcuLi90eXBlcy9TdWNjZXNzVHlwZSc7XG5cbmNvbnN0IGRlbGV0ZVRlYW0gPSB7XG4gIHR5cGU6IFN1Y2Nlc3NUeXBlLFxuICBhcmdzOiB7IGlkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gVGVhbS5kZXN0cm95KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkLFxuICAgICAgfSxcbiAgICB9KS50aGVuKGFmZmVjdGVkUm93cyA9PiAoeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBhZmZlY3RlZFJvd3MgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVsZXRlVGVhbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvZGVsZXRlVGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJ1bm5lckxhcHNUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lckxhcHNUeXBlJztcbmltcG9ydCB7XG5cdEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcblx0R3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcblx0R3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCwgR3JhcGhRTElELFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBMYXAgZnJvbSAnLi4vbW9kZWxzL0xhcCc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4uL21vZGVscy9SdW5uZXInO1xuaW1wb3J0IFRlYW1UeXBlIGZyb20gXCIuLi90eXBlcy9UZWFtVHlwZVwiO1xuXG5jb25zdCByZW1vdmVSdW5uZXJGcm9tVGVhbSA9IHtcbiAgdHlwZTogVGVhbVR5cGUsXG4gIGFyZ3M6IHtcbiAgICB0ZWFtX2lkOiB7IHR5cGU6IG5ldyBOb25OdWxsKEdyYXBoUUxJRCkgfSxcblx0XHRydW5uZXJfaWQ6IHsgdHlwZTogbmV3IE5vbk51bGwoR3JhcGhRTElEKSB9LFxuICAgIH0sXG4gIHJlc29sdmUocm9vdCwgeyB0ZWFtX2lkLCBydW5uZXJfaWQgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZmluZEJ5SWQocnVubmVyX2lkKS50aGVuKHJlcyA9PiByZXMudXBkYXRlKHt0ZWFtX2lkOiBudWxsfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVtb3ZlUnVubmVyRnJvbVRlYW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL3JlbW92ZVJ1bm5lckZyb21UZWFtLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgVGVhbSBmcm9tICcuLi9tb2RlbHMvVGVhbSc7XG5pbXBvcnQge0dyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGx9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFRlYW1UeXBlIGZyb20gXCIuLi90eXBlcy9UZWFtVHlwZVwiO1xuXG5jb25zdCBzZXRUZWFtU3BvbnNvciA9IHtcbiAgdHlwZTogVGVhbVR5cGUsXG4gIGFyZ3M6IHtcbiAgICB0ZWFtX2lkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgc3BvbnNvcl9pZDogeyB0eXBlOiBHcmFwaFFMSUQgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IHRlYW1faWQsIHNwb25zb3JfaWQgfSkge1xuICAgIHJldHVybiBUZWFtLmZpbmRCeUlkKHRlYW1faWQpLnRoZW4ocmVzID0+IHJlcy51cGRhdGUoe3Nwb25zb3JfaWR9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXRUZWFtU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvc2V0VGVhbVNwb25zb3IuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDcmVhdGVSdW5uZXJJbnB1dFR5cGUsIHtcbiAgUnVubmVySW5wdXRGaWVsZHMsXG59IGZyb20gJy4uL3R5cGVzL0NyZWF0ZVJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyB9IGZyb20gJy4uL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUnO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCB1cGRhdGVQZXJzb25hbFJ1bm5lciA9IHtcbiAgdHlwZTogUnVubmVyVHlwZSxcbiAgYXJnczoge1xuICAgIGlkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgcnVubmVyOiB7IHR5cGU6IENyZWF0ZVBlcnNvbmFsUnVubmVySW5wdXRUeXBlIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBydW5uZXIsIGlkIH0pIHtcbiAgICBjb25zdCByZWR1Y2VyID0gKHJlcywgY3VyKSA9PiB7XG4gICAgICByZXNbY3VyXSA9IHJ1bm5lcltjdXJdO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIGNvbnN0IHJ1bm5lclZhbHVlcyA9IE9iamVjdC5rZXlzKFJ1bm5lcklucHV0RmllbGRzKS5yZWR1Y2UocmVkdWNlciwge30pO1xuICAgIGNvbnN0IHNwb25zb3JWYWx1ZXMgPSBPYmplY3Qua2V5cyhcbiAgICAgIENyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHMsXG4gICAgKS5yZWR1Y2UocmVkdWNlciwge1xuICAgICAgcGVyc29uYWw6IHRydWUsXG4gICAgfSk7XG4gICAgaWYgKHNwb25zb3JWYWx1ZXMuc3BvbnNvcl9lbWFpbCl7XG4gICAgICBzcG9uc29yVmFsdWVzLmVtYWlsID0gc3BvbnNvclZhbHVlcy5zcG9uc29yX2VtYWlsO1xuICAgICAgZGVsZXRlIHNwb25zb3JWYWx1ZXMuc3BvbnNvcl9lbWFpbDtcbiAgICB9XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kQnlJZChpZCkudGhlbihmb3VuZFJ1bm5lciA9PiB7XG4gICAgICBpZiAoIWZvdW5kUnVubmVyLnNwb25zb3JfaWQpIHtcbiAgICAgICAgcmV0dXJuIFNwb25zb3IuY3JlYXRlKHNwb25zb3JWYWx1ZXMpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBydW5uZXJWYWx1ZXMuc3BvbnNvcl9pZCA9IHJlcy5pZDtcbiAgICAgICAgICByZXR1cm4gZm91bmRSdW5uZXIudXBkYXRlKHsgLi4ucnVubmVyVmFsdWVzIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTcG9uc29yLnVwZGF0ZShzcG9uc29yVmFsdWVzLCB7XG4gICAgICAgIHdoZXJlOiB7IGlkOiBmb3VuZFJ1bm5lci5zcG9uc29yX2lkIH0sXG4gICAgICB9KS50aGVuKHJlcyA9PiBmb3VuZFJ1bm5lci51cGRhdGUoeyAuLi5ydW5uZXJWYWx1ZXMgfSkpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlUGVyc29uYWxSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVBlcnNvbmFsUnVubmVyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgQ3JlYXRlUnVubmVySW5wdXRUeXBlIGZyb20gJy4uL3R5cGVzL0NyZWF0ZVJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgeyBHcmFwaFFMSUQsIEdyYXBoUUxOb25OdWxsIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IGNyZWF0ZVJ1bm5lciA9IHtcbiAgdHlwZTogUnVubmVyVHlwZSxcbiAgYXJnczoge1xuICAgIGlkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgcnVubmVyOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChDcmVhdGVSdW5uZXJJbnB1dFR5cGUpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCwgcnVubmVyIH0pIHtcbiAgICByZXR1cm4gUnVubmVyLmZpbmRCeUlkKGlkKS50aGVuKHJlcyA9PiByZXMudXBkYXRlKHJ1bm5lcikpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVubmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy91cGRhdGVSdW5uZXIuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDcmVhdGVTcG9uc29ySW5wdXRUeXBlIGZyb20gJy4uL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUnO1xuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gJy4uL3R5cGVzL1Nwb25zb3JUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcbmltcG9ydCB7IEdyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGwgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgY3JlYXRlU3BvbnNvciA9IHtcbiAgdHlwZTogU3BvbnNvclR5cGUsXG4gIGFyZ3M6IHtcbiAgICBpZDogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTElEKSB9LFxuICAgIHNwb25zb3I6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKENyZWF0ZVNwb25zb3JJbnB1dFR5cGUpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCwgc3BvbnNvciB9KSB7XG4gICAgcmV0dXJuIFNwb25zb3IuZmluZEJ5SWQoaWQpLnRoZW4ocmVzID0+IHJlcy51cGRhdGUoc3BvbnNvcikpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvdXBkYXRlU3BvbnNvci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVRlYW1JbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlVGVhbUlucHV0VHlwZSc7XG5pbXBvcnQgVGVhbVR5cGUgZnJvbSAnLi4vdHlwZXMvVGVhbVR5cGUnO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCB1cGRhdGVUZWFtID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczoge1xuICAgIGlkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgdGVhbTogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoQ3JlYXRlVGVhbUlucHV0VHlwZSkgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkLCB0ZWFtIH0pIHtcbiAgICByZXR1cm4gVGVhbS5maW5kQnlJZChpZCkudGhlbihyZXMgPT4gcmVzLnVwZGF0ZSh0ZWFtKSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVUZWFtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy91cGRhdGVUZWFtLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgeyBHcmFwaFFMSW50LCBHcmFwaFFMU3RyaW5nIH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGlzdFR5cGUnO1xuaW1wb3J0IHNlcXVlbGl6ZSBmcm9tICcuLy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IHJlc3VsdHMgPSB7XG4gIHR5cGU6IFJ1bm5lckxpc3RUeXBlLFxuICBhcmdzOiB7XG4gICAgc29ydDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG5cbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IHNvcnQgfSkge1xuICAgIGNvbnN0IG9yZGVyQnkgPSBzb3J0IHx8ICctYmlydGhkYXknO1xuICAgIHJldHVybiBzZXF1ZWxpemVcbiAgICAgIC5xdWVyeShcbiAgICAgICAgYFNFTEVDVFxuICAgICAgICBSdW5uZXIuKixcbiAgICAgICAgQ09VTlQoUnVubmVyLmlkKSBhcyBsYXBzLFxuICAgICAgICBjYXN0KHN0cmZ0aW1lKCclWS4lbSVkJywgJ25vdycpIC0gc3RyZnRpbWUoJyVZLiVtJWQnLCBkYXRldGltZShiaXJ0aGRheSwgJ2xvY2FsdGltZScpKSBhcyBpbnQpIGFzIGFnZSxcbiAgICAgICAgZGF0ZXRpbWUoYmlydGhkYXksICdsb2NhbHRpbWUnKSBhcyBiaXJ0aGRheVxuRlJPTSBMYXAgTEVGVCBKT0lOIFJ1bm5lciBPTiBMYXAucnVubmVyX2lkID0gUnVubmVyLmlkXG5HUk9VUCBCWSBSdW5uZXIuaWRcbk9SREVSIEJZICR7b3JkZXJCeX1gLFxuICAgICAgKVxuICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcnVubmVyczogcmVzdWx0c1swXS5tYXAocm93ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bm5lciA9IE9iamVjdC5rZXlzKHJvdylcbiAgICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4gIWtleS5pbmNsdWRlcygnc3BvbnNvcl8nKSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgocmVzLCBjdXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXNbY3VyXSA9IHJvd1tjdXJdO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnJ1bm5lcixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlc3VsdHM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9hbGxSdW5uZXJSZXN1bHRzLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgQ2hlY2tOdW1iZXJUeXBlIGZyb20gJy4uL3R5cGVzL0NoZWNrTnVtYmVyVHlwZSc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4vLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgeyBHcmFwaFFMSW50LCBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLCBHcmFwaFFMU3RyaW5nIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IGNoZWNrTnVtYmVyID0ge1xuICB0eXBlOiBDaGVja051bWJlclR5cGUsXG4gIGFyZ3M6IHtcbiAgICBudW1iZXI6IHsgdHlwZTogbmV3IE5vbk51bGwoR3JhcGhRTEludCkgfSxcbiAgICBydW5uZXJfaWQ6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgbnVtYmVyLCBydW5uZXJfaWQgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZmluZE9uZSh7IHdoZXJlOiB7IG51bWJlciB9IH0pLnRoZW4ocmVzdWx0ID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGF2YWlsYWJsZTogIXJlc3VsdCB8fCByZXN1bHQuaWQgPT09IHJ1bm5lcl9pZCxcblx0XHRcdH1cbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNoZWNrTnVtYmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvY2hlY2tOdW1iZXIuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBVc2VyVHlwZSBmcm9tICcuLi90eXBlcy9Vc2VyVHlwZSc7XG5cbmNvbnN0IG1lID0ge1xuICB0eXBlOiBVc2VyVHlwZSxcbiAgcmVzb2x2ZSh7IHJlcXVlc3QgfSkge1xuICAgIHJldHVybiAoXG4gICAgICByZXF1ZXN0LnVzZXIgJiYge1xuICAgICAgICBpZDogcmVxdWVzdC51c2VyLmlkLFxuICAgICAgICBlbWFpbDogcmVxdWVzdC51c2VyLmVtYWlsLFxuICAgICAgfVxuICAgICk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL21lLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgeyBHcmFwaFFMTGlzdCBhcyBMaXN0IH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5pbXBvcnQgTmV3c0l0ZW1UeXBlIGZyb20gJy4uL3R5cGVzL05ld3NJdGVtVHlwZSc7XG5cbi8vIFJlYWN0LmpzIE5ld3MgRmVlZCAoUlNTKVxuY29uc3QgdXJsID1cbiAgJ2h0dHBzOi8vYXBpLnJzczJqc29uLmNvbS92MS9hcGkuanNvbicgK1xuICAnP3Jzc191cmw9aHR0cHMlM0ElMkYlMkZyZWFjdGpzbmV3cy5jb20lMkZmZWVkLnhtbCc7XG5cbmxldCBpdGVtcyA9IFtdO1xubGV0IGxhc3RGZXRjaFRhc2s7XG5sZXQgbGFzdEZldGNoVGltZSA9IG5ldyBEYXRlKDE5NzAsIDAsIDEpO1xuXG5jb25zdCBuZXdzID0ge1xuICB0eXBlOiBuZXcgTGlzdChOZXdzSXRlbVR5cGUpLFxuICByZXNvbHZlKCkge1xuICAgIGlmIChsYXN0RmV0Y2hUYXNrKSB7XG4gICAgICByZXR1cm4gbGFzdEZldGNoVGFzaztcbiAgICB9XG5cbiAgICBpZiAobmV3IERhdGUoKSAtIGxhc3RGZXRjaFRpbWUgPiAxMDAwICogNjAgKiAxMCAvKiAxMCBtaW5zICovKSB7XG4gICAgICBsYXN0RmV0Y2hUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgIGxhc3RGZXRjaFRhc2sgPSBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICBpdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGFzdEZldGNoVGFzayA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBsYXN0RmV0Y2hUYXNrID0gbnVsbDtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pO1xuXG4gICAgICBpZiAoaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxhc3RGZXRjaFRhc2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL25ld3MuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7IEdyYXBoUUxJbnQgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBSdW5uZXJMaXN0VHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJMaXN0VHlwZSc7XG5pbXBvcnQgc2VxdWVsaXplIGZyb20gJy4vLi4vc2VxdWVsaXplJztcblxuY29uc3QgcmVzdWx0cyA9IHtcbiAgdHlwZTogUnVubmVyTGlzdFR5cGUsXG4gIGFyZ3M6IHtcbiAgICBtaW5BZ2U6IHsgdHlwZTogR3JhcGhRTEludCB9LFxuICAgIG1heEFnZTogeyB0eXBlOiBHcmFwaFFMSW50IH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBtaW5BZ2UsIG1heEFnZSB9KSB7XG4gICAgcmV0dXJuIHNlcXVlbGl6ZVxuICAgICAgLnF1ZXJ5KFxuICAgICAgICBgU0VMRUNUXG4gICAgICAgIFJ1bm5lci5pZCBhcyBpZCxcbiAgICAgICAgQ09VTlQoUnVubmVyLmlkKSBhcyBsYXBzLFxuICAgICAgICBjYXN0KHN0cmZ0aW1lKCclWS4lbSVkJywgJ25vdycpIC0gc3RyZnRpbWUoJyVZLiVtJWQnLCBkYXRldGltZShiaXJ0aGRheSwgJ2xvY2FsdGltZScpKSBhcyBpbnQpIGFzIGFnZSxcbiAgICAgICAgZGF0ZXRpbWUoUnVubmVyLmJpcnRoZGF5LCAnbG9jYWx0aW1lJykgYXMgYmlydGhkYXksXG4gICAgICAgIFJ1bm5lci5maXJzdE5hbWUsXG4gICAgICAgIFJ1bm5lci5sYXN0TmFtZSxcbiAgICAgICAgUnVubmVyLmVtYWlsIGFzIGVtYWlsLFxuICAgICAgICBSdW5uZXIuZ2VuZGVyLFxuICAgICAgICBSdW5uZXIubnVtYmVyLFxuXG4gICAgICAgIFJ1bm5lci5zcG9uc29yX2Ftb3VudCBhcyBzcG9uc29yX2Ftb3VudCxcbiAgICAgICAgU3BvbnNvci5pZCBhcyBzcG9uc29yX2lkLFxuICAgICAgICBTcG9uc29yLmVtYWlsIGFzIHNwb25zb3JfZW1haWwsXG4gICAgICAgIFNwb25zb3IubmFtZSBhcyBzcG9uc29yX25hbWUsXG4gICAgICAgIFNwb25zb3IuY29udGFjdF9maXJzdE5hbWUgYXMgc3BvbnNvcl9jb250YWN0X2ZpcnN0TmFtZSxcbiAgICAgICAgU3BvbnNvci5jb250YWN0X2xhc3ROYW1lIGFzIHNwb25zb3JfY29udGFjdF9sYXN0TmFtZSxcbiAgICAgICAgU3BvbnNvci5zcG9uc29yX2Ftb3VudCBhcyBzcG9uc29yX3Nwb25zb3JfYW1vdW50LFxuICAgICAgICBTcG9uc29yLmRvbmF0aW9uX3JlY2VpcHQgYXMgc3BvbnNvcl9kb25hdGlvbl9yZWNlaXB0XG5GUk9NIExhcCBMRUZUIEpPSU4gUnVubmVyIE9OIExhcC5ydW5uZXJfaWQgPSBSdW5uZXIuaWQgSU5ORVIgSk9JTiBTcG9uc29yIE9OIFJ1bm5lci5zcG9uc29yX2lkID0gU3BvbnNvci5pZFxuV0hFUkUgYWdlID49ICR7bWluQWdlfSBhbmQgYWdlIDw9ICR7bWF4QWdlfSBhbmQgUnVubmVyLnNwb25zb3JfaWQgTk9UIE5VTExcbkdST1VQIEJZIFJ1bm5lci5pZFxuT1JERVIgQlkgLUxhcHNgLFxuICAgICAgKVxuICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcnVubmVyczogcmVzdWx0c1swXS5tYXAocm93ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bm5lciA9IE9iamVjdC5rZXlzKHJvdylcbiAgICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4gIWtleS5pbmNsdWRlcygnc3BvbnNvcl8nKSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgocmVzLCBjdXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXNbY3VyXSA9IHJvd1tjdXJdO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIGNvbnN0IHNwb25zb3IgPSBPYmplY3Qua2V5cyhyb3cpXG4gICAgICAgICAgICAgIC5maWx0ZXIoa2V5ID0+IGtleS5pbmNsdWRlcygnc3BvbnNvcl8nKSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgocmVzLCBjdXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXNbY3VyLnJlcGxhY2UoJ3Nwb25zb3JfJywgJycpXSA9IHJvd1tjdXJdO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwb25zb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucnVubmVyLFxuICAgICAgICAgICAgICBzcG9uc29yX2lkOiBzcG9uc29yLmlkLFxuICAgICAgICAgICAgICBzcG9uc29yOiB7XG4gICAgICAgICAgICAgICAgLi4uc3BvbnNvcixcbiAgICAgICAgICAgICAgICBzcG9uc29yX2Ftb3VudDogcm93LnNwb25zb3Jfc3BvbnNvcl9hbW91bnRcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlc3VsdHM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9wZXJzb25hbFJlc3VsdHMuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSdW5uZXJUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lclR5cGUnO1xuaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5cbmNvbnN0IHJ1bm5lciA9IHtcbiAgdHlwZTogUnVubmVyVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBTdHJpbmdUeXBlIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gUnVubmVyLmZpbmRCeUlkKGlkKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bm5lcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3J1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJ1bm5lckxhcHNUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lckxhcHNUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQge1xuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBydW5uZXJMYXBzID0ge1xuICB0eXBlOiBSdW5uZXJMYXBzVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBuZXcgTm9uTnVsbChTdHJpbmdUeXBlKSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJ1bm5lcl9pZDogaWQsXG4gICAgfTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bm5lckxhcHM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9ydW5uZXJMYXBzLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUnVubmVyTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGlzdFR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxTdHJpbmcgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgcnVubmVyTGlzdCA9IHtcbiAgdHlwZTogUnVubmVyTGlzdFR5cGUsXG4gIGFyZ3M6IHtcbiAgICBxdWVyeTogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBxdWVyeSB9KSB7XG4gICAgY29uc3QgcmVzdWx0Q2FsbCA9IHJlc3VsdCA9PiAoe1xuICAgICAgdG90YWw6IHJlc3VsdC5jb3VudCxcbiAgICAgIHJ1bm5lcnM6IHJlc3VsdC5yb3dzLFxuICAgIH0pO1xuICAgIGlmIChxdWVyeSAmJiBxdWVyeSAhPT0gJycpIHtcbiAgICAgIHJldHVybiBSdW5uZXIuZmluZEFuZENvdW50QWxsKHtcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBzcG9uc29yX2lkOiB7XG4gICAgICAgICAgICAkbmU6IG51bGwsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmlyc3ROYW1lOiB7ICRsaWtlOiBgJSR7cXVlcnl9JWAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhc3ROYW1lOiB7ICRsaWtlOiBgJSR7cXVlcnl9JWAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGVtYWlsOiB7ICRsaWtlOiBgJSR7cXVlcnl9JWAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLnRoZW4ocmVzdWx0Q2FsbCk7XG4gICAgfVxuICAgIHJldHVybiBSdW5uZXIuZmluZEFuZENvdW50QWxsKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIHNwb25zb3JfaWQ6IHtcbiAgICAgICAgICAkbmU6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLnRoZW4ocmVzdWx0Q2FsbCk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBydW5uZXJMaXN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvcnVubmVyTGlzdC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHsgR3JhcGhRTEludCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFRlYW1MaXN0VHlwZSBmcm9tICcuLi90eXBlcy9UZWFtTGlzdFR5cGUnO1xuaW1wb3J0IHNlcXVlbGl6ZSBmcm9tICcuLy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IHJlc3VsdHMgPSB7XG4gIHR5cGU6IFRlYW1MaXN0VHlwZSxcbiAgYXJnczoge1xuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgbWluLCBtYXggfSkge1xuXG4gICAgcmV0dXJuIHNlcXVlbGl6ZVxuICAgICAgLnF1ZXJ5KFxuICAgICAgICBgU0VMRUNUIFRlYW0uKiwgY291bnQoTGFwLmlkKSBhcyBsYXBzXG5GUk9NXG5cdChTRUxFQ1QgY291bnQodGVhbV9pZCkgYXMgdGVhbV9zaXplLCBUZWFtLiogRlJPTSBUZWFtIExFRlQgSk9JTiBSdW5uZXIgT04gVGVhbS5pZCA9IFJ1bm5lci50ZWFtX2lkIEdST1VQIEJZIHRlYW1faWQgKSBhcyBUZWFtXG5cdElOTkVSIEpPSU4gUnVubmVyIE9OIFRlYW0uaWQgPSBSdW5uZXIudGVhbV9pZFxuXHRJTk5FUiBKT0lOIExhcCBvbiBSdW5uZXIuaWQgPSBMYXAucnVubmVyX2lkXG5HUk9VUCBCWSB0ZWFtX2lkXG5IQVZJTkcgdGVhbS5pc1NjaG9vbCA9IDFcbk9SREVSIEJZIC1sYXBzYCxcbiAgICAgIClcbiAgICAgIC50aGVuKHJlc3VsdHMgPT4gKHtcbiAgICAgICAgdGVhbXM6IHJlc3VsdHNbMF0ubWFwKHJvdyA9PiByb3cpLFxuICAgICAgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVzdWx0cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3NjaG9vbFRlYW1SZXN1bHRzLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU3BvbnNvclR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3Qgc3BvbnNvciA9IHtcbiAgdHlwZTogU3BvbnNvclR5cGUsXG4gIGFyZ3M6IHsgaWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCB9KSB7XG4gICAgcmV0dXJuIFNwb25zb3IuZmluZEJ5SWQoaWQpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3Nwb25zb3IuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBTcG9uc29yTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvckxpc3RUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcblxuY29uc3Qgc3BvbnNvckxpc3QgPSB7XG4gIHR5cGU6IFNwb25zb3JMaXN0VHlwZSxcbiAgcmVzb2x2ZSgpIHtcbiAgICByZXR1cm4gU3BvbnNvci5maW5kQW5kQ291bnRBbGwoKS50aGVuKHJlc3VsdCA9PiAoe1xuICAgICAgdG90YWw6IHJlc3VsdC5jb3VudCxcbiAgICAgIHNwb25zb3JzOiByZXN1bHQucm93cyxcbiAgICB9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzcG9uc29yTGlzdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3Nwb25zb3JMaXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgVGVhbVR5cGUgZnJvbSAnLi4vdHlwZXMvVGVhbVR5cGUnO1xuaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBUZWFtIGZyb20gJy4vLi4vbW9kZWxzL1RlYW0nO1xuXG5jb25zdCB0ZWFtID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBTdHJpbmdUeXBlIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gVGVhbS5maW5kQnlJZChpZCk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvdGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFRlYW1MaXN0VHlwZSBmcm9tICcuLi90eXBlcy9UZWFtTGlzdFR5cGUnO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuXG5jb25zdCB0ZWFtTGlzdCA9IHtcbiAgdHlwZTogVGVhbUxpc3RUeXBlLFxuICByZXNvbHZlKCkge1xuICAgIHJldHVybiBUZWFtLmZpbmRBbmRDb3VudEFsbCgpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvdGFsOiByZXN1bHQuY291bnQsXG4gICAgICAgIHRlYW1zOiByZXN1bHQucm93cyxcbiAgICAgIH07XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtTGlzdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3RlYW1MaXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgeyBHcmFwaFFMSW50IH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgVGVhbUxpc3RUeXBlIGZyb20gJy4uL3R5cGVzL1RlYW1MaXN0VHlwZSc7XG5pbXBvcnQgc2VxdWVsaXplIGZyb20gJy4vLi4vc2VxdWVsaXplJztcblxuY29uc3QgcmVzdWx0cyA9IHtcbiAgdHlwZTogVGVhbUxpc3RUeXBlLFxuICBhcmdzOiB7XG4gICAgbWluOiB7IHR5cGU6IEdyYXBoUUxJbnQgfSxcbiAgICBtYXg6IHsgdHlwZTogR3JhcGhRTEludCB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgbWluLCBtYXggfSkge1xuICAgIGNvbnN0IGhhdmluZ0FyciA9IFtdO1xuICAgIGlmIChtaW4pIHtcbiAgICAgIGhhdmluZ0Fyci5wdXNoKGB0ZWFtX3NpemUgPj0gJHttaW59YCk7XG4gICAgfVxuICAgIGlmIChtYXgpIHtcbiAgICAgIGhhdmluZ0Fyci5wdXNoKGB0ZWFtX3NpemUgPD0gJHttYXh9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGF2aW5nID0gaGF2aW5nQXJyLmxlbmd0aCA/IGBIQVZJTkcgJHtoYXZpbmdBcnIuam9pbignIGFuZCAnKX1gIDogJyc7XG5cbiAgICByZXR1cm4gc2VxdWVsaXplXG4gICAgICAucXVlcnkoXG4gICAgICAgIGBTRUxFQ1QgVGVhbS4qLCBjb3VudChMYXAuaWQpIGFzIGxhcHNcbkZST00gXG5cdChTRUxFQ1QgY291bnQodGVhbV9pZCkgYXMgdGVhbV9zaXplLCBUZWFtLiogRlJPTSBUZWFtIExFRlQgSk9JTiBSdW5uZXIgT04gVGVhbS5pZCA9IFJ1bm5lci50ZWFtX2lkIEdST1VQIEJZIHRlYW1faWQgKSBhcyBUZWFtIFxuXHRJTk5FUiBKT0lOIFJ1bm5lciBPTiBUZWFtLmlkID0gUnVubmVyLnRlYW1faWQgXG5cdElOTkVSIEpPSU4gTGFwIG9uIFJ1bm5lci5pZCA9IExhcC5ydW5uZXJfaWQgXG5HUk9VUCBCWSB0ZWFtX2lkXG4ke2hhdmluZ31cbk9SREVSIEJZIC1sYXBzYCxcbiAgICAgIClcbiAgICAgIC50aGVuKHJlc3VsdHMgPT4gKHtcbiAgICAgICAgdGVhbXM6IHJlc3VsdHNbMF0ubWFwKHJvdyA9PiByb3cpLFxuICAgICAgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVzdWx0cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3RlYW1SZXN1bHRzLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUnVubmVyTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGlzdFR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGwgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgdGVhbVJ1bm5lckxpc3QgPSB7XG4gIHR5cGU6IFJ1bm5lckxpc3RUeXBlLFxuICBhcmdzOiB7XG4gICAgdGVhbV9pZDogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTElEKSB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgdGVhbV9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kQW5kQ291bnRBbGwoe1xuICAgICAgd2hlcmU6IHsgdGVhbV9pZCB9LFxuICAgIH0pLnRoZW4ocmVzdWx0ID0+ICh7XG4gICAgICB0b3RhbDogcmVzdWx0LmNvdW50LFxuICAgICAgcnVubmVyczogcmVzdWx0LnJvd3MsXG4gICAgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGVhbVJ1bm5lckxpc3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy90ZWFtUnVubmVyTGlzdC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gXCIuLi90eXBlcy9TcG9uc29yVHlwZVwiO1xuXG5jb25zdCB0ZWFtU3BvbnNvciA9IHtcbiAgdHlwZTogU3BvbnNvclR5cGUsXG4gIGFyZ3M6IHtcbiAgICB0ZWFtX2lkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyB0ZWFtX2lkIH0pIHtcbiAgICByZXR1cm4gVGVhbS5maW5kQnlJZCh0ZWFtX2lkKS50aGVuKHJlc3VsdCA9PiBTcG9uc29yLmZpbmRCeUlkKHJlc3VsdC5zcG9uc29yX2lkKSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3RlYW1TcG9uc29yLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hIGFzIFNjaGVtYSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgcnVubmVyTGlzdCBmcm9tICcuL3F1ZXJpZXMvcnVubmVyTGlzdCc7XG5pbXBvcnQgcnVubmVyIGZyb20gJy4vcXVlcmllcy9ydW5uZXInO1xuaW1wb3J0IG5ld3MgZnJvbSAnLi9xdWVyaWVzL25ld3MnO1xuaW1wb3J0IG1lIGZyb20gJy4vcXVlcmllcy9tZSc7XG5pbXBvcnQgY3JlYXRlUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVJ1bm5lcic7XG5pbXBvcnQgc3BvbnNvciBmcm9tICcuL3F1ZXJpZXMvc3BvbnNvcic7XG5pbXBvcnQgc3BvbnNvckxpc3QgZnJvbSAnLi9xdWVyaWVzL3Nwb25zb3JMaXN0JztcbmltcG9ydCBjcmVhdGVTcG9uc29yIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVNwb25zb3InO1xuaW1wb3J0IGRlbGV0ZVJ1bm5lciBmcm9tICcuL211dGF0aW9ucy9kZWxldGVSdW5uZXInO1xuaW1wb3J0IGRlbGV0ZVNwb25zb3IgZnJvbSAnLi9tdXRhdGlvbnMvZGVsZXRlU3BvbnNvcic7XG5pbXBvcnQgdXBkYXRlUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL3VwZGF0ZVJ1bm5lcic7XG5pbXBvcnQgdXBkYXRlU3BvbnNvciBmcm9tICcuL211dGF0aW9ucy91cGRhdGVTcG9uc29yJztcbmltcG9ydCBydW5uZXJMYXBzIGZyb20gJy4vcXVlcmllcy9ydW5uZXJMYXBzJztcbmltcG9ydCBhZGRMYXAgZnJvbSAnLi9tdXRhdGlvbnMvYWRkTGFwJztcbmltcG9ydCBjaGVja051bWJlciBmcm9tICcuL3F1ZXJpZXMvY2hlY2tOdW1iZXInO1xuaW1wb3J0IGNyZWF0ZVRlYW0gZnJvbSAnLi9tdXRhdGlvbnMvY3JlYXRlVGVhbSc7XG5pbXBvcnQgdXBkYXRlVGVhbSBmcm9tICcuL211dGF0aW9ucy91cGRhdGVUZWFtJztcbmltcG9ydCBkZWxldGVUZWFtIGZyb20gJy4vbXV0YXRpb25zL2RlbGV0ZVRlYW0nO1xuaW1wb3J0IGNyZWF0ZVBlcnNvbmFsUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVBlcnNvbmFsUnVubmVyJztcbmltcG9ydCB1cGRhdGVQZXJzb25hbFJ1bm5lciBmcm9tICcuL211dGF0aW9ucy91cGRhdGVQZXJzb25hbFJ1bm5lcic7XG5pbXBvcnQgdGVhbSBmcm9tIFwiLi9xdWVyaWVzL3RlYW1cIjtcbmltcG9ydCB0ZWFtTGlzdCBmcm9tIFwiLi9xdWVyaWVzL3RlYW1MaXN0XCI7XG5pbXBvcnQgdGVhbVJ1bm5lckxpc3QgZnJvbSBcIi4vcXVlcmllcy90ZWFtUnVubmVyTGlzdFwiO1xuaW1wb3J0IGFkZFJ1bm5lcnNUb1RlYW0gZnJvbSBcIi4vbXV0YXRpb25zL2FkZFJ1bm5lcnNUb1RlYW1cIjtcbmltcG9ydCByZW1vdmVSdW5uZXJGcm9tVGVhbSBmcm9tIFwiLi9tdXRhdGlvbnMvcmVtb3ZlUnVubmVyRnJvbVRlYW1cIjtcbmltcG9ydCB0ZWFtU3BvbnNvciBmcm9tIFwiLi9xdWVyaWVzL3RlYW1TcG9uc29yXCI7XG5pbXBvcnQgc2V0VGVhbVNwb25zb3IgZnJvbSBcIi4vbXV0YXRpb25zL3NldFRlYW1TcG9uc29yXCI7XG5pbXBvcnQgcGVyc29uYWxSZXN1bHRzIGZyb20gXCIuL3F1ZXJpZXMvcGVyc29uYWxSZXN1bHRzXCI7XG5pbXBvcnQgdGVhbVJlc3VsdHMgZnJvbSBcIi4vcXVlcmllcy90ZWFtUmVzdWx0c1wiO1xuaW1wb3J0IGFsbFJ1bm5lclJlc3VsdHMgZnJvbSBcIi4vcXVlcmllcy9hbGxSdW5uZXJSZXN1bHRzXCI7XG5pbXBvcnQgc2Nob29sVGVhbVJlc3VsdHMgZnJvbSBcIi4vcXVlcmllcy9zY2hvb2xUZWFtUmVzdWx0c1wiO1xuXG5jb25zdCBzY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgcXVlcnk6IG5ldyBPYmplY3RUeXBlKHtcbiAgICBuYW1lOiAnUXVlcnknLFxuICAgIGZpZWxkczoge1xuICAgICAgbmV3cyxcbiAgICAgIG1lLFxuICAgICAgcnVubmVyTGlzdCxcbiAgICAgIHJ1bm5lcixcbiAgICAgIHNwb25zb3IsXG4gICAgICBzcG9uc29yTGlzdCxcbiAgICAgIHRlYW0sXG4gICAgICB0ZWFtTGlzdCxcbiAgICAgIHJ1bm5lckxhcHMsXG4gICAgICBjaGVja051bWJlcixcbiAgICAgIHRlYW1SdW5uZXJMaXN0LFxuICAgICAgdGVhbVNwb25zb3IsXG4gICAgICBwZXJzb25hbFJlc3VsdHMsXG4gICAgICB0ZWFtUmVzdWx0cyxcbiAgICAgIGFsbFJ1bm5lclJlc3VsdHMsXG4gICAgICBzY2hvb2xUZWFtUmVzdWx0cyxcbiAgICB9LFxuICB9KSxcbiAgbXV0YXRpb246IG5ldyBPYmplY3RUeXBlKHtcbiAgICBuYW1lOiAnTXV0YXRpb24nLFxuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlUnVubmVyLFxuICAgICAgdXBkYXRlUnVubmVyLFxuICAgICAgZGVsZXRlUnVubmVyLFxuICAgICAgY3JlYXRlU3BvbnNvcixcbiAgICAgIGRlbGV0ZVNwb25zb3IsXG4gICAgICB1cGRhdGVTcG9uc29yLFxuICAgICAgY3JlYXRlVGVhbSxcbiAgICAgIHVwZGF0ZVRlYW0sXG4gICAgICBkZWxldGVUZWFtLFxuICAgICAgYWRkTGFwLFxuICAgICAgY3JlYXRlUGVyc29uYWxSdW5uZXIsXG4gICAgICB1cGRhdGVQZXJzb25hbFJ1bm5lcixcbiAgICAgIGFkZFJ1bm5lcnNUb1RlYW0sXG4gICAgICByZW1vdmVSdW5uZXJGcm9tVGVhbSxcbiAgICAgIHNldFRlYW1TcG9uc29yLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNjaGVtYTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9zY2hlbWEuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBTZXF1ZWxpemUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcblxuY29uc3Qgc2VxdWVsaXplID0gbmV3IFNlcXVlbGl6ZShjb25maWcuZGF0YWJhc2VVcmwsIHtcbiAgZGVmaW5lOiB7XG4gICAgZnJlZXplVGFibGVOYW1lOiB0cnVlLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNlcXVlbGl6ZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9zZXF1ZWxpemUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7IEdyYXBoUUxCb29sZWFuLCBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IENoZWNrTnVtYmVyVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0NoZWNrTnVtYmVyVHlwZScsXG4gIGZpZWxkczoge1xuICAgIGF2YWlsYWJsZTogeyB0eXBlOiBHcmFwaFFMQm9vbGVhbiB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNrTnVtYmVyVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9DaGVja051bWJlclR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxGbG9hdCBhcyBGbG9hdFR5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBDcmVhdGVSdW5uZXJJbnB1dFR5cGUsIHtSdW5uZXJJbnB1dEZpZWxkc30gZnJvbSBcIi4vQ3JlYXRlUnVubmVySW5wdXRUeXBlXCI7XG5pbXBvcnQge0NyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHN9IGZyb20gXCIuL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGVcIjtcblxuY29uc3QgUnVubmVyV2l0aFNwb25zb3JJbnB1dCA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1J1bm5lcldpdGhTcG9uc29ySW5wdXQnLFxuICBmaWVsZHM6IHtcbiAgICAuLi5SdW5uZXJJbnB1dEZpZWxkcyxcbiAgICAuLi5DcmVhdGVTcG9uc29ySW5wdXRUeXBlRmllbGRzLFxuICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bm5lcldpdGhTcG9uc29ySW5wdXQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxGbG9hdCBhcyBGbG9hdFR5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuZXhwb3J0IGNvbnN0IFJ1bm5lcklucHV0RmllbGRzID0ge1xuXHRnZW5kZXI6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFN0cmluZ1R5cGUpIH0sXG5cdGZpcnN0TmFtZTogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcblx0bGFzdE5hbWU6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFN0cmluZ1R5cGUpIH0sXG4gIGJpcnRoZGF5OiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuXHRlbWFpbDogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG5cdG51bWJlcjogeyB0eXBlOiBJbnRlZ2VyVHlwZSB9LFxuXHRzcG9uc29yX2lkOiB7IHR5cGU6IElEIH0sXG4gIHRlYW1faWQ6IHsgdHlwZTogSUQgfSxcbn1cblxuY29uc3QgQ3JlYXRlUnVubmVySW5wdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnUnVubmVySW5wdXQnLFxuICBmaWVsZHM6IFJ1bm5lcklucHV0RmllbGRzLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyZWF0ZVJ1bm5lcklucHV0VHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9DcmVhdGVSdW5uZXJJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMQm9vbGVhbiBhcyBCb29sZWFuVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuZXhwb3J0IGNvbnN0IENyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHMgPSB7XG5cdGVtYWlsOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgc3BvbnNvcl9lbWFpbDogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG5cdG5hbWU6IHsgdHlwZTogKFN0cmluZ1R5cGUpIH0sXG5cdGNvbnRhY3RfZmlyc3ROYW1lOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcblx0Y29udGFjdF9sYXN0TmFtZTogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG4gIGNvbnRhY3RfYWRkcmVzczogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG5cdHNwb25zb3JfYW1vdW50OiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcblx0cHJpdmF0ZTogeyB0eXBlOiBCb29sZWFuVHlwZSB9LFxuXHRjYXNoOiB7IHR5cGU6IEJvb2xlYW5UeXBlIH0sXG5cdGRvbmF0aW9uX3JlY2VpcHQ6IHsgdHlwZTogQm9vbGVhblR5cGUgfSxcbiAgZmlmdHlGaWZ0eTogeyB0eXBlOiBCb29sZWFuVHlwZSB9LFxufTtcblxuY29uc3QgQ3JlYXRlU3BvbnNvcklucHV0VHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1Nwb25zb3JJbnB1dCcsXG4gIGZpZWxkczogQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDcmVhdGVTcG9uc29ySW5wdXRUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMRmxvYXQgYXMgRmxvYXRUeXBlLFxuICBHcmFwaFFMQm9vbGVhbiBhcyBCb29sZWFuVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBDcmVhdGVUZWFtSW5wdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnVGVhbUlucHV0JyxcbiAgZmllbGRzOiB7XG4gICAgbmFtZTogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcbiAgICBzcG9uc29yX2lkOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgICBzcG9uc29yX2Ftb3VudDogeyB0eXBlOiBGbG9hdFR5cGUgfSxcbiAgICBpc1NjaG9vbDogeyB0eXBlOiBCb29sZWFuVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyZWF0ZVRlYW1JbnB1dFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvQ3JlYXRlVGVhbUlucHV0VHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxCb29sZWFuIGFzIEJvb2xlYW5UeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuXG5jb25zdCBMYXBUaW1lVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0xhcFRpbWUnLFxuICBmaWVsZHM6IHtcbiAgICBpbmRleDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSW50ZWdlclR5cGUpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pbmRleCxcbiAgICB9LFxuICAgIHRpbWU6IHtcbiAgICAgIHR5cGU6IEludGVnZXJUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy50aW1lLFxuICAgIH1cbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMYXBUaW1lVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9MYXBUaW1lVHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgTmV3c0l0ZW1UeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnTmV3c0l0ZW0nLFxuICBmaWVsZHM6IHtcbiAgICB0aXRsZTogeyB0eXBlOiBuZXcgTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuICAgIGxpbms6IHsgdHlwZTogbmV3IE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcbiAgICBhdXRob3I6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICAgIHB1YkRhdGU6IHsgdHlwZTogbmV3IE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcbiAgICBjb250ZW50OiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBOZXdzSXRlbVR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvTmV3c0l0ZW1UeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEZsb2F0IGFzIEZsb2F0VHlwZSxcbiAgR3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuL1J1bm5lclR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBMYXAgZnJvbSAnLi4vbW9kZWxzL0xhcCc7XG5cbmNvbnN0IFJ1bm5lckxhcHNUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnUnVubmVyTGFwcycsXG4gIGZpZWxkczoge1xuICAgIGNvdW50OiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiBMYXAuY291bnQoeyB3aGVyZTogeyBydW5uZXJfaWQ6IHJlcy5ydW5uZXJfaWQgfSB9KSxcbiAgICB9LFxuICAgIHJ1bm5lcjoge1xuICAgICAgdHlwZTogUnVubmVyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiBSdW5uZXIuZmluZEJ5SWQocmVzLnJ1bm5lcl9pZCksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSdW5uZXJMYXBzVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9SdW5uZXJMYXBzVHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTEludCBhcyBJbnRUeXBlLFxuICBHcmFwaFFMTGlzdCBhcyBMaXN0VHlwZSxcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuL1J1bm5lclR5cGUnO1xuXG5jb25zdCBSdW5uZXJMaXN0VHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1J1bm5lckxpc3QnLFxuICBmaWVsZHM6IHtcbiAgICB0b3RhbDogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgcnVubmVyczoge1xuICAgICAgdHlwZTogbmV3IExpc3RUeXBlKFJ1bm5lclR5cGUpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUnVubmVyTGlzdFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvUnVubmVyTGlzdFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlIGFzIE9iamVjdFR5cGUsXG4gIEdyYXBoUUxJRCBhcyBJRCxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMRmxvYXQgYXMgRmxvYXRUeXBlLFxuICBHcmFwaFFMTGlzdCBhcyBMaXN0VHlwZSxcbiAgR3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgU3BvbnNvclR5cGUgZnJvbSAnLi9TcG9uc29yVHlwZSc7XG5pbXBvcnQgU3BvbnNvciBmcm9tICcuLi9tb2RlbHMvU3BvbnNvcic7XG5pbXBvcnQgTGFwVGltZVR5cGUgZnJvbSAnLi9MYXBUaW1lVHlwZSc7XG5pbXBvcnQgTGFwIGZyb20gJy4uL21vZGVscy9MYXAnO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IFJ1bm5lclR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdSdW5uZXInLFxuICBmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSUQpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pZCxcbiAgICB9LFxuICAgIGZpcnN0TmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZmlyc3ROYW1lLFxuICAgIH0sXG4gICAgbGFzdE5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmxhc3ROYW1lLFxuICAgIH0sXG4gICAgYmlydGhkYXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmJpcnRoZGF5LFxuICAgIH0sXG4gICAgYWdlOiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PlxuICAgICAgICBNYXRoLmZsb29yKFxuICAgICAgICAgIG1vbWVudChuZXcgRGF0ZSgpKS5kaWZmKG1vbWVudChyZXMuYmlydGhkYXkpLCAneWVhcnMnLCB0cnVlKSxcbiAgICAgICAgKSxcbiAgICB9LFxuICAgIGdlbmRlcjoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZ2VuZGVyLFxuICAgIH0sXG4gICAgZW1haWw6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmVtYWlsLFxuICAgIH0sXG4gICAgc3BvbnNvcl9hbW91bnQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLnNwb25zb3JfYW1vdW50LFxuICAgIH0sXG4gICAgbGFwczoge1xuICAgICAgdHlwZTogSW50ZWdlclR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4ge1xuICAgICAgICBpZiAocmVzLmxhcHMpIHtcbiAgICAgICAgICByZXR1cm4gcmVzLmxhcHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIExhcC5jb3VudCh7IHdoZXJlOiB7IHJ1bm5lcl9pZDogcmVzLmlkIH0gfSkudGhlbihjb3VudCA9PiBjb3VudCk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgc3BvbnNvcjoge1xuICAgICAgdHlwZTogU3BvbnNvclR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4ge1xuICAgICAgICBpZiAocmVzLnNwb25zb3IpIHtcbiAgICAgICAgICByZXR1cm4gcmVzLnNwb25zb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNwb25zb3IuZmluZEJ5SWQocmVzLnNwb25zb3JfaWQpO1xuICAgICAgfSxcbiAgICB9LFxuICAgIG51bWJlcjoge1xuICAgICAgdHlwZTogSW50ZWdlclR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLm51bWJlcixcbiAgICB9LFxuICAgIGxhcFRpbWVzOiB7XG4gICAgICB0eXBlOiBuZXcgTGlzdFR5cGUoTGFwVGltZVR5cGUpLFxuICAgICAgcmVzb2x2ZTogKHJlcyk9PntcbiAgICAgICAgICByZXR1cm4gTGFwLmZpbmRBbGwoeyB3aGVyZTogeyBydW5uZXJfaWQ6IHJlcy5pZCB9LCBvcmRlcjpbWydpbnNlcnQnLCAnQVNDJ11dLH0pLnRoZW4obGlzdCA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lcyA9IGxpc3QubWFwKChsYXAsIGluZGV4KT0+e1xuICAgICAgICAgICAgICBpZiAoaW5kZXggPCBsaXN0Lmxlbmd0aC0xKXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4KzEsXG4gICAgICAgICAgICAgICAgICB0aW1lOiBtb21lbnQobGlzdFtpbmRleCsxXS5pbnNlcnQpLmRpZmYobW9tZW50KGxhcC5pbnNlcnQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5maWx0ZXIoaXRlbSA9PiBpdGVtICYmIGl0ZW0udGltZSAhPT0gMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aW1lcztcbiAgICAgICAgICAgIC8vIGNvbnN0IHNvcnRlZCA9IF8uc29ydEJ5KHRpbWVzLCAndGltZScpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc29ydGVkKTtcbiAgICAgICAgICAgIC8vIHJldHVybiBfLmZpcnN0KHNvcnRlZCkudGltZTtcbiAgICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUnVubmVyVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9SdW5uZXJUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMSW50IGFzIEludFR5cGUsXG4gIEdyYXBoUUxMaXN0IGFzIExpc3RUeXBlLFxuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTcG9uc29yVHlwZSBmcm9tICcuL1Nwb25zb3JUeXBlJztcblxuY29uc3QgU3BvbnNvckxpc3RUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnU3BvbnNvckxpc3QnLFxuICBmaWVsZHM6IHtcbiAgICB0b3RhbDogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgc3BvbnNvcnM6IHtcbiAgICAgIHR5cGU6IG5ldyBMaXN0VHlwZShTcG9uc29yVHlwZSksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcG9uc29yTGlzdFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvU3BvbnNvckxpc3RUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEZsb2F0IGFzIEZsb2F0VHlwZSxcbiAgR3JhcGhRTEJvb2xlYW4gYXMgQm9vbGVhblR5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBTcG9uc29yVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1Nwb25zb3InLFxuICBmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSUQpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pZCxcbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLm5hbWUsXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZW1haWwsXG4gICAgfSxcbiAgICBjb250YWN0X2ZpcnN0TmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuY29udGFjdF9maXJzdE5hbWUsXG4gICAgfSxcbiAgICBjb250YWN0X2xhc3ROYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5jb250YWN0X2xhc3ROYW1lLFxuICAgIH0sXG4gICAgY29udGFjdF9hZGRyZXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5jb250YWN0X2FkZHJlc3MsXG4gICAgfSxcbiAgICBzcG9uc29yX2Ftb3VudDoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuc3BvbnNvcl9hbW91bnQsXG4gICAgfSxcbiAgICBwZXJzb25hbDoge1xuICAgICAgdHlwZTogQm9vbGVhblR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLnBlcnNvbmFsLFxuICAgIH0sXG5cbiAgICBjYXNoOiB7XG4gICAgICB0eXBlOiBCb29sZWFuVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuY2FzaCxcbiAgICB9LFxuXG4gICAgZG9uYXRpb25fcmVjZWlwdDoge1xuICAgICAgdHlwZTogQm9vbGVhblR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmRvbmF0aW9uX3JlY2VpcHQsXG4gICAgfSxcblxuXHRcdGZpZnR5RmlmdHk6IHtcblx0XHRcdHR5cGU6IEJvb2xlYW5UeXBlLFxuXHRcdFx0cmVzb2x2ZTogcmVzID0+IHJlcy5maWZ0eUZpZnR5LFxuXHRcdH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3BvbnNvclR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvU3BvbnNvclR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgU3VjY2Vzc1R5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdTdWNjZXNzJyxcbiAgZmllbGRzOiB7XG4gICAgc3VjY2VzczogeyB0eXBlOiBHcmFwaFFMQm9vbGVhbiB9LFxuICAgIG1lc3NhZ2U6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFN1Y2Nlc3NUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1N1Y2Nlc3NUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMSW50IGFzIEludFR5cGUsXG4gIEdyYXBoUUxMaXN0IGFzIExpc3RUeXBlLFxuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBUZWFtVHlwZSBmcm9tICcuL1RlYW1UeXBlJztcblxuY29uc3QgVGVhbUxpc3RUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnVGVhbUxpc3QnLFxuICBmaWVsZHM6IHtcbiAgICB0b3RhbDogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgdGVhbXM6IHtcbiAgICAgIHR5cGU6IG5ldyBMaXN0VHlwZShUZWFtVHlwZSksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZWFtTGlzdFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvVGVhbUxpc3RUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcbiAgR3JhcGhRTEJvb2xlYW4gYXMgQm9vbGVhblR5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gJy4vU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi8uLi9tb2RlbHMvU3BvbnNvcic7XG5pbXBvcnQgc2VxdWVsaXplIGZyb20gJy4vLi4vc2VxdWVsaXplJztcbmltcG9ydCBMYXAgZnJvbSAnLi4vbW9kZWxzL0xhcCc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4uL21vZGVscy9SdW5uZXInO1xuXG5jb25zdCBUZWFtVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1RlYW0nLFxuICBmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSUQpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pZCxcbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLm5hbWUsXG4gICAgfSxcbiAgICBzcG9uc29yOiB7XG4gICAgICB0eXBlOiBTcG9uc29yVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiBTcG9uc29yLmZpbmRCeUlkKHJlcy5zcG9uc29yX2lkKSxcbiAgICB9LFxuICAgIGlzU2Nob29sOiB7XG4gICAgICB0eXBlOiBCb29sZWFuVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuaXNTY2hvb2wsXG4gICAgfSxcbiAgICBsYXBzOiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMubGFwcykge1xuICAgICAgICAgIHJldHVybiByZXMubGFwcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VxdWVsaXplXG4gICAgICAgICAgLnF1ZXJ5KFxuICAgICAgICAgICAgYFNFTEVDVCBjb3VudCgqKSBhcyBjb3VudCBGUk9NIExhcCBMRUZUIEpPSU4gUnVubmVyIE9OIExhcC5ydW5uZXJfaWQgPSBSdW5uZXIuaWQgV0hFUkUgUnVubmVyLnRlYW1faWQgPSAnJHtyZXMuaWR9J2AsXG4gICAgICAgICAgKVxuICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoICYmIHJlc3VsdHNbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzWzBdWzBdLmNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgdGVhbV9zaXplOiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMudGVhbV9zaXplKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcy50ZWFtX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJ1bm5lci5jb3VudCh7IHdoZXJlOiB7IHRlYW1faWQ6IHJlcy5pZCB9IH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRlYW1UeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1RlYW1UeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IFVzZXJUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnVXNlcicsXG4gIGZpZWxkczoge1xuICAgIGlkOiB7IHR5cGU6IG5ldyBOb25OdWxsKElEKSB9LFxuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9Vc2VyVHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyoqXG4gKiBQYXNzcG9ydC5qcyByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24uXG4gKiBUaGUgZGF0YWJhc2Ugc2NoZW1hIHVzZWQgaW4gdGhpcyBzYW1wbGUgaXMgYXZhaWxhYmxlIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWVtYmVyc2hpcC9tZW1iZXJzaGlwLmRiL3RyZWUvbWFzdGVyL3Bvc3RncmVzXG4gKi9cblxuaW1wb3J0IHBhc3Nwb3J0IGZyb20gJ3Bhc3Nwb3J0JztcbmltcG9ydCB7IFN0cmF0ZWd5IGFzIEZhY2Vib29rU3RyYXRlZ3kgfSBmcm9tICdwYXNzcG9ydC1mYWNlYm9vayc7XG5pbXBvcnQgeyBVc2VyLCBVc2VyTG9naW4sIFVzZXJDbGFpbSwgVXNlclByb2ZpbGUgfSBmcm9tICcuL2RhdGEvbW9kZWxzJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuXG4vKipcbiAqIFNpZ24gaW4gd2l0aCBGYWNlYm9vay5cbiAqL1xucGFzc3BvcnQudXNlKFxuICBuZXcgRmFjZWJvb2tTdHJhdGVneShcbiAgICB7XG4gICAgICBjbGllbnRJRDogY29uZmlnLmF1dGguZmFjZWJvb2suaWQsXG4gICAgICBjbGllbnRTZWNyZXQ6IGNvbmZpZy5hdXRoLmZhY2Vib29rLnNlY3JldCxcbiAgICAgIGNhbGxiYWNrVVJMOiAnL2xvZ2luL2ZhY2Vib29rL3JldHVybicsXG4gICAgICBwcm9maWxlRmllbGRzOiBbXG4gICAgICAgICdkaXNwbGF5TmFtZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ2VtYWlsJyxcbiAgICAgICAgJ2xpbmsnLFxuICAgICAgICAnbG9jYWxlJyxcbiAgICAgICAgJ3RpbWV6b25lJyxcbiAgICAgIF0sXG4gICAgICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZSxcbiAgICB9LFxuICAgIChyZXEsIGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4sIHByb2ZpbGUsIGRvbmUpID0+IHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4gICAgICBjb25zdCBsb2dpbk5hbWUgPSAnZmFjZWJvb2snO1xuICAgICAgY29uc3QgY2xhaW1UeXBlID0gJ3VybjpmYWNlYm9vazphY2Nlc3NfdG9rZW4nO1xuICAgICAgY29uc3QgZm9vQmFyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAocmVxLnVzZXIpIHtcbiAgICAgICAgICBjb25zdCB1c2VyTG9naW4gPSBhd2FpdCBVc2VyTG9naW4uZmluZE9uZSh7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ25hbWUnLCAna2V5J10sXG4gICAgICAgICAgICB3aGVyZTogeyBuYW1lOiBsb2dpbk5hbWUsIGtleTogcHJvZmlsZS5pZCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyTG9naW4pIHtcbiAgICAgICAgICAgIC8vIFRoZXJlIGlzIGFscmVhZHkgYSBGYWNlYm9vayBhY2NvdW50IHRoYXQgYmVsb25ncyB0byB5b3UuXG4gICAgICAgICAgICAvLyBTaWduIGluIHdpdGggdGhhdCBhY2NvdW50IG9yIGRlbGV0ZSBpdCwgdGhlbiBsaW5rIGl0IHdpdGggeW91ciBjdXJyZW50IGFjY291bnQuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmNyZWF0ZShcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiByZXEudXNlci5pZCxcbiAgICAgICAgICAgICAgICBlbWFpbDogcHJvZmlsZS5fanNvbi5lbWFpbCxcbiAgICAgICAgICAgICAgICBsb2dpbnM6IFt7IG5hbWU6IGxvZ2luTmFtZSwga2V5OiBwcm9maWxlLmlkIH1dLFxuICAgICAgICAgICAgICAgIGNsYWltczogW3sgdHlwZTogY2xhaW1UeXBlLCB2YWx1ZTogcHJvZmlsZS5pZCB9XSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB7XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcHJvZmlsZS5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgIGdlbmRlcjogcHJvZmlsZS5fanNvbi5nZW5kZXIsXG4gICAgICAgICAgICAgICAgICBwaWN0dXJlOiBgaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtwcm9maWxlLmlkfS9waWN0dXJlP3R5cGU9bGFyZ2VgLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyTG9naW4sIGFzOiAnbG9naW5zJyB9LFxuICAgICAgICAgICAgICAgICAgeyBtb2RlbDogVXNlckNsYWltLCBhczogJ2NsYWltcycgfSxcbiAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJQcm9maWxlLCBhczogJ3Byb2ZpbGUnIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkb25lKG51bGwsIHtcbiAgICAgICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgVXNlci5maW5kQWxsKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnaWQnLCAnZW1haWwnXSxcbiAgICAgICAgICAgIHdoZXJlOiB7ICckbG9naW5zLm5hbWUkJzogbG9naW5OYW1lLCAnJGxvZ2lucy5rZXkkJzogcHJvZmlsZS5pZCB9LFxuICAgICAgICAgICAgaW5jbHVkZTogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogWyduYW1lJywgJ2tleSddLFxuICAgICAgICAgICAgICAgIG1vZGVsOiBVc2VyTG9naW4sXG4gICAgICAgICAgICAgICAgYXM6ICdsb2dpbnMnLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdXNlcnNbMF0uZ2V0KHsgcGxhaW46IHRydWUgfSk7XG4gICAgICAgICAgICBkb25lKG51bGwsIHVzZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdXNlciA9IGF3YWl0IFVzZXIuZmluZE9uZSh7XG4gICAgICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBwcm9maWxlLl9qc29uLmVtYWlsIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgIC8vIFRoZXJlIGlzIGFscmVhZHkgYW4gYWNjb3VudCB1c2luZyB0aGlzIGVtYWlsIGFkZHJlc3MuIFNpZ24gaW4gdG9cbiAgICAgICAgICAgICAgLy8gdGhhdCBhY2NvdW50IGFuZCBsaW5rIGl0IHdpdGggRmFjZWJvb2sgbWFudWFsbHkgZnJvbSBBY2NvdW50IFNldHRpbmdzLlxuICAgICAgICAgICAgICBkb25lKG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXNlciA9IGF3YWl0IFVzZXIuY3JlYXRlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGVtYWlsOiBwcm9maWxlLl9qc29uLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgZW1haWxDb25maXJtZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBsb2dpbnM6IFt7IG5hbWU6IGxvZ2luTmFtZSwga2V5OiBwcm9maWxlLmlkIH1dLFxuICAgICAgICAgICAgICAgICAgY2xhaW1zOiBbeyB0eXBlOiBjbGFpbVR5cGUsIHZhbHVlOiBhY2Nlc3NUb2tlbiB9XSxcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHByb2ZpbGUuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGdlbmRlcjogcHJvZmlsZS5fanNvbi5nZW5kZXIsXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2ZpbGUuaWR9L3BpY3R1cmU/dHlwZT1sYXJnZWAsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaW5jbHVkZTogW1xuICAgICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyTG9naW4sIGFzOiAnbG9naW5zJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyQ2xhaW0sIGFzOiAnY2xhaW1zJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyUHJvZmlsZSwgYXM6ICdwcm9maWxlJyB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBkb25lKG51bGwsIHtcbiAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb29CYXIoKS5jYXRjaChkb25lKTtcbiAgICB9LFxuICApLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgcGFzc3BvcnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3Bhc3Nwb3J0LmpzIiwiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHVzZXIgZnJvbSAnLi91c2VyJztcbmltcG9ydCBydW50aW1lIGZyb20gJy4vcnVudGltZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVJvb3RSZWR1Y2VyKHsgYXBvbGxvQ2xpZW50IH0pIHtcbiAgcmV0dXJuIGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgYXBvbGxvOiBhcG9sbG9DbGllbnQucmVkdWNlcigpLFxuICAgIHVzZXIsXG4gICAgcnVudGltZSxcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JlZHVjZXJzL2luZGV4LmpzIiwiaW1wb3J0IHsgU0VUX1JVTlRJTUVfVkFSSUFCTEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBydW50aW1lKHN0YXRlID0ge30sIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBTRVRfUlVOVElNRV9WQVJJQUJMRTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBbYWN0aW9uLnBheWxvYWQubmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JlZHVjZXJzL3J1bnRpbWUuanMiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VyKHN0YXRlID0ge30sIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9yZWR1Y2Vycy91c2VyLmpzIiwiaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gJ3FyY29kZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSAnYXN5bmMnO1xuaW1wb3J0ICogYXMgcGRmIGZyb20gJ2h0bWwtcGRmJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGJhc2U2NGltZyBmcm9tICdiYXNlNjQtaW1nJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVRUkNvZGVzKHJlcSwgcmVzKSB7XG4gIGNvbnN0IG9wdGlvbnMgPSB7IGZvcm1hdDogJ0xldHRlcicgfTtcbiAgY29uc3QgaHRtbCA9IGZzLnJlYWRGaWxlU3luYyhcbiAgICBwYXRoLnJlc29sdmUoJy4vc3JjL3JlcXVlc3RzL3FyLWNvZGUtc2hlZXQtdGVtcGxhdGUuaHRtbCcpLFxuICAgICd1dGY4JyxcbiAgKTtcbiAgY29uc3QgZmlsZXBhdGggPSBwYXRoLnJlc29sdmUoYC4vdG1wLyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9X3FyY29kZXMucGRmYCk7XG5cbiAgY29uc3QgY29kZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDEwMDsgaSA8IDEwMDA7IGkrKykge1xuICAgIGNvZGVzLnB1c2goe1xuICAgICAgdGV4dDogYCR7aX1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMuZWFjaFNlcmllcyhcbiAgICBjb2RlcyxcbiAgICAoY29kZSwgY2FsbGJhY2spID0+IHtcbiAgICAgIFFSQ29kZS5kcmF3U3ZnKFxuICAgICAgICBjb2RlLnRleHQsXG4gICAgICAgIHtcbiAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogJ0gnLFxuICAgICAgICB9LFxuICAgICAgICAoZXJyLCBzdmdDb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBjb2RlcGF0aCA9IHBhdGgucmVzb2x2ZShgLi90bXAvcXJjb2RlXyR7Y29kZS50ZXh0fS5zdmdgKTtcbiAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoY29kZXBhdGgpKSB7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGUoY29kZXBhdGgsIHN2Z0NvZGUsIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgY29kZS5pbWFnZSA9IGNvZGVwYXRoO1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29kZS5pbWFnZSA9IGNvZGVwYXRoO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gICAgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnIpO1xuXG4gICAgICAvLyBjb25zdCBsb2dvQmFzZTY0ID0gYmFzZTY0aW1nLmJhc2U2NFN5bmMoXG4gICAgICAvLyAgIHBhdGgucmVzb2x2ZShgLi9wdWJsaWMvdW5pY2VmX2xvZ28uanBnYCksXG4gICAgICAvLyApO1xuICAgICAgLy8gY29uc29sZS5sb2cobG9nb0Jhc2U2NCk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoaHRtbCk7XG4gICAgICBjb25zdCBhc3NldFBhdGggPSBgZmlsZTovLyR7cGF0aC5yZXNvbHZlKCcuLycpfS9gO1xuICAgICAgcGRmXG4gICAgICAgIC5jcmVhdGUodGVtcGxhdGUoeyBjb2RlcyB9KSwge1xuICAgICAgICAgIGJhc2U6IGFzc2V0UGF0aCxcbiAgICAgICAgICB0aW1lb3V0OiA2MDAwMCxcbiAgICAgICAgfSlcbiAgICAgICAgLnRvRmlsZShmaWxlcGF0aCwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5zZW5kKGVycik7XG4gICAgICAgICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcmVxdWVzdHMvZ2VuZXJhdGUtcXJjb2Rlcy5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJvdXRlciBmcm9tICd1bml2ZXJzYWwtcm91dGVyJztcbmltcG9ydCByb3V0ZXMgZnJvbSAnLi9yb3V0ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBuZXcgUm91dGVyKHJvdXRlcywge1xuICByZXNvbHZlUm91dGUoY29udGV4dCwgcGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBjb250ZXh0LnJvdXRlLmxvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjb250ZXh0LnJvdXRlXG4gICAgICAgIC5sb2FkKClcbiAgICAgICAgLnRoZW4oYWN0aW9uID0+IGFjdGlvbi5kZWZhdWx0KGNvbnRleHQsIHBhcmFtcykpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnRleHQucm91dGUuYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY29udGV4dC5yb3V0ZS5hY3Rpb24oY29udGV4dCwgcGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcm91dGVyLmpzIiwiXG4gICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLXJ1bGVzLTMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLXJ1bGVzLTQhLi9FcnJvclBhZ2UuY3NzXCIpO1xuICAgIHZhciBpbnNlcnRDc3MgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHMgfHwge307XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENvbnRlbnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQ7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENzcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudC50b1N0cmluZygpOyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9pbnNlcnRDc3MgPSBmdW5jdGlvbihvcHRpb25zKSB7IHJldHVybiBpbnNlcnRDc3MoY29udGVudCwgb3B0aW9ucykgfTtcbiAgICBcbiAgICAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4gICAgLy8gaHR0cHM6Ly93ZWJwYWNrLmdpdGh1Yi5pby9kb2NzL2hvdC1tb2R1bGUtcmVwbGFjZW1lbnRcbiAgICAvLyBPbmx5IGFjdGl2YXRlZCBpbiBicm93c2VyIGNvbnRleHRcbiAgICBpZiAobW9kdWxlLmhvdCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICAgIHZhciByZW1vdmVDc3MgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtMyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtNCEuL0Vycm9yUGFnZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0yLXJ1bGVzLTMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yLXJ1bGVzLTQhLi9FcnJvclBhZ2UuY3NzXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDc3MgPSBpbnNlcnRDc3MoY29udGVudCwgeyByZXBsYWNlOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHJlbW92ZUNzcygpOyB9KTtcbiAgICB9XG4gIFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB3aXRoU3R5bGVzIGZyb20gJ2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzJztcbmltcG9ydCBzIGZyb20gJy4vRXJyb3JQYWdlLmNzcyc7XG5cbmNsYXNzIEVycm9yUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZXJyb3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBzdGFjazogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZXJyb3I6IG51bGwsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChfX0RFVl9fICYmIHRoaXMucHJvcHMuZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGgxPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuZXJyb3IubmFtZX1cbiAgICAgICAgICA8L2gxPlxuICAgICAgICAgIDxwcmU+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5lcnJvci5zdGFja31cbiAgICAgICAgICA8L3ByZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+RXJyb3I8L2gxPlxuICAgICAgICA8cD5Tb3JyeSwgYSBjcml0aWNhbCBlcnJvciBvY2N1cnJlZCBvbiB0aGlzIHBhZ2UuPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgeyBFcnJvclBhZ2UgYXMgRXJyb3JQYWdlV2l0aG91dFN0eWxlIH07XG5leHBvcnQgZGVmYXVsdCB3aXRoU3R5bGVzKHMpKEVycm9yUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRXJyb3JQYWdlIGZyb20gJy4vRXJyb3JQYWdlJztcblxuZnVuY3Rpb24gYWN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRpdGxlOiAnRGVtbyBFcnJvcicsXG4gICAgY29tcG9uZW50OiA8RXJyb3JQYWdlIC8+LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlcy9lcnJvci9pbmRleC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cblxuLy8gVGhlIHRvcC1sZXZlbCAocGFyZW50KSByb3V0ZVxuY29uc3Qgcm91dGVzID0ge1xuICBwYXRoOiAnLycsXG5cbiAgLy8gS2VlcCBpbiBtaW5kLCByb3V0ZXMgYXJlIGV2YWx1YXRlZCBpbiBvcmRlclxuICBjaGlsZHJlbjogW1xuICAgIHtcbiAgICAgIHBhdGg6ICcvJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnaG9tZScgKi8gJy4vaG9tZScpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9jb250YWN0JyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnY29udGFjdCcgKi8gJy4vY29udGFjdCcpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9sb2dpbicsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ2xvZ2luJyAqLyAnLi9sb2dpbicpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9yZWdpc3RlcicsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3JlZ2lzdGVyJyAqLyAnLi9yZWdpc3RlcicpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9hYm91dCcsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ2Fib3V0JyAqLyAnLi9hYm91dCcpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9wcml2YWN5JyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAncHJpdmFjeScgKi8gJy4vcHJpdmFjeScpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9pbXBvcnQnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdpbXBvcnQnICovICcuL2ltcG9ydCcpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9ydW5uZXJzJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAncnVubmVycycgKi8gJy4vcnVubmVycycpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9ydW5uZXJzL2NyZWF0ZScsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3J1bm5lcnMtY3JlYXRlJyAqLyAnLi9ydW5uZXJzL2NyZWF0ZScpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9ydW5uZXJzLzppZCcsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3J1bm5lcnMtdXBkYXRlJyAqLyAnLi9ydW5uZXJzL3VwZGF0ZScpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9zcG9uc29ycycsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3Nwb25zb3JzJyAqLyAnLi9zcG9uc29ycycpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9zcG9uc29ycy9jcmVhdGUnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdzcG9uc29ycy1jcmVhdGUnICovICcuL3Nwb25zb3JzL2NyZWF0ZScpLFxuICAgIH0sXG4gICAgLy8gV2lsZGNhcmQgcm91dGVzLCBlLmcuIHsgcGF0aDogJyonLCAuLi4gfSAobXVzdCBnbyBsYXN0KVxuICAgIHtcbiAgICAgIHBhdGg6ICcqJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnbm90LWZvdW5kJyAqLyAnLi9ub3QtZm91bmQnKSxcbiAgICB9LFxuICBdLFxuXG4gIGFzeW5jIGFjdGlvbih7IG5leHQgfSkge1xuICAgIC8vIEV4ZWN1dGUgZWFjaCBjaGlsZCByb3V0ZSB1bnRpbCBvbmUgb2YgdGhlbSByZXR1cm4gdGhlIHJlc3VsdFxuICAgIGNvbnN0IHJvdXRlID0gYXdhaXQgbmV4dCgpO1xuXG4gICAgLy8gUHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgdGl0bGUsIGRlc2NyaXB0aW9uIGV0Yy5cbiAgICByb3V0ZS50aXRsZSA9IGAke3JvdXRlLnRpdGxlIHx8ICdVbnRpdGxlZCBQYWdlJ30gLSB3d3cucmVhY3RzdGFydGVya2l0LmNvbWA7XG4gICAgcm91dGUuZGVzY3JpcHRpb24gPSByb3V0ZS5kZXNjcmlwdGlvbiB8fCAnJztcblxuICAgIHJldHVybiByb3V0ZTtcbiAgfSxcbn07XG5cbi8vIFRoZSBlcnJvciBwYWdlIGlzIGF2YWlsYWJsZSBieSBwZXJtYW5lbnQgdXJsIGZvciBkZXZlbG9wbWVudCBtb2RlXG5pZiAoX19ERVZfXykge1xuICByb3V0ZXMuY2hpbGRyZW4udW5zaGlmdCh7XG4gICAgcGF0aDogJy9lcnJvcicsXG4gICAgYWN0aW9uOiByZXF1aXJlKCcuL2Vycm9yJykuZGVmYXVsdCxcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcm91dGVzL2luZGV4LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGNvb2tpZVBhcnNlciBmcm9tICdjb29raWUtcGFyc2VyJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBleHByZXNzSnd0LCB7IFVuYXV0aG9yaXplZEVycm9yIGFzIEp3dDQwMUVycm9yIH0gZnJvbSAnZXhwcmVzcy1qd3QnO1xuaW1wb3J0IGV4cHJlc3NHcmFwaFFMIGZyb20gJ2V4cHJlc3MtZ3JhcGhxbCc7XG5pbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgbm9kZUZldGNoIGZyb20gJ25vZGUtZmV0Y2gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vc2VydmVyJztcbmltcG9ydCB7IGdldERhdGFGcm9tVHJlZSB9IGZyb20gJ3JlYWN0LWFwb2xsbyc7XG5pbXBvcnQgUHJldHR5RXJyb3IgZnJvbSAncHJldHR5LWVycm9yJztcbmltcG9ydCBjcmVhdGVBcG9sbG9DbGllbnQgZnJvbSAnLi9jb3JlL2NyZWF0ZUFwb2xsb0NsaWVudCc7XG5pbXBvcnQgQXBwIGZyb20gJy4vY29tcG9uZW50cy9BcHAnO1xuaW1wb3J0IEh0bWwgZnJvbSAnLi9jb21wb25lbnRzL0h0bWwnO1xuaW1wb3J0IHsgRXJyb3JQYWdlV2l0aG91dFN0eWxlIH0gZnJvbSAnLi9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlJztcbmltcG9ydCBlcnJvclBhZ2VTdHlsZSBmcm9tICcuL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzJztcbmltcG9ydCBjcmVhdGVGZXRjaCBmcm9tICcuL2NyZWF0ZUZldGNoJztcbmltcG9ydCBwYXNzcG9ydCBmcm9tICcuL3Bhc3Nwb3J0JztcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9yb3V0ZXInO1xuaW1wb3J0IG1vZGVscyBmcm9tICcuL2RhdGEvbW9kZWxzJztcbmltcG9ydCBzY2hlbWEgZnJvbSAnLi9kYXRhL3NjaGVtYSc7XG5pbXBvcnQgYXNzZXRzIGZyb20gJy4vYXNzZXRzLmpzb24nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgY29uZmlndXJlU3RvcmUgZnJvbSAnLi9zdG9yZS9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgeyBzZXRSdW50aW1lVmFyaWFibGUgfSBmcm9tICcuL2FjdGlvbnMvcnVudGltZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHBvc3RDU1ZJbXBvcnQgfSBmcm9tICcuL2RhdGEvaW1wb3J0L2ltcG9ydC1yZXF1ZXN0JztcbmltcG9ydCAqIGFzIGZpbGVVcGxvYWQgZnJvbSAnZXhwcmVzcy1maWxldXBsb2FkJztcbmltcG9ydCBnZW5lcmF0ZVFSQ29kZXMgZnJvbSAnLi9yZXF1ZXN0cy9nZW5lcmF0ZS1xcmNvZGVzJztcbmltcG9ydCBMYXBTaW11bGF0b3IgZnJvbSBcIi4vc2ltdWxhdG9yXCI7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuLy9cbi8vIFRlbGwgYW55IENTUyB0b29saW5nIChzdWNoIGFzIE1hdGVyaWFsIFVJKSB0byB1c2UgYWxsIHZlbmRvciBwcmVmaXhlcyBpZiB0aGVcbi8vIHVzZXIgYWdlbnQgaXMgbm90IGtub3duLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmdsb2JhbC5uYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yIHx8IHt9O1xuZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQgPSBnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnYWxsJztcblxuLy9cbi8vIFJlZ2lzdGVyIE5vZGUuanMgbWlkZGxld2FyZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpKSk7XG5hcHAudXNlKGNvb2tpZVBhcnNlcigpKTtcbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpO1xuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG5cbi8vXG4vLyBBdXRoZW50aWNhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC51c2UoXG4gIGV4cHJlc3NKd3Qoe1xuICAgIHNlY3JldDogY29uZmlnLmF1dGguand0LnNlY3JldCxcbiAgICBjcmVkZW50aWFsc1JlcXVpcmVkOiBmYWxzZSxcbiAgICBnZXRUb2tlbjogcmVxID0+IHJlcS5jb29raWVzLmlkX3Rva2VuLFxuICB9KSxcbik7XG4vLyBFcnJvciBoYW5kbGVyIGZvciBleHByZXNzLWp3dFxuYXBwLnVzZSgoZXJyLCByZXEsIHJlcywgbmV4dCkgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIGlmIChlcnIgaW5zdGFuY2VvZiBKd3Q0MDFFcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tleHByZXNzLWp3dC1lcnJvcl0nLCByZXEuY29va2llcy5pZF90b2tlbik7XG4gICAgLy8gYGNsZWFyQ29va2llYCwgb3RoZXJ3aXNlIHVzZXIgY2FuJ3QgdXNlIHdlYi1hcHAgdW50aWwgY29va2llIGV4cGlyZXNcbiAgICByZXMuY2xlYXJDb29raWUoJ2lkX3Rva2VuJyk7XG4gIH1cbiAgbmV4dChlcnIpO1xufSk7XG5cbmFwcC51c2UocGFzc3BvcnQuaW5pdGlhbGl6ZSgpKTtcblxuaWYgKF9fREVWX18pIHtcbiAgYXBwLmVuYWJsZSgndHJ1c3QgcHJveHknKTtcbn1cbi8vIGNvbnN0IHNpbXVsYXRvciA9IG5ldyBMYXBTaW11bGF0b3IoKTtcbi8vIHNpbXVsYXRvci5zdGFydCgpO1xuXG5cbmFwcC5nZXQoJy9nZW5lcmF0ZS1xcmNvZGVzJywgZ2VuZXJhdGVRUkNvZGVzKTtcbmFwcC5nZXQoXG4gICcvbG9naW4vZmFjZWJvb2snLFxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rJywge1xuICAgIHNjb3BlOiBbJ2VtYWlsJywgJ3VzZXJfbG9jYXRpb24nXSxcbiAgICBzZXNzaW9uOiBmYWxzZSxcbiAgfSksXG4pO1xuYXBwLmdldChcbiAgJy9sb2dpbi9mYWNlYm9vay9yZXR1cm4nLFxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rJywge1xuICAgIGZhaWx1cmVSZWRpcmVjdDogJy9sb2dpbicsXG4gICAgc2Vzc2lvbjogZmFsc2UsXG4gIH0pLFxuICAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBleHBpcmVzSW4gPSA2MCAqIDYwICogMjQgKiAxODA7IC8vIDE4MCBkYXlzXG4gICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbihyZXEudXNlciwgY29uZmlnLmF1dGguand0LnNlY3JldCwgeyBleHBpcmVzSW4gfSk7XG4gICAgcmVzLmNvb2tpZSgnaWRfdG9rZW4nLCB0b2tlbiwgeyBtYXhBZ2U6IDEwMDAgKiBleHBpcmVzSW4sIGh0dHBPbmx5OiB0cnVlIH0pO1xuICAgIHJlcy5yZWRpcmVjdCgnLycpO1xuICB9LFxuKTtcbmFwcC51c2UoZmlsZVVwbG9hZCgpKTtcbmFwcC5wb3N0KCcvdXBsb2FkJywgcG9zdENTVkltcG9ydCk7XG5cbi8vXG4vLyBSZWdpc3RlciBBUEkgbWlkZGxld2FyZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGdyYXBocWxNaWRkbGV3YXJlID0gZXhwcmVzc0dyYXBoUUwocmVxID0+ICh7XG4gIHNjaGVtYSxcbiAgZ3JhcGhpcWw6IF9fREVWX18sXG4gIHJvb3RWYWx1ZTogeyByZXF1ZXN0OiByZXEgfSxcbiAgcHJldHR5OiBfX0RFVl9fLFxufSkpO1xuXG5hcHAudXNlKCcvZ3JhcGhxbCcsIGdyYXBocWxNaWRkbGV3YXJlKTtcblxuLy9cbi8vIFJlZ2lzdGVyIHNlcnZlci1zaWRlIHJlbmRlcmluZyBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLmdldCgnKicsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGNzcyA9IG5ldyBTZXQoKTtcblxuICAgIGNvbnN0IGFwb2xsb0NsaWVudCA9IGNyZWF0ZUFwb2xsb0NsaWVudCh7XG4gICAgICBzY2hlbWEsXG4gICAgICByb290VmFsdWU6IHsgcmVxdWVzdDogcmVxIH0sXG4gICAgfSk7XG5cbiAgICAvLyBVbml2ZXJzYWwgSFRUUCBjbGllbnRcbiAgICBjb25zdCBmZXRjaCA9IGNyZWF0ZUZldGNoKG5vZGVGZXRjaCwge1xuICAgICAgYmFzZVVybDogY29uZmlnLmFwaS5zZXJ2ZXJVcmwsXG4gICAgICBjb29raWU6IHJlcS5oZWFkZXJzLmNvb2tpZSxcbiAgICAgIGFwb2xsb0NsaWVudCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICAgIHVzZXI6IHJlcS51c2VyIHx8IG51bGwsXG4gICAgfTtcblxuICAgIGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoaW5pdGlhbFN0YXRlLCB7XG4gICAgICBjb29raWU6IHJlcS5oZWFkZXJzLmNvb2tpZSxcbiAgICAgIGFwb2xsb0NsaWVudCxcbiAgICAgIGZldGNoLFxuICAgICAgLy8gSSBzaG91bGQgbm90IHVzZSBgaGlzdG9yeWAgb24gc2VydmVyLi4gYnV0IGhvdyBJIGRvIHJlZGlyZWN0aW9uPyBmb2xsb3cgdW5pdmVyc2FsLXJvdXRlclxuICAgICAgaGlzdG9yeTogbnVsbCxcbiAgICB9KTtcblxuICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgc2V0UnVudGltZVZhcmlhYmxlKHtcbiAgICAgICAgbmFtZTogJ2luaXRpYWxOb3cnLFxuICAgICAgICB2YWx1ZTogRGF0ZS5ub3coKSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBHbG9iYWwgKGNvbnRleHQpIHZhcmlhYmxlcyB0aGF0IGNhbiBiZSBlYXNpbHkgYWNjZXNzZWQgZnJvbSBhbnkgUmVhY3QgY29tcG9uZW50XG4gICAgLy8gaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy9jb250ZXh0Lmh0bWxcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgLy8gRW5hYmxlcyBjcml0aWNhbCBwYXRoIENTUyByZW5kZXJpbmdcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlhc29mdC9pc29tb3JwaGljLXN0eWxlLWxvYWRlclxuICAgICAgaW5zZXJ0Q3NzOiAoLi4uc3R5bGVzKSA9PiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICBjb25zb2xlLmxvZyhzdHlsZXMpO1xuICAgICAgICBzdHlsZXMuZm9yRWFjaChzdHlsZSA9PiBjc3MuYWRkKHN0eWxlLl9nZXRDc3MoKSkpO1xuICAgICAgfSxcbiAgICAgIGZldGNoLFxuICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgcmVkdXggdGhyb3VnaCByZWFjdC1yZWR1eCBjb25uZWN0XG4gICAgICBzdG9yZSxcbiAgICAgIHN0b3JlU3Vic2NyaXB0aW9uOiBudWxsLFxuICAgICAgLy8gQXBvbGxvIENsaWVudCBmb3IgdXNlIHdpdGggcmVhY3QtYXBvbGxvXG4gICAgICBjbGllbnQ6IGFwb2xsb0NsaWVudCxcbiAgICB9O1xuXG4gICAgY29uc3Qgcm91dGUgPSBhd2FpdCByb3V0ZXIucmVzb2x2ZSh7XG4gICAgICAuLi5jb250ZXh0LFxuICAgICAgcGF0aDogcmVxLnBhdGgsXG4gICAgICBxdWVyeTogcmVxLnF1ZXJ5LFxuICAgIH0pO1xuXG4gICAgaWYgKHJvdXRlLnJlZGlyZWN0KSB7XG4gICAgICByZXMucmVkaXJlY3Qocm91dGUuc3RhdHVzIHx8IDMwMiwgcm91dGUucmVkaXJlY3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB7IC4uLnJvdXRlIH07XG5cbiAgICBjb25zdCByb290Q29tcG9uZW50ID0gKFxuICAgICAgPEFwcCBjb250ZXh0PXtjb250ZXh0fSBzdG9yZT17c3RvcmV9PlxuICAgICAgICB7cm91dGUuY29tcG9uZW50fVxuICAgICAgPC9BcHA+XG4gICAgKTtcbiAgICBhd2FpdCBnZXREYXRhRnJvbVRyZWUocm9vdENvbXBvbmVudCk7XG4gICAgLy8gdGhpcyBpcyBoZXJlIGJlY2F1c2Ugb2YgQXBvbGxvIHJlZHV4IEFQT0xMT19RVUVSWV9TVE9QIGFjdGlvblxuICAgIGF3YWl0IFByb21pc2UuZGVsYXkoMCk7XG4gICAgZGF0YS5jaGlsZHJlbiA9IGF3YWl0IFJlYWN0RE9NLnJlbmRlclRvU3RyaW5nKHJvb3RDb21wb25lbnQpO1xuICAgIGRhdGEuc3R5bGVzID0gW3sgaWQ6ICdjc3MnLCBjc3NUZXh0OiBbLi4uY3NzXS5qb2luKCcnKSB9XTtcblxuICAgIGRhdGEuc2NyaXB0cyA9IFthc3NldHMudmVuZG9yLmpzXTtcbiAgICBpZiAocm91dGUuY2h1bmtzKSB7XG4gICAgICBkYXRhLnNjcmlwdHMucHVzaCguLi5yb3V0ZS5jaHVua3MubWFwKGNodW5rID0+IGFzc2V0c1tjaHVua10uanMpKTtcbiAgICB9XG4gICAgZGF0YS5zY3JpcHRzLnB1c2goYXNzZXRzLmNsaWVudC5qcyk7XG5cbiAgICAvLyBGdXJ0aGVybW9yZSBpbnZva2VkIGFjdGlvbnMgd2lsbCBiZSBpZ25vcmVkLCBjbGllbnQgd2lsbCBub3QgcmVjZWl2ZSB0aGVtIVxuICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coJ1NlcmlhbGl6aW5nIHN0b3JlLi4uJyk7XG4gICAgfVxuICAgIGRhdGEuYXBwID0ge1xuICAgICAgYXBpVXJsOiBjb25maWcuYXBpLmNsaWVudFVybCxcbiAgICAgIHN0YXRlOiBjb250ZXh0LnN0b3JlLmdldFN0YXRlKCksXG4gICAgfTtcblxuICAgIGNvbnN0IGh0bWwgPSBSZWFjdERPTS5yZW5kZXJUb1N0YXRpY01hcmt1cCg8SHRtbCB7Li4uZGF0YX0gLz4pO1xuICAgIHJlcy5zdGF0dXMocm91dGUuc3RhdHVzIHx8IDIwMCk7XG4gICAgcmVzLnNlbmQoYDwhZG9jdHlwZSBodG1sPiR7aHRtbH1gKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbmV4dChlcnIpO1xuICB9XG59KTtcblxuLy9cbi8vIEVycm9yIGhhbmRsaW5nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgcGUgPSBuZXcgUHJldHR5RXJyb3IoKTtcbnBlLnNraXBOb2RlRmlsZXMoKTtcbnBlLnNraXBQYWNrYWdlKCdleHByZXNzJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuYXBwLnVzZSgoZXJyLCByZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zb2xlLmVycm9yKHBlLnJlbmRlcihlcnIpKTtcbiAgY29uc3QgaHRtbCA9IFJlYWN0RE9NLnJlbmRlclRvU3RhdGljTWFya3VwKFxuICAgIDxIdG1sXG4gICAgICB0aXRsZT1cIkludGVybmFsIFNlcnZlciBFcnJvclwiXG4gICAgICBkZXNjcmlwdGlvbj17ZXJyLm1lc3NhZ2V9XG4gICAgICBzdHlsZXM9e1t7IGlkOiAnY3NzJywgY3NzVGV4dDogZXJyb3JQYWdlU3R5bGUuX2dldENzcygpIH1dfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgPlxuICAgICAge1JlYWN0RE9NLnJlbmRlclRvU3RyaW5nKDxFcnJvclBhZ2VXaXRob3V0U3R5bGUgZXJyb3I9e2Vycn0gLz4pfVxuICAgIDwvSHRtbD4sXG4gICk7XG4gIHJlcy5zdGF0dXMoZXJyLnN0YXR1cyB8fCA1MDApO1xuICByZXMuc2VuZChgPCFkb2N0eXBlIGh0bWw+JHtodG1sfWApO1xufSk7XG5cbi8vXG4vLyBMYXVuY2ggdGhlIHNlcnZlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IHByb21pc2UgPSBtb2RlbHMuc3luYygpLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuaWYgKCFtb2R1bGUuaG90KSB7XG4gIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgYXBwLmxpc3Rlbihjb25maWcucG9ydCwgKCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKGBUaGUgc2VydmVyIGlzIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDoke2NvbmZpZy5wb3J0fS9gKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vXG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgYXBwLmhvdCA9IG1vZHVsZS5ob3Q7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KCcuL3JvdXRlcicpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3NlcnZlci5qcyIsImltcG9ydCBSdW5uZXIgZnJvbSAnLi9kYXRhL21vZGVscy9SdW5uZXInO1xuaW1wb3J0IExhcCBmcm9tICcuL2RhdGEvbW9kZWxzL0xhcCc7XG5cbmNsYXNzIExhcFNpbXVsYXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzdGFydCgpIHtcbiAgICBSdW5uZXIuZmluZEFsbCgpLnRoZW4ocmVzID0+IHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1heCA9IHJlcy5sZW5ndGggLSAxO1xuICAgICAgICBjb25zdCBtaW4gPSAwO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0UmFuZG9tSW50KG1pbiwgbWF4KTtcbiAgICAgICAgY29uc3QgcnVubmVyID0gcmVzW2luZGV4XTtcbiAgICAgICAgY29uc29sZS5sb2coJ0FkZCBMYXAnLCBydW5uZXIuaWQsIGluZGV4KTtcbiAgICAgICAgTGFwLmNyZWF0ZSh7XG4gICAgICAgICAgcnVubmVyX2lkOiBydW5uZXIuaWQsXG4gICAgICAgIH0pO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuaW50ZXJ2YWwuY2FuY2VsKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhcFNpbXVsYXRvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2ltdWxhdG9yLmpzIiwiaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgY3JlYXRlUm9vdFJlZHVjZXIgZnJvbSAnLi4vcmVkdWNlcnMnO1xuaW1wb3J0IGNyZWF0ZUhlbHBlcnMgZnJvbSAnLi9jcmVhdGVIZWxwZXJzJztcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUsIGNvbmZpZykge1xuICBjb25zdCBoZWxwZXJzID0gY3JlYXRlSGVscGVycyhjb25maWcpO1xuICBjb25zdCB7IGFwb2xsb0NsaWVudCB9ID0gY29uZmlnO1xuXG4gIGNvbnN0IG1pZGRsZXdhcmUgPSBbXG4gICAgdGh1bmsud2l0aEV4dHJhQXJndW1lbnQoaGVscGVycyksXG4gICAgYXBvbGxvQ2xpZW50Lm1pZGRsZXdhcmUoKSxcbiAgXTtcblxuICBsZXQgZW5oYW5jZXI7XG5cbiAgaWYgKF9fREVWX18pIHtcbiAgICBtaWRkbGV3YXJlLnB1c2goY3JlYXRlTG9nZ2VyKCkpO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3phbG1veGlzdXMvcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uI3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvblxuICAgIGxldCBkZXZUb29sc0V4dGVuc2lvbiA9IGYgPT4gZjtcbiAgICBpZiAocHJvY2Vzcy5lbnYuQlJPV1NFUiAmJiB3aW5kb3cuZGV2VG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIGRldlRvb2xzRXh0ZW5zaW9uID0gd2luZG93LmRldlRvb2xzRXh0ZW5zaW9uKCk7XG4gICAgfVxuXG4gICAgZW5oYW5jZXIgPSBjb21wb3NlKGFwcGx5TWlkZGxld2FyZSguLi5taWRkbGV3YXJlKSwgZGV2VG9vbHNFeHRlbnNpb24pO1xuICB9IGVsc2Uge1xuICAgIGVuaGFuY2VyID0gYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZXdhcmUpO1xuICB9XG5cbiAgY29uc3Qgcm9vdFJlZHVjZXIgPSBjcmVhdGVSb290UmVkdWNlcih7XG4gICAgYXBvbGxvQ2xpZW50LFxuICB9KTtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JhY2t0L3JlZHV4L3JlbGVhc2VzL3RhZy92My4xLjBcbiAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBlbmhhbmNlcik7XG5cbiAgLy8gSG90IHJlbG9hZCByZWR1Y2VycyAocmVxdWlyZXMgV2VicGFjayBvciBCcm93c2VyaWZ5IEhNUiB0byBiZSBlbmFibGVkKVxuICBpZiAoX19ERVZfXyAmJiBtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoJy4uL3JlZHVjZXJzJywgKCkgPT5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICAgICAgc3RvcmUucmVwbGFjZVJlZHVjZXIocmVxdWlyZSgnLi4vcmVkdWNlcnMnKS5kZWZhdWx0KSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHN0b3JlO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9zdG9yZS9jb25maWd1cmVTdG9yZS5qcyIsImNvbnN0IGdyYXBocWxSZXF1ZXN0RGVwcmVjYXRlZE1lc3NhZ2UgPSBgXFxgZ3JhcGhxbFJlcXVlc3RcXGAgaGFzIGJlZW4gZGVwcmVjYXRlZC5cbllvdSBzaG91bGQgdXNlIEFwb2xsbzogXFxgY2xpZW50LnF1ZXJ5KHsgcXVlcnksIHZhcmlhYmxlcy4uLn0pXFxgIG9yIFxcYGNsaWVudC5tdXRhdGUoKVxcYFxuRG9uJ3QgZm9yZ2V0IHRvIGVuY2xvc2UgeW91ciBxdWVyeSB0byBncWxcXGDigKZcXGAgdGFnIG9yIGltcG9ydCAqLmdyYXBocWwgZmlsZS5cblNlZSBkb2NzIGF0IGh0dHA6Ly9kZXYuYXBvbGxvZGF0YS5jb20vY29yZS9hcG9sbG8tY2xpZW50LWFwaS5odG1sI0Fwb2xsb0NsaWVudFxcXFwucXVlcnlgO1xuXG5mdW5jdGlvbiBjcmVhdGVHcmFwaHFsUmVxdWVzdChhcG9sbG9DbGllbnQpIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGdyYXBocWxSZXF1ZXN0KHF1ZXJ5T3JTdHJpbmcsIHZhcmlhYmxlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKF9fREVWX18pIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKGdyYXBocWxSZXF1ZXN0RGVwcmVjYXRlZE1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2tpcENhY2hlIH0gPSBvcHRpb25zO1xuICAgIGxldCBxdWVyeSA9IHF1ZXJ5T3JTdHJpbmc7XG4gICAgaWYgKHR5cGVvZiBxdWVyeU9yU3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgZ3FsID0gYXdhaXQgcmVxdWlyZS5lbnN1cmUoXG4gICAgICAgIFsnZ3JhcGhxbC10YWcnXSxcbiAgICAgICAgcmVxdWlyZSA9PiByZXF1aXJlKCdncmFwaHFsLXRhZycpLFxuICAgICAgICAnZ3JhcGhxbC10YWcnLFxuICAgICAgKTtcbiAgICAgIHF1ZXJ5ID0gZ3FsKFtxdWVyeU9yU3RyaW5nXSk7XG4gICAgfVxuXG4gICAgaWYgKHNraXBDYWNoZSkge1xuICAgICAgcmV0dXJuIGFwb2xsb0NsaWVudC5uZXR3b3JrSW50ZXJmYWNlLnF1ZXJ5KHsgcXVlcnksIHZhcmlhYmxlcyB9KTtcbiAgICB9XG5cbiAgICBsZXQgaXNNdXRhdGlvbiA9IGZhbHNlO1xuICAgIGlmIChxdWVyeS5kZWZpbml0aW9ucykge1xuICAgICAgaXNNdXRhdGlvbiA9IHF1ZXJ5LmRlZmluaXRpb25zLnNvbWUoXG4gICAgICAgIGRlZmluaXRpb24gPT4gZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLm9wZXJhdGlvbiA9PT0gJ211dGF0aW9uJyxcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChpc011dGF0aW9uKSB7XG4gICAgICByZXR1cm4gYXBvbGxvQ2xpZW50Lm11dGF0ZSh7IG11dGF0aW9uOiBxdWVyeSwgdmFyaWFibGVzIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXBvbGxvQ2xpZW50LnF1ZXJ5KHsgcXVlcnksIHZhcmlhYmxlcyB9KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSGVscGVycyh7IGFwb2xsb0NsaWVudCwgZmV0Y2gsIGhpc3RvcnkgfSkge1xuICByZXR1cm4ge1xuICAgIGNsaWVudDogYXBvbGxvQ2xpZW50LFxuICAgIGhpc3RvcnksXG4gICAgZmV0Y2gsXG4gICAgLy8gQGRlcHJlY2F0ZWQoJ1VzZSBgY2xpZW50YCBpbnN0ZWFkJylcbiAgICBhcG9sbG9DbGllbnQsXG4gICAgLy8gQGRlcHJlY2F0ZWQoJ1VzZSBgY2xpZW50LnF1ZXJ5KClgIG9yIGBjbGllbnQubXV0YXRlKClgIGluc3RlYWQnKVxuICAgIGdyYXBocWxSZXF1ZXN0OiBjcmVhdGVHcmFwaHFsUmVxdWVzdChmZXRjaCksXG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3N0b3JlL2NyZWF0ZUhlbHBlcnMuanMiLCJpbXBvcnQgeyBpbnNwZWN0IH0gZnJvbSAndXRpbCc7XG5cbmZ1bmN0aW9uIGluc3BlY3RPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiBpbnNwZWN0KG9iamVjdCwge1xuICAgIGNvbG9yczogdHJ1ZSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNpbmdsZUxpbmUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xufVxuXG5jb25zdCBhY3Rpb25Gb3JtYXR0ZXJzID0ge1xuICAvLyBUaGlzIGlzIHVzZWQgYXQgZmVhdHVyZS9hcG9sbG8gYnJhbmNoLCBidXQgaXQgY2FuIGhlbHAgeW91IHdoZW4gaW1wbGVtZW50aW5nIEFwb2xsb1xuICBBUE9MTE9fUVVFUllfSU5JVDogYSA9PlxuICAgIGBxdWVyeUlkOiR7YS5xdWVyeUlkfSB2YXJpYWJsZXM6JHtpbnNwZWN0T2JqZWN0KFxuICAgICAgYS52YXJpYWJsZXMsXG4gICAgKX1cXG4gICAke3NpbmdsZUxpbmUoYS5xdWVyeVN0cmluZyl9YCxcblxuICBBUE9MTE9fUVVFUllfUkVTVUxUOiBhID0+XG4gICAgYHF1ZXJ5SWQ6JHthLnF1ZXJ5SWR9XFxuICAgJHtzaW5nbGVMaW5lKGluc3BlY3RPYmplY3QoYS5yZXN1bHQpKX1gLFxuXG4gIEFQT0xMT19RVUVSWV9TVE9QOiBhID0+IGBxdWVyeUlkOiR7YS5xdWVyeUlkfWAsXG59O1xuXG4vLyBTZXJ2ZXIgc2lkZSByZWR1eCBhY3Rpb24gbG9nZ2VyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVMb2dnZXIoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICByZXR1cm4gc3RvcmUgPT4gbmV4dCA9PiBhY3Rpb24gPT4ge1xuICAgIGxldCBmb3JtYXR0ZWRQYXlsb2FkID0gJyc7XG4gICAgY29uc3QgYWN0aW9uRm9ybWF0dGVyID0gYWN0aW9uRm9ybWF0dGVyc1thY3Rpb24udHlwZV07XG4gICAgaWYgKHR5cGVvZiBhY3Rpb25Gb3JtYXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZvcm1hdHRlZFBheWxvYWQgPSBhY3Rpb25Gb3JtYXR0ZXIoYWN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbi50b1N0cmluZyAhPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZykge1xuICAgICAgZm9ybWF0dGVkUGF5bG9hZCA9IGFjdGlvbi50b1N0cmluZygpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi5wYXlsb2FkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgZm9ybWF0dGVkUGF5bG9hZCA9IGluc3BlY3RPYmplY3QoYWN0aW9uLnBheWxvYWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXR0ZWRQYXlsb2FkID0gaW5zcGVjdE9iamVjdChhY3Rpb24pO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGAgKiAke2FjdGlvbi50eXBlfTogJHtmb3JtYXR0ZWRQYXlsb2FkfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9zdG9yZS9sb2dnZXIvbG9nZ2VyLnNlcnZlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJncmFwaHFsXCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNlcXVlbGl6ZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInNlcXVlbGl6ZVwiXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImlzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzXCJcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1hcG9sbG9cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1hcG9sbG9cIlxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtdGFnXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZ3JhcGhxbC10YWdcIlxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCJcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJsdWViaXJkXCJcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llLXBhcnNlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNvb2tpZS1wYXJzZXJcIlxuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYm9keS1wYXJzZXJcIlxuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3Mtand0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzcy1qd3RcIlxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3RcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1ncmFwaHFsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzcy1ncmFwaHFsXCJcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIlxuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZmV0Y2hcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJub2RlLWZldGNoXCJcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicHJldHR5LWVycm9yXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicHJldHR5LWVycm9yXCJcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tY2xpZW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYXBvbGxvLWNsaWVudFwiXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtcmVkdXhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1yZWR1eFwiXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic2VyaWFsaXplLWphdmFzY3JpcHRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCJcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCJcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwcm9wLXR5cGVzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicHJvcC10eXBlc1wiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0XCJcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydC1mYWNlYm9va1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0LWZhY2Vib29rXCJcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1bml2ZXJzYWwtcm91dGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidW5pdmVyc2FsLXJvdXRlclwiXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaXNvbW9ycGhpYy1mZXRjaFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImlzb21vcnBoaWMtZmV0Y2hcIlxuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vYXNzZXRzLmpzb25cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCIuL2Fzc2V0cy5qc29uXCJcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eC10aHVua1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4LXRodW5rXCJcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidXRpbFwiXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3N2XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY3N2XCJcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWZpbGV1cGxvYWRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJleHByZXNzLWZpbGV1cGxvYWRcIlxuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInFyY29kZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInFyY29kZVwiXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHRtbC1wZGZcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJodG1sLXBkZlwiXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFzZTY0LWltZ1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhc2U2NC1pbWdcIlxuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFudGRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJhbnRkXCJcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGlzdG9yeS9jcmVhdGVCcm93c2VySGlzdG9yeVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImhpc3RvcnkvY3JlYXRlQnJvd3Nlckhpc3RvcnlcIlxuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJudW1lcmFsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibnVtZXJhbFwiXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9ICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzeW5jXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYXN5bmNcIlxuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibW9tZW50XCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImxvZGFzaFwiXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZnNcIlxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7QUN0ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMzSEE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFGQTtBQU9BOzs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFTQTtBQUNBO0FBVkE7QUFDQTtBQVlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUZBO0FBREE7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFIQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFiQTtBQW9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBREE7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRQTtBQUVBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWhCQTtBQXJCQTtBQTZDQTtBQXBFQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFYQTtBQURBO0FBZ0JBO0FBQ0E7QUFGQTtBQXdEQTs7Ozs7OztBQ3ZGQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFHQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBbkJBO0FBeEJBOzs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBekJBO0FBMEJBO0FBaENBO0FBQ0E7QUFrQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7Ozs7Ozs7Ozs7QUM1QkE7Ozs7OztBQWxCQTs7Ozs7Ozs7O0FBd0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFDQTtBQVVBO0FBS0E7QUFIQTtBQVNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNsREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBUkE7QUFXQTtBQUNBO0FBR0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFWQTtBQWFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQWxLQTtBQUNBO0FBb0tBOzs7Ozs7OztBQzdLQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQ3pDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBSEE7QUFaQTtBQUNBO0FBMEJBOzs7Ozs7OztBQzFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFIQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFIQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBRkE7QUF2RUE7QUE2RUE7QUFEQTtBQUNBO0FBSUE7Ozs7Ozs7O0FDakdBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBbERBO0FBQ0E7QUFzREE7Ozs7Ozs7O0FDbkVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBRkE7QUF4QkE7QUFDQTtBQXNDQTs7Ozs7Ozs7QUNwREE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBWkE7QUFrQkE7QUFEQTtBQUNBO0FBSUE7Ozs7Ozs7O0FDcENBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBTEE7QUFDQTtBQVNBOzs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFOQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDeEJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQXRCQTtBQUNBO0FBMEJBOzs7Ozs7OztBQ3ZDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDM0NBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQURBO0FBUUE7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdCQTtBQUNBO0FBK0JBOzs7Ozs7OztBQ2xEQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFJQTtBQUNBO0FBRkE7QUFJQTtBQWRBO0FBQ0E7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QkE7Ozs7Ozs7OztBQVNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQXBCQTtBQUNBO0FBc0JBOzs7Ozs7OztBQ3pDQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7Ozs7Ozs7O0FDckJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFDQTtBQVFBOzs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7Ozs7Ozs7O0FDckJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFUQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFUQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFUQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7Ozs7Ozs7O0FDOUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QkE7Ozs7Ozs7OztBQVNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQWhDQTtBQUNBO0FBa0NBOzs7Ozs7OztBQ3REQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBOzs7Ozs7Ozs7Ozs7OztBQ3pCQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFTQTtBQUdBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFYQTtBQWFBO0FBQ0E7QUFsQ0E7QUFDQTtBQW9DQTs7Ozs7Ozs7QUNsREE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQVpBO0FBQ0E7QUFjQTs7Ozs7Ozs7QUM1QkE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFUQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDdkJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhDQTtBQUNBO0FBa0NBOzs7Ozs7Ozs7Ozs7OztBQ3pEQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQTs7QUF0QkE7QUEyQkE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRkE7QUFIQTtBQVFBO0FBdkJBO0FBeUJBO0FBQ0E7QUE1REE7QUFDQTtBQThEQTs7Ozs7Ozs7QUM1RUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7Ozs7Ozs7O0FDeEJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQVBBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUMxQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBRUE7QUFEQTtBQUlBO0FBREE7QUFJQTtBQURBO0FBWEE7QUFEQTtBQWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQURBO0FBT0E7QUFyQ0E7QUFDQTtBQXVDQTs7Ozs7Ozs7QUNyREE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFBQTtBQVlBO0FBREE7QUFHQTtBQXBCQTtBQUNBO0FBc0JBOzs7Ozs7OztBQ3BDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBUEE7QUFDQTtBQVNBOzs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQVFBO0FBUkE7QUFZQTtBQURBO0FBR0E7QUEvQkE7QUFDQTtBQWlDQTs7Ozs7Ozs7QUMvQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBRkE7QUFJQTtBQVpBO0FBQ0E7QUFjQTs7Ozs7Ozs7QUM1QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQVBBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFGQTtBQXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFmQTtBQUZBO0FBdEJBO0FBQ0E7QUEyQ0E7Ozs7Ozs7O0FDekZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFDQTtBQUtBOzs7Ozs7OztBQ2xCQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBRkE7QUFDQTtBQU1BOzs7Ozs7Ozs7Ozs7OztBQ2xCQTs7Ozs7Ozs7O0FBU0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUhBO0FBRkE7QUFDQTtBQVFBOzs7Ozs7OztBQzdCQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUFBO0FBQUE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7Ozs7Ozs7QUNsQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQUE7QUFBQTtBQUNBO0FBYUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBOzs7Ozs7OztBQ2xDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBRkE7QUFDQTtBQVNBOzs7Ozs7OztBQzNCQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBTEE7QUFGQTtBQUNBO0FBYUE7Ozs7Ozs7O0FDakNBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUZBO0FBQ0E7QUFVQTs7Ozs7Ozs7QUMxQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUxBO0FBRkE7QUFDQTtBQWFBOzs7Ozs7OztBQ25DQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQUZBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUMxQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFPQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBCQTtBQTFEQTtBQUZBO0FBQ0E7QUFvRkE7Ozs7Ozs7O0FDOUdBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBRkE7QUFDQTtBQVNBOzs7Ozs7OztBQzFCQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBNUNBO0FBRkE7QUFDQTtBQW9EQTs7Ozs7Ozs7QUN2RUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFDQTtBQU9BOzs7Ozs7OztBQ3ZCQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQUZBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUMxQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQW5DQTtBQUZBO0FBQ0E7QUFnREE7Ozs7Ozs7O0FDeEVBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUZBO0FBQ0E7QUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QkE7Ozs7Ozs7OztBQVNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQVpBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFMQTtBQVlBO0FBREE7QUFRQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFKQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTEE7QUFZQTtBQURBO0FBUUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekZBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUF5RkE7QUFDQTtBQUNBO0FBR0E7Ozs7Ozs7O0FDMUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRkE7QUFJQTtBQUNBO0FBUEE7QUFTQTs7Ozs7Ozs7QUNaQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBREE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7QUN0RUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0JBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUpBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFLQTtBQWpDQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBREE7QUFEQTtBQVVBO0FBREE7QUEyQkE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25EQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25CQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUtBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFTQTtBQXJFQTtBQUNBO0FBdUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVGQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRkE7QUFLQTtBQUdBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFFQTtBQUNBO0FBRkE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBQ0E7QUFlQTtBQUVBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwR0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQW9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDL1FBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUJBO0FBQ0E7QUE4QkE7Ozs7Ozs7O0FDbENBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQy9DQTs7O0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhDQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7Ozs7Ozs7O0FDbERBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBVkE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM1Q0E7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7OztBIiwic291cmNlUm9vdCI6IiJ9