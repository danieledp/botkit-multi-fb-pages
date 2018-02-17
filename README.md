# botkit-multi-fb-pages
This is a little project, meant to be a proof of concept, on how to deal with multiple Facebook pages using Botkit.

### **The idea**

The idea behind is to use a common webhook for the Facebook payloads and a pool of Botkit instances to do the rest. The common webhook will receive messages and then route them to the proper controller identified by its own url (containing the page-id). Every controller listens on localhost with a url like this:

```
http://localhost:<PORT>/facebook/<PAGE-ID>/receive
```
When the bot receives a message it just let it flow down the pipeline and do the usual processing. It will answer to the right page using the token it was instantiated with.

The following env variables are used:
```
DEBUG= <true|false>
FB_VERIFY_TOKEN= ....
FB_WEBHOOK_PORT= ....
POOL_PORT= ....
```

To give it a try use nginx (or equivalent) as a reverse proxy to expose the webhook endpoint and add a couple of pages in the bots-pool.js. Then run everything with: 
```
nodejs start.js
```

Cheers!
