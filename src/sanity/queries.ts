import { defineQuery } from "next-sanity";
const fields = `_id,title,"slug":slug.current,excerpt,publishedAt,_updatedAt,mainImage,"text":pt::text(body),author->{_id,name,"slug":slug.current,bio,image},category->{_id,title,"slug":slug.current},tags[]->{_id,title,"slug":slug.current}`;
const visible = `_type=="post" && defined(slug.current) && ($preview || (defined(publishedAt) && dateTime(publishedAt)<=dateTime(now())))`;
export const CATEGORIES_QUERY = defineQuery(
  `*[_type=="category" && defined(slug.current)]|order(order asc,title asc){_id,title,"slug":slug.current,description}`,
);
export const MAGAZINE_QUERY = defineQuery(`{
 "latest": *[${visible}]|order(publishedAt desc)[0...4]{${fields}},
 "listing": *[${visible} && ($category=="" || category->slug.current==$category)]|order(publishedAt desc)[$start...$end]{${fields}},
 "total":count(*[${visible} && ($category=="" || category->slug.current==$category)]),
 "featured":*[_id=="editorial-settings"][0].featuredPost->{${fields}},
 "sections":*[_id=="editorial-settings"][0].sections[]{_key,title,"slug":slug.current,
 "posts":select(count(posts)>0=>posts[]->{${fields}}, *[${visible} && (count(coalesce(^.categories,[]))==0 || category._ref in ^.categories[]._ref) && (count(coalesce(^.tags,[]))==0 || count(tags[@._ref in ^.^.tags[]._ref])>0)]|order(publishedAt desc)[0...4]{${fields}})}
}`);
export const POST_QUERY = defineQuery(
  `*[${visible} && slug.current==$slug][0]{${fields},body}`,
);
export const RELATED_QUERY = defineQuery(
  `*[${visible} && slug.current!=$slug && (category._ref==$categoryId || count(tags[@._ref in $tagIds])>0)]|order(publishedAt desc)[0...3]{${fields}}`,
);
export const SITEMAP_QUERY = defineQuery(
  `*[${visible}]{"slug":slug.current,_updatedAt}`,
);
