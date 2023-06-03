const handleModalOnLoad = () => {
    const iframe = document.getElementById("iframe-video");
    const embedurl = localStorage.getItem('embedurl');

    if (embedurl !== null) {
        iframe.setAttribute('src', embedurl);
        const iframeTitle = document.getElementById("iframe-title");
        const title = localStorage.getItem('title');
        if (title) {
            iframeTitle.innerText = title;
        }
        const iframeSubtext = document.getElementById("iframe-subtext");
        const uploaderName = localStorage.getItem('uploaderName');
        const viewCount = localStorage.getItem('viewCount');
        if (uploaderName && viewCount) {

            iframeSubtext.replaceChildren();

            const fragment = document.createDocumentFragment();
            const div1 = document.createElement('div');
            div1.textContent = uploaderName;
            const div2 = document.createElement('div');
            div2.textContent = '.';
            const div3 = document.createElement('div');
            div3.textContent = viewCount;
            
            fragment.append(div1);
            fragment.append(div2);
            fragment.append(div3);
            
            iframeSubtext.append(fragment);
        }
    }

}

const handleVisitButtonClick = (e) => {
    const url = localStorage.getItem('url');
    localStorage.setItem("navigateBackFromModal", "yes");
    window.open(url, "_blank");
    window.open(`./SimpleVideoSearchEngine.html`, "_self");
}

const handleCloseButtonClick = (e) => {
    localStorage.setItem("navigateBackFromModal", "yes");
    window.open(`./SimpleVideoSearchEngine.html`, "_self");
}

document.getElementById("visit-button")?.addEventListener("click", handleVisitButtonClick)
document.getElementById("close-button")?.addEventListener("click", handleCloseButtonClick)