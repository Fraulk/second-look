export interface SettingState {
    markAsSeen: boolean;
    linkApp: boolean;
    scrollToLastSeen: boolean;
    openLinkClick: number; // 0 | 1
}

export const initialState = {
    markAsSeen: true,
    linkApp: true,
    scrollToLastSeen: true,
    openLinkClick: 0,
}

export const createInitialState = (initialState: SettingState) => {
    const localeSettings = localStorage.getItem("settings")
    return (localeSettings != null) ? JSON.parse(localeSettings) : initialState
}

const saveCurrentState = (state: SettingState) => {
    localStorage.setItem("settings", JSON.stringify(state))
    return state
}

export const reducer = (state: SettingState, action: {type: string, payload: any}) => {
    switch (action.type) {
        case "markAsSeen":
            return saveCurrentState({...state, markAsSeen: action.payload})

        case "linkApp":
            return saveCurrentState({...state, linkApp: action.payload})

        case "scrollToLastSeen":
            return saveCurrentState({...state, scrollToLastSeen: action.payload})

        case "openLinkClick":
            return saveCurrentState({...state, openLinkClick: action.payload})
    
        default:
            return {...state}
    }
}