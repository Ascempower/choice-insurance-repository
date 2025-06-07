# Deployment Guide - Choice Insurance Agency Website

## 🎯 **Quick Start - Fix Your 404 Error**

If you're seeing a 404 error on your current Netlify deployment, follow these steps:

### **Immediate Fix (5 minutes):**
1. **Download** this repository
2. **Delete** your current Netlify site
3. **Drag and drop** this entire folder to Netlify
4. **Your site will work immediately!**

## 🚀 **Deployment Methods**

### **Method 1: Netlify Drag & Drop (Recommended)**

**Perfect for:** Quick deployment, no technical setup required

**Steps:**
1. Download this repository as ZIP
2. Extract to your computer
3. Go to [netlify.com](https://netlify.com) and login
4. Drag the `choice-insurance-repository` folder to the deploy area
5. Site goes live instantly at `https://random-name.netlify.app`

**Pros:**
- ✅ Instant deployment
- ✅ No build process
- ✅ Zero configuration
- ✅ Perfect for testing

### **Method 2: GitHub + Netlify (Professional)**

**Perfect for:** Version control, team collaboration, automatic updates

**Steps:**
1. Create new repository on GitHub
2. Upload these files to your repository
3. Connect repository to Netlify
4. Deploy settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `/`
   - **Branch:** `main`
5. Enable auto-deploy on push

**Pros:**
- ✅ Version control
- ✅ Automatic deployments
- ✅ Team collaboration
- ✅ Backup and history

## ⚙️ **Netlify Configuration**

### **Build Settings:**
```
Build command: (leave empty)
Publish directory: /
Node version: 18 (optional)
```

### **Environment Variables:**
```
JEKYLL_ENV=production (if using Jekyll)
NODE_VERSION=18
```

### **Custom Domain Setup:**
1. Go to Netlify Site Settings
2. Domain Management → Add Custom Domain
3. Add `choiceinsurancehub.com`
4. Configure DNS records with your domain provider
5. Enable HTTPS (automatic with Netlify)

## 🔧 **Files Explained**

### **Core Files:**
- `index.html` - Main website page
- `assets/css/style.css` - All styling and responsive design
- `assets/js/script.js` - Interactive features and Google Tag Manager
- `assets/images/choice-logo.png` - Official Choice Insurance logo

### **Configuration Files:**
- `netlify.toml` - Netlify deployment configuration
- `_redirects` - URL routing and redirect rules
- `.gitignore` - Files to exclude from version control

### **Documentation:**
- `README.md` - Project overview and instructions
- `docs/DEPLOYMENT.md` - This deployment guide

## 🛠️ **Advanced Configuration**

### **Custom Headers (Already Configured):**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"
```

### **Redirect Rules (Already Configured):**
```
# Clean URLs
/about /about.html 200
/contact /contact.html 200
/services /services.html 200

# Fallback
/* /index.html 200
```

## 🔍 **Troubleshooting**

### **404 Errors:**
**Problem:** Site shows "Page not found"
**Solution:** 
- Ensure `_redirects` file is in root directory
- Check publish directory is set to `/`
- Verify all file paths are correct

### **Images Not Loading:**
**Problem:** Logo or images don't appear
**Solution:**
- Check file paths: `assets/images/choice-logo.png`
- Ensure images are uploaded to correct directory
- Verify case-sensitive file names

### **Styles Not Working:**
**Problem:** Site looks unstyled
**Solution:**
- Check CSS path: `assets/css/style.css`
- Clear browser cache
- Verify CSS file was uploaded

### **Google Tag Manager Not Working:**
**Problem:** Analytics not tracking
**Solution:**
- Verify GTM ID: `GTM-PWJPMPC5`
- Check JavaScript is enabled
- Test in incognito mode

## 📊 **Performance Optimization**

### **Already Implemented:**
- ✅ Compressed CSS and JavaScript
- ✅ Optimized images
- ✅ Proper caching headers
- ✅ Minified HTML
- ✅ Google Fonts optimization

### **Netlify Features Used:**
- ✅ Asset optimization
- ✅ Form handling
- ✅ HTTPS enforcement
- ✅ CDN distribution
- ✅ Gzip compression

## 🔒 **Security Features**

### **Headers Configured:**
- **CSP:** Content Security Policy prevents XSS
- **X-Frame-Options:** Prevents clickjacking
- **HSTS:** Forces HTTPS connections
- **X-Content-Type-Options:** Prevents MIME sniffing

### **Best Practices:**
- ✅ No sensitive data in code
- ✅ Secure form handling
- ✅ Input validation
- ✅ HTTPS enforcement

## 📱 **Mobile Optimization**

### **Features:**
- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly navigation
- ✅ Fast loading on mobile networks
- ✅ Optimized images for different screen sizes

### **Testing:**
- Test on actual devices
- Use browser developer tools
- Check Google PageSpeed Insights
- Verify touch interactions work

## 🌐 **Domain Configuration**

### **DNS Records for Custom Domain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5 (Netlify's IP)
```

### **SSL Certificate:**
- Automatically provided by Netlify
- Includes www and non-www versions
- Auto-renewal every 90 days

## 📈 **Analytics Setup**

### **Google Tag Manager (GTM-PWJPMPC5):**
- Already configured in the code
- Tracks page views, clicks, form submissions
- Custom events for insurance-specific actions

### **Recommended Tracking:**
- Quote request button clicks
- Phone number clicks
- Email link clicks
- Service page visits
- Consultation booking attempts

## 🚨 **Emergency Procedures**

### **Site Down:**
1. Check Netlify status page
2. Verify DNS settings
3. Check recent deployments
4. Rollback to previous version if needed

### **Quick Rollback:**
1. Go to Netlify dashboard
2. Site Settings → Deploys
3. Find working deployment
4. Click "Publish deploy"

### **Contact Support:**
- **Netlify Support:** [support.netlify.com](https://support.netlify.com)
- **Technical Issues:** [dev@choiceinsurancehub.com](mailto:dev@choiceinsurancehub.com)

---

**Your Choice Insurance Agency website is now ready for professional deployment!**

