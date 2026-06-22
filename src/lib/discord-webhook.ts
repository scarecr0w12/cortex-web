export function sendBlogWebhook(title: string, slug: string, excerpt: string | null, coverImage: string | null, tags: string[], authorName: string | null) {
  const webhookUrl = process.env.DISCORD_BLOG_WEBHOOK_URL;
  if (!webhookUrl) return;

  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const tagText = tags.length > 0 ? tags.map(t => `\`${t}\``).join(" ") : null;

  const embed: Record<string, unknown> = {
    title,
    url: postUrl,
    color: 0x5865F2,
    timestamp: new Date().toISOString(),
    footer: { text: "CortexPrism Blog" },
  };

  if (excerpt) {
    const truncated = excerpt.length > 500 ? excerpt.slice(0, 497) + "..." : excerpt;
    embed.description = truncated;
  } else {
    embed.description = `Read the full post on the CortexPrism blog: ${postUrl}`;
  }

  if (coverImage) {
    embed.image = { url: coverImage };
  }

  if (authorName) {
    embed.author = { name: authorName };
  }

  if (tagText) {
    embed.fields = [{ name: "Tags", value: tagText, inline: false }];
  }

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  }).catch(() => {});
}

export function sendSubmissionWebhook(type: "plugin" | "agent", name: string, author: string, status: string, id: string) {
  const webhookUrl = process.env.DISCORD_SUBMISSION_WEBHOOK_URL;
  if (!webhookUrl) return;

  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const isPlugin = type === "plugin";
  const color = isPlugin ? 0x9B59B6 : 0x3498DB;
  const emoji = isPlugin ? "🟣" : "🤖";

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: `New ${isPlugin ? "Plugin" : "Agent"} Submission`,
        color,
        fields: [
          { name: "Type", value: `${emoji} ${isPlugin ? "Plugin" : "Agent"}`, inline: true },
          { name: "Name", value: name, inline: true },
          { name: "Author", value: author, inline: true },
          { name: "Status", value: status, inline: true },
          { name: "Review", value: `${siteUrl}/admin/reviews?type=${type}&id=${id}`, inline: false },
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  }).catch(() => {});
}
