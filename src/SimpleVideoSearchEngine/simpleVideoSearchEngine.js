
let pageNumber = 1;
let query = '';
const config = {
    googleAPIKey: "AIzaSyC6WRrGHxh06UBDL5Bp6KcwNrSOsiEhjis",
    googleAPISearchEngineId: "000494ff4625d4884"
};

const handleSearchEngineOnLoad = () => {
    const navigateBackFromModal = localStorage.getItem('navigateBackFromModal');
    if (navigateBackFromModal === "yes") {

        const searchQueryResponse = JSON.parse(localStorage.getItem('searchQueryResponse'))
        pageNumber = Number(localStorage.getItem('pageNumber'));
        query = localStorage.getItem('searchQuery');

        const searchInputBox = document.getElementById("query");
        searchInputBox.setAttribute("value", query);
        mapItemsToTheList(searchQueryResponse);
        if (pageNumber > 1) {
            createPaginationElements();
        }

        localStorage.setItem("navigateBackFromModal", "no");
    } else {
        localStorage.clear();
    }
}

const searchResultMapper = (response) => {
    const videoItems = response?.items
        ?.filter((item) => {
            return (
                item.pagemap?.videoobject !== undefined &&
                item.pagemap?.videoobject?.length > 0
            );
        })
        ?.map((item) => {
            const { displayLink, formattedUrl, title, pagemap } = item;
            const { cse_thumbnail, person, videoobject } = pagemap;
            return {
                displayLink,
                formattedUrl,
                title,
                cse_thumbnail,
                person,
                videoobject
            };
        })
        ?.sort((itemA, itemB) => {
            return (
                itemB?.videoobject[0]?.interactioncount -
                itemA?.videoobject[0]?.interactioncount
            );
        });

    return videoItems;
};

const handleQuerySearchClick = (e) => {
    query = document.getElementById('query')?.value;
    if (query) {
        const { googleAPIKey, googleAPISearchEngineId } = config;
        const searchQuery = fetch(
            `https://customsearch.googleapis.com/customsearch/v1?cx=${googleAPISearchEngineId}&q=${query}+video+youtube&key=${googleAPIKey}&start=0`
        );
        searchQuery
            .then((response) => response.json())
            .then((resp) => {
                mapItemsToTheList(searchResultMapper(resp))
                localStorage.setItem("searchQueryResponse", JSON.stringify(searchResultMapper(resp)));
            });
    }
    document.getElementById('google-query').innerHTML = query;
};

const formatViewCountString = (viewCount) => {
    return viewCount?.length > 7
        ? `${viewCount?.slice(0, 2)} B`
        : viewCount?.length > 5
            ? `${viewCount?.slice(0, 2)} M`
            : viewCount?.length > 3
                ? `${viewCount?.slice(0, 2)} K`
                : viewCount;
};

const mapItemsToTheList = (response) => {

    const fragment = document.createDocumentFragment();
    response?.forEach((searchResult, index) => {
        const {
            cse_thumbnail,
            title,
            person,
            displayLink,
            videoobject
        } = searchResult;

        const imageURL = cse_thumbnail && cse_thumbnail[0]?.src;
        const uploaderName = person && person[0]?.name;
        const viewCount = formatViewCountString(
            videoobject[0]?.interactioncount
        );
        const embedurl = videoobject[0]?.embedurl;
        const url = videoobject[0]?.url

        const videoListItem = document.createElement('li');
        videoListItem.setAttribute('id', index);
        videoListItem.setAttribute('class', 'video-list-item');

        const img = document.createElement('img');
        img.setAttribute('src', imageURL);
        img.setAttribute('alt', videoobject?.description);
        img.setAttribute('onclick', `handleVideoClick("${embedurl}", "${title}", "${uploaderName}", "${viewCount}", "${url}")`);
        const div = document.createElement('div');
        div.setAttribute('class', 'video-info');
        div.setAttribute('onclick', `handleVideoClick("${embedurl}", "${title}", "${uploaderName}", "${viewCount}", "${url}")`);

        const p = document.createElement('p');
        p.textContent = title;

        const span = document.createElement('span');
        span.setAttribute('class', 'video-uploader-name');
        span.textContent = uploaderName;

        const div2 = document.createElement('div');
        div2.setAttribute('class', 'video-info-footer');

        const span2 = document.createElement('span');
        span2.textContent = displayLink;

        const span3 = document.createElement('span');
        span3.textContent = viewCount + ' views';

        div2.appendChild(span2);
        div2.appendChild(span3);

        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(div2);

        videoListItem.appendChild(img);
        videoListItem.appendChild(div);

        fragment.appendChild(videoListItem);

    })
    const videoListElement = document.getElementById('video-list');
    if (videoListElement) {
        if (videoListElement.children.length > 0) {
            console.log(videoListElement.children)
            videoListElement.replaceChildren();
            videoListElement.appendChild(fragment);
        } else {
            videoListElement.appendChild(fragment);
        }
        localStorage.setItem('searchQuery', query);
        localStorage.setItem('pageNumber', pageNumber);
    }
};

