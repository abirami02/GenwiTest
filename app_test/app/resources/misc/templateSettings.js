/**
 * App specific template settings.
 **/

var Genwi = Genwi || {};
Genwi.templateSettings = {
    iTunesUrl : "http://itunes.com",
    playStoreUrl: "http://google.com",
    article : {
        paginatedPost: false,
        tablet: {
            articleInlineAd: {
                adunit: "/85897531/middleads_300x250",
        		sizes: [[300,250]]
			}
		},
		smartPhone: {
			articleInlineAd: {
				adunit: "/85897531/middleads_300x250",
				sizes: [[300,250]]
			}
		}
    },
    
	toolbar: {
		article: {
			displayLogo: false,
			displayTitle: true,
			favIconRequired: true
		},
		articles: {
			displayLogo: false,
			displayTitle: true
		},
		categories: {
			displayLogo: false,
			displayTitle: true
		},
		default: {
			displayLogo: false,
			displayTitle: true
		}
	},
	
	categories: {
		
	},
	
	articles: {
		featurePostRequired: true, //By deafult false
		featurePost: {
			lookupString: '##Featured##', //By deafult ##feature
		},
        tablet: {
            
        },
        smartPhone: {
            
        }
	},
	header: {

	},
	sectionMenu : {
		favLinkRequired: true,
		searchRequired: true
	},
	ads: {

	}	
};