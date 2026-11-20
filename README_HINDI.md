# BUBBLEDAZE Website — Hindi Setup

Yeh ek responsive brand website hai. Isme Home, Our Story, Products, Contact, product enquiry aur Supabase database integration hai.

## 1. ZIP ko extract karo
ZIP extract karke `bubbledaze-website` folder kholo.

## 2. Supabase database banao
1. https://supabase.com/dashboard kholo aur apna project select karo.
2. Left menu se **SQL Editor** kholo.
3. `supabase/setup.sql` file kholo, poora SQL copy karo aur SQL Editor me paste karo.
4. **Run** dabao. Tables aur security policies ban jayengi.

## 3. Website ko Supabase se connect karo
1. Supabase me **Project Settings → API Keys** ya **Connect** dialog kholo.
2. Project URL copy karo.
3. **Publishable key** copy karo (ye `sb_publishable_` se shuru hoti hai). Legacy anon key bhi compatible hai.
4. Project folder me `config.js` kholo.
5. `supabaseUrl` aur `supabasePublishableKey` ke empty quotes me apni values paste karo.
6. File save karo.

**Important:** `service_role` ya `sb_secret_` key kabhi `config.js`, GitHub ya browser code me mat daalna. Website public publishable key + RLS policies use karti hai.

## 4. GitHub par upload
1. GitHub par naya repository banao, naam `bubbledaze-website` rakh sakte ho.
2. ZIP extract karke folder ke andar ki saari files GitHub repository me upload karo.
3. `config.js` me Supabase URL aur publishable key dalne ke baad commit/push karo.

## 5. Vercel se live karo
1. https://vercel.com/dashboard kholo.
2. **Add New → Project** chuno.
3. GitHub repository import karo.
4. Framework preset **Other** rakho; Build Command blank aur Output Directory `.` rakho.
5. Deploy dabao.

Is project ko build command ki zarurat nahi hai. `index.html` root par hai.

## 6. Data kahan dikhega?
Supabase → Table Editor:
- `products`: website par dikhne wale products
- `contact_messages`: contact form ke messages
- `product_enquiries`: product enquiries

Products add/edit karne ke liye `products` table me row add karo. `is_active` true rakho. `sort_order` se display order set karo. `image_url` me publicly accessible image URL daal sakte ho.

## 7. Test
Website live hone ke baad Contact form se ek test message bhejo. Supabase Table Editor me `contact_messages` kholo. Agar row dikh rahi hai to save working hai.

## Files
- `index.html` — website structure
- `styles.css` — design / mobile responsive styling
- `app.js` — interactions and Supabase connection
- `config.js` — public Supabase project settings (fill this)
- `supabase/setup.sql` — database tables, RLS policies and sample products
- `vercel.json` — Vercel static deployment settings

## Notes
- Website abhi enquiry-based hai; payment gateway / checkout nahi hai.
- Product copy, displayed prices, product weights and claims are placeholders until you confirm actual product details.
- Public visitors can read active products and submit enquiries. They cannot read enquiry records or edit products through the public website. Manage product rows inside Supabase Dashboard.
- Before launch, replace placeholder product images/text and publish only verified product details.
