import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import createShopifyAuth, { createVerifyRequest, } from '@shopify/koa-shopify-auth';
import webpack from 'koa-webpack';
import graphQLProxy from '@shopify/koa-shopify-graphql-proxy';
import renderReactApp from './render-react-app';

dotenv.config();
const { SHOPIFY_API_KEY, SHOPIFY_SECRET } = process.env;

const app = new Koa();
app.use(session(app));

app.keys = [SHOPIFY_SECRET];

console.log(SHOPIFY_SECRET, SHOPIFY_API_KEY);

app.use(
	createShopifyAuth({
		apiKey: SHOPIFY_API_KEY,
		secret: SHOPIFY_SECRET,
		//our app's permissions 
		//we need to write products to the user's store
		scopes: ['write_products'],
		//our own custom logic after authentication has completed
		afterAuth(ctx) {
			const {shop, accessToken} = ctx.session;

			console.log('We did it!', shop, accessToken);

			ctx.redirect('/');
		},
	}),
);

app.use(graphQLProxy);

app.use(createVerifyRequest());

app.use(webpack());

app.use(renderReactApp);

export default app;
