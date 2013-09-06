/**
 * State-based routing for AngularJS
 * @version v0.0.1 - 2013-03-20
 * @link
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (e, t, n) {
  "use strict";

  function c(e, t) {
    return f(new(f(function () {}, {
      prototype: e
    })), t)
  }

  function h(e) {
    return a(arguments, function (t) {
      t !== e && a(t, function (t,
        n) {
        e.hasOwnProperty(n) || (e[
          n] = t)
      })
    }), e
  }

  function p(e, t, n) {
    this.fromConfig = function (e, t,
      n) {
      return r(e.template) ? this.fromString(
        e.template, t) : r(e.templateUrl) ?
        this.fromUrl(e.templateUrl, t) :
        r(e.templateProvider) ? this.fromProvider(
          e.templateProvider, t, n) :
        null
    }, this.fromString = function (e,
      t) {
      return i(e) ? e(t) : e
    }, this.fromUrl = function (n, r) {
      return i(n) && (n = n(r)), n ==
        null ? null : e.get(n, {
          cache: t
        }).then(function (e) {
          return e.data
        })
    }, this.fromProvider = function (
      e, t, r) {
      return n.invoke(e, null, r || {
        params: t
      })
    }
  }

  function d(e) {
    function f(t) {
      if (!/^\w+$/.test(t)) throw new Error(
        "Invalid parameter name '" +
        t + "' in pattern '" + e +
        "'");
      if (n[t]) throw new Error(
        "Duplicate parameter name '" +
        t + "' in pattern '" + e +
        "'");
      n[t] = !0, u.push(t)
    }

    function l(e) {
      return e.replace(
        /[\\\[\]\^$*+?.()|{}]/g,
        "\\$&")
    }
    var t =
      /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      n = {}, r = "^",
      i = 0,
      s, o = this.segments = [],
      u = this.params = [];
    this.source = e;
    var c, h, p;
    while (s = t.exec(e)) {
      c = s[2] || s[3], h = s[4] || (
        s[1] == "*" ? ".*" : "[^/]*"),
        p = e.substring(i, s.index);
      if (p.indexOf("?") >= 0) break;
      r += l(p) + "(" + h + ")", f(c),
        o.push(p), i = t.lastIndex
    }
    p = e.substring(i);
    var d = p.indexOf("?");
    if (d >= 0) {
      var v = this.sourceSearch = p.substring(
        d);
      p = p.substring(0, d), this.sourcePath =
        e.substring(0, i + d), a(v.substring(
          1).split(/[&?]/), f)
    }
    else this.sourcePath = e, this.sourceSearch =
      "";
    r += l(p) + "$", o.push(p), this.regexp =
      new RegExp(r), this.prefix = o[
        0]
  }

  function v() {
    this.compile = function (e) {
      return new d(e)
    }, this.isMatcher = function (e) {
      return e instanceof d
    }, this.$get = function () {
      return this
    }
  }

  function m(e) {
    function o(e) {
      var t =
        /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/
        .exec(e.source);
      return t != null ? t[1].replace(
        /\\(.)/g, "$1") : ""
    }

    function u(e, t) {
      return e.replace(
        /\$(\$|\d{1,2})/, function (e,
          n) {
          return t[n === "$" ? 0 :
            Number(n)]
        })
    }

    function a(e, t, n) {
      if (!n) return !1;
      var i = t(n, e);
      return r(i) ? i : !0
    }
    var t = [],
      n = null;
    this.rule = function (e) {
      if (!i(e)) throw new Error(
        "'rule' must be a function");
      return t.push(e), this
    }, this.otherwise = function (e) {
      if (s(e)) {
        var t = e;
        e = function () {
          return t
        }
      }
      else if (!i(e)) throw new Error(
        "'rule' must be a function");
      return n = e, this
    }, this.when = function (t, n) {
      var r, f;
      s(t) && (t = e.compile(t));
      if (e.isMatcher(t)) {
        if (s(n)) f = e.compile(n), n =
          function (e) {
            return f.format(e)
        };
        else if (!i(n)) throw new Error(
          "invalid 'handler' in when()"
        );
        r = function (e) {
          return a(e, n, t.exec(e.path(),
            e.search()))
        }, r.prefix = s(t.prefix) ? t
          .prefix : ""
      }
      else {
        if (!(t instanceof RegExp))
          throw new Error(
            "invalid 'what' in when()"
          );
        if (s(n)) f = n, n = function (
          e) {
          return u(f, e)
        };
        else if (!i(n)) throw new Error(
          "invalid 'handler' in when()"
        );
        if (t.global || t.sticky)
          throw new Error(
            "when() RegExp must not be global or sticky"
          );
        r = function (e) {
          return a(e, n, t.exec(e.path()))
        }, r.prefix = o(t)
      }
      return this.rule(r)
    }, this.$get = ["$location",
      "$rootScope",
      function (e, r) {
        function i() {
          var n = t.length,
            r, i;
          for (r = 0; r < n; r++) {
            i = t[r](e);
            if (i) {
              s(i) && e.replace().url(
                i);
              break
            }
          }
        }
        return n && t.push(n), r.$on(
          "$locationChangeSuccess", i
        ), {}
      }
    ]
  }

  function g(e, t) {
    function v(e) {
      var t;
      if (s(e)) {
        t = p[e];
        if (!t) throw new Error(
          "No such state '" + e + "'"
        )
      }
      else {
        t = p[e.name];
        if (!t || t !== e && t.self !==
          e) throw new Error(
          "Invalid or unregistered state"
        )
      }
      return t
    }

    function m(l) {
      l = c(l, {
        self: l,
        toString: function () {
          return this.name
        }
      });
      var h = l.name;
      if (!s(h) || h.indexOf("@") >=
        0) throw new Error(
        "State must have a valid name"
      );
      if (p[h]) throw new Error(
        "State '" + h +
        "'' is already defined");
      var m = n;
      if (!r(l.parent)) {
        var g = /^(.+)\.[^.]+$/.exec(
          h);
        g != null && (m = v(g[1]))
      }
      else l.parent != null && (m = v(
        l.parent));
      l.parent = m;
      var y = l.url;
      if (s(y)) y.charAt(0) == "^" ?
        y = l.url = t.compile(y.substring(
          1)) : y = l.url = (m.navigable ||
          n).url.concat(y);
      else if (!(o(y) && i(y.exec) &&
          i(y.format) && i(y.concat)) &&
        y != null) throw new Error(
        "Invalid url '" + y +
        "' in state '" + l + "'");
      l.navigable = y ? l : m ? m.navigable :
        null;
      var b = l.params;
      if (b) {
        if (!u(b)) throw new Error(
          "Invalid params in state '" +
          l + "'");
        if (y) throw new Error(
          "Both params and url specicified in state '" +
          l + "'")
      }
      else b = l.params = y ? y.parameters() :
        l.parent.params;
      var w = {};
      a(b, function (e) {
        w[e] = !0
      });
      if (m) {
        a(m.params, function (e) {
          if (!w[e]) throw new Error(
            "Missing required parameter '" +
            e + "' in state '" + h +
            "'");
          w[e] = !1
        });
        var E = l.ownParams = [];
        a(w, function (e, t) {
          e && E.push(t)
        })
      }
      else l.ownParams = b;
      var S = {};
      a(r(l.views) ? l.views : {
        "": l
      }, function (e, t) {
        t.indexOf("@") < 0 && (t =
          t + "@" + l.parent.name),
          S[t] = e
      }), l.views = S, l.path = m ? m
        .path.concat(l) : [];
      var x = l.includes = m ? f({},
        m.includes) : {};
      return x[h] = !0, l.resolve ||
        (l.resolve = {}), !l.abstract &&
        y && e.when(y, function (e) {
          d.transitionTo(l, e, !1)
        }), p[h] = l
    }

    function g(e, t) {
      return o(e) ? t = e : t.name =
        e, m(t), this
    }

    function y(e, t, i, o, u, f, p) {
      function y(e, n, r, u, f) {
        function d(n, r) {
          a(n, function (n, i) {
            l.push(t.when(s(n) ? o.get(
              n) : o.invoke(n,
              e.self, p)).then(
              function (e) {
                r[i] = e
              }))
          })
        }
        var l = [u],
          c;
        r ? c = n : (c = {}, a(e.params,
          function (e) {
            c[e] = n[e]
          }));
        var p = {
          $stateParams: c
        }, v = f.globals = {
            $stateParams: c
          };
        return d(e.resolve, v), v.$$state =
          e, a(e.views, function (n,
            r) {
            var s = f[r] = {
              $$controller: n.controller
            };
            l.push(t.when(i.fromConfig(
              n, c, p) || "").then(
              function (e) {
                s.$template = e
              })), n.resolve !== e.resolve &&
              d(n.resolve, s)
          }), t.all(l).then(function (
            t) {
            return h(f.globals, t[0]
              .globals), a(e.views,
              function (e, t) {
                h(f[t], f.globals)
              }), f
          })
      }

      function b(e, t, n) {
        for (var r = 0; r < n.length; r++) {
          var i = n[r];
          if (e[i] != t[i]) return !1
        }
        return !0
      }
      var m = t.reject(new Error(
        "transition superseded")),
        g = t.reject(new Error(
          "transition prevented"));
      return d = {
        params: {},
        current: n.self,
        $current: n,
        transition: null
      }, d.transitionTo = function (s,
        h, p) {
        r(p) || (p = !0), s = v(s);
        if (s.abstract) throw new Error(
          "Cannot transition to abstract state '" +
          s + "'");
        var w = s.path,
          E = d.$current,
          S = d.params,
          x = E.path,
          T, N, C = n.locals,
          k = [];
        for (T = 0, N = w[T]; N && N ===
          x[T] && b(h, S, N.ownParams); T++,
          N = w[T]) C = k[T] = N.locals;
        if (s === E && C === E.locals)
          return d.transition = null,
            t.when(d.current);
        var L = {};
        a(s.params, function (e) {
          var t = h[e];
          L[e] = t != null ? String(
            t) : null
        }), h = L;
        if (e.$broadcast(
          "$stateChangeStart", s.self,
          h, E.self, S).defaultPrevented)
          return g;
        var A = t.when(C);
        for (var O = T; O < w.length; O++,
          N = w[O]) C = k[O] = c(C),
          A = y(N, h, N === s, A, C);
        var M = d.transition = A.then(
          function () {
            var t, n, r;
            if (d.transition !== M)
              return m;
            for (t = x.length - 1; t >=
              T; t--) r = x[t], r.self
              .onExit && o.invoke(r.self
                .onExit, r.self, r.locals
                .globals), r.locals =
              null;
            for (t = T; t < w.length; t++)
              n = w[t], n.locals = k[
                t], n.self.onEnter &&
                o.invoke(n.self.onEnter,
                  n.self, n.locals.globals
              );
            d.$current = s, d.current =
              s.self, d.params = h, l(
                d.params, u), d.transition =
              null;
            var i = s.navigable;
            return p && i && f.url(i.url
              .format(i.locals.globals
                .$stateParams)), e.$broadcast(
              "$stateChangeSuccess",
              s.self, h, E.self, S),
              d.current
          }, function (n) {
            return d.transition !== M ?
              m : (d.transition =
                null, e.$broadcast(
                  "$stateChangeError",
                  s.self, h, E.self,
                  S, n), t.reject(n))
          });
        return M
      }, d.is = function (e) {
        return d.$current === v(e)
      }, d.includes = function (e) {
        return d.$current.includes[v(
          e).name]
      }, d
    }
    var n, p = {}, d;
    n = m({
      name: "",
      url: "^",
      views: null,
      "abstract": !0
    }), n.locals = {
      globals: {
        $stateParams: {}
      }
    }, n.navigable = null, this.state =
      g, this.$get = y, y.$inject = [
        "$rootScope", "$q",
        "$templateFactory",
        "$injector", "$stateParams",
        "$location", "$urlRouter"
    ]
  }

  function y(e, t, n, r) {
    var i = {
      restrict: "ECA",
      terminal: !0,
      link: function (s, o, u) {
        function d() {
          var i = e.$current && e.$current
            .locals[l];
          if (i === f) return;
          a && (a.$destroy(), a =
            null);
          if (i) {
            f = i, p.state = i.$$state,
              o.html(i.$template);
            var u = t(o.contents());
            a = s.$new();
            if (i.$$controller) {
              i.$scope = a;
              var h = n(i.$$controller,
                i);
              o.contents().data(
                "$ngControllerController",
                h)
            }
            u(a), a.$emit(
              "$viewContentLoaded"),
              a.$eval(c), r()
          }
          else f = null, p.state =
            null, o.html("")
        }
        var a, f, l = u[i.name] || u.name ||
            "",
          c = u.onload || "",
          h = o.parent().inheritedData(
            "$uiView");
        l.indexOf("@") < 0 && (l = l +
          "@" + (h ? h.state.name :
            ""));
        var p = {
          name: l,
          state: null
        };
        o.data("$uiView", p), s.$on(
          "$stateChangeSuccess", d),
          d()
      }
    };
    return i
  }

  function b(e, t) {
    function o(e) {
      this.locals = e.locals.globals,
        this.params = this.locals.$stateParams
    }

    function u() {
      this.locals = null, this.params =
        null
    }

    function a(n, a) {
      if (a.redirectTo != null) {
        var f = a.redirectTo,
          l;
        if (s(f)) l = f;
        else {
          if (!i(f)) throw new Error(
            "Invalid 'redirectTo' in when()"
          );
          l = function (e, t) {
            return f(e, t.path(), t.search())
          }
        }
        t.when(n, l)
      }
      else e.state(c(a, {
        parent: null,
        name: "route:" + encodeURIComponent(
          n),
        url: n,
        onEnter: o,
        onExit: u
      }));
      return r.push(a), this
    }

    function f(e, t, i) {
      function o(e) {
        return e.name !== "" ? e : n
      }
      var s = {
        routes: r,
        params: i,
        current: n
      };
      return t.$on(
        "$stateChangeStart", function (
          e, n, r, i, s) {
          t.$broadcast(
            "$routeChangeStart", o(n),
            o(i))
        }), t.$on(
        "$stateChangeSuccess",
        function (e, n, r, i, u) {
          s.current = o(n), t.$broadcast(
            "$routeChangeSuccess", o(
              n), o(i)), l(r, s.params)
        }), t.$on("$stateChangeError",
        function (e, n, r, i, s, u) {
          t.$broadcast(
            "$routeChangeError", o(n),
            o(i), u)
        }), s
    }
    var r = [];
    o.$inject = ["$$state"], this.when =
      a, this.$get = f, f.$inject = [
        "$state", "$rootScope",
        "$routeParams"
    ]
  }
  var r = t.isDefined,
    i = t.isFunction,
    s = t.isString,
    o = t.isObject,
    u = t.isArray,
    a = t.forEach,
    f = t.extend,
    l = t.copy;
  t.module("ui.util", ["ng"]), t.module(
    "ui.router", ["ui.util"]), t.module(
    "ui.state", ["ui.router",
      "ui.util"
    ]), t.module("ui.compat", [
    "ui.state"
  ]), p.$inject = ["$http",
    "$templateCache", "$injector"
  ], t.module("ui.util").service(
    "$templateFactory", p), d.prototype
    .concat = function (e) {
      return new d(this.sourcePath +
        e + this.sourceSearch)
  }, d.prototype.toString = function () {
    return this.source
  }, d.prototype.exec = function (e,
    t) {
    var n = this.regexp.exec(e);
    if (!n) return null;
    var r = this.params,
      i = r.length,
      s = this.segments.length - 1,
      o = {}, u;
    for (u = 0; u < s; u++) o[r[u]] =
      decodeURIComponent(n[u + 1]);
    for (; u < i; u++) o[r[u]] = t[r[
      u]];
    return o
  }, d.prototype.parameters =
    function () {
      return this.params
  }, d.prototype.format = function (e) {
    var t = this.segments,
      n = this.params;
    if (!e) return t.join("");
    var r = t.length - 1,
      i = n.length,
      s = t[0],
      o, u, a;
    for (o = 0; o < r; o++) a = e[n[o]],
      a != null && (s += a), s += t[o +
        1];
    for (; o < i; o++) a = e[n[o]], a !=
      null && (s += (u ? "&" : "?") +
        n[o] + "=" +
        encodeURIComponent(a), u = !0
    );
    return s
  }, t.module("ui.util").provider(
    "$urlMatcherFactory", v), m.$inject = [
    "$urlMatcherFactoryProvider"
  ], t.module("ui.router").provider(
    "$urlRouter", m), g.$inject = [
    "$urlRouterProvider",
    "$urlMatcherFactoryProvider"
  ], t.module("ui.state").value(
    "$stateParams", {}).provider(
    "$state", g), y.$inject = [
    "$state", "$compile",
    "$controller", "$anchorScroll"
  ], t.module("ui.state").directive(
    "uiView", y), b.$inject = [
    "$stateProvider",
    "$urlRouterProvider"
  ], t.module("ui.compat").provider(
    "$route", b).directive("ngView",
    y)
})(window, window.angular);
