/*==BEGIN=============================*posts.js*================*/

/*
 * Default articles template JS.
 * html : posts.html
 * device : tab/smartphone.
 * ***********/
Genwi.Template.copy_of_app_posts = Genwi.Template.Articles.extend({
    pageControls: 99,
    postsLoaded: null,
    options: null,
    isFeaturedAdded: false,
    start: 0,
    setFeature: false,

    buildModel: function(inc) {
        if (inc == false) {
            this.start = 0;
        }
        if (this.oJson === null || this.oJson.length === 0) {
            this.model.nocontent = true;
            return;
        }

        var data = this.oJson,
            dataLength = this.oJson.length,
            temp;
        if (!inc && Genwi.templateSettings.articles.featurePostRequired) {
            var lookupString = Genwi.templateSettings.articles.featurePost.lookupString;
            for (var i = 0; i < dataLength; i++) {
                try {
                    if (data[i].item_description.indexOf(lookupString) !== -1) {
                        temp = data[i];
                        data[i] = data[0];
                        data[0] = temp;
                        this.setFeature = true;
                        break;
                    }
                } catch(e) {
        			//item_description coming as null sometimes.
                    console.log('No description available');
                }
            }
            data = data.slice(0);
        }

        var oArts = [],
            batchArts = [],
            arts = {}, i, self = this;
        //data = data.slice(0);
        dataLength = data.length;

        if (dataLength !== 0) {
            for (i = this.start; i < dataLength; i++) {
                var article = data[i],
                    p_date, d,
                    featuredImage = Genwi.templateSettings.articles.featurePostRequired;
                //featuredImage = data[i].image_url || data[i].original_image_url || '';

                if (featuredImage && !this.isFeaturedAdded && this.setFeature) {
                	var firstItem = data[0];
                    var title = firstItem.item_title;
                    arts.featuredTitle = title.length > 60 ? (title.substring(0, 60) + "...") : title;
                    arts.featuredDescription = $("<div />").html(firstItem.item_description).text().replace(lookupString, "");
                    arts.featuredLink = baseUrl + firstItem.article_url;
                    arts.featuredLink = baseUrl + firstItem.article_url;
                    arts.featuredImage = firstItem.image_url || firstItem.original_image_url || firstItem.img_det[0].link;
                    arts.featuredAuthor = firstItem.item_author ? firstItem.item_author : "";
                    arts.featuredPubDate = Genwi.Utils.getDateStr(new Date(firstItem.item_pubDate));
                    this.isFeaturedAdded = true;
                } else {
                    var title = article.item_title;
                    article.desc = $("<div />").html(article.item_description).text();
                    // if (window.innerWidth < 750) {
                    article.articleTitle = title.length > 55 ? (title.substring(0, 52)) + "..." : title;
                    /*} else {
                        article.articleTitle = title;
                    }*/
                    article.articleLink = baseUrl + article.article_url;
                    article.articleImage = article.original_image_url || article.image_url;
                    article.articleAuthor = article.item_author ? article.item_author : "";
                    d = new Date(article.item_pubDate);
                    article.articlePubDate = Genwi.Utils.getDateStr(d);
                    batchArts.push(article);
                }
            }
            arts.articles = batchArts;
            this.model = arts;
            //If suppose first 20 articles doesn't have featured image, we need to set isFeaturedAdded as true. Otherwise the featured article may be get it from new list.
            this.isFeaturedAdded = true;
            if (this.start === 0) {
                this.model.initialLoad = true;
            } else {
                this.model.initialLoad = false;
            }
        } else {
            this.model.nocontent = true;
        }
        if (typeof Genwi.templateSettings.articles.tablet.articleInlineAd !== "undefined") {
            this.model.boxAdsEnabled = true;
        }
    },

    initScroller: function() {
    	if(this.oJson.length && this.oJson.length < this.oJson[0].total_records){
	        this.elOb.superScroll({
	            "totalRecords": this.oJson[0].total_records,
	            "setcount": 20,
	            "recordsLoaded": this.oJson.length,
	            "maxRecords": 99
	        });
    	}
    },

    pageContext: function() {
        var firstObj = this.oJson.length ? this.oJson[0] : {};
        var a = {};
        a.type = 'articles';
        a.title = firstObj.category_title || "";
        var colorExp = /<p>#(.*)(<\/p>)/gi;
        if (colorExp.test(firstObj.category_desc)) {
            firstObj.color = '#' + firstObj.category_desc.split(colorExp)[1];
        } else {
            firstObj.color = '#402F23';
        }
        //active color used for passing information to article page
        this.model.activeColor = a.color;
        return a;
    },

    onResponseReceived: function(response) {
        if (response instanceof Array) {
            this.model = {};
            //This is the case of incremental loading.
            this.start = this.oJson.length;
            this.oJson = response;
            if (this.oJson.length > 0) {
                this.buildModel(true);
                this.draw(true);
                $("#gw_articles .details h2", this.context).dotdotdot();
                $("").imgr();
            }
            if (this.oJson.length >= 99) {
                $("").superScroll("disable");
            }
            this.elOb.tappers();
        }
    },
    triggerAd: function() {
        var sizes, adUnit, adslength = 0,
            adsPosition;
        if (Genwi.templateSettings.articles.tablet.articleInlineAd.position) {
            adslength = Genwi.templateSettings.articles.tablet.articleInlineAd.position.length;
            adsPosition = Genwi.templateSettings.articles.tablet.articleInlineAd.position;
        } else {
            adslength = 1;
            adsPosition = [3];
        }
        adUnit = Genwi.templateSettings.articles.tablet.articleInlineAd.adunit;
        sizes = Genwi.templateSettings.articles.tablet.articleInlineAd.sizes;
        $(".adunit2", this.context).remove();
        if (adslength) {
            for (var i = 0; i < adslength; i++) {
                $("<div class='fixPostAdPosition adunit" + i + "'></div>").insertBefore($("ul.nodeList li:nth-child(" + adsPosition[i] + ")", this.context));
                $(".adunit" + i, this.context).dfpgun({
                    "adunit": adUnit,
                    "sizes": sizes
                });
                $(".adunit" + i, this.context).css("text-align", "center");
            }
        }
    },

    onPageLoaded: function() {
        var self = this;
        this.elOb.tappers();
        $(".tabletFeaturedDesc").dotdotdot();
        setTimeout(function() {
            $(".articlesDesc").dotdotdot();
        }, 100);

        $("#gw_articles .details h2", this.context).dotdotdot();
        this.minorTweaks();
        this.initScroller();
        $("").imgr();

        if (Genwi.templateSettings.articles.topHeaderAd) {
            self.triggerHeaderAd();
        }
        if (this.model.boxAdsEnabled === true) {
            setTimeout(function() {
                self.triggerAd();
            }, 3000);
        }

        if (Genwi.templateSettings.toolbar.articles.displayLogo && Genwi.templateSettings.toolbar.articles.displayTitle) {
            $("#gw_articles_wrapper", self.context).before("<div class='displayCategoryTitle _headerCustomTheme'>" + this.oJson[0].category_title + "</div>");
            $("#gw_articles_wrapper", self.context).css("margin-top", "-44px");
            $(".displayCategoryTitle", self.context).css("margin-top", "44px");
        }

        if (oIP.appSettings.adMob) {
            this.elOb.css("padding-bottom", "85px");
        }
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
        this.elOb.css("margin-top", "54px");
    },

    draw: function(inc) {
        if (!inc) {
            Genwi.Utils.bindTmplData($(this.rootTemplateId, this.context), this.model, this.elOb, inc);
        } else {
            Genwi.Utils.bindTmplData($(this.rootTemplateId, this.context), this.model, $('ul.articles', this.context), inc);
            if (this.device.isIpad || this.device.isAndroidTablet) {
                $(".articlesDesc").dotdotdot();
            }
        }
    },
    minorTweaks: function() {
        if (pageName == "html5") {
            this.elOb.addClass("maxContainerSize").css("cssText", "margin-top:44px !important; padding-bottom:44px !important");
            $('#__navbar', this.context).hide();
        } else if (this.isAndroid) {
            this.elOb.css("padding-bottom", "45px");
        }
    }
});
oIP.register('testPosts', Genwi.Template.copy_of_app_posts)/*==END==============================*posts.js*================*/