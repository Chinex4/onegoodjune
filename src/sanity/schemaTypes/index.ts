import { defineArrayMember, defineField, defineType } from "sanity";
const slug = defineField({
  name: "slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (rule) => rule.required(),
});
const editorialImage = defineType({
  name: "editorialImage",
  title: "Editorial image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for readers who cannot see it.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "credit", type: "string" }),
  ],
});
const body = defineType({
  name: "body",
  title: "Article body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
        { title: "Section break (I, II, ★)", value: "h4" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "editorialImage" }),
  ],
});
const author = defineType({
  name: "author",
  title: "Contributors",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Short description",
      description: "Shown under the name, e.g. “Writer & essayist, Lagos”.",
      type: "string",
    }),
    defineField({ name: "image", type: "editorialImage" }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 6 }),
    defineField({ name: "profileHeading", title: "Profile section heading", type: "string", initialValue: "About the contributor" }),
    defineField({ name: "worksHeading", title: "Published works heading", type: "string", initialValue: "Other published works" }),
    defineField({
      name: "links",
      title: "Website and social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "authorLink",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
const category = defineType({
  name: "category",
  title: "Categories",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slug,
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
});
const tag = defineType({
  name: "tag",
  title: "Tags",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slug,
  ],
});
const post = defineType({
  name: "post",
  title: "Posts",
  type: "document",
  fields: [
    defineField({
      name: "seo", title: "Search & sharing (SEO)", type: "object", options: { collapsible: true, collapsed: true },
      description: "Optional overrides. Leave blank to use the article title, excerpt and featured image. These settings do not change the article itself.",
      fields: [
        defineField({ name: "title", title: "Search title", type: "string", description: "Aim for a clear, specific title around 50–60 characters. ONEGOODJUNE is added automatically.", validation: rule => rule.max(70).warning() }),
        defineField({ name: "description", title: "Search description", type: "text", rows: 3, description: "Summarise this particular article naturally, usually around 140–160 characters. Google may show a different snippet.", validation: rule => rule.max(170).warning() }),
        defineField({ name: "image", title: "Sharing image", type: "editorialImage", description: "Optional social-preview image, recommended 1200 × 630 px. Does not replace the article featured image." }),
      ],
    }),
    defineField({ name: "sponsored", title: "Sponsored post", type: "boolean", initialValue: false, description: "Adds a disclosure. Spotlight posts are always labelled automatically, even when this is off." }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    slug,
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "body",
      type: "body",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Featured image",
      description:
        "Optional; a branded placeholder is shown until one is added.",
      type: "editorialImage",
    }),
    defineField({
      name: "category",
      title: "Main category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "additionalCategories",
      title: "Also appears in",
      description:
        "For example Newcomer or Spotlight, alongside the main category.",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "author.name", media: "mainImage" },
  },
});
const editorialSettings = defineType({
  name: "editorialSettings",
  title: "Editorial selections",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Magazine editorial selections",
      readOnly: true,
    }),
    defineField({
      name: "featuredPost",
      title: "Featured article",
      type: "reference",
      to: [{ type: "post" }],
    }),
    defineField({
      name: "heroPosts",
      title: "Hero slider",
      description:
        "Up to five articles for the top of Read Pubs. Leave empty to show the latest articles outside Newcomer and Spotlight.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
      validation: (rule) => rule.unique().max(5),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "editorialSection",
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "slug",
              type: "slug",
              options: {
                source: (_document, context) =>
                  String((context.parent as { title?: string })?.title || ""),
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "categories",
              type: "array",
              of: [{ type: "reference", to: [{ type: "category" }] }],
            }),
            defineField({
              name: "tags",
              type: "array",
              of: [{ type: "reference", to: [{ type: "tag" }] }],
            }),
            defineField({
              name: "posts",
              title: "Curated articles (optional)",
              type: "array",
              description:
                "Curated articles take priority over category/tag selection. For Cozy Corner, choose an article using your readership data; no popularity is fabricated.",
              of: [{ type: "reference", to: [{ type: "post" }] }],
              validation: (rule) => rule.unique().max(4),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
  ],
});
const editorialImageAsset = defineType({
  name: "editorialImageAsset",
  title: "Editorial images",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "editorialImage",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});
const event = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({
      name: "isExample",
      title: "Design example only",
      type: "boolean",
      description:
        "Examples stay in Studio and do not appear on the public website.",
      initialValue: false,
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    slug,
    defineField({
      name: "startsAt",
      title: "Date and time",
      description: "Registration closes automatically when the event starts.",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      description: "For example “Virtual | Zoom” or a venue address.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "admission",
      description: "For example “Free Entry”.",
      type: "string",
      initialValue: "Free Entry",
    }),
    defineField({
      name: "flyer",
      title: "Flyer (landscape)",
      type: "editorialImage",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "question",
      title: "Extra registration question",
      description: "Asked after name and email. Leave empty to skip.",
      type: "string",
      initialValue: "Where are you joining from?",
    }),
    defineField({
      name: "registrationOpen",
      title: "Accept registrations",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Date, newest",
      name: "startsAtDesc",
      by: [{ field: "startsAt", direction: "desc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "startsAt", media: "flyer" } },
});
export const schemaTypes = [
  editorialImage,
  body,
  author,
  category,
  tag,
  post,
  editorialSettings,
  editorialImageAsset,
  event,
];
