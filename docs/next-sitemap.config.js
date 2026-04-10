/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://i18nizer.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
