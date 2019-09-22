import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
import db from '../backend/db';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, SCOPES } = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [SCOPES],
      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, { httpOnly: false });

        const respond = await db.read(shop);
        if(respond === "ERROR"){
          console.log("ERROR: error while finding this shop in database");
          await handlers.getSubscriptionUrl(ctx, accessToken, shop);
        } else {
          if(respond.app_charges){
            console.log("AppCharges: This shop is already pay charges");
            ctx.redirect("/");
          }else{
            await handlers.getSubscriptionUrl(ctx, accessToken, shop);
          }
        }

      }
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.July19 }));

  router.get("/", verifyRequest(), async ctx => {
    const { acceptCharges, shop } = ctx.session;
    if(acceptCharges) {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
    }else{
      ctx.redirect(`${process.env.HOST}/auth?shop=${shop}`);
    }
  });

  router.get("/appcharges", verifyRequest(), async ctx => {
    const { shop, accessToken } = ctx.session;
    const chargeId = ctx.query.charge_id;
   
    const response = await fetch(`https://${shop}/admin/api/2019-07/recurring_application_charges/${chargeId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      }
    })

    const responseJson = await response.json();
    ctx.session.acceptCharges = true;

    const sendData = { app_charges: true };

    const respond = await db.create(shop, sendData);
    if(respond === "ERROR"){
      console.log("ERROR: unable to save shop charges in database");
    }else{
      console.log("SUCCESS: shop charges are saved in database");
    }
    
    const themes = await fetch(`https://${shop}/admin/themes.json`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      }
    });
    const themesJson = await themes.json();
    const availableThemes = themesJson.themes;

    let flag = true;
    for(var i=0; i < availableThemes.length; i++){
      const theme = availableThemes[i];
      if(theme.role == 'main'){
        if(theme.name.toLowerCase().includes("foxy")){
          
          //ctx.cookies.set("themeId", theme.id, { httpOnly: false });

          const assets = await fetch(`https://${shop}/admin/api/2019-07/themes/${theme.id}/assets.json?asset[key]=config/settings_schema.json`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "X-Shopify-Access-Token": accessToken,
            }
          });
          const assetsJson = await assets.json();
          const assetList = JSON.parse(assetsJson.asset.value);
      
          if(assetList.length < 7) {
            const newData = {
              "name": "Addon",
              "settings":[
                {
                  "type": "header",
                  "content": "Curreny Converter"
                },
                {
                  "type": "checkbox",
                  "id": "currency_converter_enable",
                  "label": "Enable curreny converter",
                  "default": true
                },
                {
                  "type":"checkbox",
                  "id": "currency_converter_location",
                  "label": "Enable Geo Location to convert currency based on user location",
                  "default": true
                },
                {
                  "type": "header",
                  "content": "WishList"
                },
                {
                  "type":"checkbox",
                  "id":"addon_wishlist",
                  "label": "Enable wish list",
                  "default":true
                },
                {
                  "type": "header",
                  "content": "Product Swatches"
                },
                {
                  "type": "checkbox",
                  "id": "addon_product_swatches",
                  "label": "Enable product swatches",
                  "default": false
                },
                {
                  "type": "header",
                  "content": "Buy Now"
                },
                {
                  "type": "checkbox",
                  "id": "addon_product_buy_now",
                  "label": "Enable product Buy Now button",
                  "default": false
                },
                {
                  "type":"header",
                  "content": "Product Reviews"
                },
                {
                  "type":"checkbox",
                  "id":"addon_product_reviews",
                  "label": "Enable reviews on products",
                  "default": true
                }
              ]
            };
        
            assetList.push(newData);
        
            const postData = {
              asset: {
                key: "config/settings_schema.json",
                value: JSON.stringify(assetList)
              }
            };
            const sr = await fetch(`https://${shop}/admin/api/2019-07/themes/73064218696/assets.json`,{
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                "X-Shopify-Access-Token": accessToken,
              },
              body: JSON.stringify(postData)
            });
            const sresponseJson = await sr.json();
          }
          ctx.redirect("/");
          flag = false;
        }
      }
    }

    if(flag){
      ctx.redirect("/installfoxy");
    }
  });

  router.get("*", verifyRequest(), async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
