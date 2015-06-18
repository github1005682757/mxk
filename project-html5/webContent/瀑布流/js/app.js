window.onload = function(){
	imgLocation("container", "box");
	
	window.onscroll = function(){
		checkFlag();
	}
};

function checkFlag(){
	var oParent = document.getElementById("container");
	var aChild = getChildElement(oParent, "box");
	var iLastHeight = aChild[aChild.length - 1].offsetHeight;
	var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var iParentHeight = document.documentElement.clientHeight || document.body.clientHeight;
	console.log(iLastHeight + ":" + iScrollTop + ":" + iParentHeight);
}

/**
 * 
 * @param {Object} sParentId
 * @param {Object} sChildClassName
 */
function imgLocation(sParentId, sChildClassName){
	//将parent下多有的content全部取出
	var oParent = document.getElementById(sParentId);
	var aChild = getChildElement(oParent, sChildClassName);
	var iImgWidth = aChild[0].offsetWidth;
	var iCols = Math.floor(document.documentElement.clientWidth/ iImgWidth);
	oParent.style.cssText = "width:" + iImgWidth * iCols + "px; margin:0 auto;";
	
	var aBoxHeightArr = [];
	for(var i = 0, iLen = aChild.length; i < iLen; i++){
		if(i < iCols){
			aBoxHeightArr[i] = aChild[i].offsetHeight;
		}else{
			var iMinHeight = Math.min.apply(null, aBoxHeightArr);
			var iMinIndex = getMinIndex(aBoxHeightArr, iMinHeight);
			aChild[i].style.position = "absolute";
			aChild[i].style.top = iMinHeight + "px";
			aChild[i].style.left = aChild[iMinIndex].offsetLeft + "px";
			aBoxHeightArr[iMinIndex] += aChild[i].offsetHeight;
			console.log(iMinHeight);
		}
	}
}

/**
 * 给出数组中的最小值，算出它在数组中的位置
 */
function getMinIndex(arr, iMin){
	for(var i in arr){
		if(arr[i] == iMin){
			return i;
		}
	}
}

/**
 * 获取元素下的子元素
 * @param {Object} oParent
 * @param {Object} sChildClassName
 */
function getChildElement(oParent, sChildClassName){
	var aChild = [];
	var aElement = oParent.getElementsByTagName("*");
	for(var i = 0; i < aElement.length; i++){
		if(aElement[i].className == sChildClassName){
			aChild.push(aElement[i]);
		}
	}
	return aChild;
}
