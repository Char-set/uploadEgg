module.exports = (options,app) => {

    return async (ctx,next) => {
        console.log('requestPath is:',ctx.request.url,'\nquery is:',JSON.stringify(ctx.request.query),'\nbody is:',JSON.stringify(ctx.request.body));
        await next();
    }
}