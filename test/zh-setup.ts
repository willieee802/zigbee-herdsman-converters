import {Adapter} from "@willieee802/zigbee-herdsman/dist/adapter/adapter";
import {Database} from "@willieee802/zigbee-herdsman/dist/controller/database";
import {Entity} from "@willieee802/zigbee-herdsman/dist/controller/model";
import {beforeEach, vi} from "vitest";

vi.mock("@willieee802/zigbee-herdsman/dist/adapter/adapter", () => ({
    Adapter: {
        create: () => ({}),
    },
}));

vi.mock("@willieee802/zigbee-herdsman/dist/controller/database", () => ({
    Database: {
        open: () => ({
            getEntriesIterator: () => [] as unknown[],
            insert: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
            has: vi.fn(() => false),
            newID: () => 1,
            write: vi.fn(),
            clear: vi.fn(),
        }),
    },
}));

beforeEach(async () => {
    const db = Database.open("noop");
    const adapter = await Adapter.create(
        {
            panID: 1,
            channelList: [11],
        },
        {},
        "noop",
        {
            disableLED: false,
        },
    );

    Entity.injectDatabase(db);
    Entity.injectAdapter(adapter);
});
