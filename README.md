# BLACKWOOD BARBER — Tbilisi

დასრულებული, responsive, ერთგვერდიანი barbershop-ის დემო საიტი. მხოლოდ **HTML, CSS და Vanilla JavaScript** — framework-ის, build-ის, npm-ის ან backend-ის გარეშე.

**BLACKWOOD BARBER არის fictional demo / portfolio project. ეს არ არის რეალური ბიზნესი.** სახელები, ბარბერები, შეფასებები, მომსახურებები, ფასები, მისამართი და კონტაქტები შექმნილია დემონსტრაციისთვის. ფოტოები ლიცენზირებული stock მასალაა და არ წარმოადგენს რეალურ Blackwood-ის თანამშრომლებს ან სივრცეს.

## რა შედის

- მუქი, premium დიზაინი; responsive განლაგება; დიდი ფოტოები და ლოკალური შრიფტები.
- Sticky navigation, მობილურის hamburger menu, section links და smooth scrolling.
- About, Services & Prices, სამი fictional barber, გალერეა და სამი მკაფიოდ მონიშნული demo review.
- გალერეის lightbox: Previous / Next, კლავიატურის მარცხენა/მარჯვენა ღილაკები, swipe და Escape.
- Booking modal: Name, Phone, Service, Preferred date; ვალიდაცია; demo confirmation.
- გამოგონილი მისამართი, საათები და რუკის სტატიკური ილუსტრაცია.
- Instagram / WhatsApp ღილაკები ხსნის ახსნას, რომ რეალური ანგარიში არ არსებობს.
- Semantic HTML, alt ტექსტები, კლავიატურით მართვა, ფოკუსის დაბრუნება და reduced-motion მხარდაჭერა.
- SEO title/description; WebP ფოტოები; lazy loading; ფოტოების და შრიფტების გარე მოთხოვნები არ არის.

## პროექტის ფაილები

| ფაილი / საქაღალდე | დანიშნულება |
| --- | --- |
| `index.html` | მთავარი გვერდი, პირდაპირ პროექტის root-ში |
| `css/style.css` | ფერები, შრიფტები, responsive დიზაინი და ანიმაციები |
| `js/script.js` | მენიუ, დემო დაჯავშნა, lightbox და social demo ღილაკები |
| `assets/` | ოპტიმიზებული WebP ფოტოები |
| `assets/fonts/` | ლოკალური შრიფტები და OFL ლიცენზიები |
| `CREDITS.md` | ფოტოების წყაროები და ლიცენზიები |
| `.nojekyll` | GitHub Pages-ზე ჩვეულებრივი static ფაილების გამოქვეყნება |

## ლოკალურად გახსნა

1. ჩამოტვირთე და ამოარქივე ZIP.
2. გახსენი `blackwood-barber` საქაღალდე.
3. ორჯერ დააჭირე `index.html`-ს.

ყველა ფოტო და შრიფტი პაკეტშია. გვერდი ინტერნეტის გარეშეც მუშაობს თანამედროვე ბრაუზერში, JavaScript-ის ჩართვით.

სურვილისამებრ გამოიყენე VS Code Live Server, ან ამ საქაღალდეში გაუშვი:

```bash
python -m http.server 8000
```

შემდეგ გახსენი `http://localhost:8000`. Windows-ზე, საჭიროების შემთხვევაში, გამოიყენე `py -m http.server 8000`.

## GitHub Pages-ზე გამოქვეყნება

1. GitHub-ზე შექმენი ახალი **public repository**, მაგალითად `blackwood-barber`.
2. აირჩიე **Add file → Upload files**.
3. ატვირთე ამოარქივებული `blackwood-barber` საქაღალდის **შიგთავსი**: `index.html`, `css`, `js`, `assets`, `README.md`, `CREDITS.md` და `.nojekyll`.
4. დააჭირე **Commit changes**. `index.html` რეპოზიტორიის პირველ დონეზე უნდა ჩანდეს, არა კიდევ ერთ შიდა საქაღალდეში. ZIP-ის ატვირთვა საკმარისი არ არის — საჭიროა ამოარქივებული ფაილები.
5. შედი **Settings → Pages**.
6. **Build and deployment → Source → Deploy from a branch**.
7. აირჩიე **main**, საქაღალდე **/(root)** და დააჭირე **Save**.
8. დაელოდე GitHub-ის გამოქვეყნების დასრულებას. საბოლოო ბმული გამოჩნდება იმავე Pages გვერდზე.

