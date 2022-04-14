declare interface LookupResponse {
    currentName: string;
    uuid: string;
    imageUrls: {
        avatar: string;
        head: string;
        body: string;
        skin: string;
        cape: string;
    }
    pastNames: PastName[];
}

declare interface PastName {
    name: string;
    changedToAt?: number;
}
