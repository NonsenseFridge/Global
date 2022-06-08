var cloud_name = 'closeapp';
var preset_name = 'pdb2hd9j';

this.js = this.js || {};
function App() {

    var p;
    p = this;
    this.super_constructor();


    App.prototype.initialize = function () {
        p.mainData = mainData;
        p.mainAssets = mainAssets;
        p.first = true;
        p.fromEdit = false;
        p.hasLogo = false;
        p.bitmapBefore = null;
        p.bitmapAfter = null;
        p.bitmapLogo = null;
        p.signature_obj = {};
        p.breaks_obj = {};
        p.theWallReady = false;
        p.nowBrick = null;
        p.setNewUser = false;

        p.thatMe = false;

        p.waitTimeSecound = 30;
        if (queryString.time) {
            p.waitTimeSecound = queryString.time;
        }
        p.waitTimeMiliSecound = p.waitTimeSecound * 1000;

        p.isTimersActive = false;

        p.sendObj = null;

        window.onbeforeunload = closingCode;
        function closingCode() {
            p.clearBrick();
            return null;
        }

        STYLE = mainAssets.baseStyle;

        js.helper.DisplayObjectFromJson.buildView([p.mainAssets.gameView.connectPopup], stage);

        stage.connectPopup.bgRectRed.animate({ props: { scaleY: 0 }, rewind: true, loop: true })

        var progressBar = new ProgressBar({ barType: "rectangle", foregroundColor: "#ffcb31", borderColor: "#ffcb31" });
        var loadImageAndSoundFirst = frame.loadAssets({ assets: assets, progress: progressBar, path: path });
        var loadImageAndSoundFirst1 = loadImageAndSoundFirst.on("complete", function () {

            js.helper.DisplayObjectFromJson.buildView(p.mainAssets.fullFrame, stage);
            js.helper.DisplayObjectFromJson.buildView(p.mainAssets.fridge, stage);

            p.fridgeCon = stage.fridgeCon;
            p.fullCon = stage.fullCon;
            //  p.wallAnimate.wall_mc.y = 400;

            p.fridgeCon.topMarkView.visible = false;
            p.fridgeCon.topRect.visible = false;
            p.fridgeCon.bottomRect.visible = false;

            p.fullCon.fullCon.menuButton.expand();
            p.fullCon.fullCon.menuButton.on("mousedown", function () {
                askPassword(p);
            })

            p.fullCon.fullCon.facebookButton.expand();
            p.fullCon.fullCon.facebookButton.on("mousedown", function () {
                zgo("https://www.facebook.com/groups/957241768480434", "_blank");
            })


            p.fullCon.fullCon.searchButton.expand();
            p.fullCon.fullCon.searchButton.on("mousedown", function () {
                p.showSearch();
            })
            p.createKeyboard();
            p.fridgeCon.searchTextInput.visible = false;


            stage.connectPopup.top();
            if (queryString.isLocal != "true") {
                p.initializeFireBase();
            } else {
                p.startView();
            }



            stage.update(); // this is needed to show any changes
        });

    }

    App.prototype.hideSearch = function () {
        zog("hideSearch",p.fridgeCon.searchTextInput.visible)
        if (p.fridgeCon.searchTextInput.visible == false) {
            return;
        }
        p.fridgeCon.searchTextInput.textInput.text = "";
        zog(p.fridgeCon.searchTextInput.textInput.text.length);
        p.fridgeCon.keyboard.selectedIndex = 0;
        p.fridgeCon.searchTextInput.visible = false;

        var items_arr = [];
        p.fridgeCon.keyboard.hide();
        p.fridgeCon.keyboard.top();
        loop(p.itemsObj, function (conName, con) {
            con.visible = true;
        })
        p.win.conWrapper.wrapper2.remove(p.win.conWrapper.wrapper2.items);
       
        p.updateStatus(true);
        stage.update();
    }

    App.prototype.showSearch = function () {
        zog("showSearch")
        p.fridgeCon.searchTextInput.visible = !p.fridgeCon.searchTextInput.visible;

        if (p.fridgeCon.searchTextInput.visible) {
            p.fridgeCon.keyboard.show();
        } else {
            p.hideSearch();
        }
        stage.update();
    }

    App.prototype.createKeyboard = function (showEdit) {
        var p = this;
        // create Labels to capture the text from the keyboard
        //var text1 = new Label({ text: "", backgroundColor: white }).pos(100, 100);
        var text1 = p.fridgeCon.searchTextInput.textInput;
        p.fridgeCon.searchTextInput.closeButton.tap(()=>{
            p.hideSearch();
        })
        // create a new Keyboard and pass in the labels as an array
        // or if just one label, then pass in the label
        var data = [
            [
                ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                ["z", "x", "c", "v", "b", "n", "m", "backspace"],
                [] // rest of bottom line automatically added
            ], [
                ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
                ["!", "@", "#", "$", "/", "^", "&", "*", "(", ")"],
                ["1/2", "-", "'", "\"", ":", ";", ",", "?", "backspace"],
                ["ABC"] // rest of bottom line automatically added
            ], [
                ["+", "x", "%", "=", "<", ">", "{", "}", "[", "]"],
                ["€", "£", "¥", "$", "￦", "~", "`", "¤", "♡", "☆"],
                ["2/2", "_", "\\", "|", "《", "》", "¡", "¿", "backspace"],
                ["ABC"] // rest of bottom line automatically added
            ]
        ];
        var keyboard = new Keyboard({ labels: [text1], corner: 10, data: data, place: false, placeClose: false });
        p.fridgeCon.keyboard = keyboard;
        // if just the letter is needed use the keydown event
        keyboard.on("close", function (e) {
            p.hideSearch();
        });
        keyboard.on("keydown", function (e) {
            var items_arr = [];
            loop(p.itemsObj, function (conName, con) {
                
                if (con.startObj.isTop) {
                    con.visible = true;
                } else {
                    if ((con.data.text.toLowerCase()).indexOf(text1.text.toLowerCase()) > -1) {
                        con.visible = true;
                        items_arr.push(con);
                    } else {
                       con.visible = false;
                    }
                };
            })

            p.win.conWrapper.wrapper2.remove(p.win.conWrapper.wrapper2.items);
            p.win.conWrapper.wrapper2.add(items_arr);

            stage.update();
        });
        keyboard.y = 200;

        // create events to capture a mousedown on the labels
        var text1Event = text1.on("mousedown", activate);
        function activate(e) {
            keyboard.show();
            // remove the events when keyboard is active
            text1.off("mousedown", text1Event);
        }

        // add back the events to show the keyboard
        keyboard.on("close", function () {
            text1.on("mousedown", text1Event);
        });
        stage.update();
    }

    App.prototype.startView = function (showEdit) {

        if (stage.connectPopup) stage.connectPopup.dispose();

        var words = asset("words.json").words;
        p.words = words;

        p.win = p.buildWordList(470, p.fridgeCon.bottomRect.width + 20, p.fridgeCon.bottomRect.height, true);
        p.win.loc(p.fridgeCon.bottomRect.x - p.fridgeCon.bottomRect.width / 2, p.fridgeCon.bottomRect.y - p.fridgeCon.bottomRect.height / 2)

        timeout(1, function () {
            // p.showEditMode();
        })

        js.helper.DisplayObjectFromJson.buildView(p.mainAssets.timer, stage);
        js.helper.DisplayObjectFromJson.buildView(p.mainAssets.lockScreen, stage);
        p.lockScreenCon = stage.lockScreenCon;
        p.lockScreenCon.on("mousedown", function () { })
        p.lockScreenCon.addTo(stage);
        p.timerCon = stage.timerCon;
        p.lockScreenCon.visible = false;
        p.timerCon.visible = false;

        if (queryString.isLocal != "true") {
            if (p.sendObj == undefined) {
                p.sendObj = p.itemPlaceObj;
            } else {

                p.itemPlaceObj = p.sendObj;
                p.updateStatus();
            }
            p.updateSendObj();
        } else {

        }

        p.checkTimeFromServer();
    };

    App.prototype.startActiveTimer = function () {
        if (p.isTimersActive) return
        p.isTimersActive = true;
        p.lock();
        p.timerCon.bgRect.color = green;
        // p.timerCon.visible = true;
        var num = p.waitTimeSecound;
        if (p.timeInterval) p.timeInterval.clear();
        interval(1, function (obj) {
            p.timerCon.label.text = Math.max(num - obj.count, 0);
            if (num - obj.count == 0) {
                if (p.timeInterval) p.timeInterval.clear();
                p.isTimersActive = false;
                p.unlockAll();
            }
            stage.update();
        }, num + 1, true);
    }

    App.prototype.startunActiveTimer = function () {
        if (p.isTimersActive) return
        p.isTimersActive = true;
        p.timerCon.bgRect.color = red;
        p.timerCon.visible = true;
        var num = p.waitTimeSecound;
        if (p.isLockFromTimerServer) {
            num = Math.round((p.waitTimeMiliSecound - p.openTime) / 1000);
        }
        if (p.timeInterval) p.timeInterval.clear();
        p.timeInterval = interval(1, function (obj) {

            p.timerCon.label.text = Math.max(num - obj.count, 0);
            if (num - obj.count == 0) {
                //if(p.isLockFromTimerServer)
                //{
                if (p.timeInterval) p.timeInterval.clear();
                p.unlockAll();
                //}
            }
            stage.update();
        }, num + 1, true);
    }

    App.prototype.lock = function () {
        p.thatMe = true;
        //send the last id click
        result = p.likeRef.update({ nowData: { nowID: p.myId, action: "lock" } });;
        p.sendMyTimeToServer();
        result.then(function () {
            zog("send lock");
            ////	console.log("great", key);
        }).catch(function (error) {
            console.log("bad", error);
        })
    }

    App.prototype.unlockAll = function () {
        p.thatMe = false;
        p.isLockFromTimerServer = false;
        result = p.likeRef.update({ nowData: { nowID: p.myId, action: "unlock" } });;
        result.then(function () {
            zog("send unlock");
            ////	console.log("great", key);
        }).catch(function (error) {
            console.log("bad", error);
        })
    }

    App.prototype.showLock = function (isLock) {
        if (!p.timerCon) return

        //p.timerCon.visible = true;
        p.lockScreenCon.visible = isLock;



        if (isLock) {
            p.startunActiveTimer();
        } else {
            p.isTimersActive = false;
            p.timerCon.visible = false;
        }
        p.lockScreenCon.top();
        p.timerCon.top();

        p.fridgeCon.keyboard.top();

        stage.update();
    }

    App.prototype.haveData = function (snap) {
        p.snap = snap;

        snap.ref('/.info/serverTimeOffset')
            .once('value')
            .then(function stv(data) {
                finalLocalTime = new Date().getTime();
                var offset = data.val();
                var estimatedServerTimeMs = new Date().getTime() + offset;
                /* console.log(firebase.database.ServerValue);
                 console.log(estimatedServerTimeMs);
                 console.log(finalLocalTime);*/
                var myStorage = window.localStorage;

                const myId = localStorage.getItem('myId');

                if (myId) {
                    p.myId = myId;
                } else {
                    p.myId = new Date().getTime() + offset + rand(1, 10000);
                    myStorage.setItem('myId', p.myId);
                }
            }, function (err) {
                return err;
            });



        if (p.first) {
            p.first = false;
            var queryString = getQueryString();
            p.queryString = queryString;
            if (queryString == undefined) queryString = {};
            queryString.id = "-MjWCifIy0O_22C1JBEd";
            if (queryString.id != undefined) {
                //                var playerObj = snap.child("magneticPoetry").val();
                var playerObj = snap.ref("magneticPoetry/" + queryString.id);
                p.playerObj = playerObj;


                p.likeRef = playerObj.child("likeObj");
                p.likeRef.on("value", function (greetingRef) {
                    var allSignature = greetingRef.val();
                    //   p.sendObj =allSignature;
                    p.itemPlaceObj = allSignature.sendObj;
                    p.nowDataObjFromFB = allSignature.nowData;
                    // debugger
                    p.updateStatus();

                    p.getLockUnloadEvent();

                });
                //var nowKeyObj = playerObj[queryString.id];
                p.playerEventStart = playerObj.on("value", function (greetingRef) {
                    var nowKeyObj = greetingRef.val();
                    playerObj.off("value", p.playerEventStart);

                    if (nowKeyObj.likeObj) {
                        p.sendObj = nowKeyObj.likeObj.sendObj;
                    }

                    p.startView();
                    p.getLockUnloadEvent();

                });
            } else {
                // debugger
                p.showOpenGroup();
            }

        }

        // p.startView();
    }


    App.prototype.sendMyTimeToServer = function (fromClick) {
        //if(p.theTimeIsActiveNow) return;
        p.snap.ref('/.info/serverTimeOffset')
            .once('value')
            .then(function stv(data) {
                finalLocalTime = new Date().getTime();
                var offset = data.val();
                var estimatedServerTimeMs = new Date().getTime() + offset;
                var lastLockTime = estimatedServerTimeMs;

                result = p.likeRef.update({ nowData: { lastLockTime: lastLockTime } });;
                result.then(function () {
                    zog("time data save");
                    ////	console.log("great", key);
                }).catch(function (error) {
                    console.log("bad", error);
                })
            })
    }

    App.prototype.checkTimeFromServer = function (fromClick) {
        //if(p.theTimeIsActiveNow) return;
        p.snap.ref('/.info/serverTimeOffset')
            .once('value')
            .then(function stv(data) {
                finalLocalTime = new Date().getTime();
                var offset = data.val();
                var estimatedServerTimeMs = new Date().getTime() + offset;
                var lastLockTime = estimatedServerTimeMs;

                p.openTime = lastLockTime - p.nowDataObjFromFB.lastLockTime;
                p.openTimeSec = p.openTime / 1000;
                if (p.openTime < (p.waitTimeMiliSecound)) {
                    p.isLockFromTimerServer = true;
                    p.showLock(true);
                }
            })
    }

    App.prototype.getLockUnloadEvent = function () {
        if (p.nowDataObjFromFB.action == "lock") {
            if (p.thatMe) {

            } else {
                p.showLock(true);
            }
        }
        if (p.nowDataObjFromFB.action == "unlock") {
            zogr("unlock  unlock unlock")
            p.showLock(false);
        }
    }
    App.prototype.updateSendObj = function () {
        if (p.playerObj != undefined) {
           

            result = p.likeRef.update({ sendObj: p.itemPlaceObj });;
            result.then(function () {
                zog("send save");


                ////	console.log("great", key);
            }).catch(function (error) {
                console.log("bad", error);
            })
            p.nowBrick = null;
            return
        }
    }

    App.prototype.saveSignature = function () {

        if (p.playerObj != undefined) {

            //let obj  =likeRef.ref().database();
            //get all user

            result = p.likeRef.push({ "brickId": p.nowBrick.nameForDB, "textOnBrick": p.nowBrick.textInto_txt.text, status: "full"/*, "name":p.signatureNameText,"city":p.signatureCityText*/ });
            result.then(function () {
                zog("send save");

                // p.smallButtons.signature_btn.visible = false;
                stage.update();
                var queryString = getQueryString();

                var objCookie = 0;
                if (p.queryString) {
                    objCookie = getCookie("createCount" + p.queryString.id);
                }
                if (objCookie == undefined) {
                    objCookie = 0;
                }
                var countNext = "" + (+objCookie + 1);
                setCookie("createCount" + queryString.id, countNext, 1);
                // p.sendImageToServer();
                //p.isLoad();
                ////	console.log("great", key);
            }).catch(function (error) {
                console.log("bad", error);
            })
            p.nowBrick = null;
            return
        }

    }

    App.prototype.updateStatus = function (go) {
        zog("updateStatus0");
        if (p.thatMe && go==undefined) return
        if (p.itemsObj && p.itemPlaceObj) {
            loop(p.itemsObj, function (itemName, magnetCon) {
                //debugger
                if (p.itemPlaceObj[magnetCon.coundId]) {
                    if (p.itemPlaceObj[magnetCon.coundId].isTop) {
                        magnetCon.addTo();
                        magnetCon.loc(p.itemPlaceObj[magnetCon.coundId].newX, p.itemPlaceObj[magnetCon.coundId].newY);
                        magnetCon.startObj.isTop = true;
                    } else {
                        magnetCon.addTo(magnetCon.startParent);
                        magnetCon.startObj.isTop = false;
                        zog("magnetCon.startParent",magnetCon.startParent.name,magnetCon.startParent.visible)
                        //magnetCon.loc(p.itemPlaceObj[magnetCon.coundId].x,p.itemPlaceObj[magnetCon.coundId].y);
                        magnetCon.loc(magnetCon.startObj.x, magnetCon.startObj.y);
                    }
                }
                
            })
        }
        zog("updateStatus")
        if (p.lockScreenCon) p.lockScreenCon.top();
        if (p.timerCon) p.timerCon.top();
        stage.update();
    }

    App.prototype.showOpenGroup = function () {
        var p = this;
        const steps = [
            {
                number: 0,
                input: 'text',
                inputValue: p.groupNameText ? p.groupNameText : '',
                title: 'שם קבוצה',
                text: 'השם של הקבוצה שלכם',
                inputAttributes: { 'aria-label': "" }
            },
            {
                number: 1,
                input: 'text',
                inputValue: p.fromText ? p.fromText : '',

                title: 'שם מוסד?',
                text: 'שם בית הספר',
                inputAttributes: { 'aria-label': "" }

            }

        ];
        const swalQueueStep = Swal.mixin({
            confirmButtonText: 'הבא',
            reverseButtons: true,
            cancelButtonText: 'הקודם',
            confirmButtonColor: "#2B2C69",
            validationMessage: 'חובה למלא את השדה',
            progressSteps: steps,

            input: 'text',
            allowEscapeKey: false,
            allowOutsideClick: false,
            reverseButtons: true,
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'
        });

        async function backAndForth() {
            const values = [p.groupNameText, p.fromText];
            let currentStep

            for (currentStep = 0; currentStep < steps.length;) {
                const result = await swalQueueStep.fire({
                    title: steps[currentStep].title,
                    input: steps[currentStep].input,
                    progressStepsDistance: "50px",
                    inputAttributes: steps[currentStep].inputAttributes,
                    inputValue: values[currentStep] ? values[currentStep] : '',
                    showCancelButton: currentStep > 0,

                    progressSteps: ["1", "2"],
                    inputPlaceholder: steps[currentStep].inputPlaceholder ? steps[currentStep].inputPlaceholder : '',
                    text: steps[currentStep].text,
                    currentProgressStep: steps[currentStep].number
                })

                if (result.value) {
                    values[currentStep] = result.value;
                    currentStep++;
                } else if (result.dismiss === 'cancel') {
                    currentStep--;
                } else {
                    break
                }
            }

            if (currentStep === steps.length) {
                //Swal.fire(JSON.stringify(values))

                p.groupNameText = values[0];
                p.fromText = values[1];

                p.makeNewUser();
                stage.update();
            }
        }


        backAndForth()


        return


    }

    App.prototype.makeNewUser = function () {
        var names = firebase.database().ref("magneticPoetry");
        var key = names.push().key;
        var update = {};
        if (p.sendObj == undefined) p.sendObj = {};
        update[key] = { "date": new Date(), "key": key, "sendObj": p.sendObj };
        var result = names.update(update);
        result.then(function () {
            p.nowKey = key;
            // p.sendImageToServer();
            p.fromEdit = false;

            p.isLoad();

            if (p.setNewUser) {
                loop(p.brick_arr, function (brick) {
                    brick.status = "";
                    brick.mouse();
                    brick.cur();
                    brick.textInto_txt.text = "";
                });
                p.signature_obj = {};
                p.first = true;
                p.haveData(p.snap);
                p.setNewUser = false;
                p.clearBrick();
            }
            ////	console.log("great", key);

            stage.update();
        }).catch(function (error) {
            console.log("bad", error);
        })
    }

    App.prototype.removeAll = function () {

    }


    App.prototype.getPassword = function (e) {
        Swal.fire({
            title: p.mainAssets.managerSetting.texts.enterPassword,
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },

            allowEscapeKey: false,
            allowOutsideClick: false,

            showCancelButton: true,
            reverseButtons: p.mainAssets.managerSetting.texts.reverseButtons,
            confirmButtonText: p.mainAssets.managerSetting.texts.confirmButtonText,
            cancelButtonText: p.mainAssets.managerSetting.texts.cancelButtonText,
        }).then((result) => {
            if (result.value == p.mainAssets.managerSetting.texts.password) {
                p.setNewUser = true;
                p.showOpenGroup();
            } else {
                Swal.fire(
                    {
                        icon: 'warning',
                        title: p.mainAssets.managerSetting.texts.notRightPassword
                    });
            }
        })
    }

    App.prototype.signature = function () {
        var p = this;
        //p.saveSignature();
        //return;

        var p = this;
        const steps = [
            {
                number: 0,
                input: 'text',
                inputValue: p.signatureNameText ? p.signatureNameText : '',
                title: 'השם שלכם',
                text: 'השם המלא שלכם שיופיע בעצומה',
                inputAttributes: { 'aria-label': "" }
            },

            {
                number: 1,
                inputValue: p.signatureCityText ? p.signatureCityText : '',
                input: 'text',
                text: "הקלידו את מקום המגורים",
                title: 'מהיכן אתם'
            }


        ];

        const swalQueueStep = Swal.mixin({
            confirmButtonText: 'הבא',
            reverseButtons: true,
            cancelButtonText: 'הקודם',
            confirmButtonColor: "#2B2C69",
            validationMessage: 'חובה למלא את השדה',
            progressSteps: steps,

            input: 'text',
            allowEscapeKey: true,
            allowOutsideClick: true,
            reverseButtons: true,
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'
        });

        async function backAndForth() {
            const values = [p.groupNameText, p.fromText, p.fullText];
            let currentStep

            for (currentStep = 0; currentStep < steps.length;) {
                const result = await swalQueueStep.fire({
                    title: steps[currentStep].title,
                    input: steps[currentStep].input,
                    progressStepsDistance: "50px",
                    inputAttributes: steps[currentStep].inputAttributes,
                    inputValue: values[currentStep] ? values[currentStep] : '',
                    showCancelButton: currentStep > 0,

                    progressSteps: ["1", "2"],
                    inputPlaceholder: steps[currentStep].inputPlaceholder ? steps[currentStep].inputPlaceholder : '',
                    text: steps[currentStep].text,
                    currentProgressStep: steps[currentStep].number
                })

                if (result.value) {
                    values[currentStep] = result.value;
                    currentStep++;
                } else if (result.dismiss === 'cancel') {
                    currentStep--;
                } else {
                    break
                }
            }

            if (currentStep === steps.length) {
                //Swal.fire(JSON.stringify(values))

                p.signatureNameText = values[0];
                p.signatureCityText = values[1];

                p.saveSignature();
                stage.update();
            }
        }

        backAndForth()


        return



    }


    App.prototype.ChangeUrl = function (page, url) {

        if (typeof (history.pushState) != "undefined") {
            var obj = { Page: page, Url: url };
            history.pushState(obj, obj.Page, obj.Url);
        } else {
            window.location.href = "http://closeapp.co.il/apps/greeting/roshHashana/";
            // alert("Browser does not support HTML5.");
        }
    }


    App.prototype.isLoad = function () {
        var s = location.href;
        var addChar = "?";
        queryString.id = p.nowKey;



        var str = Object
            .keys(queryString)
            .map(k => k + '=' + queryString[k])
            .join('&');

        str = "?" + str;
        p.ChangeUrl(str, str);



        var currentLocation = window.location.href;

        p.showShareButton();
        //showSwal({ shareText: ' הברכה מוכנה, כעת ניתן לשלוח אותה ולשתף לחברים, העתיקו את הכתובת והדביקו בשביל לשתף ' + "\n" + currentLocation })


    }

    App.prototype.showShareButton = function () {


        // p.smallButtons.share_btn.visible = true;
        // p.smallButtons.signature_count.visible = true;
        // p.smallButtons.signature_btn.theText.text = p.smallButtons.signature_btn.theText.StartText;

        var currentLocation = window.location.href;
        var shareText = ' בואו לחתום על העצומה שלי! ';
        if (p.mainAssets.gameView.texts) {
            shareText = p.mainAssets.gameView.texts.shareText;
        }
        showSwal({ shareText: shareText + "\n" + currentLocation })

        stage.update();

        // p.createNewButton.addTo(stage)
    }


    App.prototype.initializeFireBase = function () {
        // Initialize Firebase

        var config = {
            apiKey: "AIzaSyCBtZZH_hvPvEkUptWGQMn1AmVGTUBOZqY",
            authDomain: "greeting-512b8.firebaseapp.com",
            databaseURL: "https://greeting-512b8.firebaseio.com",
            projectId: "greeting-512b8",
            storageBucket: "greeting-512b8.appspot.com",
            messagingSenderId: "61543385280",
            appId: "1:61543385280:web:9cff0e108ab066972e0525"
        }

        firebase.initializeApp(config);

        var dbRef = firebase.database();
        p.haveData(dbRef);



    }


    App.prototype.showEditMode = function () {
        if (p.editCon) {
            p.editWin.dispose();
            p.editWin = null;
            p.editCon.dispose();
            p.editCon = null;
        }
        p.editCon = new Container(stageW, stageH);
        var bg = new Rectangle(stageW, stageH);
        p.editCon.bg = bg;
        p.editCon.editMode = "edit";
        bg.addTo(p.editCon)
        p.editWin = p.buildWordList(stageW - 100, stageW, stageH, false);




        // (470,p.fridgeCon.bottomRect.width + 20,p.fridgeCon.bottomRect.height,true)
        p.editWin.addTo(p.editCon)
        p.editCon.addTo();


        p.addWordButtton = new Button({ label: "X", width: 50, backgroundColor: gray });
        p.addWordButtton.addTo(p.editCon).pos({
            "horizontal": "right",
            "vertical": "top",
            "x": 20,
            "y": 10
        });
        p.addWordButtton.on("mousedown", function () {
            location.reload();
        })

        p.addWordButtton = new Button({ label: "New word", width: 150, backgroundColor: green });
        p.addWordButtton.addTo(p.editCon).pos({
            "horizontal": "right",
            "vertical": "bottom",
            "x": 20,
            "y": 10
        });
        p.addWordButtton.on("mousedown", function () {
            p.addWordToJson(true);
        })


        p.updateJsonButtton = new Button({ label: "Save", width: 150, backgroundColor: red });
        p.updateJsonButtton.addTo(p.editCon).pos({
            "horizontal": "center",
            "vertical": "bottom",
            "x": 20,
            "y": 10
        });
        p.updateJsonButtton.on("mousedown", function () {
            upadteJson({ "words": p.words });
        })


        p.removeButtton = new Button({ label: "Remove", width: 150, backgroundColor: red });
        p.removeButtton.addTo(p.editCon).pos({
            "horizontal": "left",
            "vertical": "bottom",
            "x": 20,
            "y": 10
        });
        p.removeButtton.on("mousedown", function () {
            if (p.editCon.editMode == "edit") {
                p.editCon.editMode = "remove";
                p.editCon.bg.color = red;
            } else {
                p.editCon.editMode = "edit";
                p.editCon.bg.color = "#000000";
            }
            stage.update();
        })


        stage.update();
    }


    App.prototype.removeWordFromJson = function (text) {
        var p = this;
        p.words = p.words.filter(e => e.text !== text)
        zog(p.words)
        p.showEditMode();
    }
    App.prototype.addWordToJson = function (newWord, text) {
        if (newWord) {
            text = "";
        }
        Swal.fire({
            title: 'Please Enter The Word',
            input: "text",
            text: text,
            inputPlaceholder: 'Please Enter The Word',
            allowOutsideClick: false,
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off',
                inputmode: '$inputmode'
            },
            showLoaderOnConfirm: true,
            preConfirm: (textFromUser) => {
                if (newWord) {
                    p.words.push({ text: textFromUser });

                } else {
                    loop(p.words, function (data) {
                        if (data.text == text) {
                            data.text = textFromUser;
                            return "break";
                        }

                    })
                }
                zog(p.words)
                //upadteJson(p.words);
                p.showEditMode();
            },
        });


    }
    App.prototype.buildWordList = function (wrapperWidth, winWidth, winHeight, gameMode) {
        var p = this;
        var tempCon = new Container();
        var arr = [];
        var colors = ["#F8E9DC", "#F2E6DF", "#D5E5E3", "#EFE7F3", "#DBF2EE", "#E4EEDC", "#DDE8FA"
            , "#F5D4D4", "#FCF6DA", "#E5E6FA", "#F9E5C7"];


        var colorFun = Pick.series(colors);
        loop(p.words, function (wordObj, i) {

            js.helper.DisplayObjectFromJson.buildView(p.mainAssets.magnet, tempCon);

            var magnetCon = tempCon.magnetCon;
            magnetCon.coundId = i;
            magnetCon.data = wordObj;
            magnetCon.label.text = wordObj.text;
            magnetCon.bgRect.color = colorFun();
            magnetCon.bgRect.widthOnly = magnetCon.label.width * 1.2;
            if (gameMode) {
                magnetCon.drag({ all: true });
                /*magnetCon.gesture({
                    rotate:false,
                    rect:new Boundary(0,0,stageW,stageH),
                    minScale:.5,
                    maxScale:3
                 });*/

            }
            arr.push(magnetCon);
            magnetCon.on("mousedown", function () {
                if (gameMode) {
                    p.startActiveTimer();
                    magnetCon.sca(2);
                    p.hideSearch();
                    magnetCon.addTo(stage);
                    if (magnetCon.startObj.isTop != true) {
                        p.fridgeCon.topMarkView.visible = true;
                    }

                    magnetCon.stagemouseupEvent = stage.on("stagemouseup", function () {
                        stage.off("stagemouseup", magnetCon.stagemouseupEvent);
                        p.fridgeCon.topMarkView.visible = false;
                        magnetCon.sca(1);
                        if (magnetCon.hitTestBounds(p.fridgeCon.topRect)) {
                            magnetCon.startObj.isTop = true;
                            magnetCon.startObj.newX = magnetCon.x;
                            magnetCon.startObj.newY = magnetCon.y;
                            p.itemPlaceObj[magnetCon.coundId] = magnetCon.startObj;

                        } else {
                            magnetCon.startObj.isTop = false;
                            magnetCon.addTo(magnetCon.startParent);
                            p.itemPlaceObj[magnetCon.coundId] = magnetCon.startObj;
                            magnetCon.loc(magnetCon.startObj.x, magnetCon.startObj.y);
                        }

                         //https://nonsensefridge.com/Notify.php?title=HI&body=guys
                       
                            let data = {title: "Fridge was edited since your last visit",body:"Click here to view the fridge"};

                            fetch("https://nonsensefridge.com/Notify.php", {
                                method: "POST",
                                headers: {'Content-Type': 'application/json'}, 
                                body: JSON.stringify(data)
                            }).then(res => {
                                console.log("Request complete! response:", res);
                            }).catch((error) => {
                                zogr('Error:', error);
                              });
                        

                        p.updateSendObj();
                    })
                } else {
                    if (p.editCon.editMode == "edit") {
                        p.addWordToJson(false, magnetCon.label.text);
                    } else {
                        p.removeWordFromJson(magnetCon.label.text);
                    }

                    //upadteJson();
                }
            })
        });

        var conWrapper = new Container();
        var wrapper = new Wrapper({
            items: arr,
            width: wrapperWidth,
            spacingH: 15,
            spacingV: 20,
            valign: "center",
            align: "left"
        });
        wrapper.name = "wrapper";

       


        var wrapper2 = new Wrapper({
            items: [],
            width: wrapperWidth,
            spacingH: 15,
            spacingV: 20,
            valign: "center",
            align: "left"
        });
        wrapper2.name = "wrapper2";

        wrapper.addTo(conWrapper).mov(0, 20);
        wrapper2.addTo(conWrapper).mov(0, 20);
        var rectForDrag = new Rectangle(conWrapper.width, conWrapper.height + 40, "rgba(0,0,0,0.01)");
        rectForDrag.addTo(conWrapper, 0);
        // wrapper.center().mov(0,70);
        stage.update();


        if (gameMode) {

            p.itemPlaceObj = {};
            p.itemsObj = {};
            loop(arr, function (magnetCon) {
                if (magnetCon.startObj == undefined) {
                    magnetCon.startParent = magnetCon.parent;
                    magnetCon.startObj = { x: magnetCon.x, y: magnetCon.y, rotation: magnetCon.rotation, coundId: magnetCon.coundId };
                    p.itemPlaceObj[magnetCon.coundId] = magnetCon.startObj;
                    p.itemsObj[magnetCon.coundId] = magnetCon;
                }
            })
        }



        var win = new Window({
            backgroundColor: "rgba(0,0,0,0.01)",
            width: winWidth,
            height: winHeight,
            interactive: true,
            padding: 0,
            slideDamp: .2
        });
        conWrapper.wrapper = wrapper;
        conWrapper.wrapper2 = wrapper2;
        win.conWrapper = conWrapper;
        win.add(conWrapper);

        return win;


    }




    this.initialize();

}

