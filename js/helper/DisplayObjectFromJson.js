this.js = this.js || {};
this.js.helper = this.js.helper || {};


(function (window) {


    // https://zimjs.com/docs_commands_duo.html
    var objectProp = {
        CheckBox: ["size", "label", "startChecked", "color", "backgroundColor", "borderColor", "borderWidth", "corner", "margin", "indicatorType", "indicatorColor", "tap", "style", "group", "inherit"],
        Container: ["a", "b", "c", "d", "style", "group", "inherit"],
        Bitmap: ["image", "width", "height", "id", "style", "group", "inherit", "visible", "scale"],
        Rectangle: ["width", "height", "color", "borderColor", "borderWidth", "corner", "dashed", "style", "group", "inherit"],
        Label: ["text", "size", "font", "color", "rollColor", "shadowColor", "shadowBlur", "align", "valign", "bold", "italic", "variant", "lineWidth", "lineHeight", "backing", "outlineColor", "outlineWidth", "backgroundColor", "backgroundBorderColor", "backgroundBorderWidth", "corner", "backgroundDashed", "padding", "paddingHorizontal", "paddingVertical", "shiftHorizontal", "shiftVertical", "rollPersist", "labelWidth", "labelHeight", "maxSize", "style", "group", "inherit"],
        Line: ["length", "thickness", "color", "startHead", "endHead", "dashed", "strokeObj", "style", "group", "inherit"],
        Button: ["width", "height", "label", "backgroundColor", "rollBackgroundColor", "color", "rollColor", "borderColor", "borderRollColor", "borderWidth", "corner", "shadowColor", "shadowBlur", "hitPadding", "gradient", "gloss", "dashed", "backing", "rollBacking", "rollPersist", "icon", "rollIcon", "toggle", "toggleBacking", "rollToggleBacking", "toggleIcon", "rollToggleIcon", "toggleEvent", "wait", "waitTime", "waitBackgroundColor", "rollWaitBackgroundColor", "waitColor", "rollWaitColor", "waitModal", "waitEnabled", "waitBacking", "rollWaitBacking", "waitIcon", "rollWaitIcon", "align", "valign", "indent", "indentHorizontal", "indentVertical", "style", "group", "inherit"],
        Slider: ["min", "max", "step", "button", "barLength", "barWidth", "barColor", "vertical", "useTicks", "inside", "keyArrows", "keyArrowsStep", "keyArrowsH", "keyArrowsV", "damp", "style", "group", "inherit"],
        ProgressBar: ["barType", "foregroundColor", "backgroundColor", "borderColor", "borderWidth", "padding", "label", "color", "labelPosition", "percentage", "corne", "shadowColor", "shadowBlur", "backing", "delay", "fastClose", "container", "autoHide", "style", "group", "inherit"],
        Circle: ["radius", "color", "borderColor", "borderWidth", "dashed", "style", "group", "inherit"],
        Tile: ["obj", "cols", "rows", "spacingH", "spacingV", "width", "height", "squeezeH", "squeezeV", "colSize", "rowSize", "align", "valign", "count", "mirrorH", "mirrorV", "snapToPixel", "clone"],
        List: ["width", "height", "list", "viewNum", "vertical", "currentSelected", "align", "valign", "labelAlign", "labelValign", "labelIndent", "labelIndentHorizontal", "labelIndentVertical", "indent", "spacing", "backgroundColor", "rollBackgroundColor", "selectedBackgroundColor", "backdropColor", "color", "selectedColor", "rollColor", "borderColor", "borderWidth", "padding", "corner", "swipe", "scrollBarActive", "scrollBarDrag", "scrollBarColor", "scrollBarAlpha", "scrollBarFade", "scrollBarH", "scrollBarV", "slide", "slideDamp", "slideSnap", "shadowColor", "shadowBlur", "paddingHorizontal", "paddingVertical", "scrollWheel", "damp", "titleBar", "titleBarColor", "titleBarBackgroundColor", "titleBarHeight", "draggable", "boundary", "close", "closeColor", "excludeCustomTap", "organizer", "clone", "style", "group", "inherit"],
        Pane: ["width", "height", "label", "backgroundColor", "color", "draggable", "resets", "modal", "corner", "backdropColor", "shadowColor", "shadowBlur", "center", "displayClose", "backdropClose", "backing", "fadeTime", "container", "titleBar", "titleBarColor", "titleBarBackgroundColor", "titleBarHeight", "close", "closeColor", "style", "group", "inherit"],
        Stepper: ["list", "width", "backgroundColor", "borderColor", "borderWidth", "label", "color", "vertical", "arrows", "corner", "shadowColor", "shadowBlur", "continuous", "display", "press", "hold", "holdDelay", "holdSpeed", "draggable", "dragSensitivity", "dragRange", "stepperType", "min", "max", "step", "step2", "arrows2", "arrows2Scale", "keyEnabled", "keyArrows", "rightForward", "downForward", "style", "group", "inherit", "scale"],
        TextArea: ["width", "height", "size", "padding", "color", "backgroundColor", "borderColor", "borderWidth", "corner", "shadowColor", "shadowBlur", "dashed", "id", "placeholder", "readOnly", "spellCheck", "password", "inputType", "frame", "expand", "style", "group", "inherit"]
    }

    function DisplayObjectFromJson() {

    }


    DisplayObjectFromJson.groupStyleName_obj = {};

    DisplayObjectFromJson.replaceExternalData = function (s) {
        return s;
    }

    DisplayObjectFromJson.getExternalData = function (s) {
        if (typeof s != "string") return s;
        if (s.indexOf("^^") > -1) {
            s = DisplayObjectFromJson.replaceExternalData(s);
        }
        return s;

    }

    DisplayObjectFromJson.buildDisplayObject = function (displayObjectType, jsonData) {


        var rectObj = {};

        if (displayObjectType == "Bitmap") {
            if (jsonData.image) {
                displayObject = frame.asset(DisplayObjectFromJson.getExternalData(jsonData.image)).clone();
            } else if (jsonData.src) {
                displayObject = frame.asset(DisplayObjectFromJson.getExternalData(jsonData.src)).clone();
            }



            loop(jsonData, function (value) {
                var isProp = false;
                loop(objectProp[displayObjectType], function (prop) {
                    if (prop == value) {
                        isProp = true;
                        return "break";
                    }
                });
                if (isProp) {
                    // zog(displayObjectType,jsonData[value],value)
                    if (value != "image" && value != "src") {
                        displayObject[value] = jsonData[value];
                    }
                }




            });
            return displayObject;
        }

        loop(jsonData, function (value) {
            var isProp = false;
            loop(objectProp[displayObjectType], function (prop) {
                if (prop == value) {
                    isProp = true;
                    return "break";
                }
            });
            if (isProp) {
                // zog(displayObjectType,jsonData[value],value)
                rectObj[value] = DisplayObjectFromJson.getExternalData(jsonData[value]);
            }




        });

        var displayObject = new zim[displayObjectType](rectObj);
        displayObject.orginalJsonData = jsonData;


        return displayObject;

    }



    DisplayObjectFromJson.replaceOnArray = function (arr, name, value) {
        loop(arr, function (item) {
            if (item.name == name) {
                item.value = value;
            }
        });
    }

    DisplayObjectFromJson.getItemByPath = function (obj, path, overData) {

        var pp = this;
        var pathName;
        var havePath = false;
        if (path.indexOf(",") > -1) {
            var path_arr = path.split(",");
            pathName = path_arr[0];

        } else {
            pathName = path;

            return;
        }

        var theItem = null;
        loop(obj, function (itemName, item) {

            if (itemName == pathName) {
                havePath = true;
                // zogg("============================",item,typeof item);
                if (typeof item == "object" && typeof overData != "object") {
                    // zogb("============================");
                    zog(path_arr);
                    zog(typeof pathName);
                    path_arr.shift();
                    var newPath = path_arr.toString();
                    //zog("newPath",newPath);
                    //  debugger
                    //pp.getItemByPath(item,newPath,false);
                    item[newPath] = overData;
                    havePath = true;
                    return "break";
                } else if (typeof item == "object" && typeof overData == "object") {
                    // zogr("============================");
                    if (itemName == "items") {
                        //f (itemName == pathName) debugger;
                        loop(item, function (itemsObj) {
                            zog(itemsObj.name)
                            if (itemsObj.name == path_arr[1]) {

                                pp.replaceOnObject(itemsObj, overData);

                                return "break";
                            }
                        });

                        return "break";
                    }
                }
            } else {
                if (itemName == "items") {
                    //f (itemName == pathName) debugger;
                    loop(item, function (itemsObj) {

                        if (itemsObj.name == pathName) {
                            path_arr.shift();
                            var newPath = path_arr.toString();
                            zog(itemsObj, newPath);


                            pp.getItemByPath(itemsObj, newPath, overData);
                        }
                    });

                    return "break";
                }
            }
        });
    }

    DisplayObjectFromJson.replaceOnObject = function (obj, overObject, saveArr) {
        if (zot(saveArr)) saveArr = [];
        var pp = this;

        loop(overObject, function (item) {

            if (typeof obj[item] != "object") {
                //zog("item", item)
                var isSave = false;
                loop(saveArr, function (saveItem) {
                    if (saveItem == item) {
                        isSave = true;
                    }
                });
                if (!isSave) {
                    obj[item] = overObject[item];
                }
            } else {
                if (Array.isArray(overObject[item])) {
                    obj[item] = overObject[item];

                } else {
                    pp.replaceOnObject(obj[item], overObject[item]);
                }

            }


        });
    }


    DisplayObjectFromJson.setGroupStyleName = function (itemsArr) {
        loop(itemsArr, function (item) {
            if (DisplayObjectFromJson.groupStyleName_obj[item.setGroupStyleName] == undefined) {
                DisplayObjectFromJson.groupStyleName_obj[item.setGroupStyleName] = item;
            }
        });
    }

    DisplayObjectFromJson.buildView = function (itemsArr, con) {
        var p = this;
        if (con == undefined) con = new Container();

        var func = item => {
            if (item.setGroupStyleName != undefined) {
                DisplayObjectFromJson.groupStyleName_obj[item.setGroupStyleName] = item;
            }
            if (item.getGroupStyleName != undefined) {
                var newItem = copy(DisplayObjectFromJson.groupStyleName_obj[item.getGroupStyleName]);
                if (newItem == undefined) {
                    throw "No item to copy from\nPlease run the set item before";
                    return;
                }
                DisplayObjectFromJson.replaceOnObject(newItem, item);

                if (item.overItems != undefined) {

                    loop(item.overItems, function (pathItem) {
                        DisplayObjectFromJson.getItemByPath(newItem, pathItem.pathOrName, pathItem.overData);
                        zog(newItem, pathItem.pathOrName, pathItem.overData)
                    })


                }
                item = newItem;

            }
            if (item.mobile && zim.mobile()) {
                DisplayObjectFromJson.replaceOnObject(item, item.mobile);
                zog(item, item.mobile);
            }
            var displayObject = js.helper.DisplayObjectFromJson.buildDisplayObject(item.type, item.props);
            if (item.addType == undefined) {
                item.addType = "centerReg";
            }
            displayObject.itemsArr = item;

            //add excuteFunc to item for buttons
            if (item.excuteFunc != undefined) {

                displayObject.cur();
                displayObject.on("mousedown", function (e) {

                    displayObject.animate({
                        props: { scale: 0.85 },
                        time: 0.05,
                        from: true,
                        call: function () {
                            zog("done");
                            var costum = new CustomEvent("showChoosenScreen");
                            costum.data = item.excuteFunc;
                            displayObject.dispatchEvent(costum);
                        }

                    });
                });

            }

            //add name to item for control
            if (item.name != undefined) {
                displayObject.name = item.name;
                con[item.name] = displayObject;
            }

            //add object into object
            if (item.items != undefined) {
                p.buildView(item.items, displayObject);
            }
            if (item.fit) displayObject.fit(item.fit);

            //addTo or cetnerReg or center
            displayObject[item.addType](con);
            // zog(displayObject.name, item.movX, item.movY)
            displayObject.mov(item.movX, item.movY);

            if (item.extraFunctions) {
                loop(item.extraFunctions, function (functionItem) {
                    zog(functionItem.function, ...functionItem.functionRest)
                    displayObject[functionItem.function](...functionItem.functionRest);
                })

            }


            if (item.scaleTo) {
                if (item.scaleToName) {

                    displayObject.scaleTo(displayObject.parent[item.scaleToName], item.scaleToSize, item.scaleToSize);
                } else {
                    displayObject.scaleTo(displayObject.parent.bgRect, item.scaleToSize, item.scaleToSize);
                }


            }
            if (item.scale) displayObject.sca(item.scale);
            if (item.alpha) displayObject.alp(item.alpha);
            if (item.pos) {
                displayObject.pos(item.pos);
            }
            if (item.rotation) {
                displayObject.rot(item.rotation);
            }
            if (item.shadow) displayObject.sha(...item.shadow);
        };

        if (Array.isArray(itemsArr)) {
            loop(itemsArr, function (item) {
                func(item);
            })
        } else {
            loop(itemsArr, function (key, item) {
                func(item);
            })
        }

        return con;
    }
    js.helper.DisplayObjectFromJson = DisplayObjectFromJson;
    // zim.extend(js.DisplayObjectFromJsons.DisplayObjectFromJson, zim.Container, null, "DisplayObjectFromJson");
}(window));