let flashElement = document.getElementById('flash-message');
if (flashElement) setFlashMessageFadeOut(flashElement);

let searchButton = document.getElementById('search-button');
if (searchButton) searchButton.onclick = executeSearch;

function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }

            currentOpacity -= 0.05;
            flashMessageElement.style.opacity = currentOpacity;
        }, 75);
    }, 4000);
}

function addFlashFromFrontEnd(message, status) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);

    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');

    if (status === "success") innerFlashDiv.setAttribute('class', 'success-message');
    else if (status === "error") innerFlashDiv.setAttribute('class', 'error-message');
    else innerFlashDiv.setAttribute('class', 'info-message');
    
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function createCard(postData) {
    return `<div class="card" id="post-${postData.id}">
                <img class="card-image" src="${postData.thumbnail}" alt="Missing image"
                 onclick="location.href='/post/${postData.id}'">
                <div class="card-body">
                    <p class="card-title">${postData.title}</p>
                    <p class="card-description">${postData.description}</p>
                </div>
            </div>`;
}

function executeSearch() {
    let searchTerm = document.getElementById('search-input').value;

    if (!searchTerm) {
        location.replace('/');
        return;
    } else if (location.pathname !== '/') {
        // if searching on a page other than the home page, we need to change the CSS
        // to one that supports displaying cards
        document.getElementsByClassName('main-content-container')[0].id = 'card-container-div';
    }
    
    let mainContent = document.getElementById('card-container-div');
    let searchURL = `/posts/search?search=${searchTerm}`;

    fetch(searchURL)
    .then((data) => { return data.json(); })
    .then((data_json) => {
        let newMainContentHTML = '';
        data_json.results.forEach((row) => { newMainContentHTML += createCard(row); });

        mainContent.innerHTML = newMainContentHTML;
        if (data_json.message && data_json.status) addFlashFromFrontEnd(data_json.message, data_json.status);
        else if (data_json.message) addFlashFromFrontEnd(data_json.message, "");
    })
    .catch((err) => console.log(err));
}