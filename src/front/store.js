export const initialStore = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';

    return {
        message: null,
        currentUser: {},
        token: token,
        users: [],
        isLogged: !!token,
        bookingsDetail: [],
        hutsDetail: [],
        favorites: [],
        userProfile: {}
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

        case 'hutsDetail':
            return { ...store, hutsDetail: action.payload };

        case 'add_favorite':
            return {
                ...store,
                favorites: [...store.favorites, action.payload],
                hutsDetail: store.hutsDetail.map(hut =>
                    hut.id === action.payload.hut_id ? { ...hut, is_favorite: true } : hut
                )
            };

        case 'remove_favorite':
            return {
                ...store,
                favorites: store.favorites.filter(fav => fav.hut_id !== action.payload),
                hutsDetail: store.hutsDetail.map(hut =>
                    hut.id === action.payload ? { ...hut, is_favorite: false } : hut
                )
            };

        
        case "userProfile":
            return { ...store, userProfile: action.payload};
            
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
