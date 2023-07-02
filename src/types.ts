export interface Shot {
    id?: number,
    width: number,
    height: number,
    name: string,
    displayName?: string,
    nickname?: string,
    imageUrl: string,
    messageUrl: string,
    createdAt?: number,
}

export interface Author {
    authorNick: string,
    authorid: string,
    authorsAvatarUrl: string,
    flickr: string,
    instagram: string,
    othersocials: string[],
    steam: string,
    twitter: string,
}