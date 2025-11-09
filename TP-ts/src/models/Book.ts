import { Schema, model, Document, CallbackError } from "mongoose";

export enum Status {
  Read = "Read",
  ReRead = "Re-read",
  DNF = "DNF",
  CurrentlyReading = "Currently reading",
  ReturnedUnread = "Returned Unread",
  WantToRead = "Want to read",
}

export enum Format {
  Print = "Print",
  PDF = "PDF",
  EBook = "EBook",
  AudioBook = "AudioBook",
}

export interface IBook extends Document {
  title: string;
  author: string;
  pages: number;
  status: Status;
  price: number;
  pagesRead: number;
  format: Format;
  suggestedBy: string;
  finished: boolean;
  currentlyAt(): number;
  deleteBook(): Promise<void>;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
  status: { type: String, enum: Object.values(Status), required: true },
  price: { type: Number, required: true },
  pagesRead: { type: Number, default: 0 },
  format: { type: String, enum: Object.values(Format), required: true },
  suggestedBy: { type: String, required: true },
  finished: { type: Boolean, default: false },
});

bookSchema.pre("save", function (next) {
  this.finished = this.pagesRead === this.pages;
  next();
});

bookSchema.methods.currentlyAt = function (): number {
  return (this.pagesRead / this.pages) * 100;
};

bookSchema.methods.deleteBook = async function (): Promise<void> {
  await this.deleteOne();
};

export const Book = model<IBook>("Book", bookSchema);
