/*==BEGIN=============================*categories.js*================*/

/*
 * Default categories template JS.
 * html : categories.html
 * devices : tablet/smartphone.
 * *******/

Genwi.Template.copy_of_app_categoriesnewsfeed = Genwi.Template.Categories.extend({
    pageControls: 99,

    buildModel: function() {
        if (this.oJson === null ) { //|| this.oJson.length === 0) {
            this.model.nocontent = true;
            return;
        }
        var data = this.oJson,
            dataLength = data.length,
            cats = {}, articles = [],
            startIndex = 1;
        var labels = {
            'technology': 'violetLabel',
            'sports': 'orangeLabel',
            'film': 'greenLabel',
            'genwi news': 'redLabel',
            'fashion': 'violetLabel'
        };
        if(toString.call(data) == '[object Object]') {
            var items = data[data.cid],
                itemsLength = items.length, item;
            for(var i=0; i<itemsLength;i++) {
                if (items[i].image_url !== "" || items[i].original_image_url !== "") {
                	item = items[i];
                	break;
                }
            }
            item = item ? item : items[0];
            cats.featuredTitle = item.category_title;
            cats.featuredImage = items.image_url || item.original_image_url;
            cats.featuredLink = baseUrl + item.article_url;
            cats.featuredCaption = item.item_title;
            cats.featuredAuthor = item.item_author;
            var d = new Date(item.item_pubDate);
            p_date = Genwi.Utils.getDateStr(d);
            cats.featuredPubDate = p_date;
            this.model.nocontent = true;
            this.model = cats;
        } else {
            startIndex = 0;
            if (dataLength >= 1) {

                var colorExp = /<p>#(.*)(<\/p>)/gi;

                for (var i = startIndex; i < dataLength; i++) {

                    if (i === startIndex) {
                        var firstCategory = data[i][data[i].cid],
                            articlesLength = firstCategory.length;
                        for (var j = 0; j < articlesLength; j++) {
                            if (firstCategory[j].image_url !== "" || firstCategory[j].original_image_url !== "") {
                                //cats.featuredTitle = firstCategory[j].category_title;
                                cats.featuredTitle = data[startIndex].category_title;
                                cats.featuredImage = firstCategory[j].image_url || firstCategory[j].original_image_url;
                                if (firstCategory[j].media_url && (firstCategory[j].media_type !== "image/jpeg" && firstCategory[j].media_type !== "image/png")) {
                                    cats.featuredLink = "http://appsurl/videoviewer?link=" + encodeURIComponent(firstCategory[j].media_url);
                                    cats.video = true;
                                } else {
                                    cats.featuredLink = baseUrl + firstCategory[j].article_url;
                                }
                                cats.featuredCaption = firstCategory[j].item_title;
                                cats.featuredAuthor = firstCategory[j].item_author;
                                var d = new Date(firstCategory[j].item_pubDate);
                                p_date = Genwi.Utils.getDateStr(d);
                                cats.featuredPubDate = p_date;
                                break;
                            } else {
                                continue;
                            }
                        }
                    } else {
                    	//Find the first article in the category.
                        var categoryItem = this.findFirstArticleItem(data[i]);
                        if (typeof categoryItem !== "undefined") {
                            categoryItem.title = data[i].category_title || '';
                            categoryItem.image = categoryItem.image_url || categoryItem.original_image_url;
                            var categoryDesc = $("<div />").html(categoryItem.item_description).text();
                            categoryItem.desc = categoryDesc;
                            //Assigning video link; need to improve on handling the video types we can handle.
                            if (categoryItem.media_url && (categoryItem.media_type !== "image/jpeg" && categoryItem.media_type !== "image/png")) {
                                categoryItem.link = "http://appsurl/videoviewer?link=" + encodeURIComponent(categoryItem.media_url);
                                    categoryItem.video = true;
                            } else {
                                categoryItem.link = baseUrl + categoryItem.article_url;
                            }
                            categoryItem.caption = categoryItem.item_title;
                            categoryItem.className = labels[categoryItem.title.toLowerCase()];
                            if (colorExp.test(categoryItem.category_desc)) {
                                categoryItem.color = '#' + categoryItem.category_desc.split(colorExp)[1];
                            } else {
                                categoryItem.color = '#402F23';
                            }
                            categoryItem.author = categoryItem.item_author;
                            var d = new Date(categoryItem.item_pubDate);
                            p_date = Genwi.Utils.getDateStr(d);
                            categoryItem.pubdate = p_date;
                            articles.push(categoryItem);
                            cats.articles = articles;
                        }
                    }
                }
                if (typeof cats.featuredTitle !== "undefined" || typeof cats.articles !== "undefined") {
                    if (typeof cats.featuredTitle === "undefined" && typeof data[0][data[0].cid] !== "undefined") {
                        var firstItem = data[0][data[0].cid][0];
                        firstItem.title = firstItem.category_title || '';
                        firstItem.image = firstItem.image_url || firstItem.original_image_url;
                        var categoryDesc = $("<div />").html(firstItem.item_description).text();
                        firstItem.desc = categoryDesc;
                        //Assigning video link; need to improve on handling the video types we can handle.
                        if (firstItem.media_url && (firstItem.media_type !== "image/jpeg" && firstItem.media_type !== "image/png")) {
                           firstItem.link = "http://appsurl/videoviewer?link=" + encodeURIComponent(firstItem.media_url);
                           firstItem.videoImage = "videoImage";
                        } else {
                            firstItem.link = baseUrl + firstItem.article_url;
                        }
                        firstItem.caption = firstItem.item_title;
                        firstItem.className = labels[firstItem.title.toLowerCase()];
                        if (colorExp.test(firstItem.category_desc)) {
                            firstItem.color = '#' + firstItem.category_desc.split(colorExp)[1];
                        } else {
                            firstItem.color = '#402F23';
                        }
                        firstItem.author = firstItem.item_author;
                        var d = new Date(firstItem.item_pubDate);
                        p_date = Genwi.Utils.getDateStr(d);
                        firstItem.pubdate = p_date;
                        cats.articles.unshift(firstItem);
                    }
                    this.model = cats;
                } else {
                    this.model.nocontent = true;
                }
            } else {
                this.model.nocontent = true;
            }
        }
    },
    /**Find the first article in the category; 
     * recursively checks the subcategory.
     */
    findFirstArticleItem : function(data){
    	var firstItem = data[data.cid][0];
    	if(firstItem){
    		return firstItem;
    	}else if(data["subcats"].length){
    		return this.findFirstArticleItem(data["subcats"][0]);
    	}else{
    		return undefined;
    	}
    },

    initScroller: function() {
        var self = this;
        this.elOb.tappers();
        if (pageName != "html5") {
            this.elOb.parent().css("padding-top", "44px");
            this.elOb.parent().scrollTop(44);
            this.elOb.parent().attr("id", "pulldownOuterContainer");
            this.elOb.wrap("<div id='pulldownInnerContainer' class='wrap'></div>");
            this.pulldownrefresh(this, '#pulldownOuterContainer', '#pulldownInnerContainer', true);
            this.elOb.css("padding-bottom", "80px");
        }
        if (oIP.appSettings.adMob) {
            $(".nodeList", this.context).css("padding-bottom", "50px");
        }
    },

    onPageLoaded: function() {
        var self = this;
        this.minorTweaks();
        this.onOrientationChange();
        this.initScroller();
        if (Genwi.templateSettings.categories.topHeaderAd) {
            self.triggerHeaderAd();
        }
    },

    pulldownrefresh: function(context, scrollerDiv, wrapperDiv, enablePullDown) {
        var t = context;
        $(scrollerDiv).scroller({
            "wrapper": wrapperDiv,
            "enablePullDown": enablePullDown,
            pullDowncallback: function() {
                var pullDownDef = $.Deferred();
                setTimeout(function() {
                    oIP.navigate("http://appsurl/refresh?type=1&msg=" + encodeURIComponent("Updating Content"));
                }, 500);

                setTimeout(function() {
                    $('body').animate({
                        scrollTop: 44
                    }, 'slow');
                    if (pullDownDef)
                        pullDownDef.resolve();
                }, 2000);
                return pullDownDef.promise();
            }
        });
    },
    onAppUpdate: function(updates) {
        if (updates.length) {
            window.location = "http://appsurl/refresh?type=1&isFromBackground=true&msg=" + encodeURIComponent("Updating Content");
        }
    },
    minorTweaks: function() {
        var self = this;
        $(".details h2", self.context).dotdotdot();
        $(".articlesDesc", self.context).dotdotdot();
        if (pageName == "html5") {
            this.elOb.addClass("maxContainerSize").css("padding-bottom", "45px");
            $('ul.nodeList').addClass('nodeListhtml5');
        }
        if (this.device.isAndroid && this.device.isNativeApp) {
            this.elOb.css({
                "padding-bottom": "45px"
            });
            if (window.innerWidth > 500) {
                $("#gw_categories_wrapper", self.context).css("margin-top", "-10px");
            }
        }
    },

    triggerHeaderAd: function() {
        var self = this,
            sizes, adUnit;
        $(".featuredWrapper", self.context).before("<div class='topHeaderAd'></div>");
        adUnit = Genwi.templateSettings.categories.topHeaderAd.adunit;
        sizes = Genwi.templateSettings.categories.topHeaderAd.sizes;
        $(".topHeaderAd", self.context).dfpgun({
            "adunit": adUnit,
            "sizes": sizes
        });
    },

    pageContext: function() {
        var a = {};
        a.type = 'categories';
        a.title = networkTitle.trim().toString();
        return a;
    }
});
oIP.register('testCat', Genwi.Template.copy_of_app_categoriesnewsfeed)/*==END==============================*categories.js*================*/