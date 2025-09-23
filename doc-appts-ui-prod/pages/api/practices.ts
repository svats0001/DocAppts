import { Practice } from "@/app/search/search";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
    let practices: Practice[] = [];
    const data = await fetch("https://localhost:9090/practices",
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || ""
        }}
    );
    practices = await data.json();
    res.status(200).json(practices);
    } catch (err) {
        console.error(err);
    }
}