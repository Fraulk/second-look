export interface SettingState {
    markAsSeen: boolean;
    linkApp: boolean;
    scrollToLastSeen: boolean;
}

export const initialState = {
    markAsSeen: true,
    linkApp: true,
    scrollToLastSeen: true,
}

export const reducer = (state: SettingState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case "markAsSeen":
            return {...state, markAsSeen: action.payload}

        case "linkApp":
            return {...state, linkApp: action.payload}

        case "scrollToLastSeen":
            return {...state, scrollToLastSeen: action.payload}
    
        default:
            return {...state}
    }
}