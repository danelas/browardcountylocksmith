// Renders a fixture post + index into preview/ so the templates can be
// eyeballed locally without any API keys. Usage: npx tsx scripts/render-fixture.mts
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderBlogPost, renderBlogIndex } from "../src/lib/render.ts";
import type { DraftedPost } from "../src/lib/types.ts";

const post: DraftedPost = {
  title: "Locked Out of Your House? Do This First",
  slug: "fixture-locked-out",
  metaDescription: "Locked out of your house? Stay calm — here are the safest, fastest steps to get back in, and when to call a 24/7 mobile locksmith instead of risking damage.",
  h1: "Locked Out of Your House? Do This First",
  excerpt: "Being locked out is stressful, but don't panic. Here are the safest, fastest steps to regain entry.",
  sections: [
    { heading: "Check every other door and window first", body: "<p>Before anything else, walk the perimeter. A <strong>back door, garage entry, or unlatched window</strong> gets you in free. Most lockouts end here.</p><p>If you rent, call your landlord or property manager — many keep a spare on file and it costs you nothing.</p>" },
    { heading: "Don't force the lock", body: "<p>Credit cards and YouTube tricks usually damage the latch or the door frame, turning a $0 problem into a repair bill. A <em>pin-tumbler deadbolt</em> that's properly installed will not yield to a card anyway.</p><ul><li>No prying with screwdrivers</li><li>No drilling — that destroys the cylinder</li><li>No window breaking; glass costs more than a locksmith</li></ul><p>Read more in our <a href=\"/blog\">guides</a> or jump to <a href=\"/#services\">services</a>.</p>" },
    { heading: "When to call a locksmith", body: "<p>If you're out of options, a mobile locksmith can open most residential locks non-destructively in minutes and quote a flat rate before dispatch.</p>" },
  ],
  faqs: [
    { question: "How long does a house lockout take?", answer: "Most non-destructive entries take 10–20 minutes once the technician arrives." },
    { question: "Will my lock be damaged?", answer: "No — professional entry tools open the lock without harming it in the vast majority of cases." },
    { question: "Should I rekey after a lockout?", answer: "Only if keys were lost or stolen. If you simply left them inside, rekeying is optional." },
    { question: "What does it cost?", answer: "You'll get a flat-rate quote up front before anyone is dispatched, so there are no surprises." },
    { question: "Are you available at night?", answer: "Yes — mobile technicians are dispatched 24/7, including weekends and holidays." },
  ],
  heroImagePrompt: "n/a",
};

const publishedAt = new Date().toISOString();
const outDir = resolve(process.cwd(), "preview", "fixture");
await mkdir(resolve(outDir, "blog", post.slug), { recursive: true });

await writeFile(resolve(outDir, "blog", post.slug, "index.html"), renderBlogPost(post, publishedAt), "utf-8");
await writeFile(
  resolve(outDir, "blog", "index.html"),
  renderBlogIndex([{ topicId: "fixture", slug: post.slug, title: post.title, excerpt: post.excerpt, publishedAt, url: `https://browardcountylocksmith.com/blog/${post.slug}` }]),
  "utf-8",
);
// Pull in the real site css + homepage so relative /styles.css resolves when served.
await copyFile(resolve(process.cwd(), "..", "styles.css"), resolve(outDir, "styles.css"));
await copyFile(resolve(process.cwd(), "..", "index.html"), resolve(outDir, "index.html"));
console.log(`fixture rendered → ${outDir}`);
