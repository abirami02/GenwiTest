/*==BEGIN=============================*category_menu.js*================*/


/*
 * Default category menu/sections menu template JS.
 * html :: category_menu.html
 * device :: tablet/smartphone
 * ************/

Genwi.Template.copy_of_app_category_menu = Genwi.Template.Sections.extend({
    oJson: null,
    pageControls: 99,
    swipeLinks: [],

    draw: function(inc) {
        this.__super__.draw.call(this, inc);
        this.onAfterDraw();
    },
    buildModel: function() {
        if (this.oJson === null || this.oJson.length === 0) {
            return;
        }
        this.swipeLinks = [homeUrl];
        var data = this.oJson.slice(0),
            dataLength = data.length,
            sections = [];
        for (var i = 0; i < dataLength; i++) {
            var item = data[i],
                section = {};
            section.sectionSubCats = [];
            if (item.subcats.length > 0) {
                section.hasSubCat = true;
                section.sectionTitle = item.category_title;
                section.sectionLink = "javascript:void(0)";
                for (var j = 0; j < item.subcats.length; j++) {
                    var sectionSub = {}, subcatsItem = item.subcats[j];
                    sectionSub.sectionTitle = subcatsItem.category_title;
                    sectionSub.sectionLink = baseUrl + subcatsItem.articles_url;
                    section.sectionSubCats.push(sectionSub);
                }
            } else {
                section.sectionTitle = item.category_title;
                section.sectionLink = baseUrl + item.articles_url;
            }
            sections.push(section);
            this.swipeLinks.push(section.sectionLink);
        }
        this.model = {};
        this.model.homepage = homeUrl;
        this.model.favorites = baseUrl + "favorites/" + network_id;
        this.model.favLinkRequired = Genwi.templateSettings.sectionMenu.favLinkRequired;
        this.model.searchRequired = Genwi.templateSettings.sectionMenu.searchRequired;
        this.model.sections = sections;
    },
    onAfterDraw: function() {
        this.bindEvents();
        if(typeof(pageName) != "undefined" && pageName == "html5" && this.device.isAndroid && navigator.userAgent.toLowerCase().indexOf("chrome")==-1){
            //In android native browser the toolbar doesnt shift when sections menu opens.
            //So the first item which is search bar in this case remain hidden.
            //Should add space at the top.
            $("#gw_category_menu",this.elOb).css("padding-top","44px");
        }
    },
    bindEvents: function() {
        var me = this;
        $("#gw_sections", me.context).height(window.innerHeight);
        $('.sectionMenu ul:nth-child(1) li:nth-child(2)', me.context).find("a").addClass('active _sectionsHighlightCustomTheme');
        $('.sectionMenu ul li li.newssubcats a').removeClass("_sectionsHighlightCustomTheme");

        $('.sectionMenu ul li', me.context).hammer().on('tap', function(e) {
            if ($(this).find("input").attr('id') != 'search') {
                if ($(this).find("div").length == 0 && !$(this).hasClass("newssubcats")) {
                    $(".sub_sections").slideUp();
                    $(".plus_minus").html("+");
                }
                if (!$(this).hasClass("newssubcats")) {
                    $('.sectionMenu ul li a').removeClass('active');
                    $('.sectionMenu ul li a').removeClass('_sectionsHighlightCustomTheme');
                    $(this).find("> a").addClass('_sectionsHighlightCustomTheme');
                    $(this).find("> a").addClass('active');
                }
            }
        });

        $('.sectionMenu ul li', me.context).bind('click', function(e) {
            if ($(this).find("input").attr('id') != 'search') {
                if ($(this).find("div").length == 0 && !$(this).hasClass("newssubcats")) {
                    $(".sub_sections").slideUp();
                    $(".plus_minus").html("+");
                }
                if (!$(this).hasClass("newssubcats")) {
                    $('.sectionMenu ul li a').removeClass('active');
                    $('.sectionMenu ul li a').removeClass('_sectionsHighlightCustomTheme');
                    $(this).find("> a").addClass('_sectionsHighlightCustomTheme');
                    $(this).find("> a").addClass('active');
                }
            }
        });

        $('.sub_sections ul li a', me.context).bind('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.sub_sections ul li a').removeClass('active');
            $('.sub_sections ul li a').removeClass('_sectionsHighlightCustomTheme');
            $(this).addClass('_sectionsHighlightCustomTheme');
            $(this).addClass('active');
            oIP.navigate(this.href);
        });

        $("#search_form", me.context).submit(function(e) {
            me.search(e);
        });

        $("#search", me.context).on('click', function(e) {
            // me.search(e);
        });

        if (pageName == "html5") {
            $(".hideFavLink", this.context).remove();
        }

        $(".showSubcats", this.context).click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(".sub_sections").not($(this).parent().find(".sub_sections")).hide();
            if ($(this).next().html() == "+") {
                $(".plus_minus").html("&ndash;");
            } else {
                $(".plus_minus").html("+");
            }
            $(this).parent().find(".sub_sections").slideToggle();
        });
    },

    pageContext: function(response) {
        var jsondata = {};
        var self = this;
        jsondata.swipe_nav = self.swipeLinks;
        return jsondata;
    },

    onOrientationChange: function() {
        var self = this;
        self.setBodyPosition();
        //alert("orientation change");
        $("#gw_category_menu").height(window.innerHeight);
        $("#gw_category_menu").css("overflow", "scroll");
    },

    setBodyPosition: function() {
        var t = this;
        if (oIP.isiPad && pageName == "html5") {
            $("#gw_category_menu").height(window.innerHeight);
        }
    },

    search: function(e) {
        var me = this;

        if (e.keyCode !== 13) { //Enter key code = 13
            //return;
        }
        var searchInput = $.trim($("#search").blur().val());
        if (searchInput && searchInput.length > 0) {
            $(".searchIndicator").show();
            setTimeout(function() {
                $(".searchIndicator").hide();
                $("#search").val('');
            }, 5000);
            var url = baseUrl + "search/" + network_id + "/" + searchInput;
            if (me.device.isIphone || (me.device.isAndroidSmartPhone)) {
                url = url + "?dev=smartphone";
            }
            oIP.navigate(url);
        }
    }
});
oIP.register('testSections', Genwi.Template.copy_of_app_category_menu)/*==END==============================*category_menu.js*================*/