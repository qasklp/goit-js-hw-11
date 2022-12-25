import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchPhotos(name, pageNum) {
    const KEY = "32330894-ccb69e0fba1ba19d2c253cc36";
    const BASE_URL = "https://pixabay.com/api/";
    try {
        return await axios.get(BASE_URL, {
            params: {
                key: `${KEY}`,
                q: `${name}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                per_page: 40,
                page: `${pageNum}`,
            }
        })
            .then(response => {
                if (response.data.totalHits < 40) {
                    moreBtn.classList.add("is-hidden");
                }

                if (response.data.hits === []) {
                    moreBtn.classList.add("is-hidden");
                    
                    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
                }

                if (pageNum === 1 && response.data.totalHits > 0) {

                        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
                    }

                return response.data;
            });
    } catch (error) {
        console.log(error);
    }
}
