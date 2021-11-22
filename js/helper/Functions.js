this.js = this.js || {};
this.js.helper = this.js.helper || {};

function numberToTime(seconds) {
    var sec_num = seconds;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function loadJsFile(url, location) {
    return new Promise(function (resolve, reject) {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;

        scriptTag.onload = function () {
            resolve();
        }
        location.appendChild(scriptTag);
    });
};

function loadAllJsFile(arr, callback) {

    if (arr.length) {
        var js = arr.shift();
        loadJsFile(js, document.body).then(function () {
            loadAllJsFile(arr, callback)
        });
        return;
    }
    callback();
}

function loadStyle(url, location) {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';        
        link.type = 'text/css';       
        link.href = url;  
        link.onload = function () {
            resolve();
        }
        location.appendChild(link);
    });
};

function loadAllStyleFile(arr, callback) {

    if (arr.length) {
        var js = arr.shift();
        loadStyle(js, document.body).then(function () {
            loadAllStyleFile(arr, callback)
        });
        return;
    }
    callback();
}

function toZiro(num)
{
    if(num<10)
    {
        return "00"+num;
    }else if(num<100)
    {
        return "0"+num;
    }else{
        return num;
    }
     
}

function setBoundsFromAnimateMovieClip(mc) {
    mc.setBounds(
      mc.nominalBounds.x,
      mc.nominalBounds.y,
      mc.nominalBounds.width,
      mc.nominalBounds.height
    );
    // mc.outline();
  }


  function setTextIntoMovieClip(mc, txt, labelData) {
    zimify(mc);
    setBoundsFromAnimateMovieClip(mc);
    
    if(mc.placeHolderText_mc==undefined)
    {
        mc.placeHolderText_mc = new Rectangle({width:mc.width*0.85,height:mc.height*0.85});
    }
    //setBoundsFromAnimateMovieClip(mc.placeHolderText_mc);
    zimify(mc.placeHolderText_mc);
    mc.placeHolderText_mc.visible = false;
  
    if (labelData.type == "Label") {
      var labelObj = copy(labelData.props);
      labelObj.labelWidth = mc.placeHolderText_mc.width;
      labelObj.labelHeight = mc.placeHolderText_mc.height;
      labelObj.text = txt;
      var label = new Label(labelObj);
      mc.textInto_txt = label;
      label.centerReg(mc).loc(mc.placeHolderText_mc);
    } else {
      var con = js.helper.DisplayObjectFromJson.buildView(labelData.items);
      if (con.theText) {
        con.theText.labelWidth = mc.placeHolderText_mc.width;
        con.theText.labelHeight = mc.placeHolderText_mc.height;
      }
      con.theText.noMouse();
      mc.conFromZim = con;
      mc.placeHolderText_mc.visible = true;
      mc.placeHolderText_mc.alpha = 0.01;
      mc.placeHolderText_mc.cur();
      mc.placeHolderText_mc.on("mousedown", function() {
        Swal.fire({
          title: "התשובה שלכם",
          input: "textarea",
          inputAttributes: {
            autocapitalize: "off",
          },
  
          allowEscapeKey: false,
          allowOutsideClick: false,
  
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: "אישור",
          cancelButtonText: "ביטול",
        }).then((result) => {
          if (result.value == undefined) return;
          if (result.value.length > 0) {
            con.theText.text = result.value;
          }
        });
      });
  
      con.centerReg(mc).loc(mc.placeHolderText_mc);
    }
  }
  