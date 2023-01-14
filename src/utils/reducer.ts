interface State {
    markAsSeen: boolean;
    linkApp: boolean;
}

const initialState = {
    markAsSeen: true,
    linkApp: true
}

export const reducer = (state: State, action: {type: string, payload: any}) => {
    switch (action.type) {
        case "MARK_AS_SEEN":
            return {...state, markAsSeen: action.payload}
    
        default:
            return {...state}
    }
}