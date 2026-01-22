export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/101098/'],
      },
      sitemap: 'https://hengmakara.com/sitemap.xml',
    }
  }