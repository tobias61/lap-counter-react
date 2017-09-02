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
/******/ 	var hotCurrentHash = "4c422dd04d921f9dccbd"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(11)(__webpack_require__.s = 11);
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


var _stringify = __webpack_require__(26);

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = __webpack_require__(27);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(24);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_serialize_javascript__ = __webpack_require__(25);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_apollo_client__ = __webpack_require__(23);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_csv__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_csv___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_csv__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_async__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Runner__ = __webpack_require__("./src/data/models/Runner.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_Sponsor__ = __webpack_require__("./src/data/models/Sponsor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_Team__ = __webpack_require__("./src/data/models/Team.js");







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
                        birthday: item[`Geburtsdatum Läufer ${i}`],
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
                name: item.Sponsor || `${item.Vorname} ${item.Name}`,
                insert: item.Submitted,
                personal: true
              }).then(sponsor => {
                __WEBPACK_IMPORTED_MODULE_3__models_Runner__["a" /* default */].create({
                  email: item['E-Mail'],
                  lastName: item.Name,
                  firstName: item.Vorname,
                  gender: item.Geschlecht,
                  birthday: item[`Geburtsdatum`],
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__(31);
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
        datetime(birthday, 'localtime') as birthdate, 
        firstName, 
        lastName, 
        Runner.email as email,
        gender,
        number,
        
        Runner.sponsor_amount as sponsor_amount,
        Sponsor.id as sponsor_id,
        Sponsor.email as sponsor_email, 
        Sponsor.name as sponsor_name, 
        Sponsor.contact_firstName as sponsor_contact_firstName, 
        Sponsor.contact_lastName as sponsor_contact_lastName,
        Sponsor.sponsor_amount as sponsor_sponsor_amount,
        Sponsor.donation_receipt as sponsor_donation_receipt
FROM Runner LEFT JOIN Lap ON Runner.id = Lap.runner_id INNER JOIN Sponsor ON Runner.sponsor_id = Sponsor.id 
WHERE age >= ${minAge} and age <= ${maxAge}
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
      personalResults: __WEBPACK_IMPORTED_MODULE_28__queries_personalResults__["a" /* default */]
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
  name: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  contact_firstName: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  contact_lastName: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  sponsor_amount: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
  private: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
  cash: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] },
  donation_receipt: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLBoolean"] }
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
    sponsor_amount: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLFloat"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (CreateTeamInputType);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_Lap__ = __webpack_require__("./src/data/models/Lap.js");
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
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"],
      resolve: res => res.sponsor_amount
    },
    laps: {
      type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"],
      resolve: res => {
        if (res.laps) {
          return res.laps;
        }
        return __WEBPACK_IMPORTED_MODULE_3__models_Lap__["a" /* default */].count({ where: { runner_id: res.id } }).then(count => count);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_facebook__ = __webpack_require__(29);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(6);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qrcode__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qrcode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_qrcode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_async__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_html_pdf__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_html_pdf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_html_pdf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_base64_img__ = __webpack_require__(40);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_universal_router__ = __webpack_require__(30);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles__ = __webpack_require__(8);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cookie_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_express_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_express_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_node_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_apollo__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_apollo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_react_apollo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_pretty_error__ = __webpack_require__(22);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__assets_json__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__assets_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__assets_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__store_configureStore__ = __webpack_require__("./src/store/configureStore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__actions_runtime__ = __webpack_require__("./src/actions/runtime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_26__config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__data_import_import_request__ = __webpack_require__("./src/data/import/import-request.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_express_fileupload__ = __webpack_require__(36);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(33);
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
          return __webpack_require__(10);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util__ = __webpack_require__(34);
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

module.exports = require("graphql-tag");

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
module.exports = __webpack_require__("./src/server.js");


/***/ }),

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

module.exports = require("express-graphql");

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ 26:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("universal-router");

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ 32:
/***/ (function(module, exports) {

module.exports = require("./assets.json");

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

module.exports = require("csv");

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

module.exports = require("express-fileupload");

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

module.exports = require("qrcode");

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

module.exports = require("html-pdf");

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = require("base64-img");

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = require("antd");

/***/ }),

/***/ 42:
/***/ (function(module, exports) {

module.exports = require("history/createBrowserHistory");

/***/ }),

/***/ 43:
/***/ (function(module, exports) {

module.exports = require("numeral");

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("isomorphic-style-loader/lib/withStyles");

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = require("react-apollo");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3dlYnBhY2svYm9vdHN0cmFwIDRjNDIyZGQwNGQ5MjFmOWRjY2JkIiwid2VicGFjazovLy8uL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzcz82YWM2IiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvYWN0aW9ucy9ydW50aW1lLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvY29tcG9uZW50cy9BcHAuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb21wb25lbnRzL0h0bWwuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb25maWcuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb25zdGFudHMvaW5kZXguanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9jb3JlL2NyZWF0ZUFwb2xsb0NsaWVudC9jcmVhdGVBcG9sbG9DbGllbnQuc2VydmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvY3JlYXRlRmV0Y2guanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL2ltcG9ydC9jc3YtaW1wb3J0LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9pbXBvcnQvaW1wb3J0LXJlcXVlc3QuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9MYXAuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9SdW5uZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9TcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tb2RlbHMvVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbW9kZWxzL1VzZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyQ2xhaW0uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyTG9naW4uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL21vZGVscy9Vc2VyUHJvZmlsZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbW9kZWxzL2luZGV4LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvYWRkTGFwLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvYWRkUnVubmVyc1RvVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVBlcnNvbmFsUnVubmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlUnVubmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlU3BvbnNvci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVRlYW0uanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy9kZWxldGVSdW5uZXIuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy9kZWxldGVTcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvZGVsZXRlVGVhbS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3JlbW92ZVJ1bm5lckZyb21UZWFtLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9tdXRhdGlvbnMvc2V0VGVhbVNwb25zb3IuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy91cGRhdGVQZXJzb25hbFJ1bm5lci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVJ1bm5lci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVNwb25zb3IuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL211dGF0aW9ucy91cGRhdGVUZWFtLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL2NoZWNrTnVtYmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL21lLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL25ld3MuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvcGVyc29uYWxSZXN1bHRzLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3J1bm5lci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy9ydW5uZXJMYXBzLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3J1bm5lckxpc3QuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3F1ZXJpZXMvc3BvbnNvci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy9zcG9uc29yTGlzdC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvcXVlcmllcy90ZWFtLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3RlYW1MaXN0LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3RlYW1SdW5uZXJMaXN0LmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9xdWVyaWVzL3RlYW1TcG9uc29yLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS9zY2hlbWEuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3NlcXVlbGl6ZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvQ2hlY2tOdW1iZXJUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9DcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvQ3JlYXRlUnVubmVySW5wdXRUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9DcmVhdGVTcG9uc29ySW5wdXRUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9DcmVhdGVUZWFtSW5wdXRUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9OZXdzSXRlbVR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1J1bm5lckxhcHNUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9SdW5uZXJMaXN0VHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvUnVubmVyVHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvU3BvbnNvckxpc3RUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvZGF0YS90eXBlcy9TcG9uc29yVHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvU3VjY2Vzc1R5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1RlYW1MaXN0VHlwZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL2RhdGEvdHlwZXMvVGVhbVR5cGUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9kYXRhL3R5cGVzL1VzZXJUeXBlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcGFzc3BvcnQuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9yZWR1Y2Vycy9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JlZHVjZXJzL3J1bnRpbWUuanMiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L3NyYy9yZWR1Y2Vycy91c2VyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcmVxdWVzdHMvZ2VuZXJhdGUtcXJjb2Rlcy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9lcnJvci9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3JvdXRlcy9pbmRleC5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3NlcnZlci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3NpbXVsYXRvci5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvc3RvcmUvY3JlYXRlSGVscGVycy5qcyIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3Qvc3JjL3N0b3JlL2xvZ2dlci9sb2dnZXIuc2VydmVyLmpzIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImdyYXBocWxcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJzZXF1ZWxpemVcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJncmFwaHFsLXRhZ1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYmx1ZWJpcmRcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJleHByZXNzXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiY29va2llLXBhcnNlclwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiZXhwcmVzcy1qd3RcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJleHByZXNzLWdyYXBocWxcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJyZWFjdFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcIm5vZGUtZmV0Y2hcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJyZWFjdC1kb20vc2VydmVyXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicHJldHR5LWVycm9yXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYXBvbGxvLWNsaWVudFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInJlYWN0LXJlZHV4XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwic2VyaWFsaXplLWphdmFzY3JpcHRcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcInBhc3Nwb3J0XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicGFzc3BvcnQtZmFjZWJvb2tcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJwcm9wLXR5cGVzXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwidW5pdmVyc2FsLXJvdXRlclwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImlzb21vcnBoaWMtZmV0Y2hcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCIuL2Fzc2V0cy5qc29uXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicmVkdXgtdGh1bmtcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJ1dGlsXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiY3N2XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiZXhwcmVzcy1maWxldXBsb2FkXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicXJjb2RlXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiaHRtbC1wZGZcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJwYXRoXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwiYmFzZTY0LWltZ1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImFudGRcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwibnVtZXJhbFwiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImFzeW5jXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicmVkdXhcIiIsIi9EZXZlbG9wZXIvUHJvamVjdHMvbGFwLWNvdW50ZXIvbGFwLWNvdW50ZXItcmVhY3QvZXh0ZXJuYWwgXCJmc1wiIiwiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9leHRlcm5hbCBcImlzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzXCIiLCIvRGV2ZWxvcGVyL1Byb2plY3RzL2xhcC1jb3VudGVyL2xhcC1jb3VudGVyLXJlYWN0L2V4dGVybmFsIFwicmVhY3QtYXBvbGxvXCIiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwidXBkYXRlcy9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR0cnkge1xyXG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJ1cGRhdGVzL1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XHJcbiBcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiBcdFx0fVxyXG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHsgLy9lc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjRjNDIyZGQwNGQ5MjFmOWRjY2JkXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHRmb3IodmFyIGNodW5rSWQgaW4gaW5zdGFsbGVkQ2h1bmtzKVxyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDEzOiAwXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCkge1xuIFx0XHQvLyBcIjBcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSAwKSB7XG4gXHRcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vY2h1bmtzL1wiICsgKHtcIjBcIjpcInNwb25zb3JzLWNyZWF0ZVwiLFwiMVwiOlwicnVubmVycy11cGRhdGVcIixcIjJcIjpcInJ1bm5lcnMtY3JlYXRlXCIsXCIzXCI6XCJob21lXCIsXCI0XCI6XCJwcml2YWN5XCIsXCI1XCI6XCJhYm91dFwiLFwiNlwiOlwicmVnaXN0ZXJcIixcIjdcIjpcIm5vdC1mb3VuZFwiLFwiOFwiOlwibG9naW5cIixcIjlcIjpcImNvbnRhY3RcIixcIjEwXCI6XCJydW5uZXJzXCIsXCIxMVwiOlwic3BvbnNvcnNcIixcIjEyXCI6XCJpbXBvcnRcIn1bY2h1bmtJZF18fGNodW5rSWQpICsgXCIuanNcIik7XG4gXHRcdFx0dmFyIG1vcmVNb2R1bGVzID0gY2h1bmsubW9kdWxlcywgY2h1bmtJZHMgPSBjaHVuay5pZHM7XG4gXHRcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0lkcy5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gdW5jYXRjaGVkIGVycm9yIGhhbmRsZXIgZm9yIHdlYnBhY2sgcnVudGltZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vZSA9IGZ1bmN0aW9uKGVycikge1xuIFx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuIFx0XHRcdHRocm93IGVycjsgLy8gY2F0Y2ggdGhpcyBlcnJvciBieSB1c2luZyBTeXN0ZW0uaW1wb3J0KCkuY2F0Y2goKVxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMTEpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDExKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0YzQyMmRkMDRkOTIxZjlkY2NiZCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKipcXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXFxuICpcXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXFxuICpcXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxuICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtcGFjazogY2VudGVyO1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDAgMzJweDtcXG4gIHBhZGRpbmc6IDAgMnJlbTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICM4ODg7XFxufVxcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG5oMSB7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgY29sb3I6ICM1NTU7XFxufVxcblxcbnByZSB7XFxuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL0RldmVsb3Blci9Qcm9qZWN0cy9sYXAtY291bnRlci9sYXAtY291bnRlci1yZWFjdC9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7Ozs7Ozs7R0FPRzs7QUFFSDtFQUNFLHFCQUFxQjtFQUNyQixxQkFBcUI7RUFDckIsY0FBYztFQUNkLDBCQUEwQjtNQUN0Qix1QkFBdUI7VUFDbkIsb0JBQW9CO0VBQzVCLHlCQUF5QjtNQUNyQixzQkFBc0I7VUFDbEIsd0JBQXdCO0VBQ2hDLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixtQkFBbUI7RUFDbkIsWUFBWTtDQUNiOztBQUVEO0VBQ0UsVUFBVTtDQUNYOztBQUVEO0VBQ0UsaUJBQWlCO0VBQ2pCLFlBQVk7Q0FDYjs7QUFFRDtFQUNFLHNCQUFzQjtFQUN0QixpQkFBaUI7Q0FDbEJcIixcImZpbGVcIjpcIkVycm9yUGFnZS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyoqXFxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxcbiAqXFxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbiAqXFxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXFxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDMycHg7XFxuICBwYWRkaW5nOiAwIDJyZW07XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAjNTU1O1xcbn1cXG5cXG5wcmUge1xcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlLFwibW9kdWxlc1wiOnRydWUsXCJsb2NhbElkZW50TmFtZVwiOlwiW25hbWVdLVtsb2NhbF0tW2hhc2g6YmFzZTY0OjVdXCIsXCJtaW5pbWl6ZVwiOmZhbHNlLFwiZGlzY2FyZENvbW1lbnRzXCI6e1wicmVtb3ZlQWxsXCI6dHJ1ZX19IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJjb25maWdcIjp7XCJwYXRoXCI6XCIuL3Rvb2xzL3Bvc3Rjc3MuY29uZmlnLmpzXCJ9fSEuL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWUsXCJtb2R1bGVzXCI6dHJ1ZSxcImxvY2FsSWRlbnROYW1lXCI6XCJbbmFtZV0tW2xvY2FsXS1baGFzaDpiYXNlNjQ6NV1cIixcIm1pbmltaXplXCI6ZmFsc2UsXCJkaXNjYXJkQ29tbWVudHNcIjp7XCJyZW1vdmVBbGxcIjp0cnVlfX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzP3tcImNvbmZpZ1wiOntcInBhdGhcIjpcIi4vdG9vbHMvcG9zdGNzcy5jb25maWcuanNcIn19IS4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9zdHJpbmdpZnkgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnknKTtcblxudmFyIF9zdHJpbmdpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5KTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5Jyk7XG5cbnZhciBfc2xpY2VkVG9BcnJheTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZWRUb0FycmF5Mik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogSXNvbW9ycGhpYyBDU1Mgc3R5bGUgbG9hZGVyIGZvciBXZWJwYWNrXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTUtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcHJlZml4ID0gJ3MnO1xudmFyIGluc2VydGVkID0ge307XG5cbi8vIEJhc2U2NCBlbmNvZGluZyBhbmQgZGVjb2RpbmcgLSBUaGUgXCJVbmljb2RlIFByb2JsZW1cIlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd0Jhc2U2NC9CYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5nI1RoZV9Vbmljb2RlX1Byb2JsZW1cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgcDEpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICB9KSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHN0eWxlL2xpbmsgZWxlbWVudHMgZm9yIHNwZWNpZmllZCBub2RlIElEc1xuICogaWYgdGhleSBhcmUgbm8gbG9uZ2VyIHJlZmVyZW5jZWQgYnkgVUkgY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ3NzKGlkcykge1xuICBpZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoLS1pbnNlcnRlZFtpZF0gPD0gMCkge1xuICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXggKyBpZCk7XG4gICAgICBpZiAoZWxlbSkge1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBFeGFtcGxlOlxuICogICAvLyBJbnNlcnQgQ1NTIHN0eWxlcyBvYmplY3QgZ2VuZXJhdGVkIGJ5IGBjc3MtbG9hZGVyYCBpbnRvIERPTVxuICogICB2YXIgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKFtbMSwgJ2JvZHkgeyBjb2xvcjogcmVkOyB9J11dKTtcbiAqXG4gKiAgIC8vIFJlbW92ZSBpdCBmcm9tIHRoZSBET01cbiAqICAgcmVtb3ZlQ3NzKCk7XG4gKi9cbmZ1bmN0aW9uIGluc2VydENzcyhzdHlsZXMpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgX3JlZiRyZXBsYWNlID0gX3JlZi5yZXBsYWNlLFxuICAgICAgcmVwbGFjZSA9IF9yZWYkcmVwbGFjZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJHJlcGxhY2UsXG4gICAgICBfcmVmJHByZXBlbmQgPSBfcmVmLnByZXBlbmQsXG4gICAgICBwcmVwZW5kID0gX3JlZiRwcmVwZW5kID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkcHJlcGVuZDtcblxuICB2YXIgaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9zdHlsZXMkaSA9ICgwLCBfc2xpY2VkVG9BcnJheTMuZGVmYXVsdCkoc3R5bGVzW2ldLCA0KSxcbiAgICAgICAgbW9kdWxlSWQgPSBfc3R5bGVzJGlbMF0sXG4gICAgICAgIGNzcyA9IF9zdHlsZXMkaVsxXSxcbiAgICAgICAgbWVkaWEgPSBfc3R5bGVzJGlbMl0sXG4gICAgICAgIHNvdXJjZU1hcCA9IF9zdHlsZXMkaVszXTtcblxuICAgIHZhciBpZCA9IG1vZHVsZUlkICsgJy0nICsgaTtcblxuICAgIGlkcy5wdXNoKGlkKTtcblxuICAgIGlmIChpbnNlcnRlZFtpZF0pIHtcbiAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICBpbnNlcnRlZFtpZF0rKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0ZWRbaWRdID0gMTtcblxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4ICsgaWQpO1xuICAgIHZhciBjcmVhdGUgPSBmYWxzZTtcblxuICAgIGlmICghZWxlbSkge1xuICAgICAgY3JlYXRlID0gdHJ1ZTtcblxuICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgZWxlbS5pZCA9IHByZWZpeCArIGlkO1xuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjc3NUZXh0ID0gY3NzO1xuICAgIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHNraXAgSUU5IGFuZCBiZWxvdywgc2VlIGh0dHA6Ly9jYW5pdXNlLmNvbS9hdG9iLWJ0b2FcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArIGI2NEVuY29kZVVuaWNvZGUoKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHNvdXJjZU1hcCkpICsgJyovJztcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VVUkw9JyArIHNvdXJjZU1hcC5maWxlICsgJz8nICsgaWQgKyAnKi8nO1xuICAgIH1cblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgfVxuXG4gICAgaWYgKGNyZWF0ZSkge1xuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlbW92ZUNzcy5iaW5kKG51bGwsIGlkcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3NzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQgKi9cblxuaW1wb3J0IHsgU0VUX1JVTlRJTUVfVkFSSUFCTEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UnVudGltZVZhcmlhYmxlKHsgbmFtZSwgdmFsdWUgfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNFVF9SVU5USU1FX1ZBUklBQkxFLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZSxcbiAgICB9LFxuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hY3Rpb25zL3J1bnRpbWUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgUHJvdmlkZXIgYXMgUmVkdXhQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY29uc3QgQ29udGV4dFR5cGUgPSB7XG4gIC8vIEVuYWJsZXMgY3JpdGljYWwgcGF0aCBDU1MgcmVuZGVyaW5nXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlhc29mdC9pc29tb3JwaGljLXN0eWxlLWxvYWRlclxuICBpbnNlcnRDc3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIC8vIFVuaXZlcnNhbCBIVFRQIGNsaWVudFxuICBmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgLy8gSW50ZWdyYXRlIFJlZHV4XG4gIC8vIGh0dHA6Ly9yZWR1eC5qcy5vcmcvZG9jcy9iYXNpY3MvVXNhZ2VXaXRoUmVhY3QuaHRtbFxuICAuLi5SZWR1eFByb3ZpZGVyLmNoaWxkQ29udGV4dFR5cGVzLFxuICAvLyBBcG9sbG8gQ2xpZW50XG4gIGNsaWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuLyoqXG4gKiBUaGUgdG9wLWxldmVsIFJlYWN0IGNvbXBvbmVudCBzZXR0aW5nIGNvbnRleHQgKGdsb2JhbCkgdmFyaWFibGVzXG4gKiB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBmcm9tIGFsbCB0aGUgY2hpbGQgY29tcG9uZW50cy5cbiAqXG4gKiBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL2NvbnRleHQuaHRtbFxuICpcbiAqIFVzYWdlIGV4YW1wbGU6XG4gKlxuICogICBjb25zdCBjb250ZXh0ID0ge1xuICogICAgIGhpc3Rvcnk6IGNyZWF0ZUJyb3dzZXJIaXN0b3J5KCksXG4gKiAgICAgc3RvcmU6IGNyZWF0ZVN0b3JlKCksXG4gKiAgIH07XG4gKlxuICogICBSZWFjdERPTS5yZW5kZXIoXG4gKiAgICAgPEFwcCBjb250ZXh0PXtjb250ZXh0fT5cbiAqICAgICAgIDxMYXlvdXQ+XG4gKiAgICAgICAgIDxMYW5kaW5nUGFnZSAvPlxuICogICAgICAgPC9MYXlvdXQ+XG4gKiAgICAgPC9BcHA+LFxuICogICAgIGNvbnRhaW5lcixcbiAqICAgKTtcbiAqL1xuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29udGV4dDogUHJvcFR5cGVzLnNoYXBlKENvbnRleHRUeXBlKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRpYyBjaGlsZENvbnRleHRUeXBlcyA9IENvbnRleHRUeXBlO1xuXG4gIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIE5PVEU6IElmIHlvdSBuZWVkIHRvIGFkZCBvciBtb2RpZnkgaGVhZGVyLCBmb290ZXIgZXRjLiBvZiB0aGUgYXBwLFxuICAgIC8vIHBsZWFzZSBkbyB0aGF0IGluc2lkZSB0aGUgTGF5b3V0IGNvbXBvbmVudC5cbiAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvQXBwLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzZXJpYWxpemUgZnJvbSAnc2VyaWFsaXplLWphdmFzY3JpcHQnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kYW5nZXIgKi9cblxuY2xhc3MgSHRtbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHN0eWxlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBjc3NUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICksXG4gICAgc2NyaXB0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkKSxcbiAgICBhcHA6IFByb3BUeXBlcy5vYmplY3QsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc3R5bGVzOiBbXSxcbiAgICBzY3JpcHRzOiBbXSxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIHN0eWxlcywgc2NyaXB0cywgYXBwLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGh0bWwgY2xhc3NOYW1lPVwibm8tanNcIiBsYW5nPVwiZW5cIj5cbiAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgPG1ldGEgY2hhclNldD1cInV0Zi04XCIgLz5cbiAgICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJ4LXVhLWNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiIC8+XG4gICAgICAgICAgPHRpdGxlPlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgIDwvdGl0bGU+XG4gICAgICAgICAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD17ZGVzY3JpcHRpb259IC8+XG4gICAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xXCIgLz5cbiAgICAgICAgICB7c2NyaXB0cy5tYXAoc2NyaXB0ID0+XG4gICAgICAgICAgICA8bGluayBrZXk9e3NjcmlwdH0gcmVsPVwicHJlbG9hZFwiIGhyZWY9e3NjcmlwdH0gYXM9XCJzY3JpcHRcIiAvPixcbiAgICAgICAgICApfVxuICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiAvPlxuICAgICAgICAgIHtzdHlsZXMubWFwKHN0eWxlID0+XG4gICAgICAgICAgICA8c3R5bGVcbiAgICAgICAgICAgICAga2V5PXtzdHlsZS5pZH1cbiAgICAgICAgICAgICAgaWQ9e3N0eWxlLmlkfVxuICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHN0eWxlLmNzc1RleHQgfX1cbiAgICAgICAgICAgIC8+LFxuICAgICAgICAgICl9XG4gICAgICAgIDwvaGVhZD5cbiAgICAgICAgPGJvZHk+XG4gICAgICAgICAgPGRpdiBpZD1cImFwcFwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogY2hpbGRyZW4gfX0gLz5cbiAgICAgICAgICA8c2NyaXB0XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGB3aW5kb3cuQXBwPSR7c2VyaWFsaXplKGFwcCl9YCB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3NjcmlwdHMubWFwKHNjcmlwdCA9PiA8c2NyaXB0IGtleT17c2NyaXB0fSBzcmM9e3NjcmlwdH0gLz4pfVxuICAgICAgICAgIHtjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWQgJiZcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tcbiAgICAgICAgICAgICAgICBfX2h0bWw6XG4gICAgICAgICAgICAgICAgICAnd2luZG93LmdhPWZ1bmN0aW9uKCl7Z2EucS5wdXNoKGFyZ3VtZW50cyl9O2dhLnE9W107Z2EubD0rbmV3IERhdGU7JyArXG4gICAgICAgICAgICAgICAgICBgZ2EoJ2NyZWF0ZScsJyR7Y29uZmlnLmFuYWx5dGljc1xuICAgICAgICAgICAgICAgICAgICAuZ29vZ2xlVHJhY2tpbmdJZH0nLCdhdXRvJyk7Z2EoJ3NlbmQnLCdwYWdldmlldycpYCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+fVxuICAgICAgICAgIHtjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWQgJiZcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzXCJcbiAgICAgICAgICAgICAgYXN5bmNcbiAgICAgICAgICAgICAgZGVmZXJcbiAgICAgICAgICAgIC8+fVxuICAgICAgICA8L2JvZHk+XG4gICAgICA8L2h0bWw+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIdG1sO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL0h0bWwuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaWYgKHByb2Nlc3MuZW52LkJST1dTRVIpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdEbyBub3QgaW1wb3J0IGBjb25maWcuanNgIGZyb20gaW5zaWRlIHRoZSBjbGllbnQtc2lkZSBjb2RlLicsXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBOb2RlLmpzIGFwcFxuICBwb3J0OiBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDAsXG5cbiAgLy8gQVBJIEdhdGV3YXlcbiAgYXBpOiB7XG4gICAgLy8gQVBJIFVSTCB0byBiZSB1c2VkIGluIHRoZSBjbGllbnQtc2lkZSBjb2RlXG4gICAgY2xpZW50VXJsOiBwcm9jZXNzLmVudi5BUElfQ0xJRU5UX1VSTCB8fCAnJyxcbiAgICAvLyBBUEkgVVJMIHRvIGJlIHVzZWQgaW4gdGhlIHNlcnZlci1zaWRlIGNvZGVcbiAgICBzZXJ2ZXJVcmw6XG4gICAgICBwcm9jZXNzLmVudi5BUElfU0VSVkVSX1VSTCB8fFxuICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDB9YCxcbiAgfSxcblxuICAvLyBEYXRhYmFzZVxuICBkYXRhYmFzZVVybDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMIHx8ICdzcWxpdGU6ZGF0YWJhc2Uuc3FsaXRlJyxcblxuICAvLyBXZWIgYW5hbHl0aWNzXG4gIGFuYWx5dGljczoge1xuICAgIC8vIGh0dHBzOi8vYW5hbHl0aWNzLmdvb2dsZS5jb20vXG4gICAgZ29vZ2xlVHJhY2tpbmdJZDogcHJvY2Vzcy5lbnYuR09PR0xFX1RSQUNLSU5HX0lELCAvLyBVQS1YWFhYWC1YXG4gIH0sXG5cbiAgLy8gQXV0aGVudGljYXRpb25cbiAgYXV0aDoge1xuICAgIGp3dDogeyBzZWNyZXQ6IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ1JlYWN0IFN0YXJ0ZXIgS2l0JyB9LFxuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9cbiAgICBmYWNlYm9vazoge1xuICAgICAgaWQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX0FQUF9JRCB8fCAnMTg2MjQ0NTUxNzQ1NjMxJyxcbiAgICAgIHNlY3JldDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX1NFQ1JFVCB8fCAnYTk3MGFlMzI0MGFiNGI5YjhhYWUwZjlmMDY2MWM2ZmMnLFxuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vY29uc29sZS9wcm9qZWN0XG4gICAgZ29vZ2xlOiB7XG4gICAgICBpZDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCB8fFxuICAgICAgICAnMjUxNDEwNzMwNTUwLWFoY2cwb3U1bWdmaGw4aGx1aTF1cnJ1N2puNXMxMmttLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcbiAgICAgIHNlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQgfHwgJ1k4eVI5eVpBaG05alE4RktBTDhRSUVjZCcsXG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vYXBwcy50d2l0dGVyLmNvbS9cbiAgICB0d2l0dGVyOiB7XG4gICAgICBrZXk6IHByb2Nlc3MuZW52LlRXSVRURVJfQ09OU1VNRVJfS0VZIHx8ICdJZTIwQVp2TEpJMmxRRDVEc2d4Z2phdW5zJyxcbiAgICAgIHNlY3JldDpcbiAgICAgICAgcHJvY2Vzcy5lbnYuVFdJVFRFUl9DT05TVU1FUl9TRUNSRVQgfHxcbiAgICAgICAgJ0tUWjZjeG9LbkVha1FDZVNwWmxhVUNKV0dBbFRFQkpqMHkyRU1rVUJ1akE3eldTdmFRJyxcbiAgICB9LFxuICB9LFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29uZmlnLmpzIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xuXG5leHBvcnQgY29uc3QgU0VUX1JVTlRJTUVfVkFSSUFCTEUgPSAnU0VUX1JVTlRJTUVfVkFSSUFCTEUnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb25zdGFudHMvaW5kZXguanMiLCJpbXBvcnQgeyB2YWxpZGF0ZSwgZXhlY3V0ZSwgc3BlY2lmaWVkUnVsZXMgfSBmcm9tICdncmFwaHFsJztcblxuaW1wb3J0IEFwb2xsb0NsaWVudCBmcm9tICdhcG9sbG8tY2xpZW50JztcblxuLy8gRXhlY3V0ZSBhbGwgR3JhcGhRTCByZXF1ZXN0cyBkaXJlY3RseSB3aXRob3V0XG5jbGFzcyBTZXJ2ZXJJbnRlcmZhY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zRGF0YSkge1xuICAgIHRoaXMuc2NoZW1hID0gb3B0aW9uc0RhdGEuc2NoZW1hO1xuICAgIHRoaXMub3B0aW9uc0RhdGEgPSBvcHRpb25zRGF0YTtcbiAgfVxuXG4gIGFzeW5jIHF1ZXJ5KHsgcXVlcnksIHZhcmlhYmxlcywgb3BlcmF0aW9uTmFtZSB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCB2YWxpZGF0aW9uUnVsZXMgPSBzcGVjaWZpZWRSdWxlcztcbiAgICAgIGNvbnN0IGN1c3RvbVZhbGlkYXRpb25SdWxlcyA9IHRoaXMub3B0aW9uc0RhdGEudmFsaWRhdGlvblJ1bGVzO1xuICAgICAgaWYgKGN1c3RvbVZhbGlkYXRpb25SdWxlcykge1xuICAgICAgICB2YWxpZGF0aW9uUnVsZXMgPSB2YWxpZGF0aW9uUnVsZXMuY29uY2F0KGN1c3RvbVZhbGlkYXRpb25SdWxlcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnMgPSB2YWxpZGF0ZSh0aGlzLnNjaGVtYSwgcXVlcnksIHZhbGlkYXRpb25SdWxlcyk7XG4gICAgICBpZiAodmFsaWRhdGlvbkVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yczogdmFsaWRhdGlvbkVycm9ycyB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKFxuICAgICAgICB0aGlzLnNjaGVtYSxcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHRoaXMub3B0aW9uc0RhdGEucm9vdFZhbHVlLFxuICAgICAgICB0aGlzLm9wdGlvbnNEYXRhLmNvbnRleHQsXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3BlcmF0aW9uTmFtZSxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoY29udGV4dEVycm9yKSB7XG4gICAgICByZXR1cm4geyBlcnJvcnM6IFtjb250ZXh0RXJyb3JdIH07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUFwb2xsb0NsaWVudChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQXBvbGxvQ2xpZW50KHtcbiAgICByZWR1eFJvb3RTZWxlY3Rvcjogc3RhdGUgPT4gc3RhdGUuYXBvbGxvLFxuICAgIG5ldHdvcmtJbnRlcmZhY2U6IG5ldyBTZXJ2ZXJJbnRlcmZhY2Uob3B0aW9ucyksXG4gICAgcXVlcnlEZWR1cGxpY2F0aW9uOiB0cnVlLFxuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29yZS9jcmVhdGVBcG9sbG9DbGllbnQvY3JlYXRlQXBvbGxvQ2xpZW50LnNlcnZlci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogQGZsb3cgKi9cblxudHlwZSBGZXRjaCA9ICh1cmw6IHN0cmluZywgb3B0aW9uczogP2FueSkgPT4gUHJvbWlzZTxhbnk+O1xuXG50eXBlIE9wdGlvbnMgPSB7XG4gIGJhc2VVcmw6IHN0cmluZyxcbiAgY29va2llPzogc3RyaW5nLFxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBhcm91bmQgdGhlIEhUTUw1IEZldGNoIEFQSSB0aGF0IHByb3ZpZGVzXG4gKiBkZWZhdWx0IGFyZ3VtZW50cyB0byBmZXRjaCguLi4pIGFuZCBpcyBpbnRlbmRlZCB0byByZWR1Y2UgdGhlIGFtb3VudFxuICogb2YgYm9pbGVycGxhdGUgY29kZSBpbiB0aGUgYXBwbGljYXRpb24uXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9BUEkvRmV0Y2hfQVBJL1VzaW5nX0ZldGNoXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZldGNoKGZldGNoOiBGZXRjaCwgeyBiYXNlVXJsLCBjb29raWUgfTogT3B0aW9ucykge1xuICAvLyBOT1RFOiBUd2VhayB0aGUgZGVmYXVsdCBvcHRpb25zIHRvIHN1aXRlIHlvdXIgYXBwbGljYXRpb24gbmVlZHNcbiAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgbWV0aG9kOiAnUE9TVCcsIC8vIGhhbmR5IHdpdGggR3JhcGhRTCBiYWNrZW5kc1xuICAgIG1vZGU6IGJhc2VVcmwgPyAnY29ycycgOiAnc2FtZS1vcmlnaW4nLFxuICAgIGNyZWRlbnRpYWxzOiBiYXNlVXJsID8gJ2luY2x1ZGUnIDogJ3NhbWUtb3JpZ2luJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAuLi4oY29va2llID8geyBDb29raWU6IGNvb2tpZSB9IDogbnVsbCksXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gKHVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkpID0+XG4gICAgdXJsLnN0YXJ0c1dpdGgoJy9ncmFwaHFsJykgfHwgdXJsLnN0YXJ0c1dpdGgoJy9hcGknKVxuICAgICAgPyBmZXRjaChgJHtiYXNlVXJsfSR7dXJsfWAsIHtcbiAgICAgICAgICAuLi5kZWZhdWx0cyxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIC4uLmRlZmF1bHRzLmhlYWRlcnMsXG4gICAgICAgICAgICAuLi4ob3B0aW9ucyAmJiBvcHRpb25zLmhlYWRlcnMpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICA6IGZldGNoKHVybCwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZldGNoO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jcmVhdGVGZXRjaC5qcyIsImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGNzdiBmcm9tICdjc3YnO1xuaW1wb3J0ICogYXMgYXN5bmMgZnJvbSAnYXN5bmMnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcbmltcG9ydCBUZWFtIGZyb20gJy4uL21vZGVscy9UZWFtJztcblxuY2xhc3MgQ1NWSW1wb3J0ZXIge1xuICBmaWxlUGF0aDtcbiAgZW5jb2RpbmcgPSAnVVRGLTgnO1xuXG4gIGNvbnN0cnVjdG9yKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuICB9XG5cbiAgcGVyZm9ybUltcG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQ1NWKCkudGhlbihcbiAgICAgIHJlcyA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgoZmluaXNoLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2Zvcm1BcnJheXRvT2JqZWN0KHJlcyk7XG5cbiAgICAgICAgICBsZXQgdXNlcnMgPSBbXTtcbiAgICAgICAgICBhc3luYy5lYWNoU2VyaWVzKFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIChpdGVtLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICBpZiAoaXRlbVsnVm9ybmFtZSBMw6R1ZmVyIDEnXSkge1xuICAgICAgICAgICAgICAgIFNwb25zb3IuY291bnQoe1xuICAgICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBTcG9uc29yLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RfZmlyc3ROYW1lOiBpdGVtLlZvcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgY29udGFjdF9sYXN0TmFtZTogaXRlbS5OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydOYW1lIEZpcm1hIC8gVmVyZWluIC8gU2NodWxlIG8uIMOkLiddIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtpdGVtLlZvcm5hbWV9ICR7aXRlbS5OYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiBpdGVtLlN1Ym1pdHRlZCxcbiAgICAgICAgICAgICAgICAgICAgICBwZXJzb25hbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3BvbnNvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUZWFtLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnTmFtZSBGaXJtYSAvIFZlcmVpbiAvIFNjaHVsZSBvLiDDpC4nXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2l0ZW0uVm9ybmFtZX0gJHtpdGVtLk5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3BvbnNvcl9pZDogc3BvbnNvci5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiBpdGVtLlN1Ym1pdHRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odGVhbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJ1bm5lcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtW2BWb3JuYW1lIEzDpHVmZXIgJHtpfWBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBydW5uZXJDb25mID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogaXRlbVtgTmFtZSBMw6R1ZmVyICR7aX1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiBpdGVtW2BWb3JuYW1lIEzDpHVmZXIgJHtpfWBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5kZXI6IGl0ZW1bYEdlc2NobGVjaHQgTMOkdWZlciAke2l9YF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpcnRoZGF5OiBpdGVtW2BHZWJ1cnRzZGF0dW0gTMOkdWZlciAke2l9YF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYW1faWQ6IHRlYW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogaXRlbS5TdWJtaXR0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVubmVycy5wdXNoKHJ1bm5lckNvbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBSdW5uZXIuYnVsa0NyZWF0ZShydW5uZXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VycyA9IHJ1bm5lcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFNwb25zb3IuY291bnQoe1xuICAgICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBTcG9uc29yLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGl0ZW1bJ0UtTWFpbCddLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RfZmlyc3ROYW1lOiBpdGVtLlZvcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgY29udGFjdF9sYXN0TmFtZTogaXRlbS5OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uU3BvbnNvciB8fCBgJHtpdGVtLlZvcm5hbWV9ICR7aXRlbS5OYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiBpdGVtLlN1Ym1pdHRlZCxcbiAgICAgICAgICAgICAgICAgICAgICBwZXJzb25hbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihzcG9uc29yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJ1bm5lci5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogaXRlbVsnRS1NYWlsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBpdGVtLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogaXRlbS5Wb3JuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5kZXI6IGl0ZW0uR2VzY2hsZWNodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmlydGhkYXk6IGl0ZW1bYEdlYnVydHNkYXR1bWBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzcG9uc29yX2lkOiBzcG9uc29yLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IGl0ZW0uU3VibWl0dGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2Vycy5wdXNoKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbmlzaCh1c2Vycyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGxvYWRDU1YoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgZnMucmVhZEZpbGUodGhpcy5maWxlUGF0aCwgdGhpcy5lbmNvZGluZywgKGVyciwgZmlsZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqKGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNzdi5wYXJzZShmaWxlLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgICAgZXJyID8gcmVqKGVycikgOiByZXMoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB0cmFuc2Zvcm1BcnJheXRvT2JqZWN0KGlucHV0KSB7XG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBrZXlzID0gaW5wdXQuc2hpZnQoKTtcbiAgICByZXR1cm4gaW5wdXQubWFwKHJvdyA9PlxuICAgICAgcm93LnJlZHVjZSgocmVzLCBjdXIsIGluZGV4KSA9PiB7XG4gICAgICAgIHJlc1trZXlzW2luZGV4XV0gPSBjdXIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSwge30pLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ1NWSW1wb3J0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvaW1wb3J0L2Nzdi1pbXBvcnQuanMiLCJpbXBvcnQgKiBhcyBhc3luYyBmcm9tICdhc3luYyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENTVkltcG9ydGVyIGZyb20gJy4vY3N2LWltcG9ydCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3N0Q1NWSW1wb3J0KHJlcSwgcmVzKSB7XG4gIGNvbnNvbGUubG9nKHJlcS5maWxlcyk7XG4gIC8vIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChcIlN1Y2Nlc3NcIik7XG4gIGlmICghcmVxLmZpbGVzKSByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ05vIGZpbGVzIHdlcmUgdXBsb2FkZWQuJyk7XG5cbiAgY29uc3QgZmlsZXMgPSBPYmplY3Qua2V5cyhyZXEuZmlsZXMpLm1hcChrZXkgPT4gcmVxLmZpbGVzW2tleV0pO1xuXG5cbiAgbGV0IGltcG9ydFJlcyA9IFtdO1xuICBhc3luYy5lYWNoU2VyaWVzKFxuICAgIGZpbGVzLFxuICAgIChmaWxlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgY29uc3QgZmlsZXBhdGggPSBwYXRoLnJlc29sdmUoXG4gICAgICAgIGAuL2ltcG9ydC8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfV8ke2ZpbGUubmFtZX1gLFxuICAgICAgKTtcbiAgICAgIGZpbGUubXYoZmlsZXBhdGgsIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbXBvcnRlciA9IG5ldyBDU1ZJbXBvcnRlcihmaWxlcGF0aCk7XG4gICAgICAgIGltcG9ydGVyXG4gICAgICAgICAgLnBlcmZvcm1JbXBvcnQoKVxuICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICBpbXBvcnRSZXMgPSByZXM7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5zZW5kKGVycik7XG4gICAgICByZXMuanNvbnAoaW1wb3J0UmVzKTtcbiAgICB9LFxuICApO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL2ltcG9ydC9pbXBvcnQtcmVxdWVzdC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi9SdW5uZXInO1xuXG5jb25zdCBMYXAgPSBNb2RlbC5kZWZpbmUoXG4gICdMYXAnLFxuICB7XG4gICAgaWQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG4gICAgICBkZWZhdWx0VmFsdWU6IERhdGFUeXBlLlVVSURWMSxcbiAgICAgIHByaW1hcnlLZXk6IHRydWUsXG4gICAgfSxcblxuICAgIGluc2VydDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuREFURSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuTk9XLFxuICAgIH0sXG5cbiAgICBydW5uZXJfaWQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG5cbiAgICAgIHJlZmVyZW5jZXM6IHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIHJlZmVyZW5jZSB0byBhbm90aGVyIG1vZGVsXG4gICAgICAgIG1vZGVsOiBSdW5uZXIsXG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29sdW1uIG5hbWUgb2YgdGhlIHJlZmVyZW5jZWQgbW9kZWxcbiAgICAgICAga2V5OiAnaWQnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB7fSxcbik7XG5cbmV4cG9ydCBkZWZhdWx0IExhcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvTGFwLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi9TcG9uc29yJztcbmltcG9ydCBUZWFtIGZyb20gJy4vVGVhbSc7XG5cbmNvbnN0IFJ1bm5lciA9IE1vZGVsLmRlZmluZShcbiAgJ1J1bm5lcicsXG4gIHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgZmlyc3ROYW1lOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgICB9LFxuXG4gICAgbGFzdE5hbWU6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICAgIH0sXG5cbiAgICBnZW5kZXI6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyg1MCksXG4gICAgfSxcblxuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgICAgIHZhbGlkYXRlOiB7IGlzRW1haWw6IHRydWUgfVxuICAgIH0sXG5cbiAgICBpbnNlcnQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLkRBVEUsXG4gICAgICBkZWZhdWx0VmFsdWU6IERhdGFUeXBlLk5PVyxcbiAgICB9LFxuXG4gICAgYmlydGhkYXk6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLkRBVEUsXG4gICAgfSxcblxuICAgIHNwb25zb3JfYW1vdW50OiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcsXG4gICAgfSxcblxuICAgIHNwb25zb3JfbmFtZToge1xuICAgICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gICAgfSxcblxuICAgIHNwb25zb3JfaWQ6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG5cbiAgICAgIHJlZmVyZW5jZXM6IHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIHJlZmVyZW5jZSB0byBhbm90aGVyIG1vZGVsXG4gICAgICAgIG1vZGVsOiBTcG9uc29yLFxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGNvbHVtbiBuYW1lIG9mIHRoZSByZWZlcmVuY2VkIG1vZGVsXG4gICAgICAgIGtleTogJ2lkJyxcblxuICAgICAgICAvLyBUaGlzIGRlY2xhcmVzIHdoZW4gdG8gY2hlY2sgdGhlIGZvcmVpZ24ga2V5IGNvbnN0cmFpbnQuIFBvc3RncmVTUUwgb25seS5cbiAgICAgICAgZGVmZXJyYWJsZTogRGF0YVR5cGUuRGVmZXJyYWJsZS5JTklUSUFMTFlfSU1NRURJQVRFLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgdGVhbV9pZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcblxuICAgICAgcmVmZXJlbmNlczoge1xuICAgICAgICAvLyBUaGlzIGlzIGEgcmVmZXJlbmNlIHRvIGFub3RoZXIgbW9kZWxcbiAgICAgICAgbW9kZWw6IFRlYW0sXG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29sdW1uIG5hbWUgb2YgdGhlIHJlZmVyZW5jZWQgbW9kZWxcbiAgICAgICAga2V5OiAnaWQnLFxuXG4gICAgICAgIC8vIFRoaXMgZGVjbGFyZXMgd2hlbiB0byBjaGVjayB0aGUgZm9yZWlnbiBrZXkgY29uc3RyYWludC4gUG9zdGdyZVNRTCBvbmx5LlxuICAgICAgICBkZWZlcnJhYmxlOiBEYXRhVHlwZS5EZWZlcnJhYmxlLklOSVRJQUxMWV9JTU1FRElBVEUsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBudW1iZXI6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLklOVEVHRVIsXG4gICAgICB1bmlxdWU6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluZGV4ZXM6IFt7IGZpZWxkczogWydlbWFpbCddIH1dLFxuICB9LFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgUnVubmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9SdW5uZXIuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IFNwb25zb3IgPSBNb2RlbC5kZWZpbmUoJ1Nwb25zb3InLCB7XG4gIGlkOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcbiAgICBkZWZhdWx0VmFsdWU6IERhdGFUeXBlLlVVSURWMSxcbiAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICB9LFxuXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gICAgdmFsaWRhdGU6IHsgaXNFbWFpbDogdHJ1ZSB9XG4gIH0sXG5cbiAgaW5zZXJ0OiB7XG4gICAgdHlwZTogRGF0YVR5cGUuREFURSxcbiAgICBkZWZhdWx0VmFsdWU6IERhdGFUeXBlLk5PVyxcbiAgfSxcblxuICBuYW1lOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gIH0sXG5cbiAgY29udGFjdF9maXJzdE5hbWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcblxuICBjb250YWN0X2xhc3ROYW1lOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gIH0sXG5cbiAgc3BvbnNvcl9hbW91bnQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcsXG4gIH0sXG5cbiAgcGVyc29uYWw6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICB9LFxuXG4gIGNhc2g6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICB9LFxuXG4gIGRvbmF0aW9uX3JlY2VpcHQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICB9LFxuXG5cdGZpZnR5RmlmdHk6IHtcblx0XHR0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICB9LFxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvU3BvbnNvci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcbmltcG9ydCBTcG9uc29yIGZyb20gXCIuL1Nwb25zb3JcIjtcblxuY29uc3QgVGVhbSA9IE1vZGVsLmRlZmluZSgnVGVhbScsIHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG5cbiAgbmFtZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICB9LFxuXG4gIHNwb25zb3JfYW1vdW50OiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HLFxuICB9LFxuXG4gIGluc2VydDoge1xuICAgIHR5cGU6IERhdGFUeXBlLkRBVEUsXG4gICAgZGVmYXVsdFZhbHVlOiBEYXRhVHlwZS5OT1csXG4gIH0sXG5cbiAgc3BvbnNvcl9pZDoge1xuICAgIHR5cGU6IERhdGFUeXBlLlVVSUQsXG4gICAgcmVmZXJlbmNlczoge1xuICAgICAgLy8gVGhpcyBpcyBhIHJlZmVyZW5jZSB0byBhbm90aGVyIG1vZGVsXG4gICAgICBtb2RlbDogU3BvbnNvcixcblxuICAgICAgLy8gVGhpcyBpcyB0aGUgY29sdW1uIG5hbWUgb2YgdGhlIHJlZmVyZW5jZWQgbW9kZWxcbiAgICAgIGtleTogJ2lkJyxcblxuICAgICAgLy8gVGhpcyBkZWNsYXJlcyB3aGVuIHRvIGNoZWNrIHRoZSBmb3JlaWduIGtleSBjb25zdHJhaW50LiBQb3N0Z3JlU1FMIG9ubHkuXG4gICAgICBkZWZlcnJhYmxlOiBEYXRhVHlwZS5EZWZlcnJhYmxlLklOSVRJQUxMWV9JTU1FRElBVEUsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZWFtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9UZWFtLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuXG5jb25zdCBVc2VyID0gTW9kZWwuZGVmaW5lKFxuICAnVXNlcicsXG4gIHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogRGF0YVR5cGUuVVVJRFYxLFxuICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgZW1haWw6IHtcbiAgICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICAgICAgdmFsaWRhdGU6IHsgaXNFbWFpbDogdHJ1ZSB9LFxuICAgIH0sXG5cbiAgICBlbWFpbENvbmZpcm1lZDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuQk9PTEVBTixcbiAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluZGV4ZXM6IFt7IGZpZWxkczogWydlbWFpbCddIH1dLFxuICB9LFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvVXNlci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcblxuY29uc3QgVXNlckNsYWltID0gTW9kZWwuZGVmaW5lKCdVc2VyQ2xhaW0nLCB7XG4gIHR5cGU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcsXG4gIH0sXG5cbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcsXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlckNsYWltO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9Vc2VyQ2xhaW0uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IFVzZXJMb2dpbiA9IE1vZGVsLmRlZmluZSgnVXNlckxvZ2luJywge1xuICBuYW1lOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDUwKSxcbiAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICB9LFxuXG4gIGtleToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygxMDApLFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlckxvZ2luO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9Vc2VyTG9naW4uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IFVzZXJQcm9maWxlID0gTW9kZWwuZGVmaW5lKCdVc2VyUHJvZmlsZScsIHtcbiAgdXNlcklkOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuVVVJRCxcbiAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICB9LFxuXG4gIGRpc3BsYXlOYW1lOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDEwMCksXG4gIH0sXG5cbiAgcGljdHVyZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygyNTUpLFxuICB9LFxuXG4gIGdlbmRlcjoge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyg1MCksXG4gIH0sXG5cbiAgbG9jYXRpb246IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMTAwKSxcbiAgfSxcblxuICB3ZWJzaXRlOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlclByb2ZpbGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL1VzZXJQcm9maWxlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgc2VxdWVsaXplIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5pbXBvcnQgVXNlciBmcm9tICcuL1VzZXInO1xuaW1wb3J0IFVzZXJMb2dpbiBmcm9tICcuL1VzZXJMb2dpbic7XG5pbXBvcnQgVXNlckNsYWltIGZyb20gJy4vVXNlckNsYWltJztcbmltcG9ydCBVc2VyUHJvZmlsZSBmcm9tICcuL1VzZXJQcm9maWxlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi9SdW5uZXInO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi9TcG9uc29yJztcbmltcG9ydCBUZWFtIGZyb20gJy4vVGVhbSc7XG5cblVzZXIuaGFzTWFueShVc2VyTG9naW4sIHtcbiAgZm9yZWlnbktleTogJ3VzZXJJZCcsXG4gIGFzOiAnbG9naW5zJyxcbiAgb25VcGRhdGU6ICdjYXNjYWRlJyxcbiAgb25EZWxldGU6ICdjYXNjYWRlJyxcbn0pO1xuXG5Vc2VyLmhhc01hbnkoVXNlckNsYWltLCB7XG4gIGZvcmVpZ25LZXk6ICd1c2VySWQnLFxuICBhczogJ2NsYWltcycsXG4gIG9uVXBkYXRlOiAnY2FzY2FkZScsXG4gIG9uRGVsZXRlOiAnY2FzY2FkZScsXG59KTtcblxuVXNlci5oYXNPbmUoVXNlclByb2ZpbGUsIHtcbiAgZm9yZWlnbktleTogJ3VzZXJJZCcsXG4gIGFzOiAncHJvZmlsZScsXG4gIG9uVXBkYXRlOiAnY2FzY2FkZScsXG4gIG9uRGVsZXRlOiAnY2FzY2FkZScsXG59KTtcblxuZnVuY3Rpb24gc3luYyguLi5hcmdzKSB7XG4gIHJldHVybiBzZXF1ZWxpemUuc3luYyguLi5hcmdzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBzeW5jIH07XG5leHBvcnQgeyBVc2VyLCBVc2VyTG9naW4sIFVzZXJDbGFpbSwgVXNlclByb2ZpbGUsIFNwb25zb3IsIFRlYW0sIFJ1bm5lciB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9pbmRleC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJ1bm5lckxhcHNUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lckxhcHNUeXBlJztcbmltcG9ydCB7XG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgTGFwIGZyb20gJy4uL21vZGVscy9MYXAnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcblxuY29uc3QgYWRkTGFwID0ge1xuICB0eXBlOiBSdW5uZXJMYXBzVHlwZSxcbiAgYXJnczogeyBudW1iZXI6IHsgdHlwZTogbmV3IE5vbk51bGwoSW50ZWdlclR5cGUpIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IG51bWJlciB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kT25lKHsgd2hlcmU6IHsgbnVtYmVyIH0gfSkudGhlbihyZXMgPT4ge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICBjb25zdCBiZWZvcmUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBiZWZvcmUuc2V0U2Vjb25kcyhiZWZvcmUuZ2V0U2Vjb25kcygpIC0gMzApO1xuICAgICAgICByZXR1cm4gTGFwLmNvdW50KHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgcnVubmVyX2lkOiByZXMuaWQsXG4gICAgICAgICAgICBpbnNlcnQ6IHtcbiAgICAgICAgICAgICAgJGd0ZTogYmVmb3JlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBMYXAuY3JlYXRlKHtcbiAgICAgICAgICAgICAgcnVubmVyX2lkOiByZXMuaWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJ1bm5lcl9pZDogcmVzLmlkLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfWVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZWluIEzDpHVmZXIgZ2VmdW5kZW4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZExhcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvYWRkTGFwLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge0dyYXBoUUxJRCwgR3JhcGhRTExpc3QsIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgU3VjY2Vzc1R5cGUgZnJvbSAnLi4vdHlwZXMvU3VjY2Vzc1R5cGUnO1xuXG5jb25zdCBhZGRSdW5uZXJzVG9UZWFtID0ge1xuICB0eXBlOiBTdWNjZXNzVHlwZSxcbiAgYXJnczoge1xuICAgIHRlYW1faWQ6IHsgdHlwZTogbmV3IE5vbk51bGwoR3JhcGhRTElEKSB9LFxuICAgIHJ1bm5lcl9pZHM6IHsgdHlwZTogbmV3IEdyYXBoUUxMaXN0KG5ldyBOb25OdWxsKEdyYXBoUUxJRCkpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyB0ZWFtX2lkLCBydW5uZXJfaWRzIH0pIHtcbiAgICByZXR1cm4gUnVubmVyLnVwZGF0ZShcbiAgICAgIHsgdGVhbV9pZCB9LFxuICAgICAgeyB3aGVyZTogeyBpZDogcnVubmVyX2lkcyB9IH0sXG4gICAgKS50aGVuKChhZmZlY3RlZENvdW50LCBhZmZlY3RlZFJvd3MpID0+ICh7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgbWVzc2FnZTogJ1J1bm5lcnMgdXBkYXRlZCcsXG4gICAgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkUnVubmVyc1RvVGVhbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvYWRkUnVubmVyc1RvVGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVJ1bm5lcklucHV0VHlwZSwge1xuICBSdW5uZXJJbnB1dEZpZWxkcyxcbn0gZnJvbSAnLi4vdHlwZXMvQ3JlYXRlUnVubmVySW5wdXRUeXBlJztcbmltcG9ydCBSdW5uZXJUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lclR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBDcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZSBmcm9tICcuLi90eXBlcy9DcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgU3BvbnNvciBmcm9tICcuLi9tb2RlbHMvU3BvbnNvcic7XG5pbXBvcnQgeyBDcmVhdGVTcG9uc29ySW5wdXRUeXBlRmllbGRzIH0gZnJvbSAnLi4vdHlwZXMvQ3JlYXRlU3BvbnNvcklucHV0VHlwZSc7XG5cbmNvbnN0IGNyZWF0ZVBlcnNvbmFsUnVubmVyID0ge1xuICB0eXBlOiBSdW5uZXJUeXBlLFxuICBhcmdzOiB7IHJ1bm5lcjogeyB0eXBlOiBDcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBydW5uZXIgfSkge1xuICAgIGNvbnN0IHJlZHVjZXIgPSAocmVzLCBjdXIpID0+IHtcbiAgICAgIHJlc1tjdXJdID0gcnVubmVyW2N1cl07XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gICAgY29uc3QgcnVubmVyVmFsdWVzID0gT2JqZWN0LmtleXMoUnVubmVySW5wdXRGaWVsZHMpLnJlZHVjZShyZWR1Y2VyLCB7fSk7XG4gICAgY29uc3Qgc3BvbnNvclZhbHVlcyA9IE9iamVjdC5rZXlzKFxuICAgICAgQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyxcbiAgICApLnJlZHVjZShyZWR1Y2VyLCB7XG4gICAgICBwZXJzb25hbDogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gU3BvbnNvci5jcmVhdGUoc3BvbnNvclZhbHVlcykudGhlbihyZXMgPT5cbiAgICAgIFJ1bm5lci5jcmVhdGUoeyAuLi5ydW5uZXJWYWx1ZXMsIHNwb25zb3JfaWQ6IHJlcy5pZCB9KSxcbiAgICApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGVyc29uYWxSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL2NyZWF0ZVBlcnNvbmFsUnVubmVyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgQ3JlYXRlUnVubmVySW5wdXRUeXBlIGZyb20gJy4uL3R5cGVzL0NyZWF0ZVJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5cbmNvbnN0IGNyZWF0ZVJ1bm5lciA9IHtcbiAgdHlwZTogUnVubmVyVHlwZSxcbiAgYXJnczogeyBydW5uZXI6IHsgdHlwZTogQ3JlYXRlUnVubmVySW5wdXRUeXBlIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IHJ1bm5lciB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5jcmVhdGUocnVubmVyKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bm5lcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlUnVubmVyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU3BvbnNvclR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IENyZWF0ZVNwb25zb3JJbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlU3BvbnNvcklucHV0VHlwZSc7XG5cbmNvbnN0IGNyZWF0ZVNwb25zb3IgPSB7XG4gIHR5cGU6IFNwb25zb3JUeXBlLFxuICBhcmdzOiB7IHNwb25zb3I6IHsgdHlwZTogQ3JlYXRlU3BvbnNvcklucHV0VHlwZSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBzcG9uc29yIH0pIHtcbiAgICBzcG9uc29yLnBlcnNvbmFsID0gZmFsc2U7XG4gICAgcmV0dXJuIFNwb25zb3IuY3JlYXRlKHNwb25zb3IpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlU3BvbnNvci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVRlYW1JbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlVGVhbUlucHV0VHlwZSc7XG5pbXBvcnQgVGVhbVR5cGUgZnJvbSAnLi4vdHlwZXMvVGVhbVR5cGUnO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuXG5jb25zdCBjcmVhdGVUZWFtID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczogeyB0ZWFtOiB7IHR5cGU6IENyZWF0ZVRlYW1JbnB1dFR5cGUgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgdGVhbSB9KSB7XG4gICAgcmV0dXJuIFRlYW0uY3JlYXRlKHRlYW0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGVhbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvY3JlYXRlVGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJRCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFN1Y2Nlc3NUeXBlIGZyb20gJy4uL3R5cGVzL1N1Y2Nlc3NUeXBlJztcblxuY29uc3QgZGVsZXRlUnVubmVyID0ge1xuICB0eXBlOiBTdWNjZXNzVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBHcmFwaFFMSUQgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgaWQgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZGVzdHJveSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBpZCxcbiAgICAgIH0sXG4gICAgfSkudGhlbihhZmZlY3RlZFJvd3MgPT4gKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogYWZmZWN0ZWRSb3dzIH0pKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlbGV0ZVJ1bm5lcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvZGVsZXRlUnVubmVyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU3BvbnNvciBmcm9tICcuLi9tb2RlbHMvU3BvbnNvcic7XG5pbXBvcnQgeyBHcmFwaFFMU3RyaW5nIH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgU3VjY2Vzc1R5cGUgZnJvbSAnLi4vdHlwZXMvU3VjY2Vzc1R5cGUnO1xuXG5jb25zdCBkZWxldGVTcG9uc29yID0ge1xuICB0eXBlOiBTdWNjZXNzVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gU3BvbnNvci5kZXN0cm95KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkLFxuICAgICAgfSxcbiAgICB9KS50aGVuKGFmZmVjdGVkUm93cyA9PiAoeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBhZmZlY3RlZFJvd3MgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVsZXRlU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvZGVsZXRlU3BvbnNvci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFN1Y2Nlc3NUeXBlIGZyb20gJy4uL3R5cGVzL1N1Y2Nlc3NUeXBlJztcblxuY29uc3QgZGVsZXRlVGVhbSA9IHtcbiAgdHlwZTogU3VjY2Vzc1R5cGUsXG4gIGFyZ3M6IHsgaWQ6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxJRCkgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgaWQgfSkge1xuICAgIHJldHVybiBUZWFtLmRlc3Ryb3koe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgaWQsXG4gICAgICB9LFxuICAgIH0pLnRoZW4oYWZmZWN0ZWRSb3dzID0+ICh7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IGFmZmVjdGVkUm93cyB9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWxldGVUZWFtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy9kZWxldGVUZWFtLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUnVubmVyTGFwc1R5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGFwc1R5cGUnO1xuaW1wb3J0IHtcblx0R3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuXHRHcmFwaFFMSW50IGFzIEludGVnZXJUeXBlLFxuXHRHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLCBHcmFwaFFMSUQsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IExhcCBmcm9tICcuLi9tb2RlbHMvTGFwJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi4vbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgVGVhbVR5cGUgZnJvbSBcIi4uL3R5cGVzL1RlYW1UeXBlXCI7XG5cbmNvbnN0IHJlbW92ZVJ1bm5lckZyb21UZWFtID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczoge1xuICAgIHRlYW1faWQ6IHsgdHlwZTogbmV3IE5vbk51bGwoR3JhcGhRTElEKSB9LFxuXHRcdHJ1bm5lcl9pZDogeyB0eXBlOiBuZXcgTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgfSxcbiAgcmVzb2x2ZShyb290LCB7IHRlYW1faWQsIHJ1bm5lcl9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kQnlJZChydW5uZXJfaWQpLnRoZW4ocmVzID0+IHJlcy51cGRhdGUoe3RlYW1faWQ6IG51bGx9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCByZW1vdmVSdW5uZXJGcm9tVGVhbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvcmVtb3ZlUnVubmVyRnJvbVRlYW0uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBUZWFtIGZyb20gJy4uL21vZGVscy9UZWFtJztcbmltcG9ydCB7R3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgVGVhbVR5cGUgZnJvbSBcIi4uL3R5cGVzL1RlYW1UeXBlXCI7XG5cbmNvbnN0IHNldFRlYW1TcG9uc29yID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczoge1xuICAgIHRlYW1faWQ6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxJRCkgfSxcbiAgICBzcG9uc29yX2lkOiB7IHR5cGU6IEdyYXBoUUxJRCB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgdGVhbV9pZCwgc3BvbnNvcl9pZCB9KSB7XG4gICAgcmV0dXJuIFRlYW0uZmluZEJ5SWQodGVhbV9pZCkudGhlbihyZXMgPT4gcmVzLnVwZGF0ZSh7c3BvbnNvcl9pZH0pKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNldFRlYW1TcG9uc29yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy9zZXRUZWFtU3BvbnNvci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVJ1bm5lcklucHV0VHlwZSwge1xuICBSdW5uZXJJbnB1dEZpZWxkcyxcbn0gZnJvbSAnLi4vdHlwZXMvQ3JlYXRlUnVubmVySW5wdXRUeXBlJztcbmltcG9ydCBSdW5uZXJUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lclR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBDcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZSBmcm9tICcuLi90eXBlcy9DcmVhdGVQZXJzb25hbFJ1bm5lcklucHV0VHlwZSc7XG5pbXBvcnQgU3BvbnNvciBmcm9tICcuLi9tb2RlbHMvU3BvbnNvcic7XG5pbXBvcnQgeyBDcmVhdGVTcG9uc29ySW5wdXRUeXBlRmllbGRzIH0gZnJvbSAnLi4vdHlwZXMvQ3JlYXRlU3BvbnNvcklucHV0VHlwZSc7XG5pbXBvcnQgeyBHcmFwaFFMSUQsIEdyYXBoUUxOb25OdWxsIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IHVwZGF0ZVBlcnNvbmFsUnVubmVyID0ge1xuICB0eXBlOiBSdW5uZXJUeXBlLFxuICBhcmdzOiB7XG4gICAgaWQ6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxJRCkgfSxcbiAgICBydW5uZXI6IHsgdHlwZTogQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IHJ1bm5lciwgaWQgfSkge1xuICAgIGNvbnN0IHJlZHVjZXIgPSAocmVzLCBjdXIpID0+IHtcbiAgICAgIHJlc1tjdXJdID0gcnVubmVyW2N1cl07XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gICAgY29uc3QgcnVubmVyVmFsdWVzID0gT2JqZWN0LmtleXMoUnVubmVySW5wdXRGaWVsZHMpLnJlZHVjZShyZWR1Y2VyLCB7fSk7XG4gICAgY29uc3Qgc3BvbnNvclZhbHVlcyA9IE9iamVjdC5rZXlzKFxuICAgICAgQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyxcbiAgICApLnJlZHVjZShyZWR1Y2VyLCB7XG4gICAgICBwZXJzb25hbDogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gUnVubmVyLmZpbmRCeUlkKGlkKS50aGVuKGZvdW5kUnVubmVyID0+IHtcbiAgICAgIGlmICghZm91bmRSdW5uZXIuc3BvbnNvcl9pZCkge1xuICAgICAgICByZXR1cm4gU3BvbnNvci5jcmVhdGUoc3BvbnNvclZhbHVlcykudGhlbihyZXMgPT4ge1xuICAgICAgICAgIHJ1bm5lclZhbHVlcy5zcG9uc29yX2lkID0gcmVzLmlkO1xuICAgICAgICAgIHJldHVybiBmb3VuZFJ1bm5lci51cGRhdGUoeyAuLi5ydW5uZXJWYWx1ZXMgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNwb25zb3IudXBkYXRlKHNwb25zb3JWYWx1ZXMsIHtcbiAgICAgICAgd2hlcmU6IHsgaWQ6IGZvdW5kUnVubmVyLnNwb25zb3JfaWQgfSxcbiAgICAgIH0pLnRoZW4ocmVzID0+IGZvdW5kUnVubmVyLnVwZGF0ZSh7IC4uLnJ1bm5lclZhbHVlcyB9KSk7XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVQZXJzb25hbFJ1bm5lcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tdXRhdGlvbnMvdXBkYXRlUGVyc29uYWxSdW5uZXIuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDcmVhdGVSdW5uZXJJbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlUnVubmVySW5wdXRUeXBlJztcbmltcG9ydCBSdW5uZXJUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lclR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGwgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgY3JlYXRlUnVubmVyID0ge1xuICB0eXBlOiBSdW5uZXJUeXBlLFxuICBhcmdzOiB7XG4gICAgaWQ6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxJRCkgfSxcbiAgICBydW5uZXI6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKENyZWF0ZVJ1bm5lcklucHV0VHlwZSkgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkLCBydW5uZXIgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZmluZEJ5SWQoaWQpLnRoZW4ocmVzID0+IHJlcy51cGRhdGUocnVubmVyKSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdW5uZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVJ1bm5lci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IENyZWF0ZVNwb25zb3JJbnB1dFR5cGUgZnJvbSAnLi4vdHlwZXMvQ3JlYXRlU3BvbnNvcklucHV0VHlwZSc7XG5pbXBvcnQgU3BvbnNvclR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBjcmVhdGVTcG9uc29yID0ge1xuICB0eXBlOiBTcG9uc29yVHlwZSxcbiAgYXJnczoge1xuICAgIGlkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gICAgc3BvbnNvcjogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoQ3JlYXRlU3BvbnNvcklucHV0VHlwZSkgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkLCBzcG9uc29yIH0pIHtcbiAgICByZXR1cm4gU3BvbnNvci5maW5kQnlJZChpZCkudGhlbihyZXMgPT4gcmVzLnVwZGF0ZShzcG9uc29yKSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTcG9uc29yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL211dGF0aW9ucy91cGRhdGVTcG9uc29yLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgQ3JlYXRlVGVhbUlucHV0VHlwZSBmcm9tICcuLi90eXBlcy9DcmVhdGVUZWFtSW5wdXRUeXBlJztcbmltcG9ydCBUZWFtVHlwZSBmcm9tICcuLi90eXBlcy9UZWFtVHlwZSc7XG5pbXBvcnQgVGVhbSBmcm9tICcuLi9tb2RlbHMvVGVhbSc7XG5pbXBvcnQgeyBHcmFwaFFMSUQsIEdyYXBoUUxOb25OdWxsIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IHVwZGF0ZVRlYW0gPSB7XG4gIHR5cGU6IFRlYW1UeXBlLFxuICBhcmdzOiB7XG4gICAgaWQ6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKEdyYXBoUUxJRCkgfSxcbiAgICB0ZWFtOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChDcmVhdGVUZWFtSW5wdXRUeXBlKSB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgaWQsIHRlYW0gfSkge1xuICAgIHJldHVybiBUZWFtLmZpbmRCeUlkKGlkKS50aGVuKHJlcyA9PiByZXMudXBkYXRlKHRlYW0pKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZVRlYW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbXV0YXRpb25zL3VwZGF0ZVRlYW0uanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBDaGVja051bWJlclR5cGUgZnJvbSAnLi4vdHlwZXMvQ2hlY2tOdW1iZXJUeXBlJztcbmltcG9ydCBSdW5uZXIgZnJvbSAnLi8uLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJbnQsIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsIEdyYXBoUUxTdHJpbmcgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgY2hlY2tOdW1iZXIgPSB7XG4gIHR5cGU6IENoZWNrTnVtYmVyVHlwZSxcbiAgYXJnczoge1xuICAgIG51bWJlcjogeyB0eXBlOiBuZXcgTm9uTnVsbChHcmFwaFFMSW50KSB9LFxuICAgIHJ1bm5lcl9pZDogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyBudW1iZXIsIHJ1bm5lcl9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kT25lKHsgd2hlcmU6IHsgbnVtYmVyIH0gfSkudGhlbihyZXN1bHQgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0YXZhaWxhYmxlOiAhcmVzdWx0IHx8IHJlc3VsdC5pZCA9PT0gcnVubmVyX2lkLFxuXHRcdFx0fVxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOdW1iZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9jaGVja051bWJlci5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFVzZXJUeXBlIGZyb20gJy4uL3R5cGVzL1VzZXJUeXBlJztcblxuY29uc3QgbWUgPSB7XG4gIHR5cGU6IFVzZXJUeXBlLFxuICByZXNvbHZlKHsgcmVxdWVzdCB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHJlcXVlc3QudXNlciAmJiB7XG4gICAgICAgIGlkOiByZXF1ZXN0LnVzZXIuaWQsXG4gICAgICAgIGVtYWlsOiByZXF1ZXN0LnVzZXIuZW1haWwsXG4gICAgICB9XG4gICAgKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1lO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvbWUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7IEdyYXBoUUxMaXN0IGFzIExpc3QgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJztcbmltcG9ydCBOZXdzSXRlbVR5cGUgZnJvbSAnLi4vdHlwZXMvTmV3c0l0ZW1UeXBlJztcblxuLy8gUmVhY3QuanMgTmV3cyBGZWVkIChSU1MpXG5jb25zdCB1cmwgPVxuICAnaHR0cHM6Ly9hcGkucnNzMmpzb24uY29tL3YxL2FwaS5qc29uJyArXG4gICc/cnNzX3VybD1odHRwcyUzQSUyRiUyRnJlYWN0anNuZXdzLmNvbSUyRmZlZWQueG1sJztcblxubGV0IGl0ZW1zID0gW107XG5sZXQgbGFzdEZldGNoVGFzaztcbmxldCBsYXN0RmV0Y2hUaW1lID0gbmV3IERhdGUoMTk3MCwgMCwgMSk7XG5cbmNvbnN0IG5ld3MgPSB7XG4gIHR5cGU6IG5ldyBMaXN0KE5ld3NJdGVtVHlwZSksXG4gIHJlc29sdmUoKSB7XG4gICAgaWYgKGxhc3RGZXRjaFRhc2spIHtcbiAgICAgIHJldHVybiBsYXN0RmV0Y2hUYXNrO1xuICAgIH1cblxuICAgIGlmIChuZXcgRGF0ZSgpIC0gbGFzdEZldGNoVGltZSA+IDEwMDAgKiA2MCAqIDEwIC8qIDEwIG1pbnMgKi8pIHtcbiAgICAgIGxhc3RGZXRjaFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgbGFzdEZldGNoVGFzayA9IGZldGNoKHVybClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgIGl0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsYXN0RmV0Y2hUYXNrID0gbnVsbDtcbiAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGxhc3RGZXRjaFRhc2sgPSBudWxsO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGFzdEZldGNoVGFzaztcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBuZXdzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvbmV3cy5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHsgR3JhcGhRTEludCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFJ1bm5lckxpc3RUeXBlIGZyb20gJy4uL3R5cGVzL1J1bm5lckxpc3RUeXBlJztcbmltcG9ydCBzZXF1ZWxpemUgZnJvbSAnLi8uLi9zZXF1ZWxpemUnO1xuXG5jb25zdCByZXN1bHRzID0ge1xuICB0eXBlOiBSdW5uZXJMaXN0VHlwZSxcbiAgYXJnczoge1xuICAgIG1pbkFnZTogeyB0eXBlOiBHcmFwaFFMSW50IH0sXG4gICAgbWF4QWdlOiB7IHR5cGU6IEdyYXBoUUxJbnQgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IG1pbkFnZSwgbWF4QWdlIH0pIHtcbiAgICByZXR1cm4gc2VxdWVsaXplXG4gICAgICAucXVlcnkoXG4gICAgICAgIGBTRUxFQ1QgXG4gICAgICAgIFJ1bm5lci5pZCBhcyBpZCwgXG4gICAgICAgIENPVU5UKFJ1bm5lci5pZCkgYXMgbGFwcywgXG4gICAgICAgIGNhc3Qoc3RyZnRpbWUoJyVZLiVtJWQnLCAnbm93JykgLSBzdHJmdGltZSgnJVkuJW0lZCcsIGRhdGV0aW1lKGJpcnRoZGF5LCAnbG9jYWx0aW1lJykpIGFzIGludCkgYXMgYWdlLCAgXG4gICAgICAgIGRhdGV0aW1lKGJpcnRoZGF5LCAnbG9jYWx0aW1lJykgYXMgYmlydGhkYXRlLCBcbiAgICAgICAgZmlyc3ROYW1lLCBcbiAgICAgICAgbGFzdE5hbWUsIFxuICAgICAgICBSdW5uZXIuZW1haWwgYXMgZW1haWwsXG4gICAgICAgIGdlbmRlcixcbiAgICAgICAgbnVtYmVyLFxuICAgICAgICBcbiAgICAgICAgUnVubmVyLnNwb25zb3JfYW1vdW50IGFzIHNwb25zb3JfYW1vdW50LFxuICAgICAgICBTcG9uc29yLmlkIGFzIHNwb25zb3JfaWQsXG4gICAgICAgIFNwb25zb3IuZW1haWwgYXMgc3BvbnNvcl9lbWFpbCwgXG4gICAgICAgIFNwb25zb3IubmFtZSBhcyBzcG9uc29yX25hbWUsIFxuICAgICAgICBTcG9uc29yLmNvbnRhY3RfZmlyc3ROYW1lIGFzIHNwb25zb3JfY29udGFjdF9maXJzdE5hbWUsIFxuICAgICAgICBTcG9uc29yLmNvbnRhY3RfbGFzdE5hbWUgYXMgc3BvbnNvcl9jb250YWN0X2xhc3ROYW1lLFxuICAgICAgICBTcG9uc29yLnNwb25zb3JfYW1vdW50IGFzIHNwb25zb3Jfc3BvbnNvcl9hbW91bnQsXG4gICAgICAgIFNwb25zb3IuZG9uYXRpb25fcmVjZWlwdCBhcyBzcG9uc29yX2RvbmF0aW9uX3JlY2VpcHRcbkZST00gUnVubmVyIExFRlQgSk9JTiBMYXAgT04gUnVubmVyLmlkID0gTGFwLnJ1bm5lcl9pZCBJTk5FUiBKT0lOIFNwb25zb3IgT04gUnVubmVyLnNwb25zb3JfaWQgPSBTcG9uc29yLmlkIFxuV0hFUkUgYWdlID49ICR7bWluQWdlfSBhbmQgYWdlIDw9ICR7bWF4QWdlfVxuR1JPVVAgQlkgUnVubmVyLmlkXG5PUkRFUiBCWSAtTGFwc2AsXG4gICAgICApXG4gICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBydW5uZXJzOiByZXN1bHRzWzBdLm1hcChyb3cgPT4ge1xuICAgICAgICAgICAgY29uc3QgcnVubmVyID0gT2JqZWN0LmtleXMocm93KVxuICAgICAgICAgICAgICAuZmlsdGVyKGtleSA9PiAha2V5LmluY2x1ZGVzKCdzcG9uc29yXycpKVxuICAgICAgICAgICAgICAucmVkdWNlKChyZXMsIGN1cikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc1tjdXJdID0gcm93W2N1cl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgY29uc3Qgc3BvbnNvciA9IE9iamVjdC5rZXlzKHJvdylcbiAgICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4ga2V5LmluY2x1ZGVzKCdzcG9uc29yXycpKVxuICAgICAgICAgICAgICAucmVkdWNlKChyZXMsIGN1cikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc1tjdXIucmVwbGFjZSgnc3BvbnNvcl8nLCAnJyldID0gcm93W2N1cl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3BvbnNvcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5ydW5uZXIsXG4gICAgICAgICAgICAgIHNwb25zb3JfaWQ6IHNwb25zb3IuaWQsXG4gICAgICAgICAgICAgIHNwb25zb3I6IHtcbiAgICAgICAgICAgICAgICAuLi5zcG9uc29yLFxuICAgICAgICAgICAgICAgIHNwb25zb3JfYW1vdW50OiByb3cuc3BvbnNvcl9zcG9uc29yX2Ftb3VudFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVzdWx0cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3BlcnNvbmFsUmVzdWx0cy5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJ1bm5lclR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyVHlwZSc7XG5pbXBvcnQge1xuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcblxuY29uc3QgcnVubmVyID0ge1xuICB0eXBlOiBSdW5uZXJUeXBlLFxuICBhcmdzOiB7IGlkOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSB9LFxuICByZXNvbHZlKHJvb3QsIHsgaWQgfSkge1xuICAgIHJldHVybiBSdW5uZXIuZmluZEJ5SWQoaWQpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcnVubmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvcnVubmVyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUnVubmVyTGFwc1R5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGFwc1R5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7XG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IHJ1bm5lckxhcHMgPSB7XG4gIHR5cGU6IFJ1bm5lckxhcHNUeXBlLFxuICBhcmdzOiB7IGlkOiB7IHR5cGU6IG5ldyBOb25OdWxsKFN0cmluZ1R5cGUpIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcnVubmVyX2lkOiBpZCxcbiAgICB9O1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcnVubmVyTGFwcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3J1bm5lckxhcHMuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSdW5uZXJMaXN0VHlwZSBmcm9tICcuLi90eXBlcy9SdW5uZXJMaXN0VHlwZSc7XG5pbXBvcnQgUnVubmVyIGZyb20gJy4uL21vZGVscy9SdW5uZXInO1xuaW1wb3J0IHsgR3JhcGhRTFN0cmluZyB9IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBydW5uZXJMaXN0ID0ge1xuICB0eXBlOiBSdW5uZXJMaXN0VHlwZSxcbiAgYXJnczoge1xuICAgIHF1ZXJ5OiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbiAgfSxcbiAgcmVzb2x2ZShyb290LCB7IHF1ZXJ5IH0pIHtcbiAgICBjb25zdCByZXN1bHRDYWxsID0gcmVzdWx0ID0+ICh7XG4gICAgICB0b3RhbDogcmVzdWx0LmNvdW50LFxuICAgICAgcnVubmVyczogcmVzdWx0LnJvd3MsXG4gICAgfSk7XG4gICAgaWYgKHF1ZXJ5ICYmIHF1ZXJ5ICE9PSAnJykge1xuICAgICAgcmV0dXJuIFJ1bm5lci5maW5kQW5kQ291bnRBbGwoe1xuICAgICAgICB3aGVyZToge1xuICAgICAgICAgIHNwb25zb3JfaWQ6IHtcbiAgICAgICAgICAgICRuZTogbnVsbCxcbiAgICAgICAgICB9LFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaXJzdE5hbWU6IHsgJGxpa2U6IGAlJHtxdWVyeX0lYCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFzdE5hbWU6IHsgJGxpa2U6IGAlJHtxdWVyeX0lYCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZW1haWw6IHsgJGxpa2U6IGAlJHtxdWVyeX0lYCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSkudGhlbihyZXN1bHRDYWxsKTtcbiAgICB9XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kQW5kQ291bnRBbGwoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgc3BvbnNvcl9pZDoge1xuICAgICAgICAgICRuZTogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkudGhlbihyZXN1bHRDYWxsKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bm5lckxpc3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9ydW5uZXJMaXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU3BvbnNvclR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3Qgc3BvbnNvciA9IHtcbiAgdHlwZTogU3BvbnNvclR5cGUsXG4gIGFyZ3M6IHsgaWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9IH0sXG4gIHJlc29sdmUocm9vdCwgeyBpZCB9KSB7XG4gICAgcmV0dXJuIFNwb25zb3IuZmluZEJ5SWQoaWQpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3Nwb25zb3IuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBTcG9uc29yTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvU3BvbnNvckxpc3RUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcblxuY29uc3Qgc3BvbnNvckxpc3QgPSB7XG4gIHR5cGU6IFNwb25zb3JMaXN0VHlwZSxcbiAgcmVzb2x2ZSgpIHtcbiAgICByZXR1cm4gU3BvbnNvci5maW5kQW5kQ291bnRBbGwoKS50aGVuKHJlc3VsdCA9PiAoe1xuICAgICAgdG90YWw6IHJlc3VsdC5jb3VudCxcbiAgICAgIHNwb25zb3JzOiByZXN1bHQucm93cyxcbiAgICB9KSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzcG9uc29yTGlzdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3Nwb25zb3JMaXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgVGVhbVR5cGUgZnJvbSAnLi4vdHlwZXMvVGVhbVR5cGUnO1xuaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBUZWFtIGZyb20gJy4vLi4vbW9kZWxzL1RlYW0nO1xuXG5jb25zdCB0ZWFtID0ge1xuICB0eXBlOiBUZWFtVHlwZSxcbiAgYXJnczogeyBpZDogeyB0eXBlOiBTdHJpbmdUeXBlIH0gfSxcbiAgcmVzb2x2ZShyb290LCB7IGlkIH0pIHtcbiAgICByZXR1cm4gVGVhbS5maW5kQnlJZChpZCk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvdGVhbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFRlYW1MaXN0VHlwZSBmcm9tICcuLi90eXBlcy9UZWFtTGlzdFR5cGUnO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuXG5jb25zdCB0ZWFtTGlzdCA9IHtcbiAgdHlwZTogVGVhbUxpc3RUeXBlLFxuICByZXNvbHZlKCkge1xuICAgIHJldHVybiBUZWFtLmZpbmRBbmRDb3VudEFsbCgpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvdGFsOiByZXN1bHQuY291bnQsXG4gICAgICAgIHRlYW1zOiByZXN1bHQucm93cyxcbiAgICAgIH07XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtTGlzdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3RlYW1MaXN0LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUnVubmVyTGlzdFR5cGUgZnJvbSAnLi4vdHlwZXMvUnVubmVyTGlzdFR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCB7IEdyYXBoUUxJRCwgR3JhcGhRTE5vbk51bGwgfSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgdGVhbVJ1bm5lckxpc3QgPSB7XG4gIHR5cGU6IFJ1bm5lckxpc3RUeXBlLFxuICBhcmdzOiB7XG4gICAgdGVhbV9pZDogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTElEKSB9LFxuICB9LFxuICByZXNvbHZlKHJvb3QsIHsgdGVhbV9pZCB9KSB7XG4gICAgcmV0dXJuIFJ1bm5lci5maW5kQW5kQ291bnRBbGwoe1xuICAgICAgd2hlcmU6IHsgdGVhbV9pZCB9LFxuICAgIH0pLnRoZW4ocmVzdWx0ID0+ICh7XG4gICAgICB0b3RhbDogcmVzdWx0LmNvdW50LFxuICAgICAgcnVubmVyczogcmVzdWx0LnJvd3MsXG4gICAgfSkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGVhbVJ1bm5lckxpc3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy90ZWFtUnVubmVyTGlzdC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFRlYW0gZnJvbSAnLi4vbW9kZWxzL1RlYW0nO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi4vbW9kZWxzL1Nwb25zb3InO1xuaW1wb3J0IHsgR3JhcGhRTElELCBHcmFwaFFMTm9uTnVsbCB9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gXCIuLi90eXBlcy9TcG9uc29yVHlwZVwiO1xuXG5jb25zdCB0ZWFtU3BvbnNvciA9IHtcbiAgdHlwZTogU3BvbnNvclR5cGUsXG4gIGFyZ3M6IHtcbiAgICB0ZWFtX2lkOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMSUQpIH0sXG4gIH0sXG4gIHJlc29sdmUocm9vdCwgeyB0ZWFtX2lkIH0pIHtcbiAgICByZXR1cm4gVGVhbS5maW5kQnlJZCh0ZWFtX2lkKS50aGVuKHJlc3VsdCA9PiBTcG9uc29yLmZpbmRCeUlkKHJlc3VsdC5zcG9uc29yX2lkKSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCB0ZWFtU3BvbnNvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL3RlYW1TcG9uc29yLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hIGFzIFNjaGVtYSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgcnVubmVyTGlzdCBmcm9tICcuL3F1ZXJpZXMvcnVubmVyTGlzdCc7XG5pbXBvcnQgcnVubmVyIGZyb20gJy4vcXVlcmllcy9ydW5uZXInO1xuaW1wb3J0IG5ld3MgZnJvbSAnLi9xdWVyaWVzL25ld3MnO1xuaW1wb3J0IG1lIGZyb20gJy4vcXVlcmllcy9tZSc7XG5pbXBvcnQgY3JlYXRlUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVJ1bm5lcic7XG5pbXBvcnQgc3BvbnNvciBmcm9tICcuL3F1ZXJpZXMvc3BvbnNvcic7XG5pbXBvcnQgc3BvbnNvckxpc3QgZnJvbSAnLi9xdWVyaWVzL3Nwb25zb3JMaXN0JztcbmltcG9ydCBjcmVhdGVTcG9uc29yIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVNwb25zb3InO1xuaW1wb3J0IGRlbGV0ZVJ1bm5lciBmcm9tICcuL211dGF0aW9ucy9kZWxldGVSdW5uZXInO1xuaW1wb3J0IGRlbGV0ZVNwb25zb3IgZnJvbSAnLi9tdXRhdGlvbnMvZGVsZXRlU3BvbnNvcic7XG5pbXBvcnQgdXBkYXRlUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL3VwZGF0ZVJ1bm5lcic7XG5pbXBvcnQgdXBkYXRlU3BvbnNvciBmcm9tICcuL211dGF0aW9ucy91cGRhdGVTcG9uc29yJztcbmltcG9ydCBydW5uZXJMYXBzIGZyb20gJy4vcXVlcmllcy9ydW5uZXJMYXBzJztcbmltcG9ydCBhZGRMYXAgZnJvbSAnLi9tdXRhdGlvbnMvYWRkTGFwJztcbmltcG9ydCBjaGVja051bWJlciBmcm9tICcuL3F1ZXJpZXMvY2hlY2tOdW1iZXInO1xuaW1wb3J0IGNyZWF0ZVRlYW0gZnJvbSAnLi9tdXRhdGlvbnMvY3JlYXRlVGVhbSc7XG5pbXBvcnQgdXBkYXRlVGVhbSBmcm9tICcuL211dGF0aW9ucy91cGRhdGVUZWFtJztcbmltcG9ydCBkZWxldGVUZWFtIGZyb20gJy4vbXV0YXRpb25zL2RlbGV0ZVRlYW0nO1xuaW1wb3J0IGNyZWF0ZVBlcnNvbmFsUnVubmVyIGZyb20gJy4vbXV0YXRpb25zL2NyZWF0ZVBlcnNvbmFsUnVubmVyJztcbmltcG9ydCB1cGRhdGVQZXJzb25hbFJ1bm5lciBmcm9tICcuL211dGF0aW9ucy91cGRhdGVQZXJzb25hbFJ1bm5lcic7XG5pbXBvcnQgdGVhbSBmcm9tIFwiLi9xdWVyaWVzL3RlYW1cIjtcbmltcG9ydCB0ZWFtTGlzdCBmcm9tIFwiLi9xdWVyaWVzL3RlYW1MaXN0XCI7XG5pbXBvcnQgdGVhbVJ1bm5lckxpc3QgZnJvbSBcIi4vcXVlcmllcy90ZWFtUnVubmVyTGlzdFwiO1xuaW1wb3J0IGFkZFJ1bm5lcnNUb1RlYW0gZnJvbSBcIi4vbXV0YXRpb25zL2FkZFJ1bm5lcnNUb1RlYW1cIjtcbmltcG9ydCByZW1vdmVSdW5uZXJGcm9tVGVhbSBmcm9tIFwiLi9tdXRhdGlvbnMvcmVtb3ZlUnVubmVyRnJvbVRlYW1cIjtcbmltcG9ydCB0ZWFtU3BvbnNvciBmcm9tIFwiLi9xdWVyaWVzL3RlYW1TcG9uc29yXCI7XG5pbXBvcnQgc2V0VGVhbVNwb25zb3IgZnJvbSBcIi4vbXV0YXRpb25zL3NldFRlYW1TcG9uc29yXCI7XG5pbXBvcnQgcGVyc29uYWxSZXN1bHRzIGZyb20gXCIuL3F1ZXJpZXMvcGVyc29uYWxSZXN1bHRzXCI7XG5cbmNvbnN0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICBxdWVyeTogbmV3IE9iamVjdFR5cGUoe1xuICAgIG5hbWU6ICdRdWVyeScsXG4gICAgZmllbGRzOiB7XG4gICAgICBuZXdzLFxuICAgICAgbWUsXG4gICAgICBydW5uZXJMaXN0LFxuICAgICAgcnVubmVyLFxuICAgICAgc3BvbnNvcixcbiAgICAgIHNwb25zb3JMaXN0LFxuICAgICAgdGVhbSxcbiAgICAgIHRlYW1MaXN0LFxuICAgICAgcnVubmVyTGFwcyxcbiAgICAgIGNoZWNrTnVtYmVyLFxuICAgICAgdGVhbVJ1bm5lckxpc3QsXG4gICAgICB0ZWFtU3BvbnNvcixcbiAgICAgIHBlcnNvbmFsUmVzdWx0cyxcbiAgICB9LFxuICB9KSxcbiAgbXV0YXRpb246IG5ldyBPYmplY3RUeXBlKHtcbiAgICBuYW1lOiAnTXV0YXRpb24nLFxuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlUnVubmVyLFxuICAgICAgdXBkYXRlUnVubmVyLFxuICAgICAgZGVsZXRlUnVubmVyLFxuICAgICAgY3JlYXRlU3BvbnNvcixcbiAgICAgIGRlbGV0ZVNwb25zb3IsXG4gICAgICB1cGRhdGVTcG9uc29yLFxuICAgICAgY3JlYXRlVGVhbSxcbiAgICAgIHVwZGF0ZVRlYW0sXG4gICAgICBkZWxldGVUZWFtLFxuICAgICAgYWRkTGFwLFxuICAgICAgY3JlYXRlUGVyc29uYWxSdW5uZXIsXG4gICAgICB1cGRhdGVQZXJzb25hbFJ1bm5lcixcbiAgICAgIGFkZFJ1bm5lcnNUb1RlYW0sXG4gICAgICByZW1vdmVSdW5uZXJGcm9tVGVhbSxcbiAgICAgIHNldFRlYW1TcG9uc29yLFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNjaGVtYTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9zY2hlbWEuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBTZXF1ZWxpemUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcblxuY29uc3Qgc2VxdWVsaXplID0gbmV3IFNlcXVlbGl6ZShjb25maWcuZGF0YWJhc2VVcmwsIHtcbiAgZGVmaW5lOiB7XG4gICAgZnJlZXplVGFibGVOYW1lOiB0cnVlLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNlcXVlbGl6ZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9zZXF1ZWxpemUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7IEdyYXBoUUxCb29sZWFuLCBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlIH0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IENoZWNrTnVtYmVyVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ0NoZWNrTnVtYmVyVHlwZScsXG4gIGZpZWxkczoge1xuICAgIGF2YWlsYWJsZTogeyB0eXBlOiBHcmFwaFFMQm9vbGVhbiB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENoZWNrTnVtYmVyVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9DaGVja051bWJlclR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxGbG9hdCBhcyBGbG9hdFR5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBDcmVhdGVSdW5uZXJJbnB1dFR5cGUsIHtSdW5uZXJJbnB1dEZpZWxkc30gZnJvbSBcIi4vQ3JlYXRlUnVubmVySW5wdXRUeXBlXCI7XG5pbXBvcnQge0NyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHN9IGZyb20gXCIuL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGVcIjtcblxuY29uc3QgUnVubmVyV2l0aFNwb25zb3JJbnB1dCA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1J1bm5lcldpdGhTcG9uc29ySW5wdXQnLFxuICBmaWVsZHM6IHtcbiAgICAuLi5SdW5uZXJJbnB1dEZpZWxkcyxcbiAgICAuLi5DcmVhdGVTcG9uc29ySW5wdXRUeXBlRmllbGRzLFxuICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bm5lcldpdGhTcG9uc29ySW5wdXQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvQ3JlYXRlUGVyc29uYWxSdW5uZXJJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxGbG9hdCBhcyBGbG9hdFR5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50ZWdlclR5cGUsXG4gIEdyYXBoUUxOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuZXhwb3J0IGNvbnN0IFJ1bm5lcklucHV0RmllbGRzID0ge1xuXHRnZW5kZXI6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFN0cmluZ1R5cGUpIH0sXG5cdGZpcnN0TmFtZTogeyB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcblx0bGFzdE5hbWU6IHsgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFN0cmluZ1R5cGUpIH0sXG4gIGJpcnRoZGF5OiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuXHRlbWFpbDogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG5cdG51bWJlcjogeyB0eXBlOiBJbnRlZ2VyVHlwZSB9LFxuXHRzcG9uc29yX2lkOiB7IHR5cGU6IElEIH0sXG4gIHRlYW1faWQ6IHsgdHlwZTogSUQgfSxcbn1cblxuY29uc3QgQ3JlYXRlUnVubmVySW5wdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnUnVubmVySW5wdXQnLFxuICBmaWVsZHM6IFJ1bm5lcklucHV0RmllbGRzLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyZWF0ZVJ1bm5lcklucHV0VHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9DcmVhdGVSdW5uZXJJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMQm9vbGVhbiBhcyBCb29sZWFuVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuZXhwb3J0IGNvbnN0IENyZWF0ZVNwb25zb3JJbnB1dFR5cGVGaWVsZHMgPSB7XG5cdGVtYWlsOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcblx0bmFtZTogeyB0eXBlOiAoU3RyaW5nVHlwZSkgfSxcblx0Y29udGFjdF9maXJzdE5hbWU6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuXHRjb250YWN0X2xhc3ROYW1lOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcblx0c3BvbnNvcl9hbW91bnQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuXHRwcml2YXRlOiB7IHR5cGU6IEJvb2xlYW5UeXBlIH0sXG5cdGNhc2g6IHsgdHlwZTogQm9vbGVhblR5cGUgfSxcblx0ZG9uYXRpb25fcmVjZWlwdDogeyB0eXBlOiBCb29sZWFuVHlwZSB9LFxufTtcblxuY29uc3QgQ3JlYXRlU3BvbnNvcklucHV0VHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1Nwb25zb3JJbnB1dCcsXG4gIGZpZWxkczogQ3JlYXRlU3BvbnNvcklucHV0VHlwZUZpZWxkcyxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDcmVhdGVTcG9uc29ySW5wdXRUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL0NyZWF0ZVNwb25zb3JJbnB1dFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxJbnB1dE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMRmxvYXQgYXMgRmxvYXRUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IENyZWF0ZVRlYW1JbnB1dFR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdUZWFtSW5wdXQnLFxuICBmaWVsZHM6IHtcbiAgICBuYW1lOiB7IHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuICAgIHNwb25zb3JfaWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICAgIHNwb25zb3JfYW1vdW50OiB7IHR5cGU6IEZsb2F0VHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyZWF0ZVRlYW1JbnB1dFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvQ3JlYXRlVGVhbUlucHV0VHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgTmV3c0l0ZW1UeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnTmV3c0l0ZW0nLFxuICBmaWVsZHM6IHtcbiAgICB0aXRsZTogeyB0eXBlOiBuZXcgTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuICAgIGxpbms6IHsgdHlwZTogbmV3IE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcbiAgICBhdXRob3I6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICAgIHB1YkRhdGU6IHsgdHlwZTogbmV3IE5vbk51bGwoU3RyaW5nVHlwZSkgfSxcbiAgICBjb250ZW50OiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBOZXdzSXRlbVR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvTmV3c0l0ZW1UeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEZsb2F0IGFzIEZsb2F0VHlwZSxcbiAgR3JhcGhRTEludCBhcyBJbnRlZ2VyVHlwZSxcbiAgR3JhcGhRTE5vbk51bGwgYXMgTm9uTnVsbCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuL1J1bm5lclR5cGUnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuLi9tb2RlbHMvUnVubmVyJztcbmltcG9ydCBMYXAgZnJvbSAnLi4vbW9kZWxzL0xhcCc7XG5cbmNvbnN0IFJ1bm5lckxhcHNUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnUnVubmVyTGFwcycsXG4gIGZpZWxkczoge1xuICAgIGNvdW50OiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiBMYXAuY291bnQoeyB3aGVyZTogeyBydW5uZXJfaWQ6IHJlcy5ydW5uZXJfaWQgfSB9KSxcbiAgICB9LFxuICAgIHJ1bm5lcjoge1xuICAgICAgdHlwZTogUnVubmVyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiBSdW5uZXIuZmluZEJ5SWQocmVzLnJ1bm5lcl9pZCksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSdW5uZXJMYXBzVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9SdW5uZXJMYXBzVHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTEludCBhcyBJbnRUeXBlLFxuICBHcmFwaFFMTGlzdCBhcyBMaXN0VHlwZSxcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgUnVubmVyVHlwZSBmcm9tICcuL1J1bm5lclR5cGUnO1xuXG5jb25zdCBSdW5uZXJMaXN0VHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1J1bm5lckxpc3QnLFxuICBmaWVsZHM6IHtcbiAgICB0b3RhbDogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgcnVubmVyczoge1xuICAgICAgdHlwZTogbmV3IExpc3RUeXBlKFJ1bm5lclR5cGUpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUnVubmVyTGlzdFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvUnVubmVyTGlzdFR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlIGFzIE9iamVjdFR5cGUsXG4gIEdyYXBoUUxJRCBhcyBJRCxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMRmxvYXQgYXMgRmxvYXRUeXBlLFxuICBHcmFwaFFMSW50IGFzIEludGVnZXJUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTcG9uc29yVHlwZSBmcm9tICcuL1Nwb25zb3JUeXBlJztcbmltcG9ydCBTcG9uc29yIGZyb20gJy4uL21vZGVscy9TcG9uc29yJztcbmltcG9ydCBMYXAgZnJvbSAnLi4vbW9kZWxzL0xhcCc7XG5cbmNvbnN0IFJ1bm5lclR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdSdW5uZXInLFxuICBmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSUQpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pZCxcbiAgICB9LFxuICAgIGZpcnN0TmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZmlyc3ROYW1lLFxuICAgIH0sXG4gICAgbGFzdE5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmxhc3ROYW1lLFxuICAgIH0sXG4gICAgYmlydGhkYXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmJpcnRoZGF5LFxuICAgIH0sXG4gICAgZ2VuZGVyOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5nZW5kZXIsXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZW1haWwsXG4gICAgfSxcbiAgICBzcG9uc29yX2Ftb3VudDoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuc3BvbnNvcl9hbW91bnQsXG4gICAgfSxcbiAgICBsYXBzOiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMubGFwcyl7XG4gICAgICAgICAgcmV0dXJuIHJlcy5sYXBzXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIExhcC5jb3VudCh7IHdoZXJlOiB7IHJ1bm5lcl9pZDogcmVzLmlkIH0gfSkudGhlbigoIGNvdW50ICk9PmNvdW50KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzcG9uc29yOiB7XG4gICAgICB0eXBlOiBTcG9uc29yVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMuc3BvbnNvcikge1xuICAgICAgICAgIHJldHVybiByZXMuc3BvbnNvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3BvbnNvci5maW5kQnlJZChyZXMuc3BvbnNvcl9pZCk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgbnVtYmVyOiB7XG4gICAgICB0eXBlOiBJbnRlZ2VyVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMubnVtYmVyLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUnVubmVyVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9SdW5uZXJUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMSW50IGFzIEludFR5cGUsXG4gIEdyYXBoUUxMaXN0IGFzIExpc3RUeXBlLFxuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxufSBmcm9tICdncmFwaHFsJztcbmltcG9ydCBTcG9uc29yVHlwZSBmcm9tICcuL1Nwb25zb3JUeXBlJztcblxuY29uc3QgU3BvbnNvckxpc3RUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnU3BvbnNvckxpc3QnLFxuICBmaWVsZHM6IHtcbiAgICB0b3RhbDogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgc3BvbnNvcnM6IHtcbiAgICAgIHR5cGU6IG5ldyBMaXN0VHlwZShTcG9uc29yVHlwZSksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcG9uc29yTGlzdFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvU3BvbnNvckxpc3RUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMSUQgYXMgSUQsXG4gIEdyYXBoUUxTdHJpbmcgYXMgU3RyaW5nVHlwZSxcbiAgR3JhcGhRTEZsb2F0IGFzIEZsb2F0VHlwZSxcbiAgR3JhcGhRTEJvb2xlYW4gYXMgQm9vbGVhblR5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBTcG9uc29yVHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1Nwb25zb3InLFxuICBmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogbmV3IE5vbk51bGwoSUQpLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5pZCxcbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLm5hbWUsXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuZW1haWwsXG4gICAgfSxcbiAgICBjb250YWN0X2ZpcnN0TmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMuY29udGFjdF9maXJzdE5hbWUsXG4gICAgfSxcbiAgICBjb250YWN0X2xhc3ROYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmdUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5jb250YWN0X2xhc3ROYW1lLFxuICAgIH0sXG4gICAgc3BvbnNvcl9hbW91bnQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1R5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLnNwb25zb3JfYW1vdW50LFxuICAgIH0sXG4gICAgcGVyc29uYWw6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW5UeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5wZXJzb25hbCxcbiAgICB9LFxuXG4gICAgY2FzaDoge1xuICAgICAgdHlwZTogQm9vbGVhblR5cGUsXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmNhc2gsXG4gICAgfSxcblxuICAgIGRvbmF0aW9uX3JlY2VpcHQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW5UeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IHJlcy5kb25hdGlvbl9yZWNlaXB0LFxuICAgIH0sXG5cblx0XHRmaWZ0eUZpZnR5OiB7XG5cdFx0XHR0eXBlOiBCb29sZWFuVHlwZSxcblx0XHRcdHJlc29sdmU6IHJlcyA9PiByZXMuZmlmdHlGaWZ0eSxcblx0XHR9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwb25zb3JUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1Nwb25zb3JUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IFN1Y2Nlc3NUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnU3VjY2VzcycsXG4gIGZpZWxkczoge1xuICAgIHN1Y2Nlc3M6IHsgdHlwZTogR3JhcGhRTEJvb2xlYW4gfSxcbiAgICBtZXNzYWdlOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTdWNjZXNzVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9TdWNjZXNzVHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTEludCBhcyBJbnRUeXBlLFxuICBHcmFwaFFMTGlzdCBhcyBMaXN0VHlwZSxcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgVGVhbVR5cGUgZnJvbSAnLi9UZWFtVHlwZSc7XG5cbmNvbnN0IFRlYW1MaXN0VHlwZSA9IG5ldyBPYmplY3RUeXBlKHtcbiAgbmFtZTogJ1RlYW1MaXN0JyxcbiAgZmllbGRzOiB7XG4gICAgdG90YWw6IHsgdHlwZTogSW50VHlwZSB9LFxuICAgIHRlYW1zOiB7XG4gICAgICB0eXBlOiBuZXcgTGlzdFR5cGUoVGVhbVR5cGUpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbUxpc3RUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1RlYW1MaXN0VHlwZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTElEIGFzIElELFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IFNwb25zb3JUeXBlIGZyb20gJy4vU3BvbnNvclR5cGUnO1xuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi8uLi9tb2RlbHMvU3BvbnNvcic7XG5cbmNvbnN0IFRlYW1UeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnVGVhbScsXG4gIGZpZWxkczoge1xuICAgIGlkOiB7XG4gICAgICB0eXBlOiBuZXcgTm9uTnVsbChJRCksXG4gICAgICByZXNvbHZlOiByZXMgPT4gcmVzLmlkLFxuICAgIH0sXG4gICAgbmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nVHlwZSxcbiAgICAgIHJlc29sdmU6IHJlcyA9PiByZXMubmFtZSxcbiAgICB9LFxuICAgIHNwb25zb3I6IHtcbiAgICAgIHR5cGU6IFNwb25zb3JUeXBlLFxuICAgICAgcmVzb2x2ZTogcmVzID0+IFNwb25zb3IuZmluZEJ5SWQocmVzLnNwb25zb3JfaWQpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGVhbVR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvVGVhbVR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlIGFzIE9iamVjdFR5cGUsXG4gIEdyYXBoUUxJRCBhcyBJRCxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgVXNlclR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdVc2VyJyxcbiAgZmllbGRzOiB7XG4gICAgaWQ6IHsgdHlwZTogbmV3IE5vbk51bGwoSUQpIH0sXG4gICAgZW1haWw6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1VzZXJUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKipcbiAqIFBhc3Nwb3J0LmpzIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAqIFRoZSBkYXRhYmFzZSBzY2hlbWEgdXNlZCBpbiB0aGlzIHNhbXBsZSBpcyBhdmFpbGFibGUgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tZW1iZXJzaGlwL21lbWJlcnNoaXAuZGIvdHJlZS9tYXN0ZXIvcG9zdGdyZXNcbiAqL1xuXG5pbXBvcnQgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xuaW1wb3J0IHsgU3RyYXRlZ3kgYXMgRmFjZWJvb2tTdHJhdGVneSB9IGZyb20gJ3Bhc3Nwb3J0LWZhY2Vib29rJztcbmltcG9ydCB7IFVzZXIsIFVzZXJMb2dpbiwgVXNlckNsYWltLCBVc2VyUHJvZmlsZSB9IGZyb20gJy4vZGF0YS9tb2RlbHMnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKlxuICogU2lnbiBpbiB3aXRoIEZhY2Vib29rLlxuICovXG5wYXNzcG9ydC51c2UoXG4gIG5ldyBGYWNlYm9va1N0cmF0ZWd5KFxuICAgIHtcbiAgICAgIGNsaWVudElEOiBjb25maWcuYXV0aC5mYWNlYm9vay5pZCxcbiAgICAgIGNsaWVudFNlY3JldDogY29uZmlnLmF1dGguZmFjZWJvb2suc2VjcmV0LFxuICAgICAgY2FsbGJhY2tVUkw6ICcvbG9naW4vZmFjZWJvb2svcmV0dXJuJyxcbiAgICAgIHByb2ZpbGVGaWVsZHM6IFtcbiAgICAgICAgJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnZW1haWwnLFxuICAgICAgICAnbGluaycsXG4gICAgICAgICdsb2NhbGUnLFxuICAgICAgICAndGltZXpvbmUnLFxuICAgICAgXSxcbiAgICAgIHBhc3NSZXFUb0NhbGxiYWNrOiB0cnVlLFxuICAgIH0sXG4gICAgKHJlcSwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgcHJvZmlsZSwgZG9uZSkgPT4ge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbiAgICAgIGNvbnN0IGxvZ2luTmFtZSA9ICdmYWNlYm9vayc7XG4gICAgICBjb25zdCBjbGFpbVR5cGUgPSAndXJuOmZhY2Vib29rOmFjY2Vzc190b2tlbic7XG4gICAgICBjb25zdCBmb29CYXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmIChyZXEudXNlcikge1xuICAgICAgICAgIGNvbnN0IHVzZXJMb2dpbiA9IGF3YWl0IFVzZXJMb2dpbi5maW5kT25lKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnbmFtZScsICdrZXknXSxcbiAgICAgICAgICAgIHdoZXJlOiB7IG5hbWU6IGxvZ2luTmFtZSwga2V5OiBwcm9maWxlLmlkIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXJMb2dpbikge1xuICAgICAgICAgICAgLy8gVGhlcmUgaXMgYWxyZWFkeSBhIEZhY2Vib29rIGFjY291bnQgdGhhdCBiZWxvbmdzIHRvIHlvdS5cbiAgICAgICAgICAgIC8vIFNpZ24gaW4gd2l0aCB0aGF0IGFjY291bnQgb3IgZGVsZXRlIGl0LCB0aGVuIGxpbmsgaXQgd2l0aCB5b3VyIGN1cnJlbnQgYWNjb3VudC5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuY3JlYXRlKFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IHJlcS51c2VyLmlkLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBwcm9maWxlLl9qc29uLmVtYWlsLFxuICAgICAgICAgICAgICAgIGxvZ2luczogW3sgbmFtZTogbG9naW5OYW1lLCBrZXk6IHByb2ZpbGUuaWQgfV0sXG4gICAgICAgICAgICAgICAgY2xhaW1zOiBbeyB0eXBlOiBjbGFpbVR5cGUsIHZhbHVlOiBwcm9maWxlLmlkIH1dLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBwcm9maWxlLmRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICAgICAgZ2VuZGVyOiBwcm9maWxlLl9qc29uLmdlbmRlcixcbiAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2ZpbGUuaWR9L3BpY3R1cmU/dHlwZT1sYXJnZWAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJMb2dpbiwgYXM6ICdsb2dpbnMnIH0sXG4gICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyQ2xhaW0sIGFzOiAnY2xhaW1zJyB9LFxuICAgICAgICAgICAgICAgICAgeyBtb2RlbDogVXNlclByb2ZpbGUsIGFzOiAncHJvZmlsZScgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvbmUobnVsbCwge1xuICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBVc2VyLmZpbmRBbGwoe1xuICAgICAgICAgICAgYXR0cmlidXRlczogWydpZCcsICdlbWFpbCddLFxuICAgICAgICAgICAgd2hlcmU6IHsgJyRsb2dpbnMubmFtZSQnOiBsb2dpbk5hbWUsICckbG9naW5zLmtleSQnOiBwcm9maWxlLmlkIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ25hbWUnLCAna2V5J10sXG4gICAgICAgICAgICAgICAgbW9kZWw6IFVzZXJMb2dpbixcbiAgICAgICAgICAgICAgICBhczogJ2xvZ2lucycsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2Vyc1swXS5nZXQoeyBwbGFpbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGRvbmUobnVsbCwgdXNlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHtcbiAgICAgICAgICAgICAgd2hlcmU6IHsgZW1haWw6IHByb2ZpbGUuX2pzb24uZW1haWwgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgLy8gVGhlcmUgaXMgYWxyZWFkeSBhbiBhY2NvdW50IHVzaW5nIHRoaXMgZW1haWwgYWRkcmVzcy4gU2lnbiBpbiB0b1xuICAgICAgICAgICAgICAvLyB0aGF0IGFjY291bnQgYW5kIGxpbmsgaXQgd2l0aCBGYWNlYm9vayBtYW51YWxseSBmcm9tIEFjY291bnQgU2V0dGluZ3MuXG4gICAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyID0gYXdhaXQgVXNlci5jcmVhdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZW1haWw6IHByb2ZpbGUuX2pzb24uZW1haWwsXG4gICAgICAgICAgICAgICAgICBlbWFpbENvbmZpcm1lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGxvZ2luczogW3sgbmFtZTogbG9naW5OYW1lLCBrZXk6IHByb2ZpbGUuaWQgfV0sXG4gICAgICAgICAgICAgICAgICBjbGFpbXM6IFt7IHR5cGU6IGNsYWltVHlwZSwgdmFsdWU6IGFjY2Vzc1Rva2VuIH1dLFxuICAgICAgICAgICAgICAgICAgcHJvZmlsZToge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcHJvZmlsZS5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZGVyOiBwcm9maWxlLl9qc29uLmdlbmRlcixcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogYGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cHJvZmlsZS5pZH0vcGljdHVyZT90eXBlPWxhcmdlYCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJMb2dpbiwgYXM6ICdsb2dpbnMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJDbGFpbSwgYXM6ICdjbGFpbXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJQcm9maWxlLCBhczogJ3Byb2ZpbGUnIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGRvbmUobnVsbCwge1xuICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvb0JhcigpLmNhdGNoKGRvbmUpO1xuICAgIH0sXG4gICksXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBwYXNzcG9ydDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcGFzc3BvcnQuanMiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgdXNlciBmcm9tICcuL3VzZXInO1xuaW1wb3J0IHJ1bnRpbWUgZnJvbSAnLi9ydW50aW1lJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUm9vdFJlZHVjZXIoeyBhcG9sbG9DbGllbnQgfSkge1xuICByZXR1cm4gY29tYmluZVJlZHVjZXJzKHtcbiAgICBhcG9sbG86IGFwb2xsb0NsaWVudC5yZWR1Y2VyKCksXG4gICAgdXNlcixcbiAgICBydW50aW1lLFxuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcmVkdWNlcnMvaW5kZXguanMiLCJpbXBvcnQgeyBTRVRfUlVOVElNRV9WQVJJQUJMRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bnRpbWUoc3RhdGUgPSB7fSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFNFVF9SVU5USU1FX1ZBUklBQkxFOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5uYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUsXG4gICAgICB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcmVkdWNlcnMvcnVudGltZS5qcyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZXIoc3RhdGUgPSB7fSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JlZHVjZXJzL3VzZXIuanMiLCJpbXBvcnQgKiBhcyBRUkNvZGUgZnJvbSAncXJjb2RlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBhc3luYyBmcm9tICdhc3luYyc7XG5pbXBvcnQgKiBhcyBwZGYgZnJvbSAnaHRtbC1wZGYnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgYmFzZTY0aW1nIGZyb20gJ2Jhc2U2NC1pbWcnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZW5lcmF0ZVFSQ29kZXMocmVxLCByZXMpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHsgZm9ybWF0OiAnTGV0dGVyJyB9O1xuICBjb25zdCBodG1sID0gZnMucmVhZEZpbGVTeW5jKFxuICAgIHBhdGgucmVzb2x2ZSgnLi9zcmMvcmVxdWVzdHMvcXItY29kZS1zaGVldC10ZW1wbGF0ZS5odG1sJyksXG4gICAgJ3V0ZjgnLFxuICApO1xuICBjb25zdCBmaWxlcGF0aCA9IHBhdGgucmVzb2x2ZShgLi90bXAvJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1fcXJjb2Rlcy5wZGZgKTtcblxuICBjb25zdCBjb2RlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMTAwOyBpIDwgMTAwMDsgaSsrKSB7XG4gICAgY29kZXMucHVzaCh7XG4gICAgICB0ZXh0OiBgJHtpfWAsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYy5lYWNoU2VyaWVzKFxuICAgIGNvZGVzLFxuICAgIChjb2RlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgUVJDb2RlLmRyYXdTdmcoXG4gICAgICAgIGNvZGUudGV4dCxcbiAgICAgICAge1xuICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiAnSCcsXG4gICAgICAgIH0sXG4gICAgICAgIChlcnIsIHN2Z0NvZGUpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGNvZGVwYXRoID0gcGF0aC5yZXNvbHZlKGAuL3RtcC9xcmNvZGVfJHtjb2RlLnRleHR9LnN2Z2ApO1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhjb2RlcGF0aCkpIHtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZShjb2RlcGF0aCwgc3ZnQ29kZSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICBjb2RlLmltYWdlID0gY29kZXBhdGg7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlLmltYWdlID0gY29kZXBhdGg7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgICBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5zZW5kKGVycik7XG5cbiAgICAgIC8vIGNvbnN0IGxvZ29CYXNlNjQgPSBiYXNlNjRpbWcuYmFzZTY0U3luYyhcbiAgICAgIC8vICAgcGF0aC5yZXNvbHZlKGAuL3B1YmxpYy91bmljZWZfbG9nby5qcGdgKSxcbiAgICAgIC8vICk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhsb2dvQmFzZTY0KTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gXy50ZW1wbGF0ZShodG1sKTtcbiAgICAgIGNvbnN0IGFzc2V0UGF0aCA9IGBmaWxlOi8vJHtwYXRoLnJlc29sdmUoJy4vJyl9L2A7XG4gICAgICBwZGZcbiAgICAgICAgLmNyZWF0ZSh0ZW1wbGF0ZSh7IGNvZGVzIH0pLCB7XG4gICAgICAgICAgYmFzZTogYXNzZXRQYXRoLFxuICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxuICAgICAgICB9KVxuICAgICAgICAudG9GaWxlKGZpbGVwYXRoLCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyKTtcbiAgICAgICAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICApO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9yZXF1ZXN0cy9nZW5lcmF0ZS1xcmNvZGVzLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUm91dGVyIGZyb20gJ3VuaXZlcnNhbC1yb3V0ZXInO1xuaW1wb3J0IHJvdXRlcyBmcm9tICcuL3JvdXRlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSb3V0ZXIocm91dGVzLCB7XG4gIHJlc29sdmVSb3V0ZShjb250ZXh0LCBwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIGNvbnRleHQucm91dGUubG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbnRleHQucm91dGVcbiAgICAgICAgLmxvYWQoKVxuICAgICAgICAudGhlbihhY3Rpb24gPT4gYWN0aW9uLmRlZmF1bHQoY29udGV4dCwgcGFyYW1zKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29udGV4dC5yb3V0ZS5hY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjb250ZXh0LnJvdXRlLmFjdGlvbihjb250ZXh0LCBwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9yb3V0ZXIuanMiLCJcbiAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtMyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtNCEuL0Vycm9yUGFnZS5jc3NcIik7XG4gICAgdmFyIGluc2VydENzcyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcIik7XG5cbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q29udGVudCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudDsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q3NzID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50LnRvU3RyaW5nKCk7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2luc2VydENzcyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgcmV0dXJuIGluc2VydENzcyhjb250ZW50LCBvcHRpb25zKSB9O1xuICAgIFxuICAgIC8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbiAgICAvLyBodHRwczovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudFxuICAgIC8vIE9ubHkgYWN0aXZhdGVkIGluIGJyb3dzZXIgY29udGV4dFxuICAgIGlmIChtb2R1bGUuaG90ICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCkge1xuICAgICAgdmFyIHJlbW92ZUNzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMi1ydWxlcy0zIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMi1ydWxlcy00IS4vRXJyb3JQYWdlLmNzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtMyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTItcnVsZXMtNCEuL0Vycm9yUGFnZS5jc3NcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNzcyA9IGluc2VydENzcyhjb250ZW50LCB7IHJlcGxhY2U6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgcmVtb3ZlQ3NzKCk7IH0pO1xuICAgIH1cbiAgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHdpdGhTdHlsZXMgZnJvbSAnaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL3dpdGhTdHlsZXMnO1xuaW1wb3J0IHMgZnJvbSAnLi9FcnJvclBhZ2UuY3NzJztcblxuY2xhc3MgRXJyb3JQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlcnJvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHN0YWNrOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBlcnJvcjogbnVsbCxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKF9fREVWX18gJiYgdGhpcy5wcm9wcy5lcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDE+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5lcnJvci5uYW1lfVxuICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgPHByZT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmVycm9yLnN0YWNrfVxuICAgICAgICAgIDwvcHJlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5FcnJvcjwvaDE+XG4gICAgICAgIDxwPlNvcnJ5LCBhIGNyaXRpY2FsIGVycm9yIG9jY3VycmVkIG9uIHRoaXMgcGFnZS48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IEVycm9yUGFnZSBhcyBFcnJvclBhZ2VXaXRob3V0U3R5bGUgfTtcbmV4cG9ydCBkZWZhdWx0IHdpdGhTdHlsZXMocykoRXJyb3JQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBFcnJvclBhZ2UgZnJvbSAnLi9FcnJvclBhZ2UnO1xuXG5mdW5jdGlvbiBhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGl0bGU6ICdEZW1vIEVycm9yJyxcbiAgICBjb21wb25lbnQ6IDxFcnJvclBhZ2UgLz4sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFjdGlvbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcm91dGVzL2Vycm9yL2luZGV4LmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBnbG9iYWwtcmVxdWlyZSAqL1xuXG4vLyBUaGUgdG9wLWxldmVsIChwYXJlbnQpIHJvdXRlXG5jb25zdCByb3V0ZXMgPSB7XG4gIHBhdGg6ICcvJyxcblxuICAvLyBLZWVwIGluIG1pbmQsIHJvdXRlcyBhcmUgZXZhbHVhdGVkIGluIG9yZGVyXG4gIGNoaWxkcmVuOiBbXG4gICAge1xuICAgICAgcGF0aDogJy8nLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdob21lJyAqLyAnLi9ob21lJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL2NvbnRhY3QnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdjb250YWN0JyAqLyAnLi9jb250YWN0JyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL2xvZ2luJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnbG9naW4nICovICcuL2xvZ2luJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3JlZ2lzdGVyJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAncmVnaXN0ZXInICovICcuL3JlZ2lzdGVyJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL2Fib3V0JyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnYWJvdXQnICovICcuL2Fib3V0JyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3ByaXZhY3knLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdwcml2YWN5JyAqLyAnLi9wcml2YWN5JyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL2ltcG9ydCcsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ2ltcG9ydCcgKi8gJy4vaW1wb3J0JyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3J1bm5lcnMnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdydW5uZXJzJyAqLyAnLi9ydW5uZXJzJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3J1bm5lcnMvY3JlYXRlJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAncnVubmVycy1jcmVhdGUnICovICcuL3J1bm5lcnMvY3JlYXRlJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3J1bm5lcnMvOmlkJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAncnVubmVycy11cGRhdGUnICovICcuL3J1bm5lcnMvdXBkYXRlJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3Nwb25zb3JzJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnc3BvbnNvcnMnICovICcuL3Nwb25zb3JzJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXRoOiAnL3Nwb25zb3JzL2NyZWF0ZScsXG4gICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3Nwb25zb3JzLWNyZWF0ZScgKi8gJy4vc3BvbnNvcnMvY3JlYXRlJyksXG4gICAgfSxcbiAgICAvLyBXaWxkY2FyZCByb3V0ZXMsIGUuZy4geyBwYXRoOiAnKicsIC4uLiB9IChtdXN0IGdvIGxhc3QpXG4gICAge1xuICAgICAgcGF0aDogJyonLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdub3QtZm91bmQnICovICcuL25vdC1mb3VuZCcpLFxuICAgIH0sXG4gIF0sXG5cbiAgYXN5bmMgYWN0aW9uKHsgbmV4dCB9KSB7XG4gICAgLy8gRXhlY3V0ZSBlYWNoIGNoaWxkIHJvdXRlIHVudGlsIG9uZSBvZiB0aGVtIHJldHVybiB0aGUgcmVzdWx0XG4gICAgY29uc3Qgcm91dGUgPSBhd2FpdCBuZXh0KCk7XG5cbiAgICAvLyBQcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciB0aXRsZSwgZGVzY3JpcHRpb24gZXRjLlxuICAgIHJvdXRlLnRpdGxlID0gYCR7cm91dGUudGl0bGUgfHwgJ1VudGl0bGVkIFBhZ2UnfSAtIHd3dy5yZWFjdHN0YXJ0ZXJraXQuY29tYDtcbiAgICByb3V0ZS5kZXNjcmlwdGlvbiA9IHJvdXRlLmRlc2NyaXB0aW9uIHx8ICcnO1xuXG4gICAgcmV0dXJuIHJvdXRlO1xuICB9LFxufTtcblxuLy8gVGhlIGVycm9yIHBhZ2UgaXMgYXZhaWxhYmxlIGJ5IHBlcm1hbmVudCB1cmwgZm9yIGRldmVsb3BtZW50IG1vZGVcbmlmIChfX0RFVl9fKSB7XG4gIHJvdXRlcy5jaGlsZHJlbi51bnNoaWZ0KHtcbiAgICBwYXRoOiAnL2Vycm9yJyxcbiAgICBhY3Rpb246IHJlcXVpcmUoJy4vZXJyb3InKS5kZWZhdWx0LFxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcm91dGVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9yb3V0ZXMvaW5kZXguanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gJ2Nvb2tpZS1wYXJzZXInO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGV4cHJlc3NKd3QsIHsgVW5hdXRob3JpemVkRXJyb3IgYXMgSnd0NDAxRXJyb3IgfSBmcm9tICdleHByZXNzLWp3dCc7XG5pbXBvcnQgZXhwcmVzc0dyYXBoUUwgZnJvbSAnZXhwcmVzcy1ncmFwaHFsJztcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBub2RlRmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuaW1wb3J0IHsgZ2V0RGF0YUZyb21UcmVlIH0gZnJvbSAncmVhY3QtYXBvbGxvJztcbmltcG9ydCBQcmV0dHlFcnJvciBmcm9tICdwcmV0dHktZXJyb3InO1xuaW1wb3J0IGNyZWF0ZUFwb2xsb0NsaWVudCBmcm9tICcuL2NvcmUvY3JlYXRlQXBvbGxvQ2xpZW50JztcbmltcG9ydCBBcHAgZnJvbSAnLi9jb21wb25lbnRzL0FwcCc7XG5pbXBvcnQgSHRtbCBmcm9tICcuL2NvbXBvbmVudHMvSHRtbCc7XG5pbXBvcnQgeyBFcnJvclBhZ2VXaXRob3V0U3R5bGUgfSBmcm9tICcuL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UnO1xuaW1wb3J0IGVycm9yUGFnZVN0eWxlIGZyb20gJy4vcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3MnO1xuaW1wb3J0IGNyZWF0ZUZldGNoIGZyb20gJy4vY3JlYXRlRmV0Y2gnO1xuaW1wb3J0IHBhc3Nwb3J0IGZyb20gJy4vcGFzc3BvcnQnO1xuaW1wb3J0IHJvdXRlciBmcm9tICcuL3JvdXRlcic7XG5pbXBvcnQgbW9kZWxzIGZyb20gJy4vZGF0YS9tb2RlbHMnO1xuaW1wb3J0IHNjaGVtYSBmcm9tICcuL2RhdGEvc2NoZW1hJztcbmltcG9ydCBhc3NldHMgZnJvbSAnLi9hc3NldHMuanNvbic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tICcuL3N0b3JlL2NvbmZpZ3VyZVN0b3JlJztcbmltcG9ydCB7IHNldFJ1bnRpbWVWYXJpYWJsZSB9IGZyb20gJy4vYWN0aW9ucy9ydW50aW1lJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgcG9zdENTVkltcG9ydCB9IGZyb20gJy4vZGF0YS9pbXBvcnQvaW1wb3J0LXJlcXVlc3QnO1xuaW1wb3J0ICogYXMgZmlsZVVwbG9hZCBmcm9tICdleHByZXNzLWZpbGV1cGxvYWQnO1xuaW1wb3J0IGdlbmVyYXRlUVJDb2RlcyBmcm9tICcuL3JlcXVlc3RzL2dlbmVyYXRlLXFyY29kZXMnO1xuaW1wb3J0IExhcFNpbXVsYXRvciBmcm9tIFwiLi9zaW11bGF0b3JcIjtcblxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xuXG4vL1xuLy8gVGVsbCBhbnkgQ1NTIHRvb2xpbmcgKHN1Y2ggYXMgTWF0ZXJpYWwgVUkpIHRvIHVzZSBhbGwgdmVuZG9yIHByZWZpeGVzIGlmIHRoZVxuLy8gdXNlciBhZ2VudCBpcyBub3Qga25vd24uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZ2xvYmFsLm5hdmlnYXRvciA9IGdsb2JhbC5uYXZpZ2F0b3IgfHwge307XG5nbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudCA9IGdsb2JhbC5uYXZpZ2F0b3IudXNlckFnZW50IHx8ICdhbGwnO1xuXG4vL1xuLy8gUmVnaXN0ZXIgTm9kZS5qcyBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJykpKTtcbmFwcC51c2UoY29va2llUGFyc2VyKCkpO1xuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcblxuLy9cbi8vIEF1dGhlbnRpY2F0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLnVzZShcbiAgZXhwcmVzc0p3dCh7XG4gICAgc2VjcmV0OiBjb25maWcuYXV0aC5qd3Quc2VjcmV0LFxuICAgIGNyZWRlbnRpYWxzUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGdldFRva2VuOiByZXEgPT4gcmVxLmNvb2tpZXMuaWRfdG9rZW4sXG4gIH0pLFxuKTtcbi8vIEVycm9yIGhhbmRsZXIgZm9yIGV4cHJlc3Mtand0XG5hcHAudXNlKChlcnIsIHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgaWYgKGVyciBpbnN0YW5jZW9mIEp3dDQwMUVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignW2V4cHJlc3Mtand0LWVycm9yXScsIHJlcS5jb29raWVzLmlkX3Rva2VuKTtcbiAgICAvLyBgY2xlYXJDb29raWVgLCBvdGhlcndpc2UgdXNlciBjYW4ndCB1c2Ugd2ViLWFwcCB1bnRpbCBjb29raWUgZXhwaXJlc1xuICAgIHJlcy5jbGVhckNvb2tpZSgnaWRfdG9rZW4nKTtcbiAgfVxuICBuZXh0KGVycik7XG59KTtcblxuYXBwLnVzZShwYXNzcG9ydC5pbml0aWFsaXplKCkpO1xuXG5pZiAoX19ERVZfXykge1xuICBhcHAuZW5hYmxlKCd0cnVzdCBwcm94eScpO1xufVxuXG4vLyBjb25zdCBzaW11bGF0b3IgPSBuZXcgTGFwU2ltdWxhdG9yKCk7XG4vLyBzaW11bGF0b3Iuc3RhcnQoKTtcblxuYXBwLmdldCgnL2dlbmVyYXRlLXFyY29kZXMnLCBnZW5lcmF0ZVFSQ29kZXMpO1xuYXBwLmdldChcbiAgJy9sb2dpbi9mYWNlYm9vaycsXG4gIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnZmFjZWJvb2snLCB7XG4gICAgc2NvcGU6IFsnZW1haWwnLCAndXNlcl9sb2NhdGlvbiddLFxuICAgIHNlc3Npb246IGZhbHNlLFxuICB9KSxcbik7XG5hcHAuZ2V0KFxuICAnL2xvZ2luL2ZhY2Vib29rL3JldHVybicsXG4gIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnZmFjZWJvb2snLCB7XG4gICAgZmFpbHVyZVJlZGlyZWN0OiAnL2xvZ2luJyxcbiAgICBzZXNzaW9uOiBmYWxzZSxcbiAgfSksXG4gIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGV4cGlyZXNJbiA9IDYwICogNjAgKiAyNCAqIDE4MDsgLy8gMTgwIGRheXNcbiAgICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKHJlcS51c2VyLCBjb25maWcuYXV0aC5qd3Quc2VjcmV0LCB7IGV4cGlyZXNJbiB9KTtcbiAgICByZXMuY29va2llKCdpZF90b2tlbicsIHRva2VuLCB7IG1heEFnZTogMTAwMCAqIGV4cGlyZXNJbiwgaHR0cE9ubHk6IHRydWUgfSk7XG4gICAgcmVzLnJlZGlyZWN0KCcvJyk7XG4gIH0sXG4pO1xuYXBwLnVzZShmaWxlVXBsb2FkKCkpO1xuYXBwLnBvc3QoJy91cGxvYWQnLCBwb3N0Q1NWSW1wb3J0KTtcblxuLy9cbi8vIFJlZ2lzdGVyIEFQSSBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgZ3JhcGhxbE1pZGRsZXdhcmUgPSBleHByZXNzR3JhcGhRTChyZXEgPT4gKHtcbiAgc2NoZW1hLFxuICBncmFwaGlxbDogX19ERVZfXyxcbiAgcm9vdFZhbHVlOiB7IHJlcXVlc3Q6IHJlcSB9LFxuICBwcmV0dHk6IF9fREVWX18sXG59KSk7XG5cbmFwcC51c2UoJy9ncmFwaHFsJywgZ3JhcGhxbE1pZGRsZXdhcmUpO1xuXG4vL1xuLy8gUmVnaXN0ZXIgc2VydmVyLXNpZGUgcmVuZGVyaW5nIG1pZGRsZXdhcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5hcHAuZ2V0KCcqJywgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgY3NzID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3QgYXBvbGxvQ2xpZW50ID0gY3JlYXRlQXBvbGxvQ2xpZW50KHtcbiAgICAgIHNjaGVtYSxcbiAgICAgIHJvb3RWYWx1ZTogeyByZXF1ZXN0OiByZXEgfSxcbiAgICB9KTtcblxuICAgIC8vIFVuaXZlcnNhbCBIVFRQIGNsaWVudFxuICAgIGNvbnN0IGZldGNoID0gY3JlYXRlRmV0Y2gobm9kZUZldGNoLCB7XG4gICAgICBiYXNlVXJsOiBjb25maWcuYXBpLnNlcnZlclVybCxcbiAgICAgIGNvb2tpZTogcmVxLmhlYWRlcnMuY29va2llLFxuICAgICAgYXBvbGxvQ2xpZW50LFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgICAgdXNlcjogcmVxLnVzZXIgfHwgbnVsbCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUsIHtcbiAgICAgIGNvb2tpZTogcmVxLmhlYWRlcnMuY29va2llLFxuICAgICAgYXBvbGxvQ2xpZW50LFxuICAgICAgZmV0Y2gsXG4gICAgICAvLyBJIHNob3VsZCBub3QgdXNlIGBoaXN0b3J5YCBvbiBzZXJ2ZXIuLiBidXQgaG93IEkgZG8gcmVkaXJlY3Rpb24/IGZvbGxvdyB1bml2ZXJzYWwtcm91dGVyXG4gICAgICBoaXN0b3J5OiBudWxsLFxuICAgIH0pO1xuXG4gICAgc3RvcmUuZGlzcGF0Y2goXG4gICAgICBzZXRSdW50aW1lVmFyaWFibGUoe1xuICAgICAgICBuYW1lOiAnaW5pdGlhbE5vdycsXG4gICAgICAgIHZhbHVlOiBEYXRlLm5vdygpLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIEdsb2JhbCAoY29udGV4dCkgdmFyaWFibGVzIHRoYXQgY2FuIGJlIGVhc2lseSBhY2Nlc3NlZCBmcm9tIGFueSBSZWFjdCBjb21wb25lbnRcbiAgICAvLyBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL2NvbnRleHQuaHRtbFxuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAvLyBFbmFibGVzIGNyaXRpY2FsIHBhdGggQ1NTIHJlbmRlcmluZ1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaWFzb2Z0L2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyXG4gICAgICBpbnNlcnRDc3M6ICguLi5zdHlsZXMpID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgICAgIGNvbnNvbGUubG9nKHN0eWxlcyk7XG4gICAgICAgIHN0eWxlcy5mb3JFYWNoKHN0eWxlID0+IGNzcy5hZGQoc3R5bGUuX2dldENzcygpKSk7XG4gICAgICB9LFxuICAgICAgZmV0Y2gsXG4gICAgICAvLyBZb3UgY2FuIGFjY2VzcyByZWR1eCB0aHJvdWdoIHJlYWN0LXJlZHV4IGNvbm5lY3RcbiAgICAgIHN0b3JlLFxuICAgICAgc3RvcmVTdWJzY3JpcHRpb246IG51bGwsXG4gICAgICAvLyBBcG9sbG8gQ2xpZW50IGZvciB1c2Ugd2l0aCByZWFjdC1hcG9sbG9cbiAgICAgIGNsaWVudDogYXBvbGxvQ2xpZW50LFxuICAgIH07XG5cbiAgICBjb25zdCByb3V0ZSA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKHtcbiAgICAgIC4uLmNvbnRleHQsXG4gICAgICBwYXRoOiByZXEucGF0aCxcbiAgICAgIHF1ZXJ5OiByZXEucXVlcnksXG4gICAgfSk7XG5cbiAgICBpZiAocm91dGUucmVkaXJlY3QpIHtcbiAgICAgIHJlcy5yZWRpcmVjdChyb3V0ZS5zdGF0dXMgfHwgMzAyLCByb3V0ZS5yZWRpcmVjdCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHsgLi4ucm91dGUgfTtcblxuICAgIGNvbnN0IHJvb3RDb21wb25lbnQgPSAoXG4gICAgICA8QXBwIGNvbnRleHQ9e2NvbnRleHR9IHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIHtyb3V0ZS5jb21wb25lbnR9XG4gICAgICA8L0FwcD5cbiAgICApO1xuICAgIGF3YWl0IGdldERhdGFGcm9tVHJlZShyb290Q29tcG9uZW50KTtcbiAgICAvLyB0aGlzIGlzIGhlcmUgYmVjYXVzZSBvZiBBcG9sbG8gcmVkdXggQVBPTExPX1FVRVJZX1NUT1AgYWN0aW9uXG4gICAgYXdhaXQgUHJvbWlzZS5kZWxheSgwKTtcbiAgICBkYXRhLmNoaWxkcmVuID0gYXdhaXQgUmVhY3RET00ucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCk7XG4gICAgZGF0YS5zdHlsZXMgPSBbeyBpZDogJ2NzcycsIGNzc1RleHQ6IFsuLi5jc3NdLmpvaW4oJycpIH1dO1xuXG4gICAgZGF0YS5zY3JpcHRzID0gW2Fzc2V0cy52ZW5kb3IuanNdO1xuICAgIGlmIChyb3V0ZS5jaHVua3MpIHtcbiAgICAgIGRhdGEuc2NyaXB0cy5wdXNoKC4uLnJvdXRlLmNodW5rcy5tYXAoY2h1bmsgPT4gYXNzZXRzW2NodW5rXS5qcykpO1xuICAgIH1cbiAgICBkYXRhLnNjcmlwdHMucHVzaChhc3NldHMuY2xpZW50LmpzKTtcblxuICAgIC8vIEZ1cnRoZXJtb3JlIGludm9rZWQgYWN0aW9ucyB3aWxsIGJlIGlnbm9yZWQsIGNsaWVudCB3aWxsIG5vdCByZWNlaXZlIHRoZW0hXG4gICAgaWYgKF9fREVWX18pIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZygnU2VyaWFsaXppbmcgc3RvcmUuLi4nKTtcbiAgICB9XG4gICAgZGF0YS5hcHAgPSB7XG4gICAgICBhcGlVcmw6IGNvbmZpZy5hcGkuY2xpZW50VXJsLFxuICAgICAgc3RhdGU6IGNvbnRleHQuc3RvcmUuZ2V0U3RhdGUoKSxcbiAgICB9O1xuXG4gICAgY29uc3QgaHRtbCA9IFJlYWN0RE9NLnJlbmRlclRvU3RhdGljTWFya3VwKDxIdG1sIHsuLi5kYXRhfSAvPik7XG4gICAgcmVzLnN0YXR1cyhyb3V0ZS5zdGF0dXMgfHwgMjAwKTtcbiAgICByZXMuc2VuZChgPCFkb2N0eXBlIGh0bWw+JHtodG1sfWApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBuZXh0KGVycik7XG4gIH1cbn0pO1xuXG4vL1xuLy8gRXJyb3IgaGFuZGxpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBwZSA9IG5ldyBQcmV0dHlFcnJvcigpO1xucGUuc2tpcE5vZGVGaWxlcygpO1xucGUuc2tpcFBhY2thZ2UoJ2V4cHJlc3MnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5hcHAudXNlKChlcnIsIHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IocGUucmVuZGVyKGVycikpO1xuICBjb25zdCBodG1sID0gUmVhY3RET00ucmVuZGVyVG9TdGF0aWNNYXJrdXAoXG4gICAgPEh0bWxcbiAgICAgIHRpdGxlPVwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCJcbiAgICAgIGRlc2NyaXB0aW9uPXtlcnIubWVzc2FnZX1cbiAgICAgIHN0eWxlcz17W3sgaWQ6ICdjc3MnLCBjc3NUZXh0OiBlcnJvclBhZ2VTdHlsZS5fZ2V0Q3NzKCkgfV19IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGVcbiAgICA+XG4gICAgICB7UmVhY3RET00ucmVuZGVyVG9TdHJpbmcoPEVycm9yUGFnZVdpdGhvdXRTdHlsZSBlcnJvcj17ZXJyfSAvPil9XG4gICAgPC9IdG1sPixcbiAgKTtcbiAgcmVzLnN0YXR1cyhlcnIuc3RhdHVzIHx8IDUwMCk7XG4gIHJlcy5zZW5kKGA8IWRvY3R5cGUgaHRtbD4ke2h0bWx9YCk7XG59KTtcblxuLy9cbi8vIExhdW5jaCB0aGUgc2VydmVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgcHJvbWlzZSA9IG1vZGVscy5zeW5jKCkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG5pZiAoIW1vZHVsZS5ob3QpIHtcbiAgcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICBhcHAubGlzdGVuKGNvbmZpZy5wb3J0LCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oYFRoZSBzZXJ2ZXIgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OiR7Y29uZmlnLnBvcnR9L2ApO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLy9cbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5pZiAobW9kdWxlLmhvdCkge1xuICBhcHAuaG90ID0gbW9kdWxlLmhvdDtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vcm91dGVyJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2VydmVyLmpzIiwiaW1wb3J0IFJ1bm5lciBmcm9tICcuL2RhdGEvbW9kZWxzL1J1bm5lcic7XG5pbXBvcnQgTGFwIGZyb20gJy4vZGF0YS9tb2RlbHMvTGFwJztcblxuY2xhc3MgTGFwU2ltdWxhdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXJ0KCkge1xuICAgIFJ1bm5lci5maW5kQWxsKCkudGhlbihyZXMgPT4ge1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgbWF4ID0gcmVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IG1pbiA9IDA7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRSYW5kb21JbnQobWluLCBtYXgpO1xuICAgICAgICBjb25zdCBydW5uZXIgPSByZXNbaW5kZXhdO1xuICAgICAgICBjb25zb2xlLmxvZygnQWRkIExhcCcsIHJ1bm5lci5pZCwgaW5kZXgpO1xuICAgICAgICBMYXAuY3JlYXRlKHtcbiAgICAgICAgICBydW5uZXJfaWQ6IHJ1bm5lci5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJhbmRvbUludChtaW4sIG1heCkge1xuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgdGhpcy5pbnRlcnZhbC5jYW5jZWwoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFwU2ltdWxhdG9yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9zaW11bGF0b3IuanMiLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlLCBjb21wb3NlIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IHRodW5rIGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCBjcmVhdGVSb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycyc7XG5pbXBvcnQgY3JlYXRlSGVscGVycyBmcm9tICcuL2NyZWF0ZUhlbHBlcnMnO1xuaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSwgY29uZmlnKSB7XG4gIGNvbnN0IGhlbHBlcnMgPSBjcmVhdGVIZWxwZXJzKGNvbmZpZyk7XG4gIGNvbnN0IHsgYXBvbGxvQ2xpZW50IH0gPSBjb25maWc7XG5cbiAgY29uc3QgbWlkZGxld2FyZSA9IFtcbiAgICB0aHVuay53aXRoRXh0cmFBcmd1bWVudChoZWxwZXJzKSxcbiAgICBhcG9sbG9DbGllbnQubWlkZGxld2FyZSgpLFxuICBdO1xuXG4gIGxldCBlbmhhbmNlcjtcblxuICBpZiAoX19ERVZfXykge1xuICAgIG1pZGRsZXdhcmUucHVzaChjcmVhdGVMb2dnZXIoKSk7XG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vemFsbW94aXN1cy9yZWR1eC1kZXZ0b29scy1leHRlbnNpb24jcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uXG4gICAgbGV0IGRldlRvb2xzRXh0ZW5zaW9uID0gZiA9PiBmO1xuICAgIGlmIChwcm9jZXNzLmVudi5CUk9XU0VSICYmIHdpbmRvdy5kZXZUb29sc0V4dGVuc2lvbikge1xuICAgICAgZGV2VG9vbHNFeHRlbnNpb24gPSB3aW5kb3cuZGV2VG9vbHNFeHRlbnNpb24oKTtcbiAgICB9XG5cbiAgICBlbmhhbmNlciA9IGNvbXBvc2UoYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZXdhcmUpLCBkZXZUb29sc0V4dGVuc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgZW5oYW5jZXIgPSBhcHBseU1pZGRsZXdhcmUoLi4ubWlkZGxld2FyZSk7XG4gIH1cblxuICBjb25zdCByb290UmVkdWNlciA9IGNyZWF0ZVJvb3RSZWR1Y2VyKHtcbiAgICBhcG9sbG9DbGllbnQsXG4gIH0pO1xuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmFja3QvcmVkdXgvcmVsZWFzZXMvdGFnL3YzLjEuMFxuICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGUsIGVuaGFuY2VyKTtcblxuICAvLyBIb3QgcmVsb2FkIHJlZHVjZXJzIChyZXF1aXJlcyBXZWJwYWNrIG9yIEJyb3dzZXJpZnkgSE1SIHRvIGJlIGVuYWJsZWQpXG4gIGlmIChfX0RFVl9fICYmIG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgnLi4vcmVkdWNlcnMnLCAoKSA9PlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gICAgICBzdG9yZS5yZXBsYWNlUmVkdWNlcihyZXF1aXJlKCcuLi9yZWR1Y2VycycpLmRlZmF1bHQpLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gc3RvcmU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiY29uc3QgZ3JhcGhxbFJlcXVlc3REZXByZWNhdGVkTWVzc2FnZSA9IGBcXGBncmFwaHFsUmVxdWVzdFxcYCBoYXMgYmVlbiBkZXByZWNhdGVkLlxuWW91IHNob3VsZCB1c2UgQXBvbGxvOiBcXGBjbGllbnQucXVlcnkoeyBxdWVyeSwgdmFyaWFibGVzLi4ufSlcXGAgb3IgXFxgY2xpZW50Lm11dGF0ZSgpXFxgXG5Eb24ndCBmb3JnZXQgdG8gZW5jbG9zZSB5b3VyIHF1ZXJ5IHRvIGdxbFxcYOKAplxcYCB0YWcgb3IgaW1wb3J0ICouZ3JhcGhxbCBmaWxlLlxuU2VlIGRvY3MgYXQgaHR0cDovL2Rldi5hcG9sbG9kYXRhLmNvbS9jb3JlL2Fwb2xsby1jbGllbnQtYXBpLmh0bWwjQXBvbGxvQ2xpZW50XFxcXC5xdWVyeWA7XG5cbmZ1bmN0aW9uIGNyZWF0ZUdyYXBocWxSZXF1ZXN0KGFwb2xsb0NsaWVudCkge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gZ3JhcGhxbFJlcXVlc3QocXVlcnlPclN0cmluZywgdmFyaWFibGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoX19ERVZfXykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoZ3JhcGhxbFJlcXVlc3REZXByZWNhdGVkTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBza2lwQ2FjaGUgfSA9IG9wdGlvbnM7XG4gICAgbGV0IHF1ZXJ5ID0gcXVlcnlPclN0cmluZztcbiAgICBpZiAodHlwZW9mIHF1ZXJ5T3JTdHJpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBncWwgPSBhd2FpdCByZXF1aXJlLmVuc3VyZShcbiAgICAgICAgWydncmFwaHFsLXRhZyddLFxuICAgICAgICByZXF1aXJlID0+IHJlcXVpcmUoJ2dyYXBocWwtdGFnJyksXG4gICAgICAgICdncmFwaHFsLXRhZycsXG4gICAgICApO1xuICAgICAgcXVlcnkgPSBncWwoW3F1ZXJ5T3JTdHJpbmddKTtcbiAgICB9XG5cbiAgICBpZiAoc2tpcENhY2hlKSB7XG4gICAgICByZXR1cm4gYXBvbGxvQ2xpZW50Lm5ldHdvcmtJbnRlcmZhY2UucXVlcnkoeyBxdWVyeSwgdmFyaWFibGVzIH0pO1xuICAgIH1cblxuICAgIGxldCBpc011dGF0aW9uID0gZmFsc2U7XG4gICAgaWYgKHF1ZXJ5LmRlZmluaXRpb25zKSB7XG4gICAgICBpc011dGF0aW9uID0gcXVlcnkuZGVmaW5pdGlvbnMuc29tZShcbiAgICAgICAgZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uICYmIGRlZmluaXRpb24ub3BlcmF0aW9uID09PSAnbXV0YXRpb24nLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGlzTXV0YXRpb24pIHtcbiAgICAgIHJldHVybiBhcG9sbG9DbGllbnQubXV0YXRlKHsgbXV0YXRpb246IHF1ZXJ5LCB2YXJpYWJsZXMgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcG9sbG9DbGllbnQucXVlcnkoeyBxdWVyeSwgdmFyaWFibGVzIH0pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVIZWxwZXJzKHsgYXBvbGxvQ2xpZW50LCBmZXRjaCwgaGlzdG9yeSB9KSB7XG4gIHJldHVybiB7XG4gICAgY2xpZW50OiBhcG9sbG9DbGllbnQsXG4gICAgaGlzdG9yeSxcbiAgICBmZXRjaCxcbiAgICAvLyBAZGVwcmVjYXRlZCgnVXNlIGBjbGllbnRgIGluc3RlYWQnKVxuICAgIGFwb2xsb0NsaWVudCxcbiAgICAvLyBAZGVwcmVjYXRlZCgnVXNlIGBjbGllbnQucXVlcnkoKWAgb3IgYGNsaWVudC5tdXRhdGUoKWAgaW5zdGVhZCcpXG4gICAgZ3JhcGhxbFJlcXVlc3Q6IGNyZWF0ZUdyYXBocWxSZXF1ZXN0KGZldGNoKSxcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc3RvcmUvY3JlYXRlSGVscGVycy5qcyIsImltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJztcblxuZnVuY3Rpb24gaW5zcGVjdE9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuIGluc3BlY3Qob2JqZWN0LCB7XG4gICAgY29sb3JzOiB0cnVlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2luZ2xlTGluZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG59XG5cbmNvbnN0IGFjdGlvbkZvcm1hdHRlcnMgPSB7XG4gIC8vIFRoaXMgaXMgdXNlZCBhdCBmZWF0dXJlL2Fwb2xsbyBicmFuY2gsIGJ1dCBpdCBjYW4gaGVscCB5b3Ugd2hlbiBpbXBsZW1lbnRpbmcgQXBvbGxvXG4gIEFQT0xMT19RVUVSWV9JTklUOiBhID0+XG4gICAgYHF1ZXJ5SWQ6JHthLnF1ZXJ5SWR9IHZhcmlhYmxlczoke2luc3BlY3RPYmplY3QoXG4gICAgICBhLnZhcmlhYmxlcyxcbiAgICApfVxcbiAgICR7c2luZ2xlTGluZShhLnF1ZXJ5U3RyaW5nKX1gLFxuXG4gIEFQT0xMT19RVUVSWV9SRVNVTFQ6IGEgPT5cbiAgICBgcXVlcnlJZDoke2EucXVlcnlJZH1cXG4gICAke3NpbmdsZUxpbmUoaW5zcGVjdE9iamVjdChhLnJlc3VsdCkpfWAsXG5cbiAgQVBPTExPX1FVRVJZX1NUT1A6IGEgPT4gYHF1ZXJ5SWQ6JHthLnF1ZXJ5SWR9YCxcbn07XG5cbi8vIFNlcnZlciBzaWRlIHJlZHV4IGFjdGlvbiBsb2dnZXJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcigpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiBzdG9yZSA9PiBuZXh0ID0+IGFjdGlvbiA9PiB7XG4gICAgbGV0IGZvcm1hdHRlZFBheWxvYWQgPSAnJztcbiAgICBjb25zdCBhY3Rpb25Gb3JtYXR0ZXIgPSBhY3Rpb25Gb3JtYXR0ZXJzW2FjdGlvbi50eXBlXTtcbiAgICBpZiAodHlwZW9mIGFjdGlvbkZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm9ybWF0dGVkUGF5bG9hZCA9IGFjdGlvbkZvcm1hdHRlcihhY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uLnRvU3RyaW5nICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICBmb3JtYXR0ZWRQYXlsb2FkID0gYWN0aW9uLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnBheWxvYWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3JtYXR0ZWRQYXlsb2FkID0gaW5zcGVjdE9iamVjdChhY3Rpb24ucGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1hdHRlZFBheWxvYWQgPSBpbnNwZWN0T2JqZWN0KGFjdGlvbik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYCAqICR7YWN0aW9uLnR5cGV9OiAke2Zvcm1hdHRlZFBheWxvYWR9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3N0b3JlL2xvZ2dlci9sb2dnZXIuc2VydmVyLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImdyYXBocWxcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic2VxdWVsaXplXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwic2VxdWVsaXplXCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtdGFnXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZ3JhcGhxbC10YWdcIlxuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCJcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJsdWViaXJkXCJcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llLXBhcnNlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNvb2tpZS1wYXJzZXJcIlxuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYm9keS1wYXJzZXJcIlxuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3Mtand0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzcy1qd3RcIlxuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3MtZ3JhcGhxbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV4cHJlc3MtZ3JhcGhxbFwiXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwianNvbndlYnRva2VuXCJcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0XCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZmV0Y2hcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJub2RlLWZldGNoXCJcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicHJldHR5LWVycm9yXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicHJldHR5LWVycm9yXCJcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tY2xpZW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYXBvbGxvLWNsaWVudFwiXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtcmVkdXhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1yZWR1eFwiXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic2VyaWFsaXplLWphdmFzY3JpcHRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCJcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCJcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0XCJcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydC1mYWNlYm9va1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0LWZhY2Vib29rXCJcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwcm9wLXR5cGVzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicHJvcC10eXBlc1wiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1bml2ZXJzYWwtcm91dGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidW5pdmVyc2FsLXJvdXRlclwiXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaXNvbW9ycGhpYy1mZXRjaFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImlzb21vcnBoaWMtZmV0Y2hcIlxuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vYXNzZXRzLmpzb25cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCIuL2Fzc2V0cy5qc29uXCJcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eC10aHVua1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4LXRodW5rXCJcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidXRpbFwiXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3N2XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY3N2XCJcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWZpbGV1cGxvYWRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJleHByZXNzLWZpbGV1cGxvYWRcIlxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInFyY29kZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInFyY29kZVwiXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHRtbC1wZGZcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJodG1sLXBkZlwiXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibG9kYXNoXCJcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGF0aFwiXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYXNlNjQtaW1nXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFzZTY0LWltZ1wiXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYW50ZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImFudGRcIlxuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiaGlzdG9yeS9jcmVhdGVCcm93c2VySGlzdG9yeVwiXG4vLyBtb2R1bGUgaWQgPSA0MlxuLy8gbW9kdWxlIGNodW5rcyA9ICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm51bWVyYWxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJudW1lcmFsXCJcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXN5bmNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJhc3luY1wiXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxMyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZnNcIlxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL3dpdGhTdHlsZXNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlc1wiXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1hcG9sbG9cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1hcG9sbG9cIlxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEzIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7QUN0ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMzSEE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFGQTtBQU9BOzs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFTQTtBQUNBO0FBVkE7QUFDQTtBQVlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUZBO0FBREE7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFIQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFiQTtBQW9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBREE7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRQTtBQUVBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWhCQTtBQXJCQTtBQTZDQTtBQXBFQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFYQTtBQURBO0FBZ0JBO0FBQ0E7QUFGQTtBQXdEQTs7Ozs7OztBQ3ZGQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFHQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBbkJBO0FBeEJBOzs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBekJBO0FBMEJBO0FBaENBO0FBQ0E7QUFrQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7Ozs7Ozs7Ozs7QUM1QkE7Ozs7OztBQWxCQTs7Ozs7Ozs7O0FBd0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFDQTtBQVVBO0FBS0E7QUFIQTtBQVNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNsREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBUkE7QUFXQTtBQUNBO0FBR0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQTVKQTtBQUNBO0FBOEpBOzs7Ozs7OztBQ3RLQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQ3pDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBSEE7QUFaQTtBQUNBO0FBMEJBOzs7Ozs7OztBQzFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFIQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFIQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBRkE7QUF2RUE7QUE2RUE7QUFEQTtBQUNBO0FBSUE7Ozs7Ozs7O0FDakdBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQTlDQTtBQUNBO0FBa0RBOzs7Ozs7OztBQy9EQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFGQTtBQXBCQTtBQUNBO0FBa0NBOzs7Ozs7OztBQ2hEQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFaQTtBQWtCQTtBQURBO0FBQ0E7QUFJQTs7Ozs7Ozs7QUNwQ0E7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFMQTtBQUNBO0FBU0E7Ozs7Ozs7O0FDdEJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQU5BO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBdEJBO0FBQ0E7QUEwQkE7Ozs7Ozs7O0FDdkNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMzQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBREE7QUFRQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0JBO0FBQ0E7QUErQkE7Ozs7Ozs7O0FDbERBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUlBO0FBQ0E7QUFGQTtBQUlBO0FBZEE7QUFDQTtBQWdCQTs7Ozs7Ozs7Ozs7Ozs7OztBQzlCQTs7Ozs7Ozs7O0FBU0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBREE7QUFHQTtBQUdBO0FBakJBO0FBQ0E7QUFtQkE7Ozs7Ozs7O0FDdENBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUNyQkE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQUNBO0FBUUE7Ozs7Ozs7O0FDdEJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUNyQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTs7Ozs7Ozs7QUM5QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCQTs7Ozs7Ozs7O0FBU0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQTVCQTtBQUNBO0FBOEJBOzs7Ozs7OztBQ2xEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBOzs7Ozs7OztBQ3pCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBWkE7QUFDQTtBQWNBOzs7Ozs7OztBQzVCQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN2QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBQ0E7QUFrQ0E7Ozs7Ozs7Ozs7Ozs7O0FDekRBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBOztBQXRCQTtBQTJCQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFGQTtBQUhBO0FBUUE7QUF2QkE7QUF5QkE7QUFDQTtBQTVEQTtBQUNBO0FBOERBOzs7Ozs7OztBQzVFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBUEE7QUFDQTtBQVNBOzs7Ozs7OztBQzFCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFFQTtBQURBO0FBSUE7QUFEQTtBQUlBO0FBREE7QUFYQTtBQURBO0FBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBREE7QUFPQTtBQXJDQTtBQUNBO0FBdUNBOzs7Ozs7OztBQ3JEQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBUEE7QUFDQTtBQVNBOzs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBRkE7QUFJQTtBQVpBO0FBQ0E7QUFjQTs7Ozs7Ozs7QUM1QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQVBBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUN4QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFiQTtBQUZBO0FBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZBO0FBRkE7QUFuQkE7QUFDQTtBQXdDQTs7Ozs7Ozs7QUNuRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUNBO0FBS0E7Ozs7Ozs7O0FDbEJBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQUNBO0FBTUE7Ozs7Ozs7Ozs7Ozs7O0FDbEJBOzs7Ozs7Ozs7QUFTQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBSEE7QUFGQTtBQUNBO0FBUUE7Ozs7Ozs7O0FDN0JBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQUE7QUFBQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBOzs7Ozs7OztBQ2xDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFBQTtBQUFBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7Ozs7Ozs7O0FDL0JBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFDQTtBQVFBOzs7Ozs7OztBQ3pCQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFGQTtBQUNBO0FBVUE7Ozs7Ozs7O0FDMUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFMQTtBQUZBO0FBQ0E7QUFhQTs7Ozs7Ozs7QUNuQ0E7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBRkE7QUFGQTtBQUNBO0FBU0E7Ozs7Ozs7O0FDMUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBRkE7QUEvQ0E7QUFGQTtBQUNBO0FBdURBOzs7Ozs7OztBQzdFQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQUZBO0FBQ0E7QUFTQTs7Ozs7Ozs7QUMxQkE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUF4Q0E7QUFGQTtBQUNBO0FBZ0RBOzs7Ozs7OztBQ25FQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFGQTtBQUNBO0FBT0E7Ozs7Ozs7O0FDdkJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUZBO0FBRkE7QUFDQTtBQVNBOzs7Ozs7OztBQzFCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQVRBO0FBRkE7QUFDQTtBQWlCQTs7Ozs7Ozs7QUNwQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFDQTtBQU9BOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCQTs7Ozs7Ozs7O0FBU0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBWkE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUxBO0FBWUE7QUFEQTtBQVFBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUpBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFMQTtBQVlBO0FBREE7QUFRQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6RkE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQXlGQTtBQUNBO0FBQ0E7QUFHQTs7Ozs7Ozs7QUMxSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFGQTtBQUlBO0FBQ0E7QUFQQTtBQVNBOzs7Ozs7OztBQ1pBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOzs7Ozs7OztBQ0xBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFEQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQ3RFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBOzs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QkE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBSkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGQTtBQUtBO0FBakNBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQURBO0FBVUE7QUFEQTtBQTJCQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbkRBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZBO0FBSUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbkJBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBS0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQVNBO0FBckVBO0FBQ0E7QUF1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUZBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFGQTtBQUtBO0FBR0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTtBQUVBO0FBQ0E7QUFGQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYkE7QUFDQTtBQWVBO0FBRUE7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBHQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBb0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUMvUUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1QkE7QUFDQTtBQThCQTs7Ozs7Ozs7QUNsQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDL0NBOzs7QUFBQTtBQUNBO0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQWdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTs7Ozs7Ozs7QUNsREE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBRUE7QUFWQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVDQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7OztBIiwic291cmNlUm9vdCI6IiJ9