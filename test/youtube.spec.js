const {expect} = require('chai');

describe('YouTube Homepage', async () => {
    let page;

    before(async () => {
        page = await browser.newPage();
        await page.goto("https://www.youtube.com/");
        await page.setViewport({width: 1280, height: 800});
    });

    it('first search result should contain "hello world"', async () => {
        const searchInput = await page.$("#search");
        await searchInput.type("Hello World");
        const searchButton = await page.$("#search-icon-legacy");
        await searchButton.click();

        await page.waitFor('div#dismissable > div.text-wrapper.style-scope.ytd-video-renderer', {visible: true});
        let resultText = await page.$eval('div#dismissable > div.text-wrapper.style-scope.ytd-video-renderer', ele => ele.innerText);
        resultText = resultText.toLowerCase();
        expect(resultText).to.include('hello world');
    });


    after(async function () {
        await page.close();
    });

});

describe('YouTube First Trending Video', async () => {
    let page;

    before(async () => {
        page = await browser.newPage();
        await page.goto("https://www.youtube.com/");
        await page.setViewport({width: 1280, height: 800});
    });

    it('check first trending video title and view count', async () => {
        const youtubeNavigationButtons = await page.$$('div#guide-content > #guide-inner-content > #guide-renderer > #sections > .style-scope.ytd-guide-renderer > div#items >  .style-scope.ytd-guide-section-renderer > #endpoint ', {visible: true});
        await youtubeNavigationButtons[1].click();

        await page.waitFor(3000);

        let firstTrendingVideo = await page.$('#grid-container > .style-scope.ytd-expanded-shelf-contents-renderer > #dismissable > .text-wrapper.style-scope.ytd-video-renderer > #meta > #title-wrapper> .title-and-badge.style-scope.ytd-video-renderer> #video-title');
        let firstTrendingVideoTitle = await page.$eval('#grid-container > .style-scope.ytd-expanded-shelf-contents-renderer > #dismissable > .text-wrapper.style-scope.ytd-video-renderer > #meta > #title-wrapper> .title-and-badge.style-scope.ytd-video-renderer> #video-title', ele => ele.innerText);
        let firstTrendingVideoViewCount = await page.$eval('#grid-container > .style-scope.ytd-expanded-shelf-contents-renderer > #dismissable > .text-wrapper.style-scope.ytd-video-renderer > #meta > .style-scope.ytd-video-renderer >#metadata > #metadata-line > span.style-scope.ytd-video-meta-block', ele => ele.innerText);

        await firstTrendingVideo.click();

        await page.waitFor(3000);

        let actualTitle = await page.$eval('#primary > #primary-inner >#info >#info-contents > .style-scope.ytd-watch-flexy > #container >.title.style-scope.ytd-video-primary-info-renderer', ele => ele.innerText);
        let actualViewCount = await page.$eval('#primary > #primary-inner >#info >#info-contents > .style-scope.ytd-watch-flexy > #container > #info > #info-text > #count > .style-scope.ytd-video-primary-info-renderer > span.view-count.style-scope.yt-view-count-renderer', ele => ele.innerText);

        firstTrendingVideoTitle = firstTrendingVideoTitle.replace(/[^a-zA-Z0-9]/g, '');
        actualTitle = actualTitle.replace(/[^a-zA-Z0-9]/g, '');

        firstTrendingVideoViewCount = firstTrendingVideoViewCount.replace(/[^a-zA-Z0-9]/g, '');
        actualViewCount = actualViewCount.replace(/[^0-9]/g, '');
        actualViewCount = ((actualViewCount / 1000000) + '').substring(0,2) + 'M';


        expect(firstTrendingVideoTitle).to.be.equal(actualTitle);
        expect(firstTrendingVideoViewCount).to.be.equal(actualViewCount);
    });

    after(async function () {
        await page.close();
    });

});

describe('Video Detail', async () => {
    let page;

    before(async () => {
        page = await browser.newPage();
        await page.goto("https://www.youtube.com/");
        await page.setViewport({width: 1280, height: 800});
    });

    it('check like function without login', async () => {
        const youtubeNavigationButtons = await page.$$('div#guide-content > #guide-inner-content > #guide-renderer > #sections > .style-scope.ytd-guide-renderer > div#items >  .style-scope.ytd-guide-section-renderer > #endpoint ', {visible: true});
        await youtubeNavigationButtons[1].click();
        await page.waitFor(3000);

        let firstTrendingVideo = await page.$('#grid-container > .style-scope.ytd-expanded-shelf-contents-renderer > #dismissable > .text-wrapper.style-scope.ytd-video-renderer > #meta > #title-wrapper> .title-and-badge.style-scope.ytd-video-renderer> #video-title');
        await firstTrendingVideo.click();
        await page.waitFor(3000);

        let likeButton = await page.$('.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer');
        await likeButton.click();

        await page.waitFor(3000);
        await page.$('#contentWrapper > ytd-modal-with-title-and-button-renderer').should.exist;
    });

    after(async function () {
        await page.close();
    });

});
