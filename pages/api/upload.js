import multiparty from "multiparty";

export default async function handle(req, res) {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) =>{
    if(err) throw err;
    console.log(files);
    res.json("ok")
  })
}

export const config = {
  api: { bodyParser: false },
};
