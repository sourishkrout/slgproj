var krout = { 
	gallery: function(div, jsonurl) {
		this.div = div;
		this.idx = -1;
		this.photo = 0;
		
		this.init(jsonurl);
	}
};

krout.gallery.prototype.init = function(jsonurl) {
	var _this = this;
	this.photo = $(this.div).find('img.photo');
	
	$.ajax({
		url: jsonurl,
		dataType: 'json',
		success: function(data) {
			_this.data = data;
			
			_this._createAlbum();
			
			// Let's start out with photo number one.
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
		thumbs.append('<a href="javascript:void(0);"><img class="thumb" src="' + t.thumb_url + '" gallery:idx="' + t.id + '"></a>');
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

krout.gallery.prototype.select = function(idx) {
	var _this = this;
	var img = this.data.photos[0];
	var thumbs = $(this.div).find('div.thumbs');
	var location = function() {
		return 'Taken on ' + img.date + ' in ' + img.location;
	};
		
	for (var i=0; i < this.data.photos.length; i++) {
		if (parseInt(this.data.photos[i].id) == parseInt(idx)) {
			img = this.data.photos[i];
			break;
		} 
	}
	
	this._photo(img.url);
	
	$(this.div).find('div.caption').text(img.title);
	$(this.div).find('div.location').text(location());

	this.idx = parseInt(img.id);
	
	$(thumbs).find('img').each(function(idx, item) {
		if (_this.idx == parseInt($(this).attr('gallery:idx')))
			$(this).addClass('selected');
		else
			$(this).removeClass('selected');
	});
	
	return img.id;
};

krout.gallery.prototype._photo = function(url) {
	var _this = this;
	var image = new Image();
	if ($(this.photo).attr('src') != null) {
		$(this.photo).fadeTo('fast', 0, function() {
			image.src = url;
			image.onload = function(e) {
				$(_this.photo).attr('src', url);
				$(_this.photo).fadeTo('fast', 1);
			}
		});
	} else {
		$(this.photo).attr('src', url);
	}
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
	var glry = new krout.gallery(gdiv, 'gallery_json.txt');
});
