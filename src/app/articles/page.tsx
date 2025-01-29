import { Article, getArticles } from "@/src/lib/articles";
import moment from "moment";
import Link from "next/link";
import 'moment/locale/pt-br'
export default async function ArticlesPage() {
  const articles = getArticles();
  const sorted = articles.sort((a, b) => {
    return moment(a.date, "DD-MM-YYYY").isBefore(moment(b.date, "DD-MM-YYYY")) ? 1 : -1;
  });
  return (
    <div className="w-full">
      <h1 className="my-12 font-bold max-sm:text-center">Artigos {process.env.NODE_ENV}</h1>

      <section className="flex flex-col divide-y divide-zinc-400 dark:divide-zinc-700 w-full">
        {sorted.map((article: Article) => (
          <Link
            className="flex sm:items-center flex-col sm:flex-row justify-between w-full py-4 px-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            key={article.id}
            href={`/articles/${article.id}`}
          >
            {article.title}{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              {moment(article.date, "DD-MM-YYYY").locale('pt-br').format("MMMM D, YYYY")}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}