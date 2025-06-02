// Defines the Query resolvers for fetching books and authors.
// Supports getting all items or fetching by ID.
// Ansvarlig for at hente bøger og forfattere.
import db from "../database/data.js";

function books(parent: any, args: any, context: any, info: any) {
    return db.books;
}

function book(parent: any, args: any, context: any, info: any) {
    const foundBook = db.books.find((book) => book.id === Number(args.id));
    return foundBook;
}

function author(parent: any, args: any, context: any, info: any) {
    const foundAuthor = db.authors.find((author) => author.id === Number(args.id));
    return foundAuthor
}

export default {
    books,
    book,
    author
};
