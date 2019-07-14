module.exports = function (app, Book) {
  // GET ALL BOOKS
  app.get('/api/books', async (req, res) => {
    try {
      const books = await Book.find();
      return res.json(books);
    } catch (err) {
      return res.status(500).send({ error: 'database failure' });
    }
  });

  // GET SINGLE BOOK
  app.get('/api/books/:book_id', async (req, res) => {
    try {
      const book = await Book.findOne({ _id: req.params.book_id });
      if (!book) return res.status(404).json({ error: 'book not found' });
      return res.json(book);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  // GET BOOKS BY AUTHOR
  app.get('/api/books/author/:author', async (req, res) => {
    try {
      const books = await Book.find({ author: req.params.author }, { _id: 0, title: 1, published_date: 1 });
      if (books.length === 0) return res.status(404).json({ error: 'book not found' });
      return res.json(books);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

  // CREATE BOOK
  app.post('/api/books', async (req, res) => {
    console.log('request on /api/books');
    var book = new Book();
    book.title = req.body.name;
    book.author = req.body.author;
    book.published_date = new Date(req.body.published_date);

    try {
      await book.save();
      return res.json({ result: 1 });
    } catch (err) {
      console.error(err);
      return res.json({ result: 0 });
    }
  });

  // UPDATE THE BOOK
  app.put('/api/books/:book_id', async (req, res) => {
    let book;
    try {
      book = await Book.findById(req.params.book_id);
      if (!book) return res.status(404).json({ error: 'book not found' });
      if (req.body.title) book.title = req.body.title;
      if (req.body.author) book.author = req.body.author;
      if (req.body.published_date) book.published_date = req.body.published_date;
    } catch (err) {
      return res.status(500).json({ error: 'database failure' });
    }

    try {
      await book.save();
      return res.json({ message: 'book updated' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to update' });
    }
  });

  // DELETE BOOK
  app.delete('/api/books/:book_id', async (req, res) => {
    try {
      const output = await Book.remove({ _id: req.params.book_id });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: "database failure" });
    }
  });
}