var dragonComicEdit = (function() {
	var canvas = new fabric.CanvasEx('c', null);

	var imgHeight, imgWidth;

	function resizeCanvas() {
		containerWidth = $('.column-left').width();//document.getElementsByClassName("column-left")[0].clientWidth;
		if (canvas.width != containerWidth) {
			var width = (containerWidth < imgWidth) ? containerWidth : imgWidth;
			var scaleMultiplier = width / imgWidth;
			if (scaleMultiplier > 1) scaleMultiplier = 1;
			canvas.setWidth(imgWidth * scaleMultiplier);
			canvas.setHeight(imgHeight * scaleMultiplier);
			canvas.setZoom(scaleMultiplier);
		}
	}

	function deserialization() {
		canvas.loadFromJSON(document.getElementById('json').value, function(o, object) {
			img = canvas.backgroundImage;
			imgWidth = img.width, imgHeight = img.height;
			resizeCanvas();
			canvas.renderAll.bind(canvas);
		});
	}

	function addTextbox(x = 100, y = 100) {
		var text = new fabric.Textbox('（填入文字）', {
			left: x, top: y, lockScalingX: false, lockSkewingX: false,
			fill: document.getElementById('fill').value,
			backgroundColor: document.getElementById('backgroundColor').value,
			fontSize: document.getElementById('fontSize').value,
			lineHeight: document.getElementById('lineHeight').value,
			fontWeight: document.getElementById('bold').checked ? 'bold' : 'normal',
			fontStyle: document.getElementById('italic').checked ? 'italic' : 'normal',
			textDecoration: document.getElementById('underline').checked ? 'underline' : ''
		});
		canvas.add(text);
		canvas.renderAll();
	}

	function deleteObjs() {
		if (canvas.getActiveGroup()) {
			canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
			canvas.discardActiveGroup().renderAll();
		} else if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) { // 防止用户在编辑时使用 Del 键导致对象被删除
			canvas.remove(canvas.getActiveObject());
		}
	}

	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		switch (key) {
			case 46:
				deleteObjs();
				break;
		 }
	}
	canvas.on('mouse:dblclick', function (options) {
		if (!canvas.getActiveObject()) { // 防止用户在激活文本框时因双击而触发误操作
			var pointer = canvas.getPointer(options.e);
			var posX = pointer.x;
			var posY = pointer.y;
			addTextbox(posX, posY);
		}
	});
	canvas.on('object:selected', function() {
		obj = canvas.getActiveObject();
		if (obj) {
			document.getElementById('fill').value = obj.fill;
			document.getElementById('backgroundColor').value = obj.backgroundColor
			document.getElementById('fontSize').value = obj.fontSize;
			document.getElementById('lineHeight').value = obj.lineHeight;
			document.getElementById('bold').checked = obj.fontWeight == 'bold' ? true : false;
			document.getElementById('italic').checked = obj.fontStyle == 'italic' ? true : false;
			document.getElementById('underline').checked = obj.textDecoration == 'underline' ? true : false;
		}
	});

	function observeValue(property, event) {
		document.getElementById(property)[event] = function() {
			obj = canvas.getActiveObject();
			if (obj) {
				obj.set(property, this.value);
				canvas.renderAll();
			}
		}
	}

	observeValue('fill', 'oninput');
	observeValue('backgroundColor', 'oninput');
	observeValue('fontSize', 'oninput');
	observeValue('lineHeight', 'oninput');

	document.getElementById('bold').onchange = function() {
		obj = canvas.getActiveObject();
		if (obj) {
			obj.set('fontWeight', this.checked ? 'bold' : 'normal');
			canvas.renderAll();
		}
	}

	document.getElementById('italic').onchange = function() {
		obj = canvas.getActiveObject();
		if (obj) {
			obj.set('fontStyle', this.checked ? 'italic' : 'normal');
			canvas.renderAll();
		}
	}

	document.getElementById('underline').onchange = function() {
		obj = canvas.getActiveObject();
		if (obj) {
			obj.set('textDecoration', this.checked ? 'underline' : '');
			canvas.renderAll();
		}
	}

	document.getElementById('insertbox').onclick = function(event) {
		addTextbox();
	}

	document.getElementById('deletebox').onclick = function(event) {
		deleteObjs();
	}

	document.getElementById('save').onclick = function(event) {
		document.getElementById('json').value = JSON.stringify(canvas);
	}

	window.onresize = resizeCanvas;

	deserialization();
})();
