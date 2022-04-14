declare namespace Mojang {

    interface Username {
        name: string;
        id: string;
    }

    interface PastNames {
        name: string;
        changedToAt?: number;
    }
}
