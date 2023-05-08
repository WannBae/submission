const {nanoid}=require('nanoid');
const book=require('./books');
const getAllBookHandler = () => {
    const books = book.map(({id, name, publisher}) => ({id, name, publisher}));
    const response = {
      status: 'success',
      data: {
        books: books.length > 1 ? books.slice(0, 2) : books,
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

const getBookByIdHandler=(request,h)=>{
    const {bookId}=request.params;
    const books=book.find((b)=>b.id===bookId);
        if(!books){
            const response=h.response({
                status:'fail',
                message:'Buku tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    const response=h.response({
        status:'success',
        data:{
            book,
        },
    });
    response.code(200);
    return response;
};
const editBookByHandler=(request,h)=>{
    const {id}=request.params;
    const {title,tags,body}=request.payload;
    const updatedAt=new Date().toISOString();
    
    const index=notes.findIndex((note)=>note.id===id);
    if(index!==-1){
        notes[index]={
            ...notes[index],title,tags,body,updatedAt,
        };
        const response=h.response({
            status:'success',
            message:'Catatan Berhasil Diperbarui',
        });
        response.code(200);
        return response;
    }
    const response=h.response({
        status:'fail',
        message:'Gagal memperbarui catatan. ID tidak ditemukan',
    });
    response.code(404);
    return response;
};
const deleteBookByidHandler=(request,h)=>{
    const {bookId}=request.params;
    const index=books.findIndex((book)=>book.id===bookId);
    if(index!==-1){
        notes.splice(index,1);
        const response=h.response({
            status:'success',
            message:'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }
    const response=h.response({
        status:'fail',
        message:'Buku gagal dihapus, Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports={addBookHandler, getAllBookHandler, getBookByIdHandler,editBookByHandler,deleteBookByidHandler};