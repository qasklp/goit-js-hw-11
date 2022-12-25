import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchPhotos } from './fetchPhotos';

const gallery = document.querySelector(".gallery");
const form = document.querySelector("#search-form");
const moreBtn = document.querySelector(".load-more");

let pageNum = 1;
let searchValue = '';

form.addEventListener("submit", onSubmit);
moreBtn.addEventListener("click", onClick);

async function onSubmit(event) {
    event.preventDefault();
    moreBtn.classList.add("is-hidden");
    gallery.innerHTML = '';
    searchValue = event.currentTarget.elements.searchQuery.value;
    pageNum = 1;
    let data = await fetchPhotos(searchValue, pageNum);
    if (data) {
        createMarkup(data);
        moreBtn.classList.remove("is-hidden");
    } else {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
}

async function onClick() {
    pageNum += 1;
    fetchPhotos(searchValue, pageNum)
        .then((data) => {
            createMarkup(data);
            console.log(data);
            if (data.hits.length === 0) {
                moreBtn.classList.add("is-hidden");
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
            }     
        })
        .catch(error => {
            console.log(error);
            moreBtn.classList.add("is-hidden");
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
        });
}

function createMarkup(data) {
    const card = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                    <a class="gallery-link" href="${largeImageURL}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" /></a>
                    <div class="info">
                        <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                        </p>
                        <p class="info-item">
                        <b>Views</b>
                        ${views}
                        </p>
                        <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                        </p>
                        <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                        </p>
                    </div>
                </div>`;
    }).join('');
    gallery.insertAdjacentHTML('beforeend', card);
    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: "alt",
        captionDelay: 250,
    });
}