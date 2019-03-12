////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////             /////////////////////////////////////////
////  copyright aestesis.net R.JEGOUZO  \\  bb.ext.js  \\            html5 ui (ext)         ////
//////////////////////////////////////////   v1.1.07   /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/*jshint white: true, curly: false, loopfunc: true, esnext: true */
// license Apache 2.0
////////////////////////////////////////////////////////////////////////////////////////////////
////   namespace   /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
(function() {
    "use strict";
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    var _popup = null;

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.cell = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.cell.super.create.call(this, o);
            this.type.push('cell');
            this.addClass('cell');
            if (Array.isArray(o.label)) {
                self.labels = [];
                var a = o.label;
                var c = 0;
                a.forEach(function(ld) {
                    var l = self.addsubview('text', {
                        text: ld.text,
                        layout: {
                            placement: {
                                x: c,
                                y: 0,
                                cols: ld.cols,
                                rows: 12
                            },
                            align: bb.align.VFILL
                        },
                        align: (ld.align !== undefined) ? ld.align : bb.align.CENTERLEFT,
                        width: 1024
                    });
                    bb.style(l.bb.pv.margin, {
                        'width': '98%',
                        'margin-left': '1%',
                        'margin-right': '1%'
                    });
                    self.labels.push(l);
                    c += ld.cols;
                });
            } else {
                this.pv.label = this.addsubview('text', {
                    text: (o.label !== undefined) ? o.label : '',
                    layout: {
                        align: bb.align.VFILL
                    },
                    align: (o.align !== undefined) ? o.align : bb.align.CENTERLEFT,
                    width: 1024
                });
                bb.style(this.pv.label.bb.pv.margin, {
                    'width': '98%',
                    'margin-left': '1%',
                    'margin-right': '1%'
                });
            }
            if (o.icons !== undefined) {
                var el = this.addsubview('text', {
                    text: '',
                    layout: {
                        align: bb.align.FILL
                    },
                    align: (o.icons.align !== undefined) ? o.icons.align : bb.align.BOTTOMCENTER
                });
                bb.each(o.icons.i, function(ic, i) {
                    var ni = el.bb.appendHTML('i', {
                        'id': ic.id,
                        'class': ic.icon,
                        'title': ic.title
                    });
                    if (ic.click)
                        bb.on(ni, 'click', function(ev) {
                            ic.click.apply(self.element, arguments);
                            ev.cancelBubble = true;
                        });
                });
                this.pv.icons = el;
            }
            if (o.select)
                self.on('click', function() {
                    o.select(self.element);
                });
            if (o.remove)
                self.on('remove', function() {
                    o.remove(self.element);
                });
            return this.element;
        },
        label(t) {
            return this.pv.label.bb.text(t);
        },
        update(o) {
            if (o.label)
                this.label(o.label);
        },
        removeIcons() {
            if (this.pv.icons) {
                this.pv.icons.bb.remove();
                delete this.pv.icons;
            }
        },
        removeIcon(id) {
            if (this.pv.icons) {
                var i = this.pv.icons.querySelector('#'+id);
                if(i) 
                    i.remove();
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.folder = bb.bb(bb.fn.stack, {
        create(o) {
            var self = this;
            this.pv.folded = true;
            this.pv.cells = {};
            bb.fn.folder.super.create.call(this, o);
            this.type.push('folder');
            this.addClass('folder folded');
            var c = bb.clone(o);
            c.id = o.id + '_header';
            this.pv.header = this.addsubview('cell', c);
            this.pv.header.bb.addClass('header00');
            this.pv.stack = this.addsubview('stack');
            this.pv.stack.bb.pv.resizeToContent = true;
            bb.each(o.cells, function(e, i) {
                self.append(e);
            });
            this.clip(true);
            if (o.instance)
                o.instance(this.element, this.pv.header);
            this.pv.stack.bb.on('size', function(sz) {
                if (!self.pv.folded && !self.pv.animating) {
                    self.pv.folded = true;
                    self.fold(false);
                } else if (!self.pv.folded)
                    self.pv.ns = self.contentSize();
            });
            this.pv.animating = false;
            return this.element;
        },
        fold(fold) {
            if (fold === undefined)
                return this.pv.folded;
            if (this.pv.folded != fold && this.pv.stack.bb.subviews().length > 0) {
                var os = this.size();
                this.pv.ns = fold ? (this.pv.header.bb.size()) : (this.contentSize());
                this.pv.folded = fold;
                this.pv.animating = true;
                this.animate(0.2, function(t) {
                    var ns = this.pv.ns;
                    var v = signal(t).sin().value;
                    var iv = 1 - v;
                    var w = os.width * iv + ns.width * v;
                    var h = os.height * iv + ns.height * v;
                    this.size({
                        width: w,
                        height: h
                    });
                }, function() {
                    this.pv.animating = false;
                });
                this.removeClass('folded');
                this.addClass('unfolded');
            }
        },
        append(e, unfold) {
            var el = this.pv.stack.bb.addsubview('cell', e);
            if (e.instance)
                e.instance(el, el.bb.pv.header);
            if (unfold)
                this.fold(false);
            return el;
        },
        update(o) {
            var self = this;
            this.pv.header.bb.label(o.label);
            var cells = {};
            o.cells.forEach(function(c) {
                if (c.id in window)
                    window[c.id].bb.update(c);
                else
                    self.append(c);
                cells[c.id] = c;
            });
            this.pv.stack.bb.subviews().forEach(function(v) {
                var id = v.bb.id();
                if (!(id in cells))
                    v.bb.remove();
            });
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.button = bb.bb(bb.fn.view, {
        create(o) {
            var self = this;
            bb.fn.cell.super.create.call(this, o);
            this.type.push('button');
            this.addClass('button');
            var pIcon = {
                x: 0,
                y: 0,
                cols: 12,
                rows: o.label ? 10 : 12
            };
            var pLabel = {
                x: 0,
                y: 10,
                cols: 12,
                rows: 2
            };
            var tscale = 0.99;
            var iscale = 'auto';
            var talign = bb.align.FILL;
            if (o.mode == 'horizontal') {
                pIcon = {
                    x: 0,
                    y: 0,
                    cols: o.label ? 3 : 12,
                    rows: 12
                };
                pLabel = {
                    x: 3,
                    y: 0,
                    cols: 9,
                    rows: 12
                };
                tscale = 0.5;
                iscale = 0.7;
                talign = bb.align.CENTERLEFT;
            } else if (o.mode == 'icon') {
                pIcon = pLabel = {
                    x: 0,
                    y: 0,
                    cols: 12,
                    rows: 12
                };
                iscale = 0.7;
            }
            this.pv.label = this.addsubview('text', {
                text: (o.label !== undefined) ? o.label : '',
                layout: {
                    placement: pLabel,
                    align: bb.align.FILL
                },
                align: talign,
                size: tscale,
                needsMargin: true
            });
            bb.style(this.pv.label.bb.pv.margin, {
                'width': '98%',
                'margin-left': '1%',
                'margin-right': '1%'
            });
            if (o.icon !== undefined) {
                var el = this.pv.icon = this.addsubview('text', {
                    text: '',
                    layout: {
                        placement: pIcon,
                        align: bb.align.FILL
                    },
                    align: bb.align.CENTER,
                    size: iscale
                });
                var ni = bb.appendHTML(el.bb.pv.text, 'i', {
                    'class': o.icon,
                    'title': o.title
                });
            }
            return this.element;
        },
        label(t) {
            return this.pv.label.bb.text(t);
        },
        image(url) {
            return this.pv.image.bb.source(url);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.popup = bb.bb(bb.fn.view, {
        create(o) {
            if (_popup)
                _popup.close();
            _popup = this;
            this.pv.events.display = [];
            this.pv.events.close = [];
            var self = this;
            var ebb = bb.isBB(o.spot) ? o.spot : null;
            var spot = ebb ? ebb.bb.absolute() : o.spot;
            var anim = function() {
                ebb.bb.scale(bb.key(6.856565, 15.6516571, 8.178617618, 13.546646));
            };
            if (ebb) {
                ebb.bb.addClass('selected');
                bb.pulse(anim);
            }
            var sz = bb.size(o);
            bb.fn.popup.super.create.call(this, o);
            this.pv.animation = o.animation ? o.animation : 'popup';
            this.type.push('popup');
            this.addClass('popup');
            this.on('click', function(e) {
                e.stopPropagation();
            });
            bb.once(document, 'click', function(e) {
                self.close();
            });
            var pos = function(sz) {
                var doc = bb.rect(document.body.clientWidth, document.body.clientHeight);
                var dc = doc.point(0.5, 0.5);
                var sc = spot ? spot.point(0.5, 0.5) : dc;
                var p = bb.point();
                if (sc.x > dc.x)
                    p.x = Math.max(spot.x + spot.width - sz.width, 0);
                else
                    p.x = Math.min(spot.x, doc.width - sz.width);
                if (sc.y > dc.y) {
                    p.y = spot.y - sz.height;
                    if (p.y < 0) {
                        p.y = 0;
                        if (sc.x > dc.x)
                            p.x = Math.max(spot.x - sz.width, 0);
                        else
                            p.x = Math.min(spot.x + spot.width, doc.width - sz.width);
                    }
                } else {
                    var max = doc.height - sz.height;
                    p.y = spot.y + spot.height;
                    if (p.y > max) {
                        p.y = max;
                        if (sc.x > dc.x)
                            p.x = Math.max(spot.x - sz.width, 0);
                        else
                            p.x = Math.min(spot.x + spot.width, doc.width - sz.width);
                    }
                }
                return p;
            };
            var rd = bb.rect(pos(sz), sz);
            var rs = bb.rect(bb.mousePosition(), bb.size(2, 2)); // animation= 'popup'
            if (this.pv.animation == 'vertical') {
                rs = bb.clone(rd);
                rs.height = 2;
            }
            self.layers.subviews.style.opacity = 0;
            this.animate(0.28, function(t) {
                var s = signal(t).sin();
                var r = bb.lerp(rs, rd, s.value);
                self.frame(r);
                self.needslayout(true);
                self.layers.subviews.style.opacity = s.range(0.1, 0.2).sin().value;
                self.needslayout(true);
            }, function() {
                self.dispatch('display');
            });
            this.once('close', function() {
                if (_popup == self)
                    _popup = null;
                this.animate(0.28, function(t) {
                        var s = signal(t).revers().sin();
                        var r = bb.lerp(rs, rd, s.value);
                        self.frame(r);
                        self.needslayout(true);
                        self.layers.subviews.style.opacity = s.range(0.0, 0.1).sin().value;
                    },
                    function() {
                        self.remove();
                        if (ebb) {
                            ebb.bb.removeClass('selected');
                            bb.unpulse(anim);
                            var s = ebb.bb.scale();
                            var d = bb.point(1, 1);
                            ebb.bb.animate(0.1, function(t) {
                                ebb.bb.scale(bb.lerp(s, d, t));
                            });
                        }
                    });
            });
            return this.element;
        },
        close() {
            this.dispatch('close');
        }
    });

    bb.on(window, 'resize', function() {
        if (_popup)
            _popup.close();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.alert = bb.bb(bb.fn.popup, {
        create(o) {
            var self = this;
            if (!o.width)
                o.width = 384;
            if (!o.height)
                o.height = 192;
            bb.fn.alert.super.create.call(this, o);
            this.type.push('alert');
            this.addClass('popupalert');
            this.grid.fixedMargin = 8;
            var label = this.addsubview('text', {
                text: (o.label !== undefined) ? o.label : '',
                layout: {
                    placement: {
                        x: 0,
                        y: 0,
                        cols: 12,
                        rows: 6
                    },
                    align: bb.align.FILL
                },
                align: bb.align.FILL,
                size: 0.20,
                class: 'title',
                needsMargin: true
            });
            bb.style(label.bb.pv.margin, {
                'width': '98%',
                'margin-left': '1%',
                'margin-right': '1%'
            });
            var bbar = this.addsubview('view', {
                layout: {
                    placement: {
                        x: 0,
                        y: 6,
                        cols: 12,
                        rows: 6
                    },
                    align: bb.align.FILL
                }
            });
            bbar.bb.grid.cols = o.buttons.length;
            bbar.bb.grid.rows = 1;
            bbar.bb.dolayout = function() {
                return bb.fn.view.dolayout.call(this);
            };
            o.buttons.forEach(function(b, x) {
                var but = bbar.bb.addsubview('button', {
                    layout: {
                        placement: {
                            x: x,
                            y: 0,
                            cols: 1,
                            rows: 1
                        },
                        align: bb.align.FILL
                    },
                    label: b.label,
                    icon: b.icon
                });
                but.bb.on('click', function() {
                    if (b.click)
                        b.click.apply(self, arguments);
                    self.close();
                });
                var key = bb.point(1, 1);
                but.bb.animate('mouse', function() {
                    key = bb.lerp(key, bb.key(14.1615651, 7.165561, 11.165615, 5.1516571), 0.8);
                });
                but.bb.pulse(function() {
                    but.bb.scale(key);
                    key = bb.lerp(key, bb.point(1, 1), 0.15);
                });
            });
            bb.wait(0, function() {
                self.needslayout(true);
            });
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.menu = bb.bb(bb.fn.popup, {
        create(o) {
            var self = this;
            if (!o.width)
                o.width = 320;
            var scroll = (o.items.length > 10);
            o.height = Math.min(o.items.length, 10) * 48;
            bb.fn.menu.super.create.call(this, o);
            this.type.push('menu');
            this.addClass('popupmenu');
            var stack = this.addsubview('view', {
                width: o.width,
                height: o.items.length * 48
            });
            stack.bb.grid.fixedMargin = 8;
            stack.bb.grid.cols = 1;
            stack.bb.grid.rows = o.items.length;
            o.items.forEach(function(b, i) {
                var but = stack.bb.addsubview('button', {
                    layout: {
                        placement: {
                            x: 0,
                            y: i,
                            cols: 1,
                            rows: 1
                        },
                        align: bb.align.FILL
                    },
                    label: b.label,
                    icon: b.icon,
                    mode: 'horizontal'
                });
                but.bb.on('click', function() {
                    if (b.click)
                        b.click.apply(self, arguments);
                    if (o.select)
                        o.select.call(self, {
                            item: b,
                            indice: i
                        });
                    self.close();
                });
            });
            this.needslayout(true);
            if (scroll) {
                this.use('scroll');
                this.pv.contentSize = 'subviews';
                this.on('size', function(s) {
                    stack.bb.size(s.width, o.items.length * s.height / 10);
                });
            } else {
                this.on('size', function(s) {
                    stack.bb.size(s);
                });
            }
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.slider = bb.bb(bb.fn.view, {
        create(o) {
            bb.fn.slider.super.create.call(this, o);
            this.type.push('slider');
            this.grid.fixedMargin = 4;
            this.pv.events.change = [];
            var self = this;
            var value = this.pv.value = ('value' in o) ? o.value : 0.5;
            var label = this.addsubview('text', {
                text: o.label,
                layout: {
                    placement: {
                        x: 0,
                        y: 0,
                        cols: 4,
                        rows: 12
                    },
                    align: bb.align.FILL
                },
                align: bb.align.CENTERRIGHT,
                size: 0.6
            });
            var disp = this.pv.disp = o.display ? o.display : function(val) {
                return Math.round(val * 100) / 100;
            };
            var display = this.pv.display = this.addsubview('text', {
                text: disp(value),
                layout: {
                    placement: {
                        x: 10,
                        y: 0,
                        cols: 2,
                        rows: 12
                    },
                    align: bb.align.FILL
                },
                align: bb.align.CENTER,
                size: 0.5
            });
            var vg = this.pv.vg = this.addsubview('vg', {
                layout: {
                    placement: {
                        x: 4,
                        y: 0,
                        cols: 6,
                        rows: 12
                    },
                    align: bb.align.FILL
                }
            });
            var seg = vg.bb.rect({
                rx: 2,
                ry: 2,
                fill: '#606060',
                stroke: '#202020',
                'stroke-width': 1
            });
            var cursor = vg.bb.rect({
                rx: 2,
                ry: 2,
                fill: '#C0C0C0',
                stroke: '#202020',
                'stroke-width': 1
            });
            this.on('change', function(v) {
                var sz = vg.bb.size();
                cursor.bb.frame({
                    x: self.pv.value * 0.95 * sz.width,
                    y: 0.1,
                    width: sz.width * 0.05,
                    height: sz.height * 0.9
                });
            });
            vg.bb.on('size', function(sz) {
                seg.bb.frame({
                    x: 0,
                    y: sz.height * 0.45,
                    width: sz.width,
                    height: sz.height * 0.1
                });
                self.dispatch('change', self.pv.value);
            });

            function update(e) {
                var ref = vg.bb.absolute();
                var v = (e.clientX - ref.x) / ref.width;
                self.value(v);
            }
            vg.bb.on('mousedown', function(e) {
                bb.capture(e, function(e) {
                    update(e);
                }, function() {});
                update(e);
            });
            return this.element;
        },
        value(v) {
            if (v === undefined)
                return this.pv.value;
            this.pv.value = bb.range(0, v, 1);
            this.pv.display.bb.text(this.pv.disp(this.pv.value));
            this.dispatch('change', this.pv.value);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////

    bb.fn.select = bb.bb(bb.fn.view, {
        create(o) {
            bb.fn.select.super.create.call(this, o);
            this.type.push('select');
            this.grid.fixedMargin = 4;
            this.pv.events.change = [];
            var self = this;
            var dir = o.direction ? o.direction : 'horizontal';
            var values = o.values ? o.values : [];
            var selected = null;
            var selcell = function(c) {
                if (selected)
                    selected.bb.removeClass('selected');
                selected = c;
                c.bb.addClass('selected');
                self.dispatch('change', c.bb.value);
                return c;
            };
            var cell = function(text, layout)  {
                var c = self.addsubview('text', {
                    text: text,
                    layout: layout,
                    align: bb.align.CENTER,
                    size: 0.5,
                    class: 'selectcell'
                });
                c.bb.value = text;
                c.bb.on('click', function() {
                    selcell(c);
                });
                return c;
            };
            if (dir == 'horizontal') {
                this.grid.rows = 1;
                this.grid.cols = values.length;
                for (var x = 0; x < values.length; x++)
                    cell(values[x], {
                        placement: {
                            x: x,
                            y: 0,
                            cols: 1,
                            rows: 1
                        },
                        align: bb.align.FILL
                    });
            } else {
                this.gris.rows = values.length;
                this.grid.cols = 1;
                for (var y = 0; y < values.length; y++)
                    cell(values[y], {
                        placement: {
                            x: 0,
                            y: y,
                            cols: 1,
                            rows: 1
                        },
                        align: bb.align.FILL
                    });
            }
            this.select = function(value) {
                if (value === undefined)
                    return selected ? selected.bb.value : undefined;
                if (selected && selected.bb.value == value)
                    return;
                return bb.each(self.subviews(), function(c) {
                    if (c.bb.value == value)
                        return selcell(c);
                });
            };
            this.cell = function(value) {
                return bb.each(self.subviews(), function(c) {
                    if (c.bb.value == value)
                        return c;
                });
            };
            return this.element;
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

})();