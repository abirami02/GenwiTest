/*==BEGIN=============================*saved_items.js*================*/

/*
 * Default favorites template JS.
 * html : saved_items.html
 * device : tablet/smartphone
 * **************/
Genwi.Template.copy_of_app_saved_items = Genwi.Template.Favorites.extend({
    pageControls: 99,

    buildModel: function(inc) {
        if (this.oJson === null || this.oJson.length === 0) {
            this.model.isItemNotAvailable = true;
            return;
        }

        var oArts = [],
            batchArts = [],
            arts = {};
        var data = this.oJson.slice(0);
        var dataLength = data.length,
            temp, isItemNotAvailable = true;
        if (dataLength !== 0) {
            isItemNotAvailable = false;
        }
        for (var i = 0; i < dataLength; i++) {
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
        this.model.isItemNotAvailable = isItemNotAvailable;
    },
    onPageLoaded : function(){
        this.elOb.tappers();
    },

    pageContext: function() {
        var a = {};
        a.type = 'articles';
        a.title = 'Saved Items';
        return a;
    }
});
oIP.register('testFav', Genwi.Template.copy_of_app_saved_items)/*==END==============================*saved_items.js*================*/