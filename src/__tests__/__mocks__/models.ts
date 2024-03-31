import type { InventoryItem, Lot } from "@prisma/client"

const expiry = 10000; // 10 sec

export const mockLot: Lot = {
    id: 1,
    quantity: 4,
    expiry: new Date(Date.now() + expiry),
    itemId: 1,
    createdAt: new Date(),
}

export const mockLots = [
    mockLot,
    {
        ...mockLot,
        quantity: 3,
    }
]

export const mockItem: ( InventoryItem & { lots?: Lot[] } ) = {
    id: 1,
    name: 'foo',
    lots: mockLots,
    createdAt: new Date()
}

export const mockItems = [
    mockItem
]
