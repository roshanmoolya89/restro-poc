import dotenv from "dotenv";

dotenv.config();

/** @type {{ [key:string]: import('orval').Options}} */
module.exports = {
  kitchenspurs: {
    input: `${process.env.NEXT_PUBLIC_SWAGGER_URL}`,
    output: {
      target: "./src/api",
      mode: "tags-split",
      client: "fetch",
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      clean: true,
      prettier: true,
      tslint: true,
    },
  },
};
