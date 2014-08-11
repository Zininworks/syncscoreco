function appMetaDataWithAppID(allAppMetaData, appID) {
	var appArray = allAppMetaData["allApps"];
	for (var i = 0; i < appArray.length; i++) {
		var appObject = appArray[i];
		if (appID === appObject["appid"]) {
			return appObject;
		}
	}
}

function appTitleString(allAppMetaData, appID) {
	var appObject = appMetaDataWithAppID(allAppMetaData, appID);
	return appObject["title"];
}

function appPriceTier(allAppMetaData, appID) {
	var appObject = appMetaDataWithAppID(allAppMetaData, appID);
	return appObject["offPriceTier"];
}

function searchableStrings(allApps, appMetaData) {
	
}

function cols() {
	var col1 = $("<div>", {
		"class" : "pure-u-1-3 pure-u-sm-2-24 pure-u-md-1-1"
	});
	var col2 = $("<div>", {
		"class" : "pure-u-1 pure-u-sm-3-24 pure-u-md-1-1"
	});
	var col3 = $("<div>", {
		"class" : "pure-u-1 pure-u-sm-7-24 pure-u-md-1-1"
	});
	var col4 = $("<div>", {
		"class" : "pure-u-1 pure-u-sm-6-24 pure-u-md-1-1"
	});
	var col5 = $("<div>", {
		"class" : "pure-u-1 pure-u-sm-3-24 pure-u-md-1-1"
	});
	var col6 = $("<div>", {
		"class" : "pure-u-1 pure-u-sm-3-24 pure-u-md-1-1"
	});	
	return [col1, col2, col3, col4, col5, col6];
}

function composerFromComposerAndTitle(composerAndTitle) {
	return composerAndTitle.split(" ", 2)[0];
}
function titleFromComposerAndTitle(composerAndTitle) {
	return composerAndTitle.replace(composerFromComposerAndTitle(composerAndTitle), "").trim();
}

Array.prototype.containsString = function containsString(s) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === s) {
			return true;
		}
	}
	return false;
}
function appOrderedSongList(songListArray) {
	var ul = $("<ul>");
	var categories = []; //unique categories
	for (var i = 0; i < songListArray.length; i++) {
		var category = songListArray[i]["category"];
		if (categories.indexOf(category) == -1) {
			categories.push(category);
		}
	}
	
	for (var i = 0; i < categories.length; i++) {
		var songTitles = [];
		for (var j = 0; j < songListArray.length; j++) {
			var category = songListArray[j]["category"];
			if (categories[i] === category) {
				songTitles.push(songListArray[j]["title"]);
			}
		}
		console.log(songTitles);
		var ulInside = $("<ul>", { "class" : "songList" });
		for (var j = 0; j < songTitles.length; j++) {
			var liInside = $("<li>");
			liInside.text(songTitles[j]);
			ulInside.append(liInside);
		}		
		
		var li = $("<li>");
		li.text(categories[i]);
		li.append(ulInside);
		ul.append(li);
	}
	return ul;
}

function appListItem(theApp, allAppMetaData) {
	var config = theApp["config"];
	var songList = theApp["songList"];
	var appID = config["appID"];
	var item = $("<li>", { "id": appID, "class": "pure-u-md-1-5" });
	
	var itemCols = cols();	
	var iconLink = "<a href='"+ config["appStoreURL"] +"'>";
	iconLink += "<img class='appIcon pure-img' src='img/" + appID + ".png'>";
	iconLink += "</a>";
	itemCols[0].html(iconLink);
	
	var textContainer = $("<p>");
	
	var composerAndTitle = appTitleString(allAppMetaData, appID);
	var composer = composerFromComposerAndTitle(composerAndTitle);
	itemCols[1].append(textContainer.clone().text(composer));
	
	var title = titleFromComposerAndTitle(composerAndTitle);
	itemCols[2].append(textContainer.clone().text(title));
	
	var artist = config["artist"].split(";")[0];
	itemCols[3].append(textContainer.clone().text(artist));
	
	var priceTag = "$" + ( appPriceTier(allAppMetaData, appID) - 0.01 );
	itemCols[4].append(textContainer.clone().text(priceTag));
	
	var songlistButton = $("<a>", {
		"class" : "sm-button",
		text : "Track List…",
		href : "#" + appID,
	});
	itemCols[5].append(textContainer.clone().append(songlistButton));
	
	item.append(itemCols);
		
	var togglingDiv = $("<div>", {
		"class" : "pure-u-1"
	});
	togglingDiv.hide();
	togglingDiv.append(appOrderedSongList(songList));
	songlistButton.click(function(e){
		e.preventDefault();
		togglingDiv.toggle();
	});
	
	item.append(togglingDiv);

	return item;
}