js.App = App;
zim.extend(js.App, zim.Container);


function showSwal(obj) {
    var currentLocation = window.location.href;
    var shareText
    var shareTheGameTitle = "שתפו את המשחק :)";
    var cancelButtonText = 'שיתפתי!';
    var confirmButtonText = 'העתקת קישור';
    var titleAfterCopy = 'הקישור הועתק';
    var textAfterCopy = "שתפו את הקישור :)";

    if (mainAssets.gameView.texts) {
        shareTheGameTitle = mainAssets.gameView.texts.shareTheGameTitle;
        cancelButtonText = mainAssets.gameView.texts.cancelButtonText;
        confirmButtonText = mainAssets.gameView.texts.confirmButtonText;
        titleAfterCopy = mainAssets.gameView.texts.titleAfterCopy;
        textAfterCopy = mainAssets.gameView.texts.textAfterCopy;

    }
    if (obj) {
        shareText = obj.shareText;
    }
    nowText = shareText;
    zog("currentLocation", currentLocation)
    var html = "" + "<a href='https://www.facebook.com/sharer/sharer.php?u=" + currentLocation + "&quote" + shareText + "' target='_blank'><img src='assets/facebook.png'></a><span>   </span>";
    html += "<a href=' https://api.whatsapp.com/send?text=" + encodeURIComponent(shareText) + "' target='_blank'><img src='assets/whatsapp.png'></a><span>   </span>";
    html += "<a onclick=tweetCurrentPage()><img src='assets/twitter.png'></a><span>   </span>";
    html += "<br><input  cols='40' rows='5' id='theCopyElement' type='text' value='" + shareText + "'></input><span>   </span>";


    Swal.fire({
        /*title: 'איזה כיף!',*/
        title: shareTheGameTitle,
        html: html,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#7100d1',
        cancelButtonText: cancelButtonText,
        confirmButtonText: confirmButtonText,
        confirmButtonAriaLabel: 'Thumbs up, great!',
    }).then((result) => {
        if (result.value) {
            copyFunction("theCopyElement");
            Swal.fire({
                title: titleAfterCopy,
                text: textAfterCopy,
            });
        }
    })

}


