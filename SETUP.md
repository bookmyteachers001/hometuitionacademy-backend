# blog-backend — Setup Guide (fixed for Render + MongoDB Atlas)

This is your actual original backend, with a few real bugs fixed so it
runs correctly on Render with your own MongoDB. Your website and
admin dashboard code do **not** need any changes — every endpoint URL
and response shape is unchanged.

## What was actually broken, and what I fixed

1. **Server was hardcoded to port 80** (`config/config.js`) instead of
   reading `process.env.PORT`. Render assigns its own port — with the
   old hardcoded value, Render's health check would never succeed, so
   the service would look "deployed" but never actually come online.
   Fixed to `process.env.PORT || 5000`.

2. **Image uploads depended on a WordPress site you don't control**
   (`image.devloperhemant.com`, needing a `WORDPRESS_APP_PASSWORD` you
   were never given). Replaced with **Cloudinary** (free tier, you
   create your own account and own the images) — same interface, nothing
   else in the code or frontend needed to change. New file:
   `core/ImageCloudinaryController.js`; `routes/media.js` now uses it.

3. **No way to create the first admin login.** The signup API
   explicitly blocks registering as `role: admin` (this is intentional —
   you don't want the public able to self-register as admin). Added
   `scratch/seedAdmin.js` — a script that creates the first admin user
   directly in the database.

4. **A crash bug in the auth check**: if a request came in with no
   `Authorization` header at all, the server threw an unhandled error
   (ugly raw 500) instead of a clean "not logged in" response. Fixed in
   `middleware/authMiddleware.js`.

## 1. MongoDB — you said this is already connected ✅
Just confirm your connection string looks like:
```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/blog?authSource=admin
```
and that Network Access allows connections from anywhere (`0.0.0.0/0`)
so Render can reach it.

## 2. Cloudinary (free) — new, needed for image uploads
1. Sign up free at https://cloudinary.com
2. Go to the Dashboard — copy **Cloud name**, **API Key**, **API Secret**.

## 3. Environment variables — set these on Render
Render dashboard → your service → Environment:
```
MONGODB_CONNECTION_STRING = (your connection string)
JWT_SECRET                = (any long random string)
CLOUDINARY_CLOUD_NAME     = (from Cloudinary)
CLOUDINARY_API_KEY        = (from Cloudinary)
CLOUDINARY_API_SECRET     = (from Cloudinary)
```
`PORT` — don't set this yourself, Render provides it automatically.

Build command: `npm install`
Start command: `npm start`

## 4. Create your first admin login
This has to be run once, with access to your MongoDB — easiest is to
run it from your own computer (it just needs `MONGODB_CONNECTION_STRING`
in a local `.env` file, doesn't need Render running):

```bash
npm install
cp .env.example .env
# paste your MONGODB_CONNECTION_STRING into .env
npm run seed:admin
```
It will ask for a phone number, password, and name — press Enter to
accept the defaults shown in brackets, which match what's already
hardcoded into your dashboard's login form (`signin.jsx`):
```
Admin phone number [8210925188]:
Admin password [12345]:
```
Just press Enter twice to use those, and you'll be able to log into
the dashboard immediately without touching any frontend code. (You can
change these to something real later — just re-run the script with a
different phone number, or edit `signin.jsx` and use the new one.)

## 5. Point both frontend projects at this backend
In **both** the website's and the admin dashboard's Vercel project
settings (Settings → Environment Variables → Production):
```
BACKEND_API_BASE_URL = https://your-render-url.onrender.com
```
Redeploy both (this is a build-time variable).

## 6. Test it
1. Open the admin dashboard → log in with the phone/password from step 4.
2. Create a Category, then a Blog post (Publish toggle ON).
3. Open the website → the blog should appear.
4. Try the contact form / popup on the website → check it shows up
   under Queries in the dashboard.
5. Try uploading a thumbnail image in the blog/service form → it
   should now upload to Cloudinary instead of failing.

If anything errors, send me the exact error message/screenshot the
same way as before and I'll pinpoint it.
