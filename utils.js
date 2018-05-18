var wrUtils = {};
wrUtils.init = function()
{
	var $loading = $('#bowlG').hide();
    //ajax feedback
    $(document)
        .ajaxStart(function() {
            $loading.fadeIn();
            $('#loadingBackground').addClass('loading');
        })
        .ajaxStop(function() {
            $loading.fadeOut();
            $('#loadingBackground').removeClass('loading');
    });
	wrUtils.dates = wrUtils.getSpiDates();
	wrUtils.mapDates = wrUtils.dates.split(',');
	if (typeof ihuMap != 'undefined')
		{
			ihuMap.spiLayerOptions.month = wrUtils.formatDate(0).yearMon;
		}
	return;
}
wrUtils.getSpiDates = function()
{
	var startYear = 2005;
	var endYear = 2012;
	var dates = '';
	var counter = 0;
	var lastComma = ((endYear - startYear+1) * 12) - 1;
	for (var i = startYear; i <= endYear; i++)
	{
		for (var m = 1; m <= 12; m++)
		{
			if (m < 10)
			{
				m = '0'+m;
			}
			dates+= i + '-' + m + '-01T00:00:00.000Z';
			if(counter != lastComma)	
			{
				dates += ',';
			}
			counter = counter + 1;
		}
	}
	return dates;
}

wrUtils.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

wrUtils.randomColor = function()
{
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

wrUtils.formatDate = function(index)
{
	var dateStruct = {};
	//only showing the date not the whole timestamp.
	dateStruct.fullDate = wrUtils.mapDates[index].substring(0,wrUtils.mapDates[index].indexOf('T'));
	dateStruct.dateArr = dateStruct.fullDate.split('-');
	//For json files, only want a concatenation of year and month
	dateStruct.yearMon = dateStruct.dateArr[0]+dateStruct.dateArr[1];
	dateStruct.shortDate = dateStruct.dateArr[0]+'-'+dateStruct.dateArr[1];
	return dateStruct;
	
}
wrUtils.getMapLayer = function(arr,layerName)
{
	return $.grep(arr, function(obj){return obj.name === layerName;})[0];
}
wrUtils.trimImage = function()
{
	var imgSrc = $(this).attr('src');
	var img = new Image(),
		$canvas = $("<canvas>"),
		canvas = $canvas[0],
		context;
	img.crossOrigin = "anonymous";
	img.onload = function () {
		$canvas.attr({ width: this.width, height: this.height });
		context = canvas.getContext("2d");
		if (context) {
			context.drawImage(this, 0, 0);
			$("body").append("<p>original image:</p>").append($canvas);
		
			wrUtils.removeBlanks(this.width, this.height. context);
		} else {
			alert('Get a real browser!');
		}
	};
	img.src = imgSrc;
}


wrUtils.removeBlanks = function (imgWidth, imgHeight, context) {
    var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
        data = imageData.data,
        getRBG = function(x, y) {
            var offset = imgWidth * y + x;
            return {
                red:     data[offset * 4],
                green:   data[offset * 4 + 1],
                blue:    data[offset * 4 + 2],
                opacity: data[offset * 4 + 3]
            };
        },
        isWhite = function (rgb) {
            // many images contain noise, as the white is not a pure #fff white
            return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
        },
        scanY = function (fromTop) {
            var offset = fromTop ? 1 : -1;
            
            // loop through each row
            for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
                
                // loop through each column
                for(var x = 0; x < imgWidth; x++) {
                    var rgb = getRBG(x, y);
                    if (!isWhite(rgb)) {
                        return y;                        
                    }      
                }
            }
            return null; // all image is white
        },
        scanX = function (fromLeft) {
            var offset = fromLeft? 1 : -1;
            
            // loop through each column
            for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
                
                // loop through each row
                for(var y = 0; y < imgHeight; y++) {
                    var rgb = getRBG(x, y);
                    if (!isWhite(rgb)) {
                        return x;                        
                    }      
                }
            }
            return null; // all image is white
        };
    
    var cropTop = scanY(true),
        cropBottom = scanY(false),
        cropLeft = scanX(true),
        cropRight = scanX(false),
        cropWidth = cropRight - cropLeft,
        cropHeight = cropBottom - cropTop;
    
    var $croppedCanvas = $("<canvas>").attr({ width: cropWidth, height: cropHeight });
    
    // finally crop the guy
    $croppedCanvas[0].getContext("2d").drawImage(canvas,
        cropLeft, cropTop, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight);
    
    $("body").
        append("<p>same image with white spaces cropped:</p>").
        append($croppedCanvas);
    console.log(cropTop, cropBottom, cropLeft, cropRight);
};





$(document).ready(wrUtils.init);