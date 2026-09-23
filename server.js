const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
  },

  year: {
    type: Number,
  },

  available: {
    type: Boolean,
    default: true,
  },
});

const Book = mongoose.model("Book", bookSchema);


// GET - all books
app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


// POST - add book
app.post("/api/books", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// PUT - update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE - delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(process.env.port || 5000, () => {
  console.log(`server running on port ${process.env.port || 5000}`);
});