const handlePagination = () => {
    if (pageNumber === 1 && query !== "") {
        const { googleAPIKey, googleAPISearchEngineId } = config;
        const searchQuery = fetch(
            `https://customsearch.googleapis.com/customsearch/v1?cx=${googleAPISearchEngineId}&q=${query}+video+youtube&key=${googleAPIKey}&start=0`
        );
        searchQuery
            .then((response) => response.json())
            .then((resp) => {
                mapItemsToTheList(searchResultMapper(resp));
                localStorage.setItem("searchQueryResponse", JSON.stringify(searchResultMapper(resp)));

                const pageNumberDiv = document.getElementById("page-number");
                const prevButton = document.getElementById("prev-button");

                if (prevButton && pageNumberDiv) {
                    const paginationDiv = document.getElementById("pagination-buttons");
                    paginationDiv.removeChild(pageNumberDiv);
                    paginationDiv.removeChild(prevButton);
                }

            });
    } else if (pageNumber > 1 && query !== "") {
        const { googleAPIKey, googleAPISearchEngineId } = config;
        const searchQuery = fetch(
            `https://customsearch.googleapis.com/customsearch/v1?cx=${googleAPISearchEngineId}&q=${query}+video+youtube&key=${googleAPIKey}&start=${10 * (pageNumber - 1) + 1}`
        );
        searchQuery
            .then((response) => response.json())
            .then((resp) => {
                mapItemsToTheList(searchResultMapper(resp));
                localStorage.setItem("searchQueryResponse", JSON.stringify(searchResultMapper(resp)));

                if (pageNumber === 2) {
                    const paginationDiv = document.getElementById("pagination-buttons");

                    if (paginationDiv.children.length === 1) {
                        createPaginationElements()
                    } else {
                        changePageNumberDiv();
                    }

                } else if (pageNumber > 2) {
                    changePageNumberDiv();
                }
            });
    }
}

const handleNextButtonClick = (e) => {
    pageNumber++;
    handlePagination()
}

const handlePrevButtonClick = (e) => {
    pageNumber--;
    handlePagination();
}

const createPaginationElements = () => {
    const paginationDiv = document.getElementById("pagination-buttons");

    const prevButton = document.createElement('button');
    prevButton.setAttribute('id', 'prev-button');
    prevButton.setAttribute('class', 'prev-button');
    prevButton.setAttribute('onclick', 'handlePrevButtonClick()');
    prevButton.textContent = `← Prev`;

    const pageNumberDiv = document.createElement('div');
    pageNumberDiv.setAttribute('id', 'page-number');
    pageNumberDiv.textContent = pageNumber;

    paginationDiv.prepend(pageNumberDiv);
    paginationDiv.prepend(prevButton);
}

const changePageNumberDiv = () => {
    if (document.getElementById("page-number")) {
        document.getElementById("page-number").innerText = pageNumber;
    }
}

const handleVideoClick = (embedurl, title, uploaderName, viewCount, url) => {
    localStorage.setItem('embedurl', embedurl);
    localStorage.setItem('title', title);
    localStorage.setItem('uploaderName', uploaderName);
    localStorage.setItem('viewCount', viewCount);
    localStorage.setItem('url', url);

    window.open(`./SimpleVideoModal.html`, "_self");
}

const handleGoogleButtonClick = (e) => {
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
}

document.getElementById("searchButton")?.addEventListener("click", handleQuerySearchClick)
document.getElementById("next-button")?.addEventListener("click", handleNextButtonClick)
document.getElementById("google-search")?.addEventListener("click", handleGoogleButtonClick)


