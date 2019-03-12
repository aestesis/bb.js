//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bb.bs.extension.js  // code: renan jegouzo  // version 1.1.07
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*jshint white: true, curly: false, loopfunc: true, esnext: true */

// license Apache 2.0

(function () {
	"use strict";
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	bb.bsfn.leftsidebar = function (o) {
		this.commands = App.leftSidebarInit();
		this.append = function (template, el) {
			this.element.querySelector('.sidebar-elements').appendChild(el);
		};
		this.clear = function () {
			let content = this.element.querySelector('.sidebar-elements');
			while (content.firstChild)
				content.removeChild(content.firstChild);
		};
	};
	bb.bsfn.menucategory = function (o) {
		if (o.label)
			this.element.innerHTML = o.label;
	};
	bb.bsfn.menufolder = function (o) {
		if (o.icon)
			this.element.querySelector('i').attributes.class.nodeValue += " " + o.icon;
		if (o.label)
			this.element.querySelector('span').innerHTML = o.label;
		this.append = function (template, el, o) {
			this.element.querySelector('.sub-menu').appendChild(el);
		};
	};
	bb.bsfn.menuitem = function (o) {
		if (o.icon)
			this.element.querySelector('i').attributes.class.nodeValue += " " + o.icon;
		if (o.label)
			this.element.querySelector('span').innerHTML = o.label;
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	function Validation() {
		this.errors = [];
		this.appendError = function (template, el, o) {
			o.target.parentNode.insertBefore(el, o.target.nextSibling);
		};
		this.append = function (template, el, o) {
			this.appendError.apply(this, arguments);
		};
		this.clear = function () {
			this.errors.forEach(function (e) {
				e.bb.remove();
			});
			this.errors = [];
		};
		this.error = function (element, error) {
			this.errors.push(bb.bscreate(this.element, 'fielderror', {
				target: element,
				error: error
			}));
		};
	}
	bb.bsfn.fielderror = function (o) {
		if (o.error)
			this.element.querySelector('li').innerHTML = o.error;
	};
	bb.bsfn.login = function (o) {
		Validation.call(this);
		var self = this;
		this.pv.events.submit = [];
		this.pv.events.forgot = [];
		this.pv.events.signup = [];
		bb.on(this.element.querySelector('button'), 'click', function (e) {
			e.preventDefault();
			self.dispatch('submit', {
				username: username.value,
				password: password.value
			});
		});
		bb.on(this.element.querySelector('.forgotpassword'), 'click', function (e) {
			e.preventDefault();
			self.dispatch('forgot');
		});
		bb.on(this.element.querySelector('.signup'), 'click', function (e) {
			e.preventDefault();
			self.dispatch('signup');
		});
	};
	bb.bsfn.signup = function (o) {
		Validation.call(this);
		var self = this;
		this.pv.events.submit = [];
		bb.on(this.element.querySelector('button'), 'click', function (e) {
			e.preventDefault();
			self.dispatch('submit', {
				username: username.value.trim(),
				email: email.value.trim(),
				pass1: pass1.value.trim(),
				pass2: pass2.value.trim(),
				agree: agree.checked
			});
		});
	};
	bb.bsfn.forgotpassword = function (o) {
		Validation.call(this);
		var self = this;
		this.pv.events.submit = [];
		bb.on(this.element.querySelector('button'), 'click', function (e) {
			e.preventDefault();
			self.dispatch('submit', {
				email: email.value.trim(),
			});
		});
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	bb.bsfn.content = function (o) {
		var self = this;
		this.append = function (template, el) {
			if (template == 'header')
				self.element.insertBefore(el, self.element.querySelector('.main-content'));
			else
				self.element.querySelector('.main-content').appendChild(el);
		};
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	bb.bsfn.header = function (o) {
		if (o.title)
			this.element.querySelector('h2').innerHTML = o.title;
		if (o.description)
			this.element.querySelector('p').innerHTML = o.description;
	};
	bb.bsfn.col = function (o) {
		this.append = function (template, el, o) {
			this.element.querySelector('.col1').appendChild(el);
		};
	};
	bb.bsfn.cols2 = function (o) {
		this.append = function (template, el, o) {
			let col = 'col1';
			if (o.col)
				col = 'col' + o.col;
			this.element.querySelector('.' + col).appendChild(el);
		};
	};
	bb.bsfn.cols3 = function (o) {
		this.append = function (template, el, o) {
			let col = 'col1';
			if (o.col)
				col = 'col' + col;
			this.element.querySelector('.' + col).appendChild(el);
		};
	};
	bb.bsfn.card = function (o) {
		Validation.call(this);
		var appendError = this.append;
		this.append = function (template, el, o) {
			this.element.querySelector('.card-body').appendChild(el);
		};
		if (o.title)
			this.element.querySelector('.card-header').childNodes[0].nodeValue = o.title;
		if (o.description)
			this.element.querySelector('.card-subtitle').innerHTML = o.description;
	};
	bb.bsfn.text = function (o) {
		if (o.text)
			this.element.innerHTML = o.text;
	};
	bb.bsfn.quote = function (o) {
		if (o.text)
			this.element.querySelector('p').innerHTML = o.text;
		if (o.footer)
			this.element.querySelector('footer').innerHTML = o.footer;
	};
	bb.bsfn.treeview = function (o) {
		// https://github.com/atatanasov/gijgo
		// doc: https://gijgo.com/tree
		let self = this;
		this.pv.events.select = [];
		this.pv.events.unselect = [];
		this.pv.events.collapse = [];
		this.pv.events.expand = [];
		if (o.class)
			this.addClass(o.class);
		let tv = $(this.element).tree({
			uiLibrary: 'bootstrap4',
			autoGenFieldName: 'id',
			dataSource: o.data
		});
		this.add = function (parent, node) {
			if (typeof parent == 'string')
				parent = tv.getNodeById(parent);
			tv.addNode(node, parent);
		};
		this.del = function (node) {
			if (typeof node == 'string')
				node = tv.getNodeById(node);
			tv.removeNode(node);
		};
		this.text = function (id, text) {
			let r = tv.getDataById(id);
			if (text === undefined)
				return r.text;
			r.text = text;
			tv.updateNode(id, r);
		};
		this.data = function (id, data) {
			let r = tv.getDataById(id);
			if (data === undefined)
				return r.data;
			bb.extend(r.data, data);
			tv.updateNode(id, r);
		};
		this.getNodes = function () {
			return tv.getAll();
		};
		this.search = function (text) {
			if (text === undefined || text === null || text.length == 0)
				return;
			text = bb.normalize(text);
			let nodes = tv.getAll();
			let selected = tv.getSelections();
			if (selected.length) {
				selected = selected[0];
				self.unselect(selected);
			} else
				selected = null;
			let hasSelected = selected;
			let parse = function (nodes) {
				return nodes.every(function (n) {
					if (selected) {
						if (n.id == selected)
							selected = null;
					} else if (bb.normalize(n.text).contains(text)) {
						self.select(n);
						self.expandTo(n);
						self.scrollTo(n);
						return false;
					}
					if (n.children)
						return parse(n.children);
					return true;
				});
			};
			if (parse(nodes) && hasSelected)
				parse(nodes); // restart from beginning
		};
		this.select = function (node) {
			if (typeof node == 'object')
				node = node.id;
			tv.select(tv.getNodeById(node));
		};
		this.unselect = function (node) {
			if (typeof node == 'object')
				node = node.id;
			tv.unselect(tv.getNodeById(node));
		};
		this.expandTo = function (node) {
			if (typeof node == 'object')
				node = node.id;
			self.getParents(node).forEach(function (id) {
				tv.expand(tv.getNodeById(id));
			});
		};
		this.expand = function (node) {
			if (typeof node == 'object')
				node = node.id;
			tv.expand(tv.getNodeById(node));
		};
		this.collapse = function (node) {
			if (typeof node == 'object')
				node = node.id;
			tv.collapse(tv.getNodeById(node));
		};
		this.scrollTo = function (node) {
			if (typeof node == 'object')
				node = node.id;
			node = tv.getNodeById(node);
			this.element.scrollTop = bb.offset(this.element, node[0]).y;
		};
		this.getParents = function (node) {
			if (typeof node == 'object')
				node = node.id;
			let parents = [];
			let nodes = self.getNodes();
			let parse = function (nodes) {
				return nodes.every(function (n) {
					if (n.id == node)
						return false;
					if (n.children && !parse(n.children)) {
						parents.push(n.id);
						return false;
					}
					return true;
				});
			};
			parse(nodes);
			return parents;
		};
		this.getChildren = function (node, cascade) {
			if (cascade == undefined)
				cascade = true;
			if (typeof node == 'object')
				node = node.id;
			return tv.getChildren(tv.getNodeById(node), cascade);
		};
		this.getSelections = function () {
			return tv.getSelections();
		};
		tv.on('select', function (event, node, id) {
			self.dispatch('select', id);
		});
		tv.on('unselect', function (event, node, id) {
			self.dispatch('unselect', id);
		});
		tv.on('collapse', function (event, node, id) {
			self.dispatch('collapse', id);
			self.getSelections(id).forEach(function (nid) { // unselect collapsed children
				self.getParents(nid).forEach(function (i) {
					if (id == i)
						self.unselect(nid);
				});
			});
		});
		tv.on('expand', function (event, node, id) {
			self.dispatch('expand', id);
		});
	};
	bb.bsfn.form = function (o) {
		Validation.call(this);
		var appendError = this.append;
		this.append = function (template, el, o) {
			if (template == 'fielderror')
				this.appendError.apply(this, arguments);
			else
				this.element.querySelector('form').appendChild(el);
		};
		if (o.title)
			this.element.querySelector('.card-header').childNodes[0].nodeValue = o.title;
		if (o.description)
			this.element.querySelector('.card-subtitle').innerHTML = o.description;
	};
	bb.bsfn.divider = function (o) {
		if (o.title)
			this.element.childNodes[0].nodeValue = o.title;
		if (o.description)
			this.element.querySelector('span').innerHTML = o.description;
	};
	bb.bsfn.fieldimage = function (o) {
		let dbsrv = App.bb.db + 'image/';
		let id = o.id || bb.id();
		let value = null;
		let label = this.element.querySelector('label');
		let image = this.element.querySelector('img');
		label.for = id;
		image.id = id;
		if (o.label)
			label.innerHTML = o.label;
		if (o.value) {
			image.src = dbsrv + o.value + '/128';
			value = o.value;
		}
		bb.extend(this, {
			label(l) {
				if (l)
					label.innerHTML = l;
				else
					return label.innerHTML;
			},
			value(v) {
				return value;
			},
			field() {
				return image;
			}
		});
		var self = this;
		this.upload = function (f) {
			let loading = self.element.querySelector('.be-loading');
			let idi = bb.id();
			bb.post(dbsrv + idi + '?crop=true', {
				image: f
			}, function (r) {
				value = idi;
				bb.wait(0.5, function () {
					image.src = dbsrv + idi + '/128';
					bb.removeClass(loading, 'be-loading-active');
				});
			});
			bb.addClass(loading, 'be-loading-active');
		};
		this.dragdrop = function (e) {
			var t = e.type;
			if (t == 'dragenter' || t == 'dragover') {
				e.dataTransfer.dropEffect = 'copy';
				return true;
			} else if (t == 'drop') {
				if (e.dataTransfer.files.length > 0) {
					self.upload(e.dataTransfer.files[0]);
				} else {
					console.log('strange drop image');
				}
				return true;
			}
			return false;
		};
		this.on('click', function (e) {
			var file = bb.HTML('input', {
				type: 'file',
				multiple: false,
				accept: '.jpeg,.jpg,.png'
			});
			bb.on(file, 'change', function (e) {
				if (file.files.length > 0) {
					self.upload(file.files[0]);
				}
			});
			file.click();
		});
	};
	bb.bsfn.fieldselect = function (o) {
		let self = this;
		this.pv.events.change = [];
		let id = o.id || bb.id();
		let label = this.element.querySelector('label');
		let select = this.element.querySelector('select');
		label.for = id;
		select.id = id;
		if (o.select) {
			o.select.forEach(function (s) {
				let option = bb.appendHTML(select, 'option');
				option.innerHTML = s;
			});
		}
		bb.on(select, 'change', function (e) {
			self.dispatch('change', self.value());
		});
		bb.extend(this, {
			label(l) {
				if (l)
					label.innerHTML = l;
				else
					return label.innerHTML;
			},
			value(v) {
				if (v)
					for (let i = 0; i < select.options.length; i++) {
						if (select.options[i].text == v) {
							select.selectedIndex = i;
							break;
						}
					}
				else
					return select.options[select.selectedIndex].text;
			},
			field() {
				return select;
			},
			readOnly(v) {
				if (v === undefined)
					return select.disabled;
				select.disabled = v;
			}
		});
		if (o.label)
			this.label(o.label);
		if (o.value)
			this.value(o.value);
	};
	bb.bsfn.fieldtextarea = function (o) {
		let id = o.id || bb.id();
		let label = this.element.querySelector('label');
		let input = this.element.querySelector('textarea');
		label.for = id;
		input.id = id;
		if (o.label)
			label.innerHTML = o.label;
		if (o.value)
			input.value = o.value;
		if (o.placeholder)
			input.placeholder = o.placeholder;
		bb.extend(this, {
			label(l) {
				if (l)
					label.innerHTML = l;
				else
					return label.innerHTML;
			},
			value(v) {
				if (v)
					input.value = v;
				else
					return input.value;
			},
			placeholder(ph) {
				if (ph)
					input.placeholder = ph;
				else
					return input.placeholder;
			},
			field() {
				return input;
			}
		});
	};
	bb.bsfn.fieldtext = function (o) {
		let self = this;
		this.pv.events.change = [];
		this.pv.events.keypress = [];
		let id = o.id || bb.id();
		let label = this.element.querySelector('label');
		let input = this.element.querySelector('input');
		label.for = id;
		input.id = id;
		if (o.label)
			label.innerHTML = o.label;
		if (o.value)
			input.value = o.value;
		if (o.placeholder)
			input.placeholder = o.placeholder;
		if (o.format == 'date' || o.format == 'email' || o.format == 'number') {
			input.type = o.format;
		} else if (o.format == 'currency') {
			// TODO:
		} else if (o.format == 'phone') {
			//input.type = 'tel';
			input["data-mask"] = 'phone-int';
			input.placeholder = '+33 999 999 999';
		}
		bb.on(input, 'change textInput input', function (e) {
			self.dispatch('change', input.value);
		});
		bb.on(input, 'keypress', function (e) {
			self.dispatch('keypress', e);
		});
		bb.extend(this, {
			label(l) {
				if (l)
					label.innerHTML = l;
				else
					return label.innerHTML;
			},
			value(v) {
				if (v)
					input.value = v;
				else
					return input.value;
			},
			placeholder(ph) {
				if (ph)
					input.placeholder = ph;
				else
					return input.placeholder;
			},
			field() {
				return input;
			},
			readOnly(v) {
				if (v === undefined)
					return input.readOnly;
				input.readOnly = v;
			}
		});
	};
	bb.bsfn.button = function (o) {
		let self = this;
		let button = this.querySelector('button');
		this.pv.events.click = [];
		if (o.label)
			button.innerHTML = o.label;
		if (o.style)
			bb.addClass(button, 'btn-' + o.style);
		bb.on(button, 'click', function () {
			self.dispatch('click');
		});
	};
	bb.bsfn.submit = function (o) {
		if (o.labelSubmit)
			this.querySelector('.submit').innerHTML = o.labelSubmit;
		if (o.labelCancel)
			this.querySelector('.cancel').innerHTML = o.labelCancel;
		if (o.submit)
			bb.on(this.querySelector('.submit'), 'click', o.submit);
		if (o.cancel)
			bb.on(this.querySelector('.cancel'), 'click', o.cancel);
	};
	bb.bsfn.table = function (o) {
		if (o.title)
			this.querySelector('div.title').innerHTML = o.title;
		if (o.plus)
			bb.on(this.querySelector('.plus'), 'click', o.plus);
		bb.extend(this, {
			append(template, el, o) {
				if (template == 'tableheader')
					this.element.querySelector('thead tr').appendChild(el);
				else if (template == 'tablerow') {
					if (o.insertAfter)
						o.insertAfter.parentNode.insertBefore(el, o.insertAfter.nextSibling);
					else if (o.insertBefore)
						o.insertBefore.parentNode.insertBefore(el, o.insertBefore);
					else
						this.element.querySelector('tbody').appendChild(el);
				}
			},
			clear() {
				let body = this.element.querySelector('tbody');
				while (body.firstChild) {
					body.removeChild(body.firstChild);
				}
			}
		});
	};
	bb.bsfn.tableheader = function (o) {
		if (o.style)
			this.element.style = o.style;
		if (o.class)
			this.addClass(o.class);
		if (o.value)
			this.element.innerHTML = o.value;
	};
	bb.bsfn.tablerow = function (o) {
		if (o.style)
			this.element.style = o.style;
		if (o.class)
			this.addClass(o.class);
		if (o.attribs)
			bb.attribs(this.element, o.attribs);
	};
	bb.bsfn.tablecol = function (o) {
		if (o.style)
			this.element.style = o.style;
		if (o.class)
			this.addClass(o.class);
		if (o.attribs)
			bb.attribs(this.element, o.attribs);
		if (o.value)
			this.element.innerHTML = o.value;
		if (o.element)
			this.element.appendChild(o.element);
		if (o.editable) {
			bb.attribs(this.element, {
				contenteditable: true
			});
			this.on('keydown', function (event) {
				if (window.getSelection) {
					if (event.which == 8) { // backspace
						let sel = window.getSelection();
						if (sel.isCollapsed) {
							if (sel.anchorOffset > 0) {
								let i = sel.anchorOffset - 1;
								let r = new Range();
								r.setStart(sel.anchorNode, i);
								r.setEnd(sel.anchorNode, i + 1);
								r.deleteContents();
							}
						} else {
							let r = sel.getRangeAt(0);
							r.deleteContents();
						}
						event.preventDefault();
					} else if (event.key == '.') {
						let sel = window.getSelection();
						let r = sel.getRangeAt(0);
						r.deleteContents();
						let i = r.startOffset;
						let t = r.endContainer.textContent;
						r.endContainer.textContent = t.substring(0, r.startOffset) + '.' + t.substring(r.endOffset, t.length);
						r.setStart(r.endContainer, i + 1);
						event.preventDefault();
					}
				}
			});
		}
	};
	bb.bsfn.tool = function (o) {
		if (o.icon)
			bb.addClass(this.element, o.icon);
	};
	bb.bsfn.select = function (o) {
		let self = this;
		let select = this.element;
		if (o.select) {
			o.select.forEach(function (j) {
				let option = bb.appendHTML(select, 'option');
				option.value = j.value;
				option.innerHTML = j.label;
			});
		}
		bb.extend(this, {
			text(v) {
				if (v)
					for (let i = 0; i < select.options.length; i++) {
						if (select.options[i].text == v) {
							select.selectedIndex = i;
							break;
						}
					}
				else
					return select.options[select.selectedIndex].text;
			},
			value(v) {
				if (v !== undefined)
					for (let i = 0; i < select.options.length; i++) {
						if (select.options[i].value == v) {
							select.selectedIndex = i;
							break;
						}
					}
				else
					return select.options[select.selectedIndex].value;
			},
			field() {
				return select;
			}
		});
		if (o.value)
			this.value(o.value);
		else if (o.select) {
			o.select.forEach(function (o) {
				if (o.default)
					self.value(o.value);
			});
		}
	};
	bb.bsfn.multiselect = function (o) {
		let select = this.element;
		if (o.select) {
			o.select.forEach(function (j) {
				let option = bb.appendHTML(select, 'option');
				option.value = j.value;
				option.innerHTML = j.label;
			});
		}
		if (o.label)
			select['data-placeholder'] = o.label;
		bb.extend(this, {
			text(v) {
				if (v) {
					for (let i = 0; i < select.options.length; i++)
						select.options[i].selected = v.contains(select.options[i].text);
					$(select).trigger("chosen:updated");
				} else {
					var s = [];
					for (var i = 0; i < select.options.length; i++) {
						if (select.options[i].selected)
							s.push(select.options[i].text);
					}
					return s;
				}
			},
			value(v) {
				if (v) {
					for (let i = 0; i < select.options.length; i++)
						select.options[i].selected = v.contains(select.options[i].value);
					$(select).trigger("chosen:updated");
				} else {
					var s = [];
					for (var i = 0; i < select.options.length; i++) {
						if (select.options[i].selected)
							s.push(select.options[i].value);
					}
					return s;
				}
			},
			field() {
				return select;
			}
		});
		if (o.value)
			this.value(o.value);
		$(select).chosen();
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	bb.bsfn.map = function (o) {
		if (o.title)
			this.element.querySelector('.card-header').childNodes[0].nodeValue = o.title;
		if (o.description)
			this.element.querySelector('.card-subtitle').innerHTML = o.description;
		if (o.class)
			bb.addClass(this.element.querySelector('.map'), o.class);
		this.map = new google.maps.Map(this.element.querySelector('.map'), o.map);
		if (o.drawing) {
			this.drawing = new google.maps.drawing.DrawingManager(o.drawing);
			this.drawing.setMap(this.map);
		}
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	bb.bsfn.rightsidebar = function (o) {
		this.append = function (template, el) {
			// TODO:
		};
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////