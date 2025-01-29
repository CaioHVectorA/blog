import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { remark } from "remark";
import html from "remark-html";
import { highlight } from "sugar-high";

export type Article = {
  id: string;
  title: string;
  date: string;
  active: string;
};

const ARTICLES_DIR = path.join(process.cwd(), "src/articles");
const WIP_DIR = path.join(ARTICLES_DIR, "wip");
export const getArticles = (filter = true) => {
  const fileNames = fs.readdirSync(ARTICLES_DIR);

  const allArticlesData = [];
  for (const fileName of fileNames) {
    const fullPath = path.join(ARTICLES_DIR, fileName);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // is /wip/ folder, read all if filter is false
      const subFileNames = fs.readdirSync(fullPath);
      for (const subFileName of subFileNames) {
        const subFullPath = path.join(fullPath, subFileName);
        const subStat = fs.statSync(subFullPath);
        if (subStat.isDirectory()) {
          continue;
        }
        if (!subFileName.endsWith(".md")) {
          continue;
        }
        const id = subFileName.replace(/\.md$/, "");
        const fileContents = fs.readFileSync(subFullPath, "utf-8");
        const matterResult = matter(fileContents);

        allArticlesData.push({
          id,
          active: matterResult.data.active,
          title: matterResult.data.title,
          date: matterResult.data.date,
        });
      }
    }
    if (!fileName.endsWith(".md")) {
      continue;
    }
    const id = fileName.replace(/\.md$/, "");
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);

    allArticlesData.push({
      id,
      active: matterResult.data.active,
      title: matterResult.data.title,
      date: matterResult.data.date,
    });
  }

  const articlesFilter = filter ? (i: any) => i.active : (i: any) => true;
  console.log(allArticlesData);
  return allArticlesData.filter(articlesFilter).sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const getArticleData = async (id: string) => {
  // check if article is in /wip/ folder
  const wipPath = path.join(WIP_DIR, `${id}.md`);
  if (fs.existsSync(wipPath)) {
    const fileContents = fs.readFileSync(wipPath, "utf-8");
    const matterResult = matter(fileContents);
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
    return {
      id,
      contentHtml,
      title: matterResult.data.title,
      date: moment(matterResult.data.date, "DD-MM-YYYY").format(
        "MMMM Do, YYYY"
      ),
    };
  }
  const fullPath = path.join(ARTICLES_DIR, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do, YYYY"),
  };
};
