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
			_this._createAlbum();
			
			_this.select(1);
		}
	});
};

krout.gallery.prototype._createAlbum = function() {
	var _this = this;
	var last = -1;
	
	var title = $(this.div).find('div.title');
		title.text(this.data.album.name);
	
	var thumbs = $(this.div).find('div.thumbs');
	for (var i=0; i < this.data.photos.length; i++) {
		var t = this.data.photos[i];
		var id = t.id;
		thumbs.append('<img class="thumb" src="' + t.thumb_url + '" gallery:idx="' + t.id + '" />')
	}
	
	$(thumbs).find('img').each(function(idx, item) {
		var photo = $(this).attr('gallery:idx');
		$(this).click(function(e) {
			_this.select(parseInt(photo));
		});
	});
	
	$(this.div).find('div.prev a').click(function(e) {
		_this.select(_this._prevIdx());
	});

	$(this.div).find('div.next a').click(function(e) {
		_this.select(_this._nextIdx());
	});
};

krout.gallery.prototype._domElements = function() {
	var html = '<div class="header">';
	html += '<div class="prev"><a href="javascript:void(0);"><img src="button_prev.png" /></a></div>';
	html += '<div class="title">Title</div>';
	html += '<div class="next"><a href="javascript:void(0);"><img src="button_next.png" /></a></div>';
	html += '</div>';
	html += '<div class="body"><img class="photo" />';
	html += '<div class="legend"><div class="caption">Caption</div>';
	html += '<div class="location">Location</div></div></div>';
	html += '<div class="thumbs"></div>';
	$(this.div).append(html);
	this.photo = $(this.div).find('img.photo');
};

krout.gallery.prototype.select = function(idx) {
	var img = this.data.photos[0];
	
	for (var i=0; i < this.data.photos.length; i++) {
		if (parseInt(this.data.photos[i].id) == parseInt(idx)) {
			img = this.data.photos[i];
			break;
		} 
	}
	
	var location = function() {
		return 'Taken on ' + img.date + ' in ' + img.location;
	};
		
	$(this.photo).attr('src', img.url);
	$(this.div).find('div.caption').text(img.title);
	$(this.div).find('div.location').text(location());
	
	var thumbs = $(this.div).find('div.thumbs');
	$(thumbs).find('img').each(function(idx, itme) {
		$(this).addClass('selected');
	});
	
	this.idx = parseInt(img.id);
	return img.id;
};

krout.gallery.prototype._nextIdx = function() {
	for (var i=0; i < this.data.photos.length; i++) {
		if (parseInt(this.idx) == parseInt(this.data.photos[i].id) && this.data.photos[i+1] != null)
			return parseInt(this.data.photos[i+1].id);
	}
	
	return 0;
};

krout.gallery.prototype._prevIdx = function() {
	for (var i=0; i < this.data.photos.length; i++) {
		if (parseInt(this.idx) == parseInt(this.data.photos[i].id) && this.data.photos[i-1] != null)
			return parseInt(this.data.photos[i-1].id);
	}

	return this.data.photos[this.data.photos.length-1].id;
};

$(function() {
	var gdiv = $('#gallery');
	
	var glry = new krout.gallery(gdiv);
		glry.init('gallery_json.txt');
});
