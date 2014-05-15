/*==BEGIN=============================*search.js*================*/

/*
 * Default search template JS.
 * html : post_search.html
 * device : tablet/smartphone
 * *********/
Genwi.Template.copy_of_app_search = Genwi.Template.Search.extend({
    pageControls: 25,

    draw: function(inc) {
        this.__super__.draw.call(this, inc);
        this.elOb.tappers();
        $(window).scrollTop(0);
    },
    buildModel: function(inc) {
        var urlSplit = window.location.href.split("/");
        var spliting = urlSplit[urlSplit.length - 1];
        var terms = spliting.split("?");
 		this.model.searchterm = decodeURIComponent(terms[0]);

        if (this.oJson === null || this.oJson.length === 0) {
            return;
        }

        var oArts = [],
            batchArts = [],
            arts = {};
        var data = this.oJson;
        var dataLength = data.length,
            temp;

        data = data.sort(function(a, b) {
            if (a.item_title > b.item_title) {
                return 1;
            } else {
                return -1;
            }
        });

        data = JSON.parse(JSON.stringify(this.oJson));

        for (var i = 0; i < dataLength - 1; i++) {
            if (data[i].item_title == data[i + 1].item_title) {
                delete data[i];
            }
        }

        data = data.filter(function(el) {
            return (typeof el !== "undefined");
        });

        for (var i = 0; i < data.length; i++) {
            var article = data[i],
                p_date, d;
            article.articleTitle = article.item_title;
            article.articleLink = baseUrl + article.article_url;
            article.articleImage = article.original_image_url || article.image_url;
            article.articleAuthor = article.item_author;
            article.desc = article.item_description;
            d = new Date(article.item_pubDate);
            article.articlePubDate = Genwi.Utils.getDateStr(d);
            batchArts.push(article);
        }

        arts.articles = batchArts;
        this.model = arts;
    },
    pageContext: function() {
        var firstObj = this.oJson[0];
        var a = {};
        a.type = 'articles';
        a.title = 'Search';
        return a;
    }
});
oIP.register('testSearch', Genwi.Template.copy_of_app_search)/*==END==============================*search.js*================*/