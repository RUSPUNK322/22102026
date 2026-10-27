import Koa from ('Koa');
import bodyParser from 'koa-bodyparser';
import itemRouter from './item/item-router'


//Инициализируем http сервер
const app = new Koa();

app.use(bodyParser());
app.use(itemRouter.routes());
app.use(itemRouter.allowedMethods());

app.listen(3000);