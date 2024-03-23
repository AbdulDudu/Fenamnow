import { defineField, defineType } from "sanity";

export default defineType({
  name: "legalDocument",
  title: "Legal Document",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      }
    }),
    defineField({
      name: "meta_description",
      title: "Meta Description",
      type: "text"
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent"
    })
  ],
  preview: {
    select: {
      title: "title"
    }
  }
});
