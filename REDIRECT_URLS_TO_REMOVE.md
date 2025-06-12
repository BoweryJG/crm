# Redirect URLs to Remove from Supabase

Go to: https://app.supabase.com/project/cbopynuvhcymbumjnvay/auth/url-configuration

## Remove These URLs:

### YomiStrike URLs (All variants):
- http://yomistrike.com
- www.yomistrike.com
- https://yomistrike.com/index.html
- https://yomistrike.com/
- https://www.yomistrike.com/
- https://yomistrike.com/simulation.html

### AiConsult.beauty URLs:
- https://aiconsult.beauty/*
- https://www.aiconsult.beauty/*

## Keep These URLs:

### RepSpheres Production:
- https://repspheres.com
- https://www.repspheres.com
- https://repspheres.com/*
- https://www.repspheres.com/*
- https://canvas.repspheres.com/*
- https://www.canvas.repspheres.com/*
- https://repspheres.com/auth/
- https://repspheres.com/auth/index.html

### Development:
- http://localhost:3000
- http://localhost:3000/*
- http://localhost:3000/index.html
- http://localhost:3000/simulation.html
- http://localhost:5173/*
- http://127.0.0.1:3000
- http://127.0.0.1:3000/*
- http://127.0.0.1:5173/*

### Netlify Deployments:
- https://*.netlify.app/*
- https://*--aiconsult.netlify.app/* (Can remove this one if not using)

## Steps:
1. Go to the URL Configuration page
2. Find each URL to remove in the list
3. Click the X or delete button next to it
4. Save changes at the bottom of the page
5. Test RepSpheres login still works