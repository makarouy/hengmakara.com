import dynamic from 'next/dynamic';
import projects from '../../../../data/projects.json';

const ProjectDetailClient = dynamic(
  () => import('@/components/sections/ProjectDetailClient')
);

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found | Heng Makara',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Heng Makara Portfolio`,
    description: project.excerpt || project.title,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: [
        {
          url: project.src, // Assuming src is the main image
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default function ProjectDetailPage({ params }) {
  return <ProjectDetailClient slug={params.slug} />;
}


