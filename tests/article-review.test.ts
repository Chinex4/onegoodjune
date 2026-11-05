import assert from "node:assert/strict";
import { test } from "node:test";
import { authorNames, postAuthors } from "../src/lib/editorial-format";
import { shareLinks } from "../src/lib/share";

const author = (name: string) => ({ _id: name, name });

test("articles credit every contributor once, main contributor first", () => {
  const post = {
    author: author("Josiah Favour"),
    additionalAuthors: [
      author("Iheanacho Hannah"),
      author("Josiah Favour"),
      author("Uzoigwe Elizabeth"),
    ],
  };
  assert.equal(postAuthors(post).length, 3);
  assert.equal(
    authorNames(post),
    "Josiah Favour, Iheanacho Hannah, and Uzoigwe Elizabeth",
  );
  assert.equal(authorNames({ author: author("Chidinma Nnalue") }), "Chidinma Nnalue");
  assert.equal(authorNames({ additionalAuthors: null }), "ONEGOODJUNE");
});

test("share links carry the encoded article link", () => {
  const url = "https://onegoodjune.com/pubs/a-b";
  const links = shareLinks(url, "To Be a Writer: How High?");
  const encoded = encodeURIComponent(url);
  assert(links.x.includes(`url=${encoded}`));
  assert(links.x.includes("To%20Be%20a%20Writer%3A%20How%20High%3F"));
  assert(links.facebook.endsWith(`u=${encoded}`));
  assert(links.linkedin.endsWith(`url=${encoded}`));
  assert(links.whatsapp.includes(encoded));
});
