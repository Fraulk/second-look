export interface SettingState {
    markAsSeen: boolean;
    linkApp: boolean;
    scrollToLastSeen: boolean;
    openLinkClick: number; // 0 | 1
    shotCountAtLoad: number;
    gridSize: number;
}

export const initialState = {
    markAsSeen: true,
    linkApp: true,
    scrollToLastSeen: true,
    openLinkClick: 0,
    shotCountAtLoad: 100,
    gridSize: 1
}

const saveCurrentState = (state: SettingState) => {
    localStorage.setItem("settings", JSON.stringify(state))
    return state
}

export const createInitialState = (initialState: SettingState) => {
    const localeSettings = localStorage.getItem("settings")
    const localeSettingsParsed = (localeSettings != null) ? JSON.parse(localeSettings) : []
    // if locale settings == initial settings, no new setting and already saved
    if (Object.keys(localeSettingsParsed).length == Object.keys(initialState).length)
        return localeSettingsParsed
    // if locale settings exists but length is different than initial settings, new settings and saves to locale
    else if (Object.keys(localeSettingsParsed).length > 0 && Object.keys(localeSettingsParsed).length != Object.keys(initialState).length)
        return saveCurrentState({...initialState, ...localeSettingsParsed})
    // no saved settings
    else
        return initialState
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

        case "shotCountAtLoad":
            return saveCurrentState({...state, shotCountAtLoad: action.payload})

        case "gridSize":
            return saveCurrentState({...state, gridSize: action.payload})
    
        default:
            return {...state}
    }
}