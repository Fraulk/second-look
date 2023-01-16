export interface SettingState {
    markAsSeen: boolean;
    linkApp: boolean;
}

export const initialState = {
    markAsSeen: true,
    linkApp: true
}

export const reducer = (state: SettingState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case "markAsSeen":
            return {...state, markAsSeen: action.payload}

        case "linkApp":
            return {...state, linkApp: action.payload}
    
        default:
            return {...state}
    }
}