import projects from '../../data/projects.json';

export default function sitemap() {
  const baseUrl = 'https://hengmakara.com';

  // Static pages
  const routes = [
    '',
    '/about',
    '/services',
    '/works',
    '/contact',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic pages for Projects (Works)
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/works/${project.slug}`,
    lastModified: new Date(project.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}
