export const initialStore = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '';
    const currentUserFormatted = currentUser ? JSON.parse(currentUser) : {};

    console.log(currentUser)
    return {
        message: null,
        currentUser: currentUserFormatted,
        token: token,
        users: [],
        isLogged: !!token,
        bookingsDetail: [],
        hutsDetail: [],
        currentBooking: {},
        reviews: [],
        favorites: []
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'set_hello':
            return { ...store, message: action.payload };

        case 'isLogged':
            return { ...store, isLogged: action.payload };

        case 'token':
            return { ...store, token: action.payload };

        case 'currentUser':
            return { ...store, currentUser: action.payload };

        case 'users':
            return { ...store, users: action.payload };

        case 'bookingsDetail':
            return { ...store, bookingsDetail: action.payload };

        case 'currentBooking':
            return { ...store, currentBooking: action.payload };

        case 'hutsDetail':
            return { ...store, hutsDetail: action.payload };

        case 'favorites':
            return { ...store, favorites: action.payload }

        case 'add_favorites':
            return { ...store, favorites: [...store.favorites, action.payload] }

        case 'remove_favorites':
            return { ...store, favorites: store.favorites.filter(favorite => favorite.id !== action.payload) }

        case 'reviews':
            return { ...store, reviews: [...store.reviews, action.payload] }

        case 'logout':
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            return {
                ...store,
                token: '',
                isLogged: false,
                currentUser: {}
            };
            
        default:
            console.warn(`Unknown action type: ${action.type}`);
            return store;
    }
}
