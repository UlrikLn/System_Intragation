// Defines the Subscription resolver for real-time updates.
// Ansvarlig for real-time opdateringer, når en bog tilføjes.
import pubsub from "../database/pubsubUtil.js";

const Subscription = {
    bookAdded: { subscribe: () => pubsub.asyncIterator('BOOK_ADDED') }
}

export default Subscription;