function tweetCurrentPage() {
    window.open(
        "https://twitter.com/share?url=" + window.location.href
        + "&text=" + nowText +
        + "&hashtags=musiclick"
        ,
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    );
    return false;
}

function copyFunction(theCopyElement) {
    /* Get the text field */
    var copyText = document.getElementById(theCopyElement);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

}



function askPassword(p) {
    Swal.fire({
        title: 'Enter Password',
        input: "password",
        showCloseButton: true,
        inputPlaceholder: 'Please Enter Password',
        allowOutsideClick: false,
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off',
            inputmode: '$inputmode'
        },
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://nonsensefridge.com/checkPassword.php', true);


            xhr.onreadystatechange = function () { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    debugger
                    if (JSON.parse(xhr.response).message == "true") {
                        p.showEditMode();
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: "Incorrect password"
                        }
                        )
                    }

                }
            }

            xhr.send(JSON.stringify({
                "password": password

            }))
            /*if (password == "123") {
                zog("OK")
                p.showEditMode();
            } else {
                Swal.showValidationMessage(
                    "Incorrect password"
                )
            }*/
            /* let data = new FormData();
             data.append("password", password)
             data.append("partner", "$gameId");
             return fetch("password.php", {
                 method: "POST",
                 body: data
             }).then(response => {
                 if (!response.ok) {
                     throw new Error("סיסמא לא נכונה")
                 }
                 location.reload();
                 return true;
             })
                 .catch((error) => {
                     Swal.showValidationMessage(
                         error
                     )
                 })*/
        },
    });
}

