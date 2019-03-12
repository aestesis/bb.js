////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////         /////////////////////////////////////////////
//// copyright aestesis.net R.JEGOUZO   \\  bb.js  \\            html5 ui      v1.1.07      ////
//////////////////////////////////////////         /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/*jshint white: true, curly: false, loopfunc: true, esnext: true */
// license Apache 2.0
////////////////////////////////////////////////////////////////////////////////////////////////
////   namespace   /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var bb = {
    fn: {},
    fna: {}, // predefined animation ex: fadein, fadeout, etc..
    beh: {}
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

(function () {
    "use strict";
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   private globals    //////////////////////////////////////////////////////////////////                                                                  
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    var _animations = [];
    var _pulsed = [];
    var _focused = null;
    var _keystates = {};
    var _mouse = null;

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   public globals   ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.version = '1.1.07';

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.align = {
        TOP: {
            v: 0
        },
        VCENTER: {
            v: 2
        },
        BOTTOM: {
            v: 1
        },
        VFILL: {
            v: 3
        },
        LEFT: {
            h: 0
        },
        HCENTER: {
            h: 2
        },
        RIGHT: {
            h: 1
        },
        HFILL: {
            h: 3
        },
        TOPLEFT: {
            v: 0,
            h: 0
        },
        TOPRIGHT: {
            v: 0,
            h: 1
        },
        BOTTOMLEFT: {
            v: 1,
            h: 0
        },
        BOTTOMRIGHT: {
            v: 1,
            h: 1
        },
        CENTER: {
            v: 2,
            h: 2
        },
        CENTERLEFT: {
            v: 2,
            h: 0
        },
        CENTERRIGHT: {
            v: 2,
            h: 1
        },
        BOTTOMCENTER: {
            v: 1,
            h: 2
        },
        TOPCENTER: {
            v: 0,
            h: 2
        },
        FILL: {
            v: 3,
            h: 3
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    bb.bb = function (a) {
        var n = bb.merge.apply(this, arguments);
        n.super = a;
        return n;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

    bb.create = function (t, o) {
        o = (o === undefined) ? {} : o;
        var v = null;
        var r;
        if (typeof (t) == 'string') {
            if (!(t in bb.fn))
                throw 'unknown bb element';
            v = bb.clone(bb.fn[t]);
        } else {
            v = bb.clone(t);
        }
        r = v.create(o);
        if (r === undefined)
            throw 'template.create() must return the DOM owner element, template: ' + v.type;
        r.bb = v;
        if ('class' in o)
            r.bb.addClass(o['class']);
        r.bb.updateUI();
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.VG = function (tag, attrs) {
        var el = null;
        if (typeof (tag) == 'object') {
            var j = tag;
            el = bb.VG(j.n, j.a);
            if ('s' in j)
                bb.style(el, j.s);
            if ('t' in j)
                el.innerHTML = j.t;
            else if ('c' in j) {
                bb.each(j.c, function (o) {
                    bb.appendVG(el, o);
                });
            }
            return el;
        } else {
            el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            if (attrs) {
                bb.attribs(el, attrs);
                if ('style' in attrs) {
                    var s = attrs.style;
                    if (typeof (s) == 'object')
                        bb.style(el, s);
                }
                if ('text' in attrs)
                    el.textContent = attrs.text;
                if ('align' in attrs)
                    el.style['text-anchor'] = attrs.align;
            }
            el.bb = {
                element: el,
                remove() {
                    this.element.parentElement.removeChild(this.element);
                },
                on(event, fn, capture) {
                    return bb.on(this.element, event, fn, capture);
                },
                once(event, fn, capture) {
                    return bb.once(this.element, event, fn, capture);
                },
                style(s) {
                    return bb.style(this.element, s);
                },
                appendVG(tag, attrs) {
                    return bb.appendVG(this.element, tag, attrs);
                }
            };
            if ('x1' in el) {
                bb.extend(el.bb, {
                    x1(v) {
                        if (v === undefined)
                            return this.element.x1.baseVal.value;
                        else
                            this.element.x1.baseVal.value = v;
                    },
                    y1(v) {
                        if (v === undefined)
                            return this.element.y1.baseVal.value;
                        else
                            this.element.y1.baseVal.value = v;
                    },
                    x2(v) {
                        if (v === undefined)
                            return this.element.x2.baseVal.value;
                        else
                            this.element.x2.baseVal.value = v;
                    },
                    y2(v) {
                        if (v === undefined)
                            return this.element.y2.baseVal.value;
                        else
                            this.element.y2.baseVal.value = v;
                    },
                    position(x1, y1, x2, y2) {
                        if (x1 === undefined)
                            return {
                                x1: this.element.x1.baseVal.value,
                                y1: this.element.y1.baseVal.value,
                                x2: this.element.x2.baseVal.value,
                                y2: this.element.y2.baseVal.value
                            };
                        else if (typeof (x1) == 'number') {
                            this.element.x1.baseVal.value = x1;
                            this.element.y1.baseVal.value = y1;
                            this.element.x2.baseVal.value = x2;
                            this.element.y2.baseVal.value = y2;
                        } else {
                            if ('x1' in x1)
                                this.element.x1.baseVal.value = x1.x1;
                            if ('y1' in x1)
                                this.element.y1.baseVal.value = x1.y1;
                            if ('x2' in x1)
                                this.element.x2.baseVal.value = x1.x2;
                            if ('y2' in x1)
                                this.element.y2.baseVal.value = x1.y2;
                        }
                    }
                });
            }
            if ('textContent' in el) {
                bb.extend(el.bb, {
                    text(t) {
                        if (t === undefined)
                            return this.element.textContent;
                        this.element.textContent = t;
                    },
                    align(a) {
                        if (a === undefined)
                            return this.element.style['text-anchor'];
                        else
                            this.element.style['text-anchor'] = a;
                    }
                });
            }
            if ('x' in el) {
                var xx = ('length' in el.x.baseVal) ? el.x.baseVal[0] : el.x.baseVal;
                var yy = ('length' in el.y.baseVal) ? el.y.baseVal[0] : el.y.baseVal;
                bb.extend(el.bb, {
                    x(v) {
                        if (v === undefined)
                            return xx.value;
                        else
                            xx.value = v;
                    },
                    y(v) {
                        if (v === undefined)
                            return yy.value;
                        else
                            yy.value = v;
                    },
                    position(x, y) {
                        if (x === undefined)
                            return {
                                x: xx.value,
                                y: yy.value
                            };
                        else if (typeof (x) == 'number') {
                            xx.value = x;
                            yy.value = y;
                        } else {
                            if ('x' in x)
                                xx.value = isNaN(x.x) ? 0 : x.x;
                            if ('y' in x)
                                yy.value = isNaN(x.y) ? 0 : x.y;
                        }
                    }
                });
            }
            if ('width' in el) {
                bb.extend(el.bb, {
                    width(v) {
                        if (v === undefined)
                            return this.element.width.baseVal.value;
                        else
                            this.element.width.baseVal.value = v;
                    },
                    height(v) {
                        if (v === undefined)
                            return this.element.height.baseVal.value;
                        else
                            this.element.height.baseVal.value = v;
                    },
                    size(w, h) {
                        if (w === undefined)
                            return {
                                width: this.element.width.baseVal.value,
                                height: this.element.height.baseVal.value
                            };
                        else if (typeof (w) == 'number') {
                            this.element.width.baseVal.value = w;
                            this.element.height.baseVal.value = h;
                        } else {
                            if ('w' in w)
                                this.element.width.baseVal.value = w.w;
                            else if ('width' in w)
                                this.element.width.baseVal.value = w.width;
                            if ('h' in w)
                                this.element.height.baseVal.value = w.h;
                            else if ('height' in w)
                                this.element.height.baseVal.value = w.height;
                        }
                    },
                    frame(f) {
                        if (f === undefined)
                            return bb.rect(this.size(), this.position());
                        this.size(f);
                        this.position(f);
                    }
                });
            }
            if ('rx' in el) {
                bb.extend(el.bb, {
                    rx(v) {
                        if (v === undefined)
                            return this.element.rx.baseVal.value;
                        else
                            this.element.rx.baseVal.value = v;
                    },
                    ry(v) {
                        if (v === undefined)
                            return this.element.ry.baseVal.value;
                        else
                            this.element.ry.baseVal.value = v;
                    },
                    round(rx, ry) {
                        if (rx === undefined)
                            return {
                                rx: this.element.rx.baseVal.value,
                                ry: this.element.ry.baseVal.value
                            };
                        else if (typeof (rx) == 'number') {
                            this.element.rx.baseVal.value = rx;
                            this.element.ry.baseVal.value = ry;
                        } else {
                            if ('rx' in rx)
                                this.element.rx.baseVal.value = rx.rx;
                            if ('ry' in rx)
                                this.element.ry.baseVal.value = rx.ry;
                        }
                    }
                });
            }
            if (el.nodeName == 'g') {
                el.setAttribute('transform', 'translate(0 0) rotate(0 0 0) scale(1 1)');
                bb.extend(el.bb, {
                    translate(x, y) {
                        if (x === undefined)
                            return {
                                x: this.element.transform.baseVal.getItem(0).matrix.e,
                                y: this.element.transform.baseVal.getItem(0).matrix.f
                            };
                        this.element.transform.baseVal.getItem(0).setTranslate(x, y);
                    },
                    position() {
                        return this.translate.apply(this, arguments);
                    },

                });
                bb.extend(el.bb, drawing);
            }
            return el;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.appendVG = function (parent, tag, attrs) {
        var s = bb.VG(tag, attrs);
        parent.appendChild(s);
        return s;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.image = function (url, fn) {
        if (bb.isDOM(url, 'IMG')) {
            var i = url;
            if (i.complete)
                fn(i);
            else
                i.onload = function () {
                    fn(i);
                };
            return i;
        } else {
            var img = new Image();
            if (fn !== undefined)
                img.onload = function () {
                    fn(img);
                };
            if (url !== undefined)
                img.src = url;
            return img;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.parameters = function (url) {
        let o = {};
        let sps = new URLSearchParams(url);
        for (var p of sps)
            o[p[0]] = p[1];
        return o;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.DOM = function (html) {
        var div = document.createElement('div');
        div.innerHTML = o;
        return div.childNodes;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.HTML = function (tag, attrs) {
        var el = null;
        // tag & attrs or object format { n:'name', a:{ attribs }, s: { style }, c:[ children] }
        if (typeof (tag) == 'object') {
            var j = tag;
            el = bb.HTML(j.n, j.a);
            if ('s' in j)
                bb.style(el, j.s);
            if ('t' in j) {
                el.innerHTML = j.t;
            } else if ('c' in j) {
                bb.each(j.c, function (o) {
                    if (typeof (o) == 'string') {
                        var div = document.createElement('div');
                        div.innerHTML = o;
                        while (div.firstChild) {
                            var e = div.firstChild;
                            div.removeChild(e);
                            el.appendChild(e);
                        }
                        //el.appendChild(document.createTextNode(o));
                    } else
                        bb.appendHTML(el, o);
                });
            }
            return el;
        } else {
            el = document.createElement(tag);
            if (attrs !== undefined) {
                bb.attribs(el, attrs);
                if ('style' in attrs) {
                    var s = attrs.style;
                    if (typeof (s) == 'object')
                        bb.style(el, s);
                }
            }
        }
        return el;
    };
    bb.html = function () {
        return bb.HTML.apply(this, arguments);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.appendHTML = function (parent, tag, attrs) {
        var el = bb.HTML(tag, attrs);
        parent.appendChild(el);
        return el;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.clone = function (obj) {
        if (Array.isArray(obj)) {
            var out = [];
            bb.each(obj, function (o) {
                if (typeof o === 'object')
                    out.push(bb.clone(o));
                else
                    out.push(o);
            });
            return out;
        } else
            return bb.extend({}, obj);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.extend = function (out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (bb.isPlainObject(obj[key]))
                        out[key] = bb.extend(out[key], obj[key]);
                    else if (Array.isArray(obj[key]))
                        out[key] = bb.clone(obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        return out;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.merge = function () {
        var r = {};
        for (var i = 0; i < arguments.length; i++)
            bb.extend(r, arguments[i]);
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.filter = function (f, o) {
        var r = {};
        var k;
        if (typeof (f) == 'object') { // bb.filter({x:0,y:0,z:0},{x:12,y:-5,alpha:0.5})  >>  {x:12,y:-5,z:0}
            r = bb.clone(def);
            var s = bb.clone(o);
            for (k in r) {
                if (s[k] !== undefined)
                    r[k] = s[k];
            }
            return r;
        } else { // bb.filter(['a','c','d'],{a:10,b:11,c:12})  >>  {a:10,c:12}  
            r = {};
            for (var i in f) {
                k = f[i];
                if (k in o)
                    r[k] = o[k];
            }
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.exclude = function (f, o) { // exclude(["a", "c", "d"], { a:10, b:11, c:12 }) >> { b:11 }  
        var r = {};
        for (var k in o) {
            if (f.indexOf(k) == -1)
                r[k] = o[k];
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.hasProperty = function (lo, property) { // lo can be a NodeList or an array
        var r = [];
        for (var i = 0; i < lo.length; i++) {
            var e = lo[i];
            if (property in e)
                r.push(e);
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.same = function (a, b) {
        if (a == b)
            return true;
        if (!((a instanceof Object) && (b instanceof Object)))
            return false;
        var ka = Object.keys(a);
        var kb = Object.keys(b);
        if (ka.length != kb.length)
            return false;
        if (!ka.every(function (k) {
                if (!(k in b))
                    return false;
                if (!bb.same(a[k], b[k]))
                    return false;
                return true;
            }))
            return false;
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.inspect = function (obj) {
        var s = '';
        if (Array.isArray(obj)) {
            obj.forEach(function (o) {
                if (s.length > 0)
                    s += ',';
                s += bb.inspect(o);
            });
            return '[' + s + ']';
        } else if (typeof (obj) == 'object' && obj != null) {
            Object.keys(obj).forEach(function (k) {
                if (s.length > 0)
                    s += ',';
                s += k + ':' + bb.inspect(obj[k]);
            });
            return '{' + s + '}';
        } else if (typeof (obj) == 'string') {
            return '"' + obj + '"';
        } else {
            return '' + obj;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.style = function (el, css) {
        for (var s in css) {
            el.style[s] = css[s];
            if (s == 'transform') {
                var t = css[s];
                el.style["-webkit-transform"] = t;
                el.style["-moz-transform"] = t;
                el.style["-ms-transform"] = t;
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.removeStyle = function (el, styles) {
        styles.forEach(function (s) {
            el.style.removeProperty(s);
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.attribs = function (el, attrs) {
        for (var k in attrs) {
            if (attrs[k] !== undefined) {
                if (k.indexOf(':') >= 0) {
                    var ns = k.split(':');
                    if (ns[0] == 'xlink')
                        el.setAttributeNS('http://www.w3.org/1999/xlink', ns[1], attrs[k]);
                    else
                        throw 'not implemented';
                } else
                    el.setAttribute(k, attrs[k]);
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.addClass = function (e, c) {
        if (c.length > 0)
            c.split(' ').forEach(function (cl) {
                e.classList.add(cl);
            });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.removeClass = function (e, c) {
        if (c.length > 0)
            c.split(' ').forEach(function (cl) {
                e.classList.remove(cl);
            });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.hasClass = function (e, c) {
        if (c.length > 0)
            return c.split(' ').every(function (cl) {
                return e.classList.contains(cl);
            });
        return false;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.setClass = function (e, c, bool) {
        if (bool)
            bb.addClass(e, c);
        else
            bb.removeClass(e, c);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.switchClass = function (e, c) {
        c.split(' ').forEach(function (cl) {
            if (e.classList.contains(cl))
                e.classList.remove(cl);
            else
                e.classList.add(cl);
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.closest = function (el, selector) {
        while (el && el.matches) {
            if (el.matches(selector))
                return el;
            el = el.parentNode;
        }
        return null;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.parent = function (el, selector) {
        el = el.parentElement;
        while (el) {
            if (el.matches(selector))
                return el;
            el = el.parentElement;
        }
        return null;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.pulse = function (interval, callback) {
        if (typeof (interval) == 'function')
            _pulsed.push(interval); // on display refresh (ex:60fps)
        else
            window.setInterval(callback, interval * 1000);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.unpulse = function (interval, callback) {
        if (typeof (interval) == 'function') {
            var i = _pulsed.indexOf(interval);
            if (i >= 0)
                _pulsed.splice(i, 1);
            else
                console.debug('bb.unpulse(): callback ' + callback + ' not found');
        } else {
            throw 'not implemented';
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.size = function (w, h) {
        if (w === undefined)
            return {
                width: 0,
                height: 0
            };
        if (typeof (w) == 'number')
            return {
                width: w,
                height: h
            };
        return {
            width: w.width,
            height: w.height
        };
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.point = function (x, y) {
        if (x === undefined)
            return {
                x: 0,
                y: 0
            };
        if (typeof (x) == 'number')
            return {
                x: x,
                y: y
            };
        return x;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.rect = function (x, y, w, h) {
        var r = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            point(px, py) {
                return {
                    x: this.x + this.width * px,
                    y: this.y + this.height * py
                };
            },
            enlarge(w, h) {
                var r = bb.rect(this);
                r.x -= w * 0.5;
                r.y -= h * 0.5;
                r.width += w;
                r.height += h;
                return r;
            },
            crop(ratio, margin) {
                margin = margin || 0;
                var d = this.width / this.height;
                var w, h;
                if (d >= ratio) {
                    h = this.height - margin * 2.0;
                    w = ratio * h;
                    return bb.rect((this.width - w) * 0.5, margin, w, h);
                } else {
                    w = this.width - margin * 2.0;
                    h = w / ratio;
                    return bb.rect(margin, (this.height - h) * 0.5, w, h);
                }
            },
            mul(w, h) {
                var r0 = bb.clone(this);
                r0.x *= w;
                r0.width *= w;
                r0.y *= (h !== undefined) ? h : w;
                r0.height *= (h !== undefined) ? h : w;
                return r0;
            },
            top() {
                return this.y;
            },
            bottom() {
                return this.y + this.height;
            },
            left() {
                return this.x;
            },
            right() {
                return this.x + this.width;
            },
            toString() {
                return '{x:' + this.x + ',y:' + this.y + ',width:' + this.width + ',height:' + this.height + '}';
            }
        };
        if (x === undefined) return r;
        if (typeof (x) == 'number') {
            if (w === undefined) bb.extend(r, {
                width: x,
                height: y
            });
            else bb.extend(r, {
                x: x,
                y: y,
                width: w,
                height: h
            });
            return r;
        }
        bb.each(arguments, function (a) {
            if (a.x !== undefined)
                r.x = a.x;
            else if (a.left !== undefined)
                r.x = a.left;
            if (a.y !== undefined)
                r.y = a.y;
            else if (a.top !== undefined)
                r.y = a.top;
            if (a.width !== undefined)
                r.width = a.width;
            else if (a.w !== undefined)
                r.width = a.w;
            if (a.height !== undefined)
                r.height = a.height;
            else if (a.h !== undefined)
                r.height = a.h;
        });
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.color = function (r, g, b, a) {
        if (r === undefined)
            return bb.color(0, 0, 0, 0);
        if (typeof (r) == 'string') {
            var s = r;
            var c = bb.color();
            if (s.contains('rgb')) {
                c.a = 1;
                if (s.contains('rgba'))
                    s = s.replace('rgba(', '').replace(')', '');
                else
                    s = s.replace('rgb(', '').replace(')', '');
                var cc = s.split(',');
                var t = ['r', 'g', 'b', 'a'];
                cc.forEach(function (cv, i) {
                    c[t[i]] = parseFloat(cv) * ((t[i] == 'a') ? 1 : 1 / 255);
                });
            } else {
                if (s.substr(0, 1) == '#')
                    s = s.substr(1);
                if (s.length == 8) {
                    c.a = parseInt(s.substr(0, 2), 16) / 255;
                    s = s.substring(2);
                } else
                    c.a = 1;
                if (s.length != 6)
                    throw 'error';
                c.r = parseInt(s.substr(0, 2), 16) / 255;
                c.g = parseInt(s.substr(2, 2), 16) / 255;
                c.b = parseInt(s.substr(4, 2), 16) / 255;
                if (isNaN(c.r) || isNaN(c.g) || isNaN(c.b) || isNaN(c.a))
                    throw 'error';
            }
            return c;
        } else if (typeof (r) == 'object') {
            let o = r;
            if ('h' in o) { // hsba
                let c = bb.color();
                c.a = Math.min(Math.max(o.a || 1, 0), 1);
                if (o.s == 0) {
                    c.r = o.b;
                    c.g = o.b;
                    c.b = o.b;
                } else {
                    let sectorPos = o.h * 360 / 60.0;
                    let sectorNumber = parseInt(Math.floor(sectorPos), 10);
                    let fractionalSector = sectorPos - sectorNumber;
                    let p = o.b * (1.0 - o.s);
                    let q = o.b * (1.0 - (o.s * fractionalSector));
                    let t = o.b * (1.0 - (o.s * (1 - fractionalSector)));
                    switch (sectorNumber) {
                        case 1:
                            c.r = q;
                            c.g = o.b;
                            c.b = p;
                            break;
                        case 2:
                            c.r = p;
                            c.g = o.b;
                            c.b = t;
                            break;
                        case 3:
                            c.r = p;
                            c.g = q;
                            c.b = o.b;
                            break;
                        case 4:
                            c.r = t;
                            c.g = p;
                            c.b = o.b;
                            break;
                        case 5:
                            c.r = o.b;
                            c.g = p;
                            c.b = q;
                            break;
                        default: // 0
                            c.r = o.b;
                            c.g = t;
                            c.b = p;
                            break;
                    }
                }
                return c;
            }
            return bb.color(o.r, o.g, o.b, o.a);
        }
        return {
            r: r,
            g: g,
            b: b,
            a: (a !== undefined) ? a : 1,
            hex() {
                function ch(c) {
                    var h = Math.floor(c * 255.99).toString(16);
                    return h.length == 1 ? '0' + h : h;
                }
                if (this.a < 1)
                    return '#' + (ch(this.a) + ch(this.r) + ch(this.g) + ch(this.b)).toUpperCase();
                else
                    return '#' + (ch(this.r) + ch(this.g) + ch(this.b)).toUpperCase();
            },
            html() {
                function ch(c) {
                    var h = Math.floor(c * 255.99).toString(16);
                    return h.length == 1 ? '0' + h : h;
                }
                if (this.a < 1)
                    return '#' + (ch(this.a) + ch(this.r) + ch(this.g) + ch(this.b)).toUpperCase();
                else
                    return '#' + (ch(this.r) + ch(this.g) + ch(this.b)).toUpperCase();
            },
            rgb() {
                function ch(c) {
                    return Math.floor(c * 255);
                }
                return 'rgb(' + ch(this.r) + ',' + ch(this.g) + ',' + ch(this.b) + ')';
            },
            rgba() {
                function ch(c) {
                    return Math.floor(c * 255);
                }
                return 'rgba(' + ch(this.r) + ',' + ch(this.g) + ',' + ch(this.b) + ',' + this.a + ')';
            }
        };
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.time = function () {
        return Date.now() / 1000.0;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.date = function (json) {
        if (json)
            return new Date(json);
        else
            return (new Date()).toJSON();
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.wait = function (duration, fn, self) {
        if (!self)
            self = this;
        if (typeof (duration) == 'function') {
            fn = duration;
            duration = 0;
        }
        if (duration === 0) {
            var onpulse = function () {
                fn.call(self, self);
                bb.unpulse(onpulse);
            };
            bb.pulse(onpulse);
        } else {
            return window.setTimeout(function () {
                fn.call(self, self);
            }, duration * 1000);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.cancel = function (waitHandler) {
        clearTimeout(waitHandler);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.animate = function (duration, callback, finished) {
        var a = {
            view: bb.id(), // random reference
            start: bb.time(),
            duration: duration,
            callback: callback,
            finished: finished,
            clear() {
                _animations.remove(this);
            }
        };
        _animations.push(a);
        return a;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.nickname = function () {
        var c = 'bdfgjklmnprstvxz';
        var v = 'aeiouy';
        var p = '';
        for (var i = 0; i < 5; i++) {
            var cv = c[Math.floor(Math.random() * c.length)];
            var bb = v[Math.floor(Math.random() * v.length)];
            p += cv + bb;
        }
        return p;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.id = function (n) {
        if (n === undefined)
            n = 16;
        var t = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMONOPQRSTUVWXYZ';
        var id = '';
        for (var i = 0; i < n; i++)
            id += t[Math.floor(Math.random() * t.length)];
        return id;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.range = function (min, v, max) {
        if (v < min)
            return min;
        if (v > max)
            return max;
        return v;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.template = function (id, data) {
        var ok = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_01234567890';
        var d = document.getElementById(id);
        var t = d.innerHTML.trim();
        while (t.indexOf('$') >= 0) {
            var n0 = t.indexOf('$');
            var n1 = n0 + 1;
            while (ok.indexOf(t[n1]) >= 0)
                n1++;
            var s = t.substring(n0, n1);
            var n = s.substring(1);
            if (data[n] !== undefined)
                t = t.replace(s, data[n]);
            else
                t = t.replace(s, '');
        }
        return t;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.getJSON = function (url, fn) {
        bb.get(url, function (data) {
            try {
                fn(JSON.parse(data));
            } catch (error) {
                fn({
                    status: 'error',
                    message: 'wrong response format (not json)',
                    error: error,
                    request: url,
                    response: data
                });
            }
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.postJSON = function (url, data, fn) {
        var req = new XMLHttpRequest();
        if (fn) {
            if ((typeof fn) === 'function') {
                req.onreadystatechange = function () {
                    if (req.readyState == 4 && req.status == 200)
                        try {
                            fn(JSON.parse(req.responseText));
                        } catch (error) {
                            fn({
                                status: 'error',
                                message: 'wrong response format (not json)',
                                error: error,
                                request: url,
                                response: data
                            });
                        }
                };
            } else {
                if (fn.response)
                    req.onreadystatechange = function () {
                        if (req.readyState == 4 && req.status == 200)
                            try {
                                fn(JSON.parse(req.responseText));
                            } catch (error) {
                                fn({
                                    status: 'error',
                                    message: 'wrong response format (not json)',
                                    error: error,
                                    request: url,
                                    response: data
                                });
                            }
                    };
                bb.each(fn, function (f, e) {
                    bb.on(req.upload, e, f);
                });
            }
        }
        req.open('POST', url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(data));
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.get = function (url, fn) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200)
                fn(req.responseText);
            else if (req.readyState == 4)
                console.error('error, request status:' + req.status, ' url: ' + url);
        };
        req.open('GET', url, true);
        req.send();
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.post = function (url, data, fn) {
        var form = new FormData();
        bb.each(data, function (d, k) {
            form.append(k, d);
        });
        var req = new XMLHttpRequest();
        if (fn)
            if ((typeof fn) === 'function') {
                req.onreadystatechange = function () {
                    if (req.readyState == 4 && req.status == 200)
                        fn(req.responseText);
                };
            } else { // events: load, progress, error, abort
                if (fn.response)
                    req.onreadystatechange = function () {
                        if (req.readyState == 4 && req.status == 200)
                            fn.response(req.responseText);
                    };
                bb.each(fn, function (f, e) {
                    bb.on(req.upload, e, f);
                });
            }
        req.open('POST', url, true);
        req.send(form);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.string = function (o) {
        return JSON.stringify(o);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.eachItem = function (o, fn) {
        var r;
        for (var i = 0; i < o.length; i++) {
            r = fn.call(this, o[i], i, o);
            if (r)
                return r;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.array = function (nodelist) {
        var ar = Array.prototype.slice.call(nodelist, 0);
        ar.call = function (fname) {
            var args = [];
            for (var i = 1; i < arguments.length; i++)
                args.push(arguments[i]);
            fname = fname.split('.');
            bb.each(this, function (o) {
                var fn = o;
                bb.each(fname, function (n) {
                    o = fn;
                    fn = fn[n];
                });
                fn.apply(o, args);
            });
        };
        ar.bb = function (fname) {
            var args = [];
            for (var i = 1; i < arguments.length; i++)
                args.push(arguments[i]);
            bb.each(this, function (o) {
                o.bb[fname].apply(o.bb, args);
            });
        };
        ar.each = function (fn) {
            bb.each(this, fn);
        };
        return ar;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.query = function (array, property, value) {
        var r = [];
        bb.each(array, function (i) {
            if (i[property] == value)
                r.push(i);
        });
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.find = function (parent, selector) {
        if (this != bb) { // called from apply
            selector = parent;
            parent = this;
        } else if (selector === undefined) {
            selector = parent;
            parent = document;
        }
        return bb.array(parent.querySelectorAll(selector));
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.each = function (o, fn) {
        var r;
        if (Array.isArray(o)) {
            for (var i = 0; i < o.length; i++) {
                r = fn.call(this, o[i], i, o);
                if (r)
                    return r;
            }
        } else {
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    r = fn.call(this, o[k], k, o);
                    if (r)
                        return r;
                }
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.on = function (el, event, fn, capture) {
        if (event.contains(' ')) {
            event.split(' ').forEach(function (e) {
                bb.on(el, e, fn, capture);
            });
            return;
        }
        if (capture === undefined)
            capture = false;
        el.addEventListener(event, function () {
            fn.apply(el, arguments);
        }, capture);
        if (event == 'mousewheel') {
            el.addEventListener('DOMMouseScroll', function (e) {
                e.wheelDelta = e.detail * (-120);
                fn.call(el, e);
            }, capture);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.once = function (el, event, fn, capture) {
        if (event.contains(' ')) {
            for (var e in event.split(' ')) {
                bb.once(el, e, fn, capture);
            }
            return;
        }
        if (capture === undefined)
            capture = false;
        var func = null;
        func = function () {
            el.removeEventListener(event, func, capture);
            fn.apply(self, arguments);
        };
        el.addEventListener(event, func, capture);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.event = function (event) {
        var e = document.createEvent('Events');
        e.initEvent(event, true, false);
        return e;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.ready = function (fn) {
        bb.once(window, 'load', fn);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.nearest = function (e) {
        while (e !== null) {
            if (e.hasOwnProperty('bb'))
                return e.bb;
            e = e.parentNode;
        }
        return null;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.isKeyDown = function (k) {
        return _keystates[k];
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.mouse = function (el, e) {
        var r = el.getBoundingClientRect();
        return bb.merge(e, {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.capture = function (e, move, end) {
        e.preventDefault();
        e.stopPropagation();
        // TODO: add touchdown/touchmove/touchup 
        bb.once(document, 'mouseup', function (e) {
            document.removeEventListener('mousemove', move);
            if (end !== undefined)
                end.call(this, e);
        });
        document.addEventListener('mousemove', move);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.equal = function (a, b) {
        if (a == b)
            return true;
        var t = typeof (a);
        if (t != typeof (b))
            return false;
        if (t == 'array') {
            if (a.length != b.length)
                return false;
            for (var i = 0; i < a.length; a++)
                if (a[i] != b[i])
                    return false;
        } else {
            if (Object.keys(a).length != Object.keys(b).length)
                return false;
            for (var k in a) {
                if (!(k in b))
                    return false;
                if (a[k] != b[k])
                    return false;
            }
        }
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.add = function (a, b, m) { // r=a+b*m
        if (m === undefined)
            m = 1;
        var r = bb.clone(a);
        for (var k in a) {
            if ((k in b) && typeof (a[k]) == 'number')
                r[k] += b[k] * m;
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.sub = function (a, b, m) { // r=a-b*m
        if (m === undefined)
            m = 1;
        var r = bb.clone(a);
        for (var k in a) {
            if ((k in b) && typeof (a[k]) == 'number')
                r[k] -= b[k] * m;
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.mul = function (a, m) {
        var r = bb.clone(a);
        for (var k in a) {
            if (typeof (a[k]) == 'number')
                r[k] *= m;
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.round = function (a) {
        var r = bb.clone(a);
        for (var k in r) {
            if (typeof (r[k]) == 'number')
                r[k] = Math.round(r[k]);
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.lerp = function (a, b, m) {
        var r = bb.clone(a);
        var im = 1 - m;
        for (var k in a) {
            if ((k in b) && typeof (a[k]) == 'number')
                r[k] = a[k] * im + b[k] * m;
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.confirm = function (msg, callback) {
        var r = confirm(msg);
        callback.call(this, r);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.update = function (a, b) {
        for (var k in a)
            if (k in b)
                a[k] = b[k];
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.replace = function (dst, src) {
        var k;
        for (k in dst)
            if (dst.hasOwnProperty(k))
                delete dst[k];
        for (k in src)
            if (src.hasOwnProperty(k))
                dst[k] = src[k];
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.matrix = function (rows, cols, initial) {
        var r = [];
        for (var i = 0; i < rows; i++) {
            var c = [];
            for (var j = 0; j < cols; j++)
                c[j] = initial;
            r[i] = c;
        }
        return r;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.isPlainObject = function (o) { // means all properties owned
        if (!o || typeof (o) !== 'object' || o.nodeType || o.setInterval)
            return false;
        if (o.constructor && !o.hasOwnProperty('constructor') && !o.constructor.prototype.hasOwnProperty('isPrototypeOf'))
            return false;
        for (var key in o) {} // as Own properties are enumerated firstly
        return key === undefined || o.hasOwnProperty(key); // all properties are owned if last one is owned (or no properties)
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.isDOM = function (o, name) {
        if (o instanceof HTMLElement) {
            if (name === undefined)
                return true;
            if (o.nodeName == name)
                return true;
        }
        return false;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.isBB = function (o) {
        return (o instanceof HTMLDivElement) && o.bb;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.isArray = function (a) {
        return Array.isArray(a);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.mousePosition = function () {
        return bb.clone(_mouse);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.key = function (v0, v1, v2, v3) {
        var t = bb.time();
        return {
            x: 1 + (Math.sin(t * v0) + Math.sin(t * v1)) * 0.2,
            y: 1 + (Math.sin(t * v2) + Math.sin(t * v3)) * 0.2
        };
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.normalize = function (text) {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.offset = function (parent, node) {
        let p = bb.point();
        let n = node;
        while (n && n != parent && n != parent.offsetParent) {
            p = bb.add(p, bb.point(n.offsetLeft, n.offsetTop));
            n = n.offsetParent;
        }
        return p;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.dot = function (obj, path, value) { // (set or get) set: bb.dot(obj,'person.phone.home','#tel')
        if (obj == undefined)
            return undefined;
        else if (typeof path == 'string')
            return bb.dot(obj, path.split('.'), value);
        else if (path.length == 1 && value !== undefined) {
            obj[path[0]] = value;
            return value;
        } else if (path.length == 0)
            return obj;
        else
            return bb.dot(obj[path[0]], path.slice(1), value);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.bootstrap = function (o) {
        if (o.type == 'progress') {
            var p = bb.HTML('div', {
                class: 'progress active progress-striped'
            });
            if (o.width)
                bb.style(p, {
                    width: o.width
                });
            p.bar = bb.appendHTML(p, 'div', {
                class: 'progress-bar',
                role: 'progressbar',
                'aria-valuenow': 0,
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                style: {
                    width: '0%'
                }
            });
            p.setProgress = function (v) {
                var percent = Math.round(v * 10000) / 100;
                this.bar.style.width = percent + '%';
                this.bar.attributes['aria-valuenow'] = percent;
            };
            p.setText = function (t) {
                this.bar.innerHTML = t;
            };
            p.setTextProgress = function (t, v) {
                var percent = Math.round(v * 10000) / 100;
                this.bar.innerHTML = t + ' ' + percent + '%';
                this.bar.style.width = percent + '%';
                bb.attribs(this.bar, {
                    'aria-valuenow': percent
                });
            };
            p.setSuccess = function (t, color) {
                this.setText(t);
                bb.removeClass(this, 'active progress-striped');
                if (color)
                    this.setColor(color);
                else
                    bb.addClass(this, 'progress-success');
            };
            p.setError = function (t) {
                this.setText(t);
                bb.removeClass(this, 'active progress-striped');
                if (color)
                    this.setColor(color);
                else
                    bb.addClass(this, 'progress-danger');
            };
            p.setColor = function (color) {
                var c = bb.color(color);
                bb.style(this.bar, {
                    'background-color': c.rgba()
                });
            };
            if (o.color)
                p.setColor(o.color);
            if (o.text)
                p.setText(o.text);
            return p;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    var browser = null;
    bb.browser = function () {
        if (browser === null) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') != -1) {
                if (ua.indexOf('chrome') > -1)
                    return 'chrome';
                else
                    return 'safari';
            } else if (ua.indexOf('msie') || ua.indexOf('trident') || ua.indexOf('edge')) {
                return 'microsoft';
            }
            return 'undefined';
        }
        return browser;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    var mobile = null;
    bb.isMobile = function () {
        if (mobile === null)
            mobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) !== null;
        return mobile;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   animations   ////////////////////////////////////////////////////////////////////////                                                                         
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    function pulse() {
        var time = bb.time();
        var i;
        var anims = _animations;
        _animations = [];
        bb.each(anims, function (a) {
            if (a === undefined)
                return;
            var t = (time - a.start) / a.duration;
            if (t < 1.0) {
                a.callback.call(a.view, t);
                _animations.push(a);
            } else {
                a.callback.call(a.view, 1.0);
                if (a.finished)
                    a.finished.call(a.view);
            }
        });
        dolayout();
        bb.each(_pulsed, function (e) {
            e();
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   helpers   /////////////////////////////////////////////////////////////////////////// 
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.clone)
        Array.prototype.clone = function () {
            return this.slice(0);
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.remove)
        Array.prototype.remove = function (e) {
            var i = this.indexOf(e);
            if (i >= 0)
                return this.splice(this.indexOf(e), 1);
            return [];
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.contains)
        Array.prototype.contains = function (e) {
            return this.indexOf(e) >= 0;
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.pushUnique)
        Array.prototype.pushUnique = function (e) {
            if (this.contains(e))
                return this.length;
            else
                return this.push(e);
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.pushRange)
        Array.prototype.pushRange = function (e) {
            var self = this;
            bb.each(e, function (ie) {
                self.push(ie);
            });
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.pushRangeUnique)
        Array.prototype.pushRangeUnique = function (e) {
            var self = this;
            bb.each(e, function (ie) {
                self.pushUnique(ie);
            });
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.first) {
        Array.prototype.first = function (property, value) {
            return bb.each(this, function (o) {
                if ((property in o) && o[property] == value)
                    return o;
            });
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!Array.prototype.unique) {
        Array.prototype.unique = function () {
            var a = this.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.format)
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.trim)
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.contains)
        String.prototype.contains = function (e) {
            return this.indexOf(e) >= 0;
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.patch)
        String.prototype.patch = function (s) {
            var r = this;
            if (s.length > 0)
                s.split(' ').forEach(function (p) {
                    if (!r.contains(p))
                        r = (r + ' ' + p).trim();
                });
            return r;
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.replaceAll)
        String.prototype.replaceAll = function (search, replacement) {
            return this.split(search).join(replacement);
        };

    ////////////////////////////////////////////////////////////////////////////////////////////

    if (!String.prototype.capitalized) {
        String.prototype.capitalized = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    String.prototype.removeRange = function (position, lenght) {
        let r = this.split('');
        r.splice(position, lenght);
        return r.join('');
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    ////////////////////////////////////////////////////////////////////////////////////////////

    (function animloop() {
        window.requestAnimFrame(animloop);
        pulse();
    })();

    ////////////////////////////////////////////////////////////////////////////////////////////

    function sendEvent(receiver, event, detail) {
        var e = new CustomEvent(event, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        receiver.dispatchEvent(e);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function styleAlign(a) {
        var s = {
            'width': '100%'
        };
        switch (a.h) {
            case 0:
                s = bb.merge(s, {
                    'text-align': 'left'
                });
                break;
            case 1:
                s = bb.merge(s, {
                    'text-align': 'right'
                });
                break;
            case 2:
            case 3:
                s = bb.merge(s, {
                    'text-align': 'center'
                });
                break;
        }
        switch (a.v) {
            case 0:
                s = bb.merge(s, {
                    'position': 'relative',
                    'top': '0%',
                    'transform': 'translateY(-50%)'
                });
                break;
            case 1:
                s = bb.merge(s, {
                    'position': 'absolute',
                    'bottom': '0'
                });
                break;
            case 2:
            case 3:
                s = bb.merge(s, {
                    'position': 'relative',
                    'top': '50%',
                    'transform': 'translateY(-50%)',
                });
                break;
        }
        return s;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   UI   //////////////////////////////////////////////////////////////////////////////// 
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.base = {
        type: ['base'],
        pv: {
            events: {
                key: []
            }
        },
        is(type) {
            return this.type == type;
        },
        id(id) {
            if (id === undefined)
                return this.element.id;
            else
                this.element.id = id;
        },
        updateUI() {},
        setClass(c, bool) {
            bb.setClass(this.element, c, bool);
        },
        addClass(c) {
            bb.addClass(this.element, c);
        },
        removeClass(c) {
            bb.removeClass(this.element, c);
        },
        hasClass(c) {
            return bb.hasClass(this.element, c);
        },
        attribs(att) {
            if (att === undefined) {
                var o = {};
                this.element.attributes.forEach(function (a) {
                    o[a.name] = a.value;
                });
                return o;
            } else if (typeof (att) == 'string') {
                return this.element.attributes[att];
            } else {
                for (var k in att)
                    this.element.setAttribute(k, att[k]);
            }
        },
        style(att) {
            if (att === undefined) {
                var o = {};
                this.element.style.forEach(function (s) {
                    o[s.name] = s.value;
                });
                return o;
            } else if (typeof (att) == 'string') {
                return this.element.style[att];
            } else {
                for (var k in att)
                    this.element.style[k] = att[k];
            }
        },
        tabindex(i) {
            if (i === undefined)
                return this.element.getAttribute('tabindex');
            this.element.setAttribute('tabindex', i);
        },
        needslayout() {
            return false;
        },
        bounds() {
            return this.element.getBBox();
        },
        position(x, y) {
            var e = this.element;
            if (x === undefined)
                return {
                    x: parseInt(e.style.left),
                    y: parseInt(e.style.top)
                };
            var p = bb.point(x, y);
            e.style.left = p.x + 'px';
            e.style.top = p.y + 'px';
        },
        parent(selector) {
            return bb.parent(this.element, selector);
        },
        find() {
            return bb.find.apply(this.element, arguments);
        },
        on(event, fn, capture) { // event listener
            var self = this;
            if (event.contains(' ')) {
                event.split(' ').forEach(function (e) {
                    if (e.length)
                        self.on(e, fn, capture);
                });
                return;
            }
            if (capture === undefined)
                capture = false;
            if (this.pv.events[event]) {
                this.pv.events[event].push(fn);
            } else {
                this.element.addEventListener(event, function () {
                    fn.apply(self, arguments);
                }, capture);
                if (event == 'mousewheel') {
                    this.element.addEventListener('DOMMouseScroll', function (e) {
                        e.wheelDelta = e.detail * (-120);
                        fn.call(self, e);
                    }, capture);
                }
            }
        },
        off(event, fn) {
            var self = this;
            if (event.contains(' ')) {
                event.split(' ').forEach(function (e) {
                    if (e.length)
                        self.off(e, fn);
                });
                return;
            }
            if (this.pv.events[event]) {
                this.pv.events[event].remove(fn);
            } else {
                console.log('not implemented!'); // TODO:
            }
        },
        once(event, fn) { // event listener, only once
            var self = this;
            if (this.pv.events[event]) {
                var func = null;
                func = function () {
                    self.pv.events[event].remove(func);
                    fn.apply(self, arguments);
                };
                this.pv.events[event].push(func);
            } else {
                this.element.addEventListener(event, function () {
                    fn.apply(self, arguments);
                }, {
                    capture: true,
                    once: true
                });
            }
        },
        dispatch(event, attrs) {
            if (typeof (event) == 'string') {
                if (event in this.pv.events) { // bbEvents
                    var self = this;
                    bb.each(this.pv.events[event], function (fn) {
                        fn.call(self, attrs);
                    });
                } else
                    return this.element.dispatchEvent(new CustomEvent(event, attrs));
            } else
                return this.element.dispatchEvent(event);
        },
        capture(b) {
            if ('releaseCapture' in document) { // chrome doesn't support/need capture 
                if (b)
                    this.element.setCapture();
                else
                    document.releaseCapture();
            }
        },
        focus(b) { // internal bb keyboard focus: 'key' events
            if (b)
                _focused = this.element;
            else if (_focused == this.element)
                _focused = null;
        },
        mouse(e) { // mouse local coordinate from mouse event
            return bb.mouse(this.element, e);
        },
        mouseContent(e) {
            var s = this.transform.scroll;
            var m = bb.mouse(this.element, e);
            return {
                x: m.x - s.x,
                y: m.y - s.y
            };
        },
        animate(duration, callback, finished) {
            if (duration === 'clear') {
                var self = this;
                _animations = _animations.filter(function (a) {
                    return a.view !== self;
                });
            } else if (duration === 'mouse') {
                this.on('mouseenter', function () {
                    bb.pulse(callback);
                });
                this.on('mouseleave', function () {
                    bb.unpulse(callback);
                });
            } else {
                var a = {
                    view: this,
                    start: bb.time(),
                    duration: duration,
                    callback: (typeof callback === 'string') ? bb.fna[callback] : callback,
                    finished: finished,
                    clear() {
                        _animations.remove(this);
                    }
                };
                _animations.push(a);
                return a;
            }
        },
        enable(b) {
            if (b === undefined)
                return this.element.style["pointer-events"] != 'none';
            this.element.style["pointer-events"] = b ? 'auto' : 'none';
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.view = bb.bb(bb.base, {
        layers: {},
        beh: {},
        transform: {
            translate: {
                x: 0,
                y: 0
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1
            },
            scroll: {
                x: 0,
                y: 0
            }
        },
        grid: {
            cols: 12,
            rows: 12,
            margin: 0,
            fixedMargin: 0,
            horizontal: {
                begin: true,
                between: true,
                end: true
            },
            vertical: {
                begin: true,
                between: true,
                end: true
            }
        },
        layout: null,
        needslayout(need) {
            if (need === undefined)
                return this.pv.needslayout;
            if (need && this.superview())
                this.superview().bb.needslayout(true);
            this.pv.needslayout = need;
        },
        create(o) {
            this.type.push('view');
            this.pv.oldsize = bb.size(0, 0);
            this.pv.events.size = [];
            this.pv.events.position = [];
            this.pv.events.remove = [];
            this.pv.events['scroll.bounce'] = [];
            this.pv.memo_transform = bb.clone(this.transform);
            var style = {
                'position': 'absolute',
                'width': '100%',
                'height': '100%'
            };
            var stelem = {
                'position': 'absolute',
                'pointer-events': 'auto',
                width: 0,
                height: 0
            };
            var stnone = {
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
                'pointer-events': 'none'
            };
            this.element = bb.HTML('div', {
                'style': stelem,
                'class': 'view'
            });
            this.element.bb = this;
            this.pv.g_rot = bb.appendHTML(this.element, 'div', {
                style: style
            });
            this.pv.g_center = bb.appendHTML(this.pv.g_rot, 'div', {
                style: style
            });
            if ('contentSize' in o)
                this.pv.contentSize = o.contentSize;
            if ('style' in o)
                bb.style(this.element, o.style);
            if ('x' in o)
                this.transform.translate.x = o.x;
            if ('y' in o)
                this.transform.translate.y = o.y;
            if ('id' in o)
                this.element.setAttribute('id', o.id);
            if ('grid' in o)
                bb.extend(this.grid, o.grid);
            if ('layout' in o)
                this.layout = bb.clone(o.layout);
            if ('filter' in o)
                this.filter(o.filter);
            if ('width' in o)
                this.element.style.width = o.width;
            if ('height' in o)
                this.element.style.height = o.height;
            if ('title' in o)
                this.element.title = o.title;
            this.pv.g_scroll = bb.appendHTML(this.pv.g_center, 'div', {
                style: bb.merge(style, {
                    'z-index': 200
                }),
                'class': 'scroll'
            });
            this.layers.content = bb.appendHTML(this.pv.g_scroll, 'div', {
                style: bb.merge(style, {
                    'z-index': 10
                }),
                'class': 'content'
            });
            this.element.content = this.layers.content;
            this.layers.subviews = bb.appendHTML(this.pv.g_scroll, 'div', {
                style: bb.merge(stnone, {
                    'z-index': 20
                }),
                'class': 'subviews'
            });
            this.on('remove', function () {
                this.subviews().forEach(function (v) {
                    v.bb.remove();
                });
            });
            return this.element;
        },
        absolute() {
            return bb.rect(this.element.getBoundingClientRect()); //, this.size());
        },
        position(x, y) {
            if (x === undefined)
                return bb.clone(this.transform.translate);
            var p = bb.point(x, y);
            this.transform.translate.x = p.x;
            this.transform.translate.y = p.y;
            this.element.style.left = p.x + 'px';
            this.element.style.top = p.y + 'px';
            this.dispatch('position', p);
        },
        scale(x, y) {
            if (x === undefined)
                return bb.clone(this.transform.scale);
            if (y === undefined && typeof (x) === 'number')
                y = x;
            var p = bb.point(x, y);
            this.transform.scale.x = p.x;
            this.transform.scale.y = p.y;
            this.updateUI();
        },
        rotation(a) {
            if (a === undefined)
                return this.transform.rotation;
            this.transform.rotation = a;
            this.updateUI();
        },
        scroll(x, y) {
            var sz;
            var cscroll = bb.clone(this.transform.scroll);
            if (x === undefined) {
                return cscroll;
            } else if (typeof (x) === 'object') {
                if ('dx' in x)
                    this.transform.scroll.x += x.dx;
                else if ('x' in x)
                    this.transform.scroll.x = x.x;
                if ('dy' in x)
                    this.transform.scroll.y += x.dy;
                else if ('y' in x)
                    this.transform.scroll.y = x.y;
                if ('clip' in x) {
                    var co = this.contentSize();
                    sz = this.size();
                    var dw = sz.width - co.width;
                    var dh = sz.height - co.height;
                    if (dh > 0)
                        dh = 0;
                    let xc = bb.range(dw, this.transform.scroll.x, 0);
                    let yc = bb.range(dh, this.transform.scroll.y, 0);
                    if (x.clip === 'hard') {
                        this.transform.scroll.x = xc * 0.8 + this.transform.scroll.x * 0.2;
                        this.transform.scroll.y = yc * 0.8 + this.transform.scroll.y * 0.2;
                    } else if (x.clip === 'soft') {
                        this.transform.scroll.x = xc * 0.2 + this.transform.scroll.x * 0.8;
                        this.transform.scroll.y = yc * 0.2 + this.transform.scroll.y * 0.8;
                    }
                    let sb = {
                        horizontal: '',
                        vertical: ''
                    };
                    if (this.transform.scroll.x > 0)
                        sb.horizontal = 'left';
                    else if (this.transform.scroll.x < dw)
                        sb.horizontal = 'right';
                    if (this.transform.scroll.y > 0)
                        sb.vertical = 'top';
                    else if (this.transform.scroll.y < dh)
                        sb.vertical = 'bottom';
                    if (this.pv.scroll && !bb.same(sb, this.pv.scroll))
                        this.dispatch('scroll.bounce', sb);
                    this.pv.scroll = sb;
                }
            } else if (typeof (x) == 'string') {
                if (x == 'center') {
                    var cs = this.contentSize();
                    sz = this.size();
                    this.transform.scroll = {
                        x: (sz.width - cs.width) * 0.5,
                        y: (sz.height - cs.height) * 0.5
                    };
                }
            } else
                this.transform.scroll = {
                    x: x,
                    y: y
                };
            if (Math.abs(cscroll.x - this.transform.scroll.x) > 0.1 || Math.abs(cscroll.y - this.transform.scroll.y) > 0.1) {
                this.updateUI();
                return true;
            }
            return false;
        },
        clip(b) {
            if (b === undefined)
                return this.element.style.overflow != 'visible';
            if (b) {
                bb.style(this.element, {
                    'overflow': 'hidden'
                });
            } else if (!b) {
                bb.style(this.element, {
                    'overflow': 'visible'
                });
            }
        },
        size(w, h) {
            var e = this.element;
            if (w === undefined)
                return {
                    width: e.clientWidth,
                    height: e.clientHeight
                };
            var s = bb.size(w, h);
            var o = this.pv.oldsize;
            if (Math.abs(s.width - o.width) >= 1 || Math.abs(s.height - o.height) >= 1) {
                this.pv.oldsize.width = s.width;
                this.pv.oldsize.height = s.height;
                this.element.style.width = s.width + 'px';
                this.element.style.height = s.height + 'px';
                this.dispatch('size', s);
                this.needslayout(true);
            }
        },
        contentSize() {
            if (this.pv.contentSize) {
                var el = null;
                if (this.pv.contentSize == 'subviews')
                    el = this.subviews();
                else // this.pv.contentSize=='content'
                    el = this.layers.content.childNodes;
                var sz = bb.size();
                for (var i = 0; i < el.length; i++) {
                    var e = el[i];
                    var r = e.getBoundingClientRect();
                    var right = e.offsetLeft + r.width;
                    var bottom = e.offsetTop + r.height;
                    if (right > sz.width)
                        sz.width = right;
                    if (bottom > sz.height)
                        sz.height = bottom;
                }
                return sz;
            }
            return this.size();
        },
        frame(r) {
            if (r === undefined)
                return bb.rect(this.position(), this.size());
            this.position(r);
            this.size(r);
        },
        updateUI() {
            var self = this;
            var trans = this.transform;
            var otrans = this.pv.memo_transform;
            if (bb.same(otrans, trans))
                return;
            if (!bb.same(otrans.scroll, trans.scroll)) {
                var sll = self.transform.scroll;
                bb.style(self.pv.g_scroll, {
                    transform: 'translate({0}px,{1}px)'.format(sll.x, sll.y)
                });
            }
            if (otrans.rotation != trans.rotation)
                bb.style(self.pv.g_center, {
                    transform: 'rotate({0}rad)'.format(trans.rotation)
                });
            if (!bb.same(otrans.scale, trans.scale))
                bb.style(self.element, {
                    'transform': 'scale({0},{1})'.format(trans.scale.x, trans.scale.y) //+ ' rotate({0}rad)'.format(r)
                });
            if (!bb.same(otrans.translate, trans.translate)) {
                self.element.style.left = trans.translate.x + 'px'; // + dw;
                self.element.style.top = trans.translate.y + 'px'; // + dh;
            }
            this.pv.memo_transform = bb.clone(this.transform);
        },
        dolayout() {
            function spaceCount(d, count) {
                var c = 0;
                if (d.begin)
                    c++;
                if (d.between)
                    c += count - 1;
                if (d.end)
                    c++;
                return c;
            }
            var subs = this.subviews();
            var g = this.grid;
            //var s = this.contentSize();
            var fixedMargin = (typeof (g.fixedMargin) == 'object') ? g.fixedMargin : bb.size(g.fixedMargin, g.fixedMargin);
            var margin = (typeof (g.margin) == 'object') ? g.margin : bb.size(g.margin, g.margin);
            var s = this.size();
            var mw = (s.width / g.cols) * margin.width + fixedMargin.width;
            var mh = (s.height / g.rows) * margin.height + fixedMargin.height;

            var cw = (s.width - mw * spaceCount(g.horizontal, g.cols)) / g.cols;
            var ch = (s.height - mh * spaceCount(g.vertical, g.rows)) / g.rows;
            var mbw = g.horizontal.begin ? mw : 0;
            var mbh = g.vertical.begin ? mh : 0;

            function calcLayout(v, l) {
                var lp = (l.placement === undefined) ? {
                    x: 0,
                    y: 0,
                    cols: g.cols,
                    rows: g.rows
                } : l.placement;
                if (!('margin' in l))
                    l.margin = 0;
                if (!('marginLeft' in l))
                    l.marginLeft = l.margin;
                if (!('marginRight' in l))
                    l.marginRight = l.margin;
                if (!('marginTop' in l))
                    l.marginTop = l.margin;
                if (!('marginBottom' in l))
                    l.marginBottom = l.margin;

                var p = {};
                if (lp.cols)
                    bb.extend(p, {
                        x: mbw + lp.x * (mw + cw) + l.marginLeft,
                        width: lp.cols * cw + (lp.cols - 1) * mw - (l.marginLeft + l.marginRight)
                    });
                else {
                    if (lp.width <= 1)
                        lp.width *= s.width;
                    p.width = lp.width - (l.marginLeft + l.marginRight);
                    if (Math.abs(lp.x) <= 1)
                        lp.x *= s.width;
                    p.x = ((lp.x < 0) ? (s.width + lp.x - p.width) : lp.x) + l.marginLeft;
                }
                if (lp.rows)
                    bb.extend(p, {
                        y: mbh + lp.y * (mh + ch) + l.marginTop,
                        height: lp.rows * ch + (lp.rows - 1) * mh - (l.marginTop + l.marginBottom)
                    });
                else {
                    if (lp.height <= 1)
                        lp.height *= s.height;
                    p.height = lp.height - (l.marginTop + l.marginBottom);
                    if (Math.abs(lp.y) <= 1)
                        lp.y *= s.height;
                    p.y = ((lp.y < 0) ? (s.height + lp.y - p.height) : lp.y) + l.marginTop;
                }

                var po = { // used by left/right/top/bottom contraints,  to check, missing marginLeft,cw, etc.. for now
                    x: p.x - mw,
                    y: p.y - mh,
                    width: p.width + mw,
                    height: p.height + mh
                };

                // if negative constraint, origin is right or bottom border

                var min, max, d, r;
                if ('left' in l) {
                    if ('min' in l.left) {
                        min = (l.left.min >= 0) ? l.left.min : (l.left.min + s.width);
                        if (po.x < min) {
                            d = min - po.x;
                            p.width -= d;
                            p.x += d;
                        }
                    }
                    if ('max' in l.left) {
                        max = (l.left.max >= 0) ? l.left.max : (l.left.max + s.width);
                        if (po.x > max) {
                            d = po.x - max;
                            p.width += d;
                            p.x -= d;
                        }
                    }
                }
                if ('right' in l) {
                    r = po.x + po.width;
                    if ('min' in l.right) {
                        min = (l.right.min >= 0) ? l.right.min : (l.right.min + s.width);
                        if (r < min)
                            p.width += min - r;
                    }
                    if ('max' in l.right) {
                        max = (l.right.max >= 0) ? l.right.max : (l.right.max + s.width);
                        if (r > max)
                            p.width -= r - max;
                    }
                }
                if ('top' in l) {
                    if ('min' in l.top) {
                        min = (l.top.min >= 0) ? l.top.min : (l.top.min + s.height);
                        if (po.y < min) {
                            d = min - po.y;
                            p.height -= d;
                            p.y += d;
                        }
                    }
                    if ('max' in l.top) {
                        max = (l.top.max >= 0) ? l.top.max : (l.top.max + s.height);
                        if (po.y > max) {
                            d = po.y - max;
                            p.height += d;
                            p.y -= d;
                        }
                    }
                }
                if ('bottom' in l) {
                    r = po.y + po.height;
                    if ('min' in l.bottom) {
                        min = (l.bottom.min >= 0) ? l.bottom.min : (l.bottom.min + s.height);
                        if (r < min)
                            p.height += min - r;
                    }
                    if ('max' in l.bottom) {
                        max = (l.bottom.max >= 0) ? l.bottom.max : (l.bottom.max + s.height);
                        if (r > max)
                            p.height -= r - max;
                    }
                }

                if (l.align === undefined)
                    l.align = bb.align.TOPLEFT;

                if (l.align.v !== 3) { // no VFILL
                    if (l.align.v === 2) // VCENTER
                        p.y = p.y + (p.height - v.size().height) * 0.5;
                    else if (l.align.v === 1) // BOTTOM
                        p.y = p.y + p.height - v.size().height;
                    p.height = v.size().height;
                }
                if (l.align.h !== 3) { // no HFILL
                    if (l.align.h === 2) // HCENTER
                        p.x = p.x + (p.width - v.size().width) * 0.5;
                    else if (l.align.h === 1) // RIGHT
                        p.x = p.x + p.width - v.size().width;
                    p.width = v.size().width;
                }

                var scale = 1.0; // round to pixel (TODO: set to 2.0 if retina)
                p.x = Math.round(p.x * scale) / scale;
                p.y = Math.round(p.y * scale) / scale;
                p.width = Math.round(p.width * scale) / scale;
                p.height = Math.round(p.height * scale) / scale;
                return p;
            }
            bb.each(subs, function (e) {
                var v = e.bb;
                if (v.layout !== undefined && v.layout !== null) {
                    var p = calcLayout(v, bb.clone(v.layout));
                    if (v.layoutAnimation) {
                        var la = v.layoutAnimation;
                        var pn = calcLayout(v, bb.clone(la));
                        var s = la.animation.start;
                        var d = la.animation.duration;
                        var dt = (bb.time() - la.animation.start) / la.animation.duration;
                        if (dt >= 1) {
                            var finished = la.animation.finished;
                            delete la.animation;
                            v.layout = la;
                            delete v.layoutAnimation;
                            v.frame(pn);
                            if (finished)
                                finished();
                        } else {
                            if (la.animation.easing)
                                dt = la.animation.easing(dt);
                            v.frame(bb.lerp(p, pn, dt));
                            bb.wait(function () {
                                v.needslayout(true);
                            });
                        }
                    } else {
                        v.frame(p);
                    }
                }

            });
        },
        superview() {
            return bb.closest(this.element.parentElement, 'div.view,div.bb');
        },
        addsubview(s, a) {
            var v = s;
            if (!bb.isDOM(s))
                v = bb.create(s, a);
            this.layers.subviews.appendChild(v);
            this.needslayout(true);
            return v;
        },
        subviews(n) {
            if (n === undefined)
                return bb.array(this.layers.subviews.children);
            //return bb.hasProperty(this.layers.subviews.childNodes, 'bb');
            else if (n < this.layers.subviews.childElementCount)
                return this.layers.subviews.childNodes[n];
            else
                return null;
        },
        remove(v) {
            if (v === undefined) {
                var s = this.superview();
                if (s)
                    s.bb.remove(this.element);
            } else if (v == 'all') {
                this.subviews().forEach(function (v) {
                    v.bb.remove();
                });
            } else {
                this.needslayout(true);
                v.bb.dispatch('remove');
                this.layers.subviews.removeChild(v);
            }
        },
        visible(b) {
            if (b === undefined)
                return (this.element.style.visibility == 'visible');
            this.element.style.visibility = b ? 'visible' : 'hidden';
        },
        opacity(o) {
            if (o === undefined)
                return this.element.style.opacity;
            this.element.style.opacity = o;
        },
        use(behs, args) {
            var self = this;
            bb.each(behs.split(' '), function (beh) {
                if (beh.length > 1) {
                    if (beh in bb.beh) {
                        if (beh in self.beh)
                            return;
                        self.beh[beh] = {};
                        bb.beh[beh].call(self, args);
                    } else
                        throw 'unknown behavior';
                }
            });
        },
        filter(f) {
            if (f === undefined)
                return this.element.getAttribute('filter');
            else
                this.element.setAttribute('filter', f);
        },
        dragdrop(e) {
            var t = e.type;
            if (t == 'dragenter' || t == 'dragleave')
                return false;
            return this.superview().bb.dragdrop(e);
        },
        pulse(callback) {
            bb.pulse(callback);
            this.on('remove', function () {
                bb.unpulse(callback);
            });
        },
        animate(duration, callback, finished, easing) {
            if (typeof (callback) == 'object') {
                this.layoutAnimation = callback;
                this.layoutAnimation.animation = {
                    start: bb.time(),
                    duration: duration,
                    finished: finished,
                    easing: easing
                };
                this.needslayout(true);
            } else {
                bb.base.animate.call(this, duration, callback, finished);
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    var drawing = {
        line(attrs) {
            return this.appendVG('line', attrs);
        },
        circle(attrs) {
            return this.appendVG('circle', attrs);
        },
        rect(attrs) {
            return this.appendVG('rect', attrs);
        },
        text(attrs) {
            return this.appendVG('text', attrs);
        },
        path(attrs) {
            var p = this.appendVG('path', attrs);
            p.d = '';
            p.bb = bb.merge(p.bb, {
                clear() {
                    p.d = '';
                    p.setAttribute('d', '');
                    return p.bb;
                },
                M(x, y) {
                    p.d += ' M ' + x + ' ' + y;
                    return p.bb;
                },
                m(x, y) {
                    p.d += ' m ' + x + ' ' + y;
                    return p.bb;
                },
                L(x, y) {
                    p.d += ' L ' + x + ' ' + y;
                    return p.bb;
                },
                l(x, y) {
                    p.d += ' l ' + x + ' ' + y;
                    return p.bb;
                },
                close() {
                    p.setAttribute('d', (p.d + ' z').trim());
                    p.d = '';
                }
            });
            return p;
        },
        g(attrs) {
            return this.appendVG('g', attrs);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.vg = bb.bb(bb.fn.view, drawing, {
        create(o) {
            bb.fn.vg.super.create.call(this, o);
            this.type.push('vg');
            this.vg = bb.VG('svg', {
                style: {
                    width: 16384,
                    height: 16384
                }
            });
            //this.defs = this.vg.bb.appendVG('defs');
            this.layers.content.appendChild(this.vg);
            this.pv.vgResize = (o.vgResize !== undefined) ? o.vgResize : true;
            return this.element;
        },
        size(w, h) {
            if (this.pv.vgResize && w !== undefined) {
                var sz = bb.size(w, h);
                //console.log('resize vg: ' + JSON.stringify(sz));
                this.vg.style.width = sz.width + 'px';
                this.vg.style.height = sz.height + 'px';
            }
            return bb.fn.vg.super.size.apply(this, arguments);
        },
        contentSize() {
            var bb = this.vg.getBBox();
            return {
                width: bb.x + bb.width + 1,
                height: bb.y + bb.height + 1
            };
        },
        append(el) {
            this.vg.appendChild(el);
        },
        appendVG(tag, attrs) {
            return bb.appendVG(this.vg, tag, attrs);
        },
        addsubview(s, a) {
            if (typeof (s) == 'string')
                s = bb.create(s, a);
            if (s.nodeName == 'g')
                this.vg.appendChild(s);
            else
                this.layers.subviews.appendChild(s);
            this.needslayout(true);
            return s;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.image = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            this.pv.events.load = [];
            var url = (o.url !== undefined) ? o.url : ((o.href !== undefined) ? o.href : ((o.src !== undefined) ? o.src : ''));
            if (url === '')
                url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUCB1jYCANAAAAMAABhKzxegAAAABJRU5ErkJggg==';
            bb.fn.image.super.create.call(this, o);
            this.type.push('image');
            this.addClass('image');
            this.pv.div = bb.appendHTML(this.layers.content, 'div', {
                style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }
            });
            this.image = bb.appendHTML(this.pv.div, 'img', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            });
            this.pv.offscreenImage = bb.image(url); // use an offscreen image to get naturalSize(), fix safari bug
            this.image.src = url;
            bb.on(this.pv.offscreenImage, 'load', function () {
                self.needslayout(true);
                self.dispatch('load', self.element);
            });
            this.pv.preserveAspectRatio = (o.preserveAspectRatio !== undefined) ? o.preserveAspectRatio : true;
            this.pv.slice = (o.slice !== undefined) ? o.slice : true;
            this.pv.heightFollow = !!o.heightFollow;
            this.pv.align = (o.align !== undefined) ? o.align : bb.align.CENTER;
            self.needslayout(true);
            return this.element;
        },
        applySize(sz) {
            if (this.pv.preserveAspectRatio && !this.pv.heightFollow && sz.width > 0 && sz.height > 0) {
                var cs = this.naturalSize();
                var sr = sz.width / sz.height;
                var cr = cs.width / cs.height;
                var x0 = 0;
                var y0 = 0;
                var w0, h0;
                if ((this.pv.slice && cr > sr) || (!this.pv.slice && cr < sr)) {
                    h0 = sz.height;
                    w0 = cs.width * h0 / cs.height;
                } else {
                    w0 = sz.width;
                    h0 = cs.height * w0 / cs.width;
                }
                if (this.pv.align.h >= 2) {
                    x0 = (sz.width - w0) / 2;
                } else if (this.pv.align.h == 1) {
                    x0 = sz.width - w0;
                }
                if (this.pv.align.v >= 2) {
                    y0 = (sz.height - h0) / 2;
                } else if (this.pv.align.v == 1) {
                    y0 = sz.height - h0;
                }
                bb.style(this.image, {
                    width: w0 + 'px',
                    height: h0 + 'px',
                    'margin-left': x0 + 'px',
                    'margin-top': y0 + 'px'
                });
            } else {
                bb.style(this.image, {
                    width: '100%',
                    height: '100%',
                    'margin-left': '0px',
                    'margin-top': '0px'
                });
            }
        },
        size(w, h) {
            var sz;
            if (w === undefined) {
                sz = bb.fn.image.super.size.call(this);
                if (sz.width === 0 || sz.height === 0)
                    return this.contentSize();
                return sz;
            } else {
                sz = bb.size(w, h);
                if (this.pv.heightFollow) { // for stacks..
                    var cs = this.contentSize();
                    if (cs.width !== 0)
                        sz.height = Math.round(sz.width * cs.height / cs.width);
                }
                var osz = this.pv.oldsize;
                if (sz.width != osz.width || sz.height != osz.height) {
                    bb.fn.image.super.size.call(this, sz);
                    this.applySize(sz);
                }
            }
        },
        slice(b) {
            if (b === undefined)
                return this.pv.slice;
            this.pv.slice = b;
            this.needslayout(true);
        },
        preserveAspectRatio(b) {
            if (b === undefined)
                return this.pv.preserveAspectRatio;
            this.pv.preserveAspectRatio = b;
            this.needslayout(true);
        },
        naturalSize: function () {
            return bb.size(this.pv.offscreenImage.naturalWidth, this.pv.offscreenImage.naturalHeight);
        },
        contentSize() {
            return this.naturalSize();
        },
        source(url) {
            if (url !== undefined) {
                this.pv.offscreenImage.src = url;
                this.image.src = url;
                if (this.pv.offscreenImage.naturalHeight > 0) // in cache
                    this.needslayout(true);
            } else
                this.pv.offscreenImage.src = url;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.text = bb.bb(bb.fn.view, { // size = ['auto', <1 (%), >1 fixed size]
        create(o) {
            bb.fn.text.super.create.call(this, o);
            this.type.push('text');
            this.addClass('text');
            this.pv.align = bb.align.CENTER;
            let margin = this.layers.content;
            if (o.align !== undefined)
                this.pv.align = o.align;
            if (o.needsMargin) { // TODO: changed in bb v.1.1.04, need to add in call in lomob
                margin = bb.appendHTML(this.layers.content, 'div', {
                    style: {
                        'position': 'absolute',
                        'width': '96%',
                        'height': '100%',
                        'margin-left': '2%',
                        'margin-right': '2%'
                    }
                });
                this.pv.margin = margin;
            }
            var text = this.pv.text = bb.appendHTML(margin, 'div', {
                style: styleAlign(this.pv.align)
            });
            if ('text' in o)
                this.pv.text.innerHTML = o.text;
            if ('size' in o) {
                if (o.size == 'auto')
                    this.pv.autosize = 0.9;
                else if (o.size >= 1) {
                    this.pv.autosize = 0;
                    this.element.style['font-size'] = o.size;
                } else {
                    this.pv.autosize = o.size;
                    this.element.style['font-size'] = 0.1;
                }
            }
            text.style.opacity = 0;
            bb.wait(0, function () {
                text.style.opacity = 1;
            });
            return this.element;
        },
        appendHTML(tag, o) {
            return bb.appendHTML(this.pv.text, tag, o);
        },
        text(t) {
            if (t === undefined)
                return this.pv.text.innerHTML;
            this.pv.text.innerHTML = t;
        },
        value(t) {
            if (t === undefined)
                return this.pv.text.innerHTML;
            this.pv.text.innerHTML = t;
        },
        size(w, h) {
            if (w === undefined) {
                return bb.fn.text.super.size.call(this);
            } else {
                var s = bb.size(w, h);
                bb.fn.text.super.size.call(this, w, h);
                if (this.pv.autosize)
                    this.element.style['font-size'] = `${s.height * this.pv.autosize}px`;
            }
        },
        align(a) {
            if (a === undefined)
                return this.pv.align;
            else {
                this.pv.align = a;
                bb.style(this.pv.text, styleAlign(a));
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.template = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.input.super.create.call(this, bb.exclude(['type'], o));
            this.addClass('template');
            if (o.template) {
                var t = document.querySelector('#' + o.template);
                if (t) {
                    self.layers.content.innerHTML = t.content;
                } else {
                    console.log('error, <template id="' + o.template + '"> not found');
                }
            } else if (o.url || o.src) {
                var url = o.url || o.src;
                bb.get(url, function (data) {
                    self.layers.content.innerHTML = data;
                });
            }
            this.style({
                opacity: 0.0
            }); // animate opacity to wait the layout, before being, displayed
            this.animate(0.2, function (t) {
                this.style({
                    opacity: t
                });
            });
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.input = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.input.super.create.call(this, bb.exclude(['type'], o));
            this.type.push('input');
            this.addClass('input');
            this.input = bb.appendHTML(this.layers.content, 'input', {
                type: o.type ? o.type : 'text',
                class: 'blured',
                autocomplete: 'off'
            });
            this.input.style.width = '100%';
            this.input.style.height = '100%';
            if (o.title) {
                this.input.title = o.title;
                this.input.placeholder = o.title;
            }
            if (o.value !== undefined)
                this.value(o.value);
            this.style({
                opacity: 0.0
            }); // animate opacity to wait the layout, before being, displayed
            this.animate(0.2, function (t) {
                this.style({
                    opacity: t
                });
            });
            return this.element;
        },
        on(event, fn) {
            if (event == 'focus' || event == 'blur' || event == 'change' || event == 'input' || event == 'keyup' || event == 'keydown')
                bb.on(this.input, event, fn);
            else
                bb.fn.input.super.on.call(this, event, fn);
        },
        size(w, h) {
            if (w === undefined) {
                return bb.fn.input.super.size.call(this);
            } else {
                var s = bb.size(w, h);
                bb.fn.input.super.size.call(this, w, h);
            }
        },
        cursor(pos) {
            if (pos === undefined)
                return this.input.selectionStart;
            else if (pos < 0)
                this.input.setSelectionRange(this.input.value.length + pos + 1, this.input.value.length + pos + 1);
            else
                this.input.setSelectionRange(pos, pos);
        },
        value(v) {
            if (v === undefined)
                return this.input.value;
            else
                this.input.value = v;
        },
        systemCheck(b) {
            if (b) {
                this.input.autocomplete = 'on';
                this.input.autocorrect = 'on';
                this.input.autocapitalize = 'on';
                this.input.spellcheck = true;
                bb.attribs(this.input, {
                    autocomplete: 'on',
                    autocorrect: 'on',
                    autocapitalize: 'on',
                    spellcheck: true
                });
            } else {
                this.input.autocomplete = 'off';
                this.input.autocorrect = 'off';
                this.input.autocapitalize = 'off';
                this.input.spellcheck = false;
                bb.attribs(this.input, {
                    autocomplete: 'off',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    spellcheck: false
                });
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.textarea = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.textarea.super.create.call(this, o);
            this.type.push('textarea');
            this.addClass('textarea');
            this.text = bb.appendHTML(this.layers.content, 'textarea', {
                class: 'blured',
                autocomplete: 'off'
            });
            this.text.style.width = '100%';
            this.text.style.height = '100%';
            if (o.title) {
                this.text.title = o.title;
                this.input.placeholder = o.title;
            }
            if (o.value !== undefined)
                this.value(o.value);
            this.style({
                opacity: 0.0
            }); // animate opacity to wait the layout, before being, displayed
            this.animate(0.2, function (t) {
                this.style({
                    opacity: t
                });
            });
            return this.element;
        },
        on(event, fn) {
            if (event == 'focus' || event == 'blur' || event == 'change' || event == 'input')
                bb.on(this.text, event, fn);
            else
                bb.fn.textarea.super.on.call(this, event, fn);
        },
        cursor(pos) {
            if (pos === undefined)
                return this.input.selectionStart;
            else if (pos < 0)
                this.text.setSelectionRange(this.input.value.length + pos + 1, this.input.value.length + pos + 1);
            else
                this.text.setSelectionRange(pos, pos);
        },
        value(v) {
            if (v === undefined)
                return this.text.value;
            else
                this.text.value = v;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.stack = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            this.pv.contentSize = 'subviews';
            bb.fn.view.create.call(this, o);
            this.type.push('stack');
            this.addClass('stack');
            this.pv.margin = o.margin ? o.margin : 4;
            this.pv.border = o.border ? o.border : 0;
            this.pv.footer = o.footer ? o.footer : 0;
            this.pv.resizeToContent = !!o.resizeToContent;
            return this.element;
        },
        size() {
            if (arguments.length === 0 && this.pv.resizeToContent) {
                var c = this.contentSize();
                var s = bb.fn.view.size.apply(this, arguments);
                return {
                    width: s.width,
                    height: c.height + this.pv.footer
                };
            }
            return bb.fn.view.size.apply(this, arguments);
        },
        dolayout() {
            var footer = this.pv.footer;
            var m = this.pv.margin;
            var b = this.pv.border;
            var sz = this.size();
            var y = 0;
            bb.each(this.subviews(), function (e) {
                var s = e.bb.size();
                e.bb.frame(bb.rect(b, y, sz.width - b * 2, s.height));
                y += s.height + m;
            });
            if (this.pv.resizeToContent)
                this.size(bb.size(sz.width, Math.max(footer + y - m, 0)));
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.canvas = bb.bb(bb.fn.view, {
        create(o) {
            bb.fn.canvas.super.create.call(this, o);
            this.type.push('canvas');
            this.addClass('canvas');
            this.canvas = bb.appendHTML(this.layers.content, 'canvas', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            });
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.form = bb.bb(bb.fn.view, {
        create(o) {
            bb.fn.form.super.create.call(this, o);
            this.type.push('form');
            this.addClass('form');
            this.pv.events.change = [];
            this.div = bb.appendHTML(this.layers.content, 'div', {
                style: {
                    width: 'calc(100% - 16px)',
                    height: 'calc(100% - 16px)',
                    margin: '8px'
                }
            });
            this.values = o.values;
            if (o.content) {
                var self = this;
                bb.each(o.content, function (e, id) {
                    var value = (o.values && (id in o.values)) ? o.values[id] : 0;
                    if (e.input == 'select') {
                        var ds = bb.appendHTML(self.div, {
                            n: 'div',
                            a: {
                                'class': 'form-group'
                            },
                            c: [{
                                n: 'label',
                                a: {
                                    'for': 'select' + id
                                },
                                s: {
                                    width: '100%'
                                },
                                c: [e.label]
                            }, {
                                n: 'select',
                                a: {
                                    'class': 'form-control form',
                                    id: 'select' + id
                                }
                            }]
                        });
                        var sel = ds.querySelector('select');
                        bb.each(e.data, function (v, k) {
                            var o = bb.appendHTML(sel, 'option');
                            o.value = k;
                            o.innerHTML = v;
                        });
                        if (o.values && (id in o.values))
                            sel.value = value;
                        bb.on(sel, 'change', function () {
                            self.values[id] = sel.value;
                            self.dispatch('change', self.values);
                        });
                    } else if (e.input == 'multiselect') {
                        var dms = bb.appendHTML(self.div, {
                            n: 'div',
                            a: {
                                'class': 'form-group'
                            },
                            c: [{
                                n: 'label',
                                s: {
                                    width: '100%'
                                },
                                c: [e.label]
                            }]
                        });
                        bb.each(e.data, function (v, k) {
                            var cdiv = bb.appendHTML(dms, {
                                n: 'div',
                                a: {
                                    'class': 'checkbox'
                                },
                                c: [{
                                    n: 'label',
                                    c: [{
                                            n: 'input',
                                            a: {
                                                type: 'checkbox',
                                                value: k
                                            }
                                        },
                                        v
                                    ]
                                }]
                            });
                            var cbox = cdiv.querySelector('input');
                            cbox.checked = value.contains(k);
                            bb.on(cbox, 'change', function () {
                                if (cbox.checked) {
                                    if (!value.contains(k))
                                        value.push(k);
                                } else
                                    value.remove(k);
                                self.dispatch('change', self.values);
                            });
                        });
                    } else
                        throw 'not implemented exception';
                });
                this.needslayout(true);
            }
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.html = bb.bb(bb.fn.view, {
        create(o) {
            bb.fn.html.super.create.call(this, o);
            this.type.push('html');
            this.pv.contentSize = 'content';
            return this.element;
        },
        size(w, h) {
            var e = this.element;
            if (w === undefined)
                return {
                    width: e.clientWidth,
                    height: e.clientHeight
                };
            var s = bb.size(w, 100000);
            var o = this.pv.oldsize;
            if (Math.abs(s.width - o.width) >= 1 || Math.abs(s.height - o.height) >= 1) {
                this.pv.oldsize.width = s.width;
                this.pv.oldsize.height = s.height;
                this.element.style.width = s.width + 'px';
                this.element.style.height = s.height + 'px';
                this.dispatch('size', s);
                this.needslayout(true);
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.video = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.video.super.create.call(this, o);
            this.type.push('video');
            this.addClass('video');
            this.pv.relative = bb.appendHTML(this.layers.content, 'div', {
                style: 'position:relative; left:0; top:0; background-color:black;'
            });
            this.video = bb.appendHTML(this.pv.relative, 'video', {
                style: 'position:absolute; left:0; top:0;'
            });
            if ('aspect' in o)
                this.pv.aspect = o.aspect;
            else
                this.pv.aspect = 'fill';
            this.video.addEventListener('loadedmetadata', function () {
                if (self.pv.aspect == 'fill') {
                    var fn = function () {
                        if (self.video.videoWidth > 0)
                            self.computeVideoSize();
                        else
                            window.setTimeout(fn, 50);
                    };
                    fn();
                }
            }, false);
            this.video.addEventListener('timeupdate', function () {
                if (self.pv.aspect == 'fill')
                    self.computeVideoSize();
            }, false);
            return this.element;
        },
        size(w, h) {
            if (w === undefined) {
                return bb.fn.video.super.size.call(this);
            } else {
                var s = bb.size(w, h);
                bb.fn.video.super.size.call(this, w, h);

                this.pv.relative.style.width = s.width + 'px';
                this.pv.relative.style.height = s.height + 'px';

                this.computeVideoSize(s);
            }
        },
        play(src, option) {
            if (src !== undefined)
                this.video.src = src;
            if (option !== undefined)
                bb.attribs(this.video, option);
            this.video.play();
        },
        stop() {
            this.video.stop();
        },
        aspect(a) {
            this.pv.aspect = a;
            this.size(this.size());
        },
        computeVideoSize(s) {
            if (s === undefined)
                s = this.size();
            if (this.video.videoWidth > 0 && this.pv.aspect == 'fill') {
                var vw = this.video.videoWidth;
                var vh = this.video.videoHeight;
                var vd = vw / vh;
                var d = s.width / s.height;
                var uw, uh;
                if (d < vd) {
                    uh = s.height;
                    uw = vw * s.height / vh;
                } else {
                    uw = s.width;
                    uh = vh * s.width / vw;
                }
                this.video.width = uw;
                this.video.height = uh;
                this.video.style.left = (-(uw - s.width) / 2) + 'px';
                this.video.style.top = (-(uh - s.height) / 2) + 'px';
                this.video.style.width = uw + 'px';
                this.video.style.height = uh + 'px';
            } else {
                this.video.width = s.width + 'px';
                this.video.height = s.height + 'px';
                this.video.style.left = '0px';
                this.video.style.top = '0px';
                this.video.style.width = s.width + 'px';
                this.video.style.height = s.height + 'px';
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.gl = bb.bb(bb.fn.canvas, {
        create(o) {
            var self = this;
            bb.fn.gl.super.create.call(this, o);
            this.type.push('gl');
            this.addClass('gl');
            this.pv.events.contextlost = [];
            try {
                //o.debug=true;
                if (o.debug)
                    this.gl = WebGLDebugUtils.makeDebugContext(this.canvas.getContext('webgl'), function (err, funcName, args) {
                        throw 'gl error';
                    });
                else
                    this.gl = this.canvas.getContext('webgl', {
                        premultipliedAlpha: false,
                        alpha: false
                    });
                var gl = this.gl;
                this.canvas.addEventListener("webglcontextlost", function (event) {
                    event.preventDefault();
                    self.dispatch('contextlost');
                }, false);
                this.gl.bb = {
                    pv: {},
                    matrix: mat4.create(),
                    viewport: bb.size(),
                    delete() {
                        this.pv.fragmentShader.bb.delete();
                        this.pv.vertexShader.bb.delete();
                        this.pv.program.bb.delete();
                    },
                    maxTextureUnits() {
                        return gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
                    },
                    maxTextureSize() {
                        return gl.getParameter(gl.MAX_TEXTURE_SIZE);
                    },
                    draw() {
                        return this.pv.program.bb.draw.apply(this.pv.program.bb, arguments);
                    },
                    clear(color) {
                        if (color) {
                            var c = bb.color(color);
                            gl.clearColor(c.r, c.g, c.b, c.a);
                        } else
                            gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                    },
                    createShader(shaderSource, type) {
                        var shaderType = (type == 'vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
                        var shader = gl.createShader(shaderType);
                        if (shader === null)
                            throw "Error creating the shader with shader type: " + shaderType;
                        gl.shaderSource(shader, shaderSource);
                        gl.compileShader(shader);
                        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                            var info = gl.getShaderInfoLog(shader);
                            gl.deleteShader(shader);
                            var e = new Error('error compiling shader: ' + info);
                            e.errors = [];
                            bb.each(info.split('\n'), function (l) {
                                var m = l.split(':');
                                e.errors.push({
                                    char: m[1],
                                    line: m[2],
                                    title: m[3],
                                    message: m[4]
                                });
                            });
                            throw e;
                        }
                        shader.bb = {
                            vars: {},
                            options: {},
                            delete() {
                                gl.deleteShader(shader);
                            }
                        };
                        var lines = shaderSource.split('\n');
                        var scan = 0;
                        while ((scan = shaderSource.indexOf('/*', scan)) >= 0) {
                            var ee = shaderSource.indexOf('*/', scan + 2);
                            if (ee < 0)
                                break;
                            var v = shaderSource.substring(scan + 2, ee);
                            try {
                                var jo = JSON.parse(v);
                                bb.extend(shader.bb.options, jo);
                            } catch (err) {
                                var msg = err.name + ' in Json data : ' + err.message;
                                var e0 = new Error('error compiling shader: ' + msg);
                                e0.errors = [{
                                    char: 0,
                                    line: 0,
                                    title: err.name,
                                    message: msg
                                }];
                                throw e0;
                            }
                            scan = ee + 2;
                        }
                        bb.each(lines, function (l) {
                            if (l.contains('uniform') || l.contains('attribute')) {
                                var props = null;
                                var n = l.indexOf('//');
                                if (n >= 0) {
                                    try {
                                        props = JSON.parse(l.substring(n + 2));
                                    } catch (ec) {}
                                    l = l.substring(0, n);
                                }
                                var mots = l.split(/\b\s+/);
                                var d = {
                                    storage: mots[0].trim(),
                                    type: mots[1].trim(),
                                    name: mots[2].trim().replace(';', ''),
                                    props: props
                                };
                                shader.bb.vars[d.name] = d;
                                //console.log('added variable ' + d.name + ' typed ' + d.type + ' in storage ' + d.storage);
                            }
                        });
                        return shader;
                    },
                    createProgram(fragmentShader, vertexShader) {
                        var self = this;
                        var vsh = vertexShader ? vertexShader : this.pv.vertexShader;
                        var fsh = fragmentShader ? fragmentShader : this.pv.fragmentShader;
                        var program = gl.createProgram();
                        gl.attachShader(program, vsh);
                        gl.attachShader(program, fsh);
                        gl.linkProgram(program);
                        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                            var lastError = gl.getProgramInfoLog(program);
                            console.warn("Error in program linking:" + lastError);
                            gl.deleteProgram(program);
                            return null;
                        }
                        program.bb = {
                            /*
                            program: program, // 4debug
                            vsh: vsh, // 4debug
                            fsh: fsh, // 4debug
                            name: fsh.bb.name, // 4debug
                            */
                            vars: bb.merge(vsh.bb.vars, fsh.bb.vars),
                            use() {
                                gl.useProgram(program);
                            },
                            valid() {
                                gl.validateProgram(program);
                                return gl.getProgramParameter(program, gl.VALIDATE_STATUS);
                            },
                            delete() {
                                bb.each(this.vars, function (v) {
                                    if (v.delete)
                                        v.delete();
                                });
                                gl.deleteProgram(program);
                            }
                        };
                        bb.each(program.bb.vars, function (v) {
                            if (v.location) {
                                console.log('create program error, var: ' + v.name);
                                throw 'error';
                            }
                            if (v.storage == 'uniform') {
                                v.location = gl.getUniformLocation(program, v.name);
                                //v.program = program; // 4debug
                                if (v.type == 'mat4')
                                    v.set = function (m) {
                                        gl.uniformMatrix4fv(this.location, false, m);
                                    };
                                else if (v.type == 'sampler2D')
                                    v.set = function (tex, slot) {
                                        if (slot === undefined)
                                            slot = 0;
                                        gl.activeTexture(gl.TEXTURE0 + slot);
                                        tex.bb.bind();
                                        gl.uniform1i(this.location, slot);
                                    };
                                else if (v.type == 'vec4')
                                    v.set = function (vec) {
                                        if (('x' in vec) !== undefined)
                                            gl.uniform4f(this.location, vec.x, vec.y, vec.z, vec.w);
                                        else
                                            gl.uniform4f(this.location, vec.r, vec.g, vec.b, vec.a);
                                    };
                                else if (v.type == 'vec3')
                                    v.set = function (vec) {
                                        if (('x' in vec) !== undefined)
                                            gl.uniform3f(this.location, vec.x, vec.y, vec.z);
                                        else
                                            gl.uniform3f(this.location, vec.r, vec.g, vec.b);
                                    };
                                else if (v.type == 'vec2')
                                    v.set = function (vec) {
                                        gl.uniform2f(this.location, vec.x, vec.y);
                                    };
                                else if (v.type == 'float')
                                    v.set = function (value) {
                                        gl.uniform1f(this.location, value);
                                    };
                            } else {
                                v.location = gl.getAttribLocation(program, v.name);
                                if (v.location < 0)
                                    throw "error";
                                //v.program = program; // 4debug
                                if (v.type.contains('vec')) {
                                    bb.extend(v, {
                                        components: parseInt(v.type.substring(3)),
                                        buffer: gl.createBuffer(),
                                        array(length) {
                                            return new Float32Array(this.components * length);
                                        },
                                        set(array) {
                                            if (array) {
                                                //if (Array.isArray(array))
                                                array = new Float32Array(array);
                                                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                                                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
                                                //gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
                                                gl.enableVertexAttribArray(this.location);
                                                gl.vertexAttribPointer(this.location, this.components, gl.FLOAT, false, 0, 0);
                                            } else {
                                                gl.disableVertexAttribArray(this.location);
                                            }
                                        },
                                        delete() {
                                            gl.deleteBuffer(this.buffer);
                                        }
                                    });
                                }
                            }
                        });
                        program.bb.blend = function (mode) {
                            gl.disable(gl.CULL_FACE);
                            gl.disable(gl.DEPTH_TEST);
                            gl.enable(gl.BLEND);
                            if (mode == 'alpha') {
                                gl.blendEquation(gl.FUNC_ADD);
                                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                            } else {
                                gl.blendEquation(gl.FUNC_ADD);
                                gl.blendFunc(gl.ONE, gl.ZERO);
                            }
                        };
                        program.bb.uv = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
                        if (vsh === this.pv.vertexShader) { // defaut vertex shader
                            program.bb.draw = function (tex, rdest, data, blendMode) {
                                var r = {
                                    x: rdest.x,
                                    y: rdest.y,
                                    width: rdest.width,
                                    height: rdest.height
                                };
                                this.use();
                                this.blend(blendMode);
                                if (r.height === undefined)
                                    r.height = tex.bb.height * r.width / tex.bb.width;
                                else if (r.width === undefined)
                                    r.width = tex.bb.width * r.height / tex.bb.height;
                                if ('align' in rdest) {
                                    var a = rdest.align;
                                    switch (a.h) {
                                        case 0:
                                            break;
                                        case 1:
                                            r.x -= r.width;
                                            break;
                                        case 2:
                                        case 3:
                                            r.x -= r.width * 0.5;
                                            break;
                                    }
                                    switch (a.v) {
                                        case 0:
                                            break;
                                        case 1:
                                            r.y -= r.height;
                                            break;
                                        case 2:
                                        case 3:
                                            r.y -= r.height * 0.5;
                                            break;
                                    }
                                }
                                var vars = this.vars;
                                var pos = vars.position.array(4);
                                var z = rdest.z ? rdest.z : 0;
                                pos[0] = r.x;
                                pos[1] = r.y;
                                pos[2] = r.x + r.width;
                                pos[3] = r.y;
                                pos[4] = r.x;
                                pos[5] = r.y + r.height;
                                pos[6] = r.x + r.width;
                                pos[7] = r.y + r.height;
                                vars.matrix.set(gl.bb.matrix);
                                var ntex = 0;
                                vars.texture.set(tex, ntex++);
                                vars.position.set(pos);
                                vars.uv.set(data ? (data.uv ? data.uv : this.uv) : this.uv);
                                if (data !== undefined) {
                                    bb.each(data, function (d, k) {
                                        if (k in vars) {
                                            if (vars[k].type == 'sampler2D')
                                                vars[k].set(d, ntex++);
                                            else
                                                vars[k].set(d);
                                        }
                                    });
                                }
                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                                vars.position.set(null);
                                vars.uv.set(null);
                                return r;
                            };
                        } else {
                            program.bb.draw = function (rdest, data, blendMode) {
                                var r = {
                                    x: rdest.x,
                                    y: rdest.y,
                                    width: rdest.width,
                                    height: rdest.height
                                };
                                this.use();
                                this.blend(blendMode);
                                var vars = this.vars;
                                var pos = vars.position.array(4);
                                var z = rdest.z ? rdest.z : 0;
                                pos[0] = r.x;
                                pos[1] = r.y;
                                pos[2] = r.x + r.width;
                                pos[3] = r.y;
                                pos[4] = r.x;
                                pos[5] = r.y + r.height;
                                pos[6] = r.x + r.width;
                                pos[7] = r.y + r.height;
                                vars.matrix.set(gl.bb.matrix);
                                var ntex = 0;
                                vars.position.set(pos);
                                if (data !== undefined) {
                                    bb.each(data, function (d, k) {
                                        if (k in vars) {
                                            if (vars[k].type == 'sampler2D')
                                                vars[k].set(d, ntex++);
                                            else
                                                vars[k].set(d);
                                        }
                                    });
                                }
                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                                vars.position.set(null);
                                return r;
                            };
                        }
                        return program;
                    },
                    loadTexture(url, callback) {
                        var self = this;
                        if (Array.isArray(url)) {
                            var tex = [];
                            var n = url.length;
                            url.forEach(function (u) {
                                self.loadTexture(u, function (t) {
                                    tex.push(t);
                                    if (--n === 0)
                                        callback.call(self, tex);
                                });
                            });
                            return tex;
                        }
                        var texture = gl.createTexture();
                        texture.bb = {
                            texture: texture,
                            readonly: true,
                            ready: false,
                            url: url,
                            delete() {
                                gl.deleteTexture(this.texture);
                            },
                            bind(dest) {
                                if (dest === undefined)
                                    dest = gl.TEXTURE_2D;
                                gl.bindTexture(dest, this.texture);
                            },
                            size() {
                                return bb.size(this.width, this.height);
                            },
                            bounds() {
                                return bb.merge(bb.point(), this.size());
                            },
                            getImage() {
                                return this.image;
                            }
                        };
                        bb.image(url, function (image) {
                            gl.bindTexture(gl.TEXTURE_2D, texture);
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            bb.extend(texture.bb, {
                                ready: true,
                                width: image.width,
                                height: image.height,
                                image: image
                            });
                            bb.wait(function () { // loadTexture must returns before callback called
                                if (callback)
                                    callback.call(self, texture);
                            });
                        });
                        return texture;
                    },
                    createTexture(w, h) {
                        var self = this;
                        var texture = gl.createTexture();
                        var buffer = gl.createFramebuffer();
                        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
                        buffer.width = w; //
                        buffer.height = h;
                        gl.bindTexture(gl.TEXTURE_2D, texture);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, buffer.width, buffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                        var st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                        if (st != gl.FRAMEBUFFER_COMPLETE)
                            throw 'framebuffer error: ' + st;
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        texture.bb = {
                            texture: texture,
                            readonly: false,
                            ready: true,
                            width: w,
                            height: h,
                            frameBuffer: buffer,
                            setRenderTarget() {
                                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                                gl.viewport(0, 0, this.width, this.height);
                                gl.bb.viewport.width = this.width;
                                gl.bb.viewport.height = this.height;
                                mat4.ortho(gl.bb.matrix, 0, this.width, 0, this.height, -100, 100); // reverse top/bottom 
                            },
                            delete() {
                                gl.deleteFramebuffer(this.frameBuffer);
                                gl.deleteTexture(this.texture);
                            },
                            bind(dest) {
                                if (dest === undefined)
                                    dest = gl.TEXTURE_2D;
                                gl.bindTexture(dest, this.texture);
                            },
                            getImage() {
                                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                                var data = new Uint8Array(this.width * this.height * 4);
                                gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
                                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                                var canvas = document.createElement('canvas');
                                canvas.width = this.width;
                                canvas.height = this.height;
                                var context = canvas.getContext('2d');
                                var imageData = context.createImageData(this.width, this.height);
                                imageData.data.set(data);
                                context.putImageData(imageData, 0, 0);
                                return bb.image(canvas.toDataURL());
                            },
                            size() {
                                return bb.size(this.width, this.height);
                            },
                            bounds() {
                                return bb.merge(bb.point(), this.size());
                            }
                        };
                        return texture;
                    }
                };
                gl.bb.pv.vertexShader = gl.bb.createShader([
                    'precision mediump float;',
                    'attribute vec2  position;',
                    'attribute vec2  uv;',
                    'uniform mat4    matrix;',
                    'varying vec2    v_uv;',
                    'void main()',
                    '{',
                    'gl_Position = matrix * vec4(position,0.0,1.0);',
                    'v_uv = uv;',
                    '}'
                ].join('\n'), 'vertex');
                gl.bb.pv.fragmentShader = gl.bb.createShader([
                    'precision mediump float;',
                    'varying vec2        v_uv;',
                    'uniform sampler2D   texture;',
                    'void main()',
                    '{',
                    'gl_FragColor = texture2D(texture, v_uv);',
                    '}'
                ].join('\n'), 'fragment');
                gl.bb.pv.program = gl.bb.createProgram();
            } catch (e) {}
            if (!this.gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
                this.gl = null;
                return this.element;
            }
            this.on('remove', function () {
                this.gl.bb.delete();
            });
            this.on('size', function () {
                self.setRenderTarget();
            });
            return this.element;
        },
        size(w, h) {
            if (w === undefined) {
                return bb.fn.gl.super.size.call(this);
            } else {
                var s = bb.size(w, h);
                bb.fn.gl.super.size.call(this, w, h);
                this.gl.viewport(0, 0, s.width, s.height);
                this.canvas.width = s.width + 'px';
                this.canvas.height = s.height + 'px';
                this.canvas.style.width = s.width + 'px';
                this.canvas.style.height = s.height + 'px';
            }
        },
        setRenderTarget() {
            var gl = this.gl;
            var rsz = this.size();
            var sz = {
                width: gl.canvas.width,
                height: gl.canvas.height
            };
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, sz.width, sz.height);
            gl.bb.viewport.width = sz.width;
            gl.bb.viewport.height = sz.height;
            mat4.ortho(gl.bb.matrix, 0, sz.width, sz.height, 0, -100, 100);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.ace = bb.bb(bb.fn.view, {
        create(o) {
            this.pv.annotations = [];
            var self = this;
            bb.fn.view.create.call(this, o);
            this.type.push('ace');
            this.addClass('ace');
            this.editor = ace.edit(this.layers.content);
            //this.editor.setTheme('ace/theme/monokai');
            this.editor.setTheme('ace/theme/tomorrow_night_eighties');
            this.editor.session.setMode('ace/mode/glsl');
            if (o.text)
                this.text(o.text);
            return this.element;
        },
        on(ev, fn) {
            if (ev == 'focus' || ev == 'blur' || ev == 'input')
                this.editor.on(ev, fn);
            else
                bb.fn.ace.super.on.call(this, ev, fn);
        },
        text(t) {
            if (t === undefined)
                return this.editor.getValue();
            else {
                this.editor.setValue(t);
                this.editor.session.selection.clearSelection();
                this.editor.session.selection.moveCursorTo(0, 0);
            }
        },
        error(line, message) {
            this.pv.annotations.push({
                row: line,
                column: 0,
                text: message,
                type: "error" // also warning and information
            });
            this.editor.session.setAnnotations(this.pv.annotations);
        },
        clearErrors() {
            this.editor.session.setAnnotations([]);
            this.pv.annotations = [];
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.codemirror = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            this.pv.widgets = [];
            bb.fn.view.create.call(this, o);
            this.type.push('codemirror');
            this.addClass('codemirror');
            this.editor = CodeMirror.call(null, this.layers.content, {
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true
            });
            this.pv.codemirror = this.layers.content.querySelector('.CodeMirror');
            bb.style(this.pv.codemirror, {
                width: '100%',
                height: '100%'
            });
            this.editor.setOption('theme', 'monokai');
            if (o.text)
                this.value(o.text);
            this.pv.errorStyle = {
                'font-family': 'arial',
                'font-size': '70%',
                background: '#000000',
                color: '#FF0000',
                padding: '2px 5px 3px',
                width: '100%'
            };
            if (o.errorStyle)
                this.pv.errorStyle = bb.merge(this.pv.errorStyle, o.errorStyle);
            return this.element;
        },
        on(ev, fn) {
            if (ev == 'focus' || ev == 'blur')
                this.editor.on(ev, fn);
            else
                bb.fn.view.on(ev, fn);
        },
        text(t) {
            if (t === undefined)
                return this.editor.getValue();
            else {
                var ed = this.editor;
                ed.setValue(t);
                bb.wait(0.01, function () {
                    ed.refresh();
                });
            }
        },
        error(line, message) {
            var msg = document.createElement("div");
            msg.appendChild(document.createTextNode(message));
            bb.style(msg, this.pv.errorStyle);
            this.pv.widgets.push(this.editor.addLineWidget(line - 1, msg, {
                coverGutter: false,
                noHScroll: true
            }));
        },
        clearErrors() {
            for (var i = 0; i < this.pv.widgets.length; i++)
                this.editor.removeLineWidget(this.pv.widgets[i]);
            this.pv.widgets = [];
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   Animations   ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fna.fadein = function (t) {
        this.element.style.opacity = Math.max(this.element.style.opacity, t);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fna.fadeout = function (t) {
        this.element.style.opacity = Math.min(this.element.style.opacity, 1.0 - t);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////   Behaviors   ///////////////////////////////////////////////////////////////////////// 
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.beh.scroll = function () {
        var self = this;
        var dy = 0;
        var pulse = false;
        var t = null;
        var lt = null;
        this.on('mousewheel', function (e) {
            dy += e.wheelDelta * 0.2 * 0.3;
            pulse = true;
        });
        this.on('touchstart', function (e) {
            if (e.touches.length == 1) {
                t = {
                    ty: e.touches[0].pageY,
                    sy: this.scroll().y
                };
                lt = t;
            }
            pulse = false;
        });
        this.on('touchmove', function (e) {
            if (e.touches.length == 1 && t) {
                e.preventDefault();
                self.scroll({
                    y: t.sy + e.touches[0].pageY - t.ty
                });
                dy = (e.touches[0].pageY - lt.pageY) * 7;
                lt = e.touches[0];
            }
        });
        this.on('touchend', function (e) {
            t = null;
            pulse = true;
        });
        bb.pulse(function () {
            dy *= 0.8;
            if (pulse)
                pulse = self.scroll({
                    dy: dy,
                    clip: 'soft'
                });
        });
        this.clip(true);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.beh.handscroll = function (param) {
        var self = this;
        var mm = null;
        var mp = null;

        this.pv.events.handscroll = [];

        function fq(x) {
            if (x < 0)
                return -Math.pow(-x, 0.8);
            else
                return Math.pow(x, 0.8);
        }

        function delta(cc) {
            if (cc === undefined)
                cc = self.contentSize();
            var ss = self.size();
            var mx = 0;
            var my = 0;
            if ('space' in param) {
                mx += param.space;
                my += param.space;
            }
            return {
                x: ss.width - cc.width - mx,
                y: ss.height - cc.height - my
            };
        }

        var reset = false;

        var move = function (e) {
            if (reset) {
                document.removeEventListener('mousemove', move);
                reset = false;
                return;
            }
            var d = delta();
            var m = self.mouse(e);
            var p = {
                x: mp.x + m.x - mm.x,
                y: mp.y + m.y - mm.y,
            };
            if (d.x < 0) {
                if (p.x > 0)
                    p.x = fq(p.x);
                else if (p.x < d.x)
                    p.x = fq(p.x - d.x) + d.x;
            } else {
                if (p.x > d.x)
                    p.x = fq(p.x - d.x) + d.x;
                else if (p.x < 0)
                    p.x = fq(p.x);
            }
            if (d.y < 0) {
                if (p.y > 0)
                    p.y = fq(p.y);
                else if (p.y < d.y)
                    p.y = fq(p.y - d.y) + d.y;
            } else {
                if (p.y > d.x)
                    p.y = fq(p.y - d.y) + d.y;
                else if (p.y < 0)
                    p.y = fq(p.y);
            }
            self.scroll(p);
        };

        this.on('mousedown', function (e) {
            if (e.button === 0) {
                bb.once(document, 'mouseup', function (e) {
                    document.removeEventListener('mousemove', move);
                    var d = delta();
                    var s = self.transform.scroll;
                    var p = bb.clone(s);
                    if (d.x < 0)
                        p.x = bb.range(d.x, p.x, 0);
                    else
                        p.x = bb.range(0, p.x, d.x);
                    if (d.y < 0)
                        p.y = bb.range(d.y, p.y, 0);
                    else
                        p.y = bb.range(0, p.y, d.y);
                    if (p.x != s.x || p.y != s.y)
                        self.animate(0.4, function (t) {
                            var v = signal(t).sin().value;
                            self.scroll({
                                x: (1.0 - v) * s.x + v * p.x,
                                y: (1.0 - v) * s.y + v * p.y
                            });
                        });

                    var nowm = self.mouse(e);
                    self.dispatch('handscroll', {
                        action: 'end',
                        delta: {
                            x: nowm.x - mm.x,
                            y: nowm.y - mm.y
                        },
                        mouse: nowm,
                        scroll: p
                    });
                });
                document.addEventListener('mousemove', move);
                mm = self.mouse(e);
                mp = bb.clone(self.transform.scroll);

                self.dispatch('handscroll', {
                    action: 'start',
                    mouse: mm,
                    scroll: mp
                });

            }
        });
        this.style({
            cursor: 'hand'
        });
        this.clip(true);
        this.scrollBounds = delta;
        this.handscroll = {
            reset() {
                reset = true;
            }
        };
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.beh.push = function (o) {
        this.beh.push = bb.merge({
            scale: {
                x: 0.8,
                y: 1.2
            },
            pushed: false,
            duration: 0.2
        }, o);
        let down = function () {
            this.capture(true);
            var p = this.beh.push;
            this.animate('clear');
            this.animate(p.duration, function (t) {
                var a = signal(t).sin().pow(0.2).value;
                this.scale((1 - a) + a * p.scale.x, (1 - a) + a * p.scale.y);
            });
            p.pushed = true;
        };
        let up = function () {
            var p = this.beh.push;
            if (p.pushed) {
                p.pushed = false;
                this.animate('clear');
                this.animate(p.duration, function (t) {
                    var a = signal(t).sin().pow(0.2).revers().value;
                    this.scale((1 - a) + a * p.scale.x, (1 - a) + a * p.scale.y);
                });
            }
            this.capture(false);
        };
        this.on('mousedown', function (e) {
            down.call(this);
        });
        this.on('mouseup', function (e) {
            up.call(this);
        });
        this.on('mouseout', function (e) {
            up.call(this);
        });
        this.on('touchstart', function (e) {
            down.call(this);
        });
        this.on('touchend', function (e) {
            up.call(this);
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.beh.plop = function () {
        this.beh.plop = {
            scale: {
                x: 1.04,
                y: 1.04
            },
            duration: 0.05
        };
        this.on('mouseenter', function (e) {
            var p = this.beh.plop;
            this.animate('clear');
            this.animate(p.duration, function (t) {
                var a = signal(t).bounce().sin().pow(0.1).value;
                this.scale((1 - a) + a * p.scale.x, (1 - a) + a * p.scale.y);
            });
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    function dolayout() {
        function through(e) {
            if (e.bb.needslayout()) {
                e.bb.needslayout(false);
                e.bb.dolayout();
            }
            e.bb.subviews().forEach(function (v) {
                through(v);
            });
        }
        bb.find('div.bb').each(function (e) {
            var n = 5;
            if (e.bb === undefined)
                return;
            while (e.bb.pv.checklayout) {
                e.bb.pv.checklayout = false;
                through(e);
                if (!--n) {
                    console.log('something wrong in layouts, try a breakpoint on view.size');
                    break;
                }
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.BeBox = function (v) {
        if (v.bb === undefined) {
            v.bb = bb.extend(bb.base, {
                pv: {
                    needslayout: true,
                    checklayout: true
                },
                element: v,
                layers: {
                    subviews: v
                },
                grid: {
                    cols: 12,
                    rows: 12,
                    margin: 0,
                    fixedMargin: 0,
                    horizontal: {
                        begin: true,
                        between: true,
                        end: true
                    },
                    vertical: {
                        begin: true,
                        between: true,
                        end: true
                    }
                },
                remove(view) {
                    this.needslayout(true);
                    view.bb.dispatch('remove');
                    this.element.removeChild(view);
                },
                size(x, y) {
                    var e = this.element;
                    if (x === undefined) {
                        if (e.clientWidth > 0)
                            return {
                                width: e.clientWidth,
                                height: e.clientHeight
                            };
                        else // why ??
                            return {
                                width: e.parentNode.clientWidth,
                                height: e.parentNode.clientHeight
                            };
                    }
                    var p = bb.point(x, y);
                    e.width.baseVal.value = p.x;
                    e.height.baseVal.value = p.y;
                },
                contentSize() {
                    return this.size();
                },
                dolayout() {
                    bb.fn.view.dolayout.call(this);
                },
                subviews() {
                    return bb.array(document.querySelectorAll('div#{0} > div.view'.format(this.id())));
                },
                needslayout(need) {
                    if (need === undefined)
                        return this.pv.needslayout;
                    this.pv.needslayout = need;
                    if (need)
                        this.pv.checklayout = true;
                },
                id(id) {
                    if (id === undefined)
                        return this.element.getAttribute('id');
                    else
                        return this.element.setAttribute('id', id);
                },
                addsubview(s, a) {
                    var v = s;
                    if (!bb.isDOM(s))
                        v = bb.create(s, a);
                    this.element.appendChild(v);
                    this.needslayout(true);
                    return v;
                },
                dragdrop(e) {
                    e.dataTransfer.dropEffect = 'none';
                    e.preventDefault();
                    return false;
                },
                frame() {
                    return bb.rect(this.size());
                }
            });
            if (!v.bb.id())
                v.bb.id(bb.id());
            v.style.width = '100%';
            v.style.height = '100%';
            v.bb.needslayout(true);
        }
        bb.addClass(v, 'bb');
    };

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.find('div.bb').each(function (v) {
        bb.BeBox(v);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.on(window, 'resize', function () {
        bb.find('div.bb').bb('needslayout', true);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.ready(function () {
        bb.find('div.bb').bb('needslayout', true);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //  drag'n drop // http://developer.mozilla.org/en-US/docs/Web/Reference/Events/dragstart //

    function dispatchDragDrop(e) {
        var g = bb.closest(e.target, 'div.view,div.bb,g');
        try {
            if (g && ('bb' in g) && g.bb.dragdrop.call(g.bb, e)) {
                e.preventDefault();
                return true;
            }
        } catch (ex) {
            e.preventDefault();
            console.log(ex);
        }
        return false;
    }

    // drag target /////////////////////////////////////////////////////////////////////////////

    document.addEventListener('dragstart', function (e) {
        return dispatchDragDrop(e);
    }, false);

    document.addEventListener('drag', function (e) {
        return dispatchDragDrop(e);
    }, false);

    document.addEventListener('dragend', function (e) {
        return dispatchDragDrop(e);
    }, false);

    // drop target /////////////////////////////////////////////////////////////////////////////

    document.addEventListener('dragenter', function (e) {
        return dispatchDragDrop(e);
    }, false);

    document.addEventListener('dragover', function (e) {
        return dispatchDragDrop(e);
    }, false);

    document.addEventListener('dragleave', function (e) {
        return dispatchDragDrop(e);
    }, false);

    document.addEventListener('drop', function (e) {
        return dispatchDragDrop(e);
    }, false);

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // keyboard ////////////////////////////////////////////////////////////////////////////////

    function dispatchKeyboard(e) { // emit 'key' event (internal bb event) 
        var k = (e.keyCode || e.which);
        if (e.keyCode !== 8 && e.keyCode !== 46) {
            if (e.type === 'keydown') {
                if (!_keystates[k]) {
                    _keystates[k] = true;
                    if (_focused !== null)
                        _focused.bb.dispatch('key', {
                            type: 'keypress',
                            keyCode: e.keyCode,
                            char: e.key
                        });
                }
            } else if (e.type === 'keyup') {
                if (_keystates[k]) {
                    _keystates[k] = false;
                    if (_focused !== null)
                        _focused.bb.dispatch('key', {
                            type: 'keyup',
                            keyCode: e.keyCode,
                            char: e.key
                        });
                }
            } else if (_focused !== null)
                _focused.bb.dispatch('key', {
                    type: 'repeat',
                    keyCode: e.keyCode,
                    char: e.key
                });
        } else {
            var block = true;
            var d = e.srcElement || e.target;
            var n = d.tagName.toUpperCase();
            if (n === 'INPUT') {
                var t = d.type.toUpperCase();
                block = (t === 'TEXT' || t === 'PASSWORD' || t === 'FILE' || t === 'EMAIL' || t === 'SEARCH' || t === 'DATE') ? (d.readOnly || d.disabled) : true;
            } else if (n === 'TEXTAREA')
                block = d.readOnly || d.disabled;
            if (block) {
                e.preventDefault();
                if (_focused !== null && e.type === 'keydown') {
                    _focused.bb.dispatch('key', e);
                    if (_focused)
                        _focused.bb.dispatch('key', {
                            type: 'keypress',
                            keyCode: e.keyCode,
                            char: e.key
                        });
                    if (_focused)
                        _focused.bb.dispatch('key', {
                            type: 'keyup',
                            keyCode: e.keyCode,
                            char: e.key
                        });
                }
            }
        }
    }

    document.addEventListener('keydown', function (e) {
        dispatchKeyboard(e);
    }, false);

    document.addEventListener('keypress', function (e) {
        dispatchKeyboard(e);
    }, false);

    document.addEventListener('keyup', function (e) {
        dispatchKeyboard(e);
    }, false);

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // mouse ///////////////////////////////////////////////////////////////////////////////////

    document.addEventListener('mousemove', function (e) {
        _mouse = {
            x: e.clientX,
            y: e.clientY
        };
    }, false);

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

})();

/*

TODO:

- orientation: screen.orientation  and screen.addEventListener("orientationchange"...
    maybe try force landscape: transform rotate (-90) on the main div.bb

- retina: window.devicePixelRatio

*/

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////// aestesis.net ////
////////////////////////////////////////////////////////////////////////////////////////////////