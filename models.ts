import { DataTypes, Model } from "denodb";
import { v4 } from "https://deno.land/std@0.84.0/uuid/mod.ts";

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
    publishedAt: { type: DataTypes.TIMESTAMP, allowNull: true },
    published: DataTypes.BOOLEAN,
  };

  static defaults = {
    id: () => v4.generate(),
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
    publishedAt: { type: DataTypes.TIMESTAMP, allowNull: true },
    published: DataTypes.BOOLEAN,
  };

  static defaults = {
    id: () => v4.generate(),
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
  };

  static defaults = {
    id: () => v4.generate(),
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
    isSpam: DataTypes.BOOLEAN,
  };

  static defaults = {
    id: () => v4.generate(),
    name: "Anonymous",
    isSpam: false,
  };
}
