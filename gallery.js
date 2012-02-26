var krout = { 
	gallery: function(div) {
		this.div = div;
		this.idx = -1;
	}
};

krout.gallery.prototype.init = function(jsonurl) {
	var _this = this;
	$.ajax({
		url: jsonurl,
		dataType: 'json',
		success: function(data) {
			_this.data = data;
			
			_this._domElements();
			_this._createThumbs();
			
			_this.select(3);
		}
	});
};

krout.gallery.prototype._createThumbs = function() {
	var _this = this;
	var thumbs = $(this.div).find('div.thumbs');
	for (var i=0; i < this.data.photos.length; i++) {
		var t = this.data.photos[i];
		thumbs.append('<img class="thumb" src="' + t.thumb_url + '" gallery:idx="' + i + '" />')
	}
	
	$(thumbs).find('img').each(function(idx, item) {
		var photo = $(this).attr('gallery:idx');
		$(this).click(function(e) {
			_this.select(parseInt(photo));
		});
	});
};

krout.gallery.prototype._domElements = function() {
	$(this.div).append('<div class="header"></div><div class="body"><img class="photo" /><div class="legend"><div class="caption">Jessica and Amy by the lake</div><div class="location">Taken February 26, 2008 in Paris, France</div></div></div><div class="thumbs"></div>');
	this.photo = $(this.div).find('img.photo');
};

krout.gallery.prototype.select = function(idx) {
	if (idx < 0 || this.data.photos.length <= idx)
		return;
		
	var img = this.data.photos[idx];
	this.idx = idx;
	
	$(this.photo).attr('src', img.url);
	
	// Reset them all.
	var thumbs = $(this.div).find('div.thumbs');
	$(thumbs).find('img').each(function(idx, itme) {
		$(this).addClass('selected');
	});
};

$(function() {
	var gdiv = $('#gallery');
	
	var glry = new krout.gallery(gdiv);
		glry.init('gallery_json.txt');
});
