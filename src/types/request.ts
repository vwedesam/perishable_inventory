import type { Request } from "express";

export type Params = {
    item: string;
}

export interface IAddItemRequest extends Request {
    body: {
        quantity: number;
        expiry: number;
    },
    params: Params
}

export interface ISellItemRequest extends Request {
    body: {
        quantity: number;
    },
    params: Params
}

export interface IGetItemQuantityRequest extends Request {
    params: Params
}