$(document).ready(function(){
	
	var allAppsURL = "json/allApps.json";
	
	var appMetaDataURL = "json/appMetaData.json";
	
	var list = function list(allApps, appMetaData, sortingFunction) {
		var ul = $("<ul>");

		var sortedApps = [];
		for (var p in allApps) {
			sortedApps.push(allApps[p]);
		}
		if (sortingFunction != undefined) {
			sortedApps.sort(sortingFunction);
		}
		
		
		for (var i = 0; i < sortedApps.length; i++) {
			var listItem = appListItem(sortedApps[i], appMetaData);
			ul.append(listItem);
		}
		
		return ul;
	}
	
	$.get(appMetaDataURL, function(appMetaData) {
		$.get(allAppsURL, function(allApps) {
			//attach headers
			var headerCols = cols();
			var header = $("<h5>", { "class" : "sort-button content-subhead" });
			
			headerCols[1].append(header.clone().append($("<a>", {
				"href" : "appList",
				text : "Composer ⇵"
			})));
			headerCols[2].append(header.clone().append($("<a>", {
				"href" : "appList",
				text : "Title"
			})));
			headerCols[3].append(header.clone().append($("<a>", {
				"href" : "appList",
				text : "Artist"
			})));
			headerCols[4].append(header.clone().append($("<a>", {
				"href" : "appList",
				text : "Price"
			})));
			
			$.each(headerCols, function(i, v) {
				v.addClass("hidden-sm");
			});
			
			var headerItem = $("<li>");
			headerItem.append(headerCols);
			
			var composerSort = function composerSort(a, b) {
				var aTitle = appTitleString(appMetaData, a["config"]["appID"]);
				var bTitle = appTitleString(appMetaData, b["config"]["appID"]);
				if (aTitle < bTitle) {
					return -1;
				}
				if (aTitle > bTitle) {
					return 1;
				}
				return 0;
			};			
			headerCols[1].click(function(e) {
				e.preventDefault();
				$("div#appList").html(list(allApps, appMetaData, composerSort));
			});
			
			var titleSort = function titleSort(a, b) {
				var aTitle = appTitleString(appMetaData, a["config"]["appID"]);
				aTitle = titleFromComposerAndTitle(aTitle);
				var bTitle = appTitleString(appMetaData, b["config"]["appID"]);
				bTitle = titleFromComposerAndTitle(bTitle);
				if (aTitle < bTitle) {
					return -1;
				}
				if (aTitle > bTitle) {
					return 1;
				}
				return 0;				
			};
			headerCols[2].click(function(e) {
				e.preventDefault();
				$("div#appList").html(list(allApps, appMetaData, titleSort));
			});
			
			var artistSort = function artistSort(a, b) {
				var aTitle = a["config"]["artist"];
				var bTitle = b["config"]["artist"];
				if (aTitle < bTitle) {
					return -1;
				}
				if (aTitle > bTitle) {
					return 1;
				}
				return 0;				
			};
			headerCols[3].click(function(e) {
				e.preventDefault();
				$("div#appList").html(list(allApps, appMetaData, artistSort));
			});
			
			var priceSort = function priceSort(a, b) {
				var aTitle = appPriceTier(appMetaData, a["config"]["appID"]);
				aTitle = parseInt(aTitle);
				var bTitle = appPriceTier(appMetaData, b["config"]["appID"]);
				bTitle = parseInt(bTitle);
				if (aTitle < bTitle) {
					return 1;
				}
				if (aTitle > bTitle) {
					return -1;
				}
				return 0;				
			};
			headerCols[4].click(function(e){
				e.preventDefault();
				$("div#appList").html(list(allApps, appMetaData, priceSort));
			});
			
			
			$("div#appListHeader").append(headerItem);
			var defaultSortingFunction = composerSort;		
			$("div#appList").html(list(allApps, appMetaData, defaultSortingFunction));
		});
	});	
	
});