function upadteJson(dataJson) {
    Swal.fire({
        title: 'Enter Password',
        input: "password",
        inputPlaceholder: 'Please Enter Password',
        allowOutsideClick: false,
        showCloseButton: true,
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off',
            inputmode: '$inputmode'
        },
        showLoaderOnConfirm: true,
        preConfirm: (password) => {

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://nonsensefridge.com/jsonSaver.php', true);


            xhr.onreadystatechange = function () { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    //document.write(xhr.response)
                    Swal.fire(
                        xhr.response
                    )
                }
            }

            xhr.send(JSON.stringify({
                "filename": "assets/words.json",
                "password": password,
                "content": JSON.stringify(dataJson),
                "upload": true

            }))

            /* let data = new FormData();
             data.append("password", password)
             data.append("filename", "ami.json");
             data.append("upload", true);
             data.append("content", JSON.stringify({ami:1234}));
             return fetch("https://closeapp.co.il/apps/tests10/magnetic/jsonSaver.php", {
            
                 method: "POST",
                 body: data
                 
             }).then(response => {
                 debugger
                 if (!response.ok) {
                      Swal.showValidationMessage(
                        "Incorrect password "
                    )
                     throw new Error("סיסמא לא נכונה");
                 }else{
                    Swal.showValidationMessage(
                        "the data update"
                    )
                 }
                // location.reload();
                 return true;
             })
                 .catch((error) => {
                     Swal.showValidationMessage(
                         error
                     )
                 })/**/
        },
    });


}