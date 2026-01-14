import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Real-world examples showing i18nizer in action with before/after code samples',
}

export default function Examples() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Examples</h1>
      
      <p>
        See how i18nizer transforms your components with real-world examples.
      </p>

      <h2>Basic Component Translation</h2>
      
      <h3>Before</h3>
      <pre><code className="language-tsx">{`export function Login() {
  return (
    <div>
      <h1>Welcome back</h1>
      <p>Please sign in to continue</p>
      <button>Sign in</button>
    </div>
  )
}`}</code></pre>

      <h3>After</h3>
      <pre><code className="language-tsx">{`import { useTranslations } from "next-intl"

export function Login() {
  const t = useTranslations("Login")

  return (
    <div>
      <h1>{t("welcomeBack")}</h1>
      <p>{t("pleaseSignInToContinue")}</p>
      <button>{t("signIn")}</button>
    </div>
  )
}`}</code></pre>

      <h3>Generated JSON (messages/en/login.json)</h3>
      <pre><code className="language-json">{`{
  "Login": {
    "welcomeBack": "Welcome back",
    "pleaseSignInToContinue": "Please sign in to continue",
    "signIn": "Sign in"
  }
}`}</code></pre>

      <h2>Form with Placeholders</h2>
      
      <h3>Before</h3>
      <pre><code className="language-tsx">{`export function ContactForm() {
  return (
    <form>
      <h2>Contact Us</h2>
      <input
        type="text"
        placeholder="Your name"
        aria-label="Name input"
      />
      <input
        type="email"
        placeholder="Email address"
        aria-label="Email input"
      />
      <textarea
        placeholder="Your message"
        aria-label="Message input"
      />
      <button type="submit">Send Message</button>
    </form>
  )
}`}</code></pre>

      <h3>After</h3>
      <pre><code className="language-tsx">{`import { useTranslations } from "next-intl"

export function ContactForm() {
  const t = useTranslations("ContactForm")

  return (
    <form>
      <h2>{t("contactUs")}</h2>
      <input
        type="text"
        placeholder={t("yourName")}
        aria-label={t("nameInput")}
      />
      <input
        type="email"
        placeholder={t("emailAddress")}
        aria-label={t("emailInput")}
      />
      <textarea
        placeholder={t("yourMessage")}
        aria-label={t("messageInput")}
      />
      <button type="submit">{t("sendMessage")}</button>
    </form>
  )
}`}</code></pre>

      <h3>Generated JSON (messages/en/contact-form.json)</h3>
      <pre><code className="language-json">{`{
  "ContactForm": {
    "contactUs": "Contact Us",
    "yourName": "Your name",
    "nameInput": "Name input",
    "emailAddress": "Email address",
    "emailInput": "Email input",
    "yourMessage": "Your message",
    "messageInput": "Message input",
    "sendMessage": "Send Message"
  }
}`}</code></pre>

      <h2>Conditional Rendering</h2>
      
      <h3>Before</h3>
      <pre><code className="language-tsx">{`export function UserStatus({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back, {username}!</p>
      ) : (
        <p>Please log in</p>
      )}
      {isLoggedIn && <button>Log out</button>}
    </div>
  )
}`}</code></pre>

      <h3>After</h3>
      <pre><code className="language-tsx">{`import { useTranslations } from "next-intl"

export function UserStatus({ isLoggedIn, username }) {
  const t = useTranslations("UserStatus")

  return (
    <div>
      {isLoggedIn ? (
        <p>{t("welcomeBackUsername", { username })}</p>
      ) : (
        <p>{t("pleaseLogIn")}</p>
      )}
      {isLoggedIn && <button>{t("logOut")}</button>}
    </div>
  )
}`}</code></pre>

      <h3>Generated JSON (messages/en/user-status.json)</h3>
      <pre><code className="language-json">{`{
  "UserStatus": {
    "welcomeBackUsername": "Welcome back, {username}!",
    "pleaseLogIn": "Please log in",
    "logOut": "Log out"
  }
}`}</code></pre>

      <h2>Complex Component with Multiple Text Types</h2>
      
      <h3>Before</h3>
      <pre><code className="language-tsx">{`export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt="Product image" />
      <h3>{product.name}</h3>
      <p className="price">\${product.price}</p>
      <p className="description">
        {product.inStock ? "In stock" : "Out of stock"}
      </p>
      <button 
        title="Add to shopping cart"
        aria-label="Add to cart"
      >
        Add to Cart
      </button>
    </div>
  )
}`}</code></pre>

      <h3>After</h3>
      <pre><code className="language-tsx">{`import { useTranslations } from "next-intl"

export function ProductCard({ product }) {
  const t = useTranslations("ProductCard")

  return (
    <div className="product-card">
      <img src={product.image} alt={t("productImage")} />
      <h3>{product.name}</h3>
      <p className="price">\${product.price}</p>
      <p className="description">
        {product.inStock ? t("inStock") : t("outOfStock")}
      </p>
      <button 
        title={t("addToShoppingCart")}
        aria-label={t("addToCart")}
      >
        {t("addToCart")}
      </button>
    </div>
  )
}`}</code></pre>

      <h2>Multi-Language Output Example</h2>
      
      <p>When you run:</p>
      <pre><code className="language-bash">i18nizer translate src/components/Welcome.tsx --locales en,es,fr,de</code></pre>

      <h3>messages/en/welcome.json</h3>
      <pre><code className="language-json">{`{
  "Welcome": {
    "welcomeToOurApp": "Welcome to our app",
    "getStarted": "Get started",
    "learnMore": "Learn more"
  }
}`}</code></pre>

      <h3>messages/es/welcome.json</h3>
      <pre><code className="language-json">{`{
  "Welcome": {
    "welcomeToOurApp": "Bienvenido a nuestra aplicación",
    "getStarted": "Comenzar",
    "learnMore": "Aprende más"
  }
}`}</code></pre>

      <h3>messages/fr/welcome.json</h3>
      <pre><code className="language-json">{`{
  "Welcome": {
    "welcomeToOurApp": "Bienvenue dans notre application",
    "getStarted": "Commencer",
    "learnMore": "En savoir plus"
  }
}`}</code></pre>

      <h3>messages/de/welcome.json</h3>
      <pre><code className="language-json">{`{
  "Welcome": {
    "welcomeToOurApp": "Willkommen in unserer App",
    "getStarted": "Loslegen",
    "learnMore": "Mehr erfahren"
  }
}`}</code></pre>

      <h2>Real-World Workflow</h2>
      
      <h3>Step 1: Initialize Project</h3>
      <pre><code className="language-bash">i18nizer start</code></pre>

      <h3>Step 2: Configure API Key</h3>
      <pre><code className="language-bash">i18nizer keys --setOpenAI sk-your-key</code></pre>

      <h3>Step 3: Preview Changes</h3>
      <pre><code className="language-bash">i18nizer translate src/components/Dashboard.tsx --dry-run</code></pre>

      <h3>Step 4: Translate with Multiple Locales</h3>
      <pre><code className="language-bash">i18nizer translate src/components/Dashboard.tsx --locales en,es,fr,de,ja</code></pre>

      <h3>Step 5: Translate Entire Project</h3>
      <pre><code className="language-bash">i18nizer translate --all --locales en,es,fr,de,ja</code></pre>

      <h3>Step 6: Regenerate Aggregator if Needed</h3>
      <pre><code className="language-bash">i18nizer regenerate</code></pre>
    </div>
  )
}
