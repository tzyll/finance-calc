// Static site pages (About, Contact, Privacy, Terms). Required for ad-network
// approval and trust. Body supports tokens: {{base}} {{siteName}} {{contactEmail}}
// {{updated}} — replaced at build time.

const about = {
  slug: "about",
  title: "About",
  metaDescription:
    "About {{siteName}} — free, fast, no-signup financial calculators and plain-English money guides.",
  body: `
    <h2>What this site is</h2>
    <p>{{siteName}} offers free financial calculators and plain-English guides covering saving, investing, loans, and retirement. Every tool is fast, works on any device, and requires no sign-up. There's no account to create and nothing to install.</p>
    <h2>How the calculators work</h2>
    <p>All calculations run entirely in your browser using standard, published financial formulas — compound interest, loan amortization, the time value of money, and so on. Your inputs are never sent to a server or stored anywhere. We show the formulas and assumptions on each page so you can see exactly how a result is produced.</p>
    <h2>Our approach</h2>
    <p>Personal finance is full of jargon and sales pressure. We aim for the opposite: clear tools and honest explanations that help you make your own decisions. Where a calculator makes simplifying assumptions (for example, ignoring taxes or inflation), we say so.</p>
    <h2>Important</h2>
    <p>{{siteName}} provides general educational information and estimates only. It is not financial, investment, tax, or legal advice. See our <a href="{{base}}/terms/">Terms &amp; Disclaimer</a> for details.</p>
  `,
};

const contact = {
  slug: "contact",
  title: "Contact",
  metaDescription: "Get in touch with {{siteName}} — questions, corrections, and feedback welcome.",
  body: `
    <p>We welcome questions, corrections, and suggestions for new calculators or guides. If you spotted a result that looks off, tell us the inputs you used and what you expected — accuracy matters to us.</p>
    <h2>Email</h2>
    <p>{{contactBlock}}</p>
    <p>We read every message, though we can't provide personalized financial advice — for that, please consult a qualified professional.</p>
  `,
};

const privacy = {
  slug: "privacy",
  title: "Privacy Policy",
  metaDescription:
    "Privacy Policy for {{siteName}}: what data is and isn't collected, how cookies and ads work, and affiliate disclosure.",
  body: `
    <p class="article-meta">Last updated: {{updated}}</p>
    <p>This Privacy Policy explains how {{siteName}} ("we", "us") handles information when you visit this site. We've tried to keep it short and honest.</p>

    <h2>Information we collect</h2>
    <p>We do not ask you to create an account, and we do not collect names, emails, or payment details. The calculators run entirely in your browser — the numbers you type are processed on your device and are not transmitted to us or stored on any server.</p>

    <h2>Cookies and advertising</h2>
    <p>This site may display ads served by third-party networks such as Google AdSense. These vendors may use cookies and similar technologies to serve and measure ads, including personalized ads based on your prior visits to this and other sites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits here and elsewhere on the internet.</p>
    <p>You can opt out of personalized advertising by visiting Google's Ads Settings (myadcenter.google.com), and you can learn about third-party cookie options at aboutads.info. You may also block or delete cookies in your browser settings.</p>

    <h2>Analytics</h2>
    <p>We may use privacy-respecting analytics to understand aggregate, anonymous traffic patterns (for example, which calculators are popular). This does not identify you personally.</p>

    <h2>Affiliate links</h2>
    <p>Some outbound links on this site are affiliate links. If you click one and sign up for or buy a product, we may earn a commission at no extra cost to you. We only place links relevant to the page's topic, and an affiliate relationship never changes a calculator's results.</p>

    <h2>Hosting and third parties</h2>
    <p>The site is hosted on a static-hosting provider, which may log standard request data (such as IP address and browser type) for security and reliability, as is typical for any website.</p>

    <h2>Children</h2>
    <p>This site is intended for a general audience and is not directed at children under 13. We do not knowingly collect personal information from children.</p>

    <h2>Changes</h2>
    <p>We may update this policy from time to time; the "last updated" date above will change accordingly.</p>

    <h2>Contact</h2>
    <p>Questions about this policy? Reach us via our <a href="{{base}}/contact/">Contact page</a>.</p>
  `,
};

const terms = {
  slug: "terms",
  title: "Terms & Disclaimer",
  metaDescription:
    "Terms of use and financial disclaimer for {{siteName}}. Tools provide educational estimates only, not financial advice.",
  body: `
    <p class="article-meta">Last updated: {{updated}}</p>

    <h2>Educational use only — not financial advice</h2>
    <p>{{siteName}} provides free calculators and general information for educational purposes only. Nothing on this site is financial, investment, tax, legal, or other professional advice, and it should not be relied upon as such. Always consult a qualified professional before making financial decisions.</p>

    <h2>Estimates, not guarantees</h2>
    <p>The calculators produce estimates based solely on the inputs you provide and on standard formulas with simplifying assumptions. Real-world outcomes depend on factors the tools may not capture — taxes, fees, inflation, market changes, rounding, and individual circumstances. We do not guarantee the accuracy, completeness, or suitability of any result.</p>

    <h2>No warranty</h2>
    <p>This site is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or reliance on, this site or its calculators.</p>

    <h2>External links</h2>
    <p>We link to third-party sites, some of which are affiliate links (see our <a href="{{base}}/privacy/">Privacy Policy</a>). We are not responsible for the content, products, or practices of third-party websites.</p>

    <h2>Acceptance</h2>
    <p>By using this site, you agree to these terms. If you do not agree, please do not use the site.</p>
  `,
};

export const pages = [about, contact, privacy, terms];
