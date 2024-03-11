export const useParseStatus = (inputStatus: string) => {
    let parsedStatus = inputStatus;
    switch (inputStatus) {
        case "100":
            parsedStatus = "Wacht op beoordeling";
            break;
        case "200":
            parsedStatus = "Afgekeurd";
            break;
        case "300":
            parsedStatus = "Goedgekeurd";
            break;
    }
    return parsedStatus;
}
