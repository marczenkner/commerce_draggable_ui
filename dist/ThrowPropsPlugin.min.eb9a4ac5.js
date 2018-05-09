// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({16:[function(require,module,exports) {
var global = (1,eval)("this");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * VERSION: 0.9.10
 * DATE: 2015-12-18
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * ThrowPropsPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  "use strict";
  _gsScope._gsDefine("plugins.ThrowPropsPlugin", ["plugins.TweenPlugin", "TweenLite", "easing.Ease", "utils.VelocityTracker"], function (a, b, c, d) {
    var e,
        f,
        g,
        h,
        i = function i(b, c) {
      a.call(this, "throwProps"), this._overwriteProps.length = 0;
    },
        j = 999999999999999,
        k = 1e-10,
        l = _gsScope._gsDefine.globals,
        m = !1,
        n = { x: 1, y: 1, z: 2, scale: 1, scaleX: 1, scaleY: 1, rotation: 1, rotationZ: 1, rotationX: 2, rotationY: 2, skewX: 1, skewY: 1, xPercent: 1, yPercent: 1 },
        o = function o(a, b, c, d) {
      for (var e, f, g = b.length, h = 0, i = j; --g > -1;) {
        e = b[g], f = e - a, 0 > f && (f = -f), i > f && e >= d && c >= e && (h = g, i = f);
      }return b[h];
    },
        p = function p(a, b, c, d) {
      if ("auto" === a.end) return a;c = isNaN(c) ? j : c, d = isNaN(d) ? -j : d;var e = "function" == typeof a.end ? a.end(b) : a.end instanceof Array ? o(b, a.end, c, d) : Number(a.end);return e > c ? e = c : d > e && (e = d), { max: e, min: e, unitFactor: a.unitFactor };
    },
        q = function q(a, b, c) {
      for (var d in b) {
        void 0 === a[d] && d !== c && (a[d] = b[d]);
      }return a;
    },
        r = i.calculateChange = function (a, d, e, f) {
      null == f && (f = .05);var g = d instanceof c ? d : d ? new c(d) : b.defaultEase;return e * f * a / g.getRatio(f);
    },
        s = i.calculateDuration = function (a, d, e, f, g) {
      g = g || .05;var h = f instanceof c ? f : f ? new c(f) : b.defaultEase;return Math.abs((d - a) * h.getRatio(g) / e / g);
    },
        t = i.calculateTweenDuration = function (a, e, f, g, h, j) {
      if ("string" == typeof a && (a = b.selector(a)), !a) return 0;null == f && (f = 10), null == g && (g = .2), null == h && (h = 1), a.length && (a = a[0] || a);var l,
          n,
          o,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
          A = 0,
          B = 9999999999,
          C = e.throwProps || e,
          D = e.ease instanceof c ? e.ease : e.ease ? new c(e.ease) : b.defaultEase,
          E = isNaN(C.checkpoint) ? .05 : Number(C.checkpoint),
          F = isNaN(C.resistance) ? i.defaultResistance : Number(C.resistance);for (l in C) {
        "resistance" !== l && "checkpoint" !== l && "preventOvershoot" !== l && (n = C[l], "object" != (typeof n === "undefined" ? "undefined" : _typeof(n)) && (y = y || d.getByTarget(a), y && y.isTrackingProp(l) ? n = "number" == typeof n ? { velocity: n } : { velocity: y.getVelocity(l) } : (t = Number(n) || 0, o = t * F > 0 ? t / F : t / -F)), "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && (void 0 !== n.velocity && "number" == typeof n.velocity ? t = Number(n.velocity) || 0 : (y = y || d.getByTarget(a), t = y && y.isTrackingProp(l) ? y.getVelocity(l) : 0), u = isNaN(n.resistance) ? F : Number(n.resistance), o = t * u > 0 ? t / u : t / -u, v = "function" == typeof a[l] ? a[l.indexOf("set") || "function" != typeof a["get" + l.substr(3)] ? l : "get" + l.substr(3)]() : a[l] || 0, w = v + r(t, D, o, E), void 0 !== n.end && (n = p(n, w, n.max, n.min), (j || m) && (C[l] = q(n, C[l], "end"))), void 0 !== n.max && w > Number(n.max) + k ? (z = n.unitFactor || i.defaultUnitFactors[l] || 1, x = v > n.max && n.min !== n.max || t * z > -15 && 45 > t * z ? g + .1 * (f - g) : s(v, n.max, t, D, E), B > x + h && (B = x + h)) : void 0 !== n.min && w < Number(n.min) - k && (z = n.unitFactor || i.defaultUnitFactors[l] || 1, x = v < n.min && n.min !== n.max || t * z > -45 && 15 > t * z ? g + .1 * (f - g) : s(v, n.min, t, D, E), B > x + h && (B = x + h)), x > A && (A = x)), o > A && (A = o));
      }return A > B && (A = B), A > f ? f : g > A ? g : A;
    },
        u = i.prototype = new a("throwProps");return u.constructor = i, i.version = "0.9.10", i.API = 2, i._autoCSS = !0, i.defaultResistance = 100, i.defaultUnitFactors = { time: 1e3, totalTime: 1e3 }, i.track = function (a, b, c) {
      return d.track(a, b, c);
    }, i.untrack = function (a, b) {
      d.untrack(a, b);
    }, i.isTracking = function (a, b) {
      return d.isTracking(a, b);
    }, i.getVelocity = function (a, b) {
      var c = d.getByTarget(a);return c ? c.getVelocity(b) : NaN;
    }, i._cssRegister = function () {
      var a = l.com.greensock.plugins.CSSPlugin;if (a) {
        var b = a._internals,
            c = b._parseToProxy,
            g = b._setPluginRatio,
            h = b.CSSPropTween;b._registerComplexSpecialProp("throwProps", { parser: function parser(a, b, j, k, l, m) {
            m = new i();var o,
                p,
                q,
                r,
                s,
                t = {},
                u = {},
                v = {},
                w = {},
                x = {},
                y = {};f = {};for (q in b) {
              "resistance" !== q && "preventOvershoot" !== q && (p = b[q], "object" == (typeof p === "undefined" ? "undefined" : _typeof(p)) ? (void 0 !== p.velocity && "number" == typeof p.velocity ? t[q] = Number(p.velocity) || 0 : (s = s || d.getByTarget(a), t[q] = s && s.isTrackingProp(q) ? s.getVelocity(q) : 0), void 0 !== p.end && (w[q] = p.end), void 0 !== p.min && (u[q] = p.min), void 0 !== p.max && (v[q] = p.max), p.preventOvershoot && (y[q] = !0), void 0 !== p.resistance && (o = !0, x[q] = p.resistance)) : "number" == typeof p ? t[q] = p : (s = s || d.getByTarget(a), s && s.isTrackingProp(q) ? t[q] = s.getVelocity(q) : t[q] = p || 0), n[q] && k._enableTransforms(2 === n[q]));
            }r = c(a, t, k, l, m), e = r.proxy, t = r.end;for (q in e) {
              f[q] = { velocity: t[q], min: u[q], max: v[q], end: w[q], resistance: x[q], preventOvershoot: y[q] };
            }return null != b.resistance && (f.resistance = b.resistance), b.preventOvershoot && (f.preventOvershoot = !0), l = new h(a, "throwProps", 0, 0, r.pt, 2), k._overwriteProps.pop(), l.plugin = m, l.setRatio = g, l.data = r, m._onInitTween(e, f, k._tween), l;
          } });
      }
    }, i.to = function (a, c, d, i, j) {
      c.throwProps || (c = { throwProps: c }), 0 === j && (c.throwProps.preventOvershoot = !0), m = !0;var k = new b(a, i || 1, c);return k.render(0, !0, !0), k.vars.css ? (k.duration(t(e, { throwProps: f, ease: c.ease }, d, i, j)), k._delay && !k.vars.immediateRender ? k.invalidate() : g._onInitTween(e, h, k), m = !1, k) : (k.kill(), k = new b(a, t(a, c, d, i, j), c), m = !1, k);
    }, u._onInitTween = function (a, b, c) {
      this.target = a, this._props = [], g = this, h = b;var e,
          f,
          i,
          j,
          k,
          l,
          n,
          o,
          s,
          t = c._ease,
          u = isNaN(b.checkpoint) ? .05 : Number(b.checkpoint),
          v = c._duration,
          w = b.preventOvershoot,
          x = 0;for (e in b) {
        if ("resistance" !== e && "checkpoint" !== e && "preventOvershoot" !== e) {
          if (f = b[e], "number" == typeof f) k = Number(f) || 0;else if ("object" != (typeof f === "undefined" ? "undefined" : _typeof(f)) || isNaN(f.velocity)) {
            if (s = s || d.getByTarget(a), !s || !s.isTrackingProp(e)) throw "ERROR: No velocity was defined in the throwProps tween of " + a + " property: " + e;k = s.getVelocity(e);
          } else k = Number(f.velocity);l = r(k, t, v, u), o = 0, j = "function" == typeof a[e], i = j ? a[e.indexOf("set") || "function" != typeof a["get" + e.substr(3)] ? e : "get" + e.substr(3)]() : a[e], "object" == (typeof f === "undefined" ? "undefined" : _typeof(f)) && (n = i + l, void 0 !== f.end && (f = p(f, n, f.max, f.min), m && (b[e] = q(f, b[e], "end"))), void 0 !== f.max && Number(f.max) < n ? w || f.preventOvershoot ? l = f.max - i : o = f.max - i - l : void 0 !== f.min && Number(f.min) > n && (w || f.preventOvershoot ? l = f.min - i : o = f.min - i - l)), this._overwriteProps[x] = e, this._props[x++] = { p: e, s: i, c1: l, c2: o, f: j, r: !1 };
        }
      }return !0;
    }, u._kill = function (b) {
      for (var c = this._props.length; --c > -1;) {
        null != b[this._props[c].p] && this._props.splice(c, 1);
      }return a.prototype._kill.call(this, b);
    }, u._roundProps = function (a, b) {
      for (var c = this._props, d = c.length; --d > -1;) {
        (a[c[d].p] || a.throwProps) && (c[d].r = b);
      }
    }, u.setRatio = function (a) {
      for (var b, c, d = this._props.length; --d > -1;) {
        b = this._props[d], c = b.s + b.c1 * a + b.c2 * a * a, b.r ? c = Math.round(c) : 1 === a && (c = (1e4 * c + (0 > c ? -.5 : .5) | 0) / 1e4), b.f ? this.target[b.p](c) : this.target[b.p] = c;
      }
    }, a.activate([i]), i;
  }, !0), _gsScope._gsDefine("utils.VelocityTracker", ["TweenLite"], function (a) {
    var b,
        c,
        d,
        e,
        f = /([A-Z])/g,
        g = {},
        h = { x: 1, y: 1, z: 2, scale: 1, scaleX: 1, scaleY: 1, rotation: 1, rotationZ: 1, rotationX: 2, rotationY: 2, skewX: 1, skewY: 1, xPercent: 1, yPercent: 1 },
        i = document.defaultView ? document.defaultView.getComputedStyle : function () {},
        j = function j(a, b, c) {
      var d = (a._gsTransform || g)[b];return d || 0 === d ? d : (a.style[b] ? d = a.style[b] : (c = c || i(a, null)) ? d = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(f, "-$1").toLowerCase()) : a.currentStyle && (d = a.currentStyle[b]), parseFloat(d) || 0);
    },
        k = a.ticker,
        l = function l(a, b, c) {
      this.p = a, this.f = b, this.v1 = this.v2 = 0, this.t1 = this.t2 = k.time, this.css = !1, this.type = "", this._prev = null, c && (this._next = c, c._prev = this);
    },
        m = function m() {
      var a,
          c,
          f = b,
          g = k.time;if (g - d >= .03) for (e = d, d = g; f;) {
        for (c = f._firstVP; c;) {
          a = c.css ? j(f.target, c.p) : c.f ? f.target[c.p]() : f.target[c.p], (a !== c.v1 || g - c.t1 > .15) && (c.v2 = c.v1, c.v1 = a, c.t2 = c.t1, c.t1 = g), c = c._next;
        }f = f._next;
      }
    },
        n = function n(a) {
      this._lookup = {}, this.target = a, this.elem = a.style && a.nodeType ? !0 : !1, c || (k.addEventListener("tick", m, null, !1, -100), d = e = k.time, c = !0), b && (this._next = b, b._prev = this), b = this;
    },
        o = n.getByTarget = function (a) {
      for (var c = b; c;) {
        if (c.target === a) return c;c = c._next;
      }
    },
        p = n.prototype;return p.addProp = function (b, c) {
      if (!this._lookup[b]) {
        var d = this.target,
            e = "function" == typeof d[b],
            f = e ? this._altProp(b) : b,
            g = this._firstVP;this._firstVP = this._lookup[b] = this._lookup[f] = g = new l(f !== b && 0 === b.indexOf("set") ? f : b, e, g), g.css = this.elem && (void 0 !== this.target.style[g.p] || h[g.p]), g.css && h[g.p] && !d._gsTransform && a.set(d, { x: "+=0", overwrite: !1 }), g.type = c || g.css && 0 === b.indexOf("rotation") ? "deg" : "", g.v1 = g.v2 = g.css ? j(d, g.p) : e ? d[g.p]() : d[g.p];
      }
    }, p.removeProp = function (a) {
      var b = this._lookup[a];b && (b._prev ? b._prev._next = b._next : b === this._firstVP && (this._firstVP = b._next), b._next && (b._next._prev = b._prev), this._lookup[a] = 0, b.f && (this._lookup[this._altProp(a)] = 0));
    }, p.isTrackingProp = function (a) {
      return this._lookup[a] instanceof l;
    }, p.getVelocity = function (a) {
      var b,
          c,
          d,
          e = this._lookup[a],
          f = this.target;if (!e) throw "The velocity of " + a + " is not being tracked.";return b = e.css ? j(f, e.p) : e.f ? f[e.p]() : f[e.p], c = b - e.v2, ("rad" === e.type || "deg" === e.type) && (d = "rad" === e.type ? 2 * Math.PI : 360, c %= d, c !== c % (d / 2) && (c = 0 > c ? c + d : c - d)), c / (k.time - e.t2);
    }, p._altProp = function (a) {
      var b = a.substr(0, 3),
          c = ("get" === b ? "set" : "set" === b ? "get" : b) + a.substr(3);return "function" == typeof this.target[c] ? c : a;
    }, n.getByTarget = function (c) {
      var d = b;for ("string" == typeof c && (c = a.selector(c)), c.length && c !== window && c[0] && c[0].style && !c.nodeType && (c = c[0]); d;) {
        if (d.target === c) return d;d = d._next;
      }
    }, n.track = function (a, b, c) {
      var d = o(a),
          e = b.split(","),
          f = e.length;for (c = (c || "").split(","), d || (d = new n(a)); --f > -1;) {
        d.addProp(e[f], c[f] || c[0]);
      }return d;
    }, n.untrack = function (a, c) {
      var d = o(a),
          e = (c || "").split(","),
          f = e.length;if (d) {
        for (; --f > -1;) {
          d.removeProp(e[f]);
        }d._firstVP && c || (d._prev ? d._prev._next = d._next : d === b && (b = d._next), d._next && (d._next._prev = d._prev));
      }
    }, n.isTracking = function (a, b) {
      var c = o(a);return c ? !b && c._firstVP ? !0 : c.isTrackingProp(b) : !1;
    }, n;
  }, !0);
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(), function (a) {
  "use strict";
  var b = function b() {
    return (_gsScope.GreenSockGlobals || _gsScope)[a];
  };"function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = b());
}("ThrowPropsPlugin");
},{}],15:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '49885' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[15,16])
//# sourceMappingURL=/ThrowPropsPlugin.min.eb9a4ac5.map