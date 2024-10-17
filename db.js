import { MongoClient } from "mongodb";

const url = 'mongodb://okx:Meson.0kx@db.luoga.vip:5278/meson-okx';
const client = new MongoClient(url);

client.connect().then(res => console.log("connected")).catch(err => console.log(err));

const db = client.db("meson-okx");

export default db;