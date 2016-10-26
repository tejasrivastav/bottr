var webApp = {
  upload: function (input){
    if(input.files && input.files[0]){
      var reader = new FileReader();
      var that = this;
      reader.onload = function(e){
        var image = that.renderImage(e);
        that.image = image;
      }
      reader.readAsDataURL(input.files[0]);
    }
  },
  image: null,
  canvasContainer : function(){
    return document.getElementById("canvasContainer");
  },
  canvas : function(){
    return document.querySelector("#canvasContainer #canvas")
  },
  ctx : function(){
    return this.canvas().getContext('2d');
  },
  renderImage: function(e){
    var img = new Image();
    var that = this;
    img.onload = function(){
      that.canvas().width = img.width;
      that.canvas().height = img.height;
      that.ctx().drawImage(img,0,0);
    };
    img.src = e.target.result;
    this.attachEvents(this.canvas());
    return img;
  },
  attachEvents: function(canvas){
    var sourceX,sourceY,desX,desY;
    var that = this;
    canvas.onmousedown = function(e){
        sourceX =  e.x,
        sourceY =  e.y
    }
    canvas.onmouseup = function(e){
        desX = e.x;
        desY = e.y;
        that.crop({
          sourceX:sourceX,
          sourceY:sourceY,
          desX:desX,
          desY:desY
        });
    }
  },
  angleInDegrees: 0,
  drawRotated: function (degrees){
    if(this.canvas()) this.canvasContainer().removeChild(this.canvas());
    
    var canvas = document.createElement("canvas");
    var ctx= canvas.getContext('2d');
    canvas.setAttribute("id","canvas");
    
    var image = this.image;
    if(degrees == 90 || degrees == 270) {
		  canvas.width = image.height;
		  canvas.height = image.width;
    } else {
		  canvas.width = image.width;
		  canvas.height = image.height;
    }
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(degrees == 90 || degrees == 270) {
		ctx.translate(image.height/2,image.width/2);
    } else {
	    ctx.translate(image.width/2,image.height/2);
   }
    ctx.rotate(degrees*Math.PI/180);
    ctx.drawImage(image,-image.width/2,-image.height/2);
    
    this.attachEvents(canvas);
    this.canvasContainer().appendChild(canvas);
  },
  clockWise: function(){ 
    this.angleInDegrees= (this.angleInDegrees + 90) % 360;
    this.drawRotated(this.angleInDegrees);
  },
  counterClockWise: function(){ 
    if(this.angleInDegrees == 0)
        this.angleInDegrees = 270;
    else
        this.angleInDegrees= (this.angleInDegrees - 90) % 360;
    
    this.drawRotated(this.angleInDegrees);
  },
  crop: function(options){
    var img = new Image();
    img.src = this.canvas().toDataURL();

    if(this.canvas()) this.canvasContainer().removeChild(this.canvas());
    
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    canvas.setAttribute("id","canvas");

    var dWidth = Math.abs(options.sourceX - options.desX);
    var dHeight = Math.abs(options.sourceY - options.desY);
    var sWidth = Math.abs(img.width-options.sourceX)
    var sHeight = Math.abs(img.height-options.sourceY)
    ctx.drawImage(img,options.sourceX,options.sourceY,sWidth,sHeight,0,0,dWidth,dHeight);
    
    this.image.src = canvas.toDataURL();
    this.canvasContainer().appendChild(canvas);
  },
  save: function(){
    var imageData = this.canvas().toDataURL();
    var postString = "imageData="+ JSON.stringify({imageData:imageData});
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/save");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp  = JSON.parse(this.responseText);
        var responseDiv = document.getElementById("response");
        responseDiv.style.display = "block";
        var url = window.location.origin+resp.url;
        responseDiv.innerHTML = url;
        responseDiv.setAttribute("target","_blank");
      }
    }
    xhr.send(JSON.stringify({imageData:imageData}));
  }
}

function upload(input){
  webApp.upload(input);
}

function clockWise(){
  webApp.clockWise();
}

function counterClockWise(){
  webApp.counterClockWise();
}

function save(){
  webApp.save();
}