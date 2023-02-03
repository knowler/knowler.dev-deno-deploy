import { DataTypes, Model } from "denodb";

export class Page extends Model {
  static table = "Page";
  static timestamps = true;

  static fields = {
    id: { type: DataTypes.UUID, primaryKey: true },
    slug: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    description: { type: DataTypes.STRING, allowNull: true },
    html: DataTypes.STRING,
    markdown: DataTypes.STRING,
    createdAt: DataTypes.TIMESTAMP,
    updatedAt: DataTypes.TIMESTAMP,
    publishedAt: { type: DataTypes.TIMESTAMP, allowNull: true },
    published: DataTypes.BOOLEAN,
  };

  static defaults = {
    published: false,
  };
}

export class Post extends Model {
  static table = "Post";
  static timestamps = true;

  static fields = {
    id: { type: DataTypes.UUID, primaryKey: true },
    slug: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    description: { type: DataTypes.STRING, allowNull: true },
    html: DataTypes.STRING,
    markdown: DataTypes.STRING,
    createdAt: DataTypes.TIMESTAMP,
    updatedAt: DataTypes.TIMESTAMP,
    publishedAt: { type: DataTypes.TIMESTAMP, allowNull: true },
    published: DataTypes.BOOLEAN,
  };

  static defaults = {
    published: false,
  };
}

export class GardenPost extends Model {
  static table = "GardenPost";
  static timestamps = true;

  static fields = {
    id: { type: DataTypes.UUID, primaryKey: true },
    slug: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    description: { type: DataTypes.STRING, allowNull: true },
    html: DataTypes.STRING,
    markdown: DataTypes.STRING,
    createdAt: DataTypes.TIMESTAMP,
    updatedAt: DataTypes.TIMESTAMP,
  };
}

export class ContactFormSubmission extends Model {
  static table = "ContactFormSubmission";
  static timestamps = true;

  static fields = {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: DataTypes.string(50),
    email: DataTypes.string(50),
    subject: DataTypes.string(50),
    message: DataTypes.string(2000),
    createdAt: DataTypes.TIMESTAMP,
    updatedAt: DataTypes.TIMESTAMP,
    isSpam: DataTypes.BOOLEAN,
  };

  static defaults = {
    name: "Anonymous",
    isSpam: false,
  };
}
