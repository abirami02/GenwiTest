/*==BEGIN=============================*colpost.js*================*/

/*
 * Default tablet article template JS.
 * html : featured_post.html
 * dev : tablet
 * *********/
Genwi.Template.copy_of_app_colpost = Genwi.Template.Basepost.extend({
    pageControls: 1,
    textResizeInitialized: false,
    currentCls: 'normal',
    isDrawHappen: false,
    flowedContent: "",
    fixedContent: "",

    buildModel: function(inc) {
        if (this.oJson === null || this.oJson.length === 0) {
            return;
        }
        this.oJson = (typeof this.oJson.length != "undefined") ? this.oJson : [this.oJson];
        this.model = this.oJson[0];
        //ads enabled or disabled
        this.model.boxAdsEnabled = "false";
        if (typeof Genwi.templateSettings.article.tablet.articleInlineAd !== "undefined") {
            this.model.boxAdsEnabled = true;
        }
        var caption = this.model.item_title;
        this.model.caption = caption;
        this.model.url = baseUrl + this.model.article_url;
        try {
            this.model.description = this.model.item_description.replace(/(\s|&nbsp;)+\./g, ' ');
        } catch(e) {
            //If no description is available probably we will get an error
            this.model.description = '';
        }
        this.model.author = this.model.item_author;
        var d = new Date(this.model.item_pubDate);
        this.model.p_date = Genwi.Utils.getDateStr(d);
        this.model.image = this.model.image_url || this.model.original_image_url;
        if (this.model.media_url && (this.model.media_type !== "image/jpeg" && this.model.media_type !== "image/png")) {
            if (this.model.media_url.indexOf("youtu") !== -1) {
                this.model.video = this.model.media_url;
            } else {
                this.model.video = "http://appsurl/videoviewer?link=" + this.model.media_url;
            }
        }
    },

    onPageLoaded: function() {
        this.draw();
        this.bindEvents();
        /* for some reason when coming from search, the body is given a class called articles that messes with our css */
        $('body').removeClass('articles');
        /*Some article has embed tags and that causes swipe problem.*/
        $('embed').hide();
    },

    draw: function(inc) {
        if (!this.isDrawHappen) {
            Genwi.Utils.bindTmplData($(this.rootTemplateId, this.context), this.model, this.elOb, inc);
            this.isDrawHappen = true;
        }
    },


    onOrientationChange: function() {
        var self = this;
        $(".target", self.context).html("");
        self.buildColumnflow();
        if (this.model.boxAdsEnabled != "false") {
            setTimeout(function() {
                self.triggerAd();
            }, 500);
        }
        if (typeof self.model.video === "undefined") {
            self.initImageViewer();
        }
    },

    buildColumnflow: function() {

        var self = this;
        var config = {
            columnCount: 2,
            columnGap: 20,
            standardiseLineHeight: true,
            lineHeight: 20,
            pagePadding: 20,
            minFixedPadding: 0.5,
            columnFragmentMinHeight: 20,
            pageArrangement: 'vertical',
            pageClass: 'articlePage'
        };
        var viewport = "viewport_" + Math.floor((Math.random() * 10000) + 1);
        var target = "target_" + Math.floor((Math.random() * 10000) + 1);
        var articleHeight, catsTitleHeight = 0;
        if (Genwi.templateSettings.toolbar.article.displayLogo && Genwi.templateSettings.toolbar.article.displayTitle) {
            catsTitleHeight = $(".displayCategoryTitle", self.context).height();
        }
        var topHeaderEnabled = Genwi.templateSettings.article.topHeaderAd;

		if (typeof oIP.appSettings["adMob"] === "undefined" && pageName != "html5") {
            articleHeight = topHeaderEnabled ? window.innerHeight - 54 - catsTitleHeight - 50 : window.innerHeight - 54 - catsTitleHeight;
            $(".feature", self.context).attr("id", viewport).height(articleHeight);
            $(".target", self.context).attr("id", target).height(articleHeight);
        } else if (pageName == "html5" && typeof GW.App.appSettings["adMob"] === "undefined") {
            articleHeight = topHeaderEnabled ? window.innerHeight - 84 - catsTitleHeight - 50 : window.innerHeight - 84 - catsTitleHeight;
            $(".feature", self.context).attr("id", viewport).height(articleHeight);
            $(".target", self.context).attr("id", target).height(articleHeight);
        } else {
            articleHeight = topHeaderEnabled ? window.innerHeight - 144 - catsTitleHeight - 50 : window.innerHeight - 144 - catsTitleHeight;
            // Ad = 90 + toolbar 44 + 10
            $(".feature", self.context).attr("id", viewport).height(articleHeight);
            $(".target", self.context).attr("id", target).height(articleHeight);
        }
        var temp = $("<div />", self.context).html($(self.fixedContent));

        if (window.innerWidth > 768) {
            $(temp).find(".adunit_portrait", self.context).hide();
            $(temp).find(".adunit_landscape", self.context).show();
            self.fixedContent = $(temp).html();
        } else {
            $(temp).find(".adunit_portrait", self.context).show();
            $(temp).find(".adunit_landscape", self.context).hide();
            self.fixedContent = $(temp).html();
        }

        $('.target', self.context).addClass('_postDescCustomTheme');
        var cf = new FTColumnflow(target, viewport, config);
        cf.flow(self.flowedContent, self.fixedContent);
        $(".cf-preload", self.context).remove();
        $(".cf-preload-fixed", self.context).remove();
        $("#flowedContent", self.context).remove();
        $("#fixedContent", self.context).remove();

        this.elOb.css("cssText", "overflow:hidden!important");

        self.flag = $('.articlePage', self.context).length;
        var pageCount = " <li class='active'></li>";
        $("#" + target, self.context).height(self.flag * articleHeight);

        if (self.flag > 1) {
            self.initScrollerArt(viewport);
            for (var x = 2; x <= self.flag; x++) {
                pageCount = pageCount + "<li></li>";
            }
            $("#pagination", self.context).removeClass("hidePagination").find("ul").html(pageCount);
            $("#pagination", self.context).css("left", ((window.innerWidth - 678) / 2) - 30);
        } else {
            if (self.myScroll)
                self.myScroll.destroy();
            $("#pagination", self.context).addClass("hidePagination");
        }
    },

    triggerAd: function() {
        var self = this,
            sizes, adUnit;
        adUnit = Genwi.templateSettings.article.tablet.articleInlineAd.adunit;
        sizes = Genwi.templateSettings.article.tablet.articleInlineAd.sizes;

        if (window.innerWidth > 768) {
            $(".adunit_landscape", self.context).dfpgun({
                "adunit": adUnit,
                "sizes": sizes
            });
        } else {
            $(".adunit_portrait", self.context).dfpgun({
                "adunit": adUnit,
                "sizes": sizes
            });
        }
        //$(".adunit2",this.context).css("text-align","center");
    },

    triggerHeaderAd: function() {
        var self = this,
            sizes, adUnit;
        this.elOb.prepend("<div class='topHeaderAd'></div>");
        adUnit = Genwi.templateSettings.categories.topHeaderAd.adunit;
        sizes = Genwi.templateSettings.categories.topHeaderAd.sizes;
        $(".topHeaderAd", self.context).dfpgun({
            "adunit": adUnit,
            "sizes": sizes
        });
    },

    bindEvents: function() {
        var self = this;
        try {
            $("#flowedContent", self.context).html($("#flowedContent", self.context).html().replace(/(<br>\s*){1,1}/g, '</p><p>'));
        } catch (e) {
            //Needs to investigate the problem in html5. can not call replace of undefined
        }

        $("#flowedContent a").each(function() {
            var value = $(this).html();
            if (value == '') {
                $(this).remove();
            }
        });

        $("#flowedContent span").each(function() {
            var value = $(this).html();
            if (value == '') {
                $(this).remove();
            }
        });

        $("p:empty").remove();

        if (this.model.boxAdsEnabled === "false") {
            $('#fixedContent', self.context).find(".adunit2").remove();
        }

        self.flowedContent = $('#flowedContent', self.context).html();
        self.fixedContent = $('#fixedContent', self.context).html();
        if (Genwi.templateSettings.toolbar.article.displayLogo && Genwi.templateSettings.toolbar.article.displayTitle) {
            $(".feature", self.context).before("<div class='displayCategoryTitle _headerCustomTheme'>" + this.oJson[0].category_title + "</div>");
        }

        if (Genwi.templateSettings.article.topHeaderAd) {
            self.triggerHeaderAd();
        }
        if (this.model.boxAdsEnabled == "false") {
            $(".adunit2", self.context).remove();
        }
        this.buildColumnflow();
        if (typeof self.model.video === "undefined") {
            self.initImageViewer();
        }
        if (this.model.boxAdsEnabled === true) {
            self.triggerAd();
        }
        $(".video", self.context).bind("click", function(e) {
            e.stopPropagation();
            //e.preventDetault();
            var el = $(this).children("img");
            $(el).css("opacity", "0.7");
            var link = $(this).attr("data-href");
            setTimeout(function() {
                $(el).css("opacity", "1.0");
            }, 500);
            oIP.navigate(link);
        });
        //Applying customization class...
        //$('.cf-column', this.context).find('p').addClass('_postDescCustomTheme');
    },
    initScrollerArt: function(container) {
        var self = this;
        this.myScroll = new iScroll(container, {
            snap: true,
            vScroll: true,
            hScroll: false,
            hScrollbar: false,
            vScrollbar: false,
            handleClick: !(oIP.isAndroid),
            momentum: false,
            bounce: false,
            useTransition: false,
            useTransform:false,
            lockDirection: true,

            onBeforeScrollStart: function(e) {
                if (this.absDistY > this.absDistX) {
                    this.verticalScroll = true;
                    e.preventDefault();
                } else if (this.verticalScroll == false) {
                    this.disable();
                    var self = this;
                    setTimeout(function() {
                        self.enable();
                    }, 50);
                }
            },
            onScrollMove: function(e) {
                if (this.absDistY > this.absDistX) {
                    e.preventDefault();
                } else if (this.verticalScroll == false) {
                    this.disable();
                    var self = this;
                    setTimeout(function() {
                        self.enable();
                    }, 50);
                }
            },
            onTouchEnd: function() {
                this.verticalScroll = false;
                this.enable();
            },
            onRefresh: function() {
                this.currPageY = 0;
            },
            onScrollEnd: function(e) {
                var nextPage = parseInt(this.currPageY) + 1;
                var totalPages = parseInt(this.pagesY.length);
                if (nextPage > totalPages) {
                    this.currPageY = parseInt(this.currPageY) - 1;
                }
                $('#pagination ul > li.active', this.context).removeClass('active');
                $('#pagination ul > li:nth-child(' + (this.currPageY + 1) + ')', this.context).addClass('active');
            }
        });
        this.myScroll.verticalScroll = false;
    },

    constructImageViewerUrl: function() {
        var me = this;
        me.model.imageViewer = 'http://appsurl/imageviewer/?displayTopToolbar=true&displayBottomToolbar=true';
        me.model.captions = "", me.model.listImages = "";
        for (var i = 0, len = me.model.img_det.length; i < len; i++) {
            var link = $.trim(me.model.img_det[i].link);
            if (link !== '') {
                me.model.listImages += encodeURIComponent(link) + '##320*420##';
                //images does not have any caption. hence populating the item_title/article title.
                me.model.captions += encodeURIComponent(me.model.caption) + ",";
            }
        }
        me.model.imageViewer += "&captions=" + me.model.captions + "&list=" + me.model.listImages +
            "&title=" + encodeURIComponent(me.model.item_title + ", shared from the " +
                $.trim(networkTitle) + " App.") + "&shareLink=" + encodeURIComponent(me.model.url) +
            "&enableShare=true&enablePinterest=true";
    },

    initImageViewer: function() {
        var me = this;
        if (me.model.img_det.length - 1 > 0) {
            $('.slideshowOverlay', me.context).show();
            me.showImageViewer('.slideshowOverlay, .Tapping', '.articleImg a img');
        } else {
            $('.slideshowOverlay', me.context).hide();
            me.showImageViewer('.articleImg img', '.articleImg a img');
        }
    }
});
oIP.register('testPost', Genwi.Template.copy_of_app_colpost)
/*==END==============================*colpost.js*================*/

