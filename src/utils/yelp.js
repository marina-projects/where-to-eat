import { yelpData } from "./yelpData";

const apiKey = yelpData.apiKey;
const yelpBaseUrl = 'https://api.yelp.com/v3';

function searchBusiness(term, location, sortBy) {
    const corsOverride = 'https://cors-anywhere.herokuapp.com/'; // Для обхода ограничений CORS во время разработки
    const searchEndpoint = '/businesses/search';
    const georgianCategory = 'georgian'; // Предполагаемый идентификатор для грузинской кухни
    const queryParams = `?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}&categories=${georgianCategory}&sort_by=${sortBy}&limit=18`;
    const urlToFetch = corsOverride + yelpBaseUrl + searchEndpoint + queryParams;

    console.log("URL to Fetch:", urlToFetch);
    console.log("Authorization Header:", `Bearer ${apiKey}`);
    
    return fetch(urlToFetch, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    }).then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Request Failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
        if(jsonResponse.businesses) {
            return jsonResponse.businesses.map(business => ({
                id: business.id,
                imageSrc: business.image_url,
                name: business.name,
                address: business.location.address1,
                city: business.location.city,
                state: business.location.state,
                zipCode: business.location.zip_code,
                category: business.categories[0].title,
                rating: business.rating,
                reviewCount: business.review_count
            }));
        }
    });
}

export default searchBusiness;
