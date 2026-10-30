import { defineQuery } from "next-sanity";
const fields = `_id,title,"slug":slug.current,excerpt,publishedAt,_updatedAt,mainImage,"text":pt::text(body),author->{_id,name,"slug":slug.current,role,bio,image},category->{_id,title,"slug":slug.current},additionalCategories[]->{_id,title,"slug":slug.current},tags[]->{_id,title,"slug":slug.current}`;
const visible = `_type=="post" && defined(slug.current) && ($preview || (defined(publishedAt) && dateTime(publishedAt)<=dateTime(now())))`;
// A post belongs to its main category and to any "Also appears in" category.
const inCategory = (slug: string) =>
  `(category->slug.current==${slug} || ${slug} in additionalCategories[]->slug.current)`;
const highlight = `(${inCategory(`"newcomer"`)} || ${inCategory(`"spotlight"`)})`;
export const CATEGORIES_QUERY = defineQuery(
  `*[_type=="category" && defined(slug.current)]|order(order asc,title asc){_id,title,"slug":slug.current,description}`,
);
export const MAGAZINE_QUERY = defineQuery(`{
 "latest": *[${visible}]|order(publishedAt desc)[0...4]{${fields}},
 "listing": *[${visible} && ($category=="" || ${inCategory("$category")})]|order(publishedAt desc)[$start...$end]{${fields}},
 "total":count(*[${visible} && ($category=="" || ${inCategory("$category")})]),
 "featured":*[_id=="editorial-settings"][0].featuredPost->{${fields}},
 "hero":coalesce(*[_id=="editorial-settings"][0].heroPosts[]->{${fields}},[]),
 "heroFallback":*[${visible} && !${highlight}]|order(publishedAt desc)[0...5]{${fields}},
 "newcomer":*[${visible} && ${inCategory(`"newcomer"`)}]|order(publishedAt desc)[0...4]{${fields}},
 "spotlight":*[${visible} && ${inCategory(`"spotlight"`)}]|order(publishedAt desc)[0...4]{${fields}},
 "sections":*[_id=="editorial-settings"][0].sections[]{_key,title,"slug":slug.current,
 "posts":select(count(posts)>0=>posts[]->{${fields}}, *[${visible} && (count(coalesce(^.categories,[]))==0 || category._ref in ^.categories[]._ref || count(additionalCategories[@._ref in ^.^.categories[]._ref])>0) && (count(coalesce(^.tags,[]))==0 || count(tags[@._ref in ^.^.tags[]._ref])>0)]|order(publishedAt desc)[0...4]{${fields}})}
}`);
export const POST_QUERY = defineQuery(
  `*[${visible} && slug.current==$slug][0]{${fields},body,author->{_id,name,"slug":slug.current,role,bio,image,links}}`,
);
export const RELATED_QUERY = defineQuery(
  `*[${visible} && slug.current!=$slug && (category._ref==$categoryId || count(tags[@._ref in $tagIds])>0)]|order(publishedAt desc)[0...3]{${fields}}`,
);
export const AUTHOR_QUERY = defineQuery(
  `*[_type=="author" && slug.current==$slug][0]{_id,name,"slug":slug.current,role,bio,image,links,"posts":*[${visible} && author._ref==^._id]|order(publishedAt desc){${fields}}}`,
);
export const AUTHORS_SITEMAP_QUERY = defineQuery(
  `*[_type=="author" && defined(slug.current) && count(*[${visible} && author._ref==^._id])>0]{"slug":slug.current,_updatedAt}`,
);
export const SITEMAP_QUERY = defineQuery(
  `*[${visible}]{"slug":slug.current,_updatedAt}`,
);
