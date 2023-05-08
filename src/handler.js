const { nanoid } = require('nanoid');
const books = require('./books');
const url = require('url');

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = url.parse(request.url, true).query;
  let bookList = [...books];
  if (name) {
    bookList = bookList.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (reading !== undefined) {
    const isReading = reading === '1';
    bookList = bookList.filter((book) => book.reading === isReading);
  }
  if (finished !== undefined) {
    const isFinished = finished === '1';
    bookList = bookList.filter((book) => book.finished === isFinished);
  }
  const response = {
    status: 'success',
    data: {
      books: bookList.length > 3 ? bookList.slice(0, 3) : bookList,
    },
  };
  return response;
};


const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const selectedBook = books.find((book) => book.id === bookId);

  if (!selectedBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: selectedBook,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
const response =h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',});
            response.code(400);
            return response;
        }  
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        };
const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
});
    response.code(200);
    return response;
};
        
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
        if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
            response.code(404);
            return response;
        }
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
            response.code(200);
            return response;
        };
module.exports = { getAllBookHandler, addBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
