import PortfolioListPage from '../../components/portfolio/PortfolioListPage'
import { portfolioService } from '../../services/portfolioService'
import { Code } from 'lucide-react'

const service = {
  getAll: portfolioService.getProjects,
  create: portfolioService.createProject,
  update: portfolioService.updateProject,
  delete: portfolioService.deleteProject,
}

const fields = [
  { name: 'title', label: 'Project Title', required: true },
  { name: 'description', label: 'Description', rows: 3 },
  { name: 'tech', label: 'Technologies (comma separated)' },
  { name: 'image', label: 'Project Image', type: 'file' },
  { name: 'demo', label: 'Demo URL', type: 'url' },
  { name: 'repo', label: 'Repository URL', type: 'url' },
]

const ProjectsPage = () => <PortfolioListPage title="Projects" service={service} fields={fields} icon={<Code/>} />

export default ProjectsPage
