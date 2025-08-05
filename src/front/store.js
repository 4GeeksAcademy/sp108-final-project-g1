export const initialStore = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    
    return {
        message: null,
        currentUser: {},
        token: token,
        users: [],
        isLogged: !!token,
        userProfile: {}
    };
};

export default function storeReducer(store, action = {}) {
    switch(action.type) {
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
        
        case "userProfile":
            return { ...store, userProfile: action.payload};
            
        case 'logout':
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
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