თუ რეპოზიტორიის სახელია `blackwood-barber`, პროექტის მისამართის ფორმატი იქნება `https://YOUR-USERNAME.github.io/blackwood-barber/`.

თუ დამალული `.nojekyll` ფაილი ატვირთვისას ვერ ჩანს, შეგიძლია GitHub-ზე **Add file → Create new file**-ით შექმნა იმავე სახელის ცარიელი ფაილი. სხვა ფაილებისა და საქაღალდეების სახელები არ შეცვალო.

ოფიციალური ინსტრუქცია: [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## როგორ გადაამოწმო

- სცადე გვერდი desktop-ზე და მობილურზე; ჰორიზონტალური scrolling არ უნდა გაჩნდეს.
- მობილურზე გახსენი მენიუ და აირჩიე სექცია; მენიუ დაიხურება.
- დააჭირე მომსახურების ფასს — ფორმაში შესაბამისი სერვისი ავტომატურად აირჩევა.
- შეავსე ფორმა გამოგონილი მონაცემებით: `Alex Demo`, `000 000 000`, სერვისი და დღევანდელი ან მომავალი თარიღი.
- Submit-ის შემდეგ გამოჩნდება **demo confirmation**. რეალური ჯავშანი არ იქმნება.
- ფოტოზე დაჭერისას იხსნება lightbox; სცადე Next / Previous და Escape.
- Instagram / WhatsApp არ ხსნის რეალური ადამიანის პროფილს და არ აგზავნის შეტყობინებას.

## მონაცემები და დემო ქცევა

ფორმას არ აქვს ქსელური მოთხოვნები ან გარე form-service. არ გამოიყენება cookies, localStorage, sessionStorage ან analytics. Submit აჩერებს ნაგულისხმევ მოქმედებას; მონაცემები მხოლოდ ბრაუზერის მეხსიერებაში მოწმდება. სახელისა და ტელეფონის ველები გასუფთავდება დადასტურებისას ან modal-ის დახურვისას. ფორმის `method="dialog"` დამატებით უზრუნველყოფს, რომ მას არ ჰქონდეს ჩვეულებრივი HTTP submission.

`+995 (XXX) XXX XXX` არის დაურეკავი placeholder. `hello@blackwood.example` იყენებს დემოსთვის განკუთვნილ `.example` დომენს. რუკა არის გამოგონილი სქემა; არ აქვს Google Maps embed, tracking ან რეალური კოორდინატები.

## მარტივი ცვლილებები

- ტექსტი, ფასები, საათები და demo labels: `index.html`.
- ფერები: `css/style.css`-ის დასაწყისში `:root` ცვლადები.
- ახალი ფოტო: ჩაანაცვლე შესაბამისი ფაილი `assets/`-ში და განაახლე `alt` ტექსტი და `CREDITS.md`.
- სერვისის სახელის ან ფასის ცვლილებისას განაახლე როგორც Services სექცია, ისე booking ფორმის `<option>` მნიშვნელობები. `data-service` ზუსტად უნდა ემთხვეოდეს შესაბამის `option value`-ს.
- რეალური ბიზნესისთვის გამოყენებისას ყველა გამოგონილი მონაცემი შეცვალე შეთანხმებული ინფორმაციით და რეალური booking ინტეგრაცია ცალკე დაამატე. მიმდინარე პაკეტი განზრახ მხოლოდ დემოა.

## ტექნიკური მოთხოვნები

თანამედროვე Chrome, Edge, Firefox ან Safari. გამოიყენება native `<dialog>`, CSS Grid/Flexbox და IntersectionObserver. ძველ ბრაუზერში ან JavaScript-ის გამორთვისას ძირითადი შიგთავსი და section links ხელმისაწვდომია; booking და lightbox საჭიროებს JavaScript-ს. არ არის runtime dependencies, build command ან საიდუმლო გასაღებები.

## შესრულებული შემოწმება

2026-10-04: Chromium ბრაუზერში გაიარა 36 ფუნქციური და განლაგების შემოწმება. შემოწმდა 320, 390, 768, 1024 და 1440 px სიგანეები; ფოტოებისა და შრიფტების ჩატვირთვა; შიდა ბმულები; მობილური მენიუ; ფორმის ვალიდაცია და confirmation; Escape/ფოკუსის დაბრუნება; lightbox და სოციალური demo ღილაკები. Submit არ ქმნის ქსელურ მოთხოვნას. Safari/Firefox-სა და რეალურ მობილურ მოწყობილობებზე ცალკე ტესტი არ ჩატარებულა.
