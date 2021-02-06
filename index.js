$(document).ready(function () {
    //clock
    setInterval(Clock, 1000);
    function Clock() {
        var date = new Date();
        var L = date.toLocaleTimeString();
        var Z = date.toLocaleTimeString("en-GB", { timeZone: "UTC" });
        $("#Ztime").html(Z).val();
        $("#Ltime").html(L).val();
    }
    //default time entrys into the time array +1hr and +2hrs of current time
    Date.prototype.formatMMDDYYYY = function () {
        return ("0" + (this.getMonth() + 1)).slice(-2) + "/" + ("0" + this.getDate()).slice(-2) + "/" + this.getFullYear();
    };
    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + h * 60 * 60 * 1000);
        return this;
    };
    var oneHR = new Date().addHours(1);
    var twoHR = new Date().addHours(2);
    var UTC1hr = ("0" + (oneHR.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + oneHR.getUTCDate()).slice(-2) + "/" + oneHR.getUTCFullYear() + " " + ("0" + oneHR.getUTCHours()).slice(-2) + ":" + ("0" + oneHR.getMinutes()).slice(-2) + ", ";
    var UTC2hr = ("0" + (twoHR.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + twoHR.getUTCDate()).slice(-2) + "/" + twoHR.getUTCFullYear() + " " + ("0" + twoHR.getUTCHours()).slice(-2) + ":" + ("0" + twoHR.getMinutes()).slice(-2) + ", ";
    $("#TIMEarray").val(function () {
        return UTC1hr + UTC2hr;
    });
    //PARSE ICAO ARRAY
    $("#icaoSORT").on("click", function () {
        $("#clear").click();
        var id = $("#ICAOarray")[0].value;
        var icaoS = id.split(", ");
        let last = icaoS.pop();
        $.each(icaoS, function (rowIdx, icaoV) {
            var icaoX = "#icao" + rowIdx;
            $(icaoX).val(function () {
                $("#addBtn").click();
                return icaoV;
            });
        });
        var icaoX = "#icao" + rowIdx;
        $(icaoX).val(function () {
            return last.replace(",", "");
        });
    });
    //PARSE TIME ARRAY
    $("#timeSORT").on("click", function () {
        var e = $.Event("keydown", { keyCode: 13 });
        var id = $("#TIMEarray")[0].value;
        var MDYT = id.split(", ");
        $.trim(MDYT);
        $.each(MDYT, function (rowIdx, DandT) {
            var dateV = DandT.split(" ");
            let timeV = dateV.pop();
            var dateX = "#date" + rowIdx;
            var timeX = "#time" + rowIdx;
            $(dateX).val(function () {
                return dateV;
            });
            $(timeX).val(function () {
                return timeV.replace(",", "");
            });
            $(timeX).trigger(e);
        });
    });
    //DYNAMIC TABLE GENERATION
    $("#addBtn").on("click", function () {
        $("#tbody").append(`
			<tr class="subrow" id="R${++rowIdx}">
				<td class="row-index">
                    <input class="icao" id="icao${rowIdx}" size=4 maxlength="4" type="text" placeholder="ICAO" autocomplete="off" />
                    <input class="datepicker" id="date${rowIdx}" size=12 autocomplete="off" />
                    <div class='tacocat' >
                        <button class="btn up" id="dateup" ></button> 
                        <button class="btn down" id="datedown" ></button> 
                    </div>
                    <input class="timepicker" maxlength="4" size="4" id="time${rowIdx}" autocomplete="off" />
                    <div class='tacocat' >
                        <button class="btn up" id="timeup" ></button> 
                        <button class="btn down" id="timedown" ></button> 
                    </div>
                    <button class="getWX btn-primary btn-sm" type="button" >getWX</button>
                    <button class="getMEAT btn-primary btn-sm">Meteogram</button>
                    <button class="getPADWP btn-primary btn-sm">Air Drop</button>                   
                    <button class="openW btn-primary btn-sm">Open Windows</button>
                    <button class="remove btn-danger btn-sm" id="remove" type="button">Remove</"button">
				</td>
            </tr>`);
        var dateid = "#date" + rowIdx;
        $(dateid).addClass("datepicker");
        $(".datepicker").datepicker({
            inline: true
        });
        //CONSIDER A FEATURE WHEN A NEW ROW IS ADDED THE DATE PICKER ASSUMES THE DATE OF THE PREVIOUS
        $(".datepicker").datepicker("setDate", new Date());
        $("#dialog-link, #icons li").hover(
            function () {
                $(this).addClass("ui-state-hover");
            },
            function () {
                $(this).removeClass("ui-state-hover");
            }
        );
        var newdate = new Date();

        $("input.timepicker").timepicker({
            timeFormat: "HH:mmZ",
            interval: 15,
            defaultTime: new Date(),
            minTime: "00:00Z",
            maxTime: "2359Z",
            dynamic: false,
            dropdown: false,
            scrollbar: false
        });
    });
    //REMOVE A SINGLE ROW FROM THE DYNAMIC TABLE
    $("#tbody").on("click", ".remove", function () {
        var child = $(this).closest("tr").nextAll();
        child.each(function () {
            var id = $(this).attr("id");
            var dig = parseInt(id.substring(1));
            var rowIndex = $(this).children(".row-index");
            var inputs = rowIndex.children(":input");
            var icao = inputs.siblings(".icao");
            var date = inputs.siblings(".datepicker");
            var time = inputs.siblings(".timepicker");
            icao.attr("id", `icao${dig - 1}`);
            date.attr("id", `date${dig - 1}`);
            time.attr("placeholder", `row${dig - 1}`).attr("id", `time${dig - 1}`);
            $(this).attr("id", `R${dig - 1}`);
        });
        $(this).closest("tr").remove();
        rowIdx--;
    });
    //INT DATEPICKER
    $(".datepicker").datepicker({
        inline: true
    });
    $("#dialog-link, #icons li").hover(
        function () {
            $(this).addClass("ui-state-hover");
        },
        function () {
            $(this).removeClass("ui-state-hover");
        }
    );
    $(".datepicker").datepicker("setDate", new Date());
    //SET ALL DATES FOR TODAY
    $("#today").on("click", function () {
        $(".datepicker").datepicker("setDate", new Date());
    });
    //SET ALL DATES FOR TOMORROW
    $("#tomorrow").on("click", function () {
        var a = new Date(new Date().valueOf() + 1000 * 3600 * 24);
        $(".datepicker").datepicker("setDate", new Date(a));
    });
    //REMOVE ALL ROWS FROM THE DYNAMIC TABLE
    $("#clear").on("click", function () {
        $(".subrow").remove();
        rowIdx = 0;
    });
    //ADD ONE DAY
    $("#tbody").on("click", "#dateup", function () {
        var child = $(this).closest("div").nextAll();
        var datepicker = child.siblings(".datepicker");
        var date = new Date($(datepicker).val());
        var d = date.setDate(date.getDate() + 1);
        $(datepicker).datepicker("setDate", new Date(d));
    });
    //REMOVE ONE DAY
    $("#tbody").on("click", "#datedown", function () {
        var child = $(this).closest("div").nextAll();
        var datepicker = child.siblings(".datepicker");
        var date = new Date($(datepicker).val());
        var d = date.setDate(date.getDate() - 1);
        $(datepicker).datepicker("setDate", new Date(d));
    });
    //ADD FIFTEEN MINS
    $("#tbody").on("click", "#timeup", function () {
        var e = $.Event("keydown", { keyCode: 13 });
        var child = $(this).closest("div").nextAll();
        var timepicker = child.siblings(".timepicker");
        var time = $(timepicker).val().slice(0, -1);
        var dt = new Date(new Date("1970/01/01 " + time).getTime() + 15 * 60000);
        var timeX = dt.getHours() + ":" + dt.getMinutes();
        $(timepicker).val(function () {
            return timeX;
        });
        $(timepicker).trigger(e);
    });
    //REMOVE FIFTEEN MINS
    $("#tbody").on("click", "#timedown", function () {
        var e = $.Event("keydown", { keyCode: 13 });
        var child = $(this).closest("div").nextAll();
        var timepicker = child.siblings(".timepicker");
        var time = $(timepicker).val().slice(0, -1);
        var dt = new Date(new Date("1970/01/01 " + time).getTime() - 15 * 60000);
        var timeX = dt.getHours() + ":" + dt.getMinutes();
        $(timepicker).val(function () {
            return timeX;
        });
        $(timepicker).trigger(e);
    });

    rowIdx = 0;
    //api sources https://openweathermap.org/  API: Key
    //https://mesonet.agron.iastate.edu/api/
    /*checkwxapi.com/  API key: added07f631e41398de3898efb
    ###### single station - raw METAR
    curl 'https://api.checkwx.com/metar/KJFK' -H 'X-API-Key: added07f631e41398de3898efb'

    ###### multiple stations - raw METAR
    curl 'https://api.checkwx.com/metar/KJFK,KLAX,KMIA' -H 'X-API-Key: added07f631e41398de3898efb'

    ###### single station - decoded METAR
    curl 'https://api.checkwx.com/metar/KJFK/decoded' -H 'X-API-Key: added07f631e41398de3898efb'

    ###### multiple stations - decoded METAR
    curl 'https://api.checkwx.com/metar/KJFK,KLAX,KMIA/decoded' -H 'X-API-Key: added07f631e41398de3898efb'
    */
    // REMOVE ALL DYNAMICLY GENERATED TABS
    $("#clearTABS").on("click", function () {
        $(".DTAB").remove();
        $("#AtabHOME").tab("show");
    });
    // DYNAMIC TAB GENERATION
    tabIdx = 0;
    $("#tbody").on("click", ".getWX", function () {
        var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value.toUpperCase();
        var query = {
            station: icaoID,
            model: "GFS"
        };
        $("#tabs-row").append(`
        <li class="DTAB nav-item" id="TR${++tabIdx}">
         <a class="nav-link" data-bs-toggle="tab" id="Atab${tabIdx}" href="#tabs-${tabIdx}">${icaoID}</a>
        </li>`);
        $("#tabs-content1").append(`
        <div class="DTAB tab-pane fade" id="tabs-${tabIdx}">
            <p class="tab-data" id="stn${tabIdx}" >station${tabIdx} </p>
            <p class="tab-data" id="obs${tabIdx}" >METAR:${tabIdx} </p>
            <p class="tab-data" id="taf${tabIdx}" >TAF:${tabIdx} </p>
            <p class="tab-data" id="rnt${tabIdx}" >mode & run${tabIdx} </p>
            <p class="tab-data" id="mos${tabIdx}" >MOS data${tabIdx} </p>
        </div>`);
        let url = "https://mesonet.agron.iastate.edu/api/1/mos.json?";
        var shallowEncoded = $.param(query, false);
        var shallowDecoded = decodeURIComponent(shallowEncoded, true);
        var mosURL = url.concat(shallowDecoded);
        var stnX = "#stn" + tabIdx;
        var mosX = "#mos" + tabIdx;
        //APPEND MOS DATA TO DYNAMIC TABS
        $.ajax({
            type: "GET",
            url: mosURL,
            dataType: "json",
            success: function (result) {
                var mosrun = "</STRONG>MODEL:</STRONG>" + result.data[0].model + "run" + result.data[0].runtime;
                $(stnX).append(mosrun, "</br>");
                $.each(result.data, function (_key, value) {
                    var mosdata = value.ftime + value.wdr + value.wsp + "KT" + value.vis + "SM" + value.cld + value.tmp + value.dpt;
                    $(mosX).append(mosdata, "</br>");
                });
            }
        });
        //APPEND METARS TO DYNAMIC TABS
        var obsX = "#obs" + tabIdx;
        let url1 = "https://api.checkwx.com/metar/" + icaoID;
        // console.log(url1);
        $.ajax({
            type: "GET",
            url: url1,
            headers: { "X-API-Key": "added07f631e41398de3898efb" },
            dataType: "json",
            success: function (result) {
                //console.log(result);
                var metar = result.data[0];
                $(obsX).append(metar);
            }
        });
        //APPEND TAFS TO DYNAMIC TABS
        var tafX = "#taf" + tabIdx;
        let url2 = "https://api.checkwx.com/taf/" + icaoID;
        //console.log(url2);
        $.ajax({
            type: "GET",
            url: url2,
            headers: { "X-API-Key": "added07f631e41398de3898efb" },
            dataType: "json",
            success: function (result) {
                console.log(result);
                var taf = result.data[0];
                $(tafX).append(taf);
            }
        });
        var Atab = "#Atab" + tabIdx;
        // console.log(Atab);
        $(Atab).tab("show");
    });
    /*var obsX = "#obs" + tabIdx;

        let url3 = "https://gisweather.afwa.af.mil/services/WPS?SERVICE=WPS&REQUEST=Execute&SOURCE=GALWEM&VERSION=1.0.0&IDENTIFIER=get_paw&RAWDATAOUTPUT=paw&DATAINPUTS=model_id%3DGALWEM%3BHOUR%3D0%3BLOC%3DKRAP";

        console.log(url3);
        $.ajax({
            type: "GET",
            url: url3,
           
            dataType: "text",
            success: function (result) {
                console.log(result);
                var metar = result.data[0];
                $(obsX).append(metar);
            }
        });*/

    //////////////////////////
    //Initialize select2 plugin
    ////////////////////////////
    $("#selMOA").select2();
    // Read selected option
    $("#moa_read").click(function () {
        var MOA = $("#selMOA option:selected").text();
        var latlon = $("#selMOA").val();
        $("#moa_OUT").html("location : " + MOA + ", lat/lon : " + latlon);
    });
    // Read selected option
    $("#selART").select2();
    $("#art_read").click(function () {
        var ARtrack = $("#selART option:selected").text();
        var latlon = $("#selART").val();
        $("#art_OUT").html(" name :" + ARtrack + ", lat/lon :" + latlon);
    });
    //////////////////////////////////////////////////////////////////////
    //// 															 ////
    //// 						CHECK ALL 					  		////
    //// 														   ////
    //////////////////////////////////////////////////////////////////
    $("#checkedAll").on("click", function () {
        if (this.checked) {
            $(".checkSingle").each(function () {
                this.checked = true;
            });
        } else {
            $(".checkSingle").each(function () {
                this.checked = false;
            });
        }
    });
    // jQuery Check All function
    $(".checkSingle").on("click", function () {
        if ($(this).is(":checked")) {
            var isAllChecked = 0;
            $(".checkSingle").each(function () {
                if (!this.checked) isAllChecked = 1;
            });
            if (isAllChecked == 0) {
                $("#checkedAll").prop("checked", true);
            }
        } else {
            $("#checkedAll").prop("checked", false);
        }
    });
    //https://weather.af.mil/AFW_WEBS/CrossSection/time_phased.php?
    //DIM_PLACE=KRAP@2021-02-02T16:41Z%20KGUS@2021-02-02T16:50Z
    //DIM_PLACE=KRAP@2021-02-02T16:41Z KGUS@2021-02-02T16:50Z
    //&DIM_RUN=2021-02-02T12:00:00Z
    //&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png;%20mode=8bit&WIDTH=1600&BBOX=0,0,599,299&STYLES=default&HEIGHT=1200&CRS=CRS:1&LAYERS=GALWEM_TP_Cross_Section
    //AFWEBS CROSS-SECTION
    $("#getXSEC").on("click", function () {
        var foo = "#foo";
        var bar = "#bar";
        $(".foobar").empty();
        rowIdx = 0;
        let url = "https://weather.af.mil/AFW_WEBS/CrossSection/time_phased.php?";
        $(".icao").each(function (rowIdx) {
            var icaoX = "#icao" + rowIdx;
            var dateX = "#date" + rowIdx;
            var dateY = $(dateX).val();
            var timeX = "#time" + rowIdx;
            var timeY = $(timeX).val();
            var dateandtime = dateY + " " + timeY;
            var thedate = new Date(dateandtime);
            var timeX = "#time" + rowIdx;
            var str1 = $(icaoX).val().toUpperCase() + "@" + thedate.toISOString().slice(0, -8) + "Z" + "%20";
            $(foo).append(str1);
        });
        //DIM_RUN:
        $(".SelectRun").each(function () {
            // console.log(event);
            var deconRUN = new Date().addHours(-3);
            // console.log(oneHR);
            //console.log(event.toUTCString());

            if ($("#00UTC").is(":selected")) {
                deconRUN.setUTCHours(00, 00, 00);
                runtime = "00:00Z";
            }
            if ($("#06UTC").is(":selected")) {
                deconRUN.setUTCHours(06, 00, 00);
                runtime = "06:00Z";
            }
            if ($("#12UTC").is(":selected")) {
                deconRUN.setUTCHours(12, 00, 00);
                runtime = "12:00Z";
            }
            if ($("#18UTC").is(":selected")) {
                deconRUN.setUTCHours(18, 00, 00);
                runtime = "18:00Z";
            }
            let UTCstr = deconRUN.toUTCString();
            // console.log(UTCstr);
            var thedate = new Date(UTCstr);
            var ISOdate = thedate.toISOString().slice(0, -8) + "Z&";
            $(bar).append(ISOdate);
            $("#foobar").append("A new tab has opened with a GALWEM crosssection, the model runtime is..<br> ", ISOdate);
        });

        var str = $("#foo").text();
        var str1 = str.slice(0, -3);
        var RUNTIME = $("#bar").text();

        var query = {
            DIM_PLACE: str1,
            DIM_RUN: RUNTIME
        };
        let string = {
            VERSION: "1.3.0",
            REQUEST: "GetMap",
            FORMAT: "image/png;%20mode=8bit",
            WIDTH: "1600",
            BBOX: "0," + "0," + "599," + "299",
            STYLES: "default",
            HEIGHT: 1200,
            CRS: "CRS:1",
            LAYERS: "GALWEM_TP_Cross_Section"
        };
        var Encoded1 = $.param(query, false);
        var Encoded2 = $.param(string, false);
        var Decoded1 = decodeURIComponent(Encoded1, true);
        var Decoded2 = decodeURIComponent(Encoded2, true);
        url += Decoded1 + Decoded2;
        //console.log(url);
        window.open(url);
    });
    // AFWEBS METEOGRAM
    $("#tbody").on("click", ".getMEAT", function () {
        var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value.toUpperCase();
        var model = "GALWEM";
        var duration = "36-Hour";
        var layers = "GALWEM_Meteogram_36hr_Std";
        let url = "https://gisweather.afwa.af.mil/services/WMS/?";
        //let url = "https://weather.af.mil/services/WMS/?";
        var query = {
            DIM_STATION: icaoID,
            MODEL: model,
            DURATION: duration,
            Layers: layers,
            portland: "port",
            BBOX: "0%2C0%2C1%2C1",
            SERVICE: "WMS",
            REQUEST: "GetMap",
            CRS: "CRS%3A1",
            FORMAT: "image%2Fpng%3B+mode%3D8bit",
            VERSION: "1.3.0",
            HEIGHT: 1685,
            WIDTH: 1148
        };
        var Encoded = $.param(query, false);
        var Decoded = decodeURIComponent(Encoded, true);
        url += Decoded;
        window.open(url);
    });
    //https://weather.af.mil/services/WPS?
    //lowlevel
    //SERVICE=WPS&REQUEST=Execute&SOURCE=GALWEM&VERSION=1.0.0&IDENTIFIER=get_paw&RAWDATAOUTPUT=paw&DATAINPUTS=model_id%3DGALWEM %3B VERS %3 DLL %3B HOUR%3D0%3BLOC%3DKRAP
    //full
    //SERVICE=WPS&REQUEST=Execute&SOURCE=GALWEM&VERSION=1.0.0&IDENTIFIER=get_paw&RAWDATAOUTPUT=paw&DATAINPUTS=model_id%3DGALWEM %3B HOUR%3D0%3BLOC%3DKRAP
    $("#tbody").on("click", ".getPADWP", function () {
        var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value.toUpperCase();
        var model = "GALWEM";
        let url = "https://weather.af.mil/services/WPS?";
        var query = {
            model_id: model,
            HOUR: "0",
            LOC: icaoID
        };
        //%3DGALWEM %3B VERS %3 DLL %3B
        var str = $.param(query, false);
        var decoded = str.replace(/\&/g, ";"); //whats the better way of formating a JS object with a ';' rather than '&'
        var datainputs = encodeURIComponent(decoded, true);
        var string = {
            SERVICE: "WPS",
            REQUEST: "Execute",
            SOURCE: "GALWEM",
            VERSION: "1.0.0",
            IDENTIFIER: "get_paw",
            RAWDATAOUTPUT: "paw",
            DATAINPUTS: datainputs
        };
        var Encoded = $.param(string, false);
        var Decoded = decodeURIComponent(Encoded, true);
        url += Decoded;
        window.open(url);
        // console.log(url);
    });
    //precision air drop wind profile -- low level
    //https://weather.af.mil/services/WPS?SERVICE=WPS&REQUEST=Execute&SOURCE=GALWEM&VERSION=1.0.0&IDENTIFIER=get_paw&RAWDATAOUTPUT=paw&DATAINPUTS=model_id%3DGALWEM%3BHOUR%3D0%3BLOC%3DKRAP
    //precision air drop wind profile
    //https://weather.af.mil/services/WPS?SERVICE=WPS&REQUEST=Execute&SOURCE=GALWEM&VERSION=1.0.0&IDENTIFIER=get_paw&RAWDATAOUTPUT=paw&DATAINPUTS=model_id%3DGALWEM%3BHOUR%3D0%3BLOC%3DKRAP
    $("#tbody").on("click", ".openW", function () {
        if ($("#checkOBS").is(":checked")) {
            var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value;
            let url = "https://aviationweather.gov/metar/data?";
            // console.log(icaoID);
            var query = {
                ids: icaoID
            };
            let string = {
                format: "raw",
                date: "",
                hours: ""
            };
            var shallowEncoded1 = $.param(query, false);
            var shallowDecoded1 = decodeURIComponent(shallowEncoded1, true);
            var shallowEncoded2 = $.param(string, false);
            var shallowDecoded2 = decodeURIComponent(shallowEncoded2, true);
            var obs = url.concat(shallowDecoded1, "&", shallowDecoded2);
            //console.log(obs);
            window.open(url);
        }
        if ($("#checkTAFS").is(":checked")) {
            var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value;
            let url = "https://aviationweather.gov/metar/data?";
            var query = {
                ids: icaoID
            };
            let string = {
                format: "raw",
                date: "",
                hours: ""
            };
            var shallowEncoded1 = $.param(query, false);
            var shallowDecoded1 = decodeURIComponent(shallowEncoded1, true);
            var shallowEncoded2 = $.param(string, false);
            var shallowDecoded2 = decodeURIComponent(shallowEncoded2, true);
            var obs = url.concat(shallowDecoded1, "&", shallowDecoded2);
            //console.log(obs);
            //window.open(url)
        }
        if ($("#checkMGRAM").is(":checked")) {
            let url = "https://aviationweather.gov/metar/data?";
            var icaoID = $(this).closest(".row-index").children("input:first-child")[0].value;
            var query = {
                ids: icaoID
            };
            let string = {
                format: "raw",
                date: "",
                hours: ""
            };
            var shallowEncoded1 = $.param(query, false);
            var shallowDecoded1 = decodeURIComponent(shallowEncoded1, true);
            var shallowEncoded2 = $.param(string, false);
            var shallowDecoded2 = decodeURIComponent(shallowEncoded2, true);
            var obs = url.concat(shallowDecoded1, "&", shallowDecoded2);
            //console.log(obs);
            window.open(url);
        } else {
            return;
        }
    });
    $(".SelectRun").each(function () {
        var event = new Date(Date.now());

        if (event.getUTCHours() > 03 && event.getUTCHours() <= 08) {
            $(".SelectRun").val("0");
        }

        if (event.getUTCHours() > 09 && event.getUTCHours() <= 14) {
            $(".SelectRun").val("1");
        }

        if (event.getUTCHours() > 15 && event.getUTCHours() <= 20) {
            $(".SelectRun").val("2");
        }

        if (event.getUTCHours() > 21) {
            $(".SelectRun").val("3");
        }
        if (event.getUTCHours() <= 02) {
            $(".SelectRun").val("3");
        }
    });
    //timepicker
    $("input.timepicker").timepicker({
        timeFormat: "HH:mmZ",
        interval: 15,
        defaultTime: "00:00Z",
        minTime: "00:00Z",
        maxTime: "23:59Z",
        dynamic: false,
        dropdown: false,
        scrollbar: false
    });
});
