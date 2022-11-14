const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (!name || name === null || name === "") {
    const res = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    res.code(400);
    return res;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.length > 0;

  if (!isSuccess) {
    const res = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    res.code(500);
    return res;
  }

  const res = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  res.code(201);
  return res;
};

const getAllBooksHandler = (req, h) => {
  if (books.length > 0) {
    const res = h.response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: "success",
    data: {
      books,
    },
  });
  res.code(200);
  return res;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const book = books.filter((b) => b.id === id)[0];

  if (!book) {
    const res = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    res.code(404);
    return res;
  }

  const res = h.response({
    status: "success",
    data: {
      book,
    },
  });
  res.code(200);
  return res;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage ? true : false;
  const index = books.findIndex((book) => book.id === id);

  if (!name || name === "" || name === null) {
    const res = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    res.code(400);
    return res;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const res = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  res.code(404);
  return res;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const res = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  res.code(404);
  return res;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
