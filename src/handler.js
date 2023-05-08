const {nanoid}=require('nanoid');
const book=require('./books');
const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
        let filteredBooks = book;
    if (name) {
      filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading !== undefined) {
      filteredBooks = filteredBooks.filter(book => book.reading === (reading === '1'));
    }
    if (finished !== undefined) {
      filteredBooks = filteredBooks.filter(book => book.finished === (finished === '1'));
    }
    
    const bookList = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = {
      status: 'success',
      data: {
        books: bookList.length > 3 ? bookList.slice(0, 3) : bookList,
      },
    };
    return response;
  };
  
  const addBookHandler=(request,h)=>{
    const{name,year,author,summary,publisher,pageCount,readPage,reading}=request.payload;
    if(!name){
        const response=h.response({
            status:'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response=h.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    const id=nanoid(16);
    const insertedAt=new Date().toISOString();
    const updatedAt=insertedAt;
    const finished=pageCount===readPage;
    const newBook={id,name,year,author,summary,publisher,pageCount,readPage,finished,reading,insertedAt,updatedAt};
    book.push(newBook);
    const isSuccess = book.filter(book => book.id === id).length > 0;
    if(isSuccess){
        const response=h.response({
            status:'success',
            message:'Buku berhasil ditambahkan',
            data:{
                bookId:id,
            },
        });
        response.code(201);
        return response;
    }
    const response=h.response({
        status:'fail',
        message:'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const selectedBook = book.find((b) => b.id === bookId);
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

    const index = book.findIndex((book) => book.id === bookId);

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
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    book[index] = {
        ...book[index],
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
    const index = book.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      book.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  

module.exports={addBookHandler, getAllBookHandler, getBookByIdHandler,editBookByIdHandler,deleteBookByIdHandler};