import { useEffect, useState } from "react";
import { searchResultMapper } from "./util";
import { ReactComponent as PawxyIcon } from "./images/pawxyicon.svg";
import { ReactComponent as SearchIcon } from "./images/searchicon.svg";

export const SearchPage = () => {
    const [query, setquery] = useState("");
    const [searchResults, setsearchResults] = useState([]);
    const [pageNumber, setpageNumber] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedVideoResult, setselectedVideoResult] = useState(undefined);

    useEffect(() => {
        if (pageNumber > 1 && query !== "") {
            const searchQuery = fetch(
                `https://customsearch.googleapis.com/customsearch/v1?cx=000494ff4625d4884&q=${query}+video+youtube&key=AIzaSyC6WRrGHxh06UBDL5Bp6KcwNrSOsiEhjis&start=${10 * (pageNumber - 1) + 1
                }`
            );
            searchQuery
                .then((response) => response.json())
                .then((resp) => setsearchResults(searchResultMapper(resp)));
        } else if (pageNumber === 1 && query !== "") {
            const searchQuery = fetch(
                `https://customsearch.googleapis.com/customsearch/v1?cx=000494ff4625d4884&q=${query}+video+youtube&key=AIzaSyC6WRrGHxh06UBDL5Bp6KcwNrSOsiEhjis&start=0`
            );
            searchQuery
                .then((response) => response.json())
                .then((resp) => setsearchResults(searchResultMapper(resp)));
        }
    }, [pageNumber]);

    const formatViewCountString = (viewCount) => {
        return viewCount?.length > 7
            ? `${viewCount?.slice(0, 2)} B`
            : viewCount?.length > 5
                ? `${viewCount?.slice(0, 2)} M`
                : viewCount?.length > 3
                    ? `${viewCount?.slice(0, 2)} K`
                    : viewCount;
    };

    return showModal ? (
        renderModal()
    ) : (
        <>
            {renderHeader()}
            {renderSearchBar()}
            {renderSearchResultsList()}
            {renderPagination()}
            {renderGoogleSearchButton()}
        </>
    );

    function renderGoogleSearchButton() {
        return <div className="google-search-wrapper">
            <div className="google-search">
                <button className="google-search-button" onClick={() => { window.open(`https://www.google.com/search?q=${query}`, "_blank"); }}>
                    <SearchIcon /> Search <span className="query">{query}</span> on Google
                </button>
            </div>
        </div>;
    }

    function renderPagination() {
        return <div className="pagination-wrapper">
            <div className="pagination-buttons">
                {pageNumber > 1 && (
                    <button
                        className="prev-button"
                        onClick={() => {
                            setpageNumber(pageNumber - 1);
                        }}
                    >
                        &#8592; Prev
                    </button>
                )}
                {pageNumber > 1 && <div>{pageNumber}</div>}
                <button
                    className="next-button"
                    onClick={() => {
                        setpageNumber(pageNumber + 1);
                    }}
                >
                    Next &#8594;
                </button>
            </div>
        </div>;
    }

    function renderSearchResultsList() {
        return <ul className="video-list">
            {searchResults?.length > 0 &&
                searchResults.map((searchResult, index) => {
                    const {
                        cse_thumbnail, title, person, displayLink, videoobject
                    } = searchResult;
                    const imageURL = cse_thumbnail && cse_thumbnail[0]?.src;
                    const uploaderName = person[0]?.name;
                    const viewCount = formatViewCountString(
                        videoobject[0]?.interactioncount
                    );

                    return (
                        <li key={index} className="video-list-item">
                            <img
                                src={imageURL}
                                alt={`${videoobject?.description}`}
                                onClick={onClickVideoListItem(videoobject, title, person)} />
                            <div
                                className="video-info"
                                onClick={onClickVideoListItem(videoobject, title, person)} >
                                <p>{title}</p>
                                <span className="video-uploader-name">{uploaderName}</span>
                                <div className="video-info-footer">
                                    <span>{displayLink}</span>
                                    <span>{viewCount} views</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
        </ul>;

        function onClickVideoListItem(videoobject, title, person) {
            return (e) => {
                e.preventDefault();
                setShowModal(true);
                setselectedVideoResult({ videoobject, title, person });
            };
        }
    }

    function renderSearchBar() {
        return <div className="search-bar">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search"
                    name="query"
                    value={query}
                    onChange={(e) => {
                        e.preventDefault();
                        setquery(e.target.value);
                    }} />
                <SearchIcon
                    onClick={(e) => {
                        e.preventDefault();
                        const searchQuery = fetch(
                            `https://customsearch.googleapis.com/customsearch/v1?cx=000494ff4625d4884&q=${query}+video+youtube&key=AIzaSyC6WRrGHxh06UBDL5Bp6KcwNrSOsiEhjis&start=0`
                        );
                        searchQuery
                            .then((response) => response.json())
                            .then((resp) => setsearchResults(searchResultMapper(resp)));
                    }}
                    className="search-button" />
            </div>
        </div>;
    }

    function renderHeader() {
        return <div className="header-wrapper">
            <div className="header">
                <PawxyIcon />
                <div className="header-text">Simple Video Search Engine</div>
            </div>
        </div>;
    }

    function renderModal() {
        return <>
            <div className="modal-body">
                <div className="modal-blank" />
                <div className="modal-video">
                    <iframe
                        width="360"
                        height="203"
                        src={selectedVideoResult?.videoobject[0]?.embedurl}
                    ></iframe>
                    <div className="iframe-info">
                        <div className="iframe-title">{selectedVideoResult?.title}</div>
                        <div className="iframe-subtext">
                            <div>{selectedVideoResult?.person[0]?.name}</div>
                            <div>.</div>
                            <div>
                                {formatViewCountString(
                                    selectedVideoResult?.videoobject[0]?.interactioncount
                                )}{" "}
                                views
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="footer-buttons">
                        <button
                            className="visit-button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                                setselectedVideoResult(undefined);
                                window.open(selectedVideoResult?.videoobject[0]?.url, "_blank");
                            }}
                        >
                            Visit
                        </button>
                        <button
                            className="close-button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                                setselectedVideoResult(undefined);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>;
    }
};
