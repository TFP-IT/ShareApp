import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getNewConnection } from "../config/sqlConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imageCdn = 'https://d23e7l64sdrshz.cloudfront.net/';
const videoCdn = 'https://d2pp7no1njx11u.cloudfront.net/';

const indexPath = path.resolve(__dirname, '..', "build", "index.html");

export const getPostDetails = async (req, res, next) => {
  try {
    const postId = req.params.id;

    let sql = `SELECT * FROM posts WHERE id=${postId}`;
    const con = await getNewConnection();

    con.query(sql, function (error, post) {
      if (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
        return next(error);
      }

      if(Array.isArray(post) && post.length>0){
        post = post[0];
      }else{
        return res.status(404).send("Post not found");
      }

      fs.readFile(indexPath, "utf8", (err, htmlData) => {
        if (err) {
          console.error("Error during file reading", err);
          return res.status(404).end();
        }

        // inject meta tags
        htmlData = htmlData
          .replace("<title>React App</title>", `<title>${post.title}</title>`)
          .replace('<script></script>','<script>var timer = setTimeout(function() {window.location="https://hellosuperstars.com/guest_mode/'+postId+'"}, 100);</script>')
          .replace("__META_OG_TITLE__", post.title)
          .replace("__META_OG_DESCRIPTION__", post.details.replace(/<[^>]*>?/gm, ''))
          .replace("__META_DESCRIPTION__", post.details.replace(/<[^>]*>?/gm, ''))
          .replace("__META_OG_IMAGE__", post.video == null? imageCdn+post.banner:imageCdn+post.thumbnail);
        return res.send(htmlData);
      });
    });
  } catch (err) {
    console.log(err.message);
    return next(err);
  }
};
