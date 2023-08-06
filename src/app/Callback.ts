import { HttpResponse } from "@angular/common/http";

export interface CallbackObject {
    next?: (observer: HttpResponse<Object>) => void,
    error?: (observer: HttpResponse<Object>) => void,
    complete?: () => void
}