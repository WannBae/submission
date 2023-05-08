const {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByHandler, deleteBookByidHandler }=require('./handler');
const routes=[{
    method:'POST',
    path:'/books',
    handler:addBookHandler,
},
{
    method:'GET',
    path:'/books',
    handler:getAllBookHandler,
},
{
    method:'GET',
    path:'/books/{bookId}',
    handler: getBookByIdHandler,
},
{
    method:'PUT',
    path:'/books/{bookId}',
    handler:editBookByHandler,
},
{
    method:'DELETE',
    path:'/books/{bookId}',
    handler:deleteBookByidHandler,
}
];
module.exports=routes;