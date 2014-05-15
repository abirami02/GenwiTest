/*==BEGIN=============================*header.js*================*/
/*
 * Default toolbar template JS.
 * html : header.html
 * device : tablet/smartphone
 * *********/
var articleVisits = 0;
Genwi.Template.copy_of_app_header = Genwi.Template.Toolbar.extend({

    pageControls: 99,

    buildModel: function() {
        var ua = navigator.userAgent.toLowerCase();
        var isiPhone = /iphone/i.test(ua);
        if (this.oJson !== null && !$.isEmptyObject(this.oJson)) {
            this.model.title = this.oJson.title;
            this.model.color = this.oJson.color;
            this.model.item_id = this.oJson.item_id;
            this.model.link = baseUrl + "sections/" + network_id;
            this.model.favIconRequired = Genwi.templateSettings.toolbar.article.favIconRequired;
        }
    },

    onAfterDraw: function() {

        var me = this;
        var ua = navigator.userAgent.toLowerCase();
        var isiPhone = /iphone/i.test(ua);
        me.setBodyPosition();

        if (this.oJson !== null && !$.isEmptyObject(this.oJson)) {
            var type = $.trim(this.oJson.type.toLowerCase());
            if (type === "article") {
                if (pageName === "html5") {
                    $(".share,.favorite").show();
                    $('#btnContainer').show();
                    if (window.innerWidth > 700) {
                        $("#btnContainer").css('width', '10em');
                        $(".share").hide();
                        $(".favorite").css("right", "10px");
                    } else {
                        $(".share").hide();
                        $(".favorite").css("right", "10px");
                    }
                } else {
                    $('#btnContainer').removeClass('btnMenu').addClass('btnBack').attr('href', 'http://appsurl/back');
                    $(".share,.favorite").show();
                    $('#titleContainer').addClass("ellip");

                    if (this.device.isIphone || this.device.isAndroidSmartPhone) {
                        $('#titleContainer').show();
                    } else {
                        if (window.innerWidth > 500) {

                            $("#btnContainer").css('width', '10em');
                        } else {
                            $('#titleContainer').hide();
                        }
                    }
                }
                if (this.device.isNativeApp) {
                    $('#titleContainer h1').css({
                        "text-align": "left"
                    });
                    if (window.innerWidth > 700) {
                        $('#titleContainer h1').css({
                            "float": "left",
                            "padding-left": "40px"
                        });
                    }
                }
                me.isFavArticle();
            } else if (type === "articles" || type === "categories" || type === "favorites") {
                $('#btnContainer').removeClass('btnBack').addClass('btnMenu').attr('href', baseUrl + 'sections/' + network_id);
                $('.share, .favorite').hide();
                $(".btnMenu").show();
                $('#titleContainer').removeClass("ellip");
                $('#titleContainer h1').css({
                    "text-align": "center"
                });
                if (window.innerWidth > 700) {
                    $('#titleContainer h1').css({
                        "float": "none",
                        "padding-left": "0.2em"
                    });
                }
            }

            if (type === "categories" || type === "favorites" || type === "article") {
                $('#sectionLabel').css('height', '0');
            }
            var title = this.oJson.title.toLowerCase();
            if (title == "saved items" || title == "search" || type === "article" || type == "categories") {
                if ($(".incScrollLoader").length) {
                    $("").superScroll("disable");
                }
            }
        }

        $('#titleContainer h1').bind('click', function(e) {
            if (type === "article" && pageName != "html5") {
                oIP.navigate("http://appsurl/back");
            }
        });

        $('.share', me.context).bind('click', function(e) {
            e.preventDefault();
            oIP.navigate('http://appsurl/trigger/displayShareMenu');
        });
        $('.favorite', me.context).bind('click', function(e) {
            e.preventDefault();
            if (pageName !== 'html5') {
                oIP.navigate('http://appsurl/' + me.model.nextaction + '?item_id=' + me.model.item_id + '&callback=toggleFavorite');
            } else { //For handling html5 apps.
                var deviceInfo = GW.App.deviceObj,
                    response;
                if (me.model.nextaction === 'addFav') {
                    response = _addFavorite(network_id, me.model.item_id, deviceInfo.device_id);
                } else {
                    response = _removeFavorite(network_id, me.model.item_id, deviceInfo.device_id);
                }
                if (response === 'success') {
                    me.toggleFavorite({
                        result: true
                    });
                }
            }
        });
        if (pageName == "html5") {
            $(".favorite", this.context).remove();
            if (oIP.appSettings["adMob"]) {
                me.triggerAd();
            }
        }

        if (window.innerWidth < 600) {
            if (type === "article") {
                $("#appTitle", this.context).css("width", "190px");
            } else {
                $("#appTitle", this.context).css("width", "220px");
            }
        }

    },

    triggerAd: function() {
        var self = this,
            ad, adclass = "";
        if (window.innerWidth > 760 && oIP.appSettings) {
            ad = oIP.appSettings["adMob"];
            adclass = "bottomHTML5AdTablet";
        } else if (oIP.appSettings) {
            ad = oIP.appSettings["adMob"];
            adclass = "bottomHTML5AdSmartphone";
        } else {
            return;
        }
        $("." + adclass).remove();
        $("body").append("<div class='" + adclass + "'></div>").css("padding-bottom", ad.height + "px");
        $("." + adclass).dfpgun({
            "adunit": ad.unitId,
            "sizes": [
                [parseInt(ad.width), parseInt(ad.height)]
            ]
        });
    },

    onOrientationChange: function() {
        var self = this;
        self.setBodyPosition();
    },

    setBodyPosition: function() {
        var t = this;
        if (oIP.isiPad && pageName == "html5") {
            var version = t.getIOSversion();
            if (version.length && version[0] >= 7) {
                if (window.innerWidth > 800) {
                    $("body").css("margin-top", "20px");
                    $("#_sections").css("top", "20px");
                } else {
                    $("body").css("margin-top", "0px");
                    $("#_sections").css("top", "0px");
                }
            }
        } else {
            $("body").css("margin-top", "0px");
        }
    },
    getIOSversion: function() {
        var versionArr = [];
        if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
            try {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                versionArr = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            } catch(err) {};
        }
        return versionArr;
    },
    toggleFavorite: function(result) {
        var me = this;
        var itemid = this.model.item_id,
            el = $('.favorite', me.context),
            action;
        if (result.result !== true) {
            return null;
        }
        if (me.model.nextaction === 'addFav') {
            me.model.nextaction = 'delFav';
            $(el, me.context).addClass('favoriteactive');
        } else {
            me.model.nextaction = 'addFav';
            $(el, me.context).removeClass('favoriteactive');
        }
    },
    isFavArticle: function() {
        var me = this;
        var itemid = me.model.item_id;
        if (pageName !== 'html5') {
            var isFavLink = 'http://appsurl/isFav?item_id=' + itemid + '&callback=isFavoriteCallback';
            oIP.navigate(isFavLink);
        } else { //For handling HTML5 ajax request
            var deviceInfo = GW.App.deviceObj;
            if (oIP.isFavorite(deviceInfo.device_id, itemid)) {
                me.isFavoriteCallback({
                    'result': true,
                    'item': itemid
                });
            } else {
                me.isFavoriteCallback({
                    'result': false,
                    'item': itemid
                });
            }
        }
    },

    isFavoriteCallback: function(response) {
        var me = this;
        var itemid = me.model.item_id,
            el = $('.favorite', me.context);
        if ((("" + response.result) === "true") && (("" + response.item) === itemid)) {
            me.model.nextaction = 'delFav';
            $(el, me.context).addClass('favoriteactive');
        } else {
            me.model.nextaction = 'addFav';
            $(el, me.context).removeClass('favoriteactive');
        }
    },

    setTitle: function(type) {
        var displayLogo = Genwi.templateSettings.toolbar[type].displayLogo;
        var displayTitle = Genwi.templateSettings.toolbar[type].displayTitle;
        if (displayLogo && displayTitle) {
            $("#logoCustomise").show();
            $("#appTitle").hide();
        } else if (!displayLogo && displayTitle) {
            $("#logoCustomise").hide();
            $("#appTitle").show();
        } else if (displayLogo && !displayTitle) {
            $("#logoCustomise").show();
            $("#appTitle").hide();
        }
    },

    setContext: function(resp) {
        var self = this;
        this.oJson = jQuery.parseJSON(resp);
        try {
            if (this.oJson) {
                this.buildModel(false);
                this.draw(false);
                this.onAfterDraw();
                this.setTitle($.trim(this.oJson.type.toLowerCase()));
                if (this.oJson.type === 'article' && pageName == "html5") {
                    if (GW.App.appSettings.interstitialAd) {
                        articleVisits++;
                        self.initInterstitialAd();
                    }
                };
            }
        } catch (err) {
            alert(err + "|" + JSON.stringify(this.oJson));
        }
    },

    initInterstitialAd: function() {
        var me = this;
        var userAgent = navigator.userAgent.toLowerCase();
        var showInterstitial = function(adunit) {
            setTimeout(function() {
                $('.interstitial').remove();
                $('body').prepend('<div class="interstitialAds"><div class="LoadInterstitialAd"><div class="closeInterstitial"></div><div class="loadingAds"></div></div></div>');
                GW.trigger("msg:hide");
                if (window.innerWidth > 750) {
                    $(".LoadInterstitialAd").addClass("interstitial_tablet");
                } else {
                    $(".LoadInterstitialAd").addClass("interstitial_smartphone");
                }
                $('.closeInterstitial').on('click', function() {
                    $(".interstitialAds").remove();
                });

                $(".loadingAds").dfpgun({
                    "adunit": adunit.unitId,
                    "sizes": adunit.size
                });
            }, 500);
        };
        var counter = GW.App.appSettings.interstitialAd.displayCounter;
        if (articleVisits % parseInt(counter) == 0) {
            GW.trigger("msg:loading");
            showInterstitial(GW.App.appSettings.interstitialAd);
        }
    }
});
oIP.register('testHeader', Genwi.Template.copy_of_app_header)/*==END==============================*header.js*================*/