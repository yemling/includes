var wrUtils = {};

wrUtils.init = function()
{
	return;
}
wrUtils.getSpiDates = function()
{
	if(typeof wrUtils.startDate === 'undefined')
	{
		wrUtils.startDate = new Date("2010-01-01");
	}
	if(typeof wrUtils.endDate === 'undefined')
	{
		wrUtils.endDate = new Date();
	}
	wrUtils.startYear = wrUtils.startDate.getFullYear();
	wrUtils.endYear = wrUtils.endDate.getFullYear();
	//make a date array for sliders based on station date data.
	var dates = [];
	var lastComma = ((wrUtils.endYear - wrUtils.startYear+1) * 12) - 1;
	for (var i = wrUtils.startYear; i <= wrUtils.endYear; i++)
	{
		var startMonth = 1;
		var endMonth = 12;
		if(i === wrUtils.startYear)
		{
			startMonth = wrUtils.startDate.getMonth()+1;
		}
		if(i === wrUtils.endYear)
		{
			endMonth = wrUtils.endDate.getMonth()+1;
		}
		for (var m = startMonth; m <= endMonth; m++)
		{
			if (m < 10)
			{
				m = '0'+m;
			}
			dates.push(i + '-' + m + '-01T00:00:00.000Z');
		}
	}
	wrUtils.mapDates = dates;
	wrUtils.dates = wrUtils.mapDates.join(',');
	return dates;
}

wrUtils.getDaysBetween = function() {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;
  // Convert both dates to milliseconds
  var date1_ms = wrUtils.startDate.getTime();
  var date2_ms = wrUtils.endDate.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

wrUtils.getParameterByName = function(name, url) {
	//get the url parameters by name
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
	//different date formats for different uses.
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
	//probably don't need this here, but might be useful in the future, to get the array item when given a name to match on
	return jQuery.grep(arr, function(obj){return obj.name === layerName;})[0];
}

wrUtils.autocase = function(str) {
	//make all capital string have initial caps 
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

}
wrUtils.pageLoading = function()
{
	var $loading = jQuery('#bowlG').hide();
    //ajax feedback
    jQuery(document)
        .ajaxStart(function() {
            $loading.fadeIn();
            jQuery('#loadingBackground').addClass('loading');
        })
        .ajaxStop(function() {
            $loading.fadeOut();
            jQuery('#loadingBackground').removeClass('loading');
    });
};
wrUtils.filterTable = function(table) {
	// Declare variables 
	var input, filter, table, tr, td, i;
	input = document.getElementById("tableFilterTxt");
	filter = input.value.toUpperCase();
	table = document.getElementById(table);
	tr = table.getElementsByTagName("tr");
  
	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[0];
	  if (td) {
		if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  } 
	}
	return;
  }