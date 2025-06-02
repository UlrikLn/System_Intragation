// Resolver for Author type in GraphQL schema.
// Linker author til deres bøger ved brug af dataen.
import db from "../database/data.js";

const Author = {
    books: (parent: any, args: any, context: any, info: any) => {
        const booksByAuthor = db.books.filter((book) => book.authorId === Number(parent.id));
        return booksByAuthor
    }
};

export default Author;