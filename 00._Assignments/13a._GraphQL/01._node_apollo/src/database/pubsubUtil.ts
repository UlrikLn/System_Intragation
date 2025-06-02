// Denne fil sætter PubSub utility fra graphql-subscriptions.
// Brugt til at publicere og abonnere på realtidsbegivenheder (som bookAdded).
// Exporteret som en shared pubsub instans for brug på tværs af resolvers.
// Pubsub kobler dine mutationer til dine subscriptioner, så når data ændres, kan lytterne få besked i realtid.
// Det er super nyttigt til fx chats, live dashboards, eller enhver form for live opdatering.
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default pubsub;