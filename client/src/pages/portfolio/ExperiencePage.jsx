import PortfolioListPage from '../../components/portfolio/PortfolioListPage'
import { portfolioService } from '../../services/portfolioService'
import { Briefcase } from 'lucide-react'

const service = {
  getAll: portfolioService.getExperience,
  create: portfolioService.createExperience,
  update: portfolioService.updateExperience,
  delete: portfolioService.deleteExperience,
}

const fields = [
  { name: 'company', label: 'Company', required: true },
  { name: 'role', label: 'Role / Position', required: true },
  { name: 'duration', label: 'Duration', required: true },
  { name: 'type', label: 'Type', type: 'select', options: ['Internship', 'Full-time', 'Part-time', 'Contract', 'Freelance'] },
  { name: 'description', label: 'Description', rows: 3 },
]

const ExperiencePage = () => <PortfolioListPage title="Experience" service={service} fields={fields} icon={<Briefcase/>} />

export default ExperiencePage
