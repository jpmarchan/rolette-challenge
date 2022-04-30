import { App } from "./app";


async function main(){

    const app = new App(process.env.PORT)
    await app.listent();
}

main();