import * as dayjs from 'dayjs';
import { Nations, Tod } from './types';

export async function fetchTods() {
    return await fetchMockedTodos();
}

async function fetchMockedTodos() {
    const mockedTods: Tod[] = [
        // {
        //     id: generateUUID(),
        //     timestamp: dayjs.default().subtract(120, 'minute').toDate(),
        //     nation: Nations.Sandoria,
        // },
        // {
        //     id: generateUUID(),
        //     timestamp: dayjs.default().subtract(180, 'minute').toDate(),
        //     nation: Nations.Windurst,
        // },
        // {
        //     id: generateUUID(),
        //     timestamp: dayjs.default().add(30, 'minute').toDate(),
        //     nation: Nations.Bastok,
        // },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').add(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').add(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').add(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(5, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(6, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(6, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(7, 'second').toDate(),
            nation: Nations.Kazham,
        },
        {
            id: generateUUID(),
            timestamp: dayjs.default().subtract(30, 'minute').subtract(7, 'second').toDate(),
            nation: Nations.Kazham,
        }
    ]

    // Simulate network latency
    return new Promise<Tod[]>((resolve) => {
        setTimeout(() => {
            resolve(mockedTods)
        }, Math.random() * (5000 - 1000) + 1000);
    });
}

export async function createTod(tod: dayjs.Dayjs, nation: Nations) {
    // Save the TOD to the server
    // await fetch('/api/tod', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         timestamp: tod.toDate(),
    //         nation,
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });

    // Simulate network latency
    return new Promise<Tod>((resolve) => {
        setTimeout(() => {
            resolve({
                id: generateUUID(),
                timestamp: tod.toDate(),
                nation,
            })
        }, Math.random() * (5000 - 1000) + 1000)
    })
}

function generateUUID(): string {
    // Generate 4 random hexadecimal digits for each part of the UUID
    const part1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    const part2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    const part3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    const part4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    // Construct the UUID string
    return `${part1}${part2}-${part3}-${part4}-${part1}${part2}`;
}
