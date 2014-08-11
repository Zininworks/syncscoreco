$(".video-box video").click(function(e){
	e.preventDefault();
	if (this.paused) {
		this.play();
	}
	else {
		this.pause();
	}
